import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Gives the logged-in browser a short-lived JWT for the Express API.
 * The Express middleware verifies it with the shared JWT_SECRET and then re-reads the role from MongoDB.
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = jwt.sign(
    { email: session.user.email, name: session.user.name, role: session.user.role || "customer" },
    process.env.JWT_SECRET,
    { expiresIn: "1h", subject: String(session.user.id) }
  );
  return NextResponse.json({ token });
}
