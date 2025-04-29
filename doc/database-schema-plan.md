# 빌딩 관리 시스템 데이터베이스 스키마

## 1. User (사용자)

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
  buildings     Building[]     @relation("BuildingManagers")
  assignedTasks Task[]         @relation("AssignedTo")
  createdTasks  Task[]         @relation("TaskCreator")
  reportedIssues Issue[]       @relation("IssueReporter")
  assignedIssues Issue[]       @relation("IssueAssignee")
  notifications Notification[]
}

enum Role {
  SUPER_ADMIN
  BUILDING_ADMIN
  BUILDING_MANAGER
  USER
}
```

## 2. Building (건물)

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
  managers      User[]        @relation("BuildingManagers")
  tasks         Task[]
  issues        Issue[]
  tenants       Tenant[]
  maintenanceFees MaintenanceFee[]
}
```

## 3. Task (업무 지시 사항)

```prisma
model Task {
  id            String    @id @default(cuid())
  title         String
  description   String
  priority      Priority  @default(MEDIUM)
  status        TaskStatus @default(PENDING)
  dueDate       DateTime?
  isRecurring   Boolean   @default(false)
  recurringPattern String?  // 재발생 패턴 (예: "weekly", "monthly")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  completedAt   DateTime?

  // 관계
  buildingId    String
  building      Building  @relation(fields: [buildingId], references: [id])
  creatorId     String
  creator       User      @relation("TaskCreator", fields: [creatorId], references: [id])
  assigneeId    String?
  assignee      User?     @relation("AssignedTo", fields: [assigneeId], references: [id])
  completionReport TaskCompletionReport?
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  DELAYED
  CANCELLED
}
```

## 4. TaskCompletionReport (업무 완료 보고서)

```prisma
model TaskCompletionReport {
  id          String    @id @default(cuid())
  content     String
  imageUrls   String[]
  timeSpent   Int       // 분 단위
  createdAt   DateTime  @default(now())

  // 관계
  taskId      String    @unique
  task        Task      @relation(fields: [taskId], references: [id])
}
```

## 5. Issue (건물 이슈)

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

## 6. IssueResolution (이슈 해결)

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

## 7. Tenant (입주사/임차인)

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

## 8. Notification (알림)

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

## 9. MaintenanceFee (관리비 - Phase 2)

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

## 10. MaintenanceFeeItem (관리비 항목 - Phase 2)

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

## 11. MaintenanceBill (관리비 청구서 - Phase 2)

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
User ←→ Building (다대다)
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
- Building: name, address
- Task: buildingId, assigneeId, status, dueDate
- Issue: buildingId, reporterId, assigneeId, status
- MaintenanceFee: buildingId, year, month
- MaintenanceBill: tenantId, dueDate, isPaid
