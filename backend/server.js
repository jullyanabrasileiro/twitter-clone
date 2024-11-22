import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import { connect } from "mongoose";

dotenv.config();

const app = express();

console.log(process.env.MONGO_URI);

app.use("/api/auth", authRoutes);

app.listen(8000, () => {
    console.log("server is runing on this port 8000");
    connectMongoDB();
});