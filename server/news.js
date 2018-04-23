var models = require('./db.js');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sqlbase.js');

//使用连接池链接数据库

var pool = mysql.createPool(models.mysql);

var jsonWrite = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};
// 增加用户接口
router.use('/findNews', (req, res) => {
  var current_page = 1; //默认为1
  var num = 10; //一页条数
  console.log(req.query.page)
  if (req.query.page) {
    current_page = parseInt(req.query.page);
  }
  var last_page = current_page - 1;
  if (current_page <= 1) {
    last_page = 1;
  }
  var next_page = current_page + 1;
  var str = `SELECT * FROM news LIMIT 0 , ${num*(current_page-1)}`;

  pool.query(str, function(error, results, fields) {
    if (error) throw error;
    res.json(results)
  })
});

module.exports = router;
