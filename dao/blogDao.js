var pool = require('../db/dbConfig');

var PER_PAGE = 10; //每页显示的数量
var NOW_DATE = new Date(); //当前时间

/**
 * 获取所有博客
 *
 * @param params 浏览器参数
 * @param cb 回调函数
 */
function getBlogs(params, cb) {
    var archive = params.archive;
    var tag = params.tag;
    var page = params.page;
    var sql = 'select * from Article where id is not null ';
    if (archive != null) {
        sql += 'and archive = "测试分类" '
    }
    if (tag != null) {
        sql += 'and tag = "测试标签" '
    }
    if (page == null) {
        page = 1;
    }
    sql += 'limit ' + (page - 1) * PER_PAGE + ',' + PER_PAGE;
    console.log('sql: ' + sql);
    pool.query(sql, function (error, results) {
        cb(error, results);
    });
}

/**
 * 获取指定Id的博客
 *
 * @param id 博客Id
 * @param cb 回调函数
 */
function getBlog(id, cb) {
    var sql = 'select * from Article where id=?';
    pool.query(sql, [id], function (error, results) {
        cb(error, results);
    })
}

/**
 * 创建博客
 *
 * @param params 浏览器参数
 * @param cb 回调函数
 */
function createBlog(params, cb) {
    var sql1 = 'select max(id) as maxId from Article';
    var sql2 = 'insert into Article values(?,?,?,?,?,?)';
    pool.query(sql1, function (error, results) {
        pool.query(sql2, [results[0].maxId + 1, params.title, params.archive, params.tag, NOW_DATE, params.content],
            function (error, results, fileds) {
                cb(error, results);
            })
    })
}

/**
 * 更新指定Id的博客
 *
 * @param params 浏览器参数
 * @param id 博客Id
 * @param cb 回调函数
 */
function updateBlog(params, id, cb) {
    var sql = 'update Article set title=?,archive=?,tag=?,updateTime=?,content=? where id=?';
    pool.query(sql, [params.title, params.archive, params.tag, NOW_DATE, params.content, id],
        function (error, reuslts) {
            cb(error, reuslts);
        })
}

/**
 * 删除指定Id的博客
 *
 * @param id 博客Id
 * @param cb 回调函数
 */
function deleteBlog(id, cb) {
    var sql = 'delete from Article where id=?';
    pool.query(sql, [id], function (error, results) {
        cb(error, results);
    })
}

module.exports.getBlogs = getBlogs;
module.exports.getBlog = getBlog;
module.exports.create = createBlog;
module.exports.delete = deleteBlog;
module.exports.update = updateBlog;

