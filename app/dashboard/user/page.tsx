import React from "react";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          일반 유저 대시보드
        </h1>
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <section className="bg-white dark:bg-gray-800 rounded shadow p-8 text-center space-y-4">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            환영합니다! 현재 계정은 일반 유저 권한입니다.
          </div>
          <div className="text-gray-500 dark:text-gray-300">
            권한이 필요한 기능은 관리자에게 문의해 주세요.
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-700 p-4 text-center bg-white dark:bg-gray-800 text-gray-500 text-sm">
        회사 정보 | 도움말 | 버전 정보 | 저작권 정보
      </footer>
    </div>
  );
}
