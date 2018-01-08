<template>
  <scroller lock-x scrollbar-y use-pullup use-pulldown ref="videoListScroller" :height="(clientHeight - 50) +'px'" @on-pulldown-loading="onPulldown" @on-pullup-loading="onPullup">
    <video-list-component :videos="bodyData.noteVideos"></video-list-component>
  </scroller>
</template>

<script>
  import Util from '../libs/util'
  import Scroller from 'components/vux/ScrollerClick'
  import VideoListComponent from 'components/VideoListComponent'

  export default {
    components: {
      Scroller,
      VideoListComponent
    },
    props: {
      category: Object
    },
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        bodyData: {
          loaded: false,
          noteVideos: [],
          page: {
            pageNo: 1,
            pageSize: 12
          }
        }
      }
    },
    created () {
      if (!this.loaded && this.$route.params.id == this.category.id) {
        this.onPulldown()
        this.loaded = true
      }
      window.addEventListener('orientationchange', function() {
        this.clientHeight = document.documentElement.clientHeight
      }.bind(this))
    },
    activated () {
      this.$nextTick(() => {//dom渲染之后执行
        this.$refs.videoListScroller.reset()
      })
    },
    methods: {
      onPulldown () {
        this.bodyData.noteVideos = []
        this.bodyData.page.pageNo = 1
        this.requestData(function(response){
           this.$nextTick(() => {//dom渲染之后执行
             this.$refs.videoListScroller.donePulldown()
             this.$refs.videoListScroller.reset({
               top: 0
             })
             if (response.data.data.noteVideos.length < this.bodyData.page.pageSize) {
               this.$refs.videoListScroller.disablePullup()
             } else {
               this.$refs.videoListScroller.enablePullup()
             }
           })
        })
      },
      onPullup () {
        this.requestData(function(response){
          this.$nextTick(() => {//dom渲染之后执行
            this.$refs.videoListScroller.donePullup()
            if (response.data.data.noteVideos.length == 0) {
              this.$refs.videoListScroller.disablePullup()
            }
          })
        })
      },
      requestData(callback) {
        if (this.category.id) {
          Util.ajax.get('/note/find_videos_by_category_id/' + this.category.id + '/' + this.bodyData.page.pageNo + '/' + this.bodyData.page.pageSize + '/').then((response) => {
            let noteVideos = response.data.data.noteVideos
            if (noteVideos && noteVideos.length > 0) {
              for (let noteVideo of noteVideos) {
                noteVideo.visited = false
                this.bodyData.noteVideos.push(noteVideo)
              }
            }
            this.bodyData.page.pageNo++
            if (callback) {
              callback.call(this, response)
            }
          })
        }
      }
    },
    watch: {
      '$route' (to, from) {
        if (!this.loaded && this.$route.params.id == this.category.id) {
          this.onPulldown()
          this.loaded = true
        }
      }
    }
  }
</script>
