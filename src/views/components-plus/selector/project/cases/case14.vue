<template>
  <div class="app-container">
    <thx-card-box>
      <el-button type="primary" size="mini" @click="visible = true">选择</el-button>
      <el-button type="danger" size="mini" @click="project = null">清除</el-button>

      <div v-if="project">
        <div v-for="([key, val]) in Object.entries(project)" :key="key">
          {{ key }}: {{ val }}
        </div>
      </div>
      <div v-else>Unchecked</div>

      <thx-project-selector
        :value.sync="project"
        :visible.sync="visible"
        :props="props"
      />
    </thx-card-box>
  </div>
</template>
<script>
export default {
  data() {
    return {
      project: null,
      visible: false,
      props: {
        projectName: '1',
        guiwang: 'dd'
        // dictProjectStatisticsTypeList: '1',
        // dictProjectStatusList: '1',
        // dictProjectSendStatusList: '1',
        // projectFrom: '1',
        // projectFlag: '1'
      }
    }
  }
}
</script>
