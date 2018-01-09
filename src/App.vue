<template>
  <div id="app" style="height: 100%;" :class="rootClass">
    <!-- <link rel="stylesheet" :href="href"> -->
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <flexbox :gutter="0" :align="'flex-start'" style="height: 100%;">
      <flexbox-item v-if="currentCategories && currentCategories.length > 1" id="app-left-box" style="flex: 0 0 50px;">
        <nav-component :categories="currentCategories"></nav-component>
      </flexbox-item>
      <flexbox-item id="app-center-box">
        <transition :name="'fade'">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import { Flexbox, FlexboxItem, Loading, TransferDomDirective as TransferDom } from 'vux'
  import { mapGetters } from 'vuex'
  import NavComponent from 'components/NavComponent.vue'
  import Util from 'libs/util'

  export default {
    name: 'app',
    data () {
      return {
        rootClass: 'app-primary'
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Flexbox,
      FlexboxItem,
      Loading,
      NavComponent
    },
    computed: {
      ...mapGetters([
        'currentCategories',
        'loading'
      ])
    }
    // ,
    // created () {
    //   console.log('()*&*&*&*')
    //   Util.ajax.get('https://www.easy-mock.com/mock/59b4de00e0dc663341a3d8e4/example//luntan/color').then((response) =>{
    //     this.rootClass = response.data.data.color
    //   })
    // }
  }
</script>

<style lang="less">
  @import 'assets/less/use.less';
  // .vux-flexbox .vux-flexbox-item {
  //   height: 100%;
  //   position: relative;
  // }
  // .vux-loading .weui-toast {
  //   top: 50%;
  //   left: 50%;
  //   -webkit-transform: translate(-50%, -50%);
  //   transform: translate(-50%, -50%);
  //   background: rgba(39, 61, 98, .9);
  // }
  // .vux-toast .weui-toast {
  //   top: 50%;
  //   left: 50%;
  //   -webkit-transform: translate(-50%, -50%);
  //   transform: translate(-50%, -50%);
  //   background: rgba(39, 61, 98, .9);
  // }
  // .vux-toast .weui-toast .weui-toast__content {
  //   font-size: 1.1rem;
  // }
  // .vux-x-dialog .weui-dialog {
  //   background: rgba(39, 61, 98, 1);
  //   color: #E6ECF5;
  // }
  // .vux-x-dialog .weui-dialog .weui-dialog__ft {
  //   line-height: 45px;
  //   font-size: 1.1rem;
  // }
  // .vux-x-dialog .weui-dialog .weui-dialog__title {
  //   font-weight: 400;
  //   font-size: 1.1rem;
  // }
  // .vux-x-dialog .weui-dialog .weui-dialog__btn {
  //   font-weight: 400;
  // }
  // .vux-x-dialog .weui-dialog .weui-dialog__btn:active {
  //   background-color: #FDD059;
  //   color: #1E2B40;
  // }
  // .vux-x-dialog .weui-dialog .weui-dialog__btn_default {
  //   color: #E6ECF5;
  // }
  // .vux-x-dialog .weui-dialog .weui-dialog__btn_primary {
  //   color: #E6ECF5;
  // }

  // .fade-enter-active {
  //   transition: opacity .5s
  // }
  // .fade-enter {
  //   opacity: 0
  // }

  // .table {
  //   display: table;
  //   table-layout: fixed;
  // }
  // .table .table-row {
  //   display: table-row;
  // }
  // .table .table-row .table-cell {
  //   display: table-cell;
  // }

  // .ellipsis {
  //   white-space: nowrap;
  //   word-wrap: normal;
  //   word-wrap: break-word;
  //   word-break: break-all;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  // }

  // input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  //   color: #586B85;
  // }
  // input:-moz-placeholder, textarea:-moz-placeholder {
  //   color: #586B85;
  // }
</style>
