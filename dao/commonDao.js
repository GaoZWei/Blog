var pool = require('../db/db');

function getTags(params) {
    return new Promise(function (resolve, reject) {
        var sql = 'select DISTINCT(tagName) from Tag;';
        pool.query(sql, function (error, results) {
            if (!error) {
                resolve([results,params] )
            } else {
                reject(error)
            }
        })
    })
}

function getSorts(params){
    return new Promise(function (resolve,reject) {
        var sql='SELECT DISTINCT (archiveName ) from Archive;'
        pool.query(sql,function (error,results) {
            if(!error){
                resolve([results,params])
            }else {
                reject(error);
            }
        })
    })
}


module.exports.getTags = getTags;
module.exports.getSorts=getSorts;
