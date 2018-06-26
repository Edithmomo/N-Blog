 $(function(){
	  var hrefStr = window.location.href.split("3000");
	  hrefStr = hrefStr[hrefStr.length - 1].replace("/",".")
	  if(hrefStr == "."){
	  	hrefStr = "index";
	  }
	  $(hrefStr).addClass("on"); 
	  $(hrefStr +" a").attr("href","#");
	  $(hrefStr).siblings().removeClass("on");

	  $(".loginOUt").on("click",(e)=>{
         
	  })
})