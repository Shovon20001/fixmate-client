/**
 * FixMate seed script
 *   npm run seed          -> creates demo accounts + services + bookings + payments (skips if data exists)
 *   npm run seed:reset    -> wipes services / bookings / payments first, then seeds again
 *
 * Needs the same .env.local as the app (MONGODB_URI, MONGODB_DB, BETTER_AUTH_SECRET).
 */
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const dir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(dir, "../.env.local") });
dotenv.config({ path: path.join(dir, "../.env") });

if (!process.env.MONGODB_URI || !process.env.BETTER_AUTH_SECRET) {
  console.error("Missing MONGODB_URI or BETTER_AUTH_SECRET in .env.local");
  process.exit(1);
}

const reset = process.argv.includes("--reset");
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || "fixmate");

// A plain BetterAuth instance WITHOUT the sign-up role hook, so the seed can create the admin.
const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: false },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: true },
      area: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },
});

// ---------------------------------------------------------------- users
export const ACCOUNTS = [
  { name: "FixMate Admin", email: "admin@fixmate.dev", password: "Admin@123", role: "admin", phone: "01700000001", area: "Gulshan, Dhaka", bio: "Platform administrator." },
  { name: "Rafiq Ahmed", email: "rafiq.tech@fixmate.dev", password: "Tech@1234", role: "technician", phone: "01711000002", area: "Dhanmondi, Dhaka", bio: "Mobile and laptop repair specialist with 9 years of bench experience. Certified for Apple and Samsung devices." },
  { name: "Nusrat Jahan", email: "nusrat.tech@fixmate.dev", password: "Tech@1234", role: "technician", phone: "01811000003", area: "Mirpur, Dhaka", bio: "Appliance technician covering AC, refrigerators and washing machines. 7 years in home service." },
  { name: "Tanvir Hasan", email: "customer@fixmate.dev", password: "Customer@123", role: "customer", phone: "01911000004", area: "Uttara, Dhaka", bio: "" },
  { name: "Maliha Rahman", email: "maliha@fixmate.dev", password: "Customer@123", role: "customer", phone: "01611000005", area: "Banani, Dhaka", bio: "" },
];

const users = db.collection("user");
for (const a of ACCOUNTS) {
  if (await users.findOne({ email: a.email })) {
    console.log(`= user exists: ${a.email}`);
    continue;
  }
  await auth.api.signUpEmail({ body: { name: a.name, email: a.email, password: a.password, role: a.role, phone: a.phone, area: a.area, bio: a.bio } });
  console.log(`+ user created: ${a.email} (${a.role})`);
}

// ---------------------------------------------------------------- data
const services = db.collection("services");
const bookings = db.collection("bookings");
const payments = db.collection("payments");

if (reset) {
  await Promise.all([services.deleteMany({}), bookings.deleteMany({}), payments.deleteMany({})]);
  console.log("! services, bookings and payments cleared");
} else if ((await services.countDocuments()) > 0) {
  console.log("Services already exist - skipping data seed. Use `npm run seed:reset` to start over.");
  await client.close();
  process.exit(0);
}

const IMG = { Smartphone: "smartphone", "Laptop & PC": "laptop", AC: "ac", Refrigerator: "refrigerator", TV: "tv", "Washing Machine": "washing", Electrical: "electrical" };
const RAFIQ = { technicianName: "Rafiq Ahmed", technicianEmail: "rafiq.tech@fixmate.dev" };
const NUSRAT = { technicianName: "Nusrat Jahan", technicianEmail: "nusrat.tech@fixmate.dev" };
const day = 24 * 60 * 60 * 1000;
const ago = (d, h = 0) => new Date(Date.now() - d * day - h * 3600000);

