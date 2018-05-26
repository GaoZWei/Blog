var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET admin page. */
router.get('/about', function (req, res, next) {
    res.render('about', {title: 'Express'});
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
