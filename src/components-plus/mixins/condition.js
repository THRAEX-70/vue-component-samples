export default {
  props: {
    props: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      defaultItem: { disabled: false, visible: true, value: '' }
    }
  },
  computed: {
    conditions() {
      const conds = {}

      this.checkParams()
      Object.keys(this.params).forEach(it => {
        const item = this.props[it] || ''
        conds[it] = Object.assign({}, this.defaultItem,
          typeof item === 'string' ? { value: item } : item)
      })

      return conds
    }
  },
  watch: {
    conditions: {
      immediate: true,
      deep: true,
      handler() {
        this.checkParams()
        Object.keys(this.params).forEach(it => {
          const { visible, value } = this.conditions[it]
          this.params[it] = visible ? value : ''
        })
      }
    }
  },
  methods: {
    checkParams() {
      const params = this.params
      if (!params || params.constructor !== Object) {
        throw new Error(`Type check failed for attribute "params". 
          Expected Object, got ${params.constructor.name}.`)
      }
    }
  }
}