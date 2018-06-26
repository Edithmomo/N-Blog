
$(document).ready(function(){
// 字幕滚动
var LEN = 200;      // 一个完整滚动条的长度
var x = 0;
var t;
window.onload = roll;
function roll() {
     var col1 = document.getElementById("col1");
     var col2 = document.getElementById("col2");

     var fun = function(){
         col1.style.top = x + 'px';
         col2.style.top = (x + LEN) + 'px';
         x = (x-1) % LEN;
     };
     t = setInterval(fun,10);
}
})