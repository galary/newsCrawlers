var models = require('./db.js');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sqlbase.js');
const fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var multer = require("multer");
var iconv = require('iconv-lite')
//使用连接池链接数据库
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
  encoding: function (req, res, cb) {
    cb(null, 'gbk')
  },
  destination: function (req, file, cb) {
    // 接收到文件后输出的保存路径（若不存在则需要创建）
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
    cb(null, Date.now() + "-" + file.originalname);
  }
});
// 创建文件夹
var createFolder = function (folder) {
  try {
    // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
    // 如果文件路径不存在将会抛出错误"no such file or directory"
    fs.accessSync(folder);
  } catch (e) {
    // 文件夹不存在，以同步的方式创建文件目录。
    fs.mkdirSync(folder);
  }
};

var uploadFolder = './upload/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });
router.use('/upload', upload.single('file'), (req, res) => {
  var file = req.file;
  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);
  // 接收文件成功后返回数据给前端
  res.json({ res_code: '0' });

})
var pool = mysql.createPool(models.mysql);

var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};
let jsonback = function (val) {
  let value = JSON.stringify(val);
  return JSON.parse(value)
}
// 增加用户接口
router.use('/addUser', (req, res) => {
  var sql = $sql.user.add;
  var params = req.body;
  console.log(params);
  pool.query(sql, [params.username, params.pwd, new Date()], function (error, results, fields) {
    if (error) throw error;
    if (results) {
      res.send({ resultCode: "0", resultText: "success", data: { adduser: true } });
    }
  })
});
//查库操作(检测用户信息)
router.use('/searchUser', (req, res) => {
  var params = req.body;
  var sql = $sql.user.check;
  pool.query(sql, [params.username], function (error, results, fields) {
    if (error) throw error;
    var dataString = JSON.stringify(results);
    var data = JSON.parse(dataString);
    if (data.length == 0) {
      res.send({ resultCode: "0", resultText: "success", data: { register: true } })
    } else {
      res.send({ resultCode: "0", resultText: "fail", data: { register: false } })
    }
  })
});
//登录
router.use('/signIn', (req, res) => {
  var sql = $sql.user.signIn;
  var params = req.body;
  console.log(params);
  pool.query(sql, [params.userName, params.passWord], function (error, results, fields) {
    if (error) throw error;
    if (results) {
      let data = jsonback(results);
      if (data.length == 0) {
        res.send({ resultCode: "1", resultText: "success", result: { backStr: '未注册' } })
      } else {
        res.send({ resultCode: "0", resultText: "success", result: { backStr: '登录成功' }, userId: jsonback(results)[0].userId })
      }
      console.log("sign:", jsonback(results));
    }
  })
});
//点赞  type=1 点赞；type=0 收藏。
router.use('/upvote', (req, res) => {
  var sql = $sql.news.upvote, sql1 = $sql.user.upvote;
  var params = req.body;
  console.log(params);
  pool.query(sql, [params.newsId], function (error, results, fields) {
    if (error) throw error
    if (results) {
      pool.query(sql1, [params.newsId, params.userId, 1], (err, res1) => {
        if (err) throw err
        if (res1) {
          res.send({ resultCode: "0", resultText: "success", result: { backStr: '点赞成功' } })
        }
      })
    }
  })
});
//获取点赞的数据
router.use('/getUpvote', (req, res) => {
  var current_page = 1; //默认为1
  var num = 8; //一页条数
  let searchNews = $sql.upvote.searchOne, searchAllNews = $sql.upvote.searchAll;
  if (req.body.page) {
    current_page = parseInt(req.body.page);
  }
  if (req.body.newsId) {
    pool.query(searchNews, [newsId, num * (current_page - 1), num], (err, res) => {
      console.log(res)
    })
  } else {
    pool.query(searchNews, [num * (current_page - 1), num], (err, res) => {
      console.log(res)
    })
  }
})
//下载
router.use('/downloadTxt', (req, res) => {
  res.download('./upload/1548924652045-账号.txt');
})
//收藏
router.use('/favorite', (req, res) => {
  var sql = $sql.news.favorite;
  var params = req.body;
  console.log(params);
  pool.query(sql, [params.newsId], function (error, results, fields) {
    if (error) throw error;
    if (results) {
      pool.query(sql1, [params.newsId, params.userId, 0], (err, res) => {
        if (err) throw err
        console.log(results);
      })
    }
  })
});
//爬取头条前端资讯
router.get('/crawler', function (req, res, next) {
  var delateSql = $sql.news.delate;
  pool.query(delateSql, function (error, results, fields) {
    if (error) throw error;
    return
  })
  for (var i = 1; i < 10; i++) {
    request(`https://toutiao.io/subjects/11907?f=new&page=${i}`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        var items = [];
        $('.post').each(function (idx, element) {
          var $element = $(element)
          var $author = $element.find('.meta').text().trim();
          var $title = $element.find('.title>a').text().trim().replace(/\【[^\)]*\】/g, '');
          var $href = 'https://toutiao.io' + $element.find('.title>a').attr('href');
          var $number = $element.find('.like-button>span').text();
          var $favorite_num = $element.find('.favorite-button>span').text();
          var createTime = new Date();
          var sql = $sql.news.addNews;
          pool.query(sql, [$title, $href, $author, $number, $favorite_num, createTime], function (error, results, fields) {
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
  var num = 8; //一页条数
  let searchNews = $sql.upvote.search;
  if (req.body.page) {
    current_page = parseInt(req.body.page);
  }
  var last_page = current_page - 1;
  if (current_page <= 1) {
    last_page = 1;
  }
  var str = `SELECT * FROM news LIMIT  ${num * (current_page - 1)},${num}`;
  var nbSql = $sql.news.searchNews
  pool.query(nbSql, [req.body.userId, req.body.userId, num * (current_page - 1), num], (error, results, fields) => {
    if (error) throw error;
    if (results) { res.send({ resultCode: "0", resultText: "success", newsList: jsonback(results) }); }
  });
  // pool.query(str, (error, results, fields) => {
  //   if (error) throw error;
  //   if (results) {
  //     var newsList = [];
  //     var newsList1 = jsonback(results);
  //     async.map(newsList1, (item, callback) => {
  //       pool.query(searchNews, [item.newsId], (err, res) => {
  //         if (err) throw err;
  //         let val = jsonback(res);
  //         if (val.length == 0) {
  //           item.isupvote = 0;
  //           item.isfavorite = 0;
  //         } else {
  //           item.isupvote = 1;
  //           item.isfavorite = 1;
  //         }
  //         callback(null, item);
  //       })
  //     }, (err, results) => {
  //       if (err) throw err;
  //       res.send({ resultCode: "0", resultText: "success", newsList: results });
  //     })
  //   }
  // });


});
router.use('/count', (req, res) => {
  const data_count = 'SELECT COUNT(*) as total FROM news'
  pool.query(data_count, function (error, results, fields) {
    if (error) throw error;
    // console.log(fields);
    res.json(results);
  })
})
//请求代理
router.use('/url', (req, res) => {
  request('https://toutiao.io/k/6pvafa', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);
    }
  })
});
module.exports = router;
