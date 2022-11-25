//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "This is a post composed with the title “Home”, when a post is composed you will be redirected here and your post will appear just like this one, but with the title and text you’ve chosen. To view all the words or characters of the post you have composed, click the “Read More”. To compose a post Click the link called “Compose” below.";
const aboutContent = "This is a web application that allows a user to compose posts about anything regarding their daily lives. Users can title their post and also write as many lines of text to satisfy what they want to say in a post. The current tech stack that used to create this project is HTML, CSS, Node.js, and express.js.";
const contactContent = "Below you can find links that will help you reach me to collaborate, or see other projects of mine.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent, 
    posts: posts});
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");

});

app.get("/posts/:postName", function(req,res){
    const requestedTitle = _.lowerCase(req.params.postName);

    posts.forEach(function(post){
      const storedTitle = _.lowerCase(post.title);

      if(storedTitle === requestedTitle){
       res.render("post", {
         title: post.title,
         content: post.content
       });
      }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
