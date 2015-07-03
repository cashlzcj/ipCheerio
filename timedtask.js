/**
 * Created by junge on 15/6/24.
 */
// 每30分钟执行一次
//var TulinContentController = require('./api/controllers/TulinContentController');
//var routes = require('routes');
var request = require('request');
var schedule = require('node-schedule');

module.exports = {
    timeGetIP: function(){
        request.get('http://localhost:1337/getIP', function(error, response, body){
            if(!error && response.statusCode == 200){
                console.log('又抓取了一次');
            }
            else{
                console.log(error);
            }
        });
    }
};

var rule = new schedule.RecurrenceRule();

var j = schedule.scheduleJob(rule, function(){
    var times = [];

    for (var i = 1; i < 60; i+=1) {
        times.push(i);
    }
    rule.minute = times; //minute
    var timedtask = require('./timedtask.js');
    timedtask.timeGetIP();
});




