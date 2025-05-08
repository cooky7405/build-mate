"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import TasksList from "@/app/components/tasks/TasksList";

// 건물 데이터 인터페이스
interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
  yearBuilt: number;
  totalArea: number;
  description: string;
  status: string;
  imageUrl: string;
  managers?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

interface BuildingParams {
  id: string;
}

interface BuildingDetailPageProps {
  params: Promise<BuildingParams>;
}

// 사용자 요약 타입 정의
interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profileImage?: string;
}

export default function BuildingDetailPage({
  params,
}: BuildingDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);

  // 상태 정의
  const [building, setBuilding] = useState<Building | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminManager, setAdminManager] = useState<UserSummary | null>(null);
  const [bizManager, setBizManager] = useState<UserSummary | null>(null);
  const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [selectedManager, setSelectedManager] = useState<
    "admin" | "biz" | null
  >(null);
  const [showManagerModal, setShowManagerModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 권한 및 데이터 로드
  useEffect(() => {
    // 권한 확인
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const { role } = JSON.parse(jsonPayload);
        setUserRole(role);
        if (
          ["SUPER_ADMIN", "BUILDING_ADMIN", "BUILDING_MANAGER"].includes(role)
        ) {
          setIsAuthorized(true);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("인증 확인 중 오류:", error);
        router.push("/auth/login");
      }
    };
    // 건물 데이터 로드
    const loadBuilding = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/buildings/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/buildings");
            return;
          }
          throw new Error("건물 데이터를 가져오는 중 오류가 발생했습니다.");
        }
        const data = await response.json();
        setBuilding(data);
      } catch (err) {
        console.error("건물 데이터를 가져오는 중 오류:", err);
        setError("건물 정보를 불러오는 중 오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };
    // 건물 관리자 정보 불러오기
    const loadBuildingManagers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch(`/api/buildings/${id}/managers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("관리자 정보를 불러오는 중 오류가 발생했습니다.");
        }
        const data = await response.json();
        setAdminManager(data.adminManager);
        setBizManager(data.bizManager);
      } catch (err) {
        console.error("관리자 정보를 불러오는 중 오류:", err);
      }
    };
    checkAuth();
    loadBuilding();
    loadBuildingManagers();
  }, [id, router]);

  // 사용자 검색 (최상위 useCallback)
  const searchUsers = useCallback(async () => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setSearchLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchTerm)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("사용자 검색 중 오류가 발생했습니다.");
      }
      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (err) {
      console.error("사용자 검색 중 오류:", err);
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  // 검색어 변경 시 사용자 검색 (최상위 useEffect)
  useEffect(() => {
    if (isSearching) {
      const delayDebounce = setTimeout(() => {
        searchUsers();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, isSearching, searchUsers]);

  // 관리자 선택 모달 열기
  const openManagerModal = (type: "admin" | "biz") => {
    setSelectedManager(type);
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(true);
    setShowManagerModal(true);
  };

  // 관리자 선택
  const selectManager = (user: UserSummary) => {
    if (selectedManager === "admin") {
      setAdminManager(user);
    } else if (selectedManager === "biz") {
      setBizManager(user);
    }
    setShowManagerModal(false);
    setIsSearching(false);
  };

  // 관리자 삭제
  const removeManager = (type: "admin" | "biz") => {
    if (type === "admin") {
      setAdminManager(null);
    } else if (type === "biz") {
      setBizManager(null);
    }
  };

  // 변경사항 저장
  const saveChanges = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`/api/buildings/${id}/managers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminManagerId: adminManager?.id || null,
          bizManagerId: bizManager?.id || null,
        }),
      });
      if (!response.ok) {
        throw new Error("관리자 정보 업데이트 중 오류가 발생했습니다.");
      }
      alert("관리자 정보가 성공적으로 업데이트되었습니다.");
    } catch (err) {
      console.error("관리자 정보 업데이트 중 오류:", err);
      alert("관리자 정보 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 권한 확인 중 또는 데이터 로딩 중
  if (!isAuthorized || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#1E88E5] font-semibold">
          {!isAuthorized ? "권한을 확인하는 중..." : "데이터를 불러오는 중..."}
        </div>
      </div>
    );
  }

  // 건물 데이터가 없는 경우
  if (!building) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#E53935] font-semibold">{error}</div>
      </div>
    );
  }

  // 상태 레이블 렌더링
  const renderStatusBadge = () => {
    let bgColor = "";
    let textColor = "";
    let statusText = "";

    switch (building.status) {
      case "active":
        bgColor = "bg-[#43A047]/10";
        textColor = "text-[#43A047]";
        statusText = "정상";
        break;
      case "maintenance":
        bgColor = "bg-[#FFA000]/10";
        textColor = "text-[#FFA000]";
        statusText = "유지보수 중";
        break;
      default:
        bgColor = "bg-[#E53935]/10";
        textColor = "text-[#E53935]";
        statusText = "비활성화";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {statusText}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#121212] p-8">
      <div className="max-w-7xl mx-auto">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5] dark:hover:text-[#1E88E5]"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  대시보드
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-[#9E9E9E]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <Link
                    href="/buildings"
                    className="ml-1 text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5] dark:hover:text-[#1E88E5] md:ml-2"
                  >
                    건물 관리
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-[#9E9E9E]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-[#1E88E5] md:ml-2">
                    {building.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* 건물 헤더 정보 */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 mb-6 border border-[#E0E0E0] dark:border-[#333333]">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 md:mr-6 mb-4 md:mb-0">
              <div className="rounded-lg overflow-hidden h-60 relative">
                <Image
                  src={
                    building.imageUrl ||
                    "/images/buildings/default-building.jpg"
                  }
                  alt={building.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,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"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#263238] dark:text-white">
                    {building.name}
                  </h1>
                  <p className="text-[#607D8B] dark:text-[#B0BEC5] mt-1">
                    {building.address}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {renderStatusBadge()}
                  {["SUPER_ADMIN", "BUILDING_ADMIN"].includes(
                    userRole as string
                  ) && (
                    <Link
                      href={`/buildings/${building.id}/edit`}
                      className="bg-[#1E88E5] hover:bg-[#1976D2] text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      편집
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-[#9E9E9E] text-sm">층수</p>
                  <p className="text-[#263238] dark:text-white font-medium">
                    {building.floors}층
                  </p>
                </div>
                <div>
                  <p className="text-[#9E9E9E] text-sm">건축년도</p>
                  <p className="text-[#263238] dark:text-white font-medium">
                    {building.yearBuilt}년
                  </p>
                </div>
                <div>
                  <p className="text-[#9E9E9E] text-sm">총 면적</p>
                  <p className="text-[#263238] dark:text-white font-medium">
                    {building.totalArea.toLocaleString()}㎡
                  </p>
                </div>
              </div>

              <p className="text-[#263238] dark:text-white">
                {building.description}
              </p>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm overflow-hidden border border-[#E0E0E0] dark:border-[#333333] mb-6">
          <div className="flex border-b border-[#E0E0E0] dark:border-[#333333] overflow-x-auto">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "details"
                  ? "text-[#1E88E5] border-b-2 border-[#1E88E5]"
                  : "text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5]"
              }`}
              onClick={() => setActiveTab("details")}
            >
              상세정보
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "managers"
                  ? "text-[#1E88E5] border-b-2 border-[#1E88E5]"
                  : "text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5]"
              }`}
              onClick={() => setActiveTab("managers")}
            >
              관리자
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "tenants"
                  ? "text-[#1E88E5] border-b-2 border-[#1E88E5]"
                  : "text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5]"
              }`}
              onClick={() => setActiveTab("tenants")}
            >
              임차인
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "issues"
                  ? "text-[#1E88E5] border-b-2 border-[#1E88E5]"
                  : "text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5]"
              }`}
              onClick={() => setActiveTab("issues")}
            >
              이슈
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "tasks"
                  ? "text-[#1E88E5] border-b-2 border-[#1E88E5]"
                  : "text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5]"
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              업무
            </button>
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div>
                <h2 className="text-xl font-semibold text-[#263238] dark:text-white mb-4">
                  건물 상세 정보
                </h2>
                <p className="text-[#607D8B] dark:text-[#B0BEC5] mb-6">
                  해당 건물의 상세 정보와 특징입니다.
                </p>

                <div className="bg-[#F5F7FA] dark:bg-[#262626] p-4 rounded-lg mb-6">
                  <p className="text-[#607D8B] dark:text-[#B0BEC5]">
                    현재 세부 정보가 준비 중입니다. 추후 업데이트될 예정입니다.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "managers" && (
              <div>
                <h2 className="text-xl font-semibold text-[#263238] dark:text-white mb-4">
                  빌딩 관리자 설정
                </h2>
                <p className="text-[#607D8B] dark:text-[#B0BEC5] mb-6">
                  빌딩의 관리 책임자와 경영 책임자를 지정할 수 있습니다.
                </p>

                <div className="space-y-6">
                  {/* 관리 책임자 섹션 */}
                  <div className="bg-[#F5F7FA] dark:bg-[#262626] p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-[#263238] dark:text-white">
                      관리 책임자
                    </h3>
                    <p className="text-sm text-[#607D8B] dark:text-[#B0BEC5] mb-4">
                      시설 및 운영 관리를 담당합니다.
                    </p>

                    {adminManager ? (
                      <div className="flex items-center justify-between bg-white dark:bg-[#1E1E1E] p-3 rounded-lg shadow-sm mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#E0E0E0] dark:bg-[#333333] flex items-center justify-center overflow-hidden">
                            {adminManager.profileImage ? (
                              <Image
                                src={adminManager.profileImage}
                                alt={adminManager.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[#9E9E9E]">
                                {adminManager.name.substring(0, 1)}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-[#263238] dark:text-white">
                              {adminManager.name}
                            </p>
                            <p className="text-sm text-[#9E9E9E]">
                              {adminManager.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeManager("admin")}
                          className="text-[#E53935] hover:text-[#C62828] text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-[#9E9E9E] mb-4">
                          지정된 관리 책임자가 없습니다.
                        </p>
                      </div>
                    )}

                    {["SUPER_ADMIN", "BUILDING_ADMIN"].includes(
                      userRole as string
                    ) && (
                      <button
                        onClick={() => openManagerModal("admin")}
                        className="w-full mt-2 bg-[#1E88E5]/10 hover:bg-[#1E88E5]/20 text-[#1E88E5] py-2 rounded-lg text-sm transition-colors"
                      >
                        {adminManager ? "관리 책임자 변경" : "관리 책임자 추가"}
                      </button>
                    )}
                  </div>

                  {/* 경영 책임자 섹션 */}
                  <div className="bg-[#F5F7FA] dark:bg-[#262626] p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-[#263238] dark:text-white">
                      경영 책임자
                    </h3>
                    <p className="text-sm text-[#607D8B] dark:text-[#B0BEC5] mb-4">
                      계약 및 재무 관리를 담당합니다.
                    </p>

                    {bizManager ? (
                      <div className="flex items-center justify-between bg-white dark:bg-[#1E1E1E] p-3 rounded-lg shadow-sm mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#E0E0E0] dark:bg-[#333333] flex items-center justify-center overflow-hidden">
                            {bizManager.profileImage ? (
                              <Image
                                src={bizManager.profileImage}
                                alt={bizManager.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[#9E9E9E]">
                                {bizManager.name.substring(0, 1)}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-[#263238] dark:text-white">
                              {bizManager.name}
                            </p>
                            <p className="text-sm text-[#9E9E9E]">
                              {bizManager.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeManager("biz")}
                          className="text-[#E53935] hover:text-[#C62828] text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-[#9E9E9E] mb-4">
                          지정된 경영 책임자가 없습니다.
                        </p>
                      </div>
                    )}

                    {["SUPER_ADMIN", "BUILDING_ADMIN"].includes(
                      userRole as string
                    ) && (
                      <button
                        onClick={() => openManagerModal("biz")}
                        className="w-full mt-2 bg-[#1E88E5]/10 hover:bg-[#1E88E5]/20 text-[#1E88E5] py-2 rounded-lg text-sm transition-colors"
                      >
                        {bizManager ? "경영 책임자 변경" : "경영 책임자 추가"}
                      </button>
                    )}
                  </div>

                  {/* 저장 버튼 */}
                  {["SUPER_ADMIN", "BUILDING_ADMIN"].includes(
                    userRole as string
                  ) && (
                    <button
                      onClick={saveChanges}
                      disabled={isSaving}
                      className="w-full bg-[#1E88E5] hover:bg-[#1976D2] text-white py-3 rounded-lg font-medium transition-colors disabled:bg-[#B0BEC5] disabled:cursor-not-allowed"
                    >
                      {isSaving ? "저장 중..." : "변경사항 저장"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "tenants" && (
              <div>
                <h2 className="text-xl font-semibold text-[#263238] dark:text-white mb-4">
                  임차인 목록
                </h2>
                <p className="text-[#607D8B] dark:text-[#B0BEC5] mb-6">
                  현재 건물에 입주한 임차인 목록입니다.
                </p>

                <div className="bg-[#F5F7FA] dark:bg-[#262626] p-4 rounded-lg mb-6">
                  <p className="text-[#607D8B] dark:text-[#B0BEC5]">
                    임차인 정보가 없습니다. 임차인을 추가해주세요.
                  </p>
                </div>

                {["SUPER_ADMIN", "BUILDING_ADMIN"].includes(
                  userRole as string
                ) && (
                  <button className="bg-[#1E88E5] hover:bg-[#1976D2] text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    임차인 추가
                  </button>
                )}
              </div>
            )}

            {activeTab === "issues" && (
              <div>
                <h2 className="text-xl font-semibold text-[#263238] dark:text-white mb-4">
                  이슈 관리
                </h2>
                <p className="text-[#607D8B] dark:text-[#B0BEC5] mb-6">
                  건물에서 발생한 이슈 목록과 처리 상태입니다.
                </p>

                <div className="bg-[#F5F7FA] dark:bg-[#262626] p-4 rounded-lg mb-6">
                  <p className="text-[#607D8B] dark:text-[#B0BEC5]">
                    등록된 이슈가 없습니다.
                  </p>
                </div>

                <button className="bg-[#1E88E5] hover:bg-[#1976D2] text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  이슈 등록
                </button>
              </div>
            )}

            {activeTab === "tasks" && (
              <div>
                <h2 className="text-xl font-semibold text-[#263238] dark:text-white mb-4">
                  업무 관리
                </h2>
                <p className="text-[#607D8B] dark:text-[#B0BEC5] mb-6">
                  건물과 관련된 업무 목록과 진행 상태입니다.
                </p>

                <div className="bg-[#F5F7FA] dark:bg-[#262626] p-4 rounded-lg mb-6">
                  <p className="text-[#607D8B] dark:text-[#B0BEC5]">
                    등록된 업무가 없습니다.
                  </p>
                </div>

                {["SUPER_ADMIN", "BUILDING_ADMIN", "BUILDING_MANAGER"].includes(
                  userRole as string
                ) && (
                  <button className="bg-[#1E88E5] hover:bg-[#1976D2] text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    업무 등록
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 관리자 선택 모달 */}
        {showManagerModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl w-full max-w-md shadow-lg overflow-hidden">
              <div className="p-4 border-b border-[#E0E0E0] dark:border-[#333333]">
                <h3 className="text-lg font-semibold text-[#263238] dark:text-white">
                  {selectedManager === "admin"
                    ? "관리 책임자 선택"
                    : "경영 책임자 선택"}
                </h3>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="이름 또는 이메일로 검색 (최소 2글자)"
                    className="w-full p-2 pr-10 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {searchLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#1E88E5]"></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#9E9E9E]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => selectManager(user)}
                          className="flex items-center p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#262626] rounded-lg cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#E0E0E0] dark:bg-[#333333] flex items-center justify-center overflow-hidden mr-3">
                            {user.profileImage ? (
                              <Image
                                src={user.profileImage}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[#9E9E9E]">
                                {user.name.substring(0, 1)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#263238] dark:text-white">
                              {user.name}
                            </p>
                            <div className="flex items-center">
                              <p className="text-sm text-[#9E9E9E]">
                                {user.email}
                              </p>
                              <span className="mx-2 text-[#9E9E9E]">•</span>
                              <p className="text-xs bg-[#E0E0E0] dark:bg-[#333333] px-2 py-0.5 rounded-full text-[#616161] dark:text-[#B0BEC5]">
                                {user.role === "ADMIN_MANAGER"
                                  ? "관리 책임자"
                                  : user.role === "BIZ_MANAGER"
                                  ? "경영 책임자"
                                  : user.role === "BUILDING_ADMIN"
                                  ? "빌딩 관리자"
                                  : user.role === "BUILDING_MANAGER"
                                  ? "일반 관리자"
                                  : user.role === "SUPER_ADMIN"
                                  ? "슈퍼 관리자"
                                  : "일반 사용자"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      {searchTerm.length < 2 ? (
                        <p className="text-[#9E9E9E]">
                          최소 2글자 이상 입력하세요
                        </p>
                      ) : searchLoading ? (
                        <p className="text-[#9E9E9E]">검색 중...</p>
                      ) : (
                        <p className="text-[#9E9E9E]">검색 결과가 없습니다</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-[#E0E0E0] dark:border-[#333333] flex justify-end">
                <button
                  onClick={() => {
                    setShowManagerModal(false);
                    setIsSearching(false);
                  }}
                  className="px-4 py-2 text-[#9E9E9E] hover:text-[#616161] text-sm"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">이 건물의 업무 목록</h2>
              <Link href={`/tasks/new?buildingId=${id}`}>
                <button className="px-4 py-2 bg-green-600 text-white rounded">
                  새 업무 추가
                </button>
              </Link>
            </div>
            <TasksList buildingId={id} />
          </div>
        )}
      </div>
    </div>
  );
}
