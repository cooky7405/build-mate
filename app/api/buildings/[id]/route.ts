import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 건물 상세 조회 API
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const building = await prisma.building.findUnique({
      where: { id },
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

    if (!building) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(building);
  } catch (error) {
    console.error("건물 상세 조회 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 건물 수정 API
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await req.json();
    const { managers, ...buildingData } = data;

    // 건물 존재 여부 확인
    const existingBuilding = await prisma.building.findUnique({
      where: { id },
    });

    if (!existingBuilding) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    // 건물 정보 수정
    const updatedBuilding = await prisma.building.update({
      where: { id },
      data: {
        ...buildingData,
        managers: managers
          ? {
              set: [], // 기존 관계 초기화
              connect: managers.map((managerId: string) => ({ id: managerId })),
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

    return NextResponse.json(updatedBuilding);
  } catch (error) {
    console.error("건물 정보 수정 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 건물 삭제 API
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // 건물 존재 여부 확인
    const existingBuilding = await prisma.building.findUnique({
      where: { id },
    });

    if (!existingBuilding) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    // 건물 삭제
    await prisma.building.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Building deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("건물 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
