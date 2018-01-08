//将所有的组件预先定义在这里，使webpack能够静态编译组件，达到异步加载的目的
const components = {
  '/index': (resolve) => require(['../components/IndexComponent.vue'], resolve),
  '/note': (resolve) => require(['../components/NoteComponent.vue'], resolve),
  '/note/officials/:id': (resolve) => require(['../components/NoteOfficialsComponent.vue'], resolve),
  '/note/recents/:id': (resolve) => require(['../components/NoteRecentsComponent.vue'], resolve),
  '/note/replies/:id': (resolve) => require(['../components/NoteRepliesComponent.vue'], resolve),
  '/note/weekhots/:id': (resolve) => require(['../components/NoteWeekhotsComponent.vue'], resolve),
  '/note/category/:id': (resolve) => require(['../components/NoteCategoryComponent.vue'], resolve),
  '/video': (resolve) => require(['../components/VideoComponent.vue'], resolve),
  '/video/officials/:id': (resolve) => require(['../components/VideoOfficialsComponent.vue'], resolve),
  '/video/category/:id': (resolve) => require(['../components/VideoCategoryComponent.vue'], resolve)
}

export default components
