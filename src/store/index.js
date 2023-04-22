import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from './auth.module';
import { cart } from './cart.module';
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    cart
  },
  plugins: [createPersistedState()]
})
