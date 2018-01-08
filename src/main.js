// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'assets/fonts/css/gcicon.css'

import Vue from 'vue'
import App from 'App'
import Util from './libs/util'

import Vuex from 'vuex'
import states from 'store/states'
import gettters from 'store/getters'
import actions from 'store/actions'
import mutations from 'store/mutations'
Vue.use(Vuex)

import VueRouter from 'vue-router'
import components from 'router/components'
import routes from 'router/routes'
Vue.use(VueRouter)

import CommonPlugin from 'plugins/common'
import InputPlugin from 'plugins/input'
import VideoPlugin from 'plugins/video'
Vue.use(CommonPlugin)
Vue.use(InputPlugin)
Vue.use(VideoPlugin)

//添加Fastclick移除移动端点击延迟
import FastClick from 'fastclick'
FastClick.attach(document.body)

// plugins
import { ConfirmPlugin, ToastPlugin } from 'vux'
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)

// 状态管理
const store = new Vuex.Store({
  state: states,
  getters: gettters,
  mutations: mutations,
  actions: actions
})

// 路由配置
const router = new VueRouter({
  //mode: 'history',
  routes: []
})

new Vue({
  store,
  router,
  render: h => h(App),
  methods: {
    init (callback) {
      let $vue = this

      let topPathRegexp = new RegExp('/(\\w)+/(\\w)+/(\\d)+$')
      router.beforeEach((to, from, next) => {
        if (topPathRegexp.test(to.fullPath)) {
          if (to.fullPath.indexOf('/note') > -1) {
            this.$store.dispatch('setCurrentCategoriesLastPath', {
              '/note': {
                last: to.fullPath
              }
            })
          } else if (to.fullPath.indexOf('/video') > -1) {
            this.$store.dispatch('setCurrentCategoriesLastPath', {
              '/video': {
                last: to.fullPath
              }
            })
          }
        }
        if ($vue.$input.getValue() || $vue.$video.getSources()) {
          //当后退触发时，先收起输入组件或视频组件
          $vue.$input.hide()
          $vue.$video.hide()
        } else {
          $vue.$store.dispatch('setLoading', true)
          next()
        }
      })

      router.afterEach(function (to) {
        $vue.$store.dispatch('setLoading', false)
      })

      Util.ajax.interceptors.response.use((success) => {
  			return success
  		}, (failure) => {
        if (window.navigator.onLine == false) {
          $vue.$vux.toast.show({
            text: '请检查网络连接或尝试刷新<br>╭(╯^╰)╮',
            type: 'text'
          })
          return false
        }
  			if (failure.response.status == 401) {
  				$vue.$router.push('/un-authorized')
  			} else {
  				$vue.$router.push('/error')
        }
  			return Promise.reject(failure)
  		})

      Util.ajax.get('/current/get').then((response) => {
        //组装权限树
        let categoriesTree = []
        let categoriesHash = {}
        let temp = {}
        for (let category of response.data.data.accessCategories) {
          category.selected = false
          temp[category.id] = category
          if (temp[category.parentId] != null) {
            let parent = temp[category.parentId]
            if (!parent.children) {
              parent.children = []
            }
            category.url = parent.url + category.url
            category.fullUrl = category.url.replace('/:id', '/' + category.id)
            if (category.type == '1') {
              parent.children.push(category)
            }
          } else {
            category.fullUrl = category.url.replace('/:id', '/' + category.id)
            if (category.type == '1') {
              categoriesTree.push(category)
            }
          }
          categoriesHash[category.url.replace('/category/:id', '/category/' + category.id)] = {
            category: category,
            last: ''
          }
        }

        this.$store.dispatch('setCurrentUser', {
          userId: response.data.data.userId,
          nickName: response.data.data.nickName,
          bucket: response.data.data.bucket,
          headPhoto: response.data.data.headPhoto
        })
        this.$store.dispatch('setCurrentSnsShortName', response.data.data.snsShortName)
        this.$store.dispatch('setCurrentSnsUserExts', response.data.data.snsUserExts)
        this.$store.dispatch('setCurrentAccessKey', response.data.data.accessKey)
        this.$store.dispatch('setCurrentConfigs', response.data.data.accessConfigs)
        this.$store.dispatch('setCurrentCategories', categoriesTree)
        this.$store.dispatch('setCurrentCategoriesHash', categoriesHash)

        //加载路由
        let categories = this.loadRoutes([], categoriesTree)
        categories.push.apply(categories, routes)
        this.$router.addRoutes(categories)
        if (callback) {
          callback.call(this)
        }
      }).catch((error) => {
        this.$router.addRoutes(routes)
        if (error.response.status == 401) {
          this.$router.push('/un-authorized')
        }
        if (callback) {
          callback.call(this)
        }
      })
    },
    loadRoutes (routes, categories, parent) {
      if (categories && categories.length > 0) {
        for (let i = 0; i < categories.length; i++) {
          let category = categories[i]
          if (i == 0) {
            routes.push({
              path: parent ? parent.url : '/',
              redirect: category.fullUrl
            })
          }
          routes.push({
            path: category.url,
            component: components[category.url],
            children: this.loadRoutes([], category.children, category)
          })
        }
      }
      return routes
    }
  }
}).init(function(){
  this.$mount('#app-box')
})
