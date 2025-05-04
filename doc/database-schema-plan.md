# 빌딩 관리 시스템 데이터베이스 스키마

## User (사용자)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String
  role          Role      @default(USER)
  phoneNumber   String?
  profileImage  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 관계
  buildings           Building[]     @relation("BuildingManagers")           // 일반 관리자로 속한 빌딩들
  adminManagedBuildings Building[]   @relation("BuildingAdminManager")       // 관리 책임자로 담당하는 빌딩들
  bizManagedBuildings  Building[]    @relation("BuildingBizManager")         // 경영 책임자로 담당하는 빌딩들
  assignedTasks        Task[]        @relation("AssignedTo")
  createdTasks         Task[]        @relation("TaskCreator")
  reportedIssues       Issue[]       @relation("IssueReporter")
  assignedIssues       Issue[]       @relation("IssueAssignee")
  notifications        Notification[]
}

enum Role {
  SUPER_ADMIN       // 전체 시스템 관리자
  BUILDING_ADMIN    // 건물 관리자 (여러 빌딩 총괄)
  ADMIN_MANAGER     // 관리 책임자 (시설/운영)
  BIZ_MANAGER       // 경영 책임자 (수익/계약)
  BUILDING_MANAGER  // 일반 빌딩 관리자
  USER              // 일반 사용자
}
```

## Building (건물)

```prisma
model Building {
  id            String    @id @default(cuid())
  name          String
  address       String
  floors        Int
  yearBuilt     Int?
  totalArea     Float?    // 제곱미터
  description   String?
  imageUrl      String?
  status        String    @default("active")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 관계
  managers      User[]        @relation("BuildingManagers")      // 일반 관리자들
  adminManagerId String?                                         // 관리 책임자 ID (시설/운영 담당)
  adminManager  User?         @relation("BuildingAdminManager", fields: [adminManagerId], references: [id])  // 관리 책임자
  bizManagerId  String?                                          // 경영 책임자 ID (수익/계약 담당)
  bizManager    User?         @relation("BuildingBizManager", fields: [bizManagerId], references: [id])      // 경영 책임자
  tasks         Task[]
  issues        Issue[]
  tenants       Tenant[]
  maintenanceFees MaintenanceFee[]
}
```

## 3. 업무 지시/이행 관리 (빌딩별 1:N 관계, 주석 포함)

```prisma
// 업무 템플릿(업무 내용/유형)
model TaskTemplate {
  id            String   @id @default(cuid()) // 업무 템플릿 ID
  title         String   // 업무 제목(예: 소방 점검)
  description   String   // 업무 상세 설명
  priority      Priority @default(MEDIUM) // 기본 우선순위
  managerType   ManagerType @default(ADMIN) // 책임자 유형(관리/경영)
  category      TaskCategory // 업무 카테고리
  createdAt     DateTime @default(now())  // 생성일
  updatedAt     DateTime @updatedAt       // 수정일

  // 관계
  tasks       Task[]   // 이 템플릿을 기반으로 생성된 실제 업무들
}

// 실제 업무(빌딩별로 생성되는 업무 인스턴스)
model Task {
  id            String    @id @default(cuid()) // 업무 ID
  status        TaskStatus @default(PENDING)   // 업무 상태
  dueDate       DateTime?  // 마감일
  createdAt     DateTime  @default(now())      // 생성일
  updatedAt     DateTime  @updatedAt           // 수정일
  completedAt   DateTime? // 완료일

  // 관계
  buildingId    String    // 소속 빌딩 ID
  building      Building  @relation(fields: [buildingId], references: [id]) // 소속 빌딩
  templateId    String    // 업무 템플릿 ID
  template      TaskTemplate @relation(fields: [templateId], references: [id]) // 업무 템플릿
  creatorId     String    // 업무 지시자(사장) ID
  creator       User      @relation("TaskCreator", fields: [creatorId], references: [id]) // 업무 지시자(사장)
  assigneeId    String?   // 담당자(빌딩 담당자) ID
  assignee      User?     @relation("AssignedTo", fields: [assigneeId], references: [id]) // 담당자(빌딩 담당자)
  completionReport TaskCompletionReport? // 업무 완료 보고서
}

