import React from "react";

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          건물 소장 대시보드
        </h1>
      </header>
      <div className="flex">
        <aside className="hidden md:block w-56 min-h-[600px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <nav>
            <ul className="space-y-2">
              <li className="font-semibold text-blue-600">메인</li>
              <li>이슈</li>
              <li>업무</li>
              <li>임차인</li>
              <li>인력</li>
              <li>설정</li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              건물 상태 (상태 인디케이터)
            </div>
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              직원 출근 (상태 패널)
            </div>
          </section>
          <section className="bg-white dark:bg-gray-800 rounded shadow p-6">
            최근 보고된 이슈 및 민원 (우선순위별 색상 구분 카드형 목록)
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              예정된 유지보수 (일정 타임라인)
            </div>
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              오늘의 업무 상태 (진행 상태 차트)
            </div>
          </section>
        </main>
      </div>
      <footer className="border-t border-gray-200 dark:border-gray-700 p-4 text-center bg-white dark:bg-gray-800 mt-8 text-gray-500 text-sm">
        회사 정보 | 도움말 | 버전 정보 | 저작권 정보
      </footer>
    </div>
  );
}
