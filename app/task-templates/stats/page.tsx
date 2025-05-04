"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface TaskTemplateStats {
  id: string;
  title: string;
  description: string;
  priority: string;
  managerType: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  totalTasks: number;
  completedTasks: number;
}

export default function TaskTemplatesStatsPage() {
  const [templates, setTemplates] = useState<TaskTemplateStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터링 상태
  const [managerTypeFilter, setManagerTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  useEffect(() => {
    const fetchTemplatesStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tasks/templates/stats`);

        if (!response.ok) {
          throw new Error("업무 템플릿 통계를 가져오는데 실패했습니다");
        }

        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error("템플릿 통계 조회 오류:", err);
        setError("템플릿 통계를 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplatesStats();
  }, []);

  // 필터링된 템플릿 목록 계산
  const filteredTemplates = templates.filter((template) => {
    // 관리자 유형 필터링
    if (
      managerTypeFilter !== "all" &&
      template.managerType !== managerTypeFilter
    ) {
      return false;
    }

    // 카테고리 필터링
    if (categoryFilter !== "all" && template.category !== categoryFilter) {
      return false;
    }

    // 검색어 필터링
    if (
      searchTerm &&
      !template.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !template.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 정렬
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "completionRate") {
      const rateA =
        a.totalTasks > 0 ? (a.completedTasks / a.totalTasks) * 100 : 0;
      const rateB =
        b.totalTasks > 0 ? (b.completedTasks / b.totalTasks) * 100 : 0;
      return sortOrder === "asc" ? rateA - rateB : rateB - rateA;
    } else if (sortBy === "totalTasks") {
      return sortOrder === "asc"
        ? a.totalTasks - b.totalTasks
        : b.totalTasks - a.totalTasks;
    } else if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      // 기본 정렬: 생성일 또는 업데이트일
      const dateA = new Date(
        a[sortBy as keyof TaskTemplateStats] as string
      ).getTime();
      const dateB = new Date(
        b[sortBy as keyof TaskTemplateStats] as string
      ).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
  });

  // 관리자 유형에 따른 레이블
  const getManagerTypeLabel = (type: string) => {
    switch (type) {
      case "ADMIN":
        return "관리책임자";
      case "BIZ":
        return "경영책임자";
      case "BOTH":
        return "공통";
      default:
        return type;
    }
  };

  // 카테고리에 따른 레이블
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "MAINTENANCE":
        return "유지보수";
      case "SECURITY":
        return "보안";
      case "CLEANING":
        return "청소";
      case "INSPECTION":
        return "점검";
      case "FACILITY":
        return "시설관리";
      case "CONTRACT":
        return "계약관리";
      case "FINANCIAL":
        return "재무관리";
      case "TENANT":
        return "입주자관리";
      case "OTHER":
        return "기타";
      default:
        return category;
    }
  };

  // 정렬 처리 함수
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // 같은 컬럼으로 정렬 중이면 정렬 방향만 변경
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 다른 컬럼으로 정렬 시 해당 컬럼으로 변경하고 내림차순 기본값으로
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl">업무 템플릿 통계를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">업무 템플릿 현황</h1>
        <Link href="/task-templates">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            템플릿 목록으로 이동
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <div>
          <label className="block text-sm mb-1">담당자 유형</label>
          <select
            value={managerTypeFilter}
            onChange={(e) => setManagerTypeFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">모든 유형</option>
            <option value="ADMIN">관리책임자</option>
            <option value="BIZ">경영책임자</option>
            <option value="BOTH">공통</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">카테고리</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">모든 카테고리</option>
            <option value="MAINTENANCE">유지보수</option>
            <option value="SECURITY">보안</option>
            <option value="CLEANING">청소</option>
            <option value="INSPECTION">점검</option>
            <option value="FACILITY">시설관리</option>
            <option value="CONTRACT">계약관리</option>
            <option value="FINANCIAL">재무관리</option>
            <option value="TENANT">입주자관리</option>
            <option value="OTHER">기타</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">검색</label>
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="템플릿 검색..."
              className="p-2 border rounded-l-md w-64"
            />
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 py-2 bg-gray-200 rounded-r-md"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="ml-auto">
          <label className="block text-sm mb-1">정렬 기준</label>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="createdAt">생성일</option>
            <option value="updatedAt">수정일</option>
            <option value="title">이름</option>
            <option value="completionRate">완료율</option>
            <option value="totalTasks">업무 수</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="ml-2 p-2 border rounded-md"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {sortedTemplates.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-gray-500">표시할 업무 템플릿이 없습니다</p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    템플릿 명
                    {sortBy === "title" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  유형
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  카테고리
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort("totalTasks")}
                >
                  <div className="flex items-center">
                    업무 수
                    {sortBy === "totalTasks" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort("completionRate")}
                >
                  <div className="flex items-center">
                    완료율
                    {sortBy === "completionRate" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                >
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedTemplates.map((template) => {
                const completionRate =
                  template.totalTasks > 0
                    ? Math.round(
                        (template.completedTasks / template.totalTasks) * 100
                      )
                    : 0;

                return (
                  <tr
                    key={template.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      window.location.href = `/task-templates/${template.id}`;
                    }}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                      <div className="font-medium text-gray-900 hover:text-blue-600">
                        <Link href={`/task-templates/${template.id}`}>
                          {template.title}
                        </Link>
                      </div>
                      <div className="text-gray-500 line-clamp-1">
                        {template.description}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                        {getManagerTypeLabel(template.managerType)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                        {getCategoryLabel(template.category)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {template.totalTasks}개
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-24">
                          <div
                            className={`h-2.5 rounded-full ${
                              completionRate >= 80
                                ? "bg-green-500"
                                : completionRate >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span>
                          {completionRate}% ({template.completedTasks}/
                          {template.totalTasks})
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                      <Link
                        href={`/task-templates/${template.id}`}
                        className="inline-block px-4 py-1.5 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                        onClick={(e) => {
                          e.stopPropagation(); // 이벤트 버블링 방지
                        }}
                      >
                        템플릿 상세 보기
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
