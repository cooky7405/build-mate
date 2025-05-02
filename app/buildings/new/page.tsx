"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 건물 데이터 인터페이스
interface Building {
  name: string;
  address: string;
  floors: number;
  yearBuilt: number;
  totalArea: number;
  description: string;
  status: string;
  imageUrl: string;
}

export default function NewBuildingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Building>({
    name: "",
    address: "",
    floors: 1,
    yearBuilt: new Date().getFullYear(),
    totalArea: 0,
    description: "",
    status: "active",
    imageUrl: "https://via.placeholder.com/600x400?text=Building",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 페이지 로드 시 권한 확인
  useEffect(() => {
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

        // SUPER_ADMIN 또는 BUILDING_ADMIN만 건물 추가 가능
        if (["SUPER_ADMIN", "BUILDING_ADMIN"].includes(role)) {
          setIsAuthorized(true);
        } else {
          router.push("/buildings");
        }
      } catch (error) {
        console.error("인증 확인 중 오류:", error);
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  // 폼 입력 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "floors" || name === "yearBuilt" || name === "totalArea"
          ? Number(value)
          : value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // API 호출 로직 실행
      const response = await fetch("/api/buildings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("건물 생성 실패");
      }

      const data = await response.json();
      console.log("생성된 건물 데이터:", data);

      // 성공적으로 저장 후 목록 페이지로 이동
      router.push("/buildings");
    } catch (error) {
      console.error("건물 추가 중 오류:", error);
      setIsSaving(false);
      // 에러 처리 로직 (알림 표시 등)
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    router.push("/buildings");
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
      <div className="max-w-3xl mx-auto">
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
                    새 건물 추가
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* 추가 폼 */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-6 mb-6 border border-[#E0E0E0] dark:border-[#333333]">
          <h1 className="text-2xl font-bold text-[#263238] dark:text-white mb-6">
            새 건물 추가
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] mb-2">
                  건물명 *
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] mb-2">
                  주소 *
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] mb-2">
                  층수 *
                </label>
                <input
                  type="number"
                  name="floors"
                  className="w-full px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={formData.floors}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] mb-2">
                  건축년도 *
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  className="w-full px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] mb-2">
                  총 면적 (㎡) *
                </label>
                <input
                  type="number"
                  name="totalArea"
                  className="w-full px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={formData.totalArea}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] mb-2">
                  상태 *
                </label>
                <select
                  name="status"
                  className="w-full px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">정상</option>
                  <option value="maintenance">유지보수 중</option>
                  <option value="inactive">비활성화</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] mb-2">
                  이미지 URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  className="w-full px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#607D8B] dark:text-[#B0BEC5] mb-2">
                  건물 설명
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-transparent text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-[#E0E0E0] dark:border-[#333333] rounded-lg text-[#607D8B] dark:text-[#B0BEC5] hover:bg-[#F5F7FA] dark:hover:bg-[#333333] transition-colors"
                disabled={isSaving}
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-lg transition-colors flex items-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    저장 중...
                  </>
                ) : (
                  "저장"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
