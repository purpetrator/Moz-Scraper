var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// Routes
// A GET ROUTE FOR ALL ARTICLES
router.get("/", function(req, res) {
  db.Article.find({})

    .then(function(dbArticle) {
      var hbsObject = {
        articles: dbArticle
      };

      res.render("index", hbsObject);
      // res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// A GET route for scraping Moz and dumping data into DB
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
      result.summary = $(this)
        .find("header.post-header")
        .find("p")
        .text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          console.log(result);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// A GET route for getting all articles from db
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

// A GET route for getting all saved articles from db
router.get("/savedarticles", function(req, res) {
  db.Article.find({ saved: true })
    .populate("Comment")
    // Specify that we want to populate the retrieved libraries with any associated books

    .then(function(dbArticle) {
      var hbsObject = {
        articles: dbArticle
      };

      res.render("saved", hbsObject);
      // res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// A PUT route for updating saved/unsaved status for each article
router.put("/savedarticles/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
    .then(function(dbArticle) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// A POST route for saving/updating an Article's associated Comment
router.post("/comment/:id", function(req, res) {
  console.log(req.body);
  console.log(req.params.id);

  db.Comment.create(req.body)
    .then(function(dbComment) {
      console.log(dbComment);
      return db.Comment.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: dbComment._id } },
        { new: true }
      );
    })
    .then(function(dbComment) {
      // If the User was updated successfully, send it back to the client
      res.json(dbComment);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
