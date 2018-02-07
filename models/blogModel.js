const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
let date = new Date();

const blogSchema = new Schema({
  title: { type: String, required: true },
  body: [
    { type: String },
  ],
  img: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
});
blogSchema.plugin(mongoosePaginate);
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
