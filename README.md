# run_record 晨炮团打卡系统

## 2016/09/11 更新
 - 请假管理 P1
 - 个人打卡录入 P0
 - 接入微信公众账号 P0
 
 已完成
 

## 访问地址：http://www.chenpaotuan.com/run_record/

## 目前实现的功能
  - 日打卡批量录入
  - 周报表（积分统计，里程统计）
  - 日，周维度的跑步记录查询

## 接下来的版本
  - 请假管理 P1
  - 红黄牌管理，并加入到周报表 P1
  - 月唯独跑步记录查询 P2
  - 旧数据迁移至系统 P2
  - 个人打卡录入 P0
  - 接入微信公众账号 P0

## 代码说明
 - 该系统采用node+express+mysql实现，pm2做进程管理

- 工作区代码路径： 
    /alidata/www/node_service/run_record

- 进程管理： 
    - cd /alidata/www/node_service/run_record
    - 启动： pm2 start pm2.json
    - 关闭： pm2 kill
    - 查看： pm2 list
    - 重启:  pm2 reload run_record
    - 日志： pm2 logs
 
- ftp:

    - "host": "*保密*",
    - "user": "www",
    - "password": "*保密*",
    - "port": "22",
    - "remote_path": "/alidata/www/node_service/run_record/",
