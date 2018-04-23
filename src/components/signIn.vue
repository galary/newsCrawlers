<template>
  <div class="signIn">
    <mt-header fixed title="登录"></mt-header>
    <div class="content">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username" class="home-title"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
      <mt-button @click.native="handleClick" size="large" type="primary">登录</mt-button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import axios from "axios";
export default {
  name: 'signIn',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleClick: function() {
      var userName = this.username;
      var passWord = this.password;
      var self = this;
      if (userName != '' && passWord != '') {
        axios({
          method: 'post',
          url: 'api/user/signIn',
          data: {
            userName: userName,
            passWord: passWord
          },
          timeout: 3000
        }).then(function(res) {
          console.log(res.data)
          let data = res.data;
          if (data.status == 1) {
            if (data.results[0].user_name == userName && data.results[0].user_pwd == passWord) {
              Toast({
                message: '登陆成功',
                iconClass: 'icon icon-success',
                duration: 1000
              });
              self.$router.push('/home')
            } else {
              Toast({
                message: '用户名或者密码错误',
                duration: 1000
              });
            }

          } else {
            Toast({
              message: '您还未注册？请注册',
              duration: 1000
            });
            self.$router.push('/signUp')
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
