// getters are functions
const getters = {
  loading: state => {
    return state.loading
  },
  currentUser: state => {
    return state.currentUser
  },
  currentSnsShortName: state => {
    return state.currentSnsShortName
  },
  currentSnsUserExts: state => {
    return state.currentSnsUserExts
  },
  currentAccessKey: state => {
    return state.currentAccessKey
  },
  currentConfigs: state => {
    return state.currentConfigs
  },
  currentCategories: state => {
    return state.currentCategories
  },
  currentCategoriesHash: state => {
    return state.currentCategoriesHash
  }
}
export default getters
