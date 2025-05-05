"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Building {
  id: string;
  name: string;
  address: string;
  category?: string;
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

// SearchParams를 사용하는 내부 컴포넌트
function TaskFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 buildingId와 templateId 추출
  const buildingIdParam = searchParams.get("buildingId");
  const templateIdParam = searchParams.get("templateId");

  // 템플릿 생성 모드 상태
  const [isTemplateMode, setIsTemplateMode] = useState(false);

  // 데이터 로딩 상태
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 전체 로딩 상태 계산
  const isLoading = loadingBuildings || loadingTemplates || loadingUsers;

  // 데이터 목록
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // 필터링 상태
  const [selectedManagerType, setSelectedManagerType] = useState<string>("all");
  const [buildingSearchTerm, setBuildingSearchTerm] = useState("");
  const [buildingCategoryFilter, setBuildingCategoryFilter] =
    useState<string>("all");

  // 템플릿 추가 모드 폼 데이터
  const [templateFormData, setTemplateFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM", // 기본값
    managerType: "ADMIN", // 기본값
    category: "MAINTENANCE", // 기본값
  });

  // 폼 데이터 (buildingId 파라미터가 있으면 초기값으로 설정)
  const [formData, setFormData] = useState({
    buildingIds: buildingIdParam ? [buildingIdParam] : [],
    allBuildings: false,
    templateId: templateIdParam || "",
    assigneeId: "none",
    dueDate: "",
  });

  // 건물 카테고리 목록 (예시)
  const [buildingCategories, setBuildingCategories] = useState<string[]>([]);

  // 에러 메시지
  const [error, setError] = useState<string | null>(null);

  // 팝오버 열기/닫기 상태
  const [open, setOpen] = useState(false);

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

        // 건물 카테고리 추출
        const categories = Array.from(
          new Set(
            data.map((building: Building) => building.category).filter(Boolean)
          )
        ) as string[];
        setBuildingCategories(categories);
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

  // 선택된 건물 제거 핸들러
  const handleRemoveBuilding = (buildingId: string) => {
    setFormData({
      ...formData,
      buildingIds: formData.buildingIds.filter((id) => id !== buildingId),
    });
  };

  // 필터링된 건물 목록
  const getFilteredBuildings = () => {
    let filtered = buildings;

    // 검색어 필터링
    if (buildingSearchTerm) {
      filtered = filtered.filter(
        (building) =>
          building.name
            .toLowerCase()
            .includes(buildingSearchTerm.toLowerCase()) ||
          building.address
            .toLowerCase()
            .includes(buildingSearchTerm.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (buildingCategoryFilter !== "all") {
      filtered = filtered.filter(
        (building) => building.category === buildingCategoryFilter
      );
    }

    return filtered;
  };

  // 템플릿 입력 필드 변경 핸들러
  const handleTemplateChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTemplateFormData({
      ...templateFormData,
      [name]: value,
    });
  };

  // 템플릿 생성 폼 제출 핸들러
  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (
      !templateFormData.title ||
      !templateFormData.description ||
      !templateFormData.category
    ) {
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
        body: JSON.stringify(templateFormData),
      });

      if (!response.ok) {
        throw new Error("업무 템플릿 생성에 실패했습니다");
      }

      const data = await response.json();

      // 성공 시 템플릿 모드 종료하고 해당 템플릿을 선택
      setIsTemplateMode(false);
      setFormData({
        ...formData,
        templateId: data.id,
      });

      // 템플릿 목록 새로고침
      const templateResponse = await fetch(`/api/task-templates`);
      if (templateResponse.ok) {
        const templates = await templateResponse.json();
        setTemplates(templates);
      }

      alert("템플릿이 성공적으로 추가되었습니다!");
    } catch (err) {
      console.error("템플릿 생성 오류:", err);
      alert("템플릿 생성에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
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

      // assigneeId가 "none"인 경우 빈 문자열로 변환
      const submittingData = {
        ...formData,
        assigneeId: formData.assigneeId === "none" ? "" : formData.assigneeId,
        creatorId: "현재로그인한사용자ID", // 실제 구현시 세션에서 가져옴
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submittingData),
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

  // 선택된 건물들 정보
  const selectedBuildings = buildings.filter((b) =>
    formData.buildingIds.includes(b.id)
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isTemplateMode ? "새 업무 템플릿 추가" : "새 업무 추가"}
        </h1>
        <div className="flex gap-2">
          {!isTemplateMode && (
            <Button
              variant="outline"
              onClick={() => setIsTemplateMode(true)}
              disabled={submitting}
            >
              새 템플릿 추가하기
            </Button>
          )}
          {isTemplateMode && (
            <Button
              variant="outline"
              onClick={() => setIsTemplateMode(false)}
              disabled={submitting}
            >
              업무 추가 모드로 돌아가기
            </Button>
          )}
          <Link href="/tasks">
            <Button variant="outline">목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isTemplateMode ? (
        // 템플릿 추가 폼
        <form onSubmit={handleTemplateSubmit} className="space-y-6">
          <div className="space-y-6 p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold border-b pb-2">
              업무 템플릿 정보
            </h2>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                업무 제목*
              </label>
              <Input
                id="title"
                name="title"
                value={templateFormData.title}
                onChange={handleTemplateChange}
                placeholder="업무 제목을 입력하세요"
                disabled={submitting}
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
                value={templateFormData.description}
                onChange={handleTemplateChange}
                className="w-full h-32 p-2 border rounded-md"
                placeholder="업무에 대한 상세 설명을 입력하세요"
                disabled={submitting}
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리*
              </label>
              <Select
                value={templateFormData.category}
                onValueChange={(value) =>
                  setTemplateFormData({
                    ...templateFormData,
                    category: value,
                  })
                }
                disabled={submitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAINTENANCE">유지보수</SelectItem>
                  <SelectItem value="SECURITY">보안</SelectItem>
                  <SelectItem value="CLEANING">청소</SelectItem>
                  <SelectItem value="INSPECTION">점검</SelectItem>
                  <SelectItem value="FACILITY">시설관리</SelectItem>
                  <SelectItem value="CONTRACT">계약관리</SelectItem>
                  <SelectItem value="FINANCIAL">재무관리</SelectItem>
                  <SelectItem value="TENANT">입주자관리</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="managerType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                담당자 유형*
              </label>
              <Select
                value={templateFormData.managerType}
                onValueChange={(value) =>
                  setTemplateFormData({
                    ...templateFormData,
                    managerType: value,
                  })
                }
                disabled={submitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="담당자 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">관리책임자</SelectItem>
                  <SelectItem value="BIZ">경영책임자</SelectItem>
                  <SelectItem value="BOTH">공통</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                우선순위
              </label>
              <Select
                value={templateFormData.priority}
                onValueChange={(value) =>
                  setTemplateFormData({
                    ...templateFormData,
                    priority: value,
                  })
                }
                disabled={submitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="우선순위 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">높음</SelectItem>
                  <SelectItem value="MEDIUM">중간</SelectItem>
                  <SelectItem value="LOW">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTemplateMode(false)}
              disabled={submitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "템플릿 생성 중..." : "템플릿 생성"}
            </Button>
          </div>
        </form>
      ) : (
        // 업무 추가 폼
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 p-6 bg-white rounded-md shadow-sm">
            {/* 업무 템플릿 선택 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">
                업무 템플릿 선택
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  담당자 유형 필터
                </label>
                <Select
                  value={selectedManagerType}
                  onValueChange={setSelectedManagerType}
                  disabled={isLoading || submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="담당자 유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 유형</SelectItem>
                    <SelectItem value="ADMIN">관리책임자</SelectItem>
                    <SelectItem value="BIZ">경영책임자</SelectItem>
                    <SelectItem value="BOTH">공통</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  업무 템플릿 선택*
                </label>
                <Select
                  value={formData.templateId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, templateId: value })
                  }
                  disabled={isLoading || submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="업무 템플릿 선택" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {templates.length > 0 ? (
                      templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title} (
                          {getManagerTypeLabel(template.managerType)})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-templates">템플릿 없음</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {formData.templateId && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    {templates.find((t) => t.id === formData.templateId)
                      ?.description || ""}
                  </div>
                )}
              </div>
            </div>

            {/* 건물 선택 섹션 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">건물 선택</h2>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
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
                    모든 건물에 적용 ({buildings.length}개)
                  </label>
                </div>

                {formData.allBuildings && (
                  <div className="ml-2 text-blue-700 text-sm">
                    전체 {buildings.length}개 건물에 업무가 할당됩니다.
                  </div>
                )}
              </div>

              {!formData.allBuildings && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        카테고리 필터
                      </label>
                      <Select
                        value={buildingCategoryFilter}
                        onValueChange={setBuildingCategoryFilter}
                        disabled={isLoading || submitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">모든 카테고리</SelectItem>
                          {buildingCategories.length > 0 ? (
                            buildingCategories.map((category) => (
                              <SelectItem
                                key={category}
                                value={category || "no-category"}
                              >
                                {category || "분류 없음"}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-categories">
                              카테고리 없음
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        선택된 건물 수
                      </label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                        <span className="font-medium">
                          {formData.buildingIds.length}
                        </span>
                        <span className="text-gray-500 ml-1">
                          / {buildings.length}개
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      건물 선택*
                    </label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between h-auto min-h-10 py-2"
                          disabled={isLoading || submitting}
                        >
                          건물 검색 및 선택
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput
                            placeholder="건물 검색..."
                            onValueChange={setBuildingSearchTerm}
                          />
                          <CommandList className="max-h-[300px] overflow-auto">
                            <CommandEmpty>
                              일치하는 건물이 없습니다
                            </CommandEmpty>
                            <CommandGroup>
                              {getFilteredBuildings().map((building) => (
                                <CommandItem
                                  key={building.id}
                                  value={building.id}
                                  onSelect={() =>
                                    handleBuildingSelection(building.id)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.buildingIds.includes(building.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span>{building.name}</span>
                                    <span className="text-sm text-gray-500">
                                      {building.address}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {formData.buildingIds.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        선택된 건물 목록
                      </label>
                      <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-auto">
                        <div className="flex flex-wrap gap-2">
                          {selectedBuildings.map((building) => (
                            <Badge
                              key={building.id}
                              variant="secondary"
                              className="px-2 py-1 flex items-center gap-1"
                            >
                              <span className="max-w-[150px] truncate">
                                {building.name}
                              </span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() =>
                                  handleRemoveBuilding(building.id)
                                }
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">
                업무 세부 정보
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  담당자 지정
                </label>
                <Select
                  value={formData.assigneeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assigneeId: value })
                  }
                  disabled={isLoading || submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="담당자 미지정 (템플릿 유형에 따라 자동 할당)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      담당자 미지정 (템플릿 유형에 따라 자동 할당)
                    </SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-sm text-gray-500">
                  담당자를 지정하지 않으면 템플릿 유형에 따라 건물의
                  관리책임자나 경영책임자에게 자동 할당됩니다.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  마감일
                </label>
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full"
                  disabled={isLoading || submitting}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={submitting}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading || submitting}>
              {submitting ? "생성 중..." : "업무 생성"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// 메인 페이지 컴포넌트 - Suspense로 감싸서 export
export default function NewTaskPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-8">로딩 중...</div>}
    >
      <TaskFormContent />
    </Suspense>
  );
}
