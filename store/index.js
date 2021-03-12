import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import header from './modules/header'
import sysInfo from './modules/sysInfo'

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    user,header,sysInfo
  },
  getters,
})