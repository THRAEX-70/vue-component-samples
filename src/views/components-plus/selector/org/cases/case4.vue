<template>
  <div>
    <el-row :gutter="5" style="margin-bottom: 10px;">
      <el-col :span="20">
        <thx-org-selector v-model="selected" :props="props" />
      </el-col>
      <el-col :span="4">
        <el-button
          type="danger"
          size="mini"
          @click="selected = []"
        >Clear</el-button>
      </el-col>
    </el-row>

    <thx-table :data="selected" :max-height="400" size="mini">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="Data" align="center">
        <template v-slot:default="scope">
          {{ handleData(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column width="50">
        <template v-slot:default="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="selected.splice(scope.$index, 1)"
          />
        </template>
      </el-table-column>
    </thx-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: [],
      props: {
        multiple: true,
        checkStrictly: true
      }
    }
  },
  methods: {
    handleData(row) {
      const { childOrgList, ...data } = row
      return childOrgList
        ? Object.assign(data, { childOrgList: childOrgList.length })
        : data
    }
  }
}
</script>
