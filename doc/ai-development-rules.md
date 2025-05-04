# 빌딩메이트 AI 개발 규칙

이 문서는 빌딩메이트 프로젝트 개발 시 AI 코드 생성 도구를 사용할 때 지켜야 할 규칙을 정리한 것입니다. 일관된 코드 스타일과 품질을 유지하기 위해 이 규칙들을 준수해야 합니다.

## 일반 규칙

1. Next.js 15.3.1 버전에 호환되는 코드만 생성합니다.
2. TypeScript 타입 정의를 철저히 하며, any 타입은 최대한 피합니다.
3. React 19.0의 새로운 기능을 적극적으로 활용합니다.
4. 코드는 가능한 한 간결하고 효율적으로 작성합니다.
5. 컴포넌트는 항상 클라이언트 컴포넌트와 서버 컴포넌트를 명확히 구분합니다.

## Next.js 15.3.1 API 라우트 규칙

1. **API 라우트에서 params, searchParams는 Promise로 다룹니다.**

   - Next.js 15.3.1에서 params, searchParams, cookies, headers 등이 모두 Promise 타입으로 변경되었습니다.
   - 반드시 await를 사용하여 비동기적으로 접근해야 합니다.

2. **API 라우트 핸들러 함수에서 올바른 타입 지정:**

   ```typescript
   // ✅ 올바른 방법 (Next.js 15.3.1)
   interface RouteParams {
     id: string;
   }

   export async function GET(
     req: Request,
     context: { params: Promise<RouteParams> }
   ) {
     // params에 접근할 때 await 필수
     const params = await context.params;
     const { id } = params;

     // ... 나머지 로직
   }
   ```

3. **잘못된 방법 (사용 금지):**

   ```typescript
   // ❌ 잘못된 방법 (Next.js 15.3.1 이전 버전)
   export async function GET(
     req: Request,
     { params }: { params: { id: string } }
   ) {
     const { id } = params; // 오류 발생! params는 Promise 타입입니다.

     // ... 나머지 로직
   }
   ```

4. **searchParams 처리 방법:**

   ```typescript
   // ✅ 올바른 방법 (Next.js 15.3.1)
   export async function GET(req: Request) {
     // URL에서 searchParams 추출
     const { searchParams } = new URL(req.url);
     const id = searchParams.get("id");

     // ... 나머지 로직
   }
   ```

5. **다이나믹 라우트의 타입 정의 패턴:**

   ```typescript
   // 여러 파라미터가 있는 경우
   interface ComplexRouteParams {
     slug: string;
     id: string;
   }

   export async function GET(
     req: Request,
     context: { params: Promise<ComplexRouteParams> }
   ) {
     const params = await context.params;
     const { slug, id } = params;

     // ... 나머지 로직
   }
   ```

이 패턴을 모든 API 라우트 파일에 일관되게 적용하여 타입 오류를 방지하세요. 기존 코드를 수정할 때 이 패턴을 적용하는 것을 잊지 마세요.

## UI 컴포넌트 사용 규칙

1. UI 컴포넌트는 shadcn/ui를 사용합니다.
2. **shadcn-ui 패키지 대신 반드시 shadcn 패키지를 사용합니다.**

   ```bash
   # 잘못된 사용법 (사용 금지)
   npx shadcn-ui@latest add [component-name]

   # 올바른 사용법
   npx shadcn@latest add [component-name]
   ```

3. UI 컴포넌트 추가 시 React 19와의 호환성 충돌이 발생할 경우 `--force` 옵션을 사용합니다.
4. 커스텀 컴포넌트 개발 시에도 shadcn의 디자인 시스템을 따릅니다.

## UI 상호작용 규칙

1. **클릭 가능한 요소의 상호작용:**

   - 리스트 형태의 UI에서 전체 항목을 클릭할 수 있게 할 경우, 항목 전체를 `Link` 컴포넌트로 감싸야 합니다.
   - 항목 내부에 추가 버튼이나 액션이 있을 경우, 이벤트 버블링을 방지하기 위해 `onClick={(e) => e.stopPropagation()}` 처리가 필요합니다.

