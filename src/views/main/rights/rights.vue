<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="users__bcn">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 权限表格 -->
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="权限路径" width="180"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // type: 值是list或tree，如果是list则权限移列表形式展示；为tree，则以树状结构展示
      type: ["list", "tree"],
      // 权限列表
      rightsList: []
    };
  },
  created() {
    this.getRights(this.type[0]);
  },
  methods: {
    // 获取所有的权限
    async getRights(type) {
      const RightsInfo = await this.$webapi.main.rights.getRightsList(type);
      const { data, meta } = RightsInfo.data;
      this.rightsList = data;
      console.log(data, meta);
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 15px;
}
</style>