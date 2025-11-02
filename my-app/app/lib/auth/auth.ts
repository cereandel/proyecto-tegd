import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = "lmfao";
const key = new TextEncoder().encode(secret);

async function generateSHA256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

export async function decrypt(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession(request?: NextRequest) {
  try {
    const cookieVal = request
      ? request.cookies.get("session")?.value
      : (await cookies()).get("session")?.value;

    if (!cookieVal) return null;
    return await decrypt(cookieVal);
  } catch (err) {
    // @ts-ignore
    console.error(err?.code ?? err);
    await logOut();
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 60 * 60 * 1000);
  const res = NextResponse.next();
  // @ts-ignore
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function logOut() {
  try {

    const res = NextResponse.json(
      { result: "Sesión Cerrada" },
      { status: 200 }
    );

    res.cookies.delete("session");
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "error brother" }, { status: 500 });
  }
}

export { generateSHA256Hash };
