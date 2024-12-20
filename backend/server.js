import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

import connectMongoDB from "./db/connectMongoDB.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);

app.listen(PORT, () => {
    console.log(`server is runing on this port  ${PORT}`);
    connectMongoDB();
});