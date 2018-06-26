var express = require('express');
var router = express.Router();

var userBlogDb = require("../modules/blogEssay");
var search
router.get('/', function(req, res, next) {
	req.session.userName = req.session.userName;
   var pagerNum = req.query.pagerNum || 0;
  var searchContent="";
  var type="";
  if(req.query.list){
    search = "list="+req.query.list;
    searchContent = req.query.list;
    type = 'list';
  }else{
     search = "searchContent="+req.query.searchContent;
    searchContent = req.query.searchContent;
  }
  var query = new RegExp(searchContent);
	var dataStr ={};
    userBlogDb.findBlogCount({$or:[{userName:query},{theme:query},{lable:query}]})
            .then((data)=>{
               var pager = pagerStr(data,pagerNum,searchContent);
              return userBlogDb.findBlogNum({$or:[{userName:query},{theme:query},{lable:query}]},9)
                      .then((data)=>{
                      	var searchData = stringJoin(data);
                      	dataStr.searchData=searchData;
                        return  userBlogDb.findBlogNum({lable:"人工智能"},5)
            				            .then((data)=>{
            				            	var smart = moreListStr(data);
            				            	dataStr.smart=smart;
            				              return userBlogDb.findBlogNum({lable:new RegExp("云计算/大数据")},5)
            									            .then((data)=>{
            									            	var bigData = moreListStr(data);
            									            	dataStr.bigData=bigData;
            									              return userBlogDb.findBlogNum({lable:"游戏开发"},5)
            														            .then((data)=>{
            														            	var game = moreListStr(data);
            														            	dataStr.game=game;
            														              return  userBlogDb.findBlogNum({lable:"前端"},5)
            																			            .then((data)=>{
            																			            	var qianDuan = moreListStr(data);
            																			            	dataStr.qianDuan=qianDuan;
            																			              return res.render('search', { title: 'Express',user:req.session.userName,dataStr,searchContent,type,pager});
            																			            })
            														            })
            									            })
            				            })
                      })
              })
});

router.post("/", function(req, res, next) {
	if(req.body.logout){
       req.session.userName ="";
       res.redirect('search?'+search)
	}
   if(req.body.searchContent){
	res.redirect('search?searchContent='+req.body.searchContent)
	}
   
})

var stringJoin = (data)=>{
  var str=""
  data.forEach((item,index)=>{
    str+=`
      <li class="list-group-item myLi mybgcolor row" style="width:740px;margin-left:0px;">
        <div class="col-sm-8 col-xs-8 text-left">
          <a href="/details?_id=${item._id}" class="myContent">
            <h4 style="overflow: hidden;white-space: nowrap;">${item.theme}</h4>
          </a>
            <ul class="nav-pills InfoList" style="margin:0px;">
                <li ><a href="#">${item.lable}</a></li>
                <li ><a href="#">${item.time}</a></li>
                <li ><a href="#"><span class="glyphicon text-info glyphicon-comment mar_gly"></span>
                   <span>${item.commentNum}</span></a></li>
            </ul>
        </div>
        <div class="col-sm-4 col-xs-4 text-right">
            <ul class="readNumList">
                <li ><span>${item.readNum}</span></li>
                <li ><a href="#">阅读量</a></li>
              </ul>
        </div>
      </li>`
  });
  return str;
}
var moreListStr = (data) => {
    var str = "";
    data.forEach((item, index) => {
        if (index <= 6) {
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

var pagerStr = (blognum,pagernum,searchContent)=>{
  var str = "";
  pagernum = Number(pagernum)
  if(pagernum < 0){
    pagernum = 0;
  }
  var tem = pagernum%9;
  var met = 9 - tem-1;

  if(pagernum ==0){
    str += `<li class="disabled" >
             <a href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>`
  }else{
    str += `<li>
             <a href="/search?searchContent=${searchContent}&pagerNum=${pagernum-9}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>`
  }
   while(tem > 0){
    str += `<li><a href="/search?searchContent=${searchContent}&pagerNum=${pagernum-tem}">${pagernum-tem+1}</a></li>`;
    tem--;
   }
    let i = 1;
    str += `<li class="active"><a href="/search?searchContent=${searchContent}&pagerNum=${pagernum}">${pagernum+1}</a></li>`;
  var num = pagernum*9;
   while(met > 0){
         var numI = num + i*9;
    if(numI < blognum){
      str += `<li ><a href="/search?searchContent=${searchContent}&pagerNum=${pagernum+i}">${pagernum+i+1}</a></li>`;
    }else{
      str += `<li class="disabled"><a href="${pagernum+i}">${pagernum+i+1}</a></li>`;
    }
    i++;
    met--;
   }
   if((pagernum+9)*9 >= blognum){
    str += `<li class="disabled">
              <a href="/personalData?${pagernum+9}"  aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>`
   }else{
    str += `<li>
              <a href="/search?searchContent=${searchContent}&pagerNum=${pagernum+9}" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>`
   }
  return str;
}

module.exports = router;