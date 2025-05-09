# 빌딩 관리 시스템 API 명세서

## 인증 API

<!--
### 1. 로그인

- **엔드포인트**: `POST /api/auth/login`
- **요청 본문**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답**: 인증 토큰 및 사용자 정보

### 2. 로그아웃

- **엔드포인트**: `POST /api/auth/logout`
- **응답**: 성공 메시지

### 3. 사용자 등록

- **엔드포인트**: `POST /api/auth/register`
- **요청 본문**: 사용자 정보
- **응답**: 성공 메시지 및 사용자 ID

## 사용자 API

### 1. 사용자 목록 조회

- **엔드포인트**: `GET /api/users`
- **쿼리 파라미터**: 페이지, 필터, 정렬
- **응답**: 사용자 목록

### 2. 사용자 상세 조회

- **엔드포인트**: `GET /api/users/{userId}`
- **응답**: 사용자 상세 정보

### 3. 사용자 정보 수정

- **엔드포인트**: `PUT /api/users/{userId}`
- **요청 본문**: 업데이트할 사용자 정보
- **응답**: 업데이트된 사용자 정보

### 4. 사용자 삭제

- **엔드포인트**: `DELETE /api/users/{userId}`
- **응답**: 성공 메시지

## 건물 API

### 1. 건물 목록 조회

- **엔드포인트**: `GET /api/buildings`
- **쿼리 파라미터**: 페이지, 필터, 정렬
- **응답**: 건물 목록

### 2. 건물 상세 조회

- **엔드포인트**: `GET /api/buildings/{buildingId}`
- **응답**: 건물 상세 정보

### 3. 건물 등록

- **엔드포인트**: `POST /api/buildings`
- **요청 본문**: 건물 정보
- **응답**: 생성된 건물 정보

### 4. 건물 정보 수정

- **엔드포인트**: `PUT /api/buildings/{buildingId}`
- **요청 본문**: 업데이트할 건물 정보
- **응답**: 업데이트된 건물 정보

### 5. 건물 삭제

- **엔드포인트**: `DELETE /api/buildings/{buildingId}`
- **응답**: 성공 메시지

### 6. 건물 관리자 할당

- **엔드포인트**: `POST /api/buildings/{buildingId}/managers`
- **요청 본문**: 관리자 ID 목록
- **응답**: 성공 메시지

## 업무 지시 사항 API

### 1. 업무 목록 조회

- **엔드포인트**: `GET /api/tasks`
- **쿼리 파라미터**: 페이지, 필터, 정렬, 건물ID
- **응답**: 업무 목록

### 2. 업무 상세 조회

- **엔드포인트**: `GET /api/tasks/{taskId}`
- **응답**: 업무 상세 정보

### 3. 업무 등록

- **엔드포인트**: `POST /api/tasks`
- **요청 본문**: 업무 정보
- **응답**: 생성된 업무 정보

### 4. 업무 수정

- **엔드포인트**: `PUT /api/tasks/{taskId}`
- **요청 본문**: 업데이트할 업무 정보
- **응답**: 업데이트된 업무 정보

### 5. 업무 삭제

- **엔드포인트**: `DELETE /api/tasks/{taskId}`
- **응답**: 성공 메시지

### 6. 업무 상태 변경

- **엔드포인트**: `PATCH /api/tasks/{taskId}/status`
- **요청 본문**: 상태 정보
- **응답**: 업데이트된 상태 정보

### 7. 업무 완료 보고서 제출

- **엔드포인트**: `POST /api/tasks/{taskId}/completion-report`
- **요청 본문**: 완료 보고서 정보
- **응답**: 생성된 완료 보고서

## 건물 이슈 API

### 1. 이슈 목록 조회

- **엔드포인트**: `GET /api/issues`
- **쿼리 파라미터**: 페이지, 필터, 정렬, 건물ID
- **응답**: 이슈 목록

### 2. 이슈 상세 조회

- **엔드포인트**: `GET /api/issues/{issueId}`
- **응답**: 이슈 상세 정보

### 3. 이슈 등록

- **엔드포인트**: `POST /api/issues`
- **요청 본문**: 이슈 정보
- **응답**: 생성된 이슈 정보

### 4. 이슈 수정

- **엔드포인트**: `PUT /api/issues/{issueId}`
- **요청 본문**: 업데이트할 이슈 정보
- **응답**: 업데이트된 이슈 정보

### 5. 이슈 상태 변경

- **엔드포인트**: `PATCH /api/issues/{issueId}/status`
- **요청 본문**: 상태 정보
- **응답**: 업데이트된 상태 정보

### 6. 이슈 해결 보고서 제출

