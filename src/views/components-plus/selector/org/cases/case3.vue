<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="20">
        <thx-org-selector v-model="selected" :props="props" />
      </el-col>
      <el-col :span="4">
        <el-button
          type="danger"
          size="mini"
          @click="selected = null"
        >Clear</el-button>
      </el-col>
    </el-row>

    {{ data }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: null,
      props: {
        checkStrictly: true
      }
    }
  },
  computed: {
    data() {
      let result = null
      if (this.selected) {
        const { childOrgList, ...data } = this.selected
        result = childOrgList
          ? Object.assign(data, { childOrgList: childOrgList.length })
          : data
      }

      return result
    }
  }
}
</script>
