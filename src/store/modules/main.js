import * as types from '../mutation-types'

const state = {
  newContent: {
    title: "", // CONTENT TITLE
    device: "", // PC/MO, PC, MO
    type: "" // WIDE, NORMAL
  }
}

const mutations = {
  [types.CONTENT_DATA_INIT]: (state, initData) => {
    Object.assign(state.newContent, initData);
  }
}

const actions = {
  // contentDataInit: ({ commit }, contentData) => {
  //   commit(types.CONTENT_DATA_INIT, contentData)
  // }
}

export default {
  state,
  actions,
  mutations
}