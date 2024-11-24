"use client";

import { Button } from "@/components-shadcn/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import TaskItem from "./task-item";
import CreateTaskModal from "./create-task-modal";
import { jwtDecode } from "jwt-decode";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      const user = jwtDecode<{ id: string }>(getToken);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3003/tasks/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const tasksData = response.data;
      setTasks(tasksData);

    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Minha ToDo List</h1>
        <Button onClick={() => setIsModalOpen(true)}>Adicionar Tarefa</Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} fetchTasks={fetchTasks} />
        ))}
      </div>

      {/* Modal de criação de tarefas */}
      {isModalOpen && (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={fetchTasks}
        />
      )}
    </div>
  );
}

export default TodoList;
