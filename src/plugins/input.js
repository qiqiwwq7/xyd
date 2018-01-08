import InputDialog from '../components/vux/InputDialog'

const plugin = {
  install (Vue, options) {
    const Input = Vue.extend(InputDialog)

    if (!this.$vm) {
      this.$vm = new Input({
        el: document.createElement('div')
      })
      document.body.appendChild(this.$vm.$el)
    }

    let scope = this
    const input = {
      show (options) {
        if (typeof options === 'string') {
          scope.$vm.inputValue = options
        } else if (typeof options === 'object') {
          for (let i in options) {
            scope.$vm[i] = options[i]
            if (i == 'inputValue') {
              scope.$vm['currentInputValue'] = options[i]
            } else if (i == 'inputMaxLength') {
              scope.$vm['currentInputMaxLength'] = options[i]
            } else if (i == 'inputPlaceholder') {
              scope.$vm['currentInputPlaceholder'] = options[i]
            }
          }
        }

        let callback = scope.$vm['onComplete']
        scope.$vm.onComplete = function () {
          if (callback) {
            callback(scope.$vm.currentInputValue)
          }
          scope.$vm.value = false
        }
        scope.$vm.value = true
      },
      hide () {
        scope.$vm.value = false
      },
      getValue () {
        return scope.$vm.value
      }
    }

    Vue.prototype.$input = input
  }
}

export default plugin
export const install = plugin.install
