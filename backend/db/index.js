import mongoose from "mongoose";

const { MONGO_DB_URI, DB_NAME } = process.env;

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    try {
      mongoose
        .connect(`${MONGO_DB_URI}/${DB_NAME}`)
        .then(() => {
          resolve("MongoDb connection successful.");
        })
        .catch((err) => {
          reject(`Error while connecting to DB ${err}`);
        });
    } catch (error) {
      reject(`Error while connecting to DB ${error}`);
    }
  });
};

export default connectDB;
