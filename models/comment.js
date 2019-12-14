var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  name: String,
  text: String
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
