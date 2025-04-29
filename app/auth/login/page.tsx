"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "로그인 실패");

      // JWT 토큰을 localStorage에 저장 (실제 서비스에서는 httpOnly 쿠키 권장)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);

      setSuccess("로그인 성공! 대시보드로 이동합니다...");

      // 사용자 역할에 따라 다른 대시보드로 리디렉션
      setTimeout(() => {
        switch (data.user.role) {
          case "SUPER_ADMIN":
            router.push("/dashboard/ceo");
            break;
          case "BUILDING_ADMIN":
            router.push("/dashboard/accounting");
            break;
          case "BUILDING_MANAGER":
            router.push("/dashboard/manager");
            break;
          case "USER":
            router.push("/dashboard/user");
            break;
          default:
            router.push("/dashboard");
        }
      }, 1000); // 1초 후 리디렉션
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          로그인
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              이메일
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              비밀번호
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {success && (
          <p className="mt-4 text-green-600 text-center">{success}</p>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400">
            계정이 없으신가요?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              회원가입하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
