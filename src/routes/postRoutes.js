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
router.get("/drafts/me", protect, (req, res, next) => {
  console.log('📥 Drafts endpoint hit');
  req.query.drafts_only = 'true';
  getMyPosts(req, res, next);
});
router.get("/private/me", protect, (req, res, next) => {
  console.log('📥 Private notes endpoint hit');
  req.query.private_only = 'true';
  getMyPosts(req, res, next);
});
router.post("/posts", protect, createPost);
router.put("/posts/:id", protect, updatePost);
router.delete("/posts/:id", protect, deletePost);

export default router;
