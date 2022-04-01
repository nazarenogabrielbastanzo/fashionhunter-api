// Importing the required modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Setting dev environment, testing purposes.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const { globalErrorHandler } = require("./middleware/error.middleware");

app.use(express.json());
app.use(cors());
// app.use(cookieParser());

const { userRouter } = require("./routes/user.routes");
app.use("/api/v1/user", userRouter);

// Middleware for page that not found
app.use("*", (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found in this server.`));
});

app.use(globalErrorHandler);

module.exports = app; // exporting the app to use in the server.js file
