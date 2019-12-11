var express = require("express");
var router = express.Router();

// Import the model (cat.js) to use its database functions.
var comment = require("../models/comment.js");
var article = require("../models/article.js");

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://moz.com/blog").then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
    // An empty array to save the data that we'll scrape
    var results = {};

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("article").each(function(i, element) {
      var title = $(element)
        .find("h2.title")
        .text()
        .trim();
      var link = $(element)
        .find("h2.title")
        .find("a")
        .attr("href");
      var img = $(element)
        .find("img.post-image")
        .attr("src");
      var authorLink = $(element)
        .find("div.media-body")
        .find("a")
        .attr("href");
      var authorName = $(element)
        .find("div.media-body")
        .find("a")
        .text();
      var date = $(element)
        .find("div.media-body")
        .find("time")
        .text();
      // Save these results in an object that we'll push into the results array we defined earlier
      db.scrapedData.insert({
        title: title,
        link: link,
        image: img,
        author_name: authorName,
        author_link: authorLink,
        date: date
      });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .populate("note")
    // Specify that we want to populate the retrieved libraries with any associated books

    .then(function(dbNote) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({
    _id: req.params.id
  })
    .populate("note")
    .then(function(dbLibrary) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbLibrary);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      console.log(dbNote);
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbUser) {
      // If the User was updated successfully, send it back to the client
      res.json(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
