var models = require('./db.js');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sqlbase.js');
var request = require('request');
var cheerio = require('cheerio');
var multer = require("multer");
//使用连接池链接数据库

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
var upload = multer({ storage: storage });

//var cpUpload = upload.fields([{ name: 'imgfile', maxCount: 12 }])
router.use('/uploadimg', upload.array('imgfile', 40), function(req, res, next) {
  var files = req.body.files
  console.log(files)
  if (!files[0]) {
    res.send('error');
  } else {
    res.send('success');
  }
})





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
router.use('/addUser', (req, res) => {
  var sql = $sql.user.add;
  var params = req.body;
  console.log(params);
  pool.query(sql, [params.userName, params.passWord, params.createTime], function(error, results, fields) {
    if (error) throw error;
    if (results) {
      console.log(results)
      jsonWrite(res, results);
    }
  })
});
//查库操作(检测用户信息)
router.use('/searchUser', (req, res) => {
  var sql = $sql.user.check;
  var params = req.body;
  console.log(params);
  pool.query(sql, [params.username, params.pwd], function(error, results, fields) {
    if (error) throw error;
    if (results) {
      console.log(jsonWrite(res, results))
      jsonWrite(res, results);
    }
  })
});
//登录
router.use('/signIn', (req, res) => {
  // var sql = $sql.user.signIn;
  var params = req.body;
  console.log(params);
  pool.query(`select * from user_info where user_name = '${params.userName}'`, function(error, results, fields) {
    if (error) throw error;
    if (results != "") {
      console.log(results);
      res.json({
        status: 1,
        statusText: '登陆成功',
        results: results
      });
    } else {
      // res.status()
      res.json({
        status: 0,
        statusText: '未注册'
      })
    }
  })
});
//留言API,新建留言
router.use('/writtenInfo', (req, res) => {
  var sql = $sql.message.written;
  var params = req.body;
  console.log(params);
  pool.query(sql, [params.message_list, params.author, params.date], function(error, results, fields) {
    if (error) throw error
    if (results) {
      console.log(results)
      jsonWrite(res, results);
    }
  })
});
//留言API，获取留言列表
router.use('/messageList', (req, res) => {
  var sql = $sql.message.search;
  var params = req.body;
  console.log(params);
  pool.query(sql, [params.message_list], function(error, results, fields) {
    if (error) throw error;
    if (results) {
      console.log(results)
      jsonWrite(res, results);
    }
  })
});
//爬取头条前端资讯
router.get('/crawler', function(req, res, next) {
  var delateSql = $sql.news.delate;
  pool.query(delateSql, function(error, results, fields) {
    if (error) throw error;
    return
  })
  for (var i = 1; i < 3; i++) {
    request(`https://toutiao.io/subjects/11907?f=new&page=${i}`, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        var items = [];
        $('.post').each(function(idx, element) {
          var $element = $(element)
          var $author = $element.find('.meta').text().trim();
          var $title = $element.find('.title>a').text().trim();
          var $href = 'https://toutiao.io' + $element.find('.title>a').attr('href');
          var $number = $element.find('.like-button>span').text();
          var $favorite_num = $element.find('.favorite-button>span').text();
          var createTime = new Date();
          var sql = $sql.news.addNews;
          pool.query(sql, [$title, $href, $author, $number, $favorite_num, createTime], function(error, results, fields) {
            if (error) throw error;
            if (results) {
              // console.log(results)
            }
          })

        })
      }

    })

  }
  res.send('success')
});
router.use('/findNews', (req, res) => {
  var current_page = 1; //默认为1
  var num = 15; //一页条数
  var count = '';
  console.log(req.body.page)
  if (req.body.page) {
    current_page = parseInt(req.body.page);
  }
  var last_page = current_page - 1;
  if (current_page <= 1) {
    last_page = 1;
  }
  var next_page = current_page + 1;
  var str = `SELECT * FROM news LIMIT  ${num*(current_page-1)},${num}`;
  const data_count = 'SELECT COUNT(*) FROM news'
  pool.query(str, function(error, results, fields) {
    if (error) throw error;
    res.json(results);
  })
});
router.use('/count', (req, res) => {
  const data_count = 'SELECT COUNT(*) as total FROM news'
  pool.query(data_count, function(error, results, fields) {
    if (error) throw error;
    // console.log(fields);
    res.json(results);
  })
})
//请求代理
router.use('/url', (req, res) => {
  request('https://toutiao.io/k/6pvafa', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);
    }
  })
});
module.exports = router;
