import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import UserService from "../services/UserService";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { getRandomProfileColor } from "../models/randomBgColor";

config();

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

      return res.status(201).json({ message: "Created Successfully", user });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await UserService.loginUser(email, password);

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          bg_profile: user.bg_profile,
        },
        access_token || "",
        { expiresIn: "15d" }
      );

      return res
        .status(200)
        .json({ message: "Login successfully", user, token });
    } catch (error: any) {
      const errorMessage = error.message || "Internal server error";
      return res.status(406).json({ error: errorMessage });
    }
  }
}

export default new UserController();
