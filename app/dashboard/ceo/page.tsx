import React from "react";

export default function CeoDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          회사 대표 대시보드
        </h1>
      </header>
      <div className="flex">
        <aside className="hidden md:block w-56 min-h-[600px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <nav>
            <ul className="space-y-2">
              <li className="font-semibold text-blue-600">메인</li>
              <li>재무</li>
              <li>전략</li>
              <li>보고서</li>
              <li>설정</li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              핵심 성과지표 (차트/그래프)
            </div>
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              최근 주요 알림 (목록/배지)
            </div>
          </section>
          <section className="bg-white dark:bg-gray-800 rounded shadow p-6">
            건물 포트폴리오 맵 뷰 (지역별 건물 분포 인터랙티브 맵)
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              월별 수익 추이 (라인 차트)
            </div>
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              주요 비용 분석 (파이 차트)
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
