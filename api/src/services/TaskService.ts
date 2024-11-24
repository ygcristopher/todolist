import knex from "../../database/connection";

class TaskService {
  async createTask(
    id: string,
    user_id: string,
    title: string,
    description: string,
  ) {
    try {
      await knex("tasks").insert({
        id,
        user_id,
        title,
        description,
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
      const tasks = await knex("tasks").select("*").where("user_id", userId);
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

  async taskCompleted(userId: string, taskId: string) {
    try {
      await knex("tasks")
        .update({ completed: 1 })
        .where("user_id", userId)
        .andWhere("id", taskId);
    } catch (error) {
      console.log(error);
    }
  }

    async editTask(userId: string, id: string, title: string, description: string) {
        try {
        await knex("tasks")
            .update({ title, description })
            .where("user_id", userId)
            .andWhere("id", id)
        } catch (error) {
        console.log(error);
        }
    }
}

export default new TaskService();
