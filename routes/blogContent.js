var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

var userDb = require("../modules/blogEssay");
var commentDb = require("../modules/comment");

/* GET home page. */
var blogIngoId;
router.get('/', function(req, res, next) {
  user=req.session.userName;
  var readNum = 0;
  blogIngoId = req.query._id;
  userDb.findBlog({_id:ObjectId(blogIngoId)})
          .then((data)=>{
            var strBlog = stringJoinBlog(data);
             readNum = data[0].readNum+1;
             console.log(123)
             return commentDb.findComment({blogId:ObjectId(blogIngoId)})
                      .then((data)=>{
                        var strComment = stringJoinComment(data);
                        userDb.upBlog({_id:ObjectId(blogIngoId)},{$set:{readNum:readNum}})
                        return res.render('blogContent', { title: '博客内容',user:user,data:strBlog,comment:strComment});
                      })
          })
  // res.render('blogContent', { title: 'Express',data:"data",user:"user",comment:"strComment"});
});

router.post("/" ,function(req,res,next){
  var commentContent =req.body.commentInfo;
  var data = new Date()
  days = data.getFullYear() +"-"+ (data.getMonth()+1) + "-" +data.getDate();
  time = data.getHours() +":"+ data.getMinutes();
  var data = new Date()
  var addComment={
          commentContent:commentContent,
          user:{Img:req.session.userName.headerImg,
                name: req.session.userName.userName},
          days:days,
          time:time,
        };
  commentDb.upComment({blogId:ObjectId(blogIngoId)},{$push:{commentInfo:addComment}})
        .then(function(data){
          console.log("评论成功");
          res.send();
        })
  
})


var stringJoinBlog = (data)=>{
  var strData="";
  var strContent="";
  data.forEach((item,index)=>{
    var temp = item.blogInfo.split("\n");
    temp.forEach((item,index)=>{
      strContent+=`<p>${item}</p>`
    });
    strData+=`
        <ul class="list-group">
        <li class="list-group-item myLi mybgcolor row">
          <div class="col-sm-12 col-xs-12 ">
            <a href="#" class="myContent">
              <h2>${item.theme}</h2>
            </a>
              <ul class="nav-pills InfoList myJustStart myMin">
                  <li ><span class="myMarR">${item.lable01}</span><span>${item.lable02}</span></li>
              </ul>
              <ul class="nav-pills myUlLi myMin">
                  <li ><a href="#" class="myMarR">${item.time}</a><a href="#">作者：${item.userName}</a></li>
                  <li class="myLiRight">
                    <span class="myMarR"><span class="iconfont icon-duihaoqipao2"></span>评论(${item.commentNum})</span>
                    <span>${item.readNum}人阅读</span>
                  </li>
              </ul>
          </div>
        </li>
        <li class="list-group-item myLi ">
          <div >
            ${strContent}
          </div>
        </li>
      </ul>`
  });
  return strData;
}
var stringJoinComment = (data)=>{
    if(data.commentInfo.length > 0){
      var strComment="";
      var commentInfo = data.commentInfo;
      commentInfo.forEach((item,index)=>{
        var commentContentStr="";
        var commentTemp = item.commentContent.split("\n");
        commentTemp.forEach((item,index)=>{
          commentContentStr+=`<p>${item}</p>`
        });
        strComment +=`
                      <ul class="myUlLi myLi myJustStart" style="height:auto;margin-top:40px;">
                      <li ><a href="#" class="myImgA"><img class="headerImg myMarR" src="${item.user.Img}" alt="">${item.user.name}</a></li>
                      <li class="myLiRight"><a href="#" class="myMarR">${index+1}楼</a>
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
    }else{
      return `<ul class="myUlLi myLi myJustStart text-center" style="height:auto;"><p style="margin:10px 20vw">暂无评论</p></ul>`;
    }
  
  }
module.exports = router;
