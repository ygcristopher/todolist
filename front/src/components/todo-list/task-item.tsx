"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import timeAgo from "@/models/formatTimeAgo";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "../ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import api from "@/utils/interceptor";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  priority: "BAIXA" | "MEDIA" | "ALTA";
}

interface TaskItemProps {
  task: Task;
  fetchTasks: () => void;
  priority: string;
}

const TaskItem = ({ task, fetchTasks }: TaskItemProps) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();

  const priorityColors = {
    BAIXA: "bg-green-200",
    MÉDIA: "bg-yellow-200",
    ALTA: "bg-red-200",
  };

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      const user = jwtDecode<{ id: string }>(getToken);
      setUserId(user.id);
    }
  }, []);

  const toggleCompleted = async () => {
    try {
      const response = await api.put(
        `/tasks/${userId}`,
        { completed: !isCompleted, taskId: task.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error || "An error occurred",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: data.message,
        variant: "success",
      });

      setIsCompleted(!isCompleted);
      fetchTasks();
    } catch (error) {
      console.error("Error update completed task", error);
      toast({
        title: "Error",
        description: "Internal server error. Please try again later.",
        variant: "error",
      });
    }
  };

  const deleteTask = async () => {
    try {
      const response = await api.delete(`/tasks/${userId}`, {
        data: { taskId: task.id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error || "An error occurred",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: data.message,
        variant: "success",
      });

      fetchTasks();
    } catch (error) {
      console.error("Error delete task", error);
      toast({
        title: "Error",
        description: "Internal server error. Please try again later.",
        variant: "error",
      });
    }
  };

  const editTask = async () => {
    try {
      const response = await api.put(
        `/edit-tasks/${userId}`,
        {
          id: task.id,
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error || "An error occurred",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: data.message,
        variant: "success",
      });

      setIsEditing(false);
      fetchTasks();
    } catch (error) {
      console.error("Error edit task", error);
      toast({
        title: "Error",
        description: "Internal server error. Please try again later.",
        variant: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded shadow ">
      <div className="flex items-center space-x-4 w-full">
        <Checkbox checked={isCompleted} onCheckedChange={toggleCompleted} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-52">Título</TableHead>
              <TableHead className="text-left w-52">Descrição</TableHead>
              <TableHead className="text-left">Prioridade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                className={`max-w-xs break-words ${
                  isCompleted ? "line-through" : ""
                }`}
              >
                {task.title}
              </TableCell>
              <TableCell className="max-w-xs break-words">
                {task.description}
              </TableCell>
              <TableCell
                className={`font-semibold rounded w-24 h-5 text-center ${
                  priorityColors[task.priority as "BAIXA" | "MÉDIA" | "ALTA"]
                }`}
              >
                {task.priority}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex space-x-2 flex-col gap-2 items-center justify-center">
          {/* Dialog for Edit Task */}
          <div>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger
                asChild
                className="flex items-center justify-center"
              >
                <Button variant="outline" className="w-40">
                  Editar
                </Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50" />
                <DialogContent className="fixed bg-white p-4 rounded shadow-lg max-w-md w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <DialogTitle className="text-center mb-4">
                    Editar Tarefa
                  </DialogTitle>
                  <form className="flex flex-col space-y-4">
                    <div>
                      <label className="text-sm">Título</label>
                      <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Título da Tarefa"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Descrição</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 rounded resize-none"
                        placeholder="Descrição da Tarefa"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={editTask}>
                        Salvar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </div>

          {/* Dialog for Confirm Delete */}
          <div>
            <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-40">
                  Excluir
                </Button>
              </DialogTrigger>

              <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50" />
                <DialogContent className="fixed bg-white p-4 rounded shadow-lg max-w-md w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <DialogTitle className="text-center">
                    Confirmar Exclusão
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Tem certeza de que deseja excluir esta tarefa?
                  </DialogDescription>
                  <div className="flex space-x-4 mt-4 items-center justify-center">
                    <Button variant="destructive" onClick={deleteTask}>
                      Sim
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Não
                    </Button>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </div>

          <div className="w-40 flex items-center justify-center">
            <p className="text-left text-xs text-blue-500">
              Criado {timeAgo(task.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
