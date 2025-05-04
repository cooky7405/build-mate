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
    if (!data.buildingId || !data.templateId) {
      return NextResponse.json(
        { error: "빌딩 ID와 템플릿 ID는 필수 항목입니다" },
        { status: 400 }
      );
    }

    // 빌딩 존재 여부 확인
    const building = await prisma.building.findUnique({
      where: { id: data.buildingId },
    });

    if (!building) {
      return NextResponse.json(
        { error: "존재하지 않는 빌딩입니다" },
        { status: 400 }
      );
    }

    // 템플릿 존재 여부 확인
    const template = await prisma.taskTemplate.findUnique({
      where: { id: data.templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "존재하지 않는 업무 템플릿입니다" },
        { status: 400 }
      );
    }

    // 업무 생성
    const task = await prisma.task.create({
      data: {
        buildingId: data.buildingId,
        templateId: data.templateId,
        status: "PENDING",
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        creatorId: data.creatorId, // 사용자 인증 구현 후 세션에서 가져올 예정
        assigneeId: data.assigneeId,
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
      },
    });

    return NextResponse.json(task, { status: 201 });
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
