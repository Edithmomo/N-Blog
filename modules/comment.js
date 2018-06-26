const comment = require("../lib/mongodb").comment;

module.exports = commentDb ={
       Input:(essay)=>{
           return  comment
                     .insertOne(essay)
                     .exec()
       },
       findComment:(essay)=>{
           return comment
                  .findOne(essay)
                //   .findOne({email:123})
                  .exec()
       },
       upComment:(essay,setDate)=>{
          return comment
                 .updateOne(essay,setDate)
                 .exec()
       },
       deleteComment:(essay)=>{
          return comment
                 .remove(essay)
                 .exec()
       }
}