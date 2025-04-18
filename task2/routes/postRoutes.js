import express from "express";
import { Post } from "../models/Post.js";
import axios from "axios";

const router = express.Router();

const authHeader = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTYxMTg5LCJpYXQiOjE3NDQ5NjA4ODksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijk4MzgxNWNlLTJhYWEtNDg3MC1hNDMzLWIwOTVhMDU1OGE1NCIsInN1YiI6ImdhcnZpdC5nbGFfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJnYXJ2aXQuZ2xhX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6ImdyYXZpdCIsInJvbGxObyI6IjIyMTUwMDA3MDUiLCJhY2Nlc3NDb2RlIjoiQ05uZUdUIiwiY2xpZW50SUQiOiI5ODM4MTVjZS0yYWFhLTQ4NzAtYTQzMy1iMDk1YTA1NThhNTQiLCJjbGllbnRTZWNyZXQiOiJ4QXZ6V0VUWFJ0Z0JOdmNTIn0.57zOmhbzB3a0qMIyhOj0FwJNYVaILgyjou-sAFWW7VA",
};

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    if (type === "popular") {
      const maxCommentsPost = await Post.findOne()
        .sort({ commentCount: -1 })
        .select("commentCount");

      const popularPosts = await Post.find({
        commentCount: maxCommentsPost.commentCount,
      }).sort({ createdAt: -1 });

      res.json(popularPosts);
    } else if (type === "latest") {
      const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(5);

      res.json(latestPosts);
    } else {
      res.status(400).json({
        error: 'Wrong type. Use "popular" or "latest"',
      });
    }
  } catch (err) {
    console.log("Error while getting posts:", err);
    res.status(500).json({ error: "Could not get posts" });
  }
});

const updatePosts = async () => {
  try {
    const userData = await axios.get(
      "http://20.244.56.144/evaluation-service/users",
      { headers: authHeader }
    );
    const users = userData.data.users;

    for (let userId in users) {
      const postsData = await axios.get(
        `http://20.244.56.144/evaluation-service/users/${userId}/posts`,
        { headers: authHeader }
      );

      const posts = postsData.data.posts;

      for (let post of posts) {
        await Post.findOneAndUpdate(
          { postId: post.id.toString() },
          {
            userId: post.userid.toString(),
            content: post.content,
            $inc: { commentCount: 0 },
          },
          { upsert: true }
        );
      }
    }
  } catch (err) {
    console.log("Error while updating posts:", err);
  }
};

setInterval(updatePosts, 5 * 60 * 1000);
updatePosts();

export const postRoutes = router;
