//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mysql = require("mysql");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const posts = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "blogSite",
  password: "heropanti003",
});

connection.connect(function (err) {
  let q = "select * from blogs";
  connection.query(q, function (err, results) {
    if (err && err.errno==1146) {
      
      let query =
        "create table blogs (id int auto_increment primary key, title varchar(100), body varchar(1000))";
      connection.query(query, function (err, results) {
        console.log("table created");
      });
    }
  });
});

app.get("/", function (req, res) {
  let q = "select title,body from blogs";
  connection.query(q, function (err, results) {
    if (err) throw err;

    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: results,
    });
  });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postName", function (req, res) {
  const postTitle = _.lowerCase(req.params.postName);
  let q = "select title,body from blogs";
  connection.query(q, function (err, results) {
    if (err) throw err;
    results.forEach(function (posts) {
      let storedTitle = _.lowerCase(posts.title);
  
      if (postTitle === storedTitle) {
        
        
        res.render("post", { title: posts.title, body: posts.body });
      }
      
    });
  });
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.title,
    body: req.body.postBody,
  };

  let q = "insert into blogs set ?";
  connection.query(q, post, function (err, results) {
    if (err) throw err;
    console.log("entry inserted");
  });
  //posts.push(post);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
