"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Building {
  id: string;
  name: string;
  address: string;
}

interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  priority: string;
  managerType: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function NewTaskPage() {
  const router = useRouter();

  // 데이터 로딩 상태
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 데이터 목록
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // 필터링 상태
  const [selectedManagerType, setSelectedManagerType] = useState<string>("all");

  // 폼 데이터
  const [formData, setFormData] = useState({
    buildingIds: [] as string[],
    allBuildings: false,
    templateId: "",
    assigneeId: "",
    dueDate: "",
  });

  // 에러 메시지
  const [error, setError] = useState<string | null>(null);

  // 건물 목록 로드
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch("/api/buildings");
        if (!response.ok) {
          throw new Error("건물 목록을 가져오는데 실패했습니다");
        }
        const data = await response.json();
        setBuildings(data);
      } catch (err) {
        console.error("건물 목록 로드 오류:", err);
        setError("건물 목록을 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoadingBuildings(false);
      }
    };

    fetchBuildings();
  }, []);

  // 업무 템플릿 목록 로드
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // 관리자 유형 필터 적용
        const queryParams =
          selectedManagerType !== "all"
            ? `?managerType=${selectedManagerType}`
            : "";

        const response = await fetch(`/api/task-templates${queryParams}`);
        if (!response.ok) {
          throw new Error("업무 템플릿 목록을 가져오는데 실패했습니다");
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error("업무 템플릿 로드 오류:", err);
        setError("업무 템플릿을 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [selectedManagerType]);

  // 사용자 목록 로드
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("사용자 목록을 가져오는데 실패했습니다");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("사용자 목록 로드 오류:", err);
        // 사용자 목록은 옵션이므로 실패 시 빈 배열로 처리
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // 입력 필드 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
      // 모든 건물 옵션을 선택하면 건물 목록 선택 초기화
      ...(name === "allBuildings" && checked ? { buildingIds: [] } : {}),
    });
  };

  // 건물 선택 변경 핸들러
  const handleBuildingSelection = (buildingId: string) => {
    const isSelected = formData.buildingIds.includes(buildingId);
    let newBuildingIds: string[];

    if (isSelected) {
      // 선택 해제
      newBuildingIds = formData.buildingIds.filter((id) => id !== buildingId);
    } else {
      // 선택 추가
      newBuildingIds = [...formData.buildingIds, buildingId];
    }

    setFormData({
      ...formData,
      buildingIds: newBuildingIds,
      // 건물을 선택하면 '모든 건물' 옵션은 해제
      allBuildings: false,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.templateId) {
      alert("업무 템플릿은 필수 항목입니다");
      return;
    }

    if (!formData.allBuildings && formData.buildingIds.length === 0) {
      alert(
        "최소 하나의 건물을 선택하거나 '모든 건물에 적용' 옵션을 선택해주세요"
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          creatorId: "현재로그인한사용자ID", // 실제 구현시 세션에서 가져옴
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "업무 생성에 실패했습니다");
      }

      const data = await response.json();
      alert(data.message || "업무가 성공적으로 생성되었습니다");
      router.push("/tasks");
    } catch (err: unknown) {
      console.error("업무 생성 오류:", err);
      const errorMessage =
        err instanceof Error ? err.message : "업무 생성에 실패했습니다";
      alert(errorMessage);
      setSubmitting(false);
    }
  };

  // 데이터 로딩 중일 때
  const isLoading = loadingBuildings || loadingTemplates || loadingUsers;

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">새 업무 추가</h1>
        <Link href="/tasks">
          <button className="px-4 py-2 bg-gray-200 rounded">
            목록으로 돌아가기
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 p-6 bg-white rounded-md shadow-sm">
          {/* 업무 템플릿 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              담당자 유형 필터
            </label>
            <select
              value={selectedManagerType}
              onChange={(e) => setSelectedManagerType(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isLoading || submitting}
            >
              <option value="all">모든 유형</option>
              <option value="ADMIN">관리책임자</option>
              <option value="BIZ">경영책임자</option>
              <option value="BOTH">공통</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              업무 템플릿 선택*
            </label>
            <select
              name="templateId"
              value={formData.templateId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={isLoading || submitting}
              required
            >
              <option value="">업무 템플릿 선택</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title} ({getManagerTypeLabel(template.managerType)})
                </option>
              ))}
            </select>

            {formData.templateId && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                {templates.find((t) => t.id === formData.templateId)
                  ?.description || ""}
              </div>
            )}
          </div>

          {/* 건물 선택 섹션 */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-medium text-gray-800">건물 선택*</h3>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  id="allBuildings"
                  name="allBuildings"
                  checked={formData.allBuildings}
                  onChange={handleCheckboxChange}
                  disabled={isLoading || submitting}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="allBuildings"
                  className="text-sm font-medium text-gray-700"
                >
                  모든 건물에 적용
                </label>
              </div>
            </div>

            {!formData.allBuildings && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {buildings.map((building) => (
                  <div
                    key={building.id}
                    onClick={() => handleBuildingSelection(building.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.buildingIds.includes(building.id)
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={formData.buildingIds.includes(building.id)}
                        onChange={() => {}} // 변경은 div 클릭으로 처리
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        disabled={isLoading || submitting}
                      />
                      <div>
                        <p className="font-medium">{building.name}</p>
                        <p className="text-sm text-gray-500">
                          {building.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.allBuildings && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700">
                  모든 건물에 업무가 할당됩니다. ({buildings.length}개 건물)
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              담당자 지정
            </label>
            <select
              name="assigneeId"
              value={formData.assigneeId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={isLoading || submitting}
            >
              <option value="">
                담당자 미지정 (템플릿 유형에 따라 자동 할당)
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              담당자를 지정하지 않으면 템플릿 유형에 따라 건물의 관리책임자나
              경영책임자에게 자동 할당됩니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              마감일
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={isLoading || submitting}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link href="/tasks">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              disabled={submitting}
            >
              취소
            </button>
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={isLoading || submitting}
          >
            {submitting ? "생성 중..." : "업무 생성"}
          </button>
        </div>
      </form>
    </div>
  );
}
