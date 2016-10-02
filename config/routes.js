'use strict'
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
var game = require('../app/controllers/game');
var wechat = require('../app/controllers/wechat');

module.exports = function(router){

    //Index 
    router.get('/', Index.index);
    //User
    router.post('/user/signup', User.signup);
    router.post('/user/signin', User.signin);
    router.get('/signin', User.showSignin);
    router.get('/signup', User.showSignup);
    router.get('/logout', User.logout);
    router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
     
    //wechat
    router.get('/wechat/movie',game.guess);
    router.get('/wechat/movie/:id',game.find);
    router.get('/wx',wechat.hear);
    router.post('/wx',wechat.hear);

   // //Movie
   //  router.get('/movie/:id', Movie.detail);
   //  router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
   //  router.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
   //  router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired,  Movie.update);
   //  router.post('/admin/movie/save',  User.signinRequired, User.adminRequired, Movie.savePoster,  Movie.save);
   //  router.delete('/admin/movie/list',  User.signinRequired, User.adminRequired, Movie.del);



   //  //Comment
   //  router.post('/user/comment',  User.signinRequired, Comment.save);

   //  //Category
   //  router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
   //  router.post('/admin/category/save',  User.signinRequired, User.adminRequired,  Category.save);
   //  router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
   //  router.get('/admin/category/update/:id', User.signinRequired, User.adminRequired, Category.update);

   //  //Results
   //  router.get('/results',  Index.search);
}
