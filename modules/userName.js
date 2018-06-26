const userName = require("../lib/mongodb").userName;

module.exports = userDb ={
       Input:(user)=>{
           return  userName
                     .insertOne(user)
                     .exec()
       },
       findEmail:(user)=>{
           return userName
                  .findOne(user)
                //   .findOne({email:123})
                  .exec()
       },
       findLogin:(user)=>{
        return userName
               .findOne(user)
             //   .findOne({email:123})
               .exec()
       },
       update:(essay,setDate)=>{
          return userName
                 .update(essay,setDate)
                 .exec()
       }
}