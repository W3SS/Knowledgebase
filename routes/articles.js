const express = require('express');
const router = express.Router();

//bring in article model
let Article = require('../models/article');

// *************** //
// Manage articles //
// *************** //


//add route
router.get('/add', function(req, res) {
  res.render('add_article', {
    title: 'Add article'
  });
});

//add submit POST route
router.post('/add', function(req, res){
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('autor', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  //get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title: 'Add Article',
      errors: errors
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.autor = req.body.autor;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }else{
        req.flash('success', 'Article added!');
        res.redirect('/');
      }
    });
  }
});

//load edit form
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

//edit article / update submit post route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.autor = req.body.autor;
  article.body = req.body.body;

  let query = {_id:req.params.id};

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success', 'Article updated!');
      res.redirect('/');
    }
  });
});

//delete article
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id};

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

//get single article route
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article: article
    });
  });
});

module.exports = router;