- **엔드포인트**: `POST /api/issues/{issueId}/resolution`
- **요청 본문**: 해결 보고서 정보
- **응답**: 생성된 해결 보고서

## 알림 API

### 1. 알림 목록 조회

- **엔드포인트**: `GET /api/notifications`
- **쿼리 파라미터**: 페이지, 필터
- **응답**: 알림 목록

### 2. 알림 읽음 표시

- **엔드포인트**: `PATCH /api/notifications/{notificationId}/read`
- **응답**: 업데이트된 알림 정보

### 3. 모든 알림 읽음 표시

- **엔드포인트**: `PATCH /api/notifications/read-all`
- **응답**: 성공 메시지

## 입주사 관리 API

### 1. 입주사 목록 조회

- **엔드포인트**: `GET /api/tenants`
- **쿼리 파라미터**: 페이지, 필터, 정렬, 건물ID
- **응답**: 입주사 목록

### 2. 입주사 상세 조회

- **엔드포인트**: `GET /api/tenants/{tenantId}`
- **응답**: 입주사 상세 정보

### 3. 입주사 등록

- **엔드포인트**: `POST /api/tenants`
- **요청 본문**: 입주사 정보
- **응답**: 생성된 입주사 정보

### 4. 입주사 정보 수정

- **엔드포인트**: `PUT /api/tenants/{tenantId}`
- **요청 본문**: 업데이트할 입주사 정보
- **응답**: 업데이트된 입주사 정보

### 5. 입주사 삭제

- **엔드포인트**: `DELETE /api/tenants/{tenantId}`
- **응답**: 성공 메시지

## 관리비 API (Phase 2)

### 1. 관리비 목록 조회

- **엔드포인트**: `GET /api/maintenance-fees`
- **쿼리 파라미터**: 페이지, 필터, 정렬, 건물ID, 연도, 월
- **응답**: 관리비 목록

### 2. 관리비 상세 조회

- **엔드포인트**: `GET /api/maintenance-fees/{feeId}`
- **응답**: 관리비 상세 정보

### 3. 관리비 등록

- **엔드포인트**: `POST /api/maintenance-fees`
- **요청 본문**: 관리비 정보
- **응답**: 생성된 관리비 정보

### 4. 관리비 항목 추가

- **엔드포인트**: `POST /api/maintenance-fees/{feeId}/items`
- **요청 본문**: 관리비 항목 정보
- **응답**: 생성된 관리비 항목

### 5. 관리비 청구서 목록 조회

- **엔드포인트**: `GET /api/maintenance-bills`
- **쿼리 파라미터**: 페이지, 필터, 정렬, 입주사ID
- **응답**: 관리비 청구서 목록

### 6. 관리비 청구서 생성

- **엔드포인트**: `POST /api/maintenance-bills`
- **요청 본문**: 관리비 청구서 정보
- **응답**: 생성된 관리비 청구서

### 7. 관리비 납부 처리

- **엔드포인트**: `PATCH /api/maintenance-bills/{billId}/payment`
- **요청 본문**: 납부 정보
- **응답**: 업데이트된 청구서 정보

## 모바일 푸시 알림 API

### 1. 디바이스 등록

- **엔드포인트**: `POST /api/push/register-device`
- **요청 본문**: 디바이스 토큰 정보
- **응답**: 성공 메시지

### 2. 푸시 알림 전송 (관리자용)

- **엔드포인트**: `POST /api/push/send`
- **요청 본문**: 알림 정보, 수신자 목록
- **응답**: 성공 메시지

### 3. 푸시 알림 설정 조회

- **엔드포인트**: `GET /api/users/{userId}/push-settings`
- **응답**: 푸시 알림 설정 정보

### 4. 푸시 알림 설정 업데이트

- **엔드포인트**: `PUT /api/users/{userId}/push-settings`
- **요청 본문**: 업데이트할 설정 정보
- **응답**: 업데이트된 설정 정보

## 통계 및 보고서 API

### 1. 건물별 이슈 통계

- **엔드포인트**: `GET /api/statistics/buildings/{buildingId}/issues`
- **쿼리 파라미터**: 기간, 유형
- **응답**: 통계 데이터

### 2. 업무 완료율 통계

- **엔드포인트**: `GET /api/statistics/tasks/completion-rate`
- **쿼리 파라미터**: 기간, 건물ID
- **응답**: 통계 데이터

### 3. 관리비 분석 리포트 (Phase 2)

- **엔드포인트**: `GET /api/statistics/maintenance-fees/analysis`
- **쿼리 파라미터**: 기간, 건물ID
- **응답**: 분석 데이터 -->
