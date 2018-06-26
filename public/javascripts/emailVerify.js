 var validate =function(form){
    $(form).validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      emailVerify:{
        required: true,
      },
      userName: {
        required: true,
        minlength: 2
      },
      password: {
        required: true,
        minlength: 5
      },
      confirm_password: {
        required: true,
        minlength: 5,
        equalTo: "#exampleInputPassword1"
      },
      headerImg : {  
        required: true,  
     },
    },
    messages: {
        userName: {
        required: "请输入用户名",
        minlength: "用户名必需由两个字母组成"
      },
      password: {
        required: "请输入密码",
        minlength: "密码长度不能小于 5 个字母"
      },
      confirm_password: {
        required: "请输入密码",
        minlength: "密码长度不能小于 5 个字母",
        equalTo: "两次密码输入不一致"
      },
      emailVerify:"验证码不能为空",
      headerImg:"不能为空",
      email: "请输入一个正确的邮箱",
     }
    })
} 