2. **명확한 사용자 액션 텍스트:**

   - 버튼이나 링크 텍스트는 항상 명확하고 직관적으로 작성합니다.
   - 일반적인 텍스트("더 보기", "모두 보기") 대신 구체적인 액션("업무 템플릿 현황 보기", "템플릿 상세 보기")을 사용합니다.

3. **데이터 로딩 상태 처리:**

   - 데이터 로딩 중인 상태에는 항상 로딩 인디케이터나 스켈레톤 UI를 표시합니다.
   - 데이터가 없는 경우 사용자에게 명확한 안내 메시지를 제공합니다.

4. **목록과 상세 페이지 연결:**
   - 목록 페이지에서 항목 클릭 시 해당 항목의 상세 페이지로 이동하는 것이 기본 패턴입니다.
   - 목록 항목마다 "상세 보기" 같은 명시적 링크나 버튼을 제공합니다.

## 컴포넌트에서 Next.js 15.3.1 API 사용 규칙

1. **컴포넌트에서 Promise 기반 API 접근 시 React.use() 사용:**

   ```typescript
   // ✅ 올바른 방법 (Next.js 15.3.1 & React 19)
   import { use } from "react";

   interface PageProps {
     params: { id: string };
     searchParams: { q?: string };
   }

   export default function Page({ params, searchParams }: PageProps) {
     // React.use()로 Promise 값에 접근
     const { id } = use(params);
     const { q } = use(searchParams);

     // ... 나머지 로직
   }
   ```

2. **타입스크립트 오류 처리:**
   ```typescript
   // 타입스크립트 오류가 발생하는 경우
   // @ts-expect-error Next.js 15.3.1 Promise API
   const { id } = use(params);
   ```

## 상태 관리 규칙

1. 전역 상태 관리는 최소화하고, 필요한 경우에만 React Context를 사용합니다.
2. 컴포넌트 상태는 React hooks를 활용하여 관리합니다.
3. 비동기 데이터 요청은 try-catch 구문으로 오류를 명시적으로 처리합니다.

## API 요청 규칙

1. API 요청은 fetch API를 사용합니다.
2. API 응답에 대한 타입을 명확히 정의합니다.
3. API 요청 시 로딩 상태와 오류 상태를 항상 처리합니다.

## 파일 및 폴더 구조 규칙

1. 페이지 컴포넌트는 app 디렉토리 내에 위치시킵니다.
2. 재사용 가능한 컴포넌트는 components 디렉토리에 배치합니다.
3. UI 관련 컴포넌트는 components/ui 디렉토리에 저장합니다.
4. 유틸리티 함수는 lib 디렉토리에 배치합니다.

## 성능 최적화 규칙

1. 불필요한 리렌더링을 방지하기 위해 메모이제이션 기법을 적절히 사용합니다.
2. 이미지는 Next.js의 Image 컴포넌트를 사용하여 최적화합니다.
3. 큰 데이터셋은 페이지네이션을 적용하여 처리합니다.

## 데이터베이스(Prisma 등) 관련 규칙

1. 데이터베이스와 관련된 코드를 생성하거나 수정할 때는 반드시 실제 DB 스키마(예: schema.prisma)에서 해당 필드가 존재하는지 먼저 확인해야 한다.
2. 같은 의미의 필드인데 이름이 다르면, 코드와 DB 중 한쪽의 이름을 일치시키고, 일치시킨 이유를 주석 등으로 명확히 남긴다.
3. 필요한 필드가 DB에 아예 없으면, 스키마에 필드를 추가하고 마이그레이션을 적용한 후에 코드를 작성한다.
4. DB 스키마와 코드가 항상 동기화되도록 관리하며, 불일치로 인한 타입 에러/런타임 에러가 발생하지 않도록 한다.
5. 위 규칙을 어기면 빌드/테스트 단계에서 반드시 에러가 발생하므로, 사전에 꼼꼼히 확인한다.

이 규칙들은 프로젝트 진행에 따라 지속적으로 업데이트될 수 있습니다.
