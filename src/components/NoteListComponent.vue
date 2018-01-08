<template>
  <div class="note-panel">
    <div v-if="tops && tops.notes && tops.notes.length > 0" class="tops">
      <div class="note-item" v-for="(note, index) in tops.notes" :key="index">
        <router-link class="post" @click.native="onLink(note)" :to="'/note/' + note.noteId + '/'">
          <div class="note-item-body">
            <div class="note-item-preview">
              <i v-if="hasTag(note.hasTag, '1')" class="gcicon gcicon-play" aria-hidden="true"></i>
              <img v-if="note.attachmentUrl.length > 0" :src="$common.Oss.imageResize($common.Oss.getCdnUrl(note.bucket, note.attachmentUrl), 70, 40)" alt="">
              <span v-else>{{name}}</span>
            </div>
            <div class="note-text ellipsis">
              <span class="label label-top">置顶</span>
              <span :style="note.visited ? 'color: #a1a2a3;' : ''">{{note.content | decode}}</span>
              <i class="gcicon gcicon-picture" aria-hidden="true" v-if="hasTag(note.hasTag, '0')"></i>
              <i class="gcicon gcicon-video" aria-hidden="true" v-if="hasTag(note.hasTag, '1')"></i>
            </div>
            <div class="note-state">
              <div class="note-avatar-text ellipsis">
                <span class="user">{{tops.userExts[note.userId].nickName | decode}}</span>
                <span class="time">{{note.time | date-number-to-date | date-both-length}}</span>
              </div>
              <div class="note-bar ellipsis">
                <i class="gcicon gcicon-comment" aria-hidden="true"></i>
                <span class="comments">{{note.commentCount}}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="bodys && bodys.notes && bodys.notes.length > 0" class="bodys">
      <div class="note-item" v-for="(note, index) in bodys.notes" :key="index">
        <router-link class="post" @click.native="onLink(note)" :to="'/note/' + note.noteId + '/'">
          <div class="note-item-body">
            <div class="note-item-preview">
              <div v-if="hasTag(note.hasTag, '1')" class="video">
                <i class="gcicon gcicon-play" aria-hidden="true"></i>
              </div>
              <img v-if="note.attachmentUrl.length > 0" :src="$common.Oss.imageResize($common.Oss.getCdnUrl(note.bucket, note.attachmentUrl), 70, 40)" alt="">
              <span v-else>{{name}}</span>
            </div>
            <div class="note-text ellipsis">
              <span :style="note.visited ? 'color: #a1a2a3;' : ''">{{note.content | decode}}</span>
              <i class="gcicon gcicon-picture" aria-hidden="true" v-if="hasTag(note.hasTag, '0')"></i>
              <i class="gcicon gcicon-video" aria-hidden="true" v-if="hasTag(note.hasTag, '1')"></i>
            </div>
            <div v-if="mode == 1" class="note-state">
              <div class="note-avatar-text ellipsis">
                <span class="user">{{bodys.userExts[note.userId].nickName | decode}}</span>
              </div>
              <div class="note-bar ellipsis">
                <span class="time">{{note.time | date-number-to-date | date-both-length}}</span>
              </div>
            </div>
            <div v-else class="note-state">
              <div class="note-avatar-text ellipsis">
                <span class="user">{{bodys.userExts[note.userId].nickName | decode}}</span>
                <span class="time">{{note.time | date-number-to-date | date-both-length}}</span>
              </div>
              <div class="note-bar ellipsis">
                <i class="gcicon gcicon-comment" aria-hidden="true"></i>
                <span class="comments">{{note.commentCount}}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      name: String,
      tops: Object,
      bodys: Object,
      mode: String
    },
    methods: {
      hasTag (hasTag, tag) {
        return hasTag.split(",").indexOf(tag) > -1
      },
      onLink (note) {
        note.visited = true
      }
    }
  }
</script>

<style scoped>
.ellipsis {
  white-space: nowrap;
  word-wrap: normal;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-panel {
  margin: auto;
}
.note-panel .note-item .post .note-item-body {
  padding: 0px 0px 0px 80px;
  position: relative;
}
.note-panel .note-item .post .note-item-preview {
  width: 70px;
  height: 45px;
  line-height: 45px;
  color: #5A6F86;
  text-align: center;
  position: absolute;
  top: 0px;
  left: 0px;
  border: 1px #1E2431 solid;
  box-sizing: border-box;
  background-color: #141A23;
}
.note-panel .note-item .post .note-item-preview .video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(20, 26, 38, .5);
}
.note-panel .note-item .post .note-item-preview .video > i {
  position: absolute;
  margin: auto;
  font-size: 25px;
  color: #FFF;
  width: 25px;
  height: 25px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.note-panel .note-item .post .note-item-preview > img {
  width: 100%;
  height: 100%;
}
.note-panel .note-item > a {
  padding: 10px;
  display: block;
  border-bottom: 1px #1D2430 solid;
}
.note-panel .note-item:last-child > a {
  border-bottom: 0;
}
.tops .note-item .note-text {
  width: 100%;
  height: 25px;
  line-height: 25px;
  color: #EAC56B;
}
.bodys .note-item .note-text {
  width: auto;
  height: 25px;
  line-height: 25px;
  color: #E6ECF5;
}
.note-item .gcicon {
  font-size: 18px;
  position: relative;
  top: 3px;
  display: inline-block;
}
.note-item .gcicon-picture {
  color: #00BFF8;
}
.note-item .gcicon-video {
  color: #FE743D;
}
.note-item .note-state {
  display: flex;
  height: 20px;
  line-height: 20px;
}
.note-item .note-avatar {
  height: 40px;
  width: 40px;
  margin-right: 20px;
  text-align: center;
  border-radius: 50%;
  flex-shrink: 0;
}
.note-item .note-avatar img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: block;
}
.note-item .note-avatar-text {
  width: 50%;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #687991;
}
.note-item .note-avatar-text .time {
  margin-left: 20px;
}
.note-item .note-bar {
  width: 50%;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #687991;
  text-align: right;
}
.note-item .note-bar .gcicon {
  margin-left: 10px;
  font-size: 16px;
}
.label {
  display: inline;
  padding: 1px 2px 2px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
}
.label-top {
  color: #FFF;
  background-color: #F43330;
}
</style>
