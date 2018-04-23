import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import signUp from '@/components/signUp'
import signIn from '@/components/signIn'
import Home from '@/components/home'
import news from '@/components/component/homeView'
import no from '@/components/component/noView'
import imgs from '@/components/component/imgView'
import me from '@/components/component/meView'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // { path: "*", redirect: '/signIn' },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: signUp
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn
    },
    { path: '/news', component: news, name: '头条', },
    { path: '/no', component: no, name: '待定', },
    { path: '/imgs', component: imgs, name: '美图', },
    { path: '/me', component: me, name: '我', },
    {
      path: '/home',
      name: 'Home',
      component: Home,
    }
  ]
})
