// 实现与MySQL交互
var mysql = require('mysql');
var conf = require('../conf/db');
var runRecordDao = require('../dao/runRecordDao');
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
    getRecords: function (param) {
        //获取connection
        var promise = this.getConnection();
        var connection = null;
        var that = this;
        console.log("getRecords:", param);
        //批量获取userId
        promise = promise.then(function (c) {
            connection = c;
            console.log("get connection");
            //同时执行插入
            return runRecordDao.queryRecords(connection, param);
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
     * 获取所有周,月,日
     * @param  {[type]} type  [description]
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    getAllRecordProps: function (param) {
        //获取connection
        var promise = this.getConnection();
        var connection = null;
        var that = this;
        //批量获取props
        promise = promise.then(function (c) {
            connection = c;
            console.log("get connection");
            //同时执行插入
            return runRecordDao.getAllRecordProps(connection, param);
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
     * 获取一周的里程，积分统计数据
     * @param  {[type]} type  [description]
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    getTotalByWeek: function (param) {
        //获取connection
        var promise = this.getConnection();
        var connection = null;
        var that = this;
        //批量获取props
        promise = promise.then(function (c) {
            connection = c;
            console.log("get connection");
            //同时执行插入
            return runRecordDao.getTotalByWeek(connection, param);
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
     * 批量增加记录
     * @param  {[type]}   param    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    batchAdd: function (records, callback) {
        //获取connection
        var promise = this.getConnection();
        var connection = null;
        var that = this;
        //TODO: beganTransition

        //批量获取userId
        promise = promise.then(function (c) {
            connection = c;
            //建立批量查询id的promise
            var queryUserIdAllPromises = [];
            records.forEach(function (r, i) {
                queryUserIdAllPromises.push(that.getUserIdByName(connection, r.username));
            });
            //同时执行插入
            return Promise.all(queryUserIdAllPromises);
        });
        //将获取到的批量userId赋值到record | 先删除所有当天的记录
        promise = promise.then(function (idArr) {
            records.forEach(function (r, i) {
                r.userId = idArr[i];
            });
            return runRecordDao.deleteByDate(connection, {
                date: records[0].date
            });
        });
        //批量插入记录
        promise = promise.then(function () {
            //建立批量插入的promise
            var addAllPromises = [];
            records.forEach(function (r, i) {
                addAllPromises.push(runRecordDao.insert(connection, r));
            });
            //同时执行插入
            return Promise.all(addAllPromises);
        });
        //成功
        promise = promise.then(function () {
            if (connection) { //释放连接
                connection.release();
            }
            return Promise.resolve(true);
        });
        //失败，捕捉错误
        promise = promise.catch(function (err) {
            if (connection) { //释放连接
                connection.release();
            }
            return Promise.reject(err);
        });
        //TODO: submitTransition
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