import * as types from '../mutation-types'

const state = {
  currentUploadFile: []
}

const mutations = {

  [types.UPLOAD_FILES]: (state, result) => {
    state.currentUploadFile.push({
      dataUrl: result.dataUrl,
      index: result.index,
      name: result.name
    });
  },

  [types.CLEAR_FILES]: state => {
    state.currentUploadFile = [];
  },

  // 
  [types.IMG_DATA_INIT]: (state, imgData) => {
    state.currentUploadFile = imgData
  },

  // sorting uploaded image list to filename numbering
  [types.SORT_IMAGE_LIST]: state => {
    return state.currentUploadFile.sort(function (a, b) {
      const pattern = /[0-9]{2}(?=(.jpg|.png|.gif))/
      return parseInt(a.name.match(pattern)) - parseInt(b.name.match(pattern));
    });
  }
}

const actions = {
  imgDataInit: ({ commit, state }, imgData) => {
    commit(types.IMG_DATA_INIT, imgData)
  },
  uploadFiles: ({ commit, state }, payload) => {
    const { evt } = payload;
    let files = evt.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const { name } = files[i];

      reader.readAsDataURL(files[i])

      reader.onload = evt => {
        commit(types.UPLOAD_FILES, {
          dataUrl: evt.target.result,
          index: i,
          name
        })
      }
    }
  },
  clearFiles: ({ commit }) => {
    commit(types.CLEAR_FILES);
  },
  sortImageList: ({ commit }) => {
    commit(types.SORT_IMAGE_LIST)
  }
}

export default {
  state,
  mutations,
  actions
}