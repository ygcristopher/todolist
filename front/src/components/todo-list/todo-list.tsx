"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import TaskItem from "./task-item";
import CreateTaskModal from "./create-task-modal";
import { jwtDecode } from "jwt-decode";
import Header from "../header/header";
import { CircularProgress } from "../circular-progress/circular-progress";
import { Input } from "../ui/input";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

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
  const [loading, setLoading] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);

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
    setLoading(true);
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

      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
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

  const filterByPriority = (priority: string | null) => {
    setPriorityFilter(priority);
    if (priority) {
      const filtered = tasks.filter((task) => task.priority === priority);
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  };

  const getPriorityText = () => {
    if (!priorityFilter) return "Filtro de Prioridade";
    return priorityFilter === "BAIXA"
      ? "Baixa"
      : priorityFilter === "MEDIA"
      ? "Média"
      : "Alta";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="container mx-auto mt-0 flex flex-col gap-4">
      <div>
        <Header />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Adicione uma tarefa</h1>
        <Button onClick={() => setIsModalOpen(true)}>Adicionar Tarefa</Button>
      </div>

      <div className="mb-4 flex gap-8">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar tarefa..."
          className="border-2 p-2 rounded text-black bg-white w-full"
        />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto w-40">
              {getPriorityText()} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-40 rounded bg-black/80 text-white p-2 cursor-pointer"
          >
            <DropdownMenuItem
              className="text-green-200"
              onClick={() => filterByPriority("BAIXA")}
            >
              Baixa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-yellow-200"
              onClick={() => filterByPriority("MÉDIA")}
            >
              Média
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-200"
              onClick={() => filterByPriority("ALTA")}
            >
              Alta
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => filterByPriority(null)}>
              Todos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            {[...Array(Math.ceil(filteredTasks.length / tasksPerPage))].map(
              (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === index + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    currentPage < Math.ceil(filteredTasks.length / tasksPerPage)
                  )
                    handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Modal de criação de tarefas */}
      {isModalOpen && (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={fetchTasks}
        />
      )}

      <div className="space-y-4 mb-14">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress />
          </div>
        ) : currentTasks.length === 0 ? (
          <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
        ) : (
          currentTasks.map((task) => (
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
