import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/user.model";
import { generateSHA256Hash } from "@/app/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body || {};

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({
      $or: [{ username }, { email }],
    }).exec();
    if (existing) {
      return NextResponse.json(
        { error: "username or email already in use" },
        { status: 409 }
      );
    }

    const hashed = await generateSHA256Hash(password);

    const created = await User.create({
      username,
      email,
      password: hashed,
    });

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: created._id,
          username: created.username,
          email: created.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
