var express = require('express');
var router = express.Router();
var blogDao = require('../dao/blogDao');
var id;

/* get blogs. */
router.get('/', function (req, res, next) {
    blogDao.getBlogs(req.query, function (error, results) {
        console.log(Math.floor(results.length / 10) + 1);
        console.log(results)
    });
    res.send('get blogs success');
});

/* get blog. */
router.get('/:id', function (req, res, next) {
    id = req.params.id;
    blogDao.getBlog(req.params.id, function (error, results) {
        console.log(results)
    });
    res.send('get blog success');
});

/* delete blog. */
router.delete('/:id', function (req, res, next) {
    id = req.params.id;
    blogDao.delete(id, function (error, results) {
        console.log(results)
    });
    res.send('delete with a resource');
});

/* create blog. */
router.post('/', function (req, res, next) {
    blogDao.create(req.query, function (error, results) {
        console.log(results);
    });
    res.send('create article success');
});

/* update blog. */
router.put('/:id', function (req, res, next) {
    id = req.params.id;
    blogDao.update(req.query, id, function (error, results) {
        console.log(error);
        console.log(results);
    });
    res.send('update article success');
});

module.exports = router;
