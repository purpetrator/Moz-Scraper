var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// Routes
// A GET ROUTE FOR ALL ARTICLES
router.get("/", function(req, res) {
  db.Article.find({})
    .populate("comments")

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
  axios.get("https://moz.com/blog").then(function(response) {
    var $ = cheerio.load(response.data);

    $("article").each(function(i, element) {
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
          console.log(dbArticle);
          console.log(result);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});

// A GET route for getting all articles from db
router.get("/articles", function(req, res) {
  db.Article.find({})
    .populate("comments")

    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// A GET route for getting all saved articles from db
router.get("/savedarticles", function(req, res) {
  db.Article.find({ saved: true })
    .populate("Comment")

    .then(function(dbArticle) {
      var hbsObject = {
        articles: dbArticle
      };

      res.render("saved", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// A PUT route for updating saved/unsaved status for each article
router.put("/savedarticles/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
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
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: dbComment._id } },
        { new: true }
      );
    })
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// A DELETE route for deleting comments
router.delete("/article/:id/comment/:commentId", function(req, res) {
  db.Comment.deleteOne({ _id: req.params.commentId })
    .then(function() {
      return db.Article.update(
        { _id: req.params.id },
        { $pull: { comments: req.params.commentId } }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
