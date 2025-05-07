import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface TemplateStatusParams {
  id: string;
}

type SimpleBuilding = {
  id: string;
  name: string;
  address: string;
  imageUrl: string | null;
};

// 특정 업무 템플릿의 빌딩별 진행 상태 조회 API
export async function GET(
  req: Request,
  context: { params: Promise<TemplateStatusParams> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // 먼저 템플릿이 존재하는지 확인
    const template = await prisma.taskTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "업무 템플릿을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이 템플릿을 사용하는 모든 빌딩 찾기
    const buildings = await prisma.building.findMany({
      where: {
        tasks: {
          some: {
            templateId: id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        address: true,
        imageUrl: true,
      },
    });

    // 각 빌딩별 업무 진행 상태 계산
    const buildingsWithStatus = await Promise.all(
      buildings.map(async (building: SimpleBuilding) => {
        // 총 업무 수
        const totalTasks = await prisma.task.count({
          where: {
            buildingId: building.id,
            templateId: id,
          },
        });

        // 상태별 업무 수
        const pendingTasks = await prisma.task.count({
          where: {
            buildingId: building.id,
            templateId: id,
            status: "PENDING",
          },
        });

        const inProgressTasks = await prisma.task.count({
          where: {
            buildingId: building.id,
            templateId: id,
            status: "IN_PROGRESS",
          },
        });

        const completedTasks = await prisma.task.count({
          where: {
            buildingId: building.id,
            templateId: id,
            status: "COMPLETED",
          },
        });

        // 가장 최근 업무
        const latestTask = await prisma.task.findFirst({
          where: {
            buildingId: building.id,
            templateId: id,
          },
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            completedAt: true,
          },
        });

        return {
          ...building,
          taskStats: {
            total: totalTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
            completionRate:
              totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
          },
          latestTask,
        };
      })
    );

    // 템플릿 정보와 빌딩별 상태 반환
    return NextResponse.json({
      template,
      buildings: buildingsWithStatus,
    });
  } catch (error) {
    console.error("템플릿 상태 조회 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
