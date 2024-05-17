import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideoComments,
  addComment,
  deleteComment,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);  // applying this middleware to all further routes in this file

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/:commentId").delete(deleteComment).patch(updateComment);

export default router;
