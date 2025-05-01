"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
}

// 임시 건물 데이터 (API 연동 전까지 사용)
const MOCK_BUILDINGS = [
  {
    id: "1",
    name: "센트럴 타워",
    address: "서울특별시 강남구 테헤란로 123",
    floors: 25,
    yearBuilt: 2015,
    totalArea: 15000,
    description:
      "강남 중심부에 위치한 현대적인 오피스 빌딩으로, 최고급 시설과 서비스를 제공합니다.",
    status: "active",
    imageUrl: "https://via.placeholder.com/600x400?text=Building+1",
  },
  {
    id: "2",
    name: "그랜드 오피스",
    address: "서울특별시 서초구 반포대로 45",
    floors: 18,
    yearBuilt: 2010,
    totalArea: 12000,
    description:
      "서초구 반포대로에 위치한 비즈니스 중심지에 자리한 그랜드 오피스 빌딩입니다.",
    status: "active",
    imageUrl: "https://via.placeholder.com/600x400?text=Building+2",
  },
  {
    id: "3",
    name: "스카이 빌딩",
    address: "서울특별시 송파구 올림픽로 78",
    floors: 22,
    yearBuilt: 2018,
    totalArea: 20000,
    description:
      "송파구 올림픽로에 위치한 현대식 복합 빌딩으로, 사무실과 상업 공간을 제공합니다.",
    status: "active",
    imageUrl: "https://via.placeholder.com/600x400?text=Building+3",
  },
  {
    id: "4",
    name: "파크뷰 타워",
    address: "서울특별시 마포구 마포대로 567",
    floors: 15,
    yearBuilt: 2012,
    totalArea: 8500,
    description: "마포구 중심부에 위치한 깔끔한 디자인의 사무실 빌딩입니다.",
    status: "maintenance",
    imageUrl: "https://via.placeholder.com/600x400?text=Building+4",
  },
];

export default function BuildingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [building, setBuilding] = useState<Building | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 페이지 로드 시 건물 데이터 로드 및 권한 체크
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
    const loadBuilding = () => {
      // API 호출 대신 임시 데이터 사용
      const foundBuilding = MOCK_BUILDINGS.find((b) => b.id === id);

      if (foundBuilding) {
        setBuilding(foundBuilding);
      } else {
        router.push("/buildings");
      }
    };

    checkAuth();
    loadBuilding();
  }, [id, router]);

  // 권한 확인 중
  if (!isAuthorized || !building) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
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
              <div className="rounded-lg overflow-hidden h-60">
                <img
                  src={building.imageUrl}
                  alt={building.name}
                  className="w-full h-full object-cover"
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
      </div>
    </div>
  );
}
