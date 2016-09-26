'use strict'

var config = require('../config');
var path = require('path');
var wx = require('./index');
var wechatApi = wx.getWechat();
var Movie = require('../app/api/movie');

exports.reply = function* (next){   
	var message = this.weixin;
	console.log('message-----------------');
	console.log(message);
	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){
			if(message.EventKey){
				console.log('扫描二维码进来的' + message.EventKey + ' ' + message.ticket);
			}
		this.body = '你订阅了这个号 \r\n';
		console.log(this.body);
		console.log('订阅了');

		}
		else if(message.Event === 'unsubscribe'){
			this.body = '';
			console.log('取关了');
		}
		else if(message.Event === 'LOCATION'){
			this.body = '您上报的位置是' + message.Latitude  + '/' + message.Longitude + '-' + message.Precision
		}
		else if(message.Event === 'CLICK'){
			this.body = '您点击了菜单' + message.EventKey;
		}
		else if(message.Event === 'SCAN'){
			console.log('关注后扫二维码' + message.EventKey + '  ' + message.Tickey);
			this.body = '扫一下';
		}
		else if(message.Event === 'VIEW'){
			this.body = '点击了菜单中的链接' + message.EventKey;
		}
		else if(message.Event === 'scancode_push'){
			console.log(message.ScanCodeInfo.ScanType);
			console.log(message.ScanCodeInfo.ScanResult);
			this.body = '点击了菜单中的链接' + message.EventKey;
		}
		else if(message.Event === 'scancode_waitmsg'){
			console.log(message.ScanCodeInfo.ScanType);
			console.log(message.ScanCodeInfo.ScanResult);
			this.body = '点击了菜单中的链接' + message.EventKey;
		}
		else if(message.Event === 'pic_sysphoto'){
			console.log(message.SendPicsInfo.PicList);
			console.log(message.SendPicsInfo.Count);
			this.body = '点击了菜单中的链接' + message.EventKey;
		}
		else if(message.Event === 'pic_photo_or_album'){
			console.log(message.SendPicsInfo.PicList);
			console.log(message.SendPicsInfo.Count);
			this.body = '点击了菜单中的链接' + message.EventKey;
		}
		else if(message.Event === 'pic_weixin'){
			console.log('message');
			console.log(message);
			console.log(message.SendLocationInfo.Location_X);
			console.log(message.SendLocationInfo.Location_Y);
			console.log(message.SendLocationInfo.Scale);
			console.log(message.SendLocationInfo.Label);
			console.log(message.SendLocationInfo.Poiname);
			this.body = '点击了菜单中的链接' + message.EventKey;
		}
		else if(message.Event === 'location_select'){
			this.body = '点击了菜单中的链接' + message.EventKey;
		}
	}
	else if (message.MsgType === 'text'){
		var content = message.Content;
		var reply = '你说' + message.Content ;
		if(content === '1'){
			reply = '哈哈哈哈哈';
		}else if(content === '2'){
			reply = '嘿嘿嘿嘿嘿';
		}else if(content === '3'){
			reply = [{
				title : '这是一个标题',
				description: '只是一个描述',
				picUrl: 'http://res.cloudinary.com/dexunkbgj/image/upload/v1471086973/20141221193508_YXREe.thumb.700_0_xr1wm6.jpg',
				url: 'www.baidu.com'
			},
			{
				title : 'nounen',
				description: '只也是一个描述',
				picUrl: 'http://img2.imgtn.bdimg.com/it/u=2069009883,3827921997&fm=15&gp=0.jpg',
				url: 'www.taobao.com'
			}
			];		
		 }else{
		 	var movies = yield Movie.searchByName(content);
		 	if(!movies || movies.length === 0){
		 		movies = yield Movie.searchByDouban(content);
		 	}
		 	if(movies && movies.length > 0){
		 		reply = [];
		 		movies = movies.slice(0,5);
		 		movies.forEach(function(movie){
		 			console.log(movie)
		 			reply.push({
		 				title: movie.title,
		 				description: movie.title,
		 				picUrl: movie.poster,
		 				url: 'http://wzzzzx.ngrok.cc/movie/' + movie._id
		 			})
		 		})
		 	}else{
		 		reply = '找不到' + content
		 	}
		 }

		 this.body = reply;
	}else{
		this.body = '我听不懂你说的';
	}
	yield next;
}