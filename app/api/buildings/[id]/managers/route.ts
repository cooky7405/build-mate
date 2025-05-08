import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/utils/auth";

const prisma = new PrismaClient();

interface RouteParams {
  id: string;
}

// 특정 빌딩의 관리자 정보 조회
export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await context.params;
    // 인증 확인
    const authResult = await auth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const buildingId = id;

    // 빌딩이 존재하는지 확인
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      include: {
        managers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
        adminManager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
        bizManager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
      },
    });

    if (!building) {
      return NextResponse.json(
        { error: "해당 빌딩을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      managers: building.managers,
      adminManager: building.adminManager,
      bizManager: building.bizManager,
    });
  } catch (error) {
    console.error("빌딩 관리자 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "빌딩 관리자 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 특정 빌딩의 관리자 정보 업데이트
export async function PUT(
  request: Request,
  context: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await context.params;
    // 인증 확인
    const authResult = await auth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // 권한 확인 (슈퍼 관리자와 빌딩 관리자만 허용)
    if (!["SUPER_ADMIN", "BUILDING_ADMIN"].includes(authResult.role || "")) {
      return NextResponse.json(
        { error: "이 작업을 수행할 권한이 없습니다." },
        { status: 403 }
      );
    }

    const buildingId = id;
    const { adminManagerId, bizManagerId, managerIds } = await request.json();

    // 빌딩이 존재하는지 확인
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
    });

    if (!building) {
      return NextResponse.json(
        { error: "해당 빌딩을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 지정된 사용자들이 적절한 역할을 가지고 있는지 확인
    if (adminManagerId) {
      const adminManager = await prisma.user.findUnique({
        where: { id: adminManagerId },
      });
      if (
        !adminManager ||
        !["ADMIN_MANAGER", "BUILDING_ADMIN", "SUPER_ADMIN"].includes(
          adminManager.role
        )
      ) {
        return NextResponse.json(
          { error: "지정된 관리 책임자가 적절한 권한을 가지고 있지 않습니다." },
          { status: 400 }
        );
      }
    }

    if (bizManagerId) {
      const bizManager = await prisma.user.findUnique({
        where: { id: bizManagerId },
      });
      if (
        !bizManager ||
        !["BIZ_MANAGER", "BUILDING_ADMIN", "SUPER_ADMIN"].includes(
          bizManager.role
        )
      ) {
        return NextResponse.json(
          { error: "지정된 경영 책임자가 적절한 권한을 가지고 있지 않습니다." },
          { status: 400 }
        );
      }
    }

    // 빌딩 정보 업데이트
    const updatedBuilding = await prisma.building.update({
      where: { id: buildingId },
      data: {
        adminManagerId: adminManagerId || null,
        bizManagerId: bizManagerId || null,
        managers: managerIds
          ? {
              set: managerIds.map((id: string) => ({ id })),
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
        adminManager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        bizManager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "빌딩 관리자 정보가 성공적으로 업데이트되었습니다.",
      building: updatedBuilding,
    });
  } catch (error) {
    console.error("빌딩 관리자 업데이트 중 오류 발생:", error);
    return NextResponse.json(
      { error: "빌딩 관리자 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
