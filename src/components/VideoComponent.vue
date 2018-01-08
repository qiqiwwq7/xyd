<template>
  <div>
    <nav-category-component></nav-category-component>
    <transition :name="'fade'">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import NavCategoryComponent from 'components/NavCategoryComponent'

  export default {
    components: {
      NavCategoryComponent
    }
  }
</script>
