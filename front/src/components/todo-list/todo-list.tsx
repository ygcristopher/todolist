"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import TaskItem from "./task-item";
import CreateTaskModal from "./create-task-modal";
import { jwtDecode } from "jwt-decode";
import Header from "../header/header";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  priority: "BAIXA" | "MEDIA" | "ALTA";
}

function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

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
      const response = await axios.get(
        `http://localhost:3003/tasks/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const tasksData = response.data;

      const priorities = tasksData.map(
        (task: { priority: string }) => task.priority
      );

      setPriority(priorities);
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterTasks(e.target.value);
  };

  const filterTasks = (term: string) => {
    if (!term) {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(term.toLowerCase()) ||
          task.description.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  };

  return (
    <div className="container mx-auto mt-0 flex flex-col gap-4">
      <div>
        <Header />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Adicione uma tarefa</h1>
        <Button onClick={() => setIsModalOpen(true)}>Adicionar Tarefa</Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar tarefa..."
          className="p-2 rounded-md bg-gray-100 w-full"
        />
      </div>

      {/* Modal de criação de tarefas */}
      {isModalOpen && (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={fetchTasks}
        />
      )}

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              fetchTasks={fetchTasks}
              priority={task.priority}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList;
