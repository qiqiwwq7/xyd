<template>
  <div v-show="sources && sources.length > 0" class="video-dialog">
    <div class="video-exit" @click="onExit">
      <i class="gcicon gcicon-video-close" aria-hidden="true"></i>
    </div>
    <div style="width: 100%; height: 100%; margin: auto;" ref="videobox">
      <video class="video-js vjs-default-skin vjs-big-play-centered" playsinline="true" webkit-playsinline="true"></video>
    </div>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import videojs from 'video.js/dist/video'

  export default {
    props: {
      sources: Array
    },
    data () {
      return {
        userAgent: {
          isIOS: /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
        }
      }
    },
    methods: {
      initialize(sources) {
        this.player = videojs(this.$refs.videobox.children[0], {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
          autoplay: true,
          controls: true,
          preload: 'auto',
          sources: sources,
          controlBar: {
            remainingTimeDisplay: false,
            playToggle: {},
            progressControl: {},
            fullscreenToggle: {},
            volumeMenuButton: {
              inline: false,
              vertical: true
            }
          },
          techOrder: ['html5', 'flash'],
          playbackRates: []
        })
        if (!this.userAgent.isIOS) {
          this.player.addClass('video-controls-hide')
        }
      },
      dispose() {
        if (this.player && videojs) {
          this.player.pause && this.player.pause()
          videojs(this.$refs.videobox.children[0]).dispose()
          if (this.$refs.videobox.children.length == 0) {
            var video = document.createElement('video')
            video.className = "video-js vjs-default-skin vjs-big-play-centered"
            video.setAttribute("playsinline", "true")
            video.setAttribute("webkit-playsinline", "true")
            this.$refs.videobox.appendChild(video)
          }
          this.player = null
        }
      },
      onExit () {
        this.$emit('on-exit')
      }
    },
    watch: {
      sources (val) {
        if (val && val.length > 0) {
          if (!this.player) {
            this.initialize(val)
          }
        } else {
          this.dispose()
        }
      }
    }
  }
</script>

<style scoped>
.video-dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2000;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
}
.video-dialog .video-exit {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 9999;
  background-color: #000;
  line-height: 0px;
}
.video-dialog .video-exit > i {
  color: #FFF;
  font-size: 25px;
}
.video-js {
  width: 100%;
  height: 100%;
}
.video-js .vjs-tech {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
.video-controls-hide video::-webkit-media-controls {
  display:none !important;
}
.video-controls-hide video::-webkit-media-controls-enclosure {
  display:none !important;
}
</style>
