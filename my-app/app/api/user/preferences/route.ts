import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/user.model";
import { getSession } from "@/app/lib/auth/auth";

export async function PATCH(request: NextRequest) {
  try {

    const session: any = await getSession();
    const userId = session?.safeUser?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body || {};
    if (!preferences || typeof preferences !== "object") {
      return NextResponse.json(
        { error: "preferences are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true }
    ).exec();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { ok: true, preferences: updated.preferences },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update preferences error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
