class AppError extends Error {
  constructor(statusCode, message) {
    super();
    this.status = `${statusCode}`.startsWith("4") ? "Error" : "Fail";
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
