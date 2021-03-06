'use strict'

var mongoose = require('mongoose');
var User = mongoose.model('User');
var wx = require('../../wx/index');
var util = require('../../libs/util');
var Movie = require('../api/movie');
var koa_request = require('koa-request');

exports.guess = function *(next){
	var wechatApi = wx.getWechat();
	var data = yield wechatApi.fetchAccessToken();
	var access_token = data.access_token;
	var ticketData = yield wechatApi.fetchTicket(access_token);
	var ticket = ticketData.ticket;
	var url = this.href.replace(':8000','');
	var params = util.sign(ticket,url);
	yield this.render('wechat/game',params);
}

exports.jump = function *(next){
	var movieId = this.params.id;
	var redirect = encodeURIComponent('http://wzzzx.ngrok.cc/wechat/movie/' + movieId);
	console.log(redirect)
	var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wx.wechatOptions.wechat.appID + '&redirect_uri=' + redirect + '&response_type=code&scope=snsapi_base&state='+ movieId + '#wechat_redirect';
	console.log(url)
	this.redirect(url);
}

exports.find = function *(next){
	var code = this.query.code;
	console.log(code)
	var openUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + wx.wechatOptions.wechat.appID + '&secret=' + wx.wechatOptions.wechat.appSecret + '&code=' + code + '&grant_type=authorization_code';
	var response = yield koa_request({
		url: openUrl
	});
	var body = JSON.parse(response.body);
	var openid = body.openid;
	var user = yield User.findOne({openid: openid}).exec();
	if(!user){
		user = new User({
			openid: openid,
			password: '123456',
			name: Math.random().toString(36).substr(2)
		})
		user = yield user.save();
	}
	this.session.user = user;
	this.state.user = user;

	var id = this.params.id;
	var wechatApi = wx.getWechat();
	var data = yield wechatApi.fetchAccessToken();
	var access_token = data.access_token;
	var ticketData = yield wechatApi.fetchTicket(access_token);
	var ticket = ticketData.ticket;
	var url = this.href.replace(':8000','');
	var params = util.sign(ticket,url);
	var movie = yield Movie.searchById(id);
	params.movie = movie;
	console.log(params)
	yield this.render('wechat/movie',params);
}
