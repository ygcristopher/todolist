import knex from "../../database/connection";
import bcrypt from "bcryptjs";

class UserService {
  async createUser(id: string, name: string, email: string, password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await knex("users").insert({
        id,
        name,
        email,
        password: hashedPassword,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await knex("users").where("email", email).first();

      if (!user) {
        return { error: "User not found" };
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return { error: "Invalid password" };
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await knex("users").where("email", email).first();

      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserService();
