var pool = require('../db/db');
var moment = require('moment');

var PER_PAGE = 10; //每页显示的数量
var NOW_DATE = new Date(); //当前时间

/**
 * 获取所有博客
 *
 * @param params 浏览器参数
 */
function getBlogs(params) {
    return new Promise(function (resolve, reject) {
        var archive = params.archive;
        var tag = params.tag;
        var page = params.page;

        var sql = 'SELECT a.* ,GROUP_CONCAT(t.tagName SEPARATOR ",") as tags ' +
            ',GROUP_CONCAT(DISTINCT ach.archiveName SEPARATOR ",") as archive ' +
            'from Article a left join Tag t on t.articleId = a.id ' +
            'left join Archive ach on ach.articleId = a.id GROUP BY a.id';

        var sql1 = 'SELECT * from (' + sql + ') tmp where tags like "%' + tag + '%"';
        var sql2 = 'SELECT * from (' + sql + ') tmp where archive like "%' + archive + '%"';

        if (archive != null) {
            sql = sql2;
        }
        if (tag != null) {
            sql = sql1;
        }
        if (page == null) {
            page = 1;
        }

        sql += ' limit ' + (page - 1) * PER_PAGE + ',' + PER_PAGE;
        console.log('sql: ' + sql);
        pool.query(sql, function (error, results) {
            if (!error) {
                for (var i = 0; i < results.length; i++) {
                    results[i].updateTime = moment(results[i].updateTime).format('YYYY年MM月DD日');
                    results[i].tags = results[i].tags.toString().split(',');
                }
                // console.log(results);
                resolve(results);
            } else {
                reject(error);
            }
        });
    });
}

/**
 * 获取指定Id的博客
 *
 * @param id 博客Id
 */
function getBlog(id) {
    return new Promise(function (resolve, reject) {
        var sql = 'SELECT a.* ,GROUP_CONCAT(t.tagName SEPARATOR ",") as tags ' +
            ',GROUP_CONCAT(DISTINCT ach.archiveName SEPARATOR ",") as archive ' +
            'from Article a left join Tag t on t.articleId = a.id ' +
            'left join Archive ach on ach.articleId = a.id where id=? GROUP BY a.id';
        pool.query(sql, [id], function (error, results) {
            if (!error) {
                console.log(results)
                results[0].updateTime = moment(results[0].updateTime).format('YYYY年MM月DD日');
                if(results[0].tags!=null){
                    results[0].tags = results[0].tags.toString().split(',');
                }
                resolve(results);
            } else {
                reject(error);
            }
        })
    })
}

/**
 * 创建博客
 *
 * @param params 浏览器参数
 */
function createBlog(params) {
    return new Promise(function (resolve, reject) {
        var sql1 = 'select max(id) as maxId from Article';
        var sql2 = 'insert into Article values(?,?,?,?,?)';
        var sql3 = 'insert into Archive values(?,?)';
        var sql4 = 'insert into Tag values(?,?)';
        pool.query(sql1, function (error, results) {
            var id = results[0].maxId + 1;
            pool.query(sql2, [id, params.title, NOW_DATE, params.description, params.content],
                function (error, results) {
                    pool.query(sql3, [params.archive, id], function (error, results) {
                        if (typeof params.tag === 'object') {
                            for (var i = 0; i < params.tag.length; i++) {
                                pool.query(sql4, [params.tag[i], id], function (error, results) {
                                    if (!error) {

                                        resolve(results);
                                    } else {
                                        reject(error);
                                    }
                                })
                            }
                        } else {
                            pool.query(sql4, [params.tag, id], function (error, results) {
                                if (!error) {
                                    resolve(results);
                                } else {
                                    reject(error);
                                }
                            })
                        }
                    })
                })
        })
    })
}

/**
 * 更新指定Id的博客
 *
 * @param params 浏览器参数
 * @param id 博客Id
 */
function updateBlog(params, id) {
    return new Promise(function (resolve, reject) {
        var archive = params.archive;
        var tag = params.tag;
        var sql = 'update Article set title=?,updateTime=?,description=?,content=? where id=?;';
        var sql1 = 'delete from Archive where articleId=?;';
        var sql2 = 'insert into Archive values(?,?);';
        var sql3 = 'delete from Tag where articleId=?;';
        var sql4 = 'insert into Tag values(?,?);';
        pool.query(sql, [params.title, NOW_DATE, params.description, params.content, id],
            function (error, reuslts) {
                pool.query(sql1 + sql2 + sql3, [id, archive, id, id], function (error, result) {
                    if (typeof tag === 'object') {
                        for (var i = 0; i < tag.length; i++) {
                            pool.query(sql4, [tag[i], id], function (error, results) {
                                if (!error) {
                                    resolve(results);
                                } else {
                                    reject(error);
                                }
                            })
                        }
                    } else {
                        pool.query(sql4, [tag, id], function (error, results) {
                            if (!error) {
                                resolve(results);
                            } else {
                                reject(error);
                            }
                        })
                    }
                });

            })
    })

}

/**
 * 删除指定Id的博客
 *
 * @param id 博客Id
 */
function deleteBlog(id) {
    return new Promise(function (resolve, reject) {
        var sql = 'delete from Article where id=?;';
        var sql1 = 'delete from Archive where articleId=?;';
        var sql2 = 'delete from Tag where articleId=?;';
        pool.query(sql + sql1 + sql2, [id, id, id], function (error, results) {
            if (!error) {
                resolve(results);
            } else {
                reject(error);
            }
        })
    })

}

module.exports.getBlogs = getBlogs;
module.exports.getBlog = getBlog;
module.exports.create = createBlog;
module.exports.delete = deleteBlog;
module.exports.update = updateBlog;

