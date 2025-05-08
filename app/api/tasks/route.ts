import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 업무 목록 조회 API
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 필터링 옵션
    const buildingId = searchParams.get("buildingId");
    const status = searchParams.get("status");
    const assigneeId = searchParams.get("assigneeId");
    const templateId = searchParams.get("templateId");
    const managerType = searchParams.get("managerType");
    const search = searchParams.get("search");

    // 기본 쿼리 조건
    const whereClause: Record<string, unknown> = {};

    // 빌딩 ID 필터
    if (buildingId) {
      whereClause.buildingId = buildingId;
    }

    // 상태 필터
    if (status) {
      whereClause.status = status;
    }

    // 담당자 필터
    if (assigneeId) {
      whereClause.assigneeId = assigneeId;
    }

    // 템플릿 필터
    if (templateId) {
      whereClause.templateId = templateId;
    }

    // 관리자 유형 필터 (템플릿 기반)
    if (managerType) {
      whereClause.template = {
        managerType,
      };
    }

    // 검색어 필터
    if (search) {
      whereClause.OR = [
        {
          template: {
            title: { contains: search, mode: "insensitive" },
          },
        },
        {
          building: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    // 업무 목록 조회
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        template: true,
        building: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        completionReport: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("업무 목록 조회 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 업무 생성 API
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 필수 필드 검증
    if (!data.templateId) {
      return NextResponse.json(
        { error: "템플릿 ID는 필수 항목입니다" },
        { status: 400 }
      );
    }

    // buildingIds가 없거나 allBuildings가 false인 경우 검증
    if (
      !data.allBuildings &&
      (!data.buildingIds || data.buildingIds.length === 0)
    ) {
      return NextResponse.json(
        { error: "건물 ID 목록 또는 모든 건물 옵션은 필수 항목입니다" },
        { status: 400 }
      );
    }

    // 템플릿 존재 여부 확인 및 정보 조회
    const template = await prisma.taskTemplate.findUnique({
      where: { id: data.templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "존재하지 않는 업무 템플릿입니다" },
        { status: 400 }
      );
    }

    // 업무를 생성할 건물 목록 결정
    let buildingIds: string[] = [];

    if (data.allBuildings) {
      // 모든 건물에 업무 할당
      const allBuildings = await prisma.building.findMany({
        select: { id: true },
      });
      buildingIds = allBuildings.map((building: { id: string }) => building.id);
    } else {
      // 선택된 건물들에만 업무 할당
      buildingIds = data.buildingIds;

      // 선택된 건물들이 존재하는지 확인
      const buildings = await prisma.building.findMany({
        where: { id: { in: buildingIds } },
        select: { id: true },
      });

      if (buildings.length !== buildingIds.length) {
        return NextResponse.json(
          { error: "존재하지 않는 건물이 포함되어 있습니다" },
          { status: 400 }
        );
      }
    }

    // 결과를 저장할 배열
    const createdTasks = [];

    // 각 건물별로 업무 생성
    for (const buildingId of buildingIds) {
      // 템플릿 유형에 따른 담당자 자동 할당
      let assigneeId = data.assigneeId; // 기본값은 요청에서 전달된 담당자 ID

      if (!assigneeId) {
        // 건물 정보 조회 (관리자 정보 포함)
        const building = await prisma.building.findUnique({
          where: { id: buildingId },
          include: {
            adminManager: true,
            bizManager: true,
          },
        });

        if (building) {
          // 템플릿 유형에 따라 담당자 자동 할당
          switch (template.managerType) {
            case "ADMIN":
              // 관리 책임자에게 할당
              assigneeId = building.adminManagerId || null;
              break;
            case "BIZ":
              // 경영 책임자에게 할당
              assigneeId = building.bizManagerId || null;
              break;
            case "BOTH":
              // 맨 처음에는 관리 책임자, 없으면 경영 책임자에게 할당
              assigneeId =
                building.adminManagerId || building.bizManagerId || null;
              break;
            default:
              assigneeId = null;
          }
        }
      }

      // 업무 생성
      const task = await prisma.task.create({
        data: {
          buildingId,
          templateId: data.templateId,
          status: "PENDING",
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          creatorId: data.creatorId, // 사용자 인증 구현 후 세션에서 가져올 예정
          assigneeId, // assigneeId를 템플릿 유형에 따라 할당된 값으로 수정
        },
        include: {
          template: true,
          building: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      createdTasks.push(task);
    }

    return NextResponse.json(
      {
        message: `${createdTasks.length}개의 건물에 업무가 생성되었습니다.`,
        tasks: createdTasks,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("업무 생성 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
