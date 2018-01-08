<template>
  <div class="xyd-header">
    <div class="xyd-header-left" v-if="leftOptions.showBack">
      <a v-if="leftOptions.backText" class="xyd-header-back" @click.preventDefault :transition="transition" @click="onClickBack">{{leftOptions.backText}}</a>
      <div class="left-arrow" @click="onClickBack" :transition="transition">
        <i class="gcicon gcicon-left-arrow"></i>
      </div>
      <slot name="left"></slot>
    </div>
    <h1 class="xyd-header-title" @click="$emit('on-click-title')"><span v-show="title" :transition="transition">{{title}}</span><slot></slot></h1>
    <div class="xyd-header-right" v-if="rightOptions.showBtn" @click="onClickRight">
      <i v-if="rightOptions.btnIcon" :class="rightOptions.btnIcon" aria-hidden="true"></i>
      <div>{{rightOptions.btnText}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leftOptions: {
      type: Object,
      default () {
        return {
          showBack: true,
          backText: 'Back',
          preventGoBack: false
        }
      }
    },
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default () {
        return {
          showBtn: false,
          btnIcon: '',
          btnText: 'OK'
        }
      }
    }
  },
  methods: {
    onClickBack () {
      if (this.leftOptions.preventGoBack) {
        this.$emit('on-click-back')
      } else {
        this.$router ? this.$router.back() : window.history.back()
      }
    },
    onClickRight () {
      this.$emit('on-click-right')
    }
  }
}
</script>

<style scope>
.xyd-header {
  height: 50px;
  position: relative;
  box-sizing: border-box;
  background-color: #1E2B3F;
}
.xyd-header .xyd-header-title, .xyd-header h1 {
  margin: 0 88px;
  height: 50px;
  line-height: 50px;
  color: #BDC6D5;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 300;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.xyd-header .xyd-header-title > span {
  display: inline-block;
}
.xyd-header .xyd-header-left, .xyd-header .xyd-header-right {
  position: absolute;
  height: 100%;
  display: block;
  font-size: 14px;
  color: #BFC8D8;
}
.xyd-header .xyd-header-left a,.xyd-header .xyd-header-left button,.xyd-header .xyd-header-right a,.xyd-header .xyd-header-right button {
  float: left;
  height: 100%;
  line-height: 50px;
  margin-right: 8px;
  color: #BFC8D8;
}
.xyd-header .xyd-header-left a:active,.xyd-header .xyd-header-left button:active,.xyd-header .xyd-header-right a:active,.xyd-header .xyd-header-right button:active {
  opacity: .5
}
.xyd-header .xyd-header-left {
  top: 0px;
  left: 0px;
}
.xyd-header .xyd-header-left .xyd-header-back {
  padding-left: 20px
}
.xyd-header .xyd-header-left .left-arrow {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 1rem;
  left: 10px;
}
.xyd-header .xyd-header-left .left-arrow > i {
  font-size: 1.5rem;
}
.xyd-header .xyd-header-right {
  top: 0px;
  right: 0px;
  width: 80px;
  height: 50px;
  padding-right: 35px;
  text-align: center;
  box-sizing: border-box;
  text-decoration: none !important;
  color: #1E2B40 !important;
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 50px;
  text-align: center;
  background: #FDD059;
}
.xyd-header .xyd-header-right:active {
  background-color: #DCB856;
}
.xyd-header .xyd-header-right > div {
  position: absolute;
  top: 0px;
  right: 10px;
  z-index: 0;
}
.xyd-header .xyd-header-right > i {
  font-size: 25px;
  line-height: 50px;
}
.xyd-header .xyd-header-right .xyd-header-more:after {
  content: "\2022\0020\2022\0020\2022\0020";
  font-size: 16px;
}
.xyd-header-fade-in-right-enter {
  animation: fadeinR .5s;
}
.xyd-header-fade-in-left-enter {
  animation: fadeinL .5s;
}
@keyframes fadeinR {
  0% {
    opacity: 0;
    transform: translateX(80px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes fadeinL {
  0% {
    opacity: 0;
    transform: translateX(-80px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
