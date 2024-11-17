const express = require("express");
const app = express();
require("dotenv").config();
const database = require("./database/db");
const authRoutes = require("./routes/Auth.routes");
const userRoutes = require("./routes/User.routes");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World! This is your first Express server.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  database.dbConnect();
});
