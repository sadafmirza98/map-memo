const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const cors = require("cors");

const app = express();
app.use(cors()); // Set up CORS middleware

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  next(error); // Pass error to error handling middleware
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://mern-stack:sadaf_mirza@gqlcluster.xcvsn.mongodb.net/places?retryWrites=true&w=majority&appName=GQLCluster",
    { useNewUrlParser: true, useUnifiedTopology: true } // Update connection options
  )
  .then(() => {
    app.listen(5000);
    console.log("Server is running on port 5000");
  })
  .catch((err) => {
    console.log(err);
  });
