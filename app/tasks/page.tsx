import React from "react";
import TasksList from "@/app/components/tasks/TasksList";

export default function TasksPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">업무 관리</h1>
      <TasksList />
    </div>
  );
}
