var express = require('express');
var router = express.Router();
var path = require("path");

var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var config = require("../config/config");
var multiparty = require("connect-multiparty");
var multipartMiddleware = multiparty();

// var userDb = require("../modules/userName")

router.use(multiparty({uploadDir:path.dirname(__dirname)+'/public/headerImg' }));

router.get('/', function(req, res, next) {
  res.render('register', { title: '注册' ,status: 0});
});

router.post("/",multipartMiddleware,function(req,res,next){
    var user = req.body;
    if(req.query.email){//判断时邮箱验证还是表单提交
      if(req.body.type=="register"){
         userDb.findEmail({email:user.email}).then((data)=>{
                          if(data){
                            return res.send({ title: '注册' ,ajaxStatus: 1});
                          }
                         else{
                            user = user.email;
                            // var randNum = randNumFun();
                            // userEmail = {email:user,randNum:randNum};
                            req.session.userEmail = {email:user,randNum:"228155"};
                            // sendMail(user,randNum,"注册验证码");//发送邮件
                            return res.send({ title: '注册' ,ajaxStatus: 2});
                         }
                        })
      }else{
          userDb.findEmail({email:user.email}).then((data)=>{
                          if(!data){
                            return res.send({ title: '注册' ,ajaxStatus: 3});
                          }
                         else{
                            user = user.email;
                            // var randNum = randNumFun();
                            // userEmail = {email:user,randNum:randNum};
                            req.session.userEmail = {email:user,randNum:"228155"};
                            // sendMail(user,randNum,"找回密码验证码");//发送邮件
                            return res.send({ title: '注册' ,ajaxStatus: 4});
                         }
                       })
      }
    }else if(user.findpasswordEmail){
      var userEmail = req.session.userEmail ||"";
      if(user.findpasswordEmail == userEmail.email && user.findpasswordCode == userEmail.randNum){
         userDb.update({email:user.findpasswordEmail},{$set:{password:user.password}})
             .then((data)=>{
              return  res.send({href:"/login",status:200,text:"密码修改成功<br />"});
             })
             .catch(function(){
              console.log("写入数据库失败");
              console.log("密码修改失败");
              return  res.send({href:"/register",status:2,text:"数据库写入失败,密码修改失败"}); 
          });
      }else{
        return   res.send({href:"/register",status:2,text:"验证码错误！"}); 
      }
    }else{
      var imgPath = "";
      if(req.files.file){
        imgPath = req.files.file;
      }else{
        imgPath = "diwen.jpg";
      }
     user.headerImg = "../headerImg/" + path.basename(imgPath);
     user.email = user.registerEmail;
     user.blogNumber = 0;
     user.support = 0;
     delete user.password1;
     delete user.registerEmail;
     userInputDb(user,req,res);//插入 数据库
    }
  })

  /*邮件配置 */
  smtpTransport = nodemailer.createTransport(smtpTransport({
    service:config.email.service,
    auth:{
      user:config.email.user,
      pass:config.email.pass,
    }
}));
/**
 * node nodemailer模块发送邮箱验证
 * @param {*} recipient  目标邮箱号
 * @param {*} randNum   随机验证码
 */
var sendMail = (recipient,randNum,str)=>{
  smtpTransport.sendMail({
    from:config.email.user,
    to:recipient,
    subject:"N-Blog " +str,
    html:"验证码："+ randNum+"，感谢您使用N-Blog帐号，请在10分钟内完成注册。工作人员不会向您索取验证码，请勿泄露。消息来自：N-Blog安全中心 ",
  },function(err,res){
    if(err){
      console.log(err);
    }
    console.log("发送成功！！")
  });
}
/**
 * 生成随机码
 * return 随机码
 */
var randNumFun=function(){
    var num=""
    for(let i = 0; i < 6; i++){
      num += Math.floor(Math.random()*(10-0)+0);
    }
    return num;
}

/**
 * 写入数据库
 * 参数 用户信息
 * 返回 状态码
 */
var userInputDb = (user,req,res)=>{
  var userEmail = req.session.userEmail || "";
  if(user.email == userEmail.email && user.registerCode == userEmail.randNum){
      delete user.registerCode;
      userDb.Input(user)
            .then(function(data){
                console.log("写入数据库成功");
                console.log("注册成功");
              return  res.send({href:"/login",status:200,text:"注册成功<br />"});
            })
            .catch(function(){
              console.log("写入数据库失败");
              console.log("注册失败");
              return  res.send({href:"/register",status:2,text:"数据库写入失败,注册失败"}); 
          });
  }else{
    return   res.send({href:"/register",status:2,text:"验证码错误！"}); 
  }
}
module.exports = router;
