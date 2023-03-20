import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage';
import CreateUser from '../views/CreateUser';
import UserPage from '../views/UserPage';
import CreateEvent from '../views/CreateEvent';
import Login from '../views/LoginPage'

const routes = [
  {
    path: '/main/:page',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/create-user',
    name: 'CreateUser',
    component: CreateUser
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/user/:id/:page',
    name: 'UserPage',
    component: UserPage
  },
  {
    path: '/user/:id/create-event',
    name: 'CreateEvent',
    component: CreateEvent
  },
  {
    path: '/',
    redirect: '/main/1'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
