import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();

router.post("/create-user", UserController.createUser);
router.post("/login-user", UserController.loginUser);

export default router;
