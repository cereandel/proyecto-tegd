import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/user.model";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, preferences, country, city } = body || {};

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email and password are required" },
        { status: 400 }
      );
    }
    await connectDB();

    const existing = await User.findOne({
      $or: [{ name }, { email }],
    }).exec();
    if (existing) {
      return NextResponse.json(
        { error: "name or email already in use" },
        { status: 409 }
      );
    }

    const createPayload: any = {
      name,
      email,
      password: password,
      country,
      city,
    };
    if (preferences && typeof preferences === "object") {
      createPayload.preferences = preferences;
    }

    const created = await User.create(createPayload);

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: created._id,
          name: created.name,
          email: created.email,
          country: created.country,
          city: created.city,
          preferences: created.preferences,
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
