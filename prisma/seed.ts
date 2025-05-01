import { PrismaClient, Role } from "@prisma/client";
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
      name: "건물 소장",
      email: "manager@example.com",
      password: "manager1234",
      role: Role.BUILDING_MANAGER,
      phoneNumber: "010-3333-3333",
    },
    {
      name: "일반 사용자",
      email: "user@example.com",
      password: "user1234",
      role: Role.USER,
      phoneNumber: "010-4444-4444",
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

    createdUsers[user.role] = createdUser.id;

    console.log(
      `✅ 사용자 생성 완료: ${user.name} (${user.email}) - 역할: ${user.role}`
    );
  }

  console.log("🏢 건물 시드 데이터 생성 중...");

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
      imageUrl: "https://via.placeholder.com/600x400?text=Building+1",
      managers: [
        createdUsers[Role.SUPER_ADMIN],
        createdUsers[Role.BUILDING_ADMIN],
        createdUsers[Role.BUILDING_MANAGER],
      ],
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
      imageUrl: "https://via.placeholder.com/600x400?text=Building+2",
      managers: [
        createdUsers[Role.SUPER_ADMIN],
        createdUsers[Role.BUILDING_MANAGER],
      ],
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
      imageUrl: "https://via.placeholder.com/600x400?text=Building+3",
      managers: [
        createdUsers[Role.SUPER_ADMIN],
        createdUsers[Role.BUILDING_ADMIN],
      ],
    },
    {
      name: "파크뷰 타워",
      address: "서울특별시 마포구 마포대로 567",
      floors: 15,
      yearBuilt: 2012,
      totalArea: 8500,
      description: "마포구 중심부에 위치한 깔끔한 디자인의 사무실 빌딩입니다.",
      status: "maintenance",
      imageUrl: "https://via.placeholder.com/600x400?text=Building+4",
      managers: [createdUsers[Role.SUPER_ADMIN]],
    },
  ];

  for (const building of buildings) {
    const { managers, ...buildingData } = building;

    await prisma.building.create({
      data: {
        ...buildingData,
        managers: {
          connect: managers.map((id) => ({ id })),
        },
      },
    });

    console.log(`✅ 건물 생성 완료: ${building.name}`);
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
