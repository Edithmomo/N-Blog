var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

var userBlogDb = require("../modules/blogEssay");
var commentDb = require("../modules/comment");
var userNameDB = require("../modules/userName");
/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.userName=req.session.userName;
  user=req.session.userName;
  if(user){
    res.render('writeBlog', { title: '写博客',user:user });
  }else{
    res.redirect("/login?writeBlog=true");
  }
});

router.post('/', function(req, res, next) {
    if (req.body.logout) {
    req.session.userName = "";
    res.redirect('/writeBlog')
    }
    if (req.body.searchContent) {
        res.redirect('search?searchContent=' + req.body.searchContent)
    }
    if(req.body.theme){
      var blogEssay = req.body;
      var data = new Date()
      blogEssay.userName = req.session.userName.userName;
      blogEssay.email =  req.session.userName.email;
      blogEssay.time = data.getFullYear() +"年"+ (data.getMonth()+1) + "月" +data.getDate() + "日";
      blogEssay.readNum = 0 ;
      blogEssay.commentNum = 0;
      userBlogDb.Input(blogEssay)
            .then(function(data){
              var comment = {blogId:data.insertedId,commentInfo:[]};
              commentDb.Input(comment);
              req.session.userName.blogNumber++;
             return userNameDB.update({email:user.email},{$set:{blogNumber:req.session.userName.blogNumber}})
                       .then((data)=>{
                        return userBlogDb.findBlog({theme: blogEssay.theme})
                              .then((data)=>{
                                 console.log("存储成功")
                                 res.redirect('/details?_id='+data[0]._id);
                              })
                       })
                       
            })
    }
});
module.exports = router;