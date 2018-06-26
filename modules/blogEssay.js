const blogEssay = require("../lib/mongodb").blogEssay;

module.exports = userDb ={
       Input:(essay)=>{
           return  blogEssay
                     .insertOne(essay)
                     .exec()
       },
       findBlog:(essay)=>{
           return blogEssay
                  .find(essay)
                  .sort({"readNum":-1})
                  .exec()
       },
       findBlogCount:(essay)=>{
           return blogEssay
                  .count(essay)
                  .exec()
       },
        findBlogNum:(essay,num)=>{
           return blogEssay
                  .find(essay)
                  .sort({"readNum":-1})
                  .limit(num)
                  .exec()
       },
       findBlogSkip:(essay,num,NUMBER)=>{
           return blogEssay
                  .find(essay)
                  .sort({"readNum":-1})
                  .limit(num)
                  .skip(NUMBER)
                  .exec()
       },
       findBlogTime:(essay,num)=>{
           return blogEssay
                  .find(essay)
                  .sort({"time":-1})
                  .limit(num)
                  .exec()
       },
       upBlog:(essay,setDate)=>{
          return blogEssay
                 .update(essay,setDate)
                 .exec()
       },
       deleteBlog:(essay)=>{
          return blogEssay
                 .remove(essay)
                 .exec()
       }
}