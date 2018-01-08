<template>
  <div class="message-card">
    <div class="message-body">
      <div>
        <img width="100" src="../assets/images/none.png">
      </div>
      <div class="message-text">很抱歉，出错了</div>
      <div class="message-bar">
        <router-link to="/">
          <x-button class="message-btn">返回首页</x-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { XButton } from 'vux'

  export default {
    components: {
      XButton
    }
  }
</script>

<style scoped>
.message-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.message-card .message-body {
  margin: 0px auto;
  text-align: center;
}
.message-body .message-text {
  margin-top: 10px;
  color: #EFF7FF;
}
.message-body .message-bar {
  margin-top: 10px;
}
.message-body .message-btn {
  width: 150px;
  padding: 5px;
  font-size: 15px;
  background-color: #FDD059;
  color: #1E2B40;
}
</style>
