<template>
  <div class="note-post">
    <x-header title="发布帖子" :left-options="{showBack: true, backText: ''}" :right-options="{showBtn: true, btnIcon:'gcicon gcicon-publish', btnText: '发布'}" @on-click-right="onPost"></x-header>
    <scroller lock-x scrollbar-y ref="notePostScroller" :height="(clientHeight - 50) +'px'">
      <div style="padding: 20px;">
        <group :gutter="'0'">
          <x-textarea class="box" v-model="data.content" :max="140" placeholder="请输入内容..." @click.native="onContentInput"></x-textarea>
        </group>
        <div class="group">
          <file-selector ref="fileSelector" :max="fileselector.max" :lrz-options="fileselector.lrzOptions" :list="data.noteAttaches" @on-select="onFileSelect" @on-error="onFileError"></file-selector>
        </div>
      </div>
    </scroller>
    <circle-dialog v-model="circledialog.show" :percent="circledialog.percent" :loading="circledialog.loading" :message="circledialog.message" @on-close="circledialog.show = false"></circle-dialog>
  </div>
</template>

<script>
  import Util from '../libs/util'
  import { mapGetters } from 'vuex'
  import { Scroller, Group, XTextarea, XButton } from 'vux'
  import XHeader from 'components/vux/XHeader'
  import FileSelector from 'components/vux/FileSelector'
  import CircleDialog from 'components/vux/CircleDialog'

  export default {
    components: {
      Scroller,
      Group,
      XTextarea,
      XButton,
      XHeader,
      FileSelector,
      CircleDialog
    },
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        fileselector : {
          max: 9,
          lrzOptions: {
            width: 800
          }
        },
        circledialog: {
          show: false,
          loading: '',
          message: '',
          percent: 0,
          count: 0
        },
        data: {
          content: '',
          noteAttaches: []
        }
      }
    },
    created () {
      window.addEventListener('orientationchange', function() {
        this.clientHeight = document.documentElement.clientHeight
      }.bind(this))
    },
    activated () {
      this.circledialog = {
        show: false,
        loading: '',
        message: '',
        percent: 0,
        count: 0
      }
      this.data = {
        content: '',
        noteAttaches: []
      }
    },
    methods: {
      requestSts(callback) {
        Util.ajax.get('/sts/get/').then((response) => {
          if (callback) {
            callback.call(this, response)
          }
        })
      },
      requestNotePost(callback) {
        let noteAttaches = []
        for (let attach of this.data.noteAttaches) {
          noteAttaches.push({
            tag: attach.tag,
            bucket: attach.bucket,
            attachmentUrl: attach.attachmentUrl,
            attachmentOriginSize: attach.attachmentOriginSize,
            attachmentWidth: attach.attachmentWidth,
            attachmentHeight: attach.attachmentHeight,
            videoBucket: attach.videoBucket,
            videoUrl: attach.videoUrl,
            videoOriginSize: attach.videoOriginSize
          })
        }
        Util.ajax.post('/note/post/', {content: encodeURIComponent(this.data.content), noteAttaches: noteAttaches}).then(
          (response) => {
            if (callback) {//success
              callback.call(this, response)
            }
          },
          (response) => {
            if (callback) {//error
              callback.call(this, response)
            }
          }
        )
      },
      onContentInput () {
        let scope = this
        this.$input.show({
          inputValue: this.data.content,
          inputMaxLength: 140,
          inputPlaceholder: "请输入内容...",
          onComplete: function (val) {
            scope.data.content = val
          }
        })
      },
      onPost () {
        if (this.data.content.length == 0) {
          this.$vux.toast.show({
            text: '请输入帖子内容',
            type: 'cancel'
          })
          return false
        }
        if (this.data.noteAttaches.length == 0) {
          this.$vux.toast.show({
            text: '请选择图片或视频',
            type: 'cancel'
          })
          return false
        }
        this.circledialog.show = true
        this.circledialog.percent = 0
        this.circledialog.loading = '发布进度'
        this.circledialog.message = ''
        this.circledialog.count = 0
        this.requestSts(function(response){
          let ossVideoClient = new OSS.Wrapper({
            region: 'oss-cn-beijing',
            accessKeyId: response.data.data.accessKeyId,
            accessKeySecret: response.data.data.accessKeySecret,
            stsToken: response.data.data.securityToken,
            bucket: this.currentAccessKey.videoBucket
          })
          let ossPicClient = new OSS.Wrapper({
            region: 'oss-cn-beijing',
            accessKeyId: response.data.data.accessKeyId,
            accessKeySecret: response.data.data.accessKeySecret,
            stsToken: response.data.data.securityToken,
            bucket: this.currentAccessKey.picBucket
          })
          for (let attach of this.data.noteAttaches) {
            if (attach.tag == 1) {
              //==============================================================================================================
              //==============================================================================================================
              //==============================================================================================================
              //==============================================================================================================
              //==============================================================================================================
              attach.videoBucket = ossVideoClient.options.bucket
              let scope = this
              ossVideoClient.put(attach.videoUrl, new Buffer(attach.buffer, 'binary'), {
                progress: function (p) {
                  console.log('Progress: ' + p);
                }
              }).then(function (val) {
                scope.circledialog.percent += parseInt(80 / scope.data.noteAttaches.length)
                scope.circledialog.count++
                if (scope.circledialog.count == scope.data.noteAttaches.length) {
                  scope.requestNotePost(function(response){
                    if (response.data.success == '1') {
                      scope.circledialog.percent = 100
                      setTimeout(() => {
                        scope.$router.push('/note')
                      }, 350)
                    } else {
                      if (response.data.code == '4010') {
                        scope.circledialog.message = '您发布的内容包含敏感词'
                      } else {
                        scope.circledialog.message = response.data.message
                      }
                      scope.circledialog.close = true
                    }
                  })
                }
              })
            } else if (attach.tag == 0) {
              //==============================================================================================================
              //==============================================================================================================
              //==============================================================================================================
              //==============================================================================================================
              //==============================================================================================================
              attach.bucket = ossPicClient.options.bucket
              let scope = this
              ossPicClient.put(attach.attachmentUrl, new Buffer(attach.buffer, 'binary')).then(function (val) {
                scope.circledialog.percent += parseInt(80 / scope.data.noteAttaches.length)
                scope.circledialog.count++
                if (scope.circledialog.count == scope.data.noteAttaches.length) {
                  scope.requestNotePost(function(response){
                    if (response.data.success == '1') {
                      scope.circledialog.percent = 100
                      setTimeout(() => {
                        scope.$router.push('/note')
                      }, 350)
                    } else {
                      if (response.data.code == '4010') {
                        scope.circledialog.message = '您发布的内容包含敏感词'
                      } else {
                        scope.circledialog.message = response.data.message
                      }
                      scope.circledialog.close = true
                    }
                  })
                }
              })
            }
          }
        })
      },
      onFileSelect () {
        this.$nextTick(() => {//dom渲染之后执行
          this.$refs.notePostScroller.reset()
        })
      },
      onFileError (message) {
        this.$vux.toast.show({
          text: message,
          type: 'cancel'
        })
      }
    },
    computed: {
      ...mapGetters([
        'currentAccessKey'
      ])
    }
  }
</script>

<style>
  .note-post .weui-cells:before, .note-post .weui-cells:after {
    border: 0;
  }
  .note-post .weui-textarea {
    color: #EFF7FF;
    background-color: #141A23;
  }
</style>

<style scoped>
  .box {
    background-color: #141A23;
    border: 1px #1C222D solid;
  }
  .note-post .group {
    margin-top: 20px;
  }
  .note-post .note-post-bar {
    padding: 0px;
    background-color: #F5504E;
  }
  .note-post-bar > button {
    background-color: #F5504E;
    color: #FFF;
    height: 50px;
    border-radius: 0px;
    border: 0px;
  }
  .note-post-bar .weui-btn:after {
    border: 0px;
    border-radius: 0px;
  }
</style>