// 업무 완료 보고서
model TaskCompletionReport {
  id          String    @id @default(cuid()) // 보고서 ID
  content     String    // 완료 내용
  imageUrls   String[]  // 첨부 이미지
  timeSpent   Int       // 소요 시간(분)
  createdAt   DateTime  @default(now()) // 보고서 생성일
  taskId      String    @unique         // 업무 ID
  task        Task      @relation(fields: [taskId], references: [id]) // 해당 업무
}

// 우선순위
enum Priority {
  LOW      // 낮음
  MEDIUM   // 보통
  HIGH     // 높음
  URGENT   // 긴급
}

// 업무 상태
enum TaskStatus {
  PENDING      // 대기(지시만 된 상태)
  IN_PROGRESS  // 담당자가 진행 중
  COMPLETED    // 담당자가 완료 보고를 하면 COMPLETED로 변경
  DELAYED      // 지연
  CANCELLED    // 취소
}

// 책임자 유형
enum ManagerType {
  ADMIN    // 관리 책임자 담당
  BIZ      // 경영 책임자 담당
  BOTH     // 두 책임자 모두 관련
}

// 업무 카테고리
enum TaskCategory {
  MAINTENANCE    // 유지보수
  SECURITY       // 보안
  CLEANING       // 청소
  INSPECTION     // 점검
  FACILITY       // 시설관리
  CONTRACT       // 계약관리
  FINANCIAL      // 재무관리
  TENANT         // 입주자관리
  OTHER          // 기타
}
```

## 4. Issue (건물 이슈)

```prisma
model Issue {
  id            String    @id @default(cuid())
  title         String
  description   String
  category      IssueCategory
  location      String    // 건물 내 위치
  priority      Priority  @default(MEDIUM)
  status        IssueStatus @default(REPORTED)
  imageUrls     String[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  resolvedAt    DateTime?

  // 관계
  buildingId    String
  building      Building  @relation(fields: [buildingId], references: [id])
  reporterId    String
  reporter      User      @relation("IssueReporter", fields: [reporterId], references: [id])
  assigneeId    String?
  assignee      User?     @relation("IssueAssignee", fields: [assigneeId], references: [id])
  resolution    IssueResolution?
}

enum IssueCategory {
  ELECTRICAL
  PLUMBING
  HVAC
  STRUCTURAL
  SECURITY
  CLEANING
  ELEVATOR
  FIRE_SAFETY
  OTHER
}

enum IssueStatus {
  REPORTED
  ASSIGNED
  IN_PROGRESS
  RESOLVED
  CLOSED
  REOPENED
}
```

## 5. IssueResolution (이슈 해결)

```prisma
model IssueResolution {
  id          String    @id @default(cuid())
  description String
  actionTaken String
  cost        Float?
  imageUrls   String[]
  createdAt   DateTime  @default(now())

  // 관계
  issueId     String    @unique
  issue       Issue     @relation(fields: [issueId], references: [id])
}
```

## 6. Tenant (입주사/임차인)

```prisma
model Tenant {
  id            String    @id @default(cuid())
  name          String
  contactPerson String
  contactEmail  String
  contactPhone  String
  floor         Int?
  unit          String?
  leaseStart    DateTime
  leaseEnd      DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 관계
  buildingId    String
  building      Building  @relation(fields: [buildingId], references: [id])
  maintenanceBills MaintenanceBill[]
}
```

## 7. Notification (알림)

```prisma
model Notification {
  id            String    @id @default(cuid())
  title         String
  message       String
  type          NotificationType
  read          Boolean   @default(false)
  createdAt     DateTime  @default(now())

  // 관계
  userId        String
  user          User      @relation(fields: [userId], references: [id])

  // 참조 데이터 (nullable)
  taskId        String?
  issueId       String?
  buildingId    String?
}

enum NotificationType {
  TASK_ASSIGNED
  TASK_DUE_SOON
  TASK_OVERDUE
  ISSUE_REPORTED
  ISSUE_ASSIGNED
  ISSUE_STATUS_CHANGED
  MAINTENANCE_SCHEDULED
  BILL_DUE
  SYSTEM
}
```

## 8. MaintenanceFee (관리비 - Phase 2)

```prisma
model MaintenanceFee {
  id            String    @id @default(cuid())
  month         Int       // 1-12
  year          Int
  totalAmount   Float
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 관계
  buildingId    String
  building      Building  @relation(fields: [buildingId], references: [id])
  feeItems      MaintenanceFeeItem[]
  bills         MaintenanceBill[]
}
```

## 9. MaintenanceFeeItem (관리비 항목 - Phase 2)

```prisma
model MaintenanceFeeItem {
  id              String    @id @default(cuid())
  category        FeeCategory
  amount          Float
  description     String?

  // 관계
  maintenanceFeeId String
  maintenanceFee   MaintenanceFee @relation(fields: [maintenanceFeeId], references: [id])
}

enum FeeCategory {
  ELECTRICITY
  WATER
  GAS
  CLEANING
  SECURITY
  ELEVATOR
  MAINTENANCE
  ADMINISTRATIVE
  OTHER
}
```

## 10. MaintenanceBill (관리비 청구서 - Phase 2)

```prisma
model MaintenanceBill {
  id              String    @id @default(cuid())
  amount          Float
  dueDate         DateTime
  isPaid          Boolean   @default(false)
  paidAt          DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // 관계
  tenantId        String
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  maintenanceFeeId String
  maintenanceFee   MaintenanceFee @relation(fields: [maintenanceFeeId], references: [id])
}
```

## 데이터베이스 관계도

```
User ←→ Building (다대다, 일반 관리자)
User → Building (일대다, 관리 책임자)
User → Building (일대다, 경영 책임자)
Building → Task (일대다)
Building → Issue (일대다)
Building → Tenant (일대다)
Building → MaintenanceFee (일대다)
User → Task (일대다, 생성자)
User → Task (일대다, 담당자)
User → Issue (일대다, 보고자)
User → Issue (일대다, 담당자)
User → Notification (일대다)
Task → TaskCompletionReport (일대일)
Issue → IssueResolution (일대일)
Tenant → MaintenanceBill (일대다)
MaintenanceFee → MaintenanceFeeItem (일대다)
MaintenanceFee → MaintenanceBill (일대다)
```

## 인덱스 설정

- User: email
- Building: name, address, adminManagerId, bizManagerId
- Task: buildingId, assigneeId, status, dueDate
- Issue: buildingId, reporterId, assigneeId, status
- MaintenanceFee: buildingId, year, month
- MaintenanceBill: tenantId, dueDate, isPaid

## 빌딩 책임자 구분과 권한

### 1. 관리 책임자 (ADMIN_MANAGER)

- **주요 책임**: 빌딩의 시설 관리, 유지보수, 운영 담당
- **접근 권한**:
  - 빌딩 시설 정보 조회/관리
  - 이슈(Issue) 관리 및 처리
  - 관리형 업무(Task) 생성/할당/관리
  - 시설 관련 보고서 조회

### 2. 경영 책임자 (BIZ_MANAGER)

- **주요 책임**: 빌딩의 수익 관리, 임대차 계약, 재무 관리 담당
- **접근 권한**:
  - 임차인(Tenant) 정보 조회/관리
  - 관리비(MaintenanceFee) 설정/조회
  - 재무 관련 보고서 조회
  - 계약 관련 업무(Task) 생성/할당/관리

### 3. 업무 처리 흐름

- 사장(SUPER_ADMIN)은 모든 빌딩의 모든 업무에 접근 가능
- 관리 책임자는 시설/운영 관련 업무를 주로 처리
- 경영 책임자는 수익/계약 관련 업무를 주로 처리
- 일반 관리자(BUILDING_MANAGER)는 두 책임자로부터 업무를 할당받아 처리

### 4. 구현 시 고려사항

- 업무(Task) 생성 시 업무 유형에 따라 관리 책임자 또는 경영 책임자에게 알림
- 대시보드에서 책임자 유형별로 다른 정보와 통계 표시
- 사용자 권한에 따라 접근 가능한 메뉴와 기능 제한
