var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// Routes

router.get("/", function(req, res) {
  db.Article.find({})

    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://moz.com/blog").then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    $("article").each(function(i, element) {
      // An empty array to save the data that we'll scrape
      var result = {};

      result.title = $(this)
        .find("h2.title")
        .text()
        .trim();
      result.link = $(this)
        .find("h2.title")
        .find("a")
        .attr("href");
      result.img = $(this)
        .find("img.post-image")
        .attr("src");
      result.authorLink = $(this)
        .find("div.media-body")
        .find("a")
        .attr("href");
      result.authorName = $(this)
        .find("div.media-body")
        .find("a")
        .text();
      result.date = $(this)
        .find("div.media-body")
        .find("time")
        .text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      // Save these results in an object that we'll push into the results array we defined earlier
      // db.scrapedData.insert({
      //   title: title,
      //   link: link,
      //   image: img,
      //   author_name: authorName,
      //   author_link: authorLink,
      //   date: date
      // });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .populate("comment")
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

// Route for grabbing a specific Article by id, populate it with it's comment
router.get("/savedarticles", function(req, res) {
  db.Article.find({ saved: true })
    .populate("comment")
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

// Route for saving/updating an Article's associated Comment
router.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new comment that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "comment" property with the _id of the new comment
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Comment was created successfully, find one User (there's only one) and push the new Comment's _id to the User's `comments` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      console.log(dbComment);
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: dbComment._id } },
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

// Route for updating saved/unsaved status goes here

// Export routes for server.js to use.
module.exports = router;
