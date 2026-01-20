import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

app.use(express.json());

// app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));


app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("HEADERS:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  next();
});


app.use("/api/v1/user", userRouter);




export { app };             