<template>
  <scroller lock-x scrollbar-y use-pullup use-pulldown ref="noteListScroller" :height="(clientHeight - 50) +'px'" @on-pulldown-loading="onPulldown" @on-pullup-loading="onPullup">
    <note-list-component :name="category.name" :bodys="{notes: bodyData.notes, userExts: bodyData.userExts}"></note-list-component>
  </scroller>
</template>

<script>
  import Util from '../libs/util'
  import Scroller from 'components/vux/ScrollerClick'
  import NoteListComponent from 'components/NoteListComponent'

  export default {
    components: {
      Scroller,
      NoteListComponent
    },
    props: {
      category: Object
    },
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        bodyData: {
          loaded: false,
          notes: [],
          userExts: {},
          page: {
            pageNo: 1,
            pageSize: 20,
          }
        }
      }
    },
    created () {
      if (!this.loaded && this.$route.params.id == this.category.id) {
        this.onPulldown()
        this.loaded = true
      }
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
        this.bodyData.page.pageNo = 1
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
        if (this.category.id) {
          Util.ajax.get('/note/find_notes_by_category_id/' + this.category.id + '/' + this.bodyData.page.pageNo + '/' + this.bodyData.page.pageSize + '/').then((response) => {
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
              }
            }
            this.bodyData.page.pageNo++
            if (callback) {
              callback.call(this, response)
            }
          })
        }
      }
    },
    watch: {
      '$route' (to, from) {
        if (!this.loaded && this.$route.params.id == this.category.id) {
          this.onPulldown()
          this.loaded = true
        }
      }
    }
  }
</script>
