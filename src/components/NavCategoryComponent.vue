<template>
  <div class="nav-category">
    <scroller lock-y :class="rightBtn && showRightBtn ? 'scroller m-r-80' : 'scroller'">
      <div class="category">
        <a href="javascript:void(0)" v-for="(category, index) in categories" :key="index" :class="getActiveClass(category)" @click="onItemClick(category)">{{category.name}}</a>
      </div>
      <div class="clearfix"></div>
    </scroller>
    <div v-if="rightBtn" v-show="showRightBtn" class="post" @click="onPost()">
      <i :class="rightBtn.icon" aria-hidden="true"></i>
      <div>{{rightBtn.text}}</div>
    </div>
  </div>
</template>

<script>
  import {Tab, TabItem, Scroller} from 'vux'
  import InputFile from 'components/vux/InputFile'

  export default {
    components: {
      Tab,
      TabItem,
      Scroller,
      InputFile
    },
    props: {
      rightBtn: Object
    },
    data () {
      return {
        showRightBtn: false,
        categories: []
      }
    },
    created () {
      if (this.$store.getters.currentCategories != null) {
        for (let currentCategory of this.$store.getters.currentCategories) {
          if (this.$route.path.startsWith(currentCategory.url) && currentCategory.children && currentCategory.children.length > 0) {
            for (let child of currentCategory.children) {
              this.categories.push(child)
            }
            break
          }
        }
      }
      if (this.rightBtnRegex.test(this.$route.fullPath)) {
        this.showRightBtn = true
      }
    },
    methods: {
      getActiveClass (category) {
        return this.$route.path.startsWith(category.fullUrl) ? 'active' : ''
      },
      onItemClick (category) {
        this.$router.push(category.fullUrl)
      },
      onPost () {
        this.$router.push('/note/post')
      }
    },
    computed: {
      rightBtnRegex () {
        return new RegExp('(\\w)+(/(recents|weekhots|replies|category)/)(\\d)+$')
      }
    },
    watch: {
      '$route' (to, from) {
        if (this.rightBtnRegex.test(this.$route.fullPath)) {
          this.showRightBtn = true
        } else {
          this.showRightBtn = false
        }
      }
    }
  }
</script>

<style scoped>
  .nav-category {
    position: relative;
    overflow: hidden;
  }
  .nav-category .scroller {
    background-color: #1E2B3F;
  }
  .nav-category .scroller.m-r-80 {
    margin-right: 80px;
  }
  .category {
    float: left;
    height: 50px;
    white-space: nowrap;
  }
  .clearfix {
    clear: both;
  }
  .category > a {
    display: inline-block;
    color: #A3CDDC;
    font-size: 1.1rem;
    padding: 0px 20px;
    height: 50px;
    line-height: 50px;
  }
  .category > a.active, .category > a:active {
    color: #EAC56B;
    background-color: #2E3D52;
    border-bottom: 2px #EAC56B solid;
    box-sizing: border-box;
  }
  .post {
    width: 80px;
    height: 100%;
    padding-right: 35px;
    position: absolute;
    top: 0px;
    right: 0px;
    text-align: center;
    box-sizing: border-box;
    text-decoration: none !important;
    color: #1E2B40 !important;
    font-size: 1.1rem;
    font-weight: 400;
    background-color: #FDD059;
    cursor: pointer;
    user-select: none;
  }
  .post:active {
    background-color: #DCB856;
  }
  .post > div {
    position: absolute;
    top: 13px;
    right: 10px;
    z-index: 0;
  }
  .post > i {
    font-size: 25px;
    line-height: 50px;
  }
</style>
