var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

var stringSplit = require("../modules/stringSplit");

var userBlogDb = require("../modules/blogEssay");
var userNameDB = require("../modules/userName");
var commentDb = require("../modules/comment");

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.session.userName=req.session.userName;
  var pagerNum = req.query.pagerNum || 0;
  user=req.session.userName;
  if(user){
    var user = req.session.userName;
    userBlogDb.findBlogSkip({email: user.email},5,pagerNum*5)
        .then((data) => {
            var strBlog = stringJoin(data);
           return userNameDB.findEmail({email: user.email })
                        .then((data) => {
                            var auther = autherStr(data); 
                            var pager = pagerStr(data.blogNumber,pagerNum)
                            return userBlogDb.findBlogNum({},8)
                                .then((data) => {
                                    var moreList = moreListStr(data);
                                    return res.render('personalData', { title: '我的博客', user: user, data: strBlog,auther, moreList,pager});
                                })

                        })

                })
  }else{
    res.redirect("/login?personalData=true");
  }
	
});

router.post('/',function(req, res, next){
	console.log(req.body)
	if(req.body.logout){
       req.session.userName ="";
       res.redirect('/personalData')
	}
	if(req.body.alter == 1){
		var blogIngoId = req.body.id;
		userBlogDb.findBlog({ _id: ObjectId(blogIngoId) })
        .then((data) => {
        	console.log("成功")
	     return res.send(data);
	    })
	 }
	 if(req.body.alter == 2){
		var blogEssay = req.body;
	      var blogIngoId = blogEssay.id;
	      delete blogEssay.alter;
	      delete blogEssay.id;
	      userBlogDb.upBlog({_id: ObjectId(blogIngoId)},{$set:{theme:blogEssay.theme,lable:blogEssay.lable,blogInfo:blogEssay.blogInfo}})
	                .then((data)=>{
                         return res.redirect('/personalData')
	                })
	 }
	  if(req.body.remove){
	      var blogIngoId = req.body.id;
	      userBlogDb.deleteBlog({_id: ObjectId(blogIngoId)})
	                .then((data)=>{
                     return commentDb.deleteComment({blogId:ObjectId(blogIngoId)})
                       .then(()=>{
                         console.log("删除评论成功")
                         var user = req.session.userName;
                          req.session.userName.blogNumber--;
                          return userNameDB.update({email:user.email},{$set:{blogNumber:user.blogNumber}})
                                .then((data)=>{
                                	console.log("删除成功")
                                	return res.redirect('/personalData')
                                })
                       });
                        
	                })
	 }
})

var stringJoin = (data)=>{
  var str=""
  data.forEach((item,index)=>{
  	item.blogInfo=stringSplit.mySplit(item.blogInfo,100);
    str+=`
      <div class="tit_li"  data-id="${item._id}">
         <a class="myAlist" href="/details?_id=${item._id}">
	       <h4 class="h_ti"><span class="glyphicon glyphicon-tree-conifer"></span>${item.theme}</h4>
          </a>
	       <div class="neirong">
	       <p>${item.blogInfo}</p>
	       <span class="mar">${item.time}</span> <span class="mar">阅读数: ${item.readNum}</span><span class="mar">评论数: ${item.commentNum}</span>
	       <div class="delete_alter">
           <button type="button" class="btn btn-danger dele fr" data-toggle="modal" data-target="#exampleModalDel" data-whatever="@mdo">删除</button>
          <button type="button" class="btn btn-primary alte fr" data-toggle="modal" data-target="#exampleModalAlt" data-whatever="@mdo">修改</button></div>
	       </div>
	   </div>`
  });
  return str;
}

var autherStr = (data) => {
    return `<img src="${data.headerImg}" alt="..." class="img-circle" style="width: 38px;height: 38px;margin-left:4px;"><span class="per_name">${data.userName}</span>
	  		 </div>
	  		 <div class="per_zhuce">
	  		 	<span class="per_time">作品数：${data.blogNumber}</span>
	  		 </div>
	  		 <div class="per_zhuce">
	  		 	<span class="per_time">获取赞数：${data.support}</span>
	  		 </div>`;
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
var pagerStr = (blognum,pagernum)=>{
	var str = "";
	pagernum = Number(pagernum)
	if(pagernum < 0){
		pagernum = 0;
	}
	var tem = pagernum%5;
	var met = 5 - tem-1;

	if(pagernum ==0){
		str += `<li class="disabled" >
		         <a href="#" aria-label="Previous">
		            <span aria-hidden="true">&laquo;</span>
		          </a>
		        </li>`
	}else{
		str += `<li>
		         <a href="/personalData?${pagernum-5}" aria-label="Previous">
		            <span aria-hidden="true">&laquo;</span>
		          </a>
		        </li>`
	}
	 while(tem > 0){
	 	str += `<li><a href="/personalData?pagerNum=${pagernum-tem}">${pagernum-tem+1}</a></li>`;
	 	tem--;
	 }
    let i = 1;
    str += `<li class="active"><a href="/personalData?pagerNum=${pagernum}">${pagernum+1}</a></li>`;
	var num = pagernum*5;
	 while(met > 0){
         var numI = num + i*5;
	 	if(numI < blognum){
	 		str += `<li ><a href="/personalData?pagerNum=${pagernum+i}">${pagernum+i+1}</a></li>`;
	 	}else{
	 		str += `<li class="disabled"><a href="${pagernum+i}">${pagernum+i+1}</a></li>`;
	 	}
	 	i++;
	 	met--;
	 }
	 if((pagernum+5)*5 >= blognum){
	 	str += `<li class="disabled">
		          <a href="/personalData?${pagernum+5}"  aria-label="Next">
		            <span aria-hidden="true">&raquo;</span>
		          </a>
		        </li>`
	 }else{
	 	str += `<li>
		          <a href="/personalData?${pagernum+5}" aria-label="Next">
		            <span aria-hidden="true">&raquo;</span>
		          </a>
		        </li>`
	 }
	return str;
}
module.exports = router;
