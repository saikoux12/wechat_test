'use strict'
var wechat = require('./wechat/g');
var util = require('./libs/util');
var sha1 = require('sha1');
var path = require('path');
var wechat_file = path.join(__dirname,'./config/wechat.txt')
var wechat_ticket_file = path.join(__dirname,'./config/wechat_ticket.txt')
var config = {
	wechat : {
		// appID: 'wx685d06da70476eaf',
		// appSecret: 'e5acf45f9371c53de496292e667d7b67 ',
		appID: 'wxcbb7425b318ac44a',		
		appSecret: 'fe0aac6dbc5b8fde93ab23b150a6c35a',
		token: 'wzx007',
		getAccessToken: function(){
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken: function(data){
			data = JSON.stringify(data);
			return util.writeFileAsync(wechat_file,data)
		},
		getTicket: function(){
			return util.readFileAsync(wechat_ticket_file)
		},
		saveTicket: function(data){
			data = JSON.stringify(data);   
			return util.writeFileAsync(wechat_ticket_file,data)
		}
	}
}

module.exports = config