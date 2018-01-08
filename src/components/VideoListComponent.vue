<template>
  <div class="video">
    <div class="video-media" v-for="(item, index) in videos" :key="index">
      <div class="video-media-box">
        <div class="flex-box">
          <img class="play-o" src="../assets/images/play-o.png" @click="onPlay(item)">
          <img v-if="item.attachmentUrl.length > 0" :src="getResizeUrl(item)" width="auto" height="100%">
        </div>
        <router-link @click.native="onLink(item)" :to="'/note/' + item.noteId + '/'">
          <div class="avatar-box">
            <div class="avatar-text">
              <span :style="item.visited ? 'color: #a1a2a3;' : ''">{{item.content | decode}}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      videos: Array
    },
    data () {
      return {
        scale: 200
      }
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
      onLink (item) {
        item.visited = true
      },
      onPlay (item) {
        this.$video.show({
          sources: [{
            type: 'video/ogg',
            src: item.videoUrl
          },{
            type: 'video/mp4',
            src: item.videoUrl
          },{
            type: 'video/webm',
            src: item.videoUrl
          }]
        })
      }
    }
  }
</script>

<style scoped>
.video {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  box-sizing: border-box;
}
.video-media {
  width: 50%;
  padding: 5px;
  box-sizing: border-box;
}
.video-media-box {
  margin: 0px;
  border: 1px #1D2D3E solid;
  background-color: #141A23;
}
.video-media-box .flex-box {
  display: flex;
  width: 100%;
  height: 100px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #0E1319;
  position: relative;
}
.video-media-box .flex-box .play-o {
  color: #FFF;
  font-size: 50px;
  z-index: 1;
  position: absolute;
  width: 50px;
  height: 50px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.video-media-box .avatar-box {
  width: 100%;
  display: flex;
  padding: 5px 10px 5px 10px;
  box-sizing: border-box;
}
.video-media-box .avatar-box .avatar-text {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #E6ECF5;
  white-space: nowrap;
  word-wrap: normal;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
