export const Status = Object.freeze({
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500,
});

export const secureCookieOptions = {
  secure: true,
  httpOnly: true,
};

export const accessibleCookieOptions = {
  secure: true,
  httpOnly: false,
};
