<template>
  <div class="selector-box">
    <div class="selector-box-item" v-for="(item, index) in list" :key="index">
      <div class="selector-box-item-box">
        <div v-if="item.tag == 1" class="layout video"></div>
        <img v-if="item.tag == 0" :src="item.base64">
        <img class="selector-box-item-close" src="../../assets/images/icon-close.png" @click="onCancel(index)">
        <div class="selector-box-item-text">
          <div class="text"><span>{{getSize(item.tag == 1 ? item.videoOriginSize : item.attachmentOriginSize)}}</span></div>
        </div>
      </div>
    </div>
    <div class="selector-box-item" v-if="list.length < max">
      <div class="selector-box-item-box">
        <div class="layout add">
          <input-file class="input-file" @on-file-change="onFileChange"></input-file>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //let isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
  let isAndroid4_4 = false
  if (/(Android)/i.test(navigator.userAgent)) {
    const version = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3)
    if (parseInt(version.substring(0, 1)) <= 4 && parseInt(version.substring(2, 3)) <= 4) {
      isAndroid4_4 = true
    }
  } else if (/(Adr)/i.test(navigator.userAgent)) {
    const version = navigator.userAgent.substr(navigator.userAgent.indexOf('Adr') + 4, 3)
    if (parseInt(version.substring(0, 1)) <= 4 && parseInt(version.substring(2, 3)) <= 4) {
      isAndroid4_4 = true
    }
  }
  if (!isAndroid4_4) {
    //android4.4存在问题
    require('lrz/dist/lrz.bundle')
  }

  const Mp4boxModule = require('mp4box')
  import SparkMD5 from 'spark-md5/spark-md5.min'
  import InputFile from 'components/vux/InputFile'

  export default {
    components: {
      InputFile
    },
    props: {
      max: Number,
      list: Array,
      lrzOptions: Object
    },
    data () {
      return {
        compress_size: 512000,//byte
        pic_max_size: 5 * 1024 * 1024,//byte
        video_max_size: 100 * 1024 * 1024,//byte
        video_max_duration: 300 * 1000,//second
        quality: 70,
        loading: {
          index: 0,
          count: 0
        }
      }
    },
    watch: {
      'loading.index' (val) {
        if (val == this.loading.count) {
          this.loading.index = 0
          this.loading.count = 0
        }
      },
      'loading.count' (val) {
        if (val > 0) {
          this.$store.dispatch('setLoading', true)
        } else {
          setTimeout(() => this.$store.dispatch('setLoading', false), 200)
        }
      }
    },
    methods: {
      compress (image, mime_type) {
        if (!mime_type || mime_type == '') {
          mime_type = 'image/jpeg'
        }
        let cvs = document.createElement('canvas')
        //naturalWidth真实图片的宽度
        cvs.width = image.naturalWidth
        cvs.height = image.naturalHeight
        cvs.getContext("2d").drawImage(image, 0, 0)
        return cvs.toDataURL(mime_type, this.quality / 100)
      },
      getMd5 (arrayBuffer) {
        return new SparkMD5.ArrayBuffer().append(arrayBuffer).end()
      },
      getSuffix (name, mime_type) {
        if (name.lastIndexOf(".") > -1) {
          return name.substring(name.lastIndexOf(".")).toLowerCase()
        } else {
          return mime_type.replace(/image\/|video\//g, '')
        }
      },
      getUnit (unit) {
        if (unit == 1) {
          return 'KB'
        } else if (unit == 2) {
          return 'MB'
        } else if (unit == 3) {
          return 'GB'
        }
      },
      getSize (fileSize, unit) {
        if (!unit) {
          unit = 1
        }
        let val = fileSize / 1024
        if (val >= 1024) {
          unit++
          return this.getSize(val, unit)
        }
        return val.toFixed(2) + this.getUnit(unit)
      },
      read (file) {
        if (file.type == 'video/mp4') {
          this.readToMp4(file)
        } else if (file.type == 'video/quicktime') {
          this.readToMov(file)
        } else {
          if (!isAndroid4_4) {
            this.readToLRZ(file)
          } else {
            this.readToCVS(file)
          }
        }
      },
      readToMov (file) {
        if (file.size > this.video_max_size) {
          this.loading.index++
          this.$emit('on-error', '视频大小不能超过100MB')
          return false
        }
        let scope = this
        let fileReader = new FileReader()
        fileReader.onload = (function(theFile) {
          return function(e) {
            let buffer = e.target.result
            if (scope.list.length < scope.max) {
              scope.list.push({
                tag: 1,
                videoUrl: scope.getMd5(buffer) + scope.getSuffix(file.name, file.type),
                videoOriginSize: file.size,
                videoDuration: 0,
                buffer: buffer,
                file: file
              })
              scope.loading.index++
              scope.$emit('on-select')
            }
          }
        })(file)
        // Read in the image file as a array buffer.
        fileReader.readAsArrayBuffer(file)
      },
      readToMp4 (file) {
        if (file.size > this.video_max_size) {
          this.loading.index++
          this.$emit('on-error', '视频大小不能超过100MB')
          return false
        }
        let scope = this
        let fileReader = new FileReader()
        fileReader.onload = (function(theFile) {
          return function(e) {
            let buffer = e.target.result
            buffer.fileStart = 0
            let mp4box = new Mp4boxModule.MP4Box()
            mp4box.appendBuffer(buffer)
            let info = mp4box.getInfo()
            if (!info.hasMoov) {
              mp4box.flush()
              scope.loading.index++
              scope.$emit('on-error', '加载视频文件失败')
              return false
            }
            if (info.duration > scope.video_max_duration) {
              mp4box.flush()
              scope.loading.index++
              scope.$emit('on-error', '视频时长不能超过5分钟')
              return false
            }
            if (scope.list.length < scope.max) {
              scope.list.push({
                tag: 1,
                videoUrl: scope.getMd5(buffer) + scope.getSuffix(file.name, file.type),
                videoOriginSize: file.size,
                videoDuration: info.duration,
                buffer: buffer,
                file: file
              })
              scope.loading.index++
              scope.$emit('on-select')
            }
            mp4box.flush()
          }
        })(file)
        // Read in the image file as a array buffer.
        fileReader.readAsArrayBuffer(file)
      },
      readToLRZ (file) {
        if (file.size > this.pic_max_size) {
          this.loading.index++
          this.$emit('on-error', '图片大小不能超过5MB')
          return false
        }
        let scope = this
        lrz(file, this.lrzOptions || {}).then(function(rst) { //压缩图片
          let base64 = rst.base64
          let buffer = scope.$common.Base64.toArrayBuffer(base64, 'base64')
          let image = new Image()
          image.src = base64
          image.onload = function(e) {
            if (scope.list.length < scope.max) {
              scope.list.push({
                tag: 0,
                attachmentUrl: scope.getMd5(buffer) + scope.getSuffix(file.name, file.type),
                attachmentOriginSize: rst.fileLen,
                attachmentWidth: image.width,
                attachmentHeight: image.height,
                buffer: buffer,
                base64: base64
              })
              scope.loading.index++
              scope.$emit('on-select')
            }
          }
        }).catch(function(e){
          scope.loading.index++
          scope.$emit('on-error', e.message)
        })
      },
      readToCVS (file) {
        if (file.size > this.pic_max_size) {
          this.loading.index++
          this.$emit('on-error', '图片大小不能超过5MB')
          return false
        }
        let scope = this
        let fileReader = new FileReader()
        fileReader.onload = (function(theFile) {
          return function(e) {
            let base64 = e.target.result
            let buffer = scope.$common.Base64.toArrayBuffer(base64, 'base64')
            let image = new Image()
            image.src = base64
            image.onload = function(e) {
              if (scope.list.length < scope.max) {
                scope.list.push({
                  tag: 0,
                  attachmentUrl: scope.getMd5(buffer) + scope.getSuffix(file.name, file.type),
                  attachmentOriginSize: parseInt(file.size * (scope.quality / 100)),
                  attachmentWidth: image.width,
                  attachmentHeight: image.height,
                  buffer: buffer,
                  base64: file.size > scope.compress_size ? scope.compress(image, file.type) : base64
                })
                scope.loading.index++
                scope.$emit('on-select')
              }
            }
            image.onerror = function(e) {
              scope.loading.index++
              scope.$emit('on-error', '加载图片文件失败')
            }
          }
        })(file)
        // Read in the image file as a data URL.
        fileReader.readAsDataURL(file)
      },
      onFileChange (files) {
        let count = this.max - this.list.length
        if (count > files.length) {
          this.loading.count = files.length
        } else {
          this.loading.count = count
        }
        if (this.list.length + files.length > this.max) {
          this.$emit('on-error', '最多选择9张图片')
        }
        if (files.length > 1) {
          for (let i = 0; i < files.length; i++) {
            this.read(files[i])
          }
        } else {
          this.read(files[0])
        }
      },
      onClick () {
        this.$emit('on-item-click')
      },
      onCancel (index) {
        this.list.splice(index, 1)
      }
    }
  }
</script>

<style scoped>
  .selector-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  @media all and (orientation : landscape) {
    /*横屏*/
    .selector-box .selector-box-item {
      width: 25%;
      height: 25vw;
      position: relative;
      /* height: 0; */
      /* padding-bottom: 25%; */
    }
  }
  @media all and (orientation : portrait){
    /*竖屏*/
    .selector-box .selector-box-item {
      width: 50%;
      height: 50vw;
      position: relative;
      /* height: 0; */
      /* padding-bottom: 50%; */
    }
  }
  .selector-box .selector-box-item .selector-box-item-box {
    width: 100%;
    height: 100%;
    padding: 15px;
    position: absolute;
    box-sizing: border-box;
  }
  .selector-box-item-box > img {
    width: 100%;
    height: 100%;
  }
  .selector-box-item-box .layout {
    width: 100%;
    height: 100%;
    border: 2px #212634 dashed;
    box-sizing: border-box;
  }
  .selector-box-item-box .layout.add {
    background: #0E1319 url(../../assets/images/plus.png) no-repeat center center;
    background-position: center center;
  }
  .selector-box-item-box .layout.add:active {
    background: #141A23 url(../../assets/images/plus.png) no-repeat center center;
  }
  .selector-box-item-box .layout.video {
    background: #0E1319 url(../../assets/images/play-o.png) no-repeat center center;
    background-position: center center;
    background-size: 50% 50%;
  }
  .selector-box-item-box .layout.video:active {
    background: #141A23 url(../../assets/images/play-o.png) no-repeat center center;
  }
  .selector-box-item-box .layout > img {
    width: 80%;
    height: 80%;
  }
  .selector-box-item-box .layout > i {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: auto;
    color: #586B85;
  }
  .selector-box .selector-box-item .selector-box-item-text {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 50px;
    padding: 15px;
    box-sizing: border-box;
  }
  .selector-box .selector-box-item .selector-box-item-text .text {
    background: rgba(0,0,0,.7);
    font-size: 13px;
    color: #C5CBD8;
  }
  .selector-box .selector-box-item .selector-box-item-close {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 35px;
    color: #202634;
  }
</style>
