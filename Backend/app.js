// Importing the required modules
const express = require("express");
const morgan = require("morgan");

// Init Express
const app = express();

// Setting dev environment, testing purposes.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Import GlobalError Middleware
const { globalErrorHandler } = require("./middleware/error.middleware");

// Import Router
const { userRouter } = require("./routes/user.routes");

// Enable to receive JSON and Form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable the endpoints
app.use("/api/v1/users", userRouter);

// Middleware for page that not found
app.use("*", (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found in this server.`));
});

// Init GlobalError Middleware
app.use(globalErrorHandler);

module.exports = app; // exporting the app to use in the server.js file
