import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import UserService from "../services/UserService";

class UserController {
    async createUser(req: Request, res: Response) {
      const { name, email, password } = req.body;

        try{
            const user = await UserService.createUser(uuidv4(), name, email, password);
            return res.status(201).json(user)
        }catch(error) {
            console.log(error)
        }
    }

    async loginUser(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await UserService.loginUser(email, password);
            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
    }
 }
}

export default new UserController();

