import express from "express";
import UserController from "../controllers/UserController";
import TasksController from "../controllers/TasksController";
import  UserAuth  from "../middleware/userAuth";

const router = express.Router();

// User routes
router.post("/create-user", UserController.createUser);
router.post("/login-user", UserController.loginUser);

// Task routes
router.post("/create-task/:userId", UserAuth, TasksController.createTask);
router.get("/tasks/:userId", UserAuth, TasksController.getTasks);
router.put("/tasks/:userId", UserAuth, TasksController.taskCompleted);
router.put("/edit-tasks/:userId", UserAuth, TasksController.editTask);
router.delete("/tasks/:userId", UserAuth, TasksController.taskDelete);

export default router;
