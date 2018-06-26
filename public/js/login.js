 var codes = "";
 var ErroAlert = (e) => {
         var index = layer.alert(e, { icon: 5, time: 3000, offset: 't', closeBtn: 0, title: '错误信息', btn: [], anim: 2, shade: 0 });
         layer.style(index, {
             color: '#777'
         });
     }
 var DoneAlert = (e) => {
         var index = layer.alert(e, { icon: 6, time: 2000, offset: 't', closeBtn: 0, btn: [], anim: 2, shade: 0 });
         layer.style(index, {
             color: '#777'
         });
     }
 var hrefAddr = window.location.href.split("3000/")[1];
 if(hrefAddr != "login"){
    $(".login").hide()
    if (hrefAddr == "register") {
         $(".layout").height(400);
     } else {
         $(".layout").height(320);
     }
    $("."+hrefAddr).show()
 }
 layui.use(['form', 'upload'], function() {
     var form = layui.form,
         upload = layui.upload

     let check = ".login";
     $('.mytab').on("click", (e) => {
         $(e.target).parents()[3].style.display = "none";
         var go = $(e.target).data("go");
         check = "." + go;
         if (go == "register") {
             $(".layout").height(400);
         } else {
             $(".layout").height(320);
         }
         $(check).show();

     })

     form.on('submit(submitForm)', function(data) {
         let validataCode = data.form.className.split("Form")[0] + "Code";
         let code = data.field[validataCode];
         if (validataCode == "loginCode" && code.toLowerCase() == codes.toLowerCase()) {
                 $(data.form).submit();
         } else if (validataCode != "loginCode" && code) {
                 $(data.form).submit();
         } else {
             ErroAlert('输入验证码错误');
             showCheck(createCode());
         }
         return false;
     });
     
    $(".layui-form").ajaxForm(function(data){    
        machile();
        setTimeout(function() {
             $('.authent').hide();
             $(".layout").removeClass('test');
             if (data.status == 200) {
                //登录成功
                $('.layout div').fadeOut(100);
                $('.success').fadeIn(1000);
                $('.success').html("<br /><br />"+data.text);
                //跳转操作
                 setTimeout(function() {
                window.location.href="http://localhost:3000"+data.href; 
            },1500)
            } else {
                ErroAlert(data.text);
            }
         }, 2400);
    });
     
    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
        if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
          return '用户名不能有特殊字符';
        }
        if(value.length<4 || value.length>12){
            return '用户名长度必须为4-12位';
        }
        if(/(^\_)|(\__)|(\_+$)/.test(value)){
          return '用户名首尾不能出现下划线\'_\'';
        }
        if(/^\d+\d+\d$/.test(value)){
          return '用户名不能全为数字';
        }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pass: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
        ] 
        ,pass1:function(value,item){
            var val = $(item).parent().prev().children()[1].value
            if(val != value){
                return '两次输入的密码不一致';
            }
        }
    });

     function machile() {
         $(".layout").addClass('test');
         setTimeout(() => {
             $(".layout").addClass('testtwo');
         }, 300);
         setTimeout(function() {
             $('.authent').show().animate({ right: -320 }, {
                 easing: 'easeOutQuint',
                 duration: 600,
                 queue: false
             });
             $('.authent').animate({ opacity: 1 }, {
                 duration: 200,
                 queue: false
             }).addClass('visible');
         }, 500);
         setTimeout(function() {
             $('.authent').show().animate({ right: 90 }, {
                 easing: 'easeOutQuint',
                 duration: 600,
                 queue: false
             });
             $('.authent').animate({ opacity: 0 }, {
                 duration: 200,
                 queue: false
             }).addClass('visible');
             $(".layout").removeClass('testtwo'); //平移特效
         }, 2000);
     }


     $('body').particleground({
         dotColor: '#E8DFE8',
         lineColor: '#133b88'
     });

     var canGetCookie = 0;
     showCheck(createCode());
     $(".myCanvas").on("click", function() {
         showCheck(createCode())
     })
    
     function showCheck(a) {
         var len = $('.myCanvas').length;
         for (let i = 0; i < len; i++) {
             var c = $('.myCanvas')[i];
             var ctx = c.getContext("2d");
             ctx.clearRect(0, 0, 1000, 1000);
             ctx.font = "80px 'Hiragino Sans GB'";
             ctx.fillStyle = "#E8DFE8";
             ctx.fillText(a, 0, 100);
         }
     }

     $('input[name="password"]').focus(function() {
         $(this).attr('type', 'password');
     });
     $('input[name="password1"]').focus(function() {
         $(this).attr('type', 'password');
     });
     $('input[type="text"],input[type="email"]').focus(function() {
         $(this).prev().animate({ 'opacity': '1' }, 200);
     });
     $('input[type="text"],input[type="password"],input[type="email"]').blur(function() {
         $(this).prev().animate({ 'opacity': '.5' }, 200);
     });
     
     var uploadInst = upload.render({
         elem: '.uploadImg',
         url: '',
         auto: false,
         bindAction: '',
         accept:"images",
         acceptMime: 'image/*',
         before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
             layer.load(); //上传loading
         },
         done: function(res, index, upload) {
             layer.closeAll('loading'); //关闭loading
         },
         error: function(index, upload) {
             layer.closeAll('loading'); //关闭loading
         }
     });
 })

$(".valiBtn").on("click",(e)=>{
    console.log(123)
  var type = $(e.target).data("type");
  var data = {email:$("input[name="+type+"Email]").val(),type} ;
  $.ajax({ 
    type:"POST",
    url:"/registers?email=true",
    data: data,
    success:(data)=>{
      switch(data.ajaxStatus){
        case 1:
              ErroAlert("邮箱已注册！请重新输入");
              // $("input[name="+type+"Email]").val("");
              break;
        case 2:
              DoneAlert("验证码发送成功");
              break;
        case 3:
               ErroAlert("邮箱未注册！请重新输入");
               // $("input[name="+type+"Email]").val("");
              break;
        case 4:
              DoneAlert("验证码发送成功");
              break;
      }
    }
  })
})

 //生成验证码

 function createCode() {
     codes = "";
     var codeLength = 4;
     var selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
     for (var i = 0; i < codeLength; i++) {
         var charIndex = Math.floor(Math.random() * (56 + 1));
         codes += selectChar[charIndex];
     }
     if (codes.length == codeLength) {
         return codes;
     } else {
         return createCode();
     }
 }