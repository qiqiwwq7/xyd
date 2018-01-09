<template>
  <div class="outer">
    <div class="center">
      <button-tab class="category-tab">
        <button-tab-item v-for="(category, index) in categories" :key="index" :style="'height:' + itemHeight + '%'" class="category-tab-item" :selected="$route.path.startsWith(category.url) ? true : false" @click.native="selectCategory(category, this)">
          <div class="category">
            <img :src="getCategoryIcon(category)">
            <p>{{category.name}}</p>
          </div>
        </button-tab-item>
      </button-tab>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { ButtonTab, ButtonTabItem } from 'vux'

  export default {
    components: {
      ButtonTab,
      ButtonTabItem
    },
    props: {
      categories: Array
    },
    methods: {
      selectCategory (category) {
        if (this.currentCategoriesHash) {
          let categoryPath = this.currentCategoriesHash[category.url]
          if (categoryPath && categoryPath.last) {
            this.$router.push(categoryPath.last)
            return
          }
        }
        this.$router.push(category.url)
      },
      getCategoryIcon (category) {
        let active = this.$route.path.startsWith(category.url) ? '-active' : ''
        return require('../assets/images' + category.url + active + '.png')
      }
    },
    computed: {
      itemHeight: function () {
        return (100 / this.categories.length).toFixed(6)
      },
      ...mapGetters([
        'currentCategoriesHash'
      ])
    }
  }
</script>

<style scoped>
  @import '../assets/less/use.less';
</style>
