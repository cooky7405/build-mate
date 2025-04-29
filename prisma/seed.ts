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

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, saltRounds);

    await prisma.user.upsert({
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

    console.log(
      `✅ 사용자 생성 완료: ${user.name} (${user.email}) - 역할: ${user.role}`
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
