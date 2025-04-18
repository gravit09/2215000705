import express from "express";
import { User } from "../models/User.js";
import axios from "axios";

const router = express.Router();

const authHeader = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU5MDI1LCJpYXQiOjE3NDQ5NTg3MjUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijk4MzgxNWNlLTJhYWEtNDg3MC1hNDMzLWIwOTVhMDU1OGE1NCIsInN1YiI6ImdhcnZpdC5nbGFfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJnYXJ2aXQuZ2xhX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6ImdyYXZpdCIsInJvbGxObyI6IjIyMTUwMDA3MDUiLCJhY2Nlc3NDb2RlIjoiQ05uZUdUIiwiY2xpZW50SUQiOiI5ODM4MTVjZS0yYWFhLTQ4NzAtYTQzMy1iMDk1YTA1NThhNTQiLCJjbGllbnRTZWNyZXQiOiJ4QXZ6V0VUWFJ0Z0JOdmNTIn0.Cezkd4gZ-wUra0yrOiU3Y4OYdI_w_TEOyjj-7W3t9B0",
};

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "http://20.244.56.144/evaluation-service/users",
      { headers: authHeader }
    );
    const users = response.data.users;

    for (let userId in users) {
      const name = users[userId];

      await User.findOneAndUpdate(
        { userId: userId },
        { name: name, $inc: { totalComments: 0 } },
        { upsert: true }
      );
    }

    const topUsers = await User.find()
      .sort({ totalComments: -1 })
      .limit(5)
      .select("userId name totalComments");

    res.json(topUsers);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export const userRoutes = router;
