<template>
  <x-dialog v-model="currentValue">
    <div v-show="!currentMessage" class="dialog-body">
      <radial-progress-bar class="dialog-circle" :animate-speed="300" :stroke-width="8" :diameter="120" :total-steps="100" :completed-steps="currentPercent">
        <span :style="{color: '#3FC7FA'}">{{loadinng}}{{currentPercent}}%</span>
      </radial-progress-bar>
    </div>
    <div v-show="currentMessage" class="dialog-text">
      <p>错误：{{currentMessage}}</p>
    </div>
    <div v-show="currentMessage" class="dialog-close">
      <button @click="onClose">关闭</button>
    </div>
  </x-dialog>
</template>

<script>
  import { XDialog } from 'vux'
  import RadialProgressBar from 'vue-radial-progress'

  export default {
    components: {
      XDialog,
      RadialProgressBar
    },
    props: {
      value: Boolean,
      percent: Number,
      loadinng: String,
      message: String
    },
    data () {
      return {
        currentValue: false,
        currentPercent: 0,
        currentLoading: '',
        currentMessage: ''
      }
    },
    created () {
      this.currentValue = this.value || false
      this.currentPercent = this.percent || 0
      this.currentLoading = this.loadinng || ''
      this.currentMessage = this.message || ''
    },
    methods: {
      onClose () {
        this.$emit('on-close')
      }
    },
    watch: {
      value (val) {
        this.currentValue = val
      },
      percent (val) {
        this.currentPercent = val
      },
      loadinng (val) {
        this.currentLoading = val
      },
      message (val) {
        this.currentMessage = val
      }
    }
  }
</script>

<style scoped>
  .dialog-body {
    width: 100%;
    display: flex;
    justify-content: center;
    line-height: 0px;
  }
  .dialog-circle {
    width: 30%;
    margin: 10px;
  }
  .dialog-text {
    height: 85px;
    line-height: 85px;
    padding: 0px 10px 10px 10px;
    font-size: 16px;
    font-weight: 400;
  }
  .dialog-close {
    margin: 0px;
  }
  .dialog-close > button {
    width: 100%;
    font-size: 16px;
    color: #E6ECF5;
    background-color: #273d62;
    height: 45px;
    border-radius: 0px;
    border-top: 1px #617089 solid;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    outline: none;
    box-shadow: none;
  }
  .dialog-close > button:active {
    color: #1E2B40;
    background-color: #FDD059;
  }
</style>
