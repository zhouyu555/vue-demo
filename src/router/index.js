import Vue from 'vue'
import VueRouter from 'vue-router'
import upload from '../views/UploadFile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'upload',
    component: upload
  }
]

const router = new VueRouter({
  routes
})

export default router
