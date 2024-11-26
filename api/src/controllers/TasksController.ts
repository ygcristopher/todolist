import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import TaskService from "../services/TaskService";

class TasksController {
  async createTask(req: Request, res: Response) {
    const { title, description, priority } = req.body;
    const user_id = req.user?.id;

    try {
      const idTask = uuidv4();
      if (!user_id) {
        return res.status(401).json({ error: "Token not found" });
      }

      const task = await TaskService.createTask(
        idTask,
        user_id,
        title,
        description,
        priority
      );
      return res
        .status(201)
        .json({ message: "Task created successfully", task });
    } catch (error) {
      return res.status(500).json({ error: "Error created task" });
    }
  }

  async getTasks(req: Request, res: Response) {
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ error: "Token not found" });
      }
      const tasks = await TaskService.getTasks(userId);
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Error get tasks" });
    }
  }

  async taskDelete(req: Request, res: Response) {
    const { taskId } = req.body;
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ error: "Token not found" });
      }

      await TaskService.taskDelete(userId, taskId);
      return res.status(200).json({ message: "Task deleted success" });
    } catch (error) {
      return res.status(500).json({ message: "Error delete task" });
    }
  }

  async taskCompleted(req: Request, res: Response) {
    const { taskId } = req.body;
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ error: "Token not found" });
      }

      await TaskService.taskCompleted(userId, taskId);
      return res.status(200).json({ message: "Task complete success" });
    } catch (error) {
      return res.status(500).json({ error: "Error complete task" });
    }
  }

  async editTask(req: Request, res: Response) {
    const { id, title, description } = req.body;
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ error: "Token não fornecido" });
      }

      await TaskService.editTask(userId, id, title, description);
      return res.status(200).json({ message: "Task edit success" });
    } catch (error) {
      return res.status(500).json({ error: "Error edit task" });
    }
  }
}

export default new TasksController();
