// Import Express
const express = require("express");

// Import GlobalError Middleware
const { globalErrorHandler } = require("./middleware/error.middleware");

// Import Router
const { userRouter } = require("./routes/user.routes");

// Init Express
const app = express();

// Enable to receive JSON
app.use(express.json());

// Enable the endpoints
app.use("/api/v1/users", userRouter);

// Middleware for page that not found
app.use("*", (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found in this server.`));
});

// Init GlobalError Middleware
app.use(globalErrorHandler);
