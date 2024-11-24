// components/TaskItem.tsx
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components-shadcn/ui/button";
import axios from "axios";

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

const TaskItem = ({ task, fetchTasks }: TaskItemProps) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const toggleCompleted = async () => {
    try {
      await axios.put(`/api/tasks/${task.id}`, { completed: !isCompleted });
      setIsCompleted(!isCompleted);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`/api/tasks/${task.id}`);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded shadow">
      <div className="flex items-center space-x-4">
        <Checkbox checked={isCompleted} onCheckedChange={toggleCompleted} />
        <div>
          <p className={`font-bold ${isCompleted ? "line-through" : ""}`}>
            {task.title}
          </p>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => console.log("Editar tarefa")}>
          Editar
        </Button>
        <Button variant="destructive" onClick={deleteTask}>
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
