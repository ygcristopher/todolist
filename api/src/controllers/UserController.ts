import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import UserService from "../services/UserService";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { getRandomProfileColor } from "../models/randomBgColor";

config()

const access_token = process.env.ACCESS_TOKEN_SECRET;

class UserController {
  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const bg_profile = getRandomProfileColor();

    try {
      const user = await UserService.createUser(
        uuidv4(),
        name,
        email,
        password,
        bg_profile
      );

      return res.status(201).json({message: "Created Successfully", user});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
  
    try {
      const userEmail = await UserService.getUserByEmail(email);
      
      if (!userEmail) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const user = await UserService.loginUser(email, password);
  
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      //validar senha passada pelo usuário com a senha do banco
  
      const token = jwt.sign(
        { id: userEmail.id, email: userEmail.email, name: userEmail.name, bg_profile: userEmail.bg_profile },
        access_token || "", 
        { expiresIn: "1h" } 
      );
  
      return res.status(200).json({ message:"Login successfully", user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}  

export default new UserController();
