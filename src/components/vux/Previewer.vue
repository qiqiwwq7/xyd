<template>
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp vux-previewer" tabindex="-1" role="dialog" aria-hidden="true">
      <img v-show="isVideo" class="play-o" src="../../assets/images/play-o.png" @click="play">
      <!-- Background of PhotoSwipe.
           It's a separate element as animating opacity is faster than rgba(). -->
      <div class="pswp__bg"></div>
      <!-- Slides wrapper with overflow:hidden. -->
      <div class="pswp__scroll-wrap">
        <!-- Container that holds slides.
          PhotoSwipe keeps only 3 of them in the DOM to save memory.
          Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>
        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <!--  Controls are self-explanatory. Order can be changed. -->
            <div class="pswp__counter"></div>
            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
            <button class="pswp__button pswp__button--share" title="Share"></button>
            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
            <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
            <!-- element will get class pswp__preloader--active when preloader is running -->
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import UI from 'photoswipe/dist/photoswipe-ui-default'
import objectAssign from 'object-assign'

export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isVideo: false
    }
  },
  methods: {
    init (index) {
      let options = objectAssign({
        history: false,
        shareEl: false,
        tapToClose: false,
        index: index
      }, this.options)
      let scope = this
      this.photoswipe = new PhotoSwipe(this.$el, UI, this.list, options)
      this.photoswipe.init()
      this.photoswipe.listen('afterChange', function() {
        if (this.currItem.videoSrc && this.currItem.videoSrc.length > 0) {
          scope.isVideo = true
        } else {
          scope.isVideo = false
        }
      })
    },
    show (index) {
      this.init(index)
    },
    play () {
      this.$video.show({
        sources: [{
          type: 'video/ogg',
          src: this.photoswipe.currItem.videoSrc
        },{
          type: 'video/mp4',
          src: this.photoswipe.currItem.videoSrc
        },{
          type: 'video/webm',
          src: this.photoswipe.currItem.videoSrc
        }]
      })
    },
    close () {
      this.photoswipe.close()
    }
  }
}
</script>

<style>
@import '~photoswipe/dist/photoswipe.css';
@import '~photoswipe/dist/default-skin/default-skin.css';
</style>

<style scoped>
.vux-previewer .play-o {
  color: #FFF;
  font-size: 80px;
  z-index: 1;
  position: absolute;
  width: 80px;
  height: 80px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
