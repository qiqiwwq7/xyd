<template>
  <scroller lock-x scrollbar-y use-pullup use-pulldown ref="noteListScroller" :height="(clientHeight - 50) +'px'" @on-pulldown-loading="onPulldown" @on-pullup-loading="onPullup">
    <note-list-component :name="name" :bodys="{notes: bodyData.notes, userExts: bodyData.userExts}"></note-list-component>
  </scroller>
</template>

<script>
  import Util from '../libs/util'
  import { mapGetters } from 'vuex'
  import Scroller from 'components/vux/ScrollerClick'
  import NoteListComponent from 'components/NoteListComponent'

  export default {
    components: {
      Scroller,
      NoteListComponent
    },
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        name: '',
        bodyData: {
          notes: [],
          userExts: {},
          page: {
            pageNextId: 0,
            pageSize: 20
          }
        }
      }
    },
    created () {
      if (this.currentCategoriesHash) {
        let categoryPath = this.currentCategoriesHash['/note/recents/:id']
        if (categoryPath.category) {
          this.name = categoryPath.category.name
        }
      }
      this.onPulldown()
      window.addEventListener('orientationchange', function() {
        this.clientHeight = document.documentElement.clientHeight
      }.bind(this))
    },
    activated () {
      this.$nextTick(() => {//dom渲染之后执行
        this.$refs.noteListScroller.reset()
      })
    },
    methods: {
      onPulldown () {
        this.bodyData.notes = []
        this.bodyData.userExts = {}
        this.bodyData.page.pageNextId = 0
        this.requestData(function(response){
          this.$nextTick(() => {//dom渲染之后执行
            this.$refs.noteListScroller.donePulldown()
            this.$refs.noteListScroller.reset({
              top: 0
            })
            if (response.data.data.notes.length < this.bodyData.page.pageSize) {
              this.$refs.noteListScroller.disablePullup()
            } else {
              this.$refs.noteListScroller.enablePullup()
            }
          })
        })
      },
      onPullup () {
        this.requestData(function(response){
          this.$nextTick(() => {//dom渲染之后执行
            this.$refs.noteListScroller.donePullup()
            if (response.data.data.notes.length == 0) {
              this.$refs.noteListScroller.disablePullup()
            }
          })
        })
      },
      requestData(callback) {
        Util.ajax.get('/note/find_recents/' + this.bodyData.page.pageNextId + '/' + this.bodyData.page.pageSize + '/').then((response) => {
          let userExts = response.data.data.userExts
          if (userExts != null && userExts.length > 0) {
            for (let userExt of userExts) {
              this.bodyData.userExts[userExt.userId] = userExt
            }
          }
          let notes = response.data.data.notes
          if (notes != null && notes.length > 0) {
            for (let note of notes) {
              note.visited = false
              this.bodyData.notes.push(note)
              this.bodyData.page.pageNextId = note.noteId
            }
          }
          if (callback) {
            callback.call(this, response)
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'currentCategoriesHash'
      ])
    }
  }
</script>
