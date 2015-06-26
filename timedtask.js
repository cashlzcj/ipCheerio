/**
 * Created by junge on 15/6/24.
 */
// 每30分钟执行一次
//var TulinContentController = require('./api/controllers/TulinContentController');
//var routes = require('routes');
var request = require('request');
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();

var times = [];

for (var i = 1; i < 60; i+=30) {
    times.push(i);
}
//console.log(times);

rule.minute = times; //minute

//var reqGetContent = function (s)
//{
//    var json = JSON.stringify({keyword:s});
//
//    request.get({url:'http://localhost:1337/TulinContent/getContent',
//                 body:json,
//              headers: {
//            'Content-Type': 'application/json'
//    }}, function(error, response, body){
////        console.log(error);
//        if(!error && response.statusCode == 200){
//            console.log(body);
//        }
//    });
//}

var timeGetIP = function(){
    request.get('http://localhost:1337/getIP', function(error, response, body){
//        console.log(error);
        if(!error && response.statusCode == 200){
            console.log('又抓取了一次');
        }
        else{
            console.log(error);
        }
    });
}
var j = schedule.scheduleJob(rule, function(){
    timeGetIP();
});





