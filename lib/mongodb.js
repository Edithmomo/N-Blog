const Mongolass = require("mongolass");
const mongolass = new Mongolass();
var config = require("../config/config");
mongolass.connect(config.mongodb);

exports.userName=mongolass.model("usernames");
exports.blogEssay=mongolass.model("blogessays");
exports.comment=mongolass.model("comments");