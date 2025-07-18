const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const wpmRoutes = require("./routes/wpmRoutes");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wpm", wpmRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

