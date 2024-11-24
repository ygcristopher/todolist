import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import TaskService from "../services/TaskService";

class TasksController {
  async createTask(req: Request, res: Response) {
    const { title, description } = req.body;
    const user_id = req.user?.id;

    try {
      const idTask = uuidv4();
      if (!user_id) {
        return res.status(401).json({ message: "Token não fornecido" });
      }
      
      const task = await TaskService.createTask(idTask, user_id, title, description);
      return res.status(201).json(task);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      return res.status(500).json({ message: "Erro ao criar tarefa" });
    }
  }

  async getTasks(req: Request, res: Response) {
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ message: "Token não fornecido" });
      }
      const tasks = await TaskService.getTasks(userId);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      return res.status(500).json({ message: "Erro ao buscar tarefas" });
    }
  }

  async taskDelete(req: Request, res: Response) {
    const { taskId } = req.body
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      await TaskService.taskDelete(userId, taskId);
      return res.status(200).json({ message: "Tarefa deletada com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      return res.status(500).json({ message: "Erro ao deletar tarefa" });
    }
  }

  async taskCompleted(req: Request, res: Response) {
    const { taskId } = req.body;
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      await TaskService.taskCompleted(userId, taskId);
      return res.status(200).json({ message: "Tarefa concluída com sucesso" });
    } catch (error) {
      console.error("Erro ao concluir tarefa:", error);
      return res.status(500).json({ message: "Erro ao concluir tarefa"
  })
    }
  }

  async editTask(req: Request, res: Response) {
    const { id, title, description } = req.body;
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      await TaskService.editTask(userId, id, title, description);
      return res.status(200).json({ message: "Tarefa editada com sucesso" });
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
      return res.status(500).json({ message: "Erro ao editar tarefa" });
  }
}
}

export default new TasksController();
