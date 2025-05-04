import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 특정 업무 템플릿 조회 API
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const taskTemplate = await prisma.taskTemplate.findUnique({
      where: { id },
    });

    if (!taskTemplate) {
      return NextResponse.json(
        { error: "업무 템플릿을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(taskTemplate);
  } catch (error) {
    console.error("업무 템플릿 조회 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 업무 템플릿 수정 API
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await req.json();

    // 업무 템플릿 존재 여부 확인
    const existingTemplate = await prisma.taskTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "업무 템플릿을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 업무 템플릿 업데이트
    const updatedTemplate = await prisma.taskTemplate.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        managerType: data.managerType,
        category: data.category,
      },
    });

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("업무 템플릿 수정 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 업무 템플릿 삭제 API
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 업무 템플릿 존재 여부 확인
    const existingTemplate = await prisma.taskTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "업무 템플릿을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 관련 태스크가 있는지 확인
    const relatedTasks = await prisma.task.count({
      where: { templateId: id },
    });

    if (relatedTasks > 0) {
      return NextResponse.json(
        {
          error: "이 템플릿을 사용하는 업무가 있어 삭제할 수 없습니다",
          tasksCount: relatedTasks,
        },
        { status: 400 }
      );
    }

    // 업무 템플릿 삭제
    await prisma.taskTemplate.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "업무 템플릿이 삭제되었습니다" },
      { status: 200 }
    );
  } catch (error) {
    console.error("업무 템플릿 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
