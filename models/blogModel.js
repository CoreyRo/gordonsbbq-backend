const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
let date = new Date();

const blogSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String},
  richText:{ type: String },
  img: { type: String},
},{
  timestamps: true
});

blogSchema.plugin(mongoosePaginate);
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
