/**
 * GetIPController
 *
 * @description :: Server-side logic for managing getips
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getIP: function(req,res){
        fGetIP(res);
//        res.send('xxxx')
    }
};

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var fGetIP = function(res){
    var url = 'http://cn-proxy.com/';
    request.get(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var ips = praseIps(body);
            saveFile(ips);
            res.send(ips);
        }
        else{
           res.send('error');
        }
    })
}

var praseIps = function(body){
    var $ = cheerio.load(body);
    var items = '';
    var arr = $('tbody tr td');
    arr.each(function (idx, element) {
        var $element = $(element);
//                console.log(idx);
//                console.log($element.text());
        if(idx % 5 === 0)
        {
            var ip =  $element.text() + " " + $element.next().text() + '\n';
            items += ip;
        }
    });

    return items;
}

var saveFile = function(ips){
    if(!ips) return;
    var date = new Date();
    fs.writeFile('/Users/junge/Desktop/ips'+date.getTime()+'.txt', ips, function(err){
        if(err) throw err;
        console.log('saved');
    })
}





