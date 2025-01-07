import express from 'express';
import { protectRoute } from '../middleware/protectRoute';


const router = express.Router();

router.post("/create", protectRoute, createPost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/comment", protectRoute, createPost)
router.delete("/", protectRoute, deletePost)

export default router;