<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="users__bcn">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="users__card">
      <!-- 搜索和添加 -->
      <el-row :gutter="10">
        <!-- 搜索框-->
        <el-col :span="8">
          <div class="users__card__search">
            <el-input
              placeholder="请输入内容"
              v-model="requestParams.query"
              clearable
              @clear="getUserList"
            ></el-input>
            <el-button icon="el-icon-search" @click="getUserList"></el-button>
          </div>
        </el-col>

        <!-- 添加按钮-->
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="saveUserStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 文字提示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="requestParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="resetForm">
      <!-- 主体内容 :添加用户的表单-->
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框的底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="closeUserForm">
      <!-- 主体内容 :添加用户的表单-->
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框的底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUserForm">取 消</el-button>
        <el-button type="primary" @click="submitEditInfo">确 定 修 改</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="roleDialogVisible" width="50%">
      <p>当前用户：{{ user.username }}</p>
      <p>当前角色：{{ user.role_name }}</p>
      <p>
        分配角色：
        <el-select v-model="selectedValue" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则--邮箱验证
    const checkEmail = (rule, value, callback) => {
      // value: 要校验的数据（输入框的值）
      // callback: 如果，校验成功，则直接调用回调函数
      //     如果校验失败，则调用回调函数的时候必须传入一个错误对象
      //     new Error(“错误信息”)

      // 定义校验邮箱的正则表达式
      const emailReg = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
      // 校验
      // 用户提示：校验失败
      if (!emailReg.test(value)) return callback(new Error("请输入合法的邮箱"));
      // 校验成功
      callback();
    };
    // 自定义校验规则--s手机验证
    const checkMobile = (rule, value, callback) => {
      // 定义校验邮箱的正则表达式
      const mobileReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      // 校验
      // 用户提示：校验失败
      if (!mobileReg.test(value)) {
        return callback(new Error("请输入合法的手机号"));
      }
      // 校验成功
      callback();
    };
    return {
      // 获取用户列表的请求参数
      requestParams: {
        query: "",
        pagenum: 1, // 显示的页码
        pagesize: 2 // 每页显示的条数
      },
      // 用户列表总记录数
      total: 0,
      // 所有用户
      userList: [],
      // 控制添加用户对话框显示和隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户的表单验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 11, message: "长度在 6 到 11 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 控制修改用户对话框显示和隐藏
      editDialogVisible: false,
      // 修改用户表单数据
      editUserForm: {},
      // 修改用户的表单验证规则
      editUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 控制分配角色对话框的显示和隐藏
      roleDialogVisible: false,
      // 所有的角色
      roleList: [],
      // 分配角色的当前用户
      user: {},
      // 角色下拉框选中的value
      selectedValue: '',
      // 
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 分配权限
    async updateRole() {
      // 如果没有分配角色
      if (!this.selectedValue) return this.$message.error('请选择要分配的角色')
      const userInfo = await this.$webapi.main.users.updateUserRole(this.user.id, this.selectedValue)
      const {data, meta} = userInfo.data
      // 用户提示：修改角色失败
      if (meta.status !== 200) return this.$message.error(meta.msg)
      // 修改成功
      // 清空下拉框的数据
      this.selectedValue = ''
      // 同步更新页面的角色数据
      this.getUserList()
      // 关闭分配权限对话框
      this.roleDialogVisible = false
    },
    async setRole(user) {
      this.user = user;
      // 获取角色列表
      const roleInfo = await this.$webapi.main.roles.getRolesList();
      const { data, meta } = roleInfo.data
      this.roleList = data
      // 显示对话框
      this.roleDialogVisible = true;
    },

    // 删除用户
    async deleteUser(id) {
      // comfirm: 是messageBox组件的一个属性，返回值是一个promise对象
      // 当点击“确定”，返回一个字符串comfirm
      // 当点击“取消”, 返回一个Error错误对象

      let info = "";
      try {
        info = await this.$confirm(
          "此操作将永久删除该用户, 是否继续?",
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
      // 如果，info是cancel，则取消删除
      if (info === "cancel") this.$message.info("已取消删除");
      // 如果，info是confirm，则确定删除
      if (info === "confirm") {
        // 删除用户
        const deleteInfo = await this.$webapi.main.users.deleteUser(id);
        const { meta } = deleteInfo.data;
        console.log(meta);
        // 用户提示：删除失败
        if (meta.status !== 200) return this.$message.error(meta.msg);
        // 用户提示：删除成功
        this.$message.success(meta.msg);
      }
    },
    // 修改用户--提交修改
    submitEditInfo() {
      this.$refs.editUserRef.validate(async valid => {
        // 校验不通过
        if (!valid) return;
        // 校验通过
        const editUserData = await this.$webapi.main.users.updateUser(
          this.editUserForm.id,
          { email: this.editUserForm.email, mobile: this.editUserForm.mobile }
        );
        const { meta } = editUserData.data;
        // 用户提示：添加用户失败
        if (meta.status !== 200) return this.$message.error(meta.msg);
        // 用户提示：修改成功
        this.$message.success(meta.msg);
        // 更新用户列表
        this.getUserList();
        // 关闭对话框
        this.editDialogVisible = false;
      });
    },
    // 修改用户，关闭表单重置
    closeUserForm() {
      // 请求表单数聚
      this.$refs.editUserRef.resetFields();
      // 关闭对话框
      this.editDialogVisible = false;
    },
    // 修改用户--通过用户id查询用户
    async editUser(id) {
      // 根据用户id查询用户
      const queryUserInfo = await this.$webapi.main.users.queryUserById(id);
      // 解构赋值
      const { data, meta } = queryUserInfo.data;
      //  在修改表单中回显数据
      this.editUserForm = data;
      // 显示表单
      this.editDialogVisible = true;
    },

    // 添加用户
    addUser() {
      this.$refs.addUserRef.validate(async valid => {
        // 校验不通过
        if (!valid) return;
        // 校验通过
        const insertInfo = await this.$webapi.main.users.insertUser(
          this.addUserForm
        );
        const { meta } = insertInfo.data;
        // 用户提示：添加用户失败
        if (meta.status !== 201) return this.$message.error(meta.msg);
        // 添加成功，并更新用户列表
        this.getUserList();
        // 关闭对话框
        this.addDialogVisible = false;
      });
    },

    // 添加用户--重置表单数据
    resetForm() {
      // 清除表单数据
      this.$refs.addUserRef.resetFields();
      // 关闭对话框
      this.addDialogVisible = false;
    },

    // 保存用户的改变后的状态
    async saveUserStatus(user) {
      // 把改变的状态数据，保存到数据库中
      const userData = await this.$webapi.main.users.changeUserStatus({
        uid: user.id,
        type: user.mg_state
      });
      const { meta } = userData.data;
      // 用户提示：修改失败
      if (meta.status !== 200) {
        // 如果，数据库更新状态失败，则改回页面的状态
        user.mg_state = !user.mg_state;
        return this.$message.error(meta.msg);
      }
      // 用户提示： 修改成功
      this.$message.success(meta.msg);
    },

    // 分页组件--当每页的条数发生变化触发事件
    handleSizeChange(pagesize) {
      // pagesize: 改变后，最新的每页的条数

      // 重新赋值
      this.requestParams.pagesize = pagesize;
      // 每页的条数改变后，重新请求后台，发送最新的数据
      console.log(this.requestParams);
      this.getUserList();
    },

    // 分页插件--当前页面发生变化（跳转页面）触发事件
    handleCurrentChange(pagenum) {
      // pagenum: 改变后，最新的页码

      // 重新赋值
      this.requestParams.pagenum = pagenum;
      // 每页的条数改变后，重新请求后台，发送最新的数据
      this.getUserList();
    },

    // 获取用户列表的数据
    async getUserList() {
      const userList = await this.$webapi.main.users.getUsers(
        this.requestParams
      );
      // 解构赋值
      const { data, meta } = userList.data;
      // 用户提示：获取用户列表失败
      if (meta.status !== 200) return this.$message.error(meta.msg);
      // 获取用户列表成功
      this.total = data.total;
      this.userList = data.users;
    }
  }
};
</script>

<style lang="less" scoped>
.users {
  &__bcn {
    margin-bottom: 20px;
  }
  &__card {
    &__search {
      display: flex;
    }
  }
}
.el-table {
  margin: 15px 0;
}
</style>
