import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import main from './modules/main'
import image from './modules/image'

const state = {
  phase: null,
}

const mutations = {
  [types.STATE_INIT]: (state, ls) =>{
    Object.assign(state, ls);
  },
  [types.PHASE_SET]: (state, currentPhase) => {
    state.phase = currentPhase
  },
}

const actions = {
  // phaseSet: ({commit}, currentPhase)=>{
  //   commit(types.PHASE_SET, currentPhase)
  // }
}

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions,
  modules: {
    main,
    image
  }
})