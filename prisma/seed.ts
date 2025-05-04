import {
  PrismaClient,
  Role,
  Priority,
  ManagerType,
  TaskCategory,
  TaskStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  const users = [
    {
      name: "최고 관리자",
      email: "admin@example.com",
      password: "admin1234",
      role: Role.SUPER_ADMIN,
      phoneNumber: "010-1111-1111",
    },
    {
      name: "건물 관리자",
      email: "building@example.com",
      password: "building1234",
      role: Role.BUILDING_ADMIN,
      phoneNumber: "010-2222-2222",
    },
    {
      name: "관리 책임자",
      email: "admin-manager@example.com",
      password: "manager1234",
      role: Role.ADMIN_MANAGER,
      phoneNumber: "010-3333-3333",
    },
    {
      name: "경영 책임자",
      email: "biz-manager@example.com",
      password: "manager1234",
      role: Role.BIZ_MANAGER,
      phoneNumber: "010-4444-4444",
    },
    {
      name: "일반 건물 관리자",
      email: "manager@example.com",
      password: "manager1234",
      role: Role.BUILDING_MANAGER,
      phoneNumber: "010-5555-5555",
    },
    {
      name: "일반 사용자",
      email: "user@example.com",
      password: "user1234",
      role: Role.USER,
      phoneNumber: "010-6666-6666",
    },
  ];

  console.log("🌱 권한별 사용자 시드 데이터 생성 중...");

  const createdUsers: Record<Role, string> = {} as Record<Role, string>;

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, saltRounds);

    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });

    if (!createdUsers[user.role]) {
      createdUsers[user.role] = createdUser.id;
    }

    console.log(
      `✅ 사용자 생성 완료: ${user.name} (${user.email}) - 역할: ${user.role}`
    );
  }

  console.log("🏢 건물 시드 데이터 생성 중...");

  // 로컬 이미지를 사용하는 대신 기본 이미지 URL
  const defaultImageUrl = "/images/buildings/default-building.jpg";

  const buildings = [
    {
      name: "센트럴 타워",
      address: "서울특별시 강남구 테헤란로 123",
      floors: 25,
      yearBuilt: 2015,
      totalArea: 15000,
      description:
        "강남 중심부에 위치한 현대적인 오피스 빌딩으로, 최고급 시설과 서비스를 제공합니다.",
      status: "active",
      imageUrl: defaultImageUrl,
      managers: [
        createdUsers[Role.SUPER_ADMIN],
        createdUsers[Role.BUILDING_ADMIN],
        createdUsers[Role.BUILDING_MANAGER],
      ],
      adminManagerId: createdUsers[Role.ADMIN_MANAGER],
      bizManagerId: createdUsers[Role.BIZ_MANAGER],
    },
    {
      name: "그랜드 오피스",
      address: "서울특별시 서초구 반포대로 45",
      floors: 18,
      yearBuilt: 2010,
      totalArea: 12000,
      description:
        "서초구 반포대로에 위치한 비즈니스 중심지에 자리한 그랜드 오피스 빌딩입니다.",
      status: "active",
      imageUrl: defaultImageUrl,
      managers: [
        createdUsers[Role.SUPER_ADMIN],
        createdUsers[Role.BUILDING_MANAGER],
      ],
      adminManagerId: createdUsers[Role.ADMIN_MANAGER],
    },
    {
      name: "스카이 빌딩",
      address: "서울특별시 송파구 올림픽로 78",
      floors: 22,
      yearBuilt: 2018,
      totalArea: 20000,
      description:
        "송파구 올림픽로에 위치한 현대식 복합 빌딩으로, 사무실과 상업 공간을 제공합니다.",
      status: "active",
      imageUrl: defaultImageUrl,
      managers: [
        createdUsers[Role.SUPER_ADMIN],
        createdUsers[Role.BUILDING_ADMIN],
      ],
      bizManagerId: createdUsers[Role.BIZ_MANAGER],
    },
    {
      name: "파크뷰 타워",
      address: "서울특별시 마포구 마포대로 567",
      floors: 15,
      yearBuilt: 2012,
      totalArea: 8500,
      description: "마포구 중심부에 위치한 깔끔한 디자인의 사무실 빌딩입니다.",
      status: "maintenance",
      imageUrl: defaultImageUrl,
      managers: [createdUsers[Role.SUPER_ADMIN]],
    },
  ];

  const createdBuildings = [];

  for (const building of buildings) {
    const { managers, adminManagerId, bizManagerId, ...buildingData } =
      building;

    const createdBuilding = await prisma.building.create({
      data: {
        ...buildingData,
        managers: {
          connect: managers.map((id) => ({ id })),
        },
        ...(adminManagerId
          ? { adminManager: { connect: { id: adminManagerId } } }
          : {}),
        ...(bizManagerId
          ? { bizManager: { connect: { id: bizManagerId } } }
          : {}),
      },
    });

    createdBuildings.push(createdBuilding);
    console.log(`✅ 건물 생성 완료: ${building.name}`);
  }

  // 업무 템플릿 생성
  console.log("📝 업무 템플릿 데이터 생성 중...");

  const taskTemplates = [
    {
      title: "소방 설비 점검",
      description: "소방법에 따른 월별 소방 설비 점검 및 보고서 작성",
      priority: Priority.HIGH,
      managerType: ManagerType.ADMIN,
      category: TaskCategory.INSPECTION,
    },
    {
      title: "엘리베이터 정기 점검",
      description: "엘리베이터 안전 점검 및 유지보수 작업",
      priority: Priority.HIGH,
      managerType: ManagerType.ADMIN,
      category: TaskCategory.MAINTENANCE,
    },
    {
      title: "보안 카메라 점검",
      description: "CCTV 카메라 작동 상태 및 저장 장치 점검",
      priority: Priority.MEDIUM,
      managerType: ManagerType.ADMIN,
      category: TaskCategory.SECURITY,
    },
    {
      title: "공용 공간 청소",
      description: "로비, 복도, 화장실 등 공용 공간 청소",
      priority: Priority.MEDIUM,
      managerType: ManagerType.ADMIN,
      category: TaskCategory.CLEANING,
    },
    {
      title: "임대차 계약 갱신",
      description: "임대차 계약 만료 및 갱신 관리",
      priority: Priority.HIGH,
      managerType: ManagerType.BIZ,
      category: TaskCategory.CONTRACT,
    },
    {
      title: "임대료 수납 확인",
      description: "월별 임대료 수납 상태 확인 및 관리",
      priority: Priority.HIGH,
      managerType: ManagerType.BIZ,
      category: TaskCategory.FINANCIAL,
    },
    {
      title: "입주자 민원 대응",
      description: "입주자 민원 접수 및 처리",
      priority: Priority.MEDIUM,
      managerType: ManagerType.BOTH,
      category: TaskCategory.TENANT,
    },
    {
      title: "시설 관리 일일 순찰",
      description: "건물 내 주요 시설 일일 점검 및 순찰",
      priority: Priority.MEDIUM,
      managerType: ManagerType.ADMIN,
      category: TaskCategory.FACILITY,
    },
  ];

  const createdTemplates = [];

  for (const template of taskTemplates) {
    const createdTemplate = await prisma.taskTemplate.create({
      data: template,
    });
    createdTemplates.push(createdTemplate);
    console.log(`✅ 업무 템플릿 생성 완료: ${template.title}`);
  }

  // 실제 업무 생성
  console.log("✨ 실제 업무 데이터 생성 중...");

  // 현재 날짜 기준으로 날짜 생성 함수
  const getDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
  };

  // 업무 상태에 따른 완료일 설정
  const getCompletedAt = (status: TaskStatus, dueDate: Date) => {
    if (status === TaskStatus.COMPLETED) {
      const completedAt = new Date(dueDate);
      completedAt.setDate(completedAt.getDate() - 1); // 마감일 하루 전에 완료
      return completedAt;
    }
    return null;
  };

  const tasks = [
    // 완료된 업무들
    {
      status: TaskStatus.COMPLETED,
      dueDate: getDate(-5), // 5일 전 마감
      buildingId: createdBuildings[0].id, // 센트럴 타워
      templateId: createdTemplates[0].id, // 소방 설비 점검
      creatorId: createdUsers[Role.SUPER_ADMIN],
      assigneeId: createdUsers[Role.ADMIN_MANAGER],
      completedAt: getDate(-6), // 6일 전 완료
    },
    {
      status: TaskStatus.COMPLETED,
      dueDate: getDate(-3), // 3일 전 마감
      buildingId: createdBuildings[1].id, // 그랜드 오피스
      templateId: createdTemplates[1].id, // 엘리베이터 정기 점검
      creatorId: createdUsers[Role.BUILDING_ADMIN],
      assigneeId: createdUsers[Role.BUILDING_MANAGER],
      completedAt: getDate(-4), // 4일 전 완료
    },

    // 진행 중인 업무들
    {
      status: TaskStatus.IN_PROGRESS,
      dueDate: getDate(2), // 2일 후 마감
      buildingId: createdBuildings[0].id, // 센트럴 타워
      templateId: createdTemplates[2].id, // 보안 카메라 점검
      creatorId: createdUsers[Role.BUILDING_ADMIN],
      assigneeId: createdUsers[Role.ADMIN_MANAGER],
    },
    {
      status: TaskStatus.IN_PROGRESS,
      dueDate: getDate(3), // 3일 후 마감
      buildingId: createdBuildings[2].id, // 스카이 빌딩
      templateId: createdTemplates[4].id, // 임대차 계약 갱신
      creatorId: createdUsers[Role.SUPER_ADMIN],
      assigneeId: createdUsers[Role.BIZ_MANAGER],
    },

    // 대기 중인 업무들
    {
      status: TaskStatus.PENDING,
      dueDate: getDate(5), // 5일 후 마감
      buildingId: createdBuildings[0].id, // 센트럴 타워
      templateId: createdTemplates[3].id, // 공용 공간 청소
      creatorId: createdUsers[Role.ADMIN_MANAGER],
      assigneeId: createdUsers[Role.BUILDING_MANAGER],
    },
    {
      status: TaskStatus.PENDING,
      dueDate: getDate(7), // 7일 후 마감
      buildingId: createdBuildings[1].id, // 그랜드 오피스
      templateId: createdTemplates[5].id, // 임대료 수납 확인
      creatorId: createdUsers[Role.SUPER_ADMIN],
      assigneeId: null, // 아직 할당되지 않음
    },

    // 지연된 업무
    {
      status: TaskStatus.DELAYED,
      dueDate: getDate(-1), // 1일 전 마감 (지연됨)
      buildingId: createdBuildings[3].id, // 파크뷰 타워
      templateId: createdTemplates[7].id, // 시설 관리 일일 순찰
      creatorId: createdUsers[Role.BUILDING_ADMIN],
      assigneeId: createdUsers[Role.BUILDING_MANAGER],
    },

    // 취소된 업무
    {
      status: TaskStatus.CANCELLED,
      dueDate: getDate(10), // 10일 후 마감 예정이었으나 취소됨
      buildingId: createdBuildings[2].id, // 스카이 빌딩
      templateId: createdTemplates[6].id, // 입주자 민원 대응
      creatorId: createdUsers[Role.BUILDING_ADMIN],
      assigneeId: createdUsers[Role.BUILDING_MANAGER],
    },
  ];

  for (const task of tasks) {
    const { status, completedAt, ...taskData } = task;

    const createdTask = await prisma.task.create({
      data: {
        ...taskData,
        status,
        completedAt,
      },
    });

    // 완료된 작업에 대해 완료 보고서 생성
    if (status === TaskStatus.COMPLETED) {
      await prisma.taskCompletionReport.create({
        data: {
          taskId: createdTask.id,
          content: "업무를 성공적으로 완료했습니다. 특이사항은 없었습니다.",
          imageUrls: JSON.stringify(["/images/reports/sample-report.jpg"]),
          timeSpent: 120, // 2시간 (120분)
        },
      });
    }

    console.log(
      `✅ 업무 생성 완료: ${
        createdTemplates.find((t) => t.id === task.templateId)?.title
      } (${status})`
    );
  }

  console.log("✨ 시드 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 데이터 생성 오류:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
