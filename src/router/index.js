import Vue from 'vue'
import Router from 'vue-router'
import SivContentMaker from '@/components/SivContentMaker'
import ImagesPage from '@/components/ImagesPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'SivContentMaker',
      component: SivContentMaker
    },
    {
      path: '/imagesPage',
      name: 'ImagesPage',
      component: ImagesPage
    }
  ]
})
