<template>
  <div class="signIn" v-model='selected' @click='goto'>
    <mt-tabbar fixed class='tabbar'>
      <mt-tab-item id="news">
        <img slot="icon" src="../../assets/img/db.jpg"> 头条
      </mt-tab-item>
      <mt-tab-item id="imgs">
        <img slot="icon" src="../../assets/img/db.jpg"> 美图
      </mt-tab-item>
      <mt-tab-item id="no">
        <img slot="icon" src="../../assets/img/db.jpg"> 待定
      </mt-tab-item>
      <mt-tab-item id="me">
        <img slot="icon" src="../../assets/img/db.jpg"> 我
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: 'footer',
  data() {
    return {
      selected: 'news'
    }
  },
  mounted: function() {
    // console.log(this.selected)
  },
  methods: {
    goto: function() {
      this.$emit('getData', this.selected);
      console.log(this.selected)
    }
  }
}

</script>
<style scoped>
.tabbar {
  z-index: 100
}

</style>
