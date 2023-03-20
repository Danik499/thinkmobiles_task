import { createStore } from 'vuex'
import userModule from './modules/userModule';
import eventModule from './modules/eventModule';

export default createStore({
  state: {
    serverURL: process.env.VUE_APP_SERVER_URL
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    userModule,
    eventModule
  }
})
