// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  setLoading (state, loading) {
    state.loading = loading
  },
  setCurrentUser (state, currentUser) {
    state.currentUser = currentUser
  },
  setCurrentSnsShortName (state, currentSnsShortName) {
    state.currentSnsShortName = currentSnsShortName
  },
  setCurrentSnsUserExts (state, currentSnsUserExts) {
    state.currentSnsUserExts = currentSnsUserExts
  },
  setCurrentAccessKey (state, currentAccessKey) {
    state.currentAccessKey = currentAccessKey
  },
  setCurrentConfigs (state, currentConfigs) {
    state.currentConfigs = currentConfigs
  },
  setCurrentCategories (state, currentCategories) {
    state.currentCategories = currentCategories
  },
  setCurrentCategoriesHash (state, currentCategoriesHash) {
    state.currentCategoriesHash = currentCategoriesHash
  },
  setCurrentCategoriesLastPath (state, categoryHash) {
    if (!state.currentCategoriesHash) {
      state.currentCategoriesHash = {}
    }
    for (let key1 in categoryHash) {
      if (!state.currentCategoriesHash[key1]) {
        state.currentCategoriesHash[key1] = {}
      }
      for (let key2 in categoryHash[key1]) {
        state.currentCategoriesHash[key1][key2] = categoryHash[key1][key2]
      }
    }
  }
}
export default mutations
