import knex from "../database/connection";
import bcrypt from "bcryptjs";

class UserService {
  async createUser(id: string, name: string, email: string, password: string, bg_profile: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await knex("users").insert({
        id,
        name,
        email,
        password: hashedPassword,
        bg_profile,
      });
    } catch (error) {
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await knex("users").where("email", email).first();
  
      if (!user) {
        throw new Error("User not found");
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  async getUserByEmail(email: string) {
    try {
      const user = await knex("users").select('*').where("email", email).first();
      console.log(user);

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
