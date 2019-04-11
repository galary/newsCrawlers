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
import { Toast } from 'mint-ui';
import moment from 'moment';
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
    mounted: function () {

    },
    methods: {
        handleClick: function () {
            var userName = this.username;
            var passWord = this.password;
            var repwd = this.repwd;
            var createTime = new Date().getTime();
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
                    method: 'post',
                    url: 'api/user/searchUser',
                    data: {
                        username: userName,
                        pwd: passWord
                    },
                    timeout: 3000
                }).then((res) => {
                    console.log(res.data);
                    if (res.data.resultCode == '0') {
                        if (res.data.data.register) {
                            this.addUser(userName, passWord, createTime);
                        } else {
                            Toast({
                                message: '该用户已注册',
                                duration: 1000
                            });
                        }
                    }
                })
            }
        },
        addUser(userName, passWord, createTime) {
            axios({
                method: 'post',
                url: 'api/user/addUser',
                data: {
                    username: userName,
                    pwd: passWord,
                    createTime: createTime
                },
                timeout: 3000
            }).then((res) => {
                if (res.data.data.adduser) {
                    Toast({
                        message: '两次输入密码不一致',
                        duration: 1000
                    })
                    this.$router.push({ path: '/signIn' })
                }
            })
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
