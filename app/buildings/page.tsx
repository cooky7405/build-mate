"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 건물 데이터 인터페이스
interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
  yearBuilt: number;
  totalArea: number;
  description?: string;
  status: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  managers?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

export default function BuildingsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 페이지 로드 시 권한 체크 (클라이언트 측)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      // 토큰이 없으면 로그인 페이지로 리디렉션
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        // JWT 디코딩 (실제로는 서버 측에서 검증해야 함)
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

        // SUPER_ADMIN 또는 BUILDING_ADMIN 또는 BUILDING_MANAGER만 접근 가능
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

    checkAuth();
  }, [router]);

  // fetchBuildings 함수를 useCallback으로 감싸줍니다
  const fetchBuildings = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = `/api/buildings${
        statusFilter !== "all" ? `?status=${statusFilter}` : ""
      }`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("건물 데이터를 가져오는 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error("건물 데이터를 가져오는 중 오류:", error);
      // 오류 발생 시 빈 배열 설정
      setBuildings([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]); // statusFilter를 의존성으로 추가

  useEffect(() => {
    if (isAuthorized) {
      fetchBuildings();
    }
  }, [isAuthorized, fetchBuildings]); // fetchBuildings 함수를 의존성 배열에 추가

  // 검색 및 필터링된 건물 목록
  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch =
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address.toLowerCase().includes(searchTerm.toLowerCase());
    // API에서 이미 상태 필터링을 수행하므로 클라이언트에서는 검색어만 필터링
    return matchesSearch;
  });

  // 새 건물 추가 핸들러
  const handleAddBuilding = () => {
    router.push("/buildings/new");
  };

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        권한을 확인하는 중...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#1E88E5] font-semibold">
          데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#121212] p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-[#263238] dark:text-white mb-4 md:mb-0">
            건물 관리
          </h1>

          {/* 슈퍼 관리자 또는 빌딩 관리자만 건물 추가 가능 */}
          {["SUPER_ADMIN", "BUILDING_ADMIN"].includes(userRole as string) && (
            <button
              onClick={handleAddBuilding}
              className="bg-[#1E88E5] hover:bg-[#1976D2] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              건물 추가
            </button>
          )}
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl shadow-sm mb-6 border border-[#E0E0E0] dark:border-[#333333]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="건물명 또는 주소로 검색"
                  className="w-full px-4 py-2 pl-10 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-2.5 text-[#607D8B] dark:text-[#B0BEC5]"
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
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                className="px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">모든 상태</option>
                <option value="active">정상</option>
                <option value="maintenance">유지보수 중</option>
                <option value="inactive">비활성화</option>
              </select>

              <div className="border border-[#E0E0E0] dark:border-[#333333] rounded-lg overflow-hidden flex">
                <button
                  className={`px-3 py-2 ${
                    viewMode === "table"
                      ? "bg-[#1E88E5] text-white"
                      : "bg-transparent text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333]"
                  }`}
                  onClick={() => setViewMode("table")}
                >
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
                      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  className={`px-3 py-2 ${
                    viewMode === "card"
                      ? "bg-[#1E88E5] text-white"
                      : "bg-transparent text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333]"
                  }`}
                  onClick={() => setViewMode("card")}
                >
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 건물 목록 (테이블 뷰) */}
        {viewMode === "table" && (
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm overflow-hidden border border-[#E0E0E0] dark:border-[#333333]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E0E0E0] dark:border-[#333333] bg-[#F5F7FA] dark:bg-[#262626]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#607D8B] dark:text-[#B0BEC5] uppercase tracking-wider">
                      건물명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#607D8B] dark:text-[#B0BEC5] uppercase tracking-wider">
                      주소
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#607D8B] dark:text-[#B0BEC5] uppercase tracking-wider">
                      층수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#607D8B] dark:text-[#B0BEC5] uppercase tracking-wider">
                      건축년도
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#607D8B] dark:text-[#B0BEC5] uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#607D8B] dark:text-[#B0BEC5] uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuildings.length > 0 ? (
                    filteredBuildings.map((building) => (
                      <tr
                        key={building.id}
                        className="border-b border-[#E0E0E0] dark:border-[#333333] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-[#263238] dark:text-white">
                          {building.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#263238] dark:text-white">
                          {building.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#263238] dark:text-white">
                          {building.floors}층
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#263238] dark:text-white">
                          {building.yearBuilt}년
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              building.status === "active"
                                ? "bg-[#43A047]/10 text-[#43A047]"
                                : building.status === "maintenance"
                                ? "bg-[#FFA000]/10 text-[#FFA000]"
                                : "bg-[#E53935]/10 text-[#E53935]"
                            }`}
                          >
                            {building.status === "active"
                              ? "정상"
                              : building.status === "maintenance"
                              ? "유지보수 중"
                              : "비활성화"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link
                            href={`/buildings/${building.id}`}
                            className="text-[#1E88E5] hover:text-[#1976D2] font-medium mr-4"
                          >
                            상세
                          </Link>
                          {["SUPER_ADMIN", "BUILDING_ADMIN"].includes(
                            userRole as string
                          ) && (
                            <Link
                              href={`/buildings/${building.id}/edit`}
                              className="text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5] dark:hover:text-[#1E88E5] font-medium"
                            >
                              편집
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-[#607D8B] dark:text-[#B0BEC5]"
                      >
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 건물 목록 (카드 뷰) */}
        {viewMode === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuildings.length > 0 ? (
              filteredBuildings.map((building) => (
                <div
                  key={building.id}
                  className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm overflow-hidden border border-[#E0E0E0] dark:border-[#333333] hover:shadow transition-shadow"
                >
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={
                        building.imageUrl ||
                        "/images/buildings/default-building.jpg"
                      }
                      alt={building.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,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"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          building.status === "active"
                            ? "bg-[#43A047]/80 text-white"
                            : building.status === "maintenance"
                            ? "bg-[#FFA000]/80 text-white"
                            : "bg-[#E53935]/80 text-white"
                        }`}
                      >
                        {building.status === "active"
                          ? "정상"
                          : building.status === "maintenance"
                          ? "유지보수 중"
                          : "비활성화"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#263238] dark:text-white mb-2">
                      {building.name}
                    </h3>
                    <p className="text-[#607D8B] dark:text-[#B0BEC5] mb-4">
                      {building.address}
                    </p>
                    <div className="flex justify-between text-sm mb-4">
                      <div>
                        <span className="text-[#9E9E9E]">층수</span>
                        <p className="text-[#263238] dark:text-white font-medium">
                          {building.floors}층
                        </p>
                      </div>
                      <div>
                        <span className="text-[#9E9E9E]">건축년도</span>
                        <p className="text-[#263238] dark:text-white font-medium">
                          {building.yearBuilt}년
                        </p>
                      </div>
                      <div>
                        <span className="text-[#9E9E9E]">면적</span>
                        <p className="text-[#263238] dark:text-white font-medium">
                          {building.totalArea.toLocaleString()}㎡
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Link
                        href={`/buildings/${building.id}`}
                        className="text-[#1E88E5] hover:text-[#1976D2] font-medium flex items-center"
                      >
                        상세보기
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                      {["SUPER_ADMIN", "BUILDING_ADMIN"].includes(
                        userRole as string
                      ) && (
                        <Link
                          href={`/buildings/${building.id}/edit`}
                          className="text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1E88E5] dark:hover:text-[#1E88E5] font-medium"
                        >
                          편집
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-8 text-center text-[#607D8B] dark:text-[#B0BEC5] border border-[#E0E0E0] dark:border-[#333333]">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
