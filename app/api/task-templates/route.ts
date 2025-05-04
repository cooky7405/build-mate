import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 업무 템플릿 목록 조회 API
export async function GET(req: Request) {
  try {
    // 권한 체크 (향후 구현)
    // const session = await getServerSession();
    // if (!session || !["SUPER_ADMIN", "BUILDING_ADMIN", "ADMIN_MANAGER", "BIZ_MANAGER"].includes(session.user.role)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const managerType = searchParams.get("managerType");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // 기본 쿼리 조건
    const whereClause: Record<string, unknown> = {};

    // 관리자 유형 필터 적용
    if (managerType && ["ADMIN", "BIZ", "BOTH"].includes(managerType)) {
      whereClause.managerType = managerType;
    }

    // 카테고리 필터 적용
    if (category) {
      whereClause.category = category;
    }

    // 검색어 필터 적용
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // 업무 템플릿 목록 조회
    const taskTemplates = await prisma.taskTemplate.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(taskTemplates);
  } catch (error) {
    console.error("업무 템플릿 목록 조회 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 업무 템플릿 생성 API
export async function POST(req: Request) {
  try {
    // 권한 체크 (향후 구현)
    // const session = await getServerSession();
    // if (!session || !["SUPER_ADMIN", "BUILDING_ADMIN"].includes(session.user.role)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await req.json();

    // 필수 필드 검증
    if (!data.title || !data.description || !data.category) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다" },
        { status: 400 }
      );
    }

    const taskTemplate = await prisma.taskTemplate.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        managerType: data.managerType || "ADMIN",
        category: data.category,
      },
    });

    return NextResponse.json(taskTemplate, { status: 201 });
  } catch (error) {
    console.error("업무 템플릿 생성 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
