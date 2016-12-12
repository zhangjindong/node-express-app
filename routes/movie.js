var Movie = require('./../models/Movie.js');
exports.movieAdd = function(req, res) {
    if (req.params.name) { //update
        return res.render('movie', {
            title: req.params.name + '|电影|管理|moive.me',
            label: '编辑电影:' + req.params.name,
            movie: req.params.name
        });
    } else {
        return res.render('movie', {
            title: '新增加|电影|管理|moive.me',
            label: '新增加电影',
            movie: false
        });
    }
};
exports.doMovieAdd = function(req, res) {
    var json = req.body.content;    

    if  (req.body.content)  {         //能正确解析 json 格式的post参数
       
    } 
    else  {         //不能正确解析json 格式的post参数

        var  body  =  '';        
        req.on('data',  function (chunk)  {            
            body  +=  chunk;  //读取参数流转化为字符串
        });        
        req.on('end',  function ()  {             //读取参数流结束后将转化的body字符串解析成 JSON 格式

            try  {                
                json  =  JSON.parse(body);            
            } 
            catch  (err)  {                
                json  =  null;            
            }
            //             json ? res.send({"status":"success", "name": json.data.name, "age": json.data.age}) : res.send({"status":"error"});

        });    
    }

    if (json) {
        if (json._id) { //update
            console.log("update");
        } else { //insert
            Movie.save(json, function(err) {
                if (err) {
                    res.send({
                        'success': false,
                        'err': err
                    });
                } else {
                    res.send({
                        'success': true,
                        'name': json.name
                    });
                }
            });
        }
    }
};
/**
 * 删除
 * @param  {[type]} req 请求参数
 * @param  {[type]} res 相应参数
 * @return {[type]}     无
 */
exports.movieDelete = function(req, res) {
    Movie.removeById({
        _id: req.body.id,
    }, function(err) {
        if (err) {
            res.send({
                'success': false
            });
        } else {
            res.send({
                'success': true
            });
        }
    });
}/**
 * 修改
 * @param  {[type]} req 请求参数
 * @param  {[type]} res 相应参数
 * @return {[type]}     无
 */
exports.movieUpdateType = function(req, res) {
    Movie.removeById({
        _id: req.body.id,
        type
    }, function(err) {
        if (err) {
            res.send({
                'success': false
            });
        } else {
            res.send({
                'success': true
            });
        }
    });
}

exports.movieJSON = function(req, res) {
        // console.log("routes req.params.name/");
        // console.log("routes req.params.name/" & req.params.name);
        Movie.findByName({
            name: req.params.name
        }, function(err, obj) {
            res.send(obj);
        });
    }
    //代码片断
    // exports.movie = function(req, res) {
    //  var query = {};
    //  if (req.query.m2) {
    //    query['name'] = new RegExp(req.query.m2); //模糊查询参数
    //  }

//  Movie.findByName(query, function(err, list) {
//    return res.render('admin/movie', {
//      movieList: list
//    });
//  });
// }
//代码片段
exports.movie = function(req, res) {
    var search = {};
    var page = {
        limit: 5,
        num: 1
    };
    //查看哪页
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    if (req.query.jqName) {
        req.query.jqName != "" ? search['name'] = '' + req.query.jqName + '' : ''
    }
    if (req.query.mhName) {
        // 模糊匹配通过正则表达式实现，
        // 这里构建正则表达式只能通过new RegExp
        req.query.mhName != "" ? search['name'] = new RegExp(req.query.mhName) : ''
    }
    if (req.query.mhType) {
        req.query.mhType != "" ? search['mhType'] = req.query.mhType : ''
    }
    var model = {
        search: search,
        columns: '_id name alias director publish images.coverSmall create_date type deploy source',
        page: page
    };
    // console.log("---------- Movie.findPagination");
    Movie.findPagination(model, function(err, pageCount, list) {
        // console.info(pageCount);
        page['pageCount'] = pageCount;
        page['size'] = list.length;
        page['numberOf'] = pageCount > 5 ? 5 : pageCount;
        return res.render('admin/movie', {
            title: '电影|管理|moive.me',
            page: 'admin',
            nav: 'admin.movie',
            movieList: list,
            page: page,
            search: req.query,
        });
    });
}