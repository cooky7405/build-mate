"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

interface Task {
  id: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
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
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  creator?: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  completionReport?: {
    id: string;
    content: string;
    createdAt: string;
  } | null;
}

interface Template {
  id: string;
  title: string;
  managerType: string;
}

interface TasksListProps {
  buildingId?: string;
  managerType?: string;
  initialStatusFilter?: string;
}

export default function TasksList({
  buildingId,
  managerType,
  initialStatusFilter = "all",
}: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터링 상태
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<string>("all");

  // 업무 템플릿 목록 로드
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/task-templates");

        if (!response.ok) {
          throw new Error("업무 템플릿 목록을 가져오는데 실패했습니다");
        }

        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error("업무 템플릿 로드 오류:", err);
      }
    };

    fetchTemplates();
  }, []);

  // fetchTasks를 useCallback으로 감싸줍니다
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      // 쿼리 파라미터 구성
      const params = new URLSearchParams();
      if (buildingId) params.append("buildingId", buildingId);
      if (managerType) params.append("managerType", managerType);
      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);
      if (templateFilter && templateFilter !== "all")
        params.append("templateId", templateFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/tasks?${params.toString()}`);

      if (!response.ok) {
        throw new Error("업무 목록을 가져오는데 실패했습니다");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("업무 목록 조회 오류:", err);
      setError("업무 목록을 불러오는 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }, [buildingId, managerType, statusFilter, templateFilter, searchTerm]); // 의존성 추가

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // fetchTasks를 의존성 배열에 추가

  // 상태별 배지 스타일 및 텍스트
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            대기중
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            진행중
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            완료
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            취소됨
          </Badge>
        );
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  // 업무 매니저 타입에 따른 배지
  const getManagerTypeBadge = (managerType: string) => {
    switch (managerType) {
      case "ADMIN":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            관리책임자
          </Badge>
        );
      case "BIZ":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
            경영책임자
          </Badge>
        );
      case "BOTH":
        return (
          <Badge variant="outline" className="bg-teal-100 text-teal-800">
            공통
          </Badge>
        );
      default:
        return null;
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 업무가 최근 생성된 항목인지 확인 (24시간 이내)
  const isRecentlyCreated = (dateString: string) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const hoursDiff =
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  // 현재 뷰 모드에 따른 필터링
  const getFilteredTasks = () => {
    let filtered = tasks;

    // 검색어로 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.template.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          task.building.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 뷰 모드에 따른 필터링
    if (viewMode === "recent") {
      filtered = filtered.filter((task) => isRecentlyCreated(task.createdAt));
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  if (loading)
    return <div className="p-4 text-center">업무 목록을 불러오는 중...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="all"
        value={viewMode}
        onValueChange={setViewMode}
        className="w-full"
      >
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <TabsList>
            <TabsTrigger value="all">모든 업무</TabsTrigger>
            <TabsTrigger value="recent">최근 생성 업무</TabsTrigger>
          </TabsList>

          <Link href="/tasks/new">
            <Button>업무 추가</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="상태별 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="PENDING">대기중</SelectItem>
              <SelectItem value="IN_PROGRESS">진행중</SelectItem>
              <SelectItem value="COMPLETED">완료</SelectItem>
              <SelectItem value="CANCELLED">취소됨</SelectItem>
            </SelectContent>
          </Select>

          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="템플릿별 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 템플릿</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="업무 또는 건물명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <TabsContent value="all" className="mt-0">
          {renderTasksTable(filteredTasks)}
        </TabsContent>
        <TabsContent value="recent" className="mt-0">
          {renderTasksTable(filteredTasks)}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderTasksTable(tasks: Task[]) {
    if (tasks.length === 0) {
      return (
        <div className="text-center p-8 border rounded-md">
          <p className="text-gray-500">표시할 업무가 없습니다</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>업무</TableHead>
            <TableHead>건물</TableHead>
            <TableHead>담당자</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>마감일</TableHead>
            <TableHead>분류</TableHead>
            <TableHead>액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className={isRecentlyCreated(task.createdAt) ? "bg-blue-50" : ""}
            >
              <TableCell>
                <div className="font-medium">{task.template.title}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {task.template.description}
                </div>
                {isRecentlyCreated(task.createdAt) && (
                  <Badge className="bg-blue-100 text-blue-800 mt-1">신규</Badge>
                )}
              </TableCell>
              <TableCell>
                <Link
                  href={`/buildings/${task.buildingId}`}
                  className="hover:underline"
                >
                  {task.building.name}
                </Link>
              </TableCell>
              <TableCell>{task.assignee ? task.assignee.name : "-"}</TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>{formatDate(task.dueDate)}</TableCell>
              <TableCell>
                {getManagerTypeBadge(task.template.managerType)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/tasks/${task.id}`}>
                    <Button variant="outline" size="sm">
                      상세
                    </Button>
                  </Link>
                  {task.status !== "COMPLETED" && (
                    <Link href={`/tasks/${task.id}/complete`}>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        완료 보고
                      </Button>
                    </Link>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
