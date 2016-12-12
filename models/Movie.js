var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var MovieSchema = new Schema({
    name: String,
    alias: [String],
    publish: Date,
    create_date: {
        type: Date,
        default: Date.now
    },
    images: {
        coverSmall: String,
        coverBig: String,
    },
    source: [{
        source: String,
        link: String,
        swfLink: String,
        quality: String,
        version: String,
        lang: String,
        subtitle: String,
        create_date: {
            type: Date,
            default: Date.now
        }
    }]
});
var Movie = mongodb.mongoose.model("Movie", MovieSchema);
var MovieDAO = function() {};
module.exports = new MovieDAO();

MovieDAO.prototype.save = function(obj, callback) {

    var instance = new Movie(obj);
    instance.save(function(err) {
        callback(err);
    });
};
MovieDAO.prototype.findByName = function(query, callback) {
    Movie.findOne(query, function(err, obj) {
        callback(err, obj);
    });
};

MovieDAO.prototype.removeById = function(query, callback) {
    Movie.remove(query, function(err, obj) {
        callback(err);
    });
};
MovieDAO.prototype.updateById = function(obj, callback) {
    console.info(obj);
    var objSet = {
        $set: []
    };
    for (var key in obj) {
        objSet.$set.push({
            key: obj[key]
        })
    }
    console.info(objSet);
    // Movie.update({
    //     _id: _id
    // }, {
    //     $set: {
    //         name: 'MDragon'
    //     }
    // }, function(err) {});
};
//代码片段
// limit:5，每页限制5条记录
// num:1，查询的页面
// pageCount，一共有多少页
// size，当前页面有多少条记录
// numberOf，分页用几个标签显示
MovieDAO.prototype.findPagination = function(obj, callback) {
    var q = obj.search || {}
    var col = obj.columns;

    var pageNumber = obj.page.num || 1;
    var resultsPerPage = obj.page.limit || 10;

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    // console.info(q);
    var query = Movie.find(q, col).sort('-create_date').skip(skipFrom).limit(resultsPerPage);

    query.exec(function(error, results) {
        if (error) {
            callback(error, null, null);
        } else {
            Movie.count(q, function(error, count) {
                // console.log('----count begin');
                // console.log(count);
                // console.info(results);

                if (error) {
                    callback(error, null, null);
                } else {
                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, pageCount, results);
                }
            });
        }
    });
}