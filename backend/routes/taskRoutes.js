import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware.js"
import { getTasks,createTask,updateTask,deleteTask } from "../controllers/taskController.js";


router.get('/',protect, getTasks);
router.post('/',protect, createTask);
router.delete('/:id',protect, deleteTask);
router.put('/:id',protect, updateTask);

export default router;
