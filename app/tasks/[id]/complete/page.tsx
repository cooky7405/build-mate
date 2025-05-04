"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { use } from "react";

interface Task {
  id: string;
  status: string;
  template: {
    id: string;
    title: string;
    description: string;
  };
  building: {
    id: string;
    name: string;
    address: string;
  };
}

interface TaskParams {
  id: string;
}

interface TaskCompletePageProps {
  params: Promise<TaskParams>;
}

export default function TaskCompletePage({ params }: TaskCompletePageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 완료 보고서 내용
  const [content, setContent] = useState("");
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tasks/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("업무를 찾을 수 없습니다");
          }
          throw new Error("업무 정보를 가져오는데 실패했습니다");
        }

        const data = await response.json();

        // 이미 완료된 업무인 경우
        if (data.status === "COMPLETED") {
          throw new Error("이미 완료된 업무입니다");
        }

        setTask(data);
      } catch (err) {
        console.error("업무 조회 오류:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("업무를 불러오는 중 오류가 발생했습니다");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleAddAttachment = () => {
    if (newAttachmentUrl && !attachmentUrls.includes(newAttachmentUrl)) {
      setAttachmentUrls([...attachmentUrls, newAttachmentUrl]);
      setNewAttachmentUrl("");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachmentUrls(attachmentUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("완료 보고 내용을 입력해주세요");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`/api/tasks/${id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          attachmentUrls,
          reporterId: "현재로그인한사용자ID", // 실제 구현시 세션에서 가져옴
        }),
      });

      if (!response.ok) {
        throw new Error("완료 보고 제출에 실패했습니다");
      }

      router.push(`/tasks/${id}`);
    } catch (err) {
      console.error("완료 보고 제출 오류:", err);
      alert("완료 보고 제출에 실패했습니다");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-xl">업무 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">{error}</h1>
          <Link href={`/tasks/${id}`}>
            <Button variant="default">업무 상세로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">업무 완료 보고서 작성</h1>
        <Link href={`/tasks/${id}`}>
          <Button variant="outline">취소</Button>
        </Link>
      </div>

      {task && (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">
              {task.template.title}
            </h2>
            <p className="text-gray-700">{task.template.description}</p>
            <div className="mt-2">
              <span className="font-medium">건물: </span>
              <span>{task.building.name}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="content"
                className="block text-lg font-medium mb-2"
              >
                완료 보고 내용
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                placeholder="업무 완료 보고 내용을 작성해주세요..."
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                첨부 파일 (URL)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={newAttachmentUrl}
                  onChange={(e) => setNewAttachmentUrl(e.target.value)}
                  className="flex-1"
                  placeholder="첨부 파일 URL 입력"
                />
                <Button
                  type="button"
                  onClick={handleAddAttachment}
                  variant="default"
                >
                  추가
                </Button>
              </div>

              {attachmentUrls.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {attachmentUrls.map((url, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate flex-1"
                      >
                        {url}
                      </a>
                      <Button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        variant="ghost"
                        className="ml-2 text-red-600 h-auto p-1"
                      >
                        삭제
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Link href={`/tasks/${id}`}>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={submitting}
              >
                {submitting ? "제출 중..." : "완료 보고서 제출"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
