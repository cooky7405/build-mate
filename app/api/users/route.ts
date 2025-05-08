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
    const role = authResult.role || "USER";

    // 일반 사용자는 접근 불가
    if (
      ![
        "SUPER_ADMIN",
        "BUILDING_ADMIN",
        "ADMIN_MANAGER",
        "BIZ_MANAGER",
      ].includes(role)
    ) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // URL에서 역할 필터 파라미터 추출
    const url = new URL(request.url);
    const roleFilter = url.searchParams.get("role");

    // 쿼리 조건 설정
    const whereClause: Record<string, unknown> = {
      role: {
        in: [
          "BUILDING_ADMIN",
          "ADMIN_MANAGER",
          "BIZ_MANAGER",
          "BUILDING_MANAGER",
        ],
      },
    };

    // 특정 역할로 필터링
    if (
      roleFilter &&
      [
        "BUILDING_ADMIN",
        "ADMIN_MANAGER",
        "BIZ_MANAGER",
        "BUILDING_MANAGER",
      ].includes(roleFilter)
    ) {
      whereClause.role = roleFilter;
    }

    // 사용자 목록 조회
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        profileImage: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("사용자 목록 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "사용자 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
