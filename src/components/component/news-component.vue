<template>
    <div class="newsList" ref="outer">
        <mt-header fixed title="前端头条"></mt-header>
        <div v-if="listShow" class="newsView">
            <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="60">
                <li v-for="(item,index) in news" :key='index'>
                    <!-- <a :href="item.href" @click="golink">{{item.title}}</a> -->
                    <a href="javascript:0" @click="golink(item.href)">{{item.title}}</a>
                    <div class="bottom_view">
                        <div class="upvote">
                            <span>{{item.upvote}}</span>
                            <svg class="icon icon-upvote " v-if="item.isupvote==1" :class="{'red':item.isupvote==1}" aria-hidden="true" @click="Fabuloused(item.newsId)">
                                <use xlink:href="#icon-praise"></use>
                            </svg>
                            <svg class="icon icon-upvote " v-if="item.isupvote==0" aria-hidden="true" @click="Fabulous(item.newsId)">
                                <use xlink:href="#icon-praise"></use>
                            </svg>
                        </div>
                        <div class="upvote">
                            <span>{{item.favorite}}</span>
                            <svg class="icon" aria-hidden="true" @click="favorite(item.newsId)" v-if="item.isFavorite==1" :class="{'red':item.isupvote==1}">
                                <use xlink:href="#icon-shoucang"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" @click="favorited(item.newsId)" v-if="item.isFavorite==0">
                                <use xlink:href="#icon-shoucang"></use>
                            </svg>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="show" class="loading">
                <mt-spinner type="triple-bounce" :size="60" color="#26a2ff"></mt-spinner>
            </div>
            <div v-show="allLoaded" class="loading"><span>已全部加载</span></div>
        </div>
        <!--  <div v-show="detailNews">
      <iframe frameborder="1" width="400" height="400" :src="{url}" scrolling="no" id="myiframe"></iframe>
    </div> -->
    </div>
</template>
<script>
import axios from "axios";
import iconfont from "../../assets/js/iconfont.js";
import { Toast, MessageBox } from 'mint-ui'
export default {
    name: 'newsList',
    data() {
        return {
            flag: true,
            listShow: true,
            detailNews: false,
            page: 0,
            loading: false,
            show: false,
            url: '',
            news: [],
            upvoteList: [],
            favoriteList: [],
            showbeck: '',
            allLoaded: false,
            upvoted: [],
            favorited: []
        }
    },
    props: {
        beac: Boolean
    },
    mounted() {
        // let vm = this;
        // axios({
        //     method: 'post',
        //     url: 'api/user/findNews',
        //     data: {
        //         page: vm.page,
        //     }
        // }).then(function (res) {
        //     vm.news = res.data;
        // });
    },
    methods: {
        golink: function (el) {
            window.open(el, '_block');
        },
        Fabuloused(val) {//已经点赞
            Toast({
                message: '您已经点赞了',
                duration: 1000
            })
        },
        favorited(val) {//已经收藏
            Toast({
                message: '您已经收藏了',
                duration: 1000
            })
        },
        favorite(val) {//收藏
            axios({
                method: 'post',
                url: 'api/user/favorite',
                data: {
                    newsId: val,
                    userId: window.localStorage.getItem("userId")
                }
            }).then(() => {

            })
        },
        Fabulous(val) {//点赞
            axios({
                method: 'post',
                url: 'api/user/upvote',
                data: {
                    newsId: val,
                    userId: window.localStorage.getItem("userId"),
                }
            }).then((res) => {
                let data = res.data;
                if (data.resultCode == '0') {

                }
                console.log(data);
            })
        },
        loadMore: function () {
            this.page = this.page + 1;
            var vm = this;
            this.loading = true;
            vm.show = true;
            axios({
                method: 'post',
                url: 'api/user/findNews',
                data: {
                    page: vm.page,
                    userId: window.localStorage.getItem("userId"),
                    username: window.localStorage.getItem("username")
                }
            }).then(function (res) {
                var data = res.data;
                console.log(data.newsList);
                if (data.resultCode == "0") {
                    data.newsList.forEach((val, index) => {
                        vm.news.push(val);
                        vm.upvoted.push(val.upvote);
                        vm.favorited.push(val.favorite);
                        vm.show = false;
                        vm.loading = false;
                    })
                } else {
                    vm.show = false;
                    vm.allLoaded = true;
                    vm.loading = true;
                }
            })
        }
    }
}

</script>
<style scoped>
.loading {
    text-align: center;
    margin-top: 20px;
}

.newsView {
    margin-top: 40px;
}
.upvote {
    width: 100%;
    height: 100%;
    padding: 5px 0;
    font-size: 1.1em;
    text-align: center;
}
.icon {
    width: 1.1em;
    color: #777;
    height: 1.1em;

    vertical-align: -0.15em;

    fill: currentColor;

    overflow: hidden;
}
.icon-upvote {
    vertical-align: -0.05em;
}
ul li {
    display: block;
    padding: 10px 15px 0px;
    list-style: none;
    line-height: 1.5em;
    border: 1px solid #ccc;
}
ul li a {
    color: #333;
    font-size: 1.2em;
    padding: 5px 0;
    text-decoration: none;
    outline: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
a:visited {
    background-color: #fff;
}
.bottom_view {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}
.red {
    color: red;
}
</style>
