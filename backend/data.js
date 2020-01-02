// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema({
  thread_num: String,
  title: String,
  html: String,
  text: String,
  post_date: Date,
  author: String
});

// export the new Schema so we could modify it using Node.js
exports.patchNotes = mongoose.model("patch-note", DataSchema);
exports.news = mongoose.model("new", DataSchema);
