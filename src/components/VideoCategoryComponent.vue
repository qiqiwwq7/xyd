<template>
  <div>
    <video-category-instance-component v-for="(category, index) in videoCategories" :key="index" v-show="$route.params.id == category.id" :category="category"></video-category-instance-component>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VideoCategoryInstanceComponent from 'components/VideoCategoryInstanceComponent'

  export default {
    components: {
      VideoCategoryInstanceComponent
    },
    data () {
      return {
        videoCategories: []
      }
    },
    created () {
      if (this.currentCategoriesHash) {
        let categoryPath = this.currentCategoriesHash['/video']
        if (categoryPath && categoryPath.category && categoryPath.category.children) {
          for (let child of categoryPath.category.children) {
            if (child.url == '/video/category/:id') {
              this.videoCategories.push({
                id: child.id,
                name: child.name
              })
            }
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'currentCategoriesHash'
      ])
    }
  }
</script>
