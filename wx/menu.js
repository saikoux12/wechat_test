'use strict'

module.exports = {
	'button':[
		{
		'name':'排行榜',
		'sub_button': [{
				'name': '最热门',
				'type': 'click',
				'key': 'movie_hot'
			},{
				'name': '最冷门',
				'type': 'click',
				'key': 'movie_cold'
			}]
		},{
		'name':'分类',
		'sub_button': [{
				'name': '犯罪',
				'type': 'click',
				'key': 'movie_crime'
			},{
				'name': '动画',
				'type': 'click',
				'key': 'movie_cartoon'
			}]
		},{
		'name':'帮助',
		'type': 'click',
		'key': 'help'
		}]
}
/*

{
     "button":[
     {	
          "type":"click",
          "name":"今日歌曲",
          "key":"V1001_TODAY_MUSIC"
      },
      {
           "name":"菜单",
           "sub_button":[
           {	
               "type":"view",
               "name":"搜索",
               "url":"http://www.soso.com/"
            },
            {
               "type":"view",
               "name":"视频",
               "url":"http://v.qq.com/"
            },
            {
               "type":"click",
               "name":"赞一下我们",
               "key":"V1001_GOOD"
            }]
       }]
 }*/