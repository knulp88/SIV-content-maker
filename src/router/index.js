import Vue from 'vue'
import Router from 'vue-router'
import {
  Main,
  Image,
  LinkArea,
  LinkData,
  ConfirmContent,
  ToPublish
}from '@/containers'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/image',
      name: 'image',
      component: Image
    },
    {
      path: '/link-area',
      name: 'link-area',
      component: LinkArea
    },
    {
      path: '/link-data',
      name: 'link-data',
      component: LinkData
    },
    {
      path: '/confirm-content',
      name: 'confirm-content',
      component: ConfirmContent
    },
    {
      path: '/to-publish',
      name: 'to-publish',
      component: ToPublish
    }
  ]
})
