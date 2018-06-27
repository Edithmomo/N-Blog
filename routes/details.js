var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

var userBlogDb = require("../modules/blogEssay");
var userNameDB = require("../modules/userName");
var commentDb = require("../modules/comment");

/* GET home page. */
var blogIngoId;
var commentNum;
var auther;
router.get('/', function(req, res, next) {
    user = req.session.userName;
    var readNum = 0;
    blogIngoId = req.query._id;
    // blogIngoId = "5b03ec0244f2ef2da065ed4b";
    userBlogDb.findBlog({ _id: ObjectId(blogIngoId) })
        .then((data) => {
            var strBlog = stringJoinBlog(data);
            auther = data[0].email;
            var lable = data[0].lable;
            var theme = data[0].theme;
            readNum = data[0].readNum + 1;
            return commentDb.findComment({ blogId: ObjectId(blogIngoId)})
                .then((data) => {
                    var strComment = stringJoinComment(data);
                    return userNameDB.findEmail({email: auther })
                        .then((data) => {
                            var userAuther = autherStr(data); 
                            return userBlogDb.findBlogNum({ theme: { $ne: theme }, lable:new RegExp(lable) },8)
                                .then((data) => {
                                    var moreList = moreListStr(data);
                                    return res.render('details', { title: 'Express', user: user, data: strBlog, comment: strComment, auther:userAuther, moreList });
                                })

                        })

                })

        })
        .then((date) => {
             if(auther != user.email){
                 userBlogDb.upBlog({ _id: ObjectId(blogIngoId) }, { $set: { readNum: readNum } })
            }
        })
});

router.post("/", function(req, res, next) {
	if(req.body.logout){
       req.session.userName ="";
       res.redirect('/details?_id='+blogIngoId)
	}
	if(req.body.searchContent){
		res.redirect('search?searchContent='+req.body.searchContent)
	}
    if (req.body.support) {
         userNameDB.update({email:auther},{$set:{support:req.body.support}});
    }
    if (req.body.commentInfo) {
        var commentContent = req.body.commentInfo;
        var data = new Date()
        days = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
        time = data.getHours() + ":" + data.getMinutes();
        var data = new Date()
        var addComment = {
            commentContent: commentContent,
            user: {
                Img: req.session.userName.headerImg,
                name: req.session.userName.userName
            },
            days: days,
            time: time,
        };
        commentDb.upComment({ blogId: ObjectId(blogIngoId) }, { $push: { commentInfo: addComment } })
            .then(function(data) {
                userBlogDb.upBlog({ _id: ObjectId(blogIngoId) }, { $set: { commentNum: commentNum + 1 } })
                    .then(function() {
                        console.log("评论插入成功")
                    })
                console.log("评论成功");
            })
        res.redirect('/details?_id='+blogIngoId);
    }
})


var stringJoinBlog = (data) => {
    var strData = "";
    var strContent = "";
    data.forEach((item, index) => {
        var temp = item.blogInfo.split("\n");
        temp.forEach((item, index) => {
            strContent += `<p>${item}</p>`
        });
        console.log(item)
        commentNum = item.commentNum;
        strData += `
        <ul class="list-group">
        <li class="list-group-item myLi mybgcolor row">
          <div class="col-sm-12 col-xs-12 ">
            <a href="#" class="myContent" >
              <h2 style="margin-bottom: 20px;">${item.theme}</h2>
            </a>
              <ul class="nav-pills InfoList myJustStart myMin">
                  <li ><span class="glyphicon glyphicon-bookmark mar_gly"></span><span class="myMarR">类型:${item.lable}</span></li>
              </ul>
              <ul class="nav-pills myUlLi" style="margin-top: 10px;">
                  <li ><a href="#" class="myMarR"><span class="glyphicon glyphicon-time mar_gly"></span>${item.time}</a><a href="#">作者：${item.userName}</a></li>
                  <li style="margin-left: 230px;>
                    <span class="myMarR"><span class="glyphicon glyphicon-comment mar_gly"></span>评论(${item.commentNum})</span>
                     <span class="glyphicon glyphicon-eye-open mar_gly"></span>
                    <span>${item.readNum}人阅读</span>
                  </li>
              </ul>
          </div>
        </li>
        <li class="list-group-item myLi ">
          <div class="myBlogContent">
            ${strContent}
          </div>
        </li>
        <div class="text-center">
        <span class="moreRead">
        <h3> 阅读更多 </h3>
        <span class="glyphicon glyphicon-menu-down"></span>
        </span></div>
      </ul>`
    });
    return strData;
}
var stringJoinComment = (data) => {
    if (data.commentInfo.length > 0) {
        var strComment = "";
        var commentInfo = data.commentInfo;
        commentInfo.forEach((item, index) => {
            var commentContentStr = "";
            var commentTemp = item.commentContent.split("\n");
            commentTemp.forEach((item, index) => {
                commentContentStr += `<p>${item}</p>`
            });
            strComment += `
                      <ul class="myUlLi myLi myJustStart" style="height:auto;margin-top:40px;">
                      <li ><a href="#" class="myImgA"><img class="headerImg myMarR" src="${item.user.Img}" alt="">${item.user.name}</a></li>
                      <li style="margin-left: 30.6vw;"><a href="#" class="myMarR">${index+1}楼</a>
                        <li><a href="#" class="myMarR">${item.days}</a></li>
                        <li><a href="#">${item.time}发表</a></li>
                      </li>
                    </ul>
                    <div class="myPMMin mybgcolorWhite">
                    ${commentContentStr}
                    </div>
                  </li>`
        });
        return strComment;
    } else {
        return `<ul class="myUlLi myLi myJustStart text-center" style="height:auto;"><p style="margin:10px 20vw">暂无评论</p></ul>`;
    }
}
var autherStr = (data) => {
    return `<img src="${data.headerImg}" alt="..." class="img-circle" style="width: 38px;height: 38px;margin-left:4px;" >
	  		<span>作者：</span>
	  		<span>${data.userName}</span>
	  		<ul>
	  			<li class="zuopin"><span class="glyphicon glyphicon-book"></span>
	  			<span>作品数：</span><span style="color:#FF5809">${data.blogNumber}</span></li>
	  			<li class="dianzan">
	  				<span class="glyphicon  glyphicon-thumbs-up" title="点赞"></span>
	  				<span class="date_dian" >${data.support}</span>
	  			</li>
	  		</ul>`;
}
var moreListStr = (data) => {
    var str = "";
    data.forEach((item, index) => {
        if (index <= 7) {
            str += `<li class="lianjieLi"><span class="glyphicon glyphicon-hand-right" style="color: #f00;"></span> 
	  	     		<a  href="/details?_id=${item._id}">${item.theme}</a></li>`;
        }
    })
    return str;
}
module.exports = router;