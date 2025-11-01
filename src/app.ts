import express from "express";
import dotenv from "dotenv";
import path from "path";
import ocrProcessRouter from "./routes/ocrProcess";

dotenv.config();

const app = express();
app.use(express.json());

// Static folder for uploads (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/apps", ocrProcessRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
