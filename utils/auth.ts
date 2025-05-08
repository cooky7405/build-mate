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

export async function auth(request: Request): Promise<{
  success: boolean;
  userId?: string;
  role?: string;
  error?: string;
  status?: number;
}> {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, error: "인증 토큰이 필요합니다.", status: 401 };
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return {
        success: false,
        error: "유효하지 않은 토큰입니다.",
        status: 401,
      };
    }

    return { success: true, userId: user.userId, role: user.role };
  } catch {
    return {
      success: false,
      error: "인증 처리 중 오류가 발생했습니다.",
      status: 500,
    };
  }
}
