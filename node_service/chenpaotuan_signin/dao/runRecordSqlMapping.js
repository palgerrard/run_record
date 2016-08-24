// dao/runRecordSqlMapping.js
// CRUD SQL语句
var runRecord = {
    insert: 'insert into run_record(user_id, time, date, week, month, location, distance, image, score, created, updated) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
    update: 'update run_record set user_id=?, time=?, date=?, week=?, month=?, location=?, distance=?, image=?, score=?, updated=? where id=?',
    getExitRecordId: 'select id from run_record where user_id=? and time=?',
    delete: 'delete from run_record where id=?',
    deleteByDate: 'delete from run_record where date=?',
    queryById: 'select * from run_record where id=?',
    queryAll: 'select * from run_record',
    getAllWeek: 'SELECT distinct week as val FROM `run_record` order by week desc limit ?,?',
    getAllMonth: 'SELECT distinct month as val FROM `run_record` order by month desc limit ?,?',
    getAllDate: 'SELECT distinct date as val FROM `run_record` order by date desc limit ?,?',
    weekDistance: 'select sum(score) as s, sum(distance) as d, run_user.user_id, run_user.user_name from run_record right join run_user on run_record.user_id = run_user.user_id and run_record.week=? group by run_user.user_id order by d DESC, s Desc',
    weekScore: 'select sum(score) as s, sum(distance) as d, run_user.user_id, run_user.user_name from run_record right join run_user on run_record.user_id = run_user.user_id and run_record.week=? group by run_user.user_id order by s DESC, d Desc',

    getQuerySql: function (param) {
        var sql = "select * from run_record inner join run_user on run_record.user_id = run_user.user_id ";
        var whereArr = [];
        if (param.week) {
            whereArr.push(" run_record.week=? ");
        }
        if (param.userId) {
            whereArr.push(" run_record.user_id=? ");
        }
        if (param.date) {
            whereArr.push(" run_record.date=? ");
        }
        if (param.month) {
            whereArr.push(" run_record.month=? ");
        }
        if (whereArr.length > 0) {
            sql += " where ";
        }
        sql += whereArr.join(" and ");
        sql += " ORDER BY `time` ASC limit ?,?";
        return sql;
    }
};

module.exports = runRecord;