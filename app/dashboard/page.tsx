"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    try {
      const decoded = jwt.decode(token) as { role?: string };
      switch (decoded?.role) {
        case "SUPER_ADMIN":
          router.replace("/dashboard/ceo");
          break;
        case "BUILDING_ADMIN":
          router.replace("/dashboard/accounting");
          break;
        case "BUILDING_MANAGER":
          router.replace("/dashboard/manager");
          break;
        default:
          router.replace("/dashboard/user");
      }
    } catch {
      router.replace("/auth/login");
    }
  }, [router]);

  return <div>대시보드로 이동 중...</div>;
}
