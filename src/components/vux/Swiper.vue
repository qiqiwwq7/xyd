<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div v-for="(item, index) in list" :key="index" :class="slideIndex == index ? 'swiper-slide slide-selected' : 'swiper-slide'" @click="onItemClick($event, item, index)">
        <div class="flex-box" v-if="item.attachmentUrl && item.attachmentUrl.length > 0">
          <img :src="getResizeUrl(item)" :width="getCssWidth(item)" :height="getCssHeight(item)">
        </div>
        <div v-if="item.tag == 1" class="video">
          <i class="gcicon gcicon-play" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>
    <!-- Add Arrows -->
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.min.css'
  import 'swiper/dist/js/swiper.min.js'

  export default {
    props: {
      list: Array
    },
    data () {
      return {
        swiper: undefined,
        slideIndex: 0,
        scale: 200
      }
    },
    created () {
      this.$nextTick(() => {//dom渲染之后执行
        this.swiper = new Swiper('.swiper-container', {
          slidesPerView: 5,
          paginationClickable: true,
          centeredSlides: true,
          followFinger: false,
          onlyExternal: true
        })
      })
    },
    destroyed () {
      this.swiper.destroy()
    },
    methods: {
      getScaleSize (numerator, denominator) {
        return parseInt(numerator / denominator * this.scale)
      },
      getResizeUrl (item) {
        let w = parseInt(item.attachmentWidth)
        let h = parseInt(item.attachmentHeight)
        if (w > 0 && h > 0) {
          return this.$common.Oss.imageResize(this.$common.Oss.getCdnUrl(item.bucket, item.attachmentUrl), this.getScaleSize(w, w + h), this.getScaleSize(h, w + h))
        } else {
          return this.$common.Oss.getCdnUrl(item.bucket, item.attachmentUrl)
        }
      },
      getCssWidth (item) {
        let w = parseInt(item.attachmentWidth)
        let h = parseInt(item.attachmentHeight)
        if (w > 0 && h > 0) {
          if (w > h) {
            return '100%'
          } else {
            return 'auto'
          }
        }
        return '100%'
      },
      getCssHeight (item) {
        let w = parseInt(item.attachmentWidth)
        let h = parseInt(item.attachmentHeight)
        if (w > 0 && h > 0) {
          if (h > w) {
            return '100%'
          } else {
            return 'auto'
          }
        }
        return '100%'
      },
      onItemClick (e, item, index) {
        this.swiper.slideTo(index)
        this.slideIndex = index
        this.$emit('on-item-click', e, item, index)
      }
    }
  }
</script>

<style scoped>
.swiper-container {
  width: 100%;
  height: auto;
}
.swiper-wrapper {
  height: 120px;
  align-items: center;
}
.swiper-slide {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 5px;
  background-color: #000;
  text-align: center;
  line-height: 0px;
}
.swiper-slide.slide-selected {
  border: 5px #FDD059 solid;
}
.swiper-slide .flex-box {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.swiper-slide .video {
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 35px;
}
.swiper-slide .video > i {
  font-size: 35px;
  color: #FFF;
}
.swiper-button-prev {
  display: none;
}
.swiper-button-next {
  display: none;
}
</style>
