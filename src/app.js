import express from "express";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import { auth } from "./middlewares/auth.js";
import { notFound, errorHandler } from "./middlewares/error.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/items", auth, itemRoutes); // semua route /items wajib login

app.use(notFound);
app.use(errorHandler);

export default app;
