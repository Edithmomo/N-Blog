# N-Blog
## 这是一个基于exprss + mongodb的博客项目
### 实现邮箱验证登陆
# 使用说明
## 1.在项目目录下创建config/config.js
###  config.js内容为：
        module.exports={
            name:"N-Blog",
            email:{
                service:"发送邮件的邮箱类型（例如：QQ）",
                user:"发送邮件的邮箱号",
                pass:"邮箱的smtp授权码"
            },
            mongodb:"mongodb://localhost:27017/N-Blog"
        }
## 2.在public目录下创建headerImg
## 3.安装mongodb数据库 创建一个名为N-Blog的数据库
## 4.npm i 安装依赖
## 5.npm start 启动项目  
## 注：如果报错‘缺少模块’，可以用cnpm i 在装一遍