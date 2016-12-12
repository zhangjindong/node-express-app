var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');
// var eventproxy = require('eventproxy');
var async = require('async');
var Movie = require('./../../models/Movie.js');
var url = require('url');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var cnodeUrl = 'https://cnodejs.org/';
    // superagent发起一个get请求，
    superagent.get(cnodeUrl)
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }
            // cheerio 类似jquery加载所有的html代码
            var topicUrls = [];
            var $ = cheerio.load(res.text);
            // jquery 的代码
            $('#topic_list .topic_title').each(function(idx, element) {
                var $element = $(element);
                // url 不说了，整理好完整的URL可以直接访问
                var href = url.resolve(cnodeUrl, $element.attr('href'));
                topicUrls.push(href);
            });
            /*
            
            // 异步eventproxy控制并发
            var ep = new eventproxy();
                        // 并发topicUrls.length个请求，之后分别执行以下代码
            ep.after('topic_html', topicUrls.length, function(topics) {
                topics = topics.map(function(topicPair) {
                    var topicUrl = topicPair[0];
                    var topicHtml = topicPair[1];
                    var $ = cheerio.load(topicHtml);
                    return ({
                        title: $('.topic_full_title').text().trim(),
                        href: topicUrl,
                        comment1: $('.reply_content').eq(0).text().trim(),
                    });
                });
                console.log('final:');
                console.log(topics);
            });
            // forEach通过 superagent.get发起请求，并并发。
            topicUrls.forEach(function(topicUrl) {
                superagent.get(topicUrl)
                    .end(function(err, res) {
                        console.log('fetch ' + topicUrl + ' successful');
                        ep.emit('topic_html', [topicUrl, res.text]);
                    });
            });
             */
            // var concurrencyCount = 0;
            // 并发数为5个，并发过程为第一个函数，并发结束之后 result是一个对象数组，
            // 通过callback传递数组元素，第二个函数为并发之后的代码。
            async.mapLimit(topicUrls, 5, function(topicUrl, callback) {
                // concurrencyCount++;
                // var delay = parseInt((Math.random() * 10000000) % 2000, 10);
                // console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', topicUrl, '，耗时' + delay + '毫秒');
                superagent.get(topicUrl)
                    .end(function(err, res) {
                        var $ = cheerio.load(res.text);
                        // concurrencyCount--;
                        callback(null, ({
                            title: $('.topic_full_title').text().trim(),
                            href: topicUrl,
                            comment1: $('.reply_content').eq(0).text().trim(),
                        }));
                    });
            }, function(err, result) {
                console.log('final:');
                console.info(result);
            });
        });
});
module.exports = router;