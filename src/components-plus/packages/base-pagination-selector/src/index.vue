<template>
  <thx-pagination-selector
    :multiple="multiple"
    :data="list.data"
    :total="list.total"
    :page.sync="list.query.page"
    :size.sync="list.query.size"
    :loading="list.loading"
    :visible.sync="selectorVisible"
    :value.sync="selected"
    :top="top"
    :width="width"
    :height="height"
    :index="indexProps"
    @ok="assembly"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <template v-slot:prepend>
      <slot name="condition" />
    </template>

    <slot />
  </thx-pagination-selector>
</template>
<script>
import PaginationSelectorMixin from '~/mixins/pagination-selector'

import request from '@/utils/request'
import qs from 'qs'

export default {
  name: 'ThxBasePaginationSelector',
  mixins: [PaginationSelectorMixin],
  props: {
    apiPage: {
      type: String,
      required: true
    },
    apiIds: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      list: {
        loading: false,
        data: [],
        total: 0,
        query: {
          page: 1,
          size: 10,
          params: {}
        }
      }
    }
  },
  computed: {
    indexProps() {
      return Object.assign({ label: '序号' }, this.index)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.selected = this.value ? this.multiple ? this.value.map(it => it.id) : this.value.id : null
      }
    },
    params: {
      immediate: true,
      deep: true,
      handler() {
        Object.assign(this.list.query, { page: 1, params: this.params })
      }
    },
    'list.query': {
      deep: true,
      handler() {
        this.search()
      }
    }
  },
  mounted() {
    console.warn('Optimize: not in here...')
    this.search()
  },
  methods: {
    requestPage(params) {
      return this.apiPage
        ? request({
          url: this.apiPage,
          method: 'GET',
          params,
          paramsSerializer: p => qs.stringify(p, { indices: false })
        }) : this.emptyData()
    },
    requestByIds(ids) {
      return this.apiIds
        ? request({
          url: this.apiIds,
          method: 'GET',
          params: { ids },
          paramsSerializer: p => qs.stringify(p, { indices: false })
        }) : this.emptyData()
    },
    async emptyData() {
      return { data: [], total: 0 }
    },
    async getByIds(ids, full = true) {
      if (!ids) return null

      let result

      const isArr = Array.isArray(ids)
      if (full) {
        const params = isArr ? ids : [ids]

        const data = params.length > 0 ? (await this.requestByIds(params)).data : []

        result = isArr ? data : data.length > 0 ? data[0] : null
      } else {
        result = isArr ? ids.map(id => ({ id })) : { id: ids }
      }

      return result

      /* let result
      if (Array.isArray(ids)) {
        result = ids.length > 0 ? (await this.requestByIds(ids)).data : []
      } else {
        // ({ data: [result = null] } = await this.requestByIds([ids]))
        [result = null] = (await this.requestByIds([ids])).data
      }

      return result */
    },
    search() {
      this.list.loading = true
      this.requestPage(this.list.query)
        .then(({ data, total }) => Object.assign(this.list, { data, total }))
        .finally(() => (this.list.loading = false))
    },
    async collectRadio() {
      let one = null

      if (this.selected) {
        one = this.list.data.find(it => it.id === this.selected)

        if (!one) {
          const { data: [first] } = await this.requestByIds([this.selected])
          one = first || null
        }
      }

      return one
    },
    async collectMultiple() {
      return this.selected && this.selected.length > 0 ? (await this.requestByIds(this.selected)).data : []
    },
    assembly() {
      (this.multiple ? this.collectMultiple : this.collectRadio)().then(this.handleOk)
    },
    // @Deprecated
    assemblyV1() {
      new Promise(resolve => {
        if (this.multiple) {
          if (this.selected && this.selected.length > 0) {
            this.requestByIds(this.selected).then(({ data }) => resolve(data))
          } else {
            resolve([])
          }
        } else {
          const one = this.list.data.find(it => it.id === this.selected)
          one ? resolve(one) : this.requestByIds([this.selected]).then(({ data: [first] }) => resolve(first || null))
        }
      }).then(data => this.handleOk(data))
    }
  }
}
</script>
<style scoped>
::v-deep .el-form .el-form-item {
  margin-bottom: 2px;
}
</style>
