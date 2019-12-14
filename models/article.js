var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: String
  },
  summary: {
    type: String
  },
  authorName: {
    type: String
  },
  authorLink: {
    type: String
  },
  date: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
