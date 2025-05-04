"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          빌딩메이트
        </Link>
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
