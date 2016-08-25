// dao/runUserSqlMapping.js
// CRUD SQL语句
var runRecord = {
    simpleInsert: 'insert into run_user(user_name, created, updated) VALUES(?,?,?)',
    queryByName: 'select * from run_user where user_name=?',
    queryAll: 'select * from run_user'
};

module.exports = runRecord;