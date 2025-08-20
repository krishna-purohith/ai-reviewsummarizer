import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("krishna is creating a new aiproject");
});

app.get("/api/ai", (req: Request, res: Response) => {
  res.json({ message: "Server is responding from /api/ai" });
});

app.listen(port, () =>
  console.log("aiproject app started listening on port: ", port)
);
