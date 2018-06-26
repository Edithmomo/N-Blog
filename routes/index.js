var express = require('express');
var router = express.Router();

var userBlogDb = require("../modules/blogEssay");
var stringSplit = require("../modules/stringSplit");
/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.userName = req.session.userName;
    var dataStr={};
    userBlogDb.findBlogTime({lable:"人工智能"},4)
              .then((data)=>{
                var smart = smartStr(data,4);
                dataStr.smart=smart;
                return userBlogDb.findBlogTime({lable:"云计算/大数据"},7)
                        .then((data)=>{
                          var bigData = lsitStr(data,7);
                          dataStr.bigData=bigData;
                           return  userBlogDb.findBlogTime({lable:"前端"},5)
                                      .then((data)=>{
                                        var qianDuan = lsitStr(data,5);
                                        dataStr.qianDuan=qianDuan;
                                        return res.render('index', { title: 'Express',user:req.session.userName,dataStr});
                                      })
                            })
                       
              })
  // res.render('index', { title: 'Express',user:req.session.userName,media,cloud,webData,data:""});
});

router.post("/" ,function(req,res,next){
  if (req.body.logout) {
    req.session.userName = "";
    res.redirect('/')
  }
  if (req.body.searchContent) {
      res.redirect('search?searchContent=' + req.body.searchContent)
  }
})


var smartStr = (data,num) => {
    var str = "";
    data.forEach((item, index) => {
        if (index < num) {
        item.blogInfo=stringSplit.mySplit(item.blogInfo,100);
        str += `<div class="media">
                    <div class="media-left media-middle">
                        <a href="#">
                      <img class="media-object" src="/images/book.jpg" alt="...">
                    </a>
                    </div>
                    <div class="media-body">
                        <h4 class="media-heading  "><a class="title_a" href="/details?_id=${item._id}">${item.theme}</a></h4>
                        <p>${item.blogInfo}</p>
                  </div>`;
        }
    })
    return str;
}
var lsitStr = (data,num) => {
    var str = "";
    data.forEach((item, index) => {
        if (index < num) {
        str += `<li> <a href="/details?_id=${item._id}">${item.theme}</a></li>`;
        }
    })
    return str;
}
module.exports = router;
