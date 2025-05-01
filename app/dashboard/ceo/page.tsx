"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function CeoDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#121212]">
      {/* 상단 앱바 */}
      <header className="border-b border-[#E0E0E0] dark:border-[#333333] p-4 flex items-center justify-between bg-white dark:bg-[#1E1E1E] shadow-sm">
        <div className="flex items-center">
          {/* 햄버거 메뉴 아이콘 (모바일) */}
          <button
            className="md:hidden p-2 mr-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#333333] text-[#607D8B] dark:text-[#B0BEC5]"
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-[#263238] dark:text-white leading-tight">
            회사 대표 대시보드
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-[#F5F7FA] dark:hover:bg-[#333333]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#607D8B] dark:text-[#B0BEC5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <div className="flex items-center rounded-full bg-[#1E88E5] h-10 w-10 justify-center text-white font-medium">
            CEO
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* 모바일 오버레이 */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* 좌측 사이드바 (데스크탑) */}
        <aside className="hidden md:block w-56 min-h-[calc(100vh-136px)] border-r border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] p-4">
          <nav>
            <ul className="space-y-2">
              <li className="px-3 py-2 rounded-lg bg-[#1E88E5]/10 font-medium text-[#1E88E5] dark:text-[#1E88E5] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                메인
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                재무
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                전략
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                보고서
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                설정
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <Link href="/buildings" className="flex-1">
                  건물 관리
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 좌측 사이드바 (모바일) */}
        <aside
          className={`fixed top-0 left-0 z-30 w-64 h-full transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden transition-transform duration-300 ease-in-out bg-white dark:bg-[#1E1E1E] p-4 overflow-y-auto shadow-lg`}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center rounded-full bg-[#1E88E5] h-10 w-10 justify-center text-white font-medium">
              CEO
            </div>
            <button
              className="p-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#333333]"
              onClick={toggleSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#607D8B] dark:text-[#B0BEC5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav>
            <ul className="space-y-2">
              <li className="px-3 py-2 rounded-lg bg-[#1E88E5]/10 font-medium text-[#1E88E5] dark:text-[#1E88E5] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                메인
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                재무
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                전략
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                보고서
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                설정
              </li>
              <li className="px-3 py-2 rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <Link href="/buildings" className="flex-1">
                  건물 관리
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 p-8 space-y-8">
          {/* 핵심 지표 카드 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm hover:shadow transition-shadow p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-[#263238] dark:text-white">
                    총 수익
                  </h3>
                  <p className="text-[#607D8B] dark:text-[#B0BEC5] text-sm">
                    이번 달
                  </p>
                </div>
                <div className="p-2 bg-[#1E88E5]/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#1E88E5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#263238] dark:text-white">
                ₩256,850,000
              </p>
              <div className="flex items-center mt-2">
                <span className="text-[#43A047] bg-[#43A047]/10 px-2 py-1 rounded text-xs font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  8.2%
                </span>
                <span className="text-[#607D8B] dark:text-[#B0BEC5] text-xs ml-2">
                  전월 대비
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm hover:shadow transition-shadow p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-[#263238] dark:text-white">
                    총 지출
                  </h3>
                  <p className="text-[#607D8B] dark:text-[#B0BEC5] text-sm">
                    이번 달
                  </p>
                </div>
                <div className="p-2 bg-[#26A69A]/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#26A69A]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#263238] dark:text-white">
                ₩98,320,000
              </p>
              <div className="flex items-center mt-2">
                <span className="text-[#E53935] bg-[#E53935]/10 px-2 py-1 rounded text-xs font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  3.4%
                </span>
                <span className="text-[#607D8B] dark:text-[#B0BEC5] text-xs ml-2">
                  전월 대비
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm hover:shadow transition-shadow p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-[#263238] dark:text-white">
                    건물 수
                  </h3>
                  <p className="text-[#607D8B] dark:text-[#B0BEC5] text-sm">
                    현재 관리 중
                  </p>
                </div>
                <div className="p-2 bg-[#1E88E5]/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#1E88E5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <Link href="/buildings" className="block">
                <p className="text-2xl font-bold text-[#263238] dark:text-white">
                  12
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-[#43A047] bg-[#43A047]/10 px-2 py-1 rounded text-xs font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    2
                  </span>
                  <span className="text-[#607D8B] dark:text-[#B0BEC5] text-xs ml-2">
                    전년 대비
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* 알림 및 차트 섹션 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#263238] dark:text-white">
                  최근 주요 알림
                </h2>
                <button className="text-[#1E88E5] hover:underline text-sm font-medium">
                  모두 보기
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start p-3 hover:bg-[#F5F7FA] dark:hover:bg-[#333333] rounded-lg transition-colors">
                  <div className="p-2 bg-[#FFA000]/10 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#FFA000]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#263238] dark:text-white font-medium">
                      센트럴 타워 유지보수 필요
                    </p>
                    <p className="text-[#607D8B] dark:text-[#B0BEC5] text-sm">
                      냉방 시스템 점검 요청이 승인 대기 중입니다.
                    </p>
                    <p className="text-[#9E9E9E] text-xs mt-1">2시간 전</p>
                  </div>
                </div>
                <div className="flex items-start p-3 hover:bg-[#F5F7FA] dark:hover:bg-[#333333] rounded-lg transition-colors">
                  <div className="p-2 bg-[#43A047]/10 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#43A047]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#263238] dark:text-white font-medium">
                      계약 자동 갱신 완료
                    </p>
                    <p className="text-[#607D8B] dark:text-[#B0BEC5] text-sm">
                      그랜드 오피스 임대 계약이 자동 갱신되었습니다.
                    </p>
                    <p className="text-[#9E9E9E] text-xs mt-1">오늘</p>
                  </div>
                </div>
                <div className="flex items-start p-3 hover:bg-[#F5F7FA] dark:hover:bg-[#333333] rounded-lg transition-colors">
                  <div className="p-2 bg-[#E53935]/10 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#E53935]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#263238] dark:text-white font-medium">
                      비용 초과 알림
                    </p>
                    <p className="text-[#607D8B] dark:text-[#B0BEC5] text-sm">
                      스카이 빌딩 유지보수 비용이 예산을 초과했습니다.
                    </p>
                    <p className="text-[#9E9E9E] text-xs mt-1">어제</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#263238] dark:text-white">
                  월별 수익 추이
                </h2>
                <select className="text-sm border-[#E0E0E0] dark:border-[#333333] rounded-lg p-2 bg-white dark:bg-[#1E1E1E] text-[#607D8B] dark:text-[#B0BEC5]">
                  <option>최근 6개월</option>
                  <option>최근 12개월</option>
                  <option>최근 3개월</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center">
                <p className="text-[#607D8B] dark:text-[#B0BEC5] text-sm">
                  [차트 시각화 영역]
                </p>
              </div>
            </div>
          </section>

          {/* 건물 포트폴리오 맵 */}
          <section className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 border border-[#E0E0E0] dark:border-[#333333]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#263238] dark:text-white">
                건물 포트폴리오 맵
              </h2>
              <div className="flex space-x-2">
                <button className="text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5] dark:hover:text-[#1E88E5] p-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#333333]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
                <button className="text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5] dark:hover:text-[#1E88E5] p-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#333333]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-96 flex items-center justify-center bg-[#F5F7FA] dark:bg-[#333333] rounded-lg">
              <p className="text-[#607D8B] dark:text-[#B0BEC5] text-sm">
                [지역별 건물 분포 인터랙티브 맵]
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* 푸터 */}
      <footer className="border-t border-[#E0E0E0] dark:border-[#333333] p-4 text-center bg-white dark:bg-[#1E1E1E] text-[#9E9E9E] text-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 빌딩메이트 All rights reserved.</p>
          <div className="mt-2 md:mt-0">
            <span className="mx-2 hover:text-[#1E88E5] cursor-pointer">
              회사 정보
            </span>
            <span className="mx-2 hover:text-[#1E88E5] cursor-pointer">
              도움말
            </span>
            <span className="mx-2 hover:text-[#1E88E5] cursor-pointer">
              버전 정보
            </span>
            <span className="mx-2 hover:text-[#1E88E5] cursor-pointer">
              저작권 정보
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
