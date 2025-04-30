"use client";
import React, { useState } from "react";

export default function ManagerDashboard() {
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
            건물 소장 대시보드
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
          <div className="flex items-center rounded-full bg-[#26A69A] h-10 w-10 justify-center text-white font-medium">
            소장
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
              <li className="px-3 py-2 rounded-lg bg-[#26A69A]/10 font-medium text-[#26A69A] flex items-center">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                이슈
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                업무
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                임차인
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                인력
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
            <div className="flex items-center rounded-full bg-[#26A69A] h-10 w-10 justify-center text-white font-medium">
              소장
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
              <li className="px-3 py-2 rounded-lg bg-[#26A69A]/10 font-medium text-[#26A69A] flex items-center">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                이슈
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                업무
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                임차인
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                인력
              </li>
            </ul>
          </nav>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 p-8 space-y-6">
          {/* 상태 요약 카드 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#263238] dark:text-white">
                  건물 상태
                </h2>
                <span className="px-2 py-1 bg-[#43A047]/10 text-[#43A047] rounded-full text-xs font-medium">
                  정상
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#607D8B] dark:text-[#B0BEC5]">
                    냉난방
                  </span>
                  <span className="text-[#43A047] font-medium">정상</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#607D8B] dark:text-[#B0BEC5]">
                    전기
                  </span>
                  <span className="text-[#43A047] font-medium">정상</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#607D8B] dark:text-[#B0BEC5]">
                    수도
                  </span>
                  <span className="text-[#FFA000] font-medium">점검 필요</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#607D8B] dark:text-[#B0BEC5]">
                    엘리베이터
                  </span>
                  <span className="text-[#43A047] font-medium">정상</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#263238] dark:text-white">
                  직원 출근 현황
                </h2>
                <span className="text-[#26A69A] text-sm font-medium">
                  8/10명
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#1E88E5] text-white flex items-center justify-center mr-3">
                    김
                  </div>
                  <span className="text-[#263238] dark:text-white">김건물</span>
                  <span className="ml-auto px-2 py-1 bg-[#43A047]/10 text-[#43A047] rounded text-xs">
                    출근
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#26A69A] text-white flex items-center justify-center mr-3">
                    이
                  </div>
                  <span className="text-[#263238] dark:text-white">이관리</span>
                  <span className="ml-auto px-2 py-1 bg-[#43A047]/10 text-[#43A047] rounded text-xs">
                    출근
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFA000] text-white flex items-center justify-center mr-3">
                    박
                  </div>
                  <span className="text-[#263238] dark:text-white">박시설</span>
                  <span className="ml-auto px-2 py-1 bg-[#E53935]/10 text-[#E53935] rounded text-xs">
                    미출근
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 이슈 및 민원 섹션 */}
          <section className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 border border-[#E0E0E0] dark:border-[#333333]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#263238] dark:text-white">
                최근 보고된 이슈 및 민원
              </h2>
              <button className="text-[#26A69A] hover:underline text-sm font-medium">
                모두 보기
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex border-l-4 border-[#E53935] p-4 rounded-lg bg-white dark:bg-[#1E1E1E] shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="px-2 py-1 bg-[#E53935]/10 text-[#E53935] rounded text-xs font-medium mr-2">
                      긴급
                    </span>
                    <h3 className="font-medium text-[#263238] dark:text-white">
                      수도관 누수 발생
                    </h3>
                  </div>
                  <p className="text-sm text-[#607D8B] dark:text-[#B0BEC5]">
                    3층 복도 화장실 앞 수도관에서 누수가 발생하여 즉시 조치가
                    필요합니다.
                  </p>
                  <div className="flex justify-between mt-2 text-xs text-[#9E9E9E]">
                    <span>위치: 3층 복도</span>
                    <span>보고자: 김건물</span>
                    <span>30분 전</span>
                  </div>
                </div>
              </div>

              <div className="flex border-l-4 border-[#FFA000] p-4 rounded-lg bg-white dark:bg-[#1E1E1E] shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="px-2 py-1 bg-[#FFA000]/10 text-[#FFA000] rounded text-xs font-medium mr-2">
                      중요
                    </span>
                    <h3 className="font-medium text-[#263238] dark:text-white">
                      주차장 CCTV 고장
                    </h3>
                  </div>
                  <p className="text-sm text-[#607D8B] dark:text-[#B0BEC5]">
                    지하 1층 주차장 3번 CCTV가 작동하지 않습니다. 확인
                    부탁드립니다.
                  </p>
                  <div className="flex justify-between mt-2 text-xs text-[#9E9E9E]">
                    <span>위치: 지하 1층</span>
                    <span>보고자: 이관리</span>
                    <span>2시간 전</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 업무 및 유지보수 섹션 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <h2 className="text-xl font-semibold text-[#263238] dark:text-white mb-4">
                예정된 유지보수
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 hover:bg-[#F5F7FA] dark:hover:bg-[#333333] rounded-lg">
                  <div className="w-12 text-center mr-4">
                    <div className="text-[#1E88E5] text-lg font-bold">18</div>
                    <div className="text-xs text-[#607D8B] dark:text-[#B0BEC5]">
                      5월
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-[#263238] dark:text-white">
                      냉방 시스템 정기 점검
                    </p>
                    <p className="text-sm text-[#607D8B] dark:text-[#B0BEC5]">
                      오전 10:00 - 오후 2:00
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 hover:bg-[#F5F7FA] dark:hover:bg-[#333333] rounded-lg">
                  <div className="w-12 text-center mr-4">
                    <div className="text-[#1E88E5] text-lg font-bold">25</div>
                    <div className="text-xs text-[#607D8B] dark:text-[#B0BEC5]">
                      5월
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-[#263238] dark:text-white">
                      소방 안전 설비 점검
                    </p>
                    <p className="text-sm text-[#607D8B] dark:text-[#B0BEC5]">
                      오전 9:00 - 오후 1:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 border border-[#E0E0E0] dark:border-[#333333]">
              <h2 className="text-xl font-semibold text-[#263238] dark:text-white mb-4">
                오늘의 업무 상태
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#607D8B] dark:text-[#B0BEC5]">
                      완료됨
                    </span>
                    <span className="text-sm font-medium text-[#263238] dark:text-white">
                      4/8
                    </span>
                  </div>
                  <div className="w-full bg-[#F5F7FA] dark:bg-[#333333] rounded-full h-2">
                    <div
                      className="bg-[#26A69A] h-2 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#43A047] mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#263238] dark:text-white">
                    로비 청소
                  </span>
                </div>
                <div className="flex items-center p-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#9E9E9E] mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#607D8B] dark:text-[#B0BEC5]">
                    화장실 소모품 교체
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 푸터 */}
      <footer className="border-t border-[#E0E0E0] dark:border-[#333333] p-4 text-center bg-white dark:bg-[#1E1E1E] text-[#9E9E9E] text-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 빌딩메이트 All rights reserved.</p>
          <div className="mt-2 md:mt-0">
            <span className="mx-2 hover:text-[#26A69A] cursor-pointer">
              회사 정보
            </span>
            <span className="mx-2 hover:text-[#26A69A] cursor-pointer">
              도움말
            </span>
            <span className="mx-2 hover:text-[#26A69A] cursor-pointer">
              버전 정보
            </span>
            <span className="mx-2 hover:text-[#26A69A] cursor-pointer">
              저작권 정보
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
