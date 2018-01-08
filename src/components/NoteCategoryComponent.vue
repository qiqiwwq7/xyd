<template>
  <div>
    <note-category-instance-component v-for="(category, index) in noteCategories" :key="index" v-show="$route.params.id == category.id" :category="category"></note-category-instance-component>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import NoteCategoryInstanceComponent from 'components/NoteCategoryInstanceComponent'

  export default {
    components: {
      NoteCategoryInstanceComponent
    },
    data () {
      return {
        noteCategories: []
      }
    },
    created () {
      if (this.currentCategoriesHash) {
        let categoryPath = this.currentCategoriesHash['/note']
        if (categoryPath && categoryPath.category && categoryPath.category.children) {
          for (let child of categoryPath.category.children) {
            if (child.url == '/note/category/:id') {
              this.noteCategories.push({
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
