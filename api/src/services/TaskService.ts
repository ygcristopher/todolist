import knex from "../../database/connection";

class TaskService {
  async createTask(id: string, user_id: string, title: string, description: string) {
    try {
      await knex("tasks").insert({
        id,
        user_id,
        title,
        description,
        created_at: new Date(),
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
}

export default new TaskService();
