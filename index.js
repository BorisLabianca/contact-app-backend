const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/database.js");
const contactRoutes = require("./routes/contact.js");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json("This is the main page of the API.");
});
app.use("/upload", express.static(path.join(__dirname, "/upload")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res
    .status(200)
    .json({ status: "SUCCESS", message: "The image has been uploaded." });
});

app.use("/api/contact", contactRoutes);

app.all("*", (req, res) => {
  res.status(400).json("Page not found.");
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server started on port " + process.env.PORT + "!");
});
