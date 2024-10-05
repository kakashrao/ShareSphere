import app from "./app.js";
import connectDB from "./db/index.js";

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server is listening on Port ${port}`);
      });
    } catch (error) {
      console.log("Something went wrong when connecting to server", error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
