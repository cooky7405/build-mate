"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTaskTemplatePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM", // 기본값
    managerType: "ADMIN", // 기본값
    category: "MAINTENANCE", // 기본값
  });

  // 입력 필드 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.title || !formData.description || !formData.category) {
      alert("제목, 설명, 카테고리는 필수 항목입니다");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/task-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("업무 템플릿 생성에 실패했습니다");
      }

      // 템플릿 목록 페이지로 이동
      router.push("/task-templates");
    } catch (err) {
      console.error("템플릿 생성 오류:", err);
      alert("템플릿 생성에 실패했습니다");
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">새 업무 템플릿 추가</h1>
        <Link href="/task-templates">
          <button className="px-4 py-2 bg-gray-200 rounded">
            목록으로 돌아가기
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className="space-y-4 p-6 bg-white rounded-md shadow-sm">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              업무 제목*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="업무 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              업무 설명*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-32 p-2 border rounded-md"
              placeholder="업무에 대한 상세 설명을 입력하세요"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="managerType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                담당자 유형*
              </label>
              <select
                id="managerType"
                name="managerType"
                value={formData.managerType}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="ADMIN">관리책임자</option>
                <option value="BIZ">경영책임자</option>
                <option value="BOTH">공통</option>
              </select>

              <p className="mt-1 text-xs text-gray-500">
                이 업무를 담당할 책임자 유형을 선택하세요
              </p>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                우선순위
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="HIGH">높음</option>
                <option value="MEDIUM">중간</option>
                <option value="LOW">낮음</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
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
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link href="/task-templates">
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
            disabled={submitting}
          >
            {submitting ? "생성 중..." : "템플릿 생성"}
          </button>
        </div>
      </form>
    </div>
  );
}
