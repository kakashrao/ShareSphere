import * as fs from "fs";
import util from "util";

import crypto from "crypto";

import jwt from "jsonwebtoken";

const randomBytes = util.promisify(crypto.randomBytes);
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync("./keys/private.key");
const RSA_PUBLIC_KEY = fs.readFileSync("./keys/public.key");

const SESSION_DURATION = "24h";
const ACCESS_TOKEN_DURATION = "0.5h";

async function generateSecurityTokens(
  userId,
  email,
  refreshTokenRequired = true
) {
  const accessToken = await signJwt({ userId, email }, RSA_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: ACCESS_TOKEN_DURATION,
  });

  let refreshToken = null;

  if (refreshTokenRequired) {
    refreshToken = await signJwt({ userId, email }, RSA_PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: ACCESS_TOKEN_DURATION,
    });
  }

  return { accessToken, refreshToken };
}

function verifySecurityToken(token) {
  const payload = jwt.verify(token, RSA_PUBLIC_KEY);
  return payload;
}

async function createCsrfToken() {
  return await randomBytes(32).then((bytes) => bytes.toString("hex"));
}

const isValidEmail = (email) => {
  return emailRegex.test(email);
};

export {
  createCsrfToken,
  generateSecurityTokens,
  isValidEmail,
  randomBytes,
  verifySecurityToken,
};
