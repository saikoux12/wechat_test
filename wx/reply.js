'use strict'

var config = require('../config');
var Wechat = require('../Wechat/Wechat');
var wechatApi = new Wechat(config.wechat);
var menu = require('./menu');
var path = require('path');
// wechatApi.deleteMenu().then(function(){
// 	return wechatApi.createMenu(menu);
// })
// .then(function(msg){
// 	console.log(msg);
// })
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
		}else if(content === '4'){
			var data = yield wechatApi.uploadMaterial('image',path.join(__dirname , '..\\2.jpg'));
			reply = {
				type: 'image',
				mediaId: data.media_id
			};
		}else if(content === '5'){
			var data = yield wechatApi.uploadMaterial('video',path.join(__dirname , '..\\3.mp4'));
			reply = {
				type: 'video',
				title: '回复视频',
				description: '描述',
				mediaId: data.media_id
			};
		}else if(content === '6'){
			var data = yield wechatApi.uploadMaterial('image',path.join(__dirname , '..\\2.jpg'));
			reply = {
				type: 'music',
				title: '回复音乐',
				description: '描述',
				musicUrl: 'http://sc1.111ttt.com/2015/1/06/06/99060941326.mp3',
				thumbMediaId: data.media_id,
				mediaId: data.media_id
			};
		}else if(content === '7'){
			var data = yield wechatApi.uploadMaterial('image',path.join(__dirname , '..\\2.jpg'),{type: 'image'});
			reply = {
				type: 'image',
				mediaId: data.media_id
			};
		}else if(content === '8'){
			var data = yield wechatApi.uploadMaterial('video',path.join(__dirname , '..\\3.mp4'),{type: 'video',description: '{"title": "this is a video","introduction": "this is a video test" }'});
			console.log(data);
			reply = {
				type: 'video',
				title: '回复视频',
				description: '描述',
				mediaId: data.media_id
			};
		}else if(content === '9'){
			var picData = yield wechatApi.uploadMaterial('image',path.join(__dirname , '..\\2.jpg'),{} );
			
			var media = {
				articles: [{
					title: '图片',
					thumb_media_id: picData.media_id,
					digest: '摘要',
					show_cover_pic: 1,
					content: '内容',
					content_source_url: 'www.baidu.com'
				},
				{
					title: '图片2',
					thumb_media_id: picData.media_id,
					digest: '摘要',
					show_cover_pic: 1,
					content: '内容',
					content_source_url: 'www.baidu.com'
				}]				
			}

			data = yield wechatApi.uploadMaterial('news',media,{});
			data = yield wechatApi.fetchMaterial(data.media_id,'news',{});
			console.log(data);
			var items = data.news_item;
			var news = [];
			console.log('items \n');
			console.log(items);
			items.forEach(function(item){
				news.push({
					title: item.title,
					description: item.digest,
					picUrl: picData.url,
					url: item.url
				});
			});
			reply = news;
		}else if(content === '10'){
			var counts = yield wechatApi.countMaterial();
			console.log(JSON.stringify(counts));
			var results = yield [
				wechatApi.batchMaterial({
					type: 'image',
					offset: 0,
					counts: 10
				}),
				wechatApi.batchMaterial({
					type: 'video',
					offset: 0,
					counts: 10
				}),
				wechatApi.batchMaterial({
					type: 'voice',
					offset: 0,
					counts: 10
				}),
				wechatApi.batchMaterial({
					type: 'news',
					offset: 0,
					counts: 10
				}),
			]
			console.log(JSON.stringify(results));
			reply = '1';
		}else if(content === '11'){
			/*var group = yield wechatApi.createGroup('new wechat');
			console.log('group');
			console.log(group);
			var groups = yield wechatApi.fetchGroups();
			console.log('groups');
			console.log(groups);
			var group2 = yield wechatApi.checkGroup(message.FromUserName);
			console.log('group2');
			console.log(group2);
			var result = yield wechatApi.moveGroup(message.FromUserName,103);
			console.log('result');
			console.log(result);

			var groups2 = yield wechatApi.fetchGroups();
			console.log('groups2');
			console.log(groups2);

			var result2 = yield wechatApi.updateGroup(102,'分组1');
			console.log('result2');
			console.log(result2);

			var groups3 = yield wechatApi.fetchGroups();
			console.log('groups3');
			console.log(groups3);

			var result3 = yield wechatApi.deleteGroup(104);
			console.log('result3');
			console.log(result3);

			var groups4 = yield wechatApi.fetchGroups();
			console.log('groups4');
			console.log(groups4);*/
			var result = yield wechatApi.moveGroup([message.FromUserName],106);
			console.log('result');
			console.log(result);

			var groups2 = yield wechatApi.fetchGroups();
			console.log('groups2');
			console.log(groups2);
			reply = 'group done!'
		}else if(content === '12'){
			var user = yield wechatApi.fetchUser(message.FromUserName);
			var user2 = yield wechatApi.fetchUser([{openid: message.FromUserName,lang:'en'}]);
			console.log(user);
			console.log('-------------');
			console.log(user2);
			reply = 'user done!'
		}else if(content === '13'){
			var userlist = yield wechatApi.listUsers();
			console.log(userlist);
			reply = userlist.total;
		}else if(content === '14'){
			var mpnews = {
				media_id: 'GmBmFUz0yQneW4rMH3g5ViGn7uB-xe-llUI4C8Tft8M"'
			}
			var text = {
				content: 'hello'
			}
			var msgData = yield wechatApi.sendByGroup('mpnews',mpnews,106);
			console.log(msgData);
			reply = 'msgData';
		}else if(content === '15'){
			var mpnews = {
				media_id: 'GmBmFUz0yQneW4rMH3g5ViGn7uB-xe-llUI4C8Tft8M"'
			}
			var text = {
				content: 'hello'
			}
			var msgData = yield wechatApi.previewMass('mpnews',mpnews,'oGBmOwPoPcYaVxds3No8aOOL9MRU');
			reply = 'msgData';
		}else if(content === '16'){
			var semanticData = {
				query: '冰与火之歌',
				city: '厦门',
				category:  'moive',
				uid: message.FromUserName
			}
			var _semanticData = wechatApi.semantic(semanticData);
			reply = JSON.stringify(_semanticData);
		}				
		this.body = reply;
	}else{
		this.body = '我听不懂你说的';
	}
	yield next;
}