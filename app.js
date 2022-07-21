
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
// require mongoose
const mongoose = require('mongoose');

const homeStartingContent = "Home Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "About Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Contact Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connect to DB
mongoose.connect("mongodb://localhost:27017/BlogDB");

// mongoose schema for new blog post
const blogPostSchema = {
  title: String,
  content: String
};

// mongoose model
const blogPostModel = mongoose.model("blogpost", blogPostSchema);

// home route
app.get("/", function (req, res) {

  // When you go to localhost:3000 you should see the posts you created in the compose page.
  blogPostModel.find({}, function (err, foundPosts) {
    if (!err) {

      //console.log(foundPosts);
      res.render("home", {
        startingContent: homeStartingContent,
        postsFrontend: foundPosts
      });

    }
  });
});

// about route
app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent })
});

// contact route
app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent })
});

// compose route
app.get("/compose", function (req, res) {

  res.render("compose");
});

// post form in compose.ejs 
// post first parameter shound match with action name in the form
app.post("/compose", function (req, res) {

  // create mongoose document for new post
  const post = new blogPostModel({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  // insertting document 
  post.save();
  res.redirect("/");

});

// routing parameter
app.get('/posts/:postId', function (req, res) {
  // res.send(req.params);
  // console.log(req.params);
  const requestedId = req.params.postId;

  blogPostModel.findOne({ _id: { $eq: requestedId } }, function (err, foundpost) {
    if (!err) {
      res.render("post", {
        postEjsTitle: foundpost.title,
        postEjsBody: foundpost.content
      });
    }

  });

});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
