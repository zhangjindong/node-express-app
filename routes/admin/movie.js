var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('admin/movie', { title: 'Express' });
// });
/* GET home page. */
router.get('/', function(req, res, next) {
    var page = {
        limit: 5,
        num: 1
    };
    var list=[];
    pageCount=10
    page['pageCount'] = pageCount;
    page['size'] = list.length;
    page['numberOf'] = pageCount > 5 ? 5 : pageCount;
    res.render('admin/movie', {
        title: '电影|管理|moive.me',
        page: 'admin',
        nav: 'admin.movie',
        movieList: list,
        page: page,
        search:{}
    });
});
module.exports = router;