import express from "express";
import { userRoutes } from "./routes/userRoutes.js";
import { postRoutes } from "./routes/postRoutes.js";

const app = express();
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
