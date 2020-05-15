<template>
  <div>
    <!-- 添加角色按钮 -->
    <el-button type="primary">添加角色</el-button>

    <!-- 角色列表 -->
    <el-table :data="rolesList" stripe border>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 栅格系统 -->
          <el-row
            v-for="(item1, index1) in scope.row.children"
            :key="item1.id"
            :class="['bodbottom', index1 === 0 ? 'bodtop':'', 'center']"
          >
            <!-- 角色的一级权限 -->
            <el-col :span="5">
              <el-tag>{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 角色的二级和三级权限 -->
            <el-col :span="19">
              <el-row
                v-for="(item2, index2) in item1.children"
                :key="item2.id"
                :class="[ index2 === 0 ? '': 'bodtop', 'center']"
              >
                <!-- 二级权限 -->
                <el-col :span="6">
                  <el-tag type="success">{{ item2.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag
                    :span="18"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                    @close="removeRights(scope.row, item3.id)"
                  >{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          {{ scope.row.children.authName}}
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" @click="showRights(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="roleDialogVisible" width="50%" @close="clearPrsetKeys">
      <!-- 
          树形控件：展示权限列表的数据
          :data: 绑定的数据源
          :props: {
              lable：数据源中要展示的文本属性
              children: 数据源进行数据嵌套的属性(子节点的属性)
          }
          show-checkbox: 在每一个节点前面添加复选框
          node-key: 唯一标识每一个节点（一般使用id），选中该节点得到绑定的属性值
          default-expand-all 展开所有的节点
          default-expanded-keys  默认会展开的节点
      -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="prsetKeys"
        ref="treeRef"
      ></el-tree>

      <!-- 底部取消和确定按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="privileges">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 控制分配权限对话框的显示和隐藏
      roleDialogVisible: false,
      // 权限列表
      rightsList: [],
      // 树形结构数据
      treeProps: {
        label: "authName",
        children: "children"
      },
      // 预设的节点数组
      prsetKeys: [],
      // 角色id
      roleId: 0
    };
  },
  created() {
    this.getRoles();
    this.getRights();
  },
  methods: {
    // 给角色分配权限
    async privileges() {
        // 获取树结构中，被选中的节点（叶子结点）和半节点(当前叶子结点的父节点)
        // getCheckedNodes(): 获取复选框选中的叶子结点
        // getHalfCheckedKeys(): 获取半节点的key
        
        let nodeList = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
        // 将数组转化成，用逗号隔开的字符串
        let str = nodeList.join(',')
        const rightsInfo = await this.$webapi.main.roles.insertRights(this.roleId, str)
        const { data, meta } = rightsInfo.data
        // 用户提示：分配权限失败
        if (meta.status !== 200) return this.$message.error(meta.msg)
        // 成功
        // 更新角色列表数据
        this.getRoles()
        // 关闭对话框
        this.roleDialogVisible = false
    },

    // 权限列表对话框关闭，清空预设数组prsetKeys
    clearPrsetKeys() {
      this.prsetKeys = [];
    },

    // 递归获取所有三级权限的节点id
    getThreeLevel(node) {
      // 如果是三级权限节点,直接把节点的id值添加到预设数组prsetKeys中
      if (!node.children) return this.prsetKeys.push(node.id);
      // 如果不是，则递归调用
      node.children.forEach(item => this.getThreeLevel(item));
    },

    // 展示所有的权限信息列表
    showRights(role) {
      this.roleId = role.id;
      // 调用
      this.getThreeLevel(role);
      // 显示对话框
      this.roleDialogVisible = true;
    },

    // 获取所有的权限列表（树状结构）
    async getRights(type) {
      const rightsInfo = await this.$webapi.main.roles.getRightsList("tree");
      const { data, meta } = rightsInfo.data;
      this.rightsList = data;
    },
    // 移除权限
    async removeRights(role, rightId) {
      let info = "";
      try {
        info = await this.$confirm(
          "此操作将永久删除该权限吗, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
      } catch (error) {
        info = error;
      }
      // 用户提示：取消删除
      if (info === "cancel") return this.$message.info("已取消删除");
      // 删除权限
      const deleteInfo = await this.$webapi.main.roles.deleteRights(
        role.id,
        rightId
      );
      const { data, meta } = deleteInfo.data;
      // 用户提示：删除失败
      if (meta.status !== 200) return this.$message.error(meta.msg);
      // 删除成功：更新删除后权限列表
      role.children = data;
    },

    // 获取所有的角色
    async getRoles() {
      const rolesInfo = await this.$webapi.main.roles.getRolesList();
      const { data, meta } = rolesInfo.data;
      this.rolesList = data;
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bodtop {
  border-top: 1px solid #eee;
}
.bodbottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>