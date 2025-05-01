"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 임시 건물 데이터 (API 연동 전까지 사용)
const MOCK_BUILDINGS = [
  {
    id: "1",
    name: "센트럴 타워",
    address: "서울특별시 강남구 테헤란로 123",
    floors: 25,
    yearBuilt: 2015,
    totalArea: 15000,
    status: "active",
    imageUrl: "https://via.placeholder.com/300x200?text=Building+1",
  },
  {
    id: "2",
    name: "그랜드 오피스",
    address: "서울특별시 서초구 반포대로 45",
    floors: 18,
    yearBuilt: 2010,
    totalArea: 12000,
    status: "active",
    imageUrl: "https://via.placeholder.com/300x200?text=Building+2",
  },
  {
    id: "3",
    name: "스카이 빌딩",
    address: "서울특별시 송파구 올림픽로 78",
    floors: 22,
    yearBuilt: 2018,
    totalArea: 20000,
    status: "active",
    imageUrl: "https://via.placeholder.com/300x200?text=Building+3",
  },
  {
    id: "4",
    name: "파크뷰 타워",
    address: "서울특별시 마포구 마포대로 567",
    floors: 15,
    yearBuilt: 2012,
    totalArea: 8500,
    status: "maintenance",
    imageUrl: "https://via.placeholder.com/300x200?text=Building+4",
  },
];

export default function BuildingsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [buildings, setBuildings] = useState(MOCK_BUILDINGS);
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

  // 검색 및 필터링된 건물 목록
  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch =
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || building.status === statusFilter;

    return matchesSearch && matchesStatus;
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
                    <img
                      src={building.imageUrl}
                      alt={building.name}
                      className="w-full h-full object-cover"
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
