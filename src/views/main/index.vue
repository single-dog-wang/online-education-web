<template>
  <!-- 容器 -->
  <el-container class="main__container">
    <!-- 头部区域 -->
    <el-header class="main__container__header">
      <!-- 左侧：文本和图片 -->
      <div class="main__container__header__img">
        <img src="@/assets/images/boduo.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <!-- 右侧：退出登录-->
      <el-button type="info" round @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 左侧：导航栏 -->
      <el-aside :width="!flag ? '200px':'63px'" class="main__container__aside">
        <!-- 收齐/展开侧边栏 -->
        <div class="main__container__aside__showHid" @click="flag = !flag">|||</div>
        <!-- 导航栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse-transition="false"
          :collapse="flag"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="`${item.id}`" v-for="(item, index) in menuList" :key="item.id">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[index]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="`/main/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveStatus(`/main/${subItem.path}`)"
            >
              <!-- 二级菜单的模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧：主体内容 -->
      <el-main class="main__container__main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单列表
      menuList: [],
      // 字体图标
      iconList: [
        'el-icon-s-custom',
        'el-icon-s-management',
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-data'
      ],
      // 展开/收起菜单栏
      flag: false,
      // 二级菜单激活的状态
      activePath: ''
    }
  },
  created () {
    // 调用获取菜单方法
    this.getMenus()
    // 进入页面之前，就激活转态
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    // 保存激活的菜单路径
    saveStatus (status) {
      // 给点击了导航栏的当前状态赋值
      this.activePath = status
      // 把当前装填保存起来
      sessionStorage.setItem('activePath', status)
    },
    // 退出登录
    logout () {
      // 清除sessionStorage中保存的token值
      sessionStorage.removeItem('token')
      // 跳转到登录login页面
      this.$router.push('/auth/login')
      // 用户提示：退出成功
      this.$message.info('退出成功')
    },
    // 获取所有菜单
    async getMenus () {
      // 从后台获取所有的menu数据
      const menus = await this.$webapi.main.menu.getMainMenus()
      const { data, meta } = menus.data
      // 用户提示：获取菜单失败
      if (meta.status !== 200) return this.$message.error(meta.msg)
      // 把获取到的额后台数据绑定到data域中
      this.menuList = data
    }
  }
}
</script>

<style lang="less" scoped>
.main__container {
  height: 100%;
  &__header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    &__img {
      display: flex;
      height: 60px;
      width: 400px;
      align-items: center;
      img {
        width: 100px;
        height: 100%;
      }
      span {
        font-size: 30px;
        color: #fff;
      }
    }
  }
  &__aside {
    background-color: #333744;
    .el-menu {
      border: none;
    }
    &__showHid {
      text-align: center;
      color: #fff;
      letter-spacing: 3px;
      cursor: pointer;
    }
  }
  &__main {
    background-color: #eaedf1;
  }
}
</style>
