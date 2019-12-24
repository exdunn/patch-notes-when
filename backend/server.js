const mongoose = require("mongoose");
const express = require("express");
const getSecret = require("./secret");
var cors = require("cors");
const Data = require("./data");

const app = express();
app.use(cors());
const router = express.Router();

mongoose.connect(getSecret("dbUri"), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find({}, null, { sort: { thread_num: -1 } }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data });
  });
});

app.get("/", (req, res) => {
  res.send("Hello from App Engine!");
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
