import mongoose from "mongoose";

const { MONGO_DB_URI, DB_NAME } = process.env;

const connectDB = async () => {
    return new Promise((res, rej) => {
        try {
            mongoose.connect(`${MONGO_DB_URI}/${DB_NAME}`).then(() => {
                res();
                console.log("Mongo DB connection successful");
            }).catch((err) => {
              rej(err);
            });
          } catch (error) {
            console.log("Error while connecting to DB", error);
            process.exit(1);
          }
    })
};

export default connectDB;
