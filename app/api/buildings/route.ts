import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

// 건물 목록 조회 API
export async function GET(req: Request) {
  try {
    // 권한 체크 (향후 구현)
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // 기본 쿼리 조건
    let whereClause: any = {};

    // 상태 필터 적용
    if (status && status !== "all") {
      whereClause.status = status;
    }

    // 검색어 필터 적용
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    // 건물 목록 조회
    const buildings = await prisma.building.findMany({
      where: whereClause,
      include: {
        managers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(buildings);
  } catch (error) {
    console.error("건물 목록 조회 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 건물 생성 API
export async function POST(req: Request) {
  try {
    // 권한 체크 (향후 구현)
    // const session = await getServerSession();
    // if (!session || !["SUPER_ADMIN", "BUILDING_ADMIN"].includes(session.user.role)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await req.json();
    const { managers, ...buildingData } = data;

    const building = await prisma.building.create({
      data: {
        ...buildingData,
        managers: managers
          ? {
              connect: managers.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        managers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(building, { status: 201 });
  } catch (error) {
    console.error("건물 생성 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
