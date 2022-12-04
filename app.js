const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDb", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);
//request targeting all articles
app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err){
      res.send(foundArticles);
    } else{
      res.send(err);
    }
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("successfully added a new article");
    } else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
Article.deleteMany(
  function(err){
    if (!err){
      res.send("successfully deleted all");

    }else{
      res.send(err);
    }
  }
)

});

//request targeting a specific article
app.route("/articles/:titleName")
.get(function(req, res){
  Article.findOne({title: req.params.titleName} ,function(err, foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    } else{
      res.send("No articles found");
    }
  });
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.titleName},
    {content: req.body.content},
    {overwrite: true},
    function(err, foundArticle){
      if (!err){
        res.send("successfully updated!");

      }else{
        res.send(err);
      }
  }
  )
})

.patch(function (req, res){
  Article.update({title: req.params.titleName}, {$set:  req.body },
    function(err){
      if (!err){
        res.send("successfully updated!");

      }else{
        res.send(err);
      }
    }
  )
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.titleName},
    function(err){
      if (!err){
        res.send("successfully deleted!");

      }else{
        res.send(err);
      }
    }
  );
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
})
