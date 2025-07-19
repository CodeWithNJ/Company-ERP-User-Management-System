import app from "./app.js";
import connectToDatabase from "./db/dbConnection.js";

const port = process.env.PORT || 8500;

// Start the server only on successfull database connection.
// Otherwise, throw error.
connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(`Server runnning on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`mysql connection failed: ${error}`);
  });
