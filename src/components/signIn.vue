<template>
    <div class="signIn">
        <!-- <mt-header fixed title="登录"></mt-header> -->
        <div class="content">
            <!-- <mt-field label="用户名" placeholder="请输入用户名" v-model="username" class="home-title"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
            <mt-button @click.native="handleClick" size="large" type="primary">登录</mt-button> -->
            <input type="file" value="上传" @change='upload' />
        </div>
    </div>
</template>
<script>
import { Toast, MessageBox } from 'mint-ui'
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
        upload(el) {
            console.log(el.target.files[0])
            var fd = new FormData();
            fd.append('file', el.target.files[0]);
            axios({
                method: 'post',
                url: 'api/user/upload',
                data: fd,
                timeout: 3000
            }).then
        },
        handleClick: function () {
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
                }).then(function (res) {
                    console.log(res.data)
                    let data = res.data;
                    if (data.resultCode == '0') {
                        window.localStorage.setItem('username', userName);
                        window.localStorage.setItem('userId', data.userId);
                        Toast({
                            message: '登陆成功',
                            duration: 1000
                        })
                        self.$router.push('/newsList')
                    } else {
                        MessageBox.confirm('您还未注册?去注册').then(action => { self.$router.push('/signUp') });
                    }

                })
            }
        }
    }
}

</script>
<style scoped>
.content {
}
.home-title {
    margin-top: 30%;
}
</style>
