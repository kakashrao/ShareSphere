import * as fs from "fs";
import util from "util";

import jwt from "jsonwebtoken";

export const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync("../keys/private.key");
const RSA_PUBLIC_KEY = fs.readFileSync("../keys/public.key");

const SESSION_DURATION = 240;

export const createSessionToken = async (userId, email) => {
  return signJwt({ userId, email }, RSA_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: SESSION_DURATION,
  });
};

export const verifySessionToken = (token) => {  
  const decodedToken = jwt.verify(token, RSA_PUBLIC_KEY);
  return decodedToken;
};
