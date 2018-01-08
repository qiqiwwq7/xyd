import VideoDialog from '../components/vux/VideoDialog'

const plugin = {
  install (Vue, options) {
    const Video = Vue.extend(VideoDialog)

    if (!this.$vm) {
      this.$vm = new Video({
        el: document.createElement('div')
      })
      document.body.appendChild(this.$vm.$el)
    }

    let scope = this
    const video = {
      show (options) {
        if (typeof options === 'string') {
          scope.$vm.sources = [{
            type: "video/mp4",
            src: options
          }]
        } else if (typeof options === 'object') {
          for (let i in options) {
            scope.$vm[i] = options[i]
          }
        }

        scope.$vm.onExit = function () {
          scope.$vm.sources = undefined
        }
      },
      hide () {
        scope.$vm.sources = undefined
      },
      getSources () {
        return scope.$vm.sources
      }
    }

    Vue.prototype.$video = video
  }
}

export default plugin
export const install = plugin.install
