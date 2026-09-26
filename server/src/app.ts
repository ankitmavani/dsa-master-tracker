import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/firebase";
import roadmapRoutes from "./routes/roadmap.routes";
import itemRoutes from "./routes/item.routes";
import dayRoutes from "./routes/day.routes";
import questionRoutes from "./routes/question.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);

app.use("/api/roadmaps", roadmapRoutes);

app.use("/api/items", itemRoutes);

app.use("/api/days", dayRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", async (_, res) => {
  try {
    const snapshot = await db.collection("test").get();

    res.json({
      success: true,
      firestore: "Connected",
      documents: snapshot.size,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running : ${PORT}`);
});
