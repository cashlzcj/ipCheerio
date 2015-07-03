/**
 * GetIPController
 *
 * @description :: Server-side logic for managing getips
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getIP: function(req,res){
        fGetIPS(res);
//        res.send('xxxx')
    }
};

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');

var urlcnproxy = 'http://cn-proxy.com/',
    urlkuaidaili = 'http://www.kuaidaili.com',
    urlproxylist = 'http://proxy-list.org/english/index.php';

var urls = [urlcnproxy, urlkuaidaili, urlproxylist];
var getIpCount = 0; // 爬取ip的次数

var fGetIPS = function(res){
    async.each(urls, function(item, callback){
        if(!item){
            callback('url 错误');
        }
        fGetIP(res, item);
    }, function(err){
        console.log(err);
    });
}

var fGetIP = function(res, url){
    var failed = {
        'code':-1,
        'msg':'抓取失败'
    }

    /*
    if(url !== urlcnproxy && url !== urlkuaidaili){
        console.log('url不正确');
//        res.send(JSON.stringify(failed));
        return;
    }*/

    request.get(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            getIpCount++;
            var ips = praseIps(body, url);
            saveFile(ips);
            if(getIpCount === urls.length){
                var success = {
                    'code': 0,
                    'msg':'抓取成功'
                }
                res.send(JSON.stringify(success));
                getIpCount = 0;
            }
        }
        else{
            res.send(JSON.stringify(failed));
        }
    })
}

// 解析ips
var praseIps = function(body, url){
    if(url === urlcnproxy){
        return prasecnproxyIps(body);
    }
    else if(url === urlkuaidaili){
        return prasekuaidailiIps(body);
    }
    else if(url === urlproxylist){
        return praseproxyIps(body);
    }
    else{
       return null;
    }
}


// http://cn-proxy.com/
var prasecnproxyIps = function(body){
    var $ = cheerio.load(body);
    var items = '';
    var arr = $('tbody tr td');
    arr.each(function (idx, element) {
        if(idx % 5 === 0){
            var $element = $(element);
            var ip =  $element.text() + ':' + $element.next().text() + '\n';
            items += ip;
        }
    });

    return items;
}

// http://www.kuaidaili.com
var prasekuaidailiIps = function(body){
    var $ = cheerio.load(body);
    var items = '';
    var arr = $('tbody tr td');
    arr.each(function(idx, element){
       if(idx % 8 === 0){
           var $element = $(element);
            var ip = $element.text() + ':' + $element.next().text() + '\n';
           items += ip;
        }

//        console.log(idx);
//        console.log($element.text());
    })

    return items;
}

// http://proxy-list.org/english/index.php
var praseproxyIps = function(body){
     var $ = cheerio.load(body);
     var items = '';
     var arr = $('div.table ul li.proxy');
    arr.each(function(idx, element){
        var $element = $(element);
        items += $element.text() + '\n';
    })

    return items;
}

var saveFile = function(ips){
    if(!ips) return;
    var date = new Date();
    fs.writeFile('./ips/'+date.getTime()+'.txt', ips, function(err){
        if(err) throw err;
        console.log('saved');
    })
}



// http://www.kuaidaili.com/
// http://proxy-list.org/english/index.php



