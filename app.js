'use strict'

var Koa = require('koa');
var wechat = require('./wechat/g');
var util = require('./libs/util');
var sha1 = require('sha1');
var path = require('path');
var config = require('./config');
var reply = require('./wx/reply');
var Wechat = require('./wechat/wechat');

var ejs = require('ejs');
var heredoc = require('heredoc');
var crypto = require('crypto');
var jsSHA = require('jssha');

var tpl = heredoc(function(){/*
<!DOCTYPE html>
<html>
	<head>
		<title>查电影</title>
		<meta name="viewport" content="initial-scale=1,maximum-scale=1, minimum-scale=1">
	</head>
	<body>
		<h3>点击这行字并说出电影名字，再次点击结束</h3>

		<p id="title"></p>
		<div id="director"></div>
		<div id="year"></div>
		<div id="poster"></div>
		<script src="http://zeptojs.com/zepto-docs.min.js"></script>
		<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
		<script>
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: 'wxcbb7425b318ac44a', // 必填，公众号的唯一标识
			    timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
			    nonceStr: '<%= noncestr %>', // 必填，生成签名的随机串
			    signature: '<%= signature %>',// 必填，签名，见附录1
			    jsApiList: [
			    	'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone',
					'startRecord',
					'stopRecord',
					'onVoiceRecordEnd',
					'translateVoice'
			    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function(){
				wx.checkJsApi({
				    jsApiList: ['onVoiceRecordEnd'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
				    success: function(res) {
				    	console.log(res);
				    }
				});
				
				var shareContent = {}
				wx.onMenuShareAppMessage(shareContent);

				var isRecording = false;
				$('h3').on('tap', function(){
					if(!isRecording){
						isRecording = true;
						wx.startRecord({
							cancel: function(){
								window.alert('取消语音搜索了');
							}
						});
						return;
					}
					isRecording = false;
					wx.stopRecord({
					    success: function (res) {
					        var localId = res.localId;
					        wx.translateVoice({
							    localId: localId, 
							    isShowProgressTips: 1, 
							    success: function (res) {
							    	var result = res.translateResult;
									$.ajax({
										type: 'get',
										url: 'https://api.douban.com/v2/movie/search?q=' + result,
										dataType: 'jsonp',
										jsonp: 'callback',
										success: function(data){
											if(data.subjects.length > 1){
												var subject = data.subjects[0];
												$('#title').html(subject.title);
												$('#year').html(subject.year);
												$('#director').html(subject.directors.name);
												$('#poster').html('<img src="' + subject.images.large + '" />');
												shareContent = {
													title: subject.title, // 分享标题
												    desc: '搜索出了' + subject.title, // 分享描述
												    link: 'www.baidu.com', // 分享链接
												    imgUrl: subject.images.large, // 分享图标
												    type: '', // 分享类型,music、video或link，不填默认为link
												    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
												    success: function () { 
												       window.alert('分享成功');
												    },
												    cancel: function () { 
												       window.alert('分享失败');
												    }
												}
											}else{
												window.alert('没有找到该电影');
											}
										}
									})
							    }
							});
					    }
					});
				});
			});
		</script>
	</body>
</html>
*/})

var createNonce = function(){
	return Math.random().toString(36).substr(2,15);
}

var createTimestamp = function(){
	return parseInt(new Date().getTime() / 1000,10) + '';
}

var _sign = function(nonceStr,timestamp,ticket,url){
	var ret = {
		jsapi_ticket: ticket,
		nonceStr: nonceStr,
		timestamp: timestamp,
		url: url
	};
	var string = raw(ret);
	 var  shaObj = new jsSHA(string, 'TEXT');
	ret.signature = shaObj.getHash('SHA-1', 'HEX');

	return ret.signature;
}

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

function sign(ticket,url){
	var nonceStr = createNonce();
	var timestamp = createTimestamp();
	var signature = _sign(nonceStr,timestamp,ticket,url);
	return {
		noncestr: nonceStr,
		timestamp: timestamp,
		signature: signature
	}
}

var app = new Koa()

app.use(function *(next){
	if(this.url.indexOf('/moive' > 1)){
		var wechatApi = new Wechat(config.wechat);
		var data = yield wechatApi.fetchAccessToken();
		var access_token = data.access_token;
		var ticketData = yield wechatApi.fetchTicket(access_token);
		var ticket = ticketData.ticket;
		var url = this.href.replace(':8000','');
		var params = sign(ticket,url);

		console.log(params);
		this.body = ejs.render(tpl,params);
		return next;
	}
	yield next;
})

app.use(wechat(config.wechat,reply.reply))

app.listen(1234);
console.log('success');