var pool = require('../db/db');

function getTags(params) {
    return new Promise(function (resolve, reject) {
        var sql = 'select DISTINCT(tagName) from Tag;';
        pool.query(sql, function (error, results) {
            if (!error) {
                console.log(results)
                resolve([params, results])
            } else {
                reject(error)
            }
        })
    })
}

module.exports.getTags = getTags;