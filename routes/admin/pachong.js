var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');
// var eventproxy = require('eventproxy');
var async = require('async');
var Movie = require('./../../models/Movie.js');
var url = require('url');

/* GET users listing. */
router.get('/', function(req, resp, next) {
    var cnodeUrl = 'https://api.douban.com/v2/movie/top250';
    // superagent发起一个get请求，
    superagent.get(cnodeUrl)
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }
            // cheerio 类似jquery加载所有的html代码
            var topicUrls = [];
            var objs = eval('(' + res.text + ')');
            for (var sub in objs.subjects) {
                topicUrls.push({
                    name: objs.subjects[sub].title,
                    alias: objs.subjects[sub].original_title,
                    publish: objs.subjects[sub].year,
                    images: {
                        coverSmall: objs.subjects[sub].images.small,
                        coverBig: objs.subjects[sub].images.medium
                    },
                    source: [{
                        source: objs.subjects[sub].id,
                        link: objs.subjects[sub].alt
                    }]
                })
            }

            // var concurrencyCount = 0;
            // 并发数为5个，并发过程为第一个函数，并发结束之后 result是一个对象数组，
            // 通过callback传递数组元素，第二个函数为并发之后的代码。
            async.mapLimit(topicUrls, 5, function(topicUrl, callback) {

                if (topicUrl) {
                    if (topicUrl._id) { //update
                        console.log("update");
                    } else { //insert
                        Movie.save(topicUrl, function(err) {
                            if (err) {
                                callback(null, err);
                            } else {
                                callback(null, ({
                                    title: topicUrl.name,
                                    href: topicUrl.source[0].link,
                                    comment1: topicUrl.alias,
                                }));
                            }
                        });
                    }
                }
            }, function(err, result) {
                resp.send("成功 同步 top250");
            });
        });
});
module.exports = router;