<template>
  <div class="newsList" ref="outer">
    <div v-if="listShow">
      <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="60">
        <li v-for="(item,index) in news" key='index'>
          <!-- <a :href="item.href" @click="golink">{{item.title}}</a> -->
          <a href="javascript:0" @click="golink(item.href)">{{item.title}}</a>
          <div class="bottom_view">
            <div class="upvote">
              <span>{{item.upvote}}</span>
              <svg class="icon icon-upvote" aria-hidden="true">
                <use xlink:href="#icon-praise"></use>
              </svg>
            </div>
            <div class="upvote">
              <span>{{item.favorite}}</span>
              <svg class="icon" aria-hidden="true">
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
export default {
  name: 'newsList',
  data() {
    return {
      listShow: true,
      detailNews: false,
      page: 1,
      loading: false,
      show: false,
      url: '',
      news: '',
      showbeck: '',
      allLoaded: false
    }
  },
  props: {
    beac: Boolean
  },
  mounted: function() {
    let vm = this;
    axios({
      method: 'post',
      url: 'api/user/findNews',
      data: {
        page: vm.page,
      }
    }).then(function(res) {
      vm.news = res.data;
      console.log(res.data)
    });
  },
  methods: {
    golink: function(el) {
      window.open(el, '_block');
    },
    loadMore: function() {
      this.page = this.page + 1;
      var vm = this;
      this.loading = true;
      vm.show = true;
      axios({
        method: 'post',
        url: 'api/user/findNews',
        data: {
          page: vm.page,
        }
      }).then(function(res) {
        var data = res.data;
        console.log(data);
        if (data != "") {
          data.forEach(function(val, index, arr) {
            vm.news.push(val);
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

</style>
