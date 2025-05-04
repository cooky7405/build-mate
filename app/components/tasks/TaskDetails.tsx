"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Task 타입 정의 (상세 버전)
interface TaskDetails {
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
    reporter?: {
      id: string;
      name: string;
      email: string;
    };
  } | null;
}

interface TaskDetailsProps {
  task: TaskDetails;
  onStatusChange?: (newStatus: string) => void;
  onDelete?: () => void;
}

export default function TaskDetails({
  task,
  onStatusChange,
  onDelete,
}: TaskDetailsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  // 매니저 타입에 따른 배지
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

  // 우선순위에 따른 배지
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            높음
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            중간
          </Badge>
        );
      case "LOW":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            낮음
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

  // 업무 상태 변경 핸들러
  const handleStatusChange = async (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setDeleteDialogOpen(false);
    }
  };

  // 담당 책임자 정보
  const getResponsibleManager = () => {
    const managerType = task.template.managerType;
    if (managerType === "ADMIN" && task.building.adminManager) {
      return {
        name: task.building.adminManager.name,
        email: task.building.adminManager.email,
        type: "관리책임자",
      };
    } else if (managerType === "BIZ" && task.building.bizManager) {
      return {
        name: task.building.bizManager.name,
        email: task.building.bizManager.email,
        type: "경영책임자",
      };
    } else if (managerType === "BOTH") {
      return {
        name: "관리 및 경영 책임자",
        email: "",
        type: "공통",
      };
    }
    return null;
  };

  const responsibleManager = getResponsibleManager();

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getManagerTypeBadge(task.template.managerType)}
                {getPriorityBadge(task.template.priority)}
                {getStatusBadge(task.status)}
              </div>
              <CardTitle className="text-2xl">{task.template.title}</CardTitle>
              <CardDescription className="mt-2">
                작성일: {formatDate(task.createdAt)} | 마감일:{" "}
                {formatDate(task.dueDate)}
              </CardDescription>
            </div>

            <div className="flex gap-2">
              {task.status !== "COMPLETED" && (
                <>
                  <Link href={`/tasks/${task.id}/edit`}>
                    <Button variant="outline">수정</Button>
                  </Link>

                  <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">삭제</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          업무를 삭제하시겠습니까?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          이 작업은 되돌릴 수 없습니다. 이 업무가 영구적으로
                          삭제됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600"
                        >
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">업무 설명</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.template.description}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-md font-semibold mb-2">건물 정보</h3>
              <Link
                href={`/buildings/${task.buildingId}`}
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                {task.building.imageUrl && (
                  <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image
                      src={task.building.imageUrl}
                      alt={task.building.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium">{task.building.name}</p>
                  <p className="text-sm text-gray-500">
                    {task.building.address}
                  </p>
                </div>
              </Link>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">담당자</h3>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  {task.assignee.profileImage && (
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <Image
                        src={task.assignee.profileImage}
                        alt={task.assignee.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{task.assignee.name}</p>
                    <p className="text-sm text-gray-500">
                      {task.assignee.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">담당자 미지정</p>
              )}
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">담당 책임자</h3>
              {responsibleManager ? (
                <div>
                  <p className="font-medium">{responsibleManager.name}</p>
                  <p className="text-sm text-gray-500">
                    {responsibleManager.email}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {responsibleManager.type}
                  </Badge>
                </div>
              ) : (
                <p className="text-gray-500">책임자 미지정</p>
              )}
            </div>
          </div>

          {task.status !== "COMPLETED" && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">업무 상태 변경</h3>
              <div className="flex gap-2">
                {task.status !== "PENDING" && (
                  <Button
                    onClick={() => handleStatusChange("PENDING")}
                    variant="outline"
                  >
                    대기 상태로 변경
                  </Button>
                )}
                {task.status !== "IN_PROGRESS" && (
                  <Button
                    onClick={() => handleStatusChange("IN_PROGRESS")}
                    variant="outline"
                  >
                    진행 중으로 변경
                  </Button>
                )}
                {task.status !== "CANCELLED" && (
                  <Button
                    onClick={() => handleStatusChange("CANCELLED")}
                    variant="outline"
                    className="border-red-300 text-red-700"
                  >
                    취소됨으로 변경
                  </Button>
                )}
                <Link href={`/tasks/${task.id}/complete`}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    완료 보고서 작성
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {task.completionReport && (
            <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="mr-2">완료 보고서</span>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800"
                >
                  {formatDate(task.completedAt)}에 완료
                </Badge>
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">
                {task.completionReport.content}
              </p>

              {task.completionReport.attachmentUrls &&
                task.completionReport.attachmentUrls.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">첨부파일</h4>
                    <div className="flex flex-wrap gap-2">
                      {task.completionReport.attachmentUrls.map(
                        (url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 p-1 bg-white rounded border"
                          >
                            {/* 첨부파일 아이콘 추가 가능 */}
                            첨부파일 {index + 1}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
