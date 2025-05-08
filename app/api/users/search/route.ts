import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 인증 확인
    const authResult = await auth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // 사용자 역할 확인
    let role = authResult.role;
    if (!role) role = "USER";
    if (!["SUPER_ADMIN", "BUILDING_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // URL에서 검색어 파라미터 추출
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("q") || "";

    // 최소 2글자 이상 입력 필요
    if (searchTerm.length < 2) {
      return NextResponse.json({ users: [] });
    }

    // 사용자 검색 (이름 또는 이메일에 검색어 포함)
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ],
        role: {
          in: [
            "BUILDING_ADMIN",
            "ADMIN_MANAGER",
            "BIZ_MANAGER",
            "BUILDING_MANAGER",
          ],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        profileImage: true,
      },
      take: 10, // 결과 제한
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("사용자 검색 중 오류 발생:", error);
    return NextResponse.json(
      { error: "사용자 검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
