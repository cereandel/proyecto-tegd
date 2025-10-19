import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/user.model";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body || {};

    if ((!email && !username) || !password) {
      return NextResponse.json(
        { error: "email or username and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const query: any = {};
    if (email) query.email = email;
    if (username) query.username = username;

    const user = await User.findOne(query).exec();
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await user.save();

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return NextResponse.json({ ok: true, user: safeUser }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
