import express from "express";
import cors from "cors";
import process from "process";
import { imagesRoute } from "./src/routes/index.js";

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/images", imagesRoute);

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
