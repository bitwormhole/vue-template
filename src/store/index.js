import { createStore } from 'vuex'

import jwt from './module_jwt'
import log from './module_log'
import rest from './module_rest'
import timer from './module_timer'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    jwt, log, rest, timer,
  }
})
