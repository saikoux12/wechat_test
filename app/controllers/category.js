'use strict'
var Category = require('../models/category');
// exports.update = function *(next){
//     var id = req.params.id;
//     console.log(id);
//     if(id){
//         Movie.findById(id, function(err,movie){
//             yield this.render('pages/admin',{
//                 title: '更新页',
//                 movie: movie
//             })
//             console.log(movie);
//         })
//     }
// }

exports.new = function *(next){
    yield this.render('pages/category_admin',{
        title: '后台 分类录入页' ,
        category: {
            name: ''
        }
    })
}

exports.save = function *(next){
    var _category = this.request.body.category;
    var category = new Category(_category)
    yield category.save();
    this.redirect('/admin/category/list');  
}

exports.list = function *(next){
    var categories = yield Category.find({});
   yield this.render('pages/category_list',{
        title: '电影分类列表',
         categories: categories
    });    
}

exports.update = function *(next){
    var id = this.params.id;
    var category = yield Category.findOne({_id: id}).exec();
    if(id){
        yield this.render('pages/category_admin',{
            title: '分类更新页',
            category: category
        })
    }

}