<template>
  <div v-show="currentValue" class="input-dialog">
    <textarea v-show="currentValue" ref="textarea" v-autofocus v-model="currentInputValue" :placeholder="currentInputPlaceholder" :maxlength="currentInputMaxLength" @change="onComplete" @blur="onComplete" onkeyup="this.value=this.value.replace(/\n|(\r\n)/g,'')"  onafterpaste="this.value=this.value.replace(/\n|(\r\n)/g,'')"></textarea>
  </div>
</template>

<script>
  export default {
    directives: {
      autofocus: {
        update: function (el) {
          // Focus the element
          el.focus()
          let len = el.value.length;
          if (document.selection) {
        		let sel = el.createTextRange()
        		sel.moveStart('character', len)
        		sel.collapse()
        		sel.select()
        	} else if (typeof el.selectionStart == 'number' && typeof el.selectionEnd == 'number') {
        		el.selectionStart = el.selectionEnd = len
        	}
        }
      }
    },
    props: {
      value: Boolean,
      inputValue: String,
      inputMaxLength: Number,
      inputPlaceholder: String
    },
    data () {
      return {
        currentValue: false,
        currentInputValue: '',
        currentInputMaxLength: 20,
        currentInputPlaceholder: ''
      }
    },
    created () {
      this.currentValue = this.value || false
      this.currentInputValue = this.inputValue || ''
      this.currentInputMaxLength = this.inputMaxLength || ''
      this.currentInputPlaceholder = this.inputPlaceholder || ''
      let $vue = this
      window.addEventListener('orientationchange',function(){
        $vue.$emit('on-complete', $vue.currentInputValue)
      })
    },
    methods: {
      onComplete () {
        this.$emit('on-complete', this.currentInputValue)
      }
    },
    watch: {
      value (val) {
        this.currentValue = val
      },
      inputValue (val) {
        this.currentInputValue = val
      },
      inputMaxLength (val) {
        this.currentInputMaxLength = val
      },
      inputPlaceholder (val) {
        this.currentInputPlaceholder = val
      }
    }
  }
</script>

<style scope>
.input-dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  left: 0;
  top: 0;
  padding: 0px;
  margin: 0px;
  background-color: rgba(0, 0, 0, 0.7);
}
.input-dialog > textarea {
  width: 100%;
  height: 75px;
  font-size: 15px;
  border: 1px #FEC7C3 solid;
  border-radius: 0px;
  padding: 3px;
  margin: 0px;
  outline: 0;
  box-sizing: border-box;
  text-shadow: none ;
  -webkit-appearance: none ;
  -webkit-user-select: text ;
  outline-color: transparent ;
  box-shadow: none;
}
</style>
