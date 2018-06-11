var express = require('express');
var router = express.Router();
var blogDao = require('../dao/blogDao');
var commonDao = require('../dao/commonDao');
var Q = require('q');
var result;

/* GET home page. */
router.get('/', function (req, res, next) {
    result = {
        articles: [],
        tags: [],
        archives: [],
        totalPage: '',
        currentPage: ''
    };
    blogDao.getBlogs(req.query) // promise.resovle参数会向下继续传递,作为.then()执行时的参数,且仅能传递一个值,如想传递多值则用数组[params1,params2]
        .then(commonDao.getTags) // 获取标签
        .then(commonDao.getSorts)//获取分类
        .then(function (results) {
            result.articles = results[1][1];
            result.tags = results[1][0];
            result.archives=results[0];
            res.render('index', result);
        })
});

var fun1 = function (result) {
    var data = '123';
    var deferred = Q.defer();
    deferred.resolve([result, data]);
    return deferred.promise;
};

/* GET admin page. */
router.get('/article/:id', function (req, res, next) {
    result = {
        title: '',
        archives: '',
        tags: [],
        description: '',
        content: '',
        updateTime: ''
    };
    blogDao.getBlog(req.params.id)
        .then(function (results) {
            result.title = results[0].title;
            result.archives = results[0].archive;
            result.tags = results[0].tags;
            result.description = results[0].description;
            result.content = results[0].content;
            result.updateTime = results[0].updateTime;
            console.log(results);
            res.render('front/front_content', result);
        });
});

/* GET persoanl page. */
router.get('/personal', function (req, res, next) {
    res.render('personal/personal', {title: 'Express'});
});

router.get('/front_list', function (req, res, next) {
    res.render('front/front_list');
});

router.get('/front_content', function (req, res, next) {
    res.render('front/front_content');
});

router.get('/hobby', function (req, res, next) {
    res.render('hobby/hobby');
});

router.get('/problem_list', function (req, res, next) {
    res.render('problem/problem_list');
});

router.get('/problem_content', function (req, res, next) {
    res.render('problem/problem_content');
});

module.exports = router;
