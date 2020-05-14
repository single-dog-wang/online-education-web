<template>
  <div class="login__container">
    <div class="login__container__main">
      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        class="login__container__main__form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 提交和重置 -->
        <el-form-item class="login__container__main__form__btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单绑定数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // 获取登录信息
        const loginData = await this.$webapi.auth.login.loginByPassword(
          this.loginForm
        )
        // 结构赋值
        const { data, meta } = loginData.data
        // 用户提示：登录失败
        if (meta.status !== 200) return this.$message.error(meta.msg)
        // 用户提示：登录成功
        this.$message.success(meta.msg)
        // 保存服务器返回的token值
        sessionStorage.setItem('token', data.token)
        // 登录成功跳转home组件
        this.$router.push('/main/home')
      })
    },
    // 重置表单
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scope>
.login__container {
  background-color: #bfc;
  height: 100%;
  &__main {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &__form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      &__btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
