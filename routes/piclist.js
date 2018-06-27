var express = require('express');
var router = express.Router();

var userBlogDb = require("../modules/blogEssay");
/* GET users listing. */
router.get('/', function(req, res, next) {
	var dataStr={};
    userBlogDb.findBlogNum({},20)
            .then((data)=>{
            	var rankingsData = rankings(data,20);
            	dataStr.rankingsData=rankingsData;
              return  userBlogDb.findBlogNum({lable:"人工智能"},5)
					            .then((data)=>{
					            	var smartRankings = moreListStr(data,5);
					            	dataStr.smart=smartRankings;
					              return userBlogDb.findBlogNum({lable:new RegExp("云计算/大数据")},5)
										            .then((data)=>{
										            	var bigDataRankings = moreListStr(data,5);
										            	dataStr.bigData=bigDataRankings;
										              return userBlogDb.findBlogNum({lable:"游戏开发"},5)
															            .then((data)=>{
															            	var gameRankings = moreListStr(data,5);
															            	dataStr.game=gameRankings;
															              return  userBlogDb.findBlogNum({lable:"前端"},5)
																				            .then((data)=>{
																				            	var qianDuanRankings = moreListStr(data,5);
																				            	dataStr.qianDuan=qianDuanRankings;
																				              return res.render('piclist', { title: '排行榜',user:req.session.userName,dataStr});
																				            })
															            })
										            })
					            })
            })
});

router.post("/" ,function(req,res,next){
  if (req.body.logout) {
    req.session.userName = "";
    res.redirect('/piclist')
  }
  if (req.body.searchContent) {
      res.redirect('search?searchContent=' + req.body.searchContent)
  }
});

var moreListStr = (data,num) => {
    var str = "";
    data.forEach((item, index) => {
        if (index < num) {
        	if(index < 3){
        		str += `<li class="lianjieLi"><span class="glyphicon glyphicon-hand-right" style="color: #f00;"></span> 
	  	     		<a  href="/details?_id=${item._id}">${item.theme}</a></li>`;
        	}else{
        		 str += `<li class="lianjieLi"><span class="glyphicon glyphicon-hand-right" ></span> 
	  	     		<a  href="/details?_id=${item._id}">${item.theme}</a></li>`;
        	}
        }
    })
    return str;
}
var rankings = (data,num) => {
    var str = "";
    data.forEach((item, index) => {
        if (index < num) {
    		str += `<li> <a href="/details?_id=${item._id}">${item.theme}</a></li>`;
        }
    })
    return str;
}
module.exports = router;