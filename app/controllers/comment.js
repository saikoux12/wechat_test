'use strict'
var Comment = require('../models/comment');
var _ = require('underscore');

exports.save = function *(next){
    var _comment = this.request.body.comment;
    var movieId = _comment.movie;
    if(_comment.cid){
    	var comment = yield Comment.findOne({_id: _comment.cid}).exec();
		var reply = {
			from: _comment.from,
			to: _comment.tid,
			content: _comment.content
		}
		comment.reply.push(reply);
		yield comment.save();
		this.redirect('/movie/' + movieId );
    }else{
	    var comment = new Comment(_comment);
	    yield comment.save();
	    this.redirect('/movie/' + movieId );
    }

}
