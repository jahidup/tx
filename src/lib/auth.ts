import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { env, isDatabaseConfigured, isProduction } from "@/lib/env";
import { ADMIN_COOKIE, STUDENT_COOKIE } from "@/lib/session-constants";
import { AdminUser, Student } from "@/models";
import type { SessionPayload, UserRole } from "@/types/platform";

export { ADMIN_COOKIE, STUDENT_COOKIE };

const sevenDays = 60 * 60 * 24 * 7;

export function signSession(payload: SessionPayload, maxAge = sevenDays) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: maxAge });
}

export function verifySession(token?: string | null): SessionPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, env.jwtSecret) as SessionPayload;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest, role: UserRole) {
  const cookieName = role === "admin" ? ADMIN_COOKIE : STUDENT_COOKIE;
  return verifySession(request.cookies.get(cookieName)?.value);
}

export function setSessionCookie(response: NextResponse, role: UserRole, token: string, maxAge = sevenDays) {
  response.cookies.set(role === "admin" ? ADMIN_COOKIE : STUDENT_COOKIE, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge
  });
}

export function clearSessionCookie(response: NextResponse, role: UserRole) {
  response.cookies.set(role === "admin" ? ADMIN_COOKIE : STUDENT_COOKIE, "", {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function verifyAdminCredentials(adminId: string, password: string) {
  if (isDatabaseConfigured()) {
    await connectToDatabase();
    const admin = await AdminUser.findOne({ adminId, status: "active" }).lean();
    if (admin?.passwordHash && (await bcrypt.compare(password, admin.passwordHash))) {
      await AdminUser.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });
      return {
        id: String(admin._id),
        role: "admin" as const,
        adminId: admin.adminId as string,
        name: (admin.name as string) || "Super Admin"
      };
    }
  }

  if (adminId === env.adminId && password === env.adminPassword) {
    return {
      id: "bootstrap-admin",
      role: "admin" as const,
      adminId,
      name: "Super Admin"
    };
  }

  return null;
}

export async function verifyStudentCredentials(rollNumber: string, dob: string) {
  if (isDatabaseConfigured()) {
    await connectToDatabase();
    const student = await Student.findOne({
      rollNumber: rollNumber.toUpperCase(),
      dob,
      status: "active"
    })
      .populate("classId", "className")
      .lean();

    if (student) {
      await Student.updateOne({ _id: student._id }, { $set: { lastLoginAt: new Date() } });
      return {
        id: String(student._id),
        role: "student" as const,
        rollNumber: student.rollNumber as string,
        name: student.name as string
      };
    }
  }

  if (rollNumber.toUpperCase() === "SDP1001" && dob === "15-08-2010") {
    return {
      id: "demo-student",
      role: "student" as const,
      rollNumber: "SDP1001",
      name: "Aarav Sharma"
    };
  }

  return null;
}
