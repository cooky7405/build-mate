import { PrismaClient, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface TaskCompleteParams {
  id: string;
}

// 업무 완료 보고 제출 API
export async function POST(
  req: Request,
  context: { params: Promise<TaskCompleteParams> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const data = await req.json();

    // 필수 필드 검증
    if (!data.content) {
      return NextResponse.json(
        { error: "완료 보고 내용은 필수 항목입니다" },
        { status: 400 }
      );
    }

    // 업무 존재 여부 확인
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        completionReport: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "업무를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미 완료 보고서가 있는 경우
    if (task.completionReport) {
      return NextResponse.json(
        { error: "이미 완료 보고서가 제출되었습니다" },
        { status: 400 }
      );
    }

    // 트랜잭션으로 업무 상태 업데이트 및 완료 보고서 생성
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 업무 상태 업데이트
        const updatedTask = await tx.task.update({
          where: { id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        // 완료 보고서 생성
        const report = await tx.taskCompletionReport.create({
          data: {
            taskId: id,
            content: data.content,
            imageUrls: "", // 기본값 또는 data에서 받아올 수 있으면 추가
            timeSpent: 0, // 기본값 또는 data에서 받아올 수 있으면 추가
          },
        });

        return { task: updatedTask, report };
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("업무 완료 보고 제출 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 업무 완료 보고 수정 API
export async function PUT(
  req: Request,
  context: { params: Promise<TaskCompleteParams> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const data = await req.json();

    // 필수 필드 검증
    if (!data.content) {
      return NextResponse.json(
        { error: "완료 보고 내용은 필수 항목입니다" },
        { status: 400 }
      );
    }

    // 업무 존재 여부 확인
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        completionReport: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "업무를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 완료 보고서가 없는 경우
    if (!task.completionReport) {
      return NextResponse.json(
        { error: "완료 보고서가 존재하지 않습니다" },
        { status: 400 }
      );
    }

    // 완료 보고서 수정
    const updatedReport = await prisma.taskCompletionReport.update({
      where: { taskId: id },
      data: {
        content: data.content,
        // updatedAt: new Date(), // Prisma가 자동 처리
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("업무 완료 보고 수정 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
