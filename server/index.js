const userApi = require('./user.js');
const newsApi = require('./news.js');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
var os = require("os");
const app = express();
var iconv = require('iconv-lite')
fs.readFile('./static/xx.txt', function (err, data) {
  if (err) {
    return console.error(err);
  }
  let val = iconv.decode(data, 'gbk');
  fs.writeFile('./static/ww.txt', val, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("数据写入成功！");
  });
});
app.use('/public', express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 后端api路由
app.use('/api/user', userApi);
app.use('/api/news', newsApi);

// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');