// [tech, category, title, description, price, duration, mode, area, approval, available]
const rows = [
  [RAFIQ, "Smartphone", "iPhone Screen Replacement", "Original-grade display replacement for iPhone 11 to 15. Includes touch calibration, a 30-day warranty on the panel and a free screen protector.", 85, "2-3 hours", "Shop Drop-off", "Dhanmondi, Dhaka"],
  [RAFIQ, "Smartphone", "Android Battery Replacement", "Swollen or fast-draining battery replaced on Samsung, Xiaomi, Oppo and Vivo phones. Includes a battery health test before and after.", 28, "1-2 hours", "Home Visit", "Dhanmondi, Dhaka"],
  [RAFIQ, "Smartphone", "Charging Port Repair", "Loose or dead charging port cleaned or replaced. We also check the charging IC so the problem does not come back.", 22, "1 hour", "Shop Drop-off", "Mohammadpur, Dhaka"],
  [RAFIQ, "Laptop & PC", "Laptop Servicing and Deep Clean", "Full internal dust cleaning, fresh thermal paste, fan check and a software health scan. Fixes overheating and loud fans.", 35, "3-4 hours", "Home Visit", "Dhanmondi, Dhaka"],
  [RAFIQ, "Laptop & PC", "SSD Upgrade and Windows Install", "Replace a slow hard drive with an SSD, clone your data and install a clean Windows with drivers. SSD cost is quoted separately.", 30, "3 hours", "Shop Drop-off", "Farmgate, Dhaka"],
  [RAFIQ, "Laptop & PC", "Laptop Screen Replacement", "Cracked or flickering laptop display replaced for most major brands. We confirm the panel model before we order it.", 95, "1 day", "Shop Drop-off", "Dhanmondi, Dhaka"],
  [RAFIQ, "TV", "LED TV Backlight Repair", "Dim or dark screen with sound still working? We replace faulty LED strips and test the power board on 32 to 55 inch TVs.", 60, "1 day", "Home Visit", "Mirpur, Dhaka"],
  [RAFIQ, "TV", "Smart TV Software Fix", "Boot loops, frozen apps and update failures fixed through a clean firmware reinstall. No parts needed in most cases.", 25, "1-2 hours", "Home Visit", "Banani, Dhaka"],
  [NUSRAT, "AC", "AC General Servicing", "Indoor and outdoor unit cleaning, filter wash, drain check and cooling performance test for split ACs up to 2 ton.", 30, "2 hours", "Home Visit", "Mirpur, Dhaka"],
  [NUSRAT, "AC", "AC Gas Refill and Leak Check", "Gas pressure check, leak test and R32 or R410A refill. Includes a cooling report before you pay.", 55, "2-3 hours", "Home Visit", "Uttara, Dhaka"],
  [NUSRAT, "Refrigerator", "Refrigerator Not Cooling Repair", "Compressor, thermostat and gas diagnosis for top-freezer and side-by-side fridges. Parts are quoted before any work starts.", 45, "3-4 hours", "Home Visit", "Mirpur, Dhaka"],
  [NUSRAT, "Washing Machine", "Washing Machine Drum and Motor Repair", "Noisy drum, stuck spin cycle or leaking door fixed on front and top loaders. Includes belt and bearing check.", 50, "1 day", "Home Visit", "Banani, Dhaka"],
  [NUSRAT, "Electrical", "Home Wiring and Switchboard Repair", "Tripping breakers, burnt sockets and loose wiring inspected and repaired by a licensed electrician. Safety test included.", 40, "2-3 hours", "Home Visit", "Gulshan, Dhaka"],
  [NUSRAT, "Electrical", "Ceiling Fan and Light Installation", "Install or replace ceiling fans, tube lights and decorative fittings with neat wiring and a full test.", 18, "1-2 hours", "Home Visit", "Uttara, Dhaka"],
  // extra rows so the admin and technician screens show every state
  [NUSRAT, "AC", "AC Installation (Split)", "Wall mounting, copper piping, vacuuming and commissioning of a new split AC. Piping over 10 ft is charged extra.", 70, "4 hours", "Home Visit", "Mirpur, Dhaka", "approved", false],
  [RAFIQ, "Smartphone", "Water Damage Recovery", "Ultrasonic cleaning and board-level repair for phones that fell in water. Success is not guaranteed, so we confirm before charging.", 65, "2 days", "Shop Drop-off", "Dhanmondi, Dhaka", "pending", true],
  [NUSRAT, "Refrigerator", "Fridge Door Seal Replacement", "Worn gasket replaced to stop cold air leaking and cut your electricity bill. Most brands in stock.", 20, "1 hour", "Home Visit", "Mirpur, Dhaka", "rejected", true],
].map(([tech, category, title, description, basePrice, estimatedDuration, serviceMode, serviceArea, approval = "approved", available = true], i) => ({
  _id: new ObjectId(),
  title,
  category,
  description,
  image: `/images/services/${IMG[category]}.svg`,
  basePrice,
  estimatedDuration,
  serviceMode,
  serviceArea,
  ...tech,
  approvalStatus: approval,
  isAvailable: available,
  createdAt: ago(40 - i * 2),
}));

await services.insertMany(rows);
const svc = (title) => rows.find((r) => r.title === title);

const TANVIR = { customerName: "Tanvir Hasan", customerEmail: "customer@fixmate.dev", customerPhone: "01911000004" };
const MALIHA = { customerName: "Maliha Rahman", customerEmail: "maliha@fixmate.dev", customerPhone: "01611000005" };

