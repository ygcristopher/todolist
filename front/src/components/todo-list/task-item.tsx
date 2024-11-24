"use client"

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  fetchTasks: () => void;
}

const TaskItem = ({ task, fetchTasks,  }: TaskItemProps) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      const user = jwtDecode<{ id: string }>(getToken);
      setUserId(user.id);
    }
  }, []);

  const toggleCompleted = async () => {
    try {
      await axios.put(
        `http://localhost:3003/tasks/${userId}`,  
        { completed: !isCompleted, taskId: task.id }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      setIsCompleted(!isCompleted);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`http://localhost:3003/tasks/${userId}`, {
        data: { taskId: task.id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const saveTask = async () => {
    try {
      await axios.put(
        `http://localhost:3003/edit-tasks/${userId}`,
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
      setIsEditing(false); 
      fetchTasks(); 
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded shadow">
      <div className="flex items-center space-x-4">
        <Checkbox checked={isCompleted} onCheckedChange={toggleCompleted} />
        <div>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded"
                placeholder="Título da Tarefa"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 mt-2 rounded w-full"
                placeholder="Descrição da Tarefa"
              />
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" onClick={saveTask}>
                  Salvar
                </Button>
                <Button variant="destructive" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className={`font-bold ${isCompleted ? "line-through" : ""}`}>
                {task.title}
              </p>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}
        <Button variant="destructive" onClick={deleteTask}>
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
