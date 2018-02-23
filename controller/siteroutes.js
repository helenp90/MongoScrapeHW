var cheerio = require("cheerio");
var express = require("express");
var request = require ("request");
var axios = require ("axios");

var router = express.Router();

var db = require("../models");

//Function for scraping

app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.bonappetit.com/ingredient/chicken").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        // Create a new Recipe using the `result` object built from scraping
        db.Recipe.create(result)
          .then(function(dbRecipe) {
            // View the added result in the console
            console.log(dbRecipe);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });
  // Route for getting all Articles from the db
  app.get("/recipes", function(req, res) {
    // Grab every document in the Articles collection
    db.Recipe.find({})
      .then(function(dbRecipe) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbRecipe);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/recipe/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Recipe.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbRecipe) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbRecipe);
        console.log ("scraping the articles")
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for saving/updating an Article's associated Note
  app.post("/recipe/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Recipe.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbRecipe) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbRecipe);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  module.exports = router;