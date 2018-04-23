<template>
  <div class="hello">
    <mt-header fixed title="注册"></mt-header>
    <div class="content">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username" class="home-title"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
      <mt-field label="密码" placeholder="请再次输入密码" type="password" v-model="repwd"></mt-field>
      <mt-button @click.native="handleClick" size="large" type="primary">注册</mt-button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import axios from "axios";
export default {
  name: 'HelloWorld',
  data() {
    return {
      username: '',
      errinfo: '',
      password: '',
      repwd: ''
    }
  },
  mounted: function() {

  },
  methods: {
    handleClick: function() {
      var userName = this.username;
      var passWord = this.password;
      var repwd = this.repwd;
      var createTime = new Date();
      var self = this;
      if (userName == '' || passWord == '' || repwd == '') {
        Toast({
          message: '信息不完整',
          duration: 1000
        });
        this.classFade = ''
      } else if (passWord != repwd) {
        Toast({
          message: '两次输入密码不一致',
          duration: 1000
        });
        this.classFade = ''
      } else {
        axios({
          method: 'get',
          url: 'api/user/searchUser',
          data: {
            username: userName,
            pwd: passWord
          },
          timeout: 3000
        }).then(function(response) {
          var i;
          var flag = "noExist";
          for (i in response.data) {
            if (userName == response.data[i].user_name) {
              flag = 'Exist';
            }
          }
          if (flag == 'Exist') {
            Toast({
              message: '用戶名已被註冊',
              duration: 1000
            });
            self.classFade = ''
          } else if (flag == 'noExist') {
            axios({
              method: 'post',
              url: 'api/user/addUser',
              data: {
                userName: userName,
                passWord: passWord,
                createTime: createTime
              },
              timeout: 3000
            }).then(function(response) {
              if (response.status == 200) {
                self.classFade = '';
                let instance = Toast(`'註冊成功，歡迎妳，' ${userName} '`);
                setTimeout(() => {
                  instance.close();
                }, 2000);
                self.$router.push('/signIn')
                console.log(self.errinfo)
              } else {
                Toast({
                  message: '註冊失敗，未知的錯誤',
                  duration: 1000
                });
              }
            })
          }
        })
      }


    }
  }
}

</script>
<style scoped>
.content {}
.home-title {
  margin-top: 30%
}

</style>
