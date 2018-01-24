import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/dashboard.vue'
import Inventory from '../components/inventory.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashbard',
      component: Dashboard
    },
    {
        path: '/inventory',
        name: 'inventory',
        component: Inventory
      }
  ]
})