function booking(customer, title, address, problem, status, daysAgo, { paid = false, finalAmount, history } = {}) {
  const s = svc(title);
  const created = ago(daysAgo);
  const order = ["requested", "accepted", "in-progress", "completed"];
  const path = status === "rejected" ? ["requested", "rejected"] : status === "cancelled" ? ["requested", "cancelled"] : order.slice(0, order.indexOf(status) + 1);
  const statusHistory = path.map((st, i) => ({ status: st, changedAt: new Date(created.getTime() + i * 5 * 3600000) }));
  if (paid) statusHistory.push({ status: "paid", changedAt: new Date(created.getTime() + 30 * 3600000) });
  return {
    _id: new ObjectId(),
    serviceId: String(s._id),
    serviceTitle: s.title,
    serviceImage: s.image,
    category: s.category,
    basePrice: s.basePrice,
    technicianName: s.technicianName,
    technicianEmail: s.technicianEmail,
    ...customer,
    address,
    preferredDate: new Date(created.getTime() + 2 * day),
    problemDescription: problem,
    status,
    finalAmount: status === "completed" ? finalAmount ?? s.basePrice : s.basePrice,
    paymentStatus: paid ? "paid" : "unpaid",
    statusHistory: history || statusHistory,
    createdAt: created,
  };
}

const jobs = [
  booking(TANVIR, "iPhone Screen Replacement", "House 12, Road 5, Sector 7, Uttara", "My iPhone 13 fell and the screen is cracked across the top. Touch still works but the display flickers.", "requested", 0.3),
  booking(MALIHA, "Laptop Servicing and Deep Clean", "Flat 4B, Road 11, Banani", "The laptop gets very hot after ten minutes and the fan is extremely loud. It shuts down while gaming.", "accepted", 2),
  booking(TANVIR, "AC General Servicing", "House 12, Road 5, Sector 7, Uttara", "Bedroom AC is not cooling well and drips water from the indoor unit. It has not been serviced for two years.", "in-progress", 3),
  booking(TANVIR, "LED TV Backlight Repair", "House 12, Road 5, Sector 7, Uttara", "The 43 inch TV has sound but the picture is almost black. A torch shows a faint image on the screen.", "completed", 6, { finalAmount: 68 }),
  booking(TANVIR, "Refrigerator Not Cooling Repair", "House 12, Road 5, Sector 7, Uttara", "The fridge compartment is warm while the freezer works. Food spoiled over the weekend and it clicks every few minutes.", "completed", 35, { paid: true, finalAmount: 52 }),
  booking(MALIHA, "Washing Machine Drum and Motor Repair", "Flat 4B, Road 11, Banani", "The drum makes a loud grinding noise during spin and the machine shakes across the floor on high speed.", "completed", 62, { paid: true, finalAmount: 55 }),
  booking(MALIHA, "Charging Port Repair", "Flat 4B, Road 11, Banani", "The phone only charges when the cable is held at a certain angle. The port feels loose and sometimes disconnects.", "rejected", 9),
  booking(TANVIR, "Laptop Servicing and Deep Clean", "House 12, Road 5, Sector 7, Uttara", "Fan noise and heating problem. Changed my plans for this week so I would like to cancel this request.", "cancelled", 12),
  booking(MALIHA, "AC Gas Refill and Leak Check", "Flat 4B, Road 11, Banani", "Living room AC blows air but the room never gets cold. It was refilled last summer and I suspect a small leak.", "completed", 18, { paid: true, finalAmount: 60 }),
];
await bookings.insertMany(jobs);

const payDocs = jobs
  .filter((j) => j.paymentStatus === "paid")
  .map((j, i) => ({
    bookingId: String(j._id),
    serviceTitle: j.serviceTitle,
    customerName: j.customerName,
    customerEmail: j.customerEmail,
    technicianName: j.technicianName,
    technicianEmail: j.technicianEmail,
    amount: j.finalAmount,
    currency: "usd",
    transactionId: `pi_seed_${String(i + 1).padStart(3, "0")}`,
    stripeSessionId: `cs_test_seed_${String(i + 1).padStart(3, "0")}`,
    paymentStatus: "paid",
    paidAt: j.statusHistory.find((h) => h.status === "paid").changedAt,
  }));
await payments.insertMany(payDocs);

console.log(`+ ${rows.length} services, ${jobs.length} bookings, ${payDocs.length} payments`);
console.log("\nDemo logins");
for (const a of ACCOUNTS) console.log(`  ${a.role.padEnd(10)} ${a.email.padEnd(28)} ${a.password}`);
await client.close();
