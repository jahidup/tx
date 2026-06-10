import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, STUDENT_COOKIE } from "@/lib/session-constants";

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function bytesToBase64Url(bytes: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function verifyJwt(token: string, expectedRole: "admin" | "student") {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return false;

  const secret = process.env.JWT_SECRET || "development-only-change-me";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${payload}`));
  if (bytesToBase64Url(signed) !== signature) return false;

  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
      role?: string;
      exp?: number;
    };
    if (parsed.role !== expectedRole) return false;
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isStudent = pathname === "/student" || pathname.startsWith("/student/");

  if (!isAdmin && !isStudent) {
    return NextResponse.next();
  }

  const role = isAdmin ? "admin" : "student";
  const cookieName = role === "admin" ? ADMIN_COOKIE : STUDENT_COOKIE;
  const loginPath = role === "admin" ? "/admin-login" : "/student-login";
  const token = request.cookies.get(cookieName)?.value;
  const valid = token ? await verifyJwt(token, role) : false;

  if (!valid) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"]
};
