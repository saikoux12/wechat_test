'use strict'

var wx = require('../../wx/index');
var util = require('../../libs/util');
var Movie = require('../api/movie')

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

exports.find = function *(next){
	var id = this.params.id;
	console.log('find')
	console.log(id)
	console.log('id')
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
