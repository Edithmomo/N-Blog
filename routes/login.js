var express = require('express');
var router = express.Router();

var userDb = require("../modules/userName")
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.query.writeBlog){
    req.session.hostryHref = "/writeBlog";
  }else if(req.query.personalData){
    req.session.hostryHref = "/personalData";
  }else{
     var hrefStr = req.rawHeaders[11].split("http://localhost:3000")[1];
    if(hrefStr == undefined || hrefStr == "/register" || hrefStr == "/login" || hrefStr == "/findpassword"){
       req.session.hostryHref = "/";
    }else{
      req.session.hostryHref = hrefStr;
    }
    if(req.session.hostryHref == undefined){
       req.session.hostryHref = "/";
    }
  }
  res.render('login', { title: '登录' ,status:1});
});
router.post('/', function(req, res, next) {
  var user = req.body;
  delete user.loginCode;
  userDb.findLogin(user)
        .then((data)=>{
         if(data){
            req.session.userName = data;
           return res.send({href:req.session.hostryHref,status:200,text:"登录成功<br /><br />欢迎回来"});
         }else{
           res.send({ status:2,text:"账号名或密码或验证码有误"});
         }
        })
        .catch((error)=>{
          res.send({status:3,text:"数据库访问失败"});
        }) 
});
module.exports = router;
