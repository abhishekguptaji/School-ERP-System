import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN ||  "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));


// app.use((req, res, next) => {
//   console.log("METHOD:", req.method);
//   console.log("HEADERS:", req.headers["content-type"]);
//   console.log("BODY:", req.body);
//   next();
// });


app.use("/api/v1/user", userRouter);




export { app };             