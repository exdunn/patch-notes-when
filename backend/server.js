const mongoose = require("mongoose");
const express = require("express");
const getSecret = require("./secret");
var cors = require("cors");
const dataSchema = require("./data.js");
const news = dataSchema.news;
const patchNotes = dataSchema.patchNotes;

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

// router.get("/getPatchNotes", (req, res) => {
//   patchNotes.find(
//     {},
//     null,
//     { sort: { thread_num: -1 }, batchSize: 1 },
//     (err, data) => {
//       if (err) return res.json({ success: false, error: err });
//       return res.json({ success: true, data });
//     }
//   );
// });

router.get("/getPatchNotes", (req, res) => {
  let limit = parseInt(req.query.limit);
  let skip = parseInt(req.query.skip);
  patchNotes
    .find()
    .sort({ thread_num: -1 })
    .limit(limit)
    .skip(skip)
    .then(data => {
      return res.json({ success: true, data });
    });
});

router.get("/getNews", (req, res) => {
  let limit = parseInt(req.query.limit);
  let skip = parseInt(req.query.skip);
  news
    .find()
    .sort({ thread_num: -1 })
    .limit(limit)
    .skip(skip)
    .then(data => {
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
