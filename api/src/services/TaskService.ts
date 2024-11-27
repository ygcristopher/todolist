import knex from "../database/connection";

class TaskService {
  async createTask(
    id: string,
    user_id: string,
    title: string,
    description: string,
    priority: string
  ) {
    try {
      await knex("tasks").insert({
        id,
        user_id,
        title,
        description,
        priority,
        created_at: new Date(),
        completed: 0,
      });
      return { title, description };
    } catch (error) {
      console.log(error);
    }
  }

  async getTasks(userId: string) {
    try {
      const tasks = await knex("tasks").select("*").where("user_id", userId).orderBy("created_at", "desc");
      
      return tasks;
    } catch (error) {
      console.log(error);
    }
  }

  async taskDelete(userId: string, taskId: string) {
    try {
      await knex("tasks")
        .delete()
        .where("user_id", userId)
        .andWhere("id", taskId);
    } catch (error) {
      console.log(error);
    }
  }

  async taskCompleted(userId: string, taskId: string, completed: boolean) {
    try {
      await knex("tasks")
        .update({ completed: completed ? 1 : 0 })
        .where("user_id", userId)
        .andWhere("id", taskId);
    } catch (error) {
      console.log(error);
    }
  }

  async editTask(
    userId: string,
    id: string,
    title: string,
    description: string
  ) {
    try {
      await knex("tasks")
        .update({ title, description })
        .where("user_id", userId)
        .andWhere("id", id);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new TaskService();
