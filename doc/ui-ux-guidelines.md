# 빌딩 관리 시스템 UI/UX 디자인 가이드라인

## 1. 디자인 원칙

### 1.1 직관성

- 사용자가 앱을 처음 접했을 때도 쉽게 이해하고 사용할 수 있는 인터페이스 제공
- 불필요한 복잡성 제거 및 명확한 시각적 계층 구조 유지
- 각 기능의 목적과 사용 방법이 즉시 인식될 수 있도록 설계

### 1.2 일관성

- 앱 전체에 걸쳐 일관된 디자인 언어 사용
- 색상, 아이콘, 버튼, 폰트 스타일 등의 시각적 요소 통일
- 사용자 작업 흐름의 일관성 유지

### 1.3 효율성

- 최소한의 클릭/탭으로 작업 완료 가능하도록 설계
- 자주 사용하는 기능에 빠르게 접근할 수 있는 경로 제공
- 데이터 입력 및 검색 프로세스 간소화

### 1.4 접근성

- 다양한 사용자의 능력과 환경을 고려한 디자인
- 시각, 청각, 운동 등의 제약을 가진 사용자를 위한 접근성 고려
- WCAG 2.1 AA 수준 준수

## 2. 색상 시스템

### 2.1 주요 색상 팔레트

- **주요 색상(Primary)**: #1E88E5 (밝은 파란색)
  - 앱의 주요 브랜드 색상으로 버튼, 링크, 강조 등에 사용
- **보조 색상(Secondary)**: #26A69A (청록색)
  - 주요 액션 외의 보조 액션이나 요소에 사용
- **경고 색상(Warning)**: #FFA000 (주황색)
  - 주의 필요한 알림, 대기 상태 등에 사용
- **오류 색상(Error)**: #E53935 (빨간색)
  - 오류, 심각한 알림, 삭제 등에 사용
- **성공 색상(Success)**: #43A047 (녹색)
  - 성공, 완료, 확인 등에 사용

### 2.2 중립 색상

- **배경**: #F5F7FA (매우 밝은 회색)
- **카드/표면**: #FFFFFF (흰색)
- **경계선**: #E0E0E0 (밝은 회색)
- **텍스트 주요**: #263238 (매우 어두운 회색)
- **텍스트 보조**: #607D8B (중간 회색)
- **텍스트 비활성화**: #9E9E9E (밝은 회색)

### 2.3 다크 모드 색상

- **배경**: #121212 (매우 어두운 회색)
- **카드/표면**: #1E1E1E (어두운 회색)
- **경계선**: #333333 (중간 어두운 회색)
- **텍스트 주요**: #FFFFFF (흰색)
- **텍스트 보조**: #B0BEC5 (밝은 회색)
- **텍스트 비활성화**: #757575 (중간 회색)

## 3. 타이포그래피

### 3.1 서체

- **기본 서체**: Noto Sans KR (한글), Roboto (영문)
- **대체 서체**: 시스템 기본 서체 (Sans-serif)

### 3.2 크기 체계 (웹/태블릿)

- **H1 (페이지 제목)**: 24px / 1.2 line-height / 700 weight
- **H2 (섹션 제목)**: 20px / 1.3 line-height / 600 weight
- **H3 (서브 섹션)**: 18px / 1.4 line-height / 600 weight
- **Subtitle**: 16px / 1.5 line-height / 500 weight
- **Body 1 (주요 텍스트)**: 16px / 1.5 line-height / 400 weight
- **Body 2 (보조 텍스트)**: 14px / 1.5 line-height / 400 weight
- **Caption (작은 텍스트)**: 12px / 1.4 line-height / 400 weight
- **Button**: 14px / 500 weight

### 3.3 크기 체계 (모바일)

- **H1 (페이지 제목)**: 20px / 1.2 line-height / 700 weight
- **H2 (섹션 제목)**: 18px / 1.3 line-height / 600 weight
- **H3 (서브 섹션)**: 16px / 1.4 line-height / 600 weight
- **Subtitle**: 15px / 1.5 line-height / 500 weight
- **Body 1 (주요 텍스트)**: 15px / 1.5 line-height / 400 weight
- **Body 2 (보조 텍스트)**: 14px / 1.5 line-height / 400 weight
- **Caption (작은 텍스트)**: 12px / 1.4 line-height / 400 weight
- **Button**: 14px / 500 weight

## 4. 컴포넌트 디자인

### 4.1 버튼

- **기본 버튼**: 둥근 모서리(8px), 패딩(수평 16px, 수직 10px)
- **주요 버튼**: 주요 색상 배경, 흰색 텍스트
- **보조 버튼**: 흰색 배경, 주요 색상 테두리, 주요 색상 텍스트
- **경고 버튼**: 오류 색상 배경, 흰색 텍스트
- **비활성화 버튼**: 회색 배경, 어두운 회색 텍스트, 클릭 불가
- **아이콘 버튼**: 아이콘만 포함, 원형 또는 사각형, hover 효과 있음

### 4.2 카드

- **기본 카드**: 흰색 배경, 약간의 그림자, 둥근 모서리(12px)
- **작업 카드**: 기본 카드 + 상단 색상 표시줄(우선순위 색상)
- **이슈 카드**: 기본 카드 + 좌측 색상 표시줄(카테고리 색상)
- **건물 카드**: 기본 카드 + 상단 이미지 영역

### 4.3 폼 요소

