var express = require('express');
var mysql = require('mysql');
var recordAo = require("../ao/recordAo");
var router = express.Router();

/* GET record listing. */
router.get('/', function (req, res, next) {
    res.send('欢迎访问晨跑团打卡系统');
});

/**
 * 批量添加跑步记录
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {               var param [description]
 * @return {[type]}       [description]
 */
router.post('/batchAddRecord', function (req, res, next) {
    var param = req.body;
    var records = JSON.parse(param.daylyRecords).records;
    var promise = recordAo.batchAdd(records);
    promise = promise.then(function (data) {
        res.send({
            errCode: 0,
            msg: "suc"
        });
    });
    promise = promise.catch(function (err) {
        res.send({
            errCode: "-1",
            msg: err.stack || err
        });
    });
});



/**
 * 各种维度的记录查询
 * TODO: 需要做sql注入过滤, 目前没做
 * 筛选条件：week month userId date
   http: //www.chenpaotuan.com/signin/record/getRecords?pageStart=0&userId=27&pageSize=100&week=88&month=8&date=20160820

   查询某个人一月的所有记录：

   周里程排名接口
   周积分排名接口
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {               var param [description]
 * @return {[type]}       [description]
 */
router.get('/getRecords', function (req, res, next) {
    var param = req.query;
    var promise = recordAo.getRecords(param);
    promise = promise.then(function (data) {
        res.send({
            errCode: 0,
            msg: "suc",
            data: data
        });
    });
    promise = promise.catch(function (err) {
        res.send({
            errCode: "-1",
            msg: err.stack || err
        });
    });
});

/**
 * 获取查询筛选的字段 月、周、 日
 * http://www.chenpaotuan.com/signin/record/getAllRecordProps?week=1
 * http://www.chenpaotuan.com/signin/record/getAllRecordProps?month=1
 * http://www.chenpaotuan.com/signin/record/getAllRecordProps?date=1
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {               var param [description]
 * @return {[type]}       [description]
 */
router.get('/getAllRecordProps', function (req, res, next) {
    var param = req.query;
    var promise = recordAo.getAllRecordProps(param);
    promise = promise.then(function (props) {
        var propArr = [];
        props.forEach(function (p, i) {
            propArr.push(p.val);
        });

        res.send({
            errCode: 0,
            msg: "suc",
            data: propArr
        });
    });
    promise = promise.catch(function (err) {
        res.send({
            errCode: "-1",
            msg: err.stack || err
        });
    });
});

/**
 * 获取一周的里程，积分统计数据
 * 按里程：http://www.chenpaotuan.com/signin/record/getTotalByWeek?distance=1
 * 按积分：http://www.chenpaotuan.com/signin/record/getTotalByWeek?score=1
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {               var param [description]
 * @return {[type]}       [description]
 */
router.get('/getTotalByWeek', function (req, res, next) {
    var param = req.query;
    var promise = recordAo.getTotalByWeek(param);
    promise = promise.then(function (props) {
        var propArr = [];
        props.forEach(function (p, i) {
            console.log(p);
            propArr.push({
                rank: i + 1,
                score: p.s || 0,
                distance: p.d || 0,
                userId: p.user_id,
                username: p.user_name
            });
        });

        res.send({
            errCode: 0,
            msg: "suc",
            data: propArr
        });
    });
    promise = promise.catch(function (err) {
        res.send({
            errCode: "-1",
            msg: err.stack || err
        });
    });
});

module.exports = router;