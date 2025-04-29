import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function hasRole(
  user: { role: string },
  required: string | string[]
): boolean {
  if (Array.isArray(required)) return required.includes(user.role);
  return user.role === required;
}
