import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 업무 템플릿 통계 API
export async function GET() {
  try {
    // 모든 업무 템플릿 가져오기
    const templates = await prisma.taskTemplate.findMany({
      orderBy: {
        createdAt: "desc", // 최신순으로 정렬
      },
    });

    // 각 템플릿에 대한 통계 정보 수집
    const templatesWithStats = await Promise.all(
      templates.map(async (template: (typeof templates)[number]) => {
        // 해당 템플릿에 연결된 모든 업무 개수
        const totalTasks = await prisma.task.count({
          where: {
            templateId: template.id,
          },
        });

        // 해당 템플릿에 연결된 완료된 업무 개수
        const completedTasks = await prisma.task.count({
          where: {
            templateId: template.id,
            status: "COMPLETED",
          },
        });

        return {
          ...template,
          totalTasks,
          completedTasks,
        };
      })
    );

    return NextResponse.json(templatesWithStats);
  } catch (error) {
    console.error("업무 템플릿 통계 조회 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
