var login_name = 'zygg'
// sql语句
var sqlMap = {
  // 用户
  user: {
    add: 'insert into user_info(username, pwd,create_time) values (?,?,?)',
    check: "select * from user_info where username=?",
    signIn: "select * from user_info where username=? and pwd=?",
    upvote: "insert into user_news (newsId,userId,type) values (?,?,?)",
    favorite: "insert into user_news (newsId,userId,type) values (?,?,?)",
  },
  upvote: {
    searchOne: 'select news.upvote from news  limit ?,?',
    searchAll: 'select news.upvote from news where newsId=? limit ?,?'
  },
  diary: {
    written: 'insert into diary_board(diary_list, author, date) values (?,?,?)',
    search_myself: "select * from diary_board where author='" + login_name + "'",
    search_all: 'select * from diary_board'
  },
  comment: {
    written: 'insert into comment(userid, msg_id, comment_message, create_time) values (?,?,?,?)',
    search: 'select userid, msg_id, comment_message, create_time from comment'
  },
  news: {
    addNews: 'insert into news(title, href,author,upvote,favorite,createTime) values (?,?,?,?,?,?)',
    searchNews: "select a.* , case when ( select  userNewsId from user_news b where userId=? and a.newsId = b.newsId and type=1 ) >0 then 1 else 0 end as isupvote,case when ( select  userNewsId from user_news b where userId = ? and a.newsId = b.newsId and type=0)>0 then 1 else 0 end as isFavorite from news a limit ?,?",
    delate: 'truncate table news',
    upvote: 'update news set upvote=upvote+1 where newsId=?',
    favorite: 'update news set favorite=favorite+1 where newsId=?',
  }
}
module.exports = sqlMap;
