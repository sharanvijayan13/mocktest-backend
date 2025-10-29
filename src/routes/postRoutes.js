import express from "express";
import {
  getAllPosts,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/posts", getAllPosts);
router.get("/posts/me", protect, getMyPosts);
router.post("/posts", protect, createPost);
router.put("/posts/:id", protect, updatePost);
router.delete("/posts/:id", protect, deletePost);

export default router;
