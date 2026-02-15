import { createRouter, createWebHistory } from 'vue-router'
import NoteSparkView from '@/views/NoteSparkView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'NoteSpark',
      component: NoteSparkView
    }
  ],
})

export default router
