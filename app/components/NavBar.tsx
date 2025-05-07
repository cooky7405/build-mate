"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const handleLogoClick = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <span
          className="text-xl font-bold cursor-pointer"
          onClick={handleLogoClick}
        >
          빌딩메이트
        </span>
        <div className="space-x-4">
          <Link href="/buildings" className="hover:underline">
            건물 관리
          </Link>
          <Link href="/dashboard" className="hover:underline">
            대시보드
          </Link>
        </div>
      </div>
    </nav>
  );
}
