"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  priority: string;
  managerType: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function TaskTemplatesPage() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터링 상태
  const [managerTypeFilter, setManagerTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);

        // 필터링 파라미터 구성
        const params = new URLSearchParams();
        if (managerTypeFilter !== "all")
          params.append("managerType", managerTypeFilter);
        if (categoryFilter !== "all") params.append("category", categoryFilter);
        if (searchTerm) params.append("search", searchTerm);

        const response = await fetch(
          `/api/task-templates?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("업무 템플릿 목록을 가져오는데 실패했습니다");
        }

        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error("템플릿 목록 조회 오류:", err);
        setError("템플릿 목록을 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [managerTypeFilter, categoryFilter, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("이 템플릿을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/task-templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.tasksCount) {
          alert(
            `이 템플릿을 사용하는 ${errorData.tasksCount}개의 업무가 있어 삭제할 수 없습니다.`
          );
          return;
        }

        throw new Error("템플릿 삭제에 실패했습니다");
      }

      // 성공 시 목록에서 제거
      setTemplates(templates.filter((template) => template.id !== id));
    } catch (err) {
      console.error("템플릿 삭제 오류:", err);
      alert("템플릿 삭제 중 오류가 발생했습니다");
    }
  };

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

  // 우선순위에 따른 레이블
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "높음";
      case "MEDIUM":
        return "중간";
      case "LOW":
        return "낮음";
      default:
        return priority;
    }
  };

  if (loading)
    return (
      <div className="container mx-auto py-8 text-center">
        업무 템플릿 목록을 불러오는 중...
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">업무 템플릿 관리</h1>
        <div className="flex space-x-3">
          <Link href="/task-templates/stats">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              업무 템플릿 현황 보기
            </button>
          </Link>
          <Link href="/tasks/new?from=task-templates">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              업무 추가
            </button>
          </Link>
        </div>
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
      </div>

      {templates.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-gray-500">표시할 업무 템플릿이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-md overflow-hidden bg-white shadow-sm"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/task-templates/${template.id}`}
                    className="hover:text-blue-600"
                  >
                    {template.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                    {getManagerTypeLabel(template.managerType)}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                    {getCategoryLabel(template.category)}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                    우선순위: {getPriorityLabel(template.priority)}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
                <Link
                  href={`/task-templates/${template.id}`}
                  className="flex-grow"
                >
                  <button className="w-full px-3 py-1.5 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
                    업무 상태 관리
                  </button>
                </Link>
                <Link href={`/task-templates/${template.id}/edit`}>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                    수정
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded"
                >
                  삭제
                </button>
                <Link href={`/tasks/new?templateId=${template.id}`}>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded">
                    업무 생성
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
