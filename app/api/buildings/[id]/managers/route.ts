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
    console.log("[PUT /api/buildings/[id]/managers] buildingId:", id);
    // 인증 확인
    const authResult = await auth(request);
    console.log("[PUT /api/buildings/[id]/managers] authResult:", authResult);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // 권한 확인 (슈퍼 관리자와 빌딩 관리자만 허용)
    if (!["SUPER_ADMIN", "BUILDING_ADMIN"].includes(authResult.role || "")) {
      console.log(
        "[PUT /api/buildings/[id]/managers] 권한 없음:",
        authResult.role
      );
      return NextResponse.json(
        { error: "이 작업을 수행할 권한이 없습니다." },
        { status: 403 }
      );
    }

    const buildingId = id;
    const body = await request.json();
    const { adminManagerId, bizManagerId, managerIds } = body;
    console.log("[PUT /api/buildings/[id]/managers] body:", body);

    // 기존 빌딩 정보 조회 (이전 관리자 정보 확인용)
    const existingBuilding = await prisma.building.findUnique({
      where: { id: buildingId },
      select: {
        adminManagerId: true,
        bizManagerId: true,
      },
    });
    console.log(
      "[PUT /api/buildings/[id]/managers] existingBuilding:",
      existingBuilding
    );

    if (!existingBuilding) {
      return NextResponse.json(
        { error: "해당 빌딩을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 관리자 변경 여부 확인
    const isAdminManagerChanged =
      existingBuilding.adminManagerId !== adminManagerId;
    const isBizManagerChanged = existingBuilding.bizManagerId !== bizManagerId;
    console.log(
      "[PUT /api/buildings/[id]/managers] isAdminManagerChanged:",
      isAdminManagerChanged,
      "isBizManagerChanged:",
      isBizManagerChanged
    );

    // 지정된 사용자들이 적절한 역할을 가지고 있는지 확인
    if (adminManagerId) {
      const adminManager = await prisma.user.findUnique({
        where: { id: adminManagerId },
      });
      console.log(
        "[PUT /api/buildings/[id]/managers] adminManager:",
        adminManager
      );
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
      console.log("[PUT /api/buildings/[id]/managers] bizManager:", bizManager);
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

    // 트랜잭션으로 빌딩 정보 업데이트 및 관련 업무 담당자 업데이트
    const updatedBuilding = await prisma.$transaction(async (tx) => {
      // 1. 빌딩 정보 업데이트
      const building = await tx.building.update({
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
      console.log(
        "[PUT /api/buildings/[id]/managers] building updated:",
        building
      );

      // 2. 관리자 변경 시 관련 업무 담당자 업데이트
      if (isAdminManagerChanged) {
        // 관리 책임자가 담당하는 업무 업데이트
        const adminTasksUpdated = await tx.task.updateMany({
          where: {
            buildingId,
            template: {
              managerType: "ADMIN",
            },
            // 기존 관리 책임자가 담당하던 업무만 업데이트
            assigneeId: existingBuilding.adminManagerId,
          },
          data: {
            assigneeId: adminManagerId || null,
          },
        });
        console.log(
          "[PUT /api/buildings/[id]/managers] ADMIN 업무 업데이트 개수:",
          adminTasksUpdated.count
        );

        // BOTH 유형에서 관리 책임자가 담당하던 업무 업데이트
        const bothAdminTasksUpdated = await tx.task.updateMany({
          where: {
            buildingId,
            template: {
              managerType: "BOTH",
            },
            // 기존 관리 책임자가 담당하던 업무만 업데이트
            assigneeId: existingBuilding.adminManagerId,
          },
          data: {
            assigneeId: adminManagerId || bizManagerId || null,
          },
        });
        console.log(
          "[PUT /api/buildings/[id]/managers] BOTH(Admin) 업무 업데이트 개수:",
          bothAdminTasksUpdated.count
        );
      }

      if (isBizManagerChanged) {
        // 경영 책임자가 담당하는 업무 업데이트
        const bizTasksUpdated = await tx.task.updateMany({
          where: {
            buildingId,
            template: {
              managerType: "BIZ",
            },
            // 기존 경영 책임자가 담당하던 업무만 업데이트
            assigneeId: existingBuilding.bizManagerId,
          },
          data: {
            assigneeId: bizManagerId || null,
          },
        });
        console.log(
          "[PUT /api/buildings/[id]/managers] BIZ 업무 업데이트 개수:",
          bizTasksUpdated.count
        );

        // BOTH 유형에서 관리 책임자가 없고 경영 책임자가 담당하던 업무 업데이트
        if (existingBuilding.adminManagerId === null) {
          const bothBizTasksUpdated = await tx.task.updateMany({
            where: {
              buildingId,
              template: {
                managerType: "BOTH",
              },
              // 기존 경영 책임자가 담당하던 업무만 업데이트
              assigneeId: existingBuilding.bizManagerId,
            },
            data: {
              assigneeId: adminManagerId || bizManagerId || null,
            },
          });
          console.log(
            "[PUT /api/buildings/[id]/managers] BOTH(Biz) 업무 업데이트 개수:",
            bothBizTasksUpdated.count
          );
        }
      }

      return building;
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
