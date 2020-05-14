<template>
    <div>
        <el-button type="info" round @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    // 退出登录
    logout () {
      // 清除sessionStorage中保存的token值
      sessionStorage.removeItem('token')
      // 跳转到登录login页面
      this.$router.push('/auth/login')
      // 用户提示：退出成功
      this.$message.info('退出成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
