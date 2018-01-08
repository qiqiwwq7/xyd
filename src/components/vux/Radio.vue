<template>
  <div class="btn-group" data-toggle="buttons">
    <label v-for="(item, index) in list" :key="index" :class="value == item.value ? 'btn active' : 'btn'" @click="onItemClick(item)">
      <i aria-hidden="true" :class="item.icon"></i>
    </label>
  </div>
</template>

<script>
  export default {
    props: {
      list: Array,
      value: Number
    },
    methods: {
      onItemClick (selected) {
        this.$emit('on-radio-click', selected)
      }
    }
  }
</script>

<style scoped>
.btn-group {
  position: relative;
}
.btn-group .btn {
  color: #5D6E84;
  position: relative;
}
.btn-group .btn:active, .btn-group .btn.active {
  color: #FDD059;
  outline: 0;
}
.btn-group .btn > i {
  margin: 0 5px;
}
</style>
