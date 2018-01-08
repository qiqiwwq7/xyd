const routes = [
  {
    path: '/note/post',
    component: resolve => require(['components/NotePostComponent.vue'], resolve)
  },
  {
    path: '/note/:nid',
    component: resolve => require(['components/NoteDetailComponent.vue'], resolve)
  },
  {
    path: '/note/preview/:note',
    component: resolve => require(['components/NoteDetailComponent.vue'], resolve)
  },
  {
    path: '/un-authorized',
    component: (resolve) => require(['../components/UnAuthorizedComponent.vue'], resolve)
  },
  {
    path: '/not-found',
    component: (resolve) => require(['../components/NotFoundComponent.vue'], resolve)
  },
  {
    path: '/error',
    component: (resolve) => require(['../components/ErrorComponent.vue'], resolve)
  },
  {
    path: '*',
    component: (resolve) => require(['../components/NotFoundComponent.vue'], resolve)
  }
]
export default routes
