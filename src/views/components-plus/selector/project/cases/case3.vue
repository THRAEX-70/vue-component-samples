<template>
  <div>
    <el-button type="primary" size="mini" @click="visible = true">选择</el-button>
    <el-button type="danger" size="mini" @click="projects = []">清除</el-button>

    <div>{{ projects }}</div>

    <thx-project-selector
      multiple
      :value.sync="projects"
      :visible.sync="visible"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      projects: [],
      visible: false
    }
  }
}
</script>
