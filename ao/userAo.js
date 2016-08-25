// 实现与MySQL交互
var mysql = require('mysql');
var conf = require('../conf/db');
var runUserDao = require('../dao/runUserDao');

// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);

module.exports = {
    /**
     * 获取记录列表
     * @param  {[type]} type  [description]
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    getAllUsers: function (param) {
        console.log("ao getAllUsers");
        //获取connection
        var promise = this.getConnection();
        var connection = null;
        var that = this;
        //批量获取user
        promise = promise.then(function (c) {
            connection = c;
            console.log("get connection");
            //同时执行插入
            return runUserDao.getAllUsers(connection, param);
        });
        //成功
        promise = promise.then(function (result) {
            if (connection) { //释放连接
                connection.release();
            }
            return Promise.resolve(result);
        });
        //失败，捕捉错误
        promise = promise.catch(function (err) {
            if (connection) { //释放连接
                connection.release();
            }
            return Promise.reject(err);
        });
        return promise;
    },

    /**
     * 通用username获取用户id， 如果系统中无此用户，默认会创建
     * @param  {[type]} username [description]
     * @return {[type]}          [description]
     */
    getUserIdByName: function (connection, username) {
        //查询用户是否存在
        var promise = runUserDao.queryByName(connection, {
            username: username
        });

        promise = promise.then(function (userRecords) {
            //如果用户不存在，简单插入一个用户
            if (userRecords.length === 0) {
                return runUserDao.simpleCreate(connection, {
                    username: username
                });
            } else {
                return Promise.resolve(userRecords[0].user_id);
            }
        });
        return promise;
    },

    /**
     * 获取连接
     * @return {[type]} [description]
     */
    getConnection: function () {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                if (err) { //如果获取连接池事失败，直接退出
                    return reject(err);
                }
                return resolve(connection);
            });

        });
    }
};