import React from "react";

export default function AccountingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          회계 담당자 대시보드
        </h1>
      </header>
      <div className="flex">
        <aside className="hidden md:block w-56 min-h-[600px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <nav>
            <ul className="space-y-2">
              <li className="font-semibold text-blue-600">메인</li>
              <li>비용</li>
              <li>수익</li>
              <li>보고서</li>
              <li>설정</li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8 space-y-8">
          <section className="bg-white dark:bg-gray-800 rounded shadow p-6">
            월별 재무 요약 (수익/지출/순이익 복합 차트)
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              예산 대비 지출 (진행 바 차트)
            </div>
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              현금 흐름 상태 (라인 차트)
            </div>
          </section>
          <section className="bg-white dark:bg-gray-800 rounded shadow p-6">
            건물별 재무 현황 비교 (데이터 테이블/히트맵)
          </section>
          <section className="bg-white dark:bg-gray-800 rounded shadow p-6">
            회계 업무 일정 (캘린더/타임라인 뷰)
          </section>
        </main>
      </div>
      <footer className="border-t border-gray-200 dark:border-gray-700 p-4 text-center bg-white dark:bg-gray-800 mt-8 text-gray-500 text-sm">
        회사 정보 | 도움말 | 버전 정보 | 저작권 정보
      </footer>
    </div>
  );
}
