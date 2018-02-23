//Dependencies================

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var cheerio = require("cheerio");
// Require all models
// var db = require("./models");

//=============================
var PORT = 3011;
// Initialize Express
var app = express();

var routes = ("../controller/siteroutes.js");
// Configure middleware
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapedb", 
);

// app.use("/", routes);
// // Routes
// A GET route for scraping the echojs website

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});