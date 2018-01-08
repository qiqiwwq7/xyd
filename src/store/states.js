// root state object.
// each Vuex instance is just a single state tree.
const states = {
  loading: false,
  currentUser: {
    userId: 0,
    nickName: '',
    bucket: '',
    headPhoto: ''
  },
  currentSnsShortName: '',
  currentSnsUserExts: [],
  currentAccessKey: {},
  currentConfigs: {},
  currentCategories: [],
  currentCategoriesHash: {}
}
export default states
