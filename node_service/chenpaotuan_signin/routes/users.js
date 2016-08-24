var express = require('express');
var mysql = require('mysql');
var userAo = require("../ao/userAo");
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/**
 * 
 * 获取所有用户的信息
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {               var param [description]
 * @return {[type]}       [description]
 */
router.get('/getAllUsers', function (req, res, next) {
    var param = req.query;
    var promise = userAo.getAllUsers(param);
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
 * 
 * 获取所有用户的信息
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {               var param [description]
 * @return {[type]}       [description]
 */
router.get('/getAllUserName', function (req, res, next) {
    var param = req.query;
    var promise = userAo.getAllUsers(param);
    promise = promise.then(function (users) {
        var usernameArr = [];
        users.forEach(function (user) {
            usernameArr.push({
                userId: user.user_id,
                username: user.user_name
            });
        });
        res.send({
            errCode: 0,
            msg: "suc",
            data: usernameArr
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