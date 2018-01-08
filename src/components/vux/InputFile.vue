<template>
  <form class="input-file">
    <input v-if="multiple" type="file" accept="image/*,video/mp4,video/quicktime" multiple="multiple" @change="onFileChange($event)" />
    <input v-else type="file" capture="camera" accept="image/*,video/mp4,video/quicktime" @change="onFileChange($event)" />
  </form>
</template>

<script>
  export default {
    data () {
      return {
        multiple: true
      }
    },
    created () {
      let ve = navigator.userAgent.toLowerCase().match(/cpu iphone os (.*?) like mac os/)
      if (ve && ve.length > 1 && parseInt(ve[1].substring(0, ve[1].indexOf('_'))) < 9) {
        //ios8添加多选属性无法拍照，所以禁止多选
        this.multiple = false
      }
    },
    methods: {
      onFileChange (e) {
        let files = e.target.files || e.dataTransfer.files
        if (files.length > 0) {
          let cloneFiles = []
          for (let i = 0; i < files.length; i++) {
            cloneFiles.push(files[i])
          }
          e.target.parentNode.reset()
          e.target.value = ''
          this.$emit('on-file-change', cloneFiles)
        }
      }
    }
  }
</script>

<style scoped>
  .input-file {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    line-height: 0px;
  }
  .input-file > input {
    width: 100%;
    height: 100%;
    margin: 0px;
    cursor: pointer;
    opacity: 0;
    filter: alpha(opacity=0);
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
</style>
