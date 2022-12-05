//jshint esversion:6

require('dotenv').config()
const mongoose = require('mongoose');
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

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});

//Schema for the post that contains the title and content
const postSchema = {

  title: String,
 
  content: String
 
 };

 //mongoose model using the post schema
 const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
  //to find all the posts in the posts collection and render that in the home.ejs file
  Post.find({}, function(err, posts){
  res.render("home", {
    startingContent: homeStartingContent, 
    posts: posts
    });
  });
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

  //Post document for mongoose model
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
 
  });
  //redirect to the home page once save is complete with no errors
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  //constant to store the postId parameter value
  const requestedId = req.params.postId;
  
  //render posts title and content too post.ejs once match is found
  Post.findById(requestedId, (err, post) => {
    res.render('post', {
      title: post.title,
      content: post.content
    })
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
