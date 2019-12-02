const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const swaggerRouter = require('./swagger');

const app = express();

app.use("/uploads", express.static("uploads"));

//bodyparser middleware
app.use(express.json());

const db = config.get("mongoURI");
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/docs", swaggerRouter);
app.use("/api/users", require("./routes/api/users"));
app.use("/api/tags", require("./routes/api/tags"));
app.use("/api/job_offers", require("./routes/api/job_offers"));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}...`));
