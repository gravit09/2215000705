import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let numbers = [];

app.post("/", () => {});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
