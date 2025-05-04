"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";

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

interface Building {
  id: string;
  name: string;
  address: string;
  imageUrl: string | null;
  taskStats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
  latestTask: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
  } | null;
}

interface TemplateStatus {
  template: TaskTemplate;
  buildings: Building[];
}

interface TemplateParams {
  id: string;
}

interface TemplatePageProps {
  params: Promise<TemplateParams>;
}

export default function TemplateStatusPage({ params }: TemplatePageProps) {
  const { id } = use(params);

  const [data, setData] = useState<TemplateStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "incomplete" | "complete"
  >("overview");

  useEffect(() => {
    const fetchTemplateStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/task-templates/${id}/status`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("업무 템플릿을 찾을 수 없습니다");
          }
          throw new Error("템플릿 상태 정보를 가져오는데 실패했습니다");
        }

        const templateData = await response.json();
        setData(templateData);
      } catch (err) {
        console.error("템플릿 상태 조회 오류:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("템플릿 상태를 불러오는 중 오류가 발생했습니다");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateStatus();
  }, [id]);

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

  // 업무 상태에 따른 레이블
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기 중";
      case "IN_PROGRESS":
        return "진행 중";
      case "COMPLETED":
        return "완료";
      default:
        return status;
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl">템플릿 상태 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link
            href="/task-templates"
            className="text-blue-600 hover:underline"
          >
            &larr; 템플릿 목록으로 돌아가기
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "데이터를 불러올 수 없습니다"}
        </div>
      </div>
    );
  }

  const { template, buildings } = data;

  // 전체 통계 계산
  const totalTasks = buildings.reduce((sum, b) => sum + b.taskStats.total, 0);
  const completedTasks = buildings.reduce(
    (sum, b) => sum + b.taskStats.completed,
    0
  );
  const pendingTasks = buildings.reduce(
    (sum, b) => sum + b.taskStats.pending,
    0
  );
  const inProgressTasks = buildings.reduce(
    (sum, b) => sum + b.taskStats.inProgress,
    0
  );
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // 미완료된 빌딩과 완료된 빌딩 분류
  const incompleteBuildingsList = buildings.filter(
    (b) => b.taskStats.completionRate < 100
  );
  const completeBuildingsList = buildings.filter(
    (b) => b.taskStats.completionRate === 100
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/task-templates" className="text-blue-600 hover:underline">
          &larr; 템플릿 목록으로 돌아가기
        </Link>
      </div>

      {/* 템플릿 정보 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{template.title}</h1>
        <p className="text-gray-700 mb-4">{template.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-md">
            {getManagerTypeLabel(template.managerType)}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
            {getCategoryLabel(template.category)}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-md">
            우선순위: {getPriorityLabel(template.priority)}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          생성일: {formatDate(template.createdAt)}
        </p>
      </div>

      {/* 업무 현황 요약 대시보드 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">업무 현황 요약</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{totalTasks}</div>
            <div className="text-sm text-gray-600">전체 업무</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {completedTasks}
            </div>
            <div className="text-sm text-gray-600">완료된 업무</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {pendingTasks + inProgressTasks}
            </div>
            <div className="text-sm text-gray-600">진행 중인 업무</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {buildings.length}
            </div>
            <div className="text-sm text-gray-600">적용된 빌딩 수</div>
          </div>
        </div>

        {/* 전체 완료율 */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">
              전체 완료율: {Math.round(completionRate)}%
            </span>
            <span className="text-sm text-gray-500">
              {completedTasks}/{totalTasks} 완료
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* 빌딩 완료 현황 */}
        <div className="flex justify-between items-center gap-4">
          <div className="text-center flex-1 bg-red-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {incompleteBuildingsList.length}
            </div>
            <div className="text-sm text-gray-600">미완료 빌딩</div>
          </div>
          <div className="text-center flex-1 bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {completeBuildingsList.length}
            </div>
            <div className="text-sm text-gray-600">완료 빌딩</div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6 border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            전체 현황
          </button>
          <button
            onClick={() => setActiveTab("incomplete")}
            className={`py-2 px-4 ${
              activeTab === "incomplete"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            미완료 빌딩 ({incompleteBuildingsList.length})
          </button>
          <button
            onClick={() => setActiveTab("complete")}
            className={`py-2 px-4 ${
              activeTab === "complete"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            완료 빌딩 ({completeBuildingsList.length})
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === "overview" && (
        <>
          <h2 className="text-xl font-semibold mb-4">빌딩별 진행 상태</h2>

          {buildings.length === 0 ? (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <p className="text-gray-500">
                이 템플릿을 사용하는 빌딩이 없습니다
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buildings.map((building) => (
                <div
                  key={building.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <div className="h-40 relative">
                    <Image
                      src={
                        building.imageUrl ||
                        "/images/buildings/default-building.jpg"
                      }
                      alt={building.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      <Link
                        href={`/buildings/${building.id}`}
                        className="hover:text-blue-600"
                      >
                        {building.name}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {building.address}
                    </p>

                    {/* 진행률 */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          진행률:{" "}
                          {Math.round(building.taskStats.completionRate)}%
                        </span>
                        <span className="text-sm text-gray-500">
                          {building.taskStats.completed}/
                          {building.taskStats.total} 완료
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            building.taskStats.completionRate === 100
                              ? "bg-green-500"
                              : building.taskStats.completionRate > 50
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                          style={{
                            width: `${building.taskStats.completionRate}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* 상태별 업무 수 */}
                    <div className="flex justify-between mb-4">
                      <div className="text-center">
                        <div className="text-yellow-500 font-semibold">
                          {building.taskStats.pending}
                        </div>
                        <div className="text-xs text-gray-500">대기 중</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-500 font-semibold">
                          {building.taskStats.inProgress}
                        </div>
                        <div className="text-xs text-gray-500">진행 중</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-500 font-semibold">
                          {building.taskStats.completed}
                        </div>
                        <div className="text-xs text-gray-500">완료</div>
                      </div>
                    </div>

                    {/* 최근 업무 */}
                    {building.latestTask && (
                      <div className="border-t pt-3 mt-3">
                        <h4 className="text-sm font-medium mb-1">
                          최근 업무 상태
                        </h4>
                        <div
                          className={`text-sm ${
                            building.latestTask.status === "COMPLETED"
                              ? "text-green-600"
                              : building.latestTask.status === "IN_PROGRESS"
                              ? "text-blue-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {getStatusLabel(building.latestTask.status)}
                        </div>
                        <div className="text-xs text-gray-500">
                          마지막 업데이트:{" "}
                          {formatDate(building.latestTask.updatedAt)}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <Link
                        href={`/buildings/${building.id}?templateId=${template.id}`}
                      >
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition">
                          빌딩 업무 관리
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "incomplete" && (
        <>
          <h2 className="text-xl font-semibold mb-4">미완료 빌딩 목록</h2>

          {incompleteBuildingsList.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <p className="text-green-600">
                모든 빌딩의 업무가 완료되었습니다!
              </p>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      빌딩
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      주소
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      진행률
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      남은 업무
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
                  {incompleteBuildingsList.map((building) => (
                    <tr key={building.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {building.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {building.address}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-full max-w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `${building.taskStats.completionRate}%`,
                              }}
                            ></div>
                          </div>
                          <span>
                            {Math.round(building.taskStats.completionRate)}%
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        {building.taskStats.pending +
                          building.taskStats.inProgress}
                        개
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <Link
                          href={`/buildings/${building.id}?templateId=${template.id}`}
                        >
                          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                            관리하기
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === "complete" && (
        <>
          <h2 className="text-xl font-semibold mb-4">완료된 빌딩 목록</h2>

          {completeBuildingsList.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <p className="text-yellow-600">아직 완료된 빌딩이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      빌딩
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      주소
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      완료된 업무
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      완료일
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
                  {completeBuildingsList.map((building) => (
                    <tr key={building.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {building.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {building.address}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        {building.taskStats.completed}개
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        {building.latestTask?.completedAt
                          ? formatDate(building.latestTask.completedAt)
                          : "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <Link
                          href={`/buildings/${building.id}?templateId=${template.id}`}
                        >
                          <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                            상세보기
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
