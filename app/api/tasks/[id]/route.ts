import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface TaskParams {
  id: string;
}

// 특정 업무 조회 API
export async function GET(
  req: Request,
  context: { params: Promise<TaskParams> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        template: true,
        building: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            adminManager: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
            bizManager: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
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
    });

    if (!task) {
      return NextResponse.json(
        { error: "업무를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("업무 조회 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 업무 수정 API
export async function PUT(
  req: Request,
  context: { params: Promise<TaskParams> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const data = await req.json();

    // 업무 존재 여부 확인
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "업무를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미 완료된 업무인 경우 수정 불가
    if (existingTask.status === "COMPLETED" && data.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "이미 완료된 업무는 수정할 수 없습니다" },
        { status: 400 }
      );
    }

    // 업무 상태 업데이트
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: data.status,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        completedAt:
          data.status === "COMPLETED" && !existingTask.completedAt
            ? new Date()
            : undefined,
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

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("업무 수정 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 업무 삭제 API
export async function DELETE(
  req: Request,
  context: { params: Promise<TaskParams> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // 업무 존재 여부 확인
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        completionReport: true,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "업무를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미 완료된 업무인 경우 삭제 불가
    if (existingTask.status === "COMPLETED") {
      return NextResponse.json(
        { error: "이미 완료된 업무는 삭제할 수 없습니다" },
        { status: 400 }
      );
    }

    // 업무 완료 보고서가 있는 경우 함께 삭제
    if (existingTask.completionReport) {
      await prisma.taskCompletionReport.delete({
        where: { taskId: id },
      });
    }

    // 업무 삭제
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "업무가 삭제되었습니다" },
      { status: 200 }
    );
  } catch (error) {
    console.error("업무 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
