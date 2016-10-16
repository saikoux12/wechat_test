'use strict'
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

//detail page
exports.detail = function *(next){
    var id = this.params.id;
    // yield Moive.update({_id: id}, {$inc: {pv: 1}}).exec();
    yield Movie.update({_id: id}, {$inc: {pv: 1} }).exec();
    var movie = yield Movie.findOne({_id: id}).exec();
    var comments = yield Comment
          .find({movie: id})
          .populate('from','name')
          .populate('reply.from reply.to','name')
          .exec();
    console.log('movie')
    console.log(movie)
    console.log(comments)
	yield this.render('pages/detail',{
		title: movie.title + '详情',
		movie:  movie,
        comments: comments
	})
}

var util = require('../../libs/util')

exports.savePoster = function *(next){
    var posterData = req.request.body.files.uploadPoster;
    var filePath = posterData.path;
    var name = posterData.name;
    if(name){
        var data = yield util.readFileAsync(filePath);
        var timestamp = Date.now();
        var type = posterData.type.split('/')[1];
        var poster = timestamp + '.' + type;
        var newPath = path.join(__dirname,'../../','/public/upload/' + poster);
        yield util.writeFileAsync(newPath, data);
        this.poster = poster;
    }
    yield next;
}

exports.save = function *(next){
    var movieObj = this.request.body.fields || {};
    var _movie;

    if(this.poster){
        movieObj.poster = this.poster;
    }
    if(movieObj.id){
        var movie = yield Movie.findOne({_id: id}).exec();
        _movie = _.extend(movie,movieObj);
        yield _movie.save();
        this.redirect('/movie/' + movie._id);
    }else{
        _movie = new Movie(movieObj)

        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;

        yield _movie.save();
        if(categoryId){
            var category = yield Category.findOne({_id: categoryId}).exec();
            category.movies.push(movie._id);
            yield category.save();
            this.redirect('/movie/' + movie._id);
        }else if(categoryName){
            var category = new Category({
                name: categoryName,
                movies: [movie._id]
            });
            var category = yield category.save();
            movie.category = category._id;
            var movie = yield movie.save();
            this.redirect('/movie/' + movie._id);
        }
    }
}

exports.update = function *(next){
    var id = this.params.id;
    var categories = yield Category.find({}).exec();
    if(id){
        var movie = yield Movie.findOne({_id: id}).exec();
        yield this.render('pages/admin',{
            title: '更新页',
            movie: movie,
            categories: categories
        })
    }
}

exports.new = function *(next){
    var categories = yield Category.find({}).exec();
	yield this.render('pages/admin',{
		title: '后台',
		 movie: {
            director: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        },
        categories: categories
	})
}

exports.list = function *(next){
    var movies = yield Movie.find({})
       .populate('category','name')
       .exec();
   yield this.render('pages/list',{
        title: '列表',
         movies: movies
    })
}

exports.del = function *(next){
    var id = this.query.id;
    if(id){
        try{
           yield Movie.remove({_id: id}.exec());
           this.body = {success: 1};
        }catch(err){
            this.body = {success: 0};
        }
    }
}