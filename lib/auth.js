import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongodb";

const origins = [process.env.BETTER_AUTH_URL, ...(process.env.TRUSTED_ORIGINS || "").split(",")]
  .map((o) => o?.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: origins,

  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },

  // Optional: Google social login (new Google users become "customer")
  socialProviders: process.env.GOOGLE_CLIENT_ID
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : undefined,

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: true },
      area: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Server-side role validation: anything except customer/technician becomes "customer".
        // Nobody can sign up as admin - the admin is created by the seed script / database.
        before: async (user) => ({
          data: { role: ["customer", "technician"].includes(user.role) ? user.role : "customer" },
        }),
      },
      update: {
        // A user can never change their own role through BetterAuth's update-user endpoint.
        // (Roles are changed by admins through the protected Express API.)
        before: async (data) => (data && "role" in data ? false : { data: {} }),
      },
    },
  },
});