- **입력 필드**: 경계선 스타일, 레이블 상단 고정, 오류 메시지 하단 표시
- **체크박스/라디오 버튼**: 커스텀 디자인, 충분한 터치 영역
- **드롭다운**: 명확한 선택 옵션, 검색 기능 포함(항목 많을 경우)
- **날짜 선택기**: 캘린더 뷰, 직관적인 날짜 범위 선택

### 4.4 탐색 요소

- **상단 앱바**: 로고, 페이지 제목, 검색, 알림, 프로필 메뉴
- **하단 네비게이션(모바일)**: 5개 이하 주요 메뉴, 아이콘 + 텍스트
- **좌측 사이드바(데스크톱)**: 접을 수 있는 메뉴, 계층 구조 표시
- **탭**: 주요 콘텐츠 전환, 아래 밑줄, 활성 탭 강조 표시

## 5. 레이아웃 시스템

### 5.1 그리드 시스템

- **데스크톱**: 12 열 그리드, 24px 거터
- **태블릿**: 8 열 그리드, 16px 거터
- **모바일**: 4 열 그리드, 16px 거터
- **여백**: 데스크톱 32px, 태블릿 24px, 모바일 16px

### 5.2 반응형 분기점

- **모바일**: 0-599px
- **태블릿 세로**: 600-904px
- **태블릿 가로**: 905-1239px
- **데스크톱**: 1240px 이상

### 5.3 간격 시스템

- **기본 단위**: 8px
- **간격 스케일**: 4px(최소), 8px, 16px, 24px, 32px, 48px, 64px

## 6. 아이콘 및 이미지

### 6.1 아이콘

- **스타일**: Material Design 아이콘 시스템 또는 유사한 일관된 아이콘 세트
- **크기**: 24px (기본), 20px (작은 UI 요소), 32px (강조)
- **색상**: 중립 컬러 또는 기능에 따른 특정 색상 사용

### 6.2 이미지

- **건물 이미지**: 16:9 비율 권장, 최소 해상도 1200px \* 675px
- **프로필 이미지**: 1:1 비율, 원형 크롭, 최소 해상도 400px \* 400px
- **문제 보고 이미지**: 자유 비율, 썸네일 및 전체화면 뷰 지원

## 7. 상태 표시

### 7.1 로딩 상태

- **스켈레톤 로딩**: 컨텐츠 형태의 뼈대를 표시
- **스피너/프로그레스 바**: 특정 작업의 진행 상태를 표시
- **플레이스홀더**: 이미지 로딩 전 표시할 색상/패턴

### 7.2 상태 표시

- **업무 상태**: 색상 코드화된 배지(대기중, 진행중, 완료, 지연 등)
- **이슈 상태**: 색상 코드화된 배지(보고됨, 할당됨, 진행중, 해결됨 등)
- **건물 상태**: 색상 코드화된 표시(활성, 유지보수 중, 폐쇄 등)

### 7.3 오류 상태

- **인라인 오류**: 입력 필드 아래 빨간색 텍스트
- **토스트/스낵바**: 일시적 오류 메시지, 필요시 작업 취소 옵션
- **모달 오류**: 심각한 오류에 대한 전체 화면 다이얼로그

## 8. 접근성 가이드라인

### 8.1 색상 대비

- 텍스트와 배경 간 WCAG AA 수준 이상의 대비 비율 유지
- 색상에만 의존하지 않고 텍스트나 아이콘 등으로 정보 보강

### 8.2 포커스 관리

- 모든 인터랙티브 요소의 명확한 포커스 상태 제공
- 논리적인 탭 순서 유지

### 8.3 텍스트 크기 조정

- 사용자가 텍스트 크기를 조정할 수 있는 옵션 제공
- 텍스트 크기가 200%까지 확대되어도 기능 손실 없이 사용 가능

### 8.4 스크린 리더 지원

- 모든 중요 요소에 적절한 aria 레이블과 역할 부여
- 내비게이션 스킵 링크 제공

## 9. 모션 및 애니메이션

### 9.1 전환 애니메이션

- **페이지 전환**: 부드러운 페이드 전환, 300ms
- **요소 로딩**: 부드러운 페이드인, 150ms
- **카드 호버**: 약간의 그림자 증가 및 상승 효과, 150ms

### 9.2 상호작용 피드백

- **버튼 클릭**: 물결 효과, 색상 변화
- **스와이프 제스처**: 속도 기반 애니메이션, 모멘텀 효과
- **드래그 앤 드롭**: 물리적 느낌의 이동 애니메이션

### 9.3 접근성 고려사항

- 모든 애니메이션은 `prefers-reduced-motion` 미디어 쿼리 준수
- 중요하지 않은 애니메이션은 비활성화 가능하도록 설정

## 10. 모바일 최적화

### 10.1 터치 타겟

- 최소 터치 영역 48 \* 48px 유지
- 충분한 터치 요소 간 간격 유지 (최소 8px)

### 10.2 제스처 지원

- **스와이프**: 리스트 항목 액션 노출, 탭 전환
- **풀투리프레시**: 목록 새로고침
- **핀치 줌**: 이미지 확대/축소

### 10.3 오프라인 지원

- 오프라인 상태에서 기본 기능 사용 가능
- 네트워크 상태 변화 시 적절한 피드백 제공

## 11. 디자인 확장성

### 11.1 화이트 라벨링

- 고객사별 브랜딩 적용 가능한 디자인 시스템
- 주요 색상, 로고 등 쉽게 변경 가능한 구조

### 11.2 테마 지원

- 라이트/다크 테마 전환 지원
- 사용자 지정 테마 옵션

### 11.3 다국어 지원

- 텍스트 길이 변화에 대응하는 유연한 레이아웃
- RTL(right-to-left) 언어 지원을 위한 고려
