import * as fs from "fs";
import util from "util";

import crypto from "crypto";

import jwt from "jsonwebtoken";

const randomBytes = util.promisify(crypto.randomBytes);
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync("./keys/private.key");
const RSA_PUBLIC_KEY = fs.readFileSync("./keys/public.key");

const SESSION_DURATION = "1h";

const createJWT = async (userId, email) => {
  return signJwt({ userId, email }, RSA_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: SESSION_DURATION,
  });
};

const verifyJWT = (token) => {
  const payload = jwt.verify(token, RSA_PUBLIC_KEY);
  return payload;
};

const createCsrfToken = async () => {
  return await randomBytes(32).then((bytes) => bytes.toString("hex"));
};

const isValidEmail = (email) => {
  return emailRegex.test(email);
};

export { createCsrfToken, createJWT, isValidEmail, randomBytes, verifyJWT };
