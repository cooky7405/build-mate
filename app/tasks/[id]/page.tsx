"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskDetails from "@/app/components/tasks/TaskDetails";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TaskDetail {
  id: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  buildingId: string;
  templateId: string;
  creatorId: string | null;
  assigneeId: string | null;
  template: {
    id: string;
    title: string;
    description: string;
    priority: string;
    managerType: string;
    category: string;
  };
  building: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
    adminManager?: {
      id: string;
      name: string;
      email: string;
    } | null;
    bizManager?: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  } | null;
  creator?: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  } | null;
  completionReport?: {
    id: string;
    content: string;
    attachmentUrls: string[];
    reporterId: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: TaskPageProps) {
  const router = useRouter();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

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

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("업무 상태 변경에 실패했습니다");
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
    } catch (err) {
      console.error("업무 상태 변경 오류:", err);
      alert("업무 상태 변경에 실패했습니다");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("업무 삭제에 실패했습니다");
      }

      router.push("/tasks");
    } catch (err) {
      console.error("업무 삭제 오류:", err);
      alert("업무 삭제에 실패했습니다");
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
          <Link href="/tasks">
            <Button>업무 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">업무 상세</h1>
        <Link href="/tasks">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>

      {task && (
        <TaskDetails
          task={task}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
