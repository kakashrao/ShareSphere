export class ApiError {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.contructor);
    }
  }
}

export class BadRequest extends ApiError {
  constructor(message = "Bad Request", errors = [], stack = "") {
    super(Status.BadRequest, message);
  }
}

export class ServerError extends ApiError {
  constructor(message = "Something went wrong", errors = [], stack = "") {
    super(Status.ServerError, message);
  }
}

export class Unauthorized extends ApiError {
  constructor(
    message = "Please login or signup to continue.",
    errors = [],
    stack = ""
  ) {
    super(Status.Unauthorized, message);
  }
}

export class NotFound extends ApiError {
  constructor(message = "Not Found.", errors = [], stack = "") {
    super(Status.NotFound, message);
  }
}
