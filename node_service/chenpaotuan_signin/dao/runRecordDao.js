var sql = require('./runRecordSqlMapping');
// dao/runRecordDao.js
module.exports = {
    /**
     * 插入记录
     * @param  {[type]}   connection [description]
     * @param  {[type]}   param      [description]
     * @return {[type]}              [description]
     */
    insert: function (connection, param) {
        return new Promise(function (resolve, reject) {
            // 获取前台页面传过来的参数
            var nowSec = new Date().getTime() / 1000;
            // 建立连接，向表中插入值
            // insert into run_record(user_id, time, date, week, month, location, distance, image, score, created, updated) VALUES(?,?,?,?,?,?,?,?,?,?,?)
            connection.query(sql.insert, [
                param.userId,
                param.time,
                param.date,
                param.week,
                param.month,
                param.location,
                param.distance,
                "emptyImg",
                param.score,
                nowSec,
                nowSec
            ], function (err, result) {
                if (err) {
                    console.log("recordDao insert fail");
                    return reject(err);
                } else {
                    console.log("recordDao insert suc");
                    return resolve(result.insertId);
                }
            });
        });
    },

    /**
     * 更新记录
     * @param  {[type]} connection [description]
     * @param  {[type]} param      [description]
     * @return {[type]}            [description]
     */
    update: function (connection, param) {
        return new Promise(function (resolve, reject) {
            // 获取前台页面传过来的参数
            var nowSec = new Date().getTime() / 1000;
            // 建立连接，向表中插入值
            // update run_record set user_id=?, time=?, date=?, week=?, month=?, location=?, distance=?, image=?, score=?, updated=? where id=?
            connection.query(sql.update, [
                param.userId,
                param.time,
                param.date,
                param.week,
                param.month,
                param.location,
                param.distance,
                "emptyImg",
                param.score,
                nowSec,
                param.id
            ], function (err, result) {

                if (err) {
                    console.log("recordDao update fail");
                    return reject(err);
                } else {
                    console.log("recordDao update suc");
                    return resolve(result);
                }
            });
        });
    },

    /**
     * 删除某一天的所有记录
     * @param  {[type]} connection [description]
     * @param  {[type]} param      [description]
     * @return {[type]}            [description]
     */
    deleteByDate: function (connection, param) {
        return new Promise(function (resolve, reject) {
            // 获取前台页面传过来的参数
            var nowSec = new Date().getTime() / 1000;
            // 建立连接，向表中插入值
            console.log("deleteByDate:" + param.date);
            connection.query(sql.deleteByDate, [
                param.date
            ], function (err, result) {

                if (err) {
                    console.log("recordDao deleteByDate fail");
                    return reject(err);
                } else {
                    console.log("recordDao deleteByDate suc");
                    return resolve(result);
                }
            });
        });
    },

    queryRecords: function (connection, param) {
        console.log("queryRecords");
        var theSql = sql.getQuerySql(param),
            paramArr = [];
        console.log(theSql);
        if (param.week) {
            paramArr.push(param.week);
        }
        if (param.userId) {
            paramArr.push(param.userId);
        }
        if (param.date) {
            paramArr.push(param.date);
        }
        if (param.month) {
            paramArr.push(param.month);
        }

        var pageStart = param.pageStart * 1 || 0; //默认第0页
        var pageSize = param.pageSize * 1 || 20; //默认一页20条记录
        var start = pageStart * pageSize;
        console.log("queryRecords:", param);
        paramArr.push(start);
        paramArr.push(pageSize);

        console.log(paramArr);
        /*
        queryByWeek: 'select * from run_record where week=?',
        queryByDate: 'select * from run_record where date=?',
        queryByUserId: 'select * from run_record where user_id=?',  
        */
        return new Promise(function (resolve, reject) {
            connection.query(theSql, paramArr, function (err, result) {
                if (err) {
                    console.log("recordDao queryRecords fail");
                    return reject(err);
                } else {
                    console.log("recordDao queryRecords suc");
                    return resolve(result);
                }
            });
        });
    },

    /**
     * 检查记录是否存在
     * @param  {[type]} connection [description]
     * @param  {[type]} param      [description]
     * @return {[type]}            [description]
     */
    getExitRecordId: function (connection, param) {
        return new Promise(function (resolve, reject) {
            connection.query(sql.getExitRecordId, [
                param.userId,
                param.time,
            ], function (err, result) {
                if (err) {
                    return reject(err);
                } else {
                    var id = result.length >= 1 ? result[0].id : ""; //如果存在记录，就返回true
                    return resolve(id);
                }
            });
        });
    },

    /**
     * 获取所有周,月,日
     * @param  {[type]} connection [description]
     * @param  {[type]} param      [description]
     * @return {[type]}            [description]
     */
    getAllRecordProps: function (connection, param) {
        console.log("getAllProps");
        var theSql = "";
        var paramArr = [];
        console.log(param);
        if (param.week === '1') {
            theSql = sql.getAllWeek;
        }
        if (param.month === '1') {
            theSql = sql.getAllMonth;
        }
        if (param.date === '1') {
            theSql = sql.getAllDate;
        }

        var pageStart = param.pageStart * 1 || 0; //默认第0页
        var pageSize = param.pageSize * 1 || 20; //默认一页20条记录
        var start = pageStart * pageSize;

        paramArr.push(start);
        paramArr.push(pageSize);

        console.log(theSql);

        /*
        getAllWeek: 'SELECT distinct week FROM `run_record` order by week desc limit ?,?',
        getAllMonth: 'SELECT distinct month FROM `run_record` order by month desc limit ?,?',
        getAllDate: 'SELECT distinct date FROM `run_record` order by date desc limit ?,?',
         */
        return new Promise(function (resolve, reject) {
            connection.query(theSql, paramArr, function (err, result) {
                if (err) {
                    console.log("recordDao getAllProps fail");
                    return reject(err);
                } else {
                    console.log("recordDao getAllProps suc");
                    return resolve(result);
                }
            });
        });
    },

    /**
     * 获取一周的里程，积分统计数据
     * @param  {[type]} connection [description]
     * @param  {[type]} param      [description]
     * @return {[type]}            [description]
     */
    getTotalByWeek: function (connection, param) {
        console.log("getTotalByWeek");
        var theSql = "";
        var paramArr = [];
        console.log(param);
        if (param.score === '1') {
            theSql = sql.weekScore;
        }
        if (param.distance === '1') {
            theSql = sql.weekDistance;
        }
        paramArr.push(param.week);
        console.log(theSql);

        /*
        getAllWeek: 'SELECT distinct week FROM `run_record` order by week desc limit ?,?',
        getAllMonth: 'SELECT distinct month FROM `run_record` order by month desc limit ?,?',
        getAllDate: 'SELECT distinct date FROM `run_record` order by date desc limit ?,?',
         */
        return new Promise(function (resolve, reject) {
            connection.query(theSql, paramArr, function (err, result) {
                if (err) {
                    console.log("recordDao getTotalByWeek fail");
                    return reject(err);
                } else {
                    console.log("recordDao getTotalByWeek suc");
                    return resolve(result);
                }
            });
        });
    }

};