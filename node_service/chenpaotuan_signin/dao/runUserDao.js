var sql = require('./runUserSqlMapping');
// dao/runRecordDao.js
module.exports = {
    /**
     * 快速创建一个用户
     * @param  {[type]}   connection [description]
     * @param  {[type]}   param      [description]
     * @return {[type]}              [description]
     */
    simpleCreate: function (connection, param) {
        return new Promise(function (resolve, reject) {
            // 获取前台页面传过来的参数
            var nowSec = new Date().getTime() / 1000;
            // 建立连接，向表中插入值
            // insert into run_user(user_name) VALUES(?)
            connection.query(sql.simpleInsert, [
                param.username,
                nowSec,
                nowSec
            ], function (err, result) {
                if (err) {
                    console.log("run_user simple create fail");
                    return reject(err);
                } else {
                    console.log("run_user simple create suc");
                    return resolve(result);
                }
            });
        });
    },

    /**
     * 获取所有用户
     * @param  {[type]} connection [description]
     * @param  {[type]} param      [description]
     * @return {[type]}            [description]
     */
    getAllUsers: function (connection, param) {
        return new Promise(function (resolve, reject) {
            // 获取前台页面传过来的参数
            var nowSec = new Date().getTime() / 1000;
            // 建立连接，向表中插入值
            // insert into run_user(user_name) VALUES(?)
            connection.query(sql.queryAll, [], function (err, result) {
                if (err) {
                    console.log("run_user getAllUsers fail");
                    return reject(err);
                } else {
                    console.log("run_user getAllUsers suc");
                    return resolve(result);
                }
            });
        });
    },

    /**
     * 通过名字查询id
     * @param  {[type]} connection [description]
     * @param  {[type]} param      [description]
     * @return {[type]}            [description]
     */
    queryByName: function (connection, param) {
        return new Promise(function (resolve, reject) {
            // select * from run_user where user_name=?
            connection.query(sql.queryByName, [
                param.username
            ], function (err, result) {
                if (err) {
                    console.log("run_user queryByName fail");
                    return reject(err);
                } else {
                    console.log("run_user queryByName suc");
                    return resolve(result);
                }
            });
        });
    }
};