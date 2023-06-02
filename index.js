const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./database/database.js");
const contactRoutes = require("./routes/contact.js");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json("This is the main page of the API.");
});

app.use("/api/contact", contactRoutes);

app.all("*", (req, res) => {
  res.status(400).json("Page not found.");
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server started on port " + process.env.PORT + "!");
});
