<template>
  <el-container>
    <el-header>
      <div class="header-logo">
        <img src="../assets/logo.png" alt="头像" title="头像">
        <h1>商城后台管理系统</h1>
      </div>
      <div class="header-info">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{User}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span class="iconfont" @click="logout">&#xe676; 退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠展开-->
        <div class="toggle-button" @click="toggleCollapse">
          | | |
        </div>
        <!-- 侧边栏区域 -->
          <!-- :router="true" 开启路由模式, 以index为路由链接-->
        <el-scrollbar>
        <el-menu
          :collapse = "isCollapse"
          unique-opened
          active-text-color="#00bfff"
          :collapse-transition = "false"
          :router="true"
          :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu v-for = "items of menuList" :key = "items.id" :index = "items.id+''">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="menuIcon[items.order - 1]"></i>
              <!-- 文本 -->
              <span slot="title">{{items.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index = "'/' + item.path"
              v-for="(item, i) of items.children"
              :key = "i">
              <template slot="title">
                <div class="el-icon-menu"></div>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <!-- wrap-class: wrap的样式名, view-class: view的样式名-->
        <el-scrollbar>
        <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      User: '',
      menuList: [],
      // 默认不折叠
      isCollapse: false,
      menuIcon: [
        'iconfont icon-yonghu',
        'iconfont icon-weibiaoti-',
        'iconfont icon-shangpin-copy',
        'iconfont icon-icon-order',
        'iconfont icon-shujumianban'
      ],
      // 左边导航栏被激活的链接
      activePath: '/users'
    }
  },
  created () {
    this.User = window.sessionStorage.getItem('User')
    this.getMenuList()
  },
  // 侧边栏展开与折叠
  beforeUpdate () {
    // 保存链接的激活状态
    this.activePath = this.$route.path
  },
  methods: {
    // 获取左侧导航栏列表
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
/* 头部CSS */
.el-header {
  background-color: #4DC9F3;
  .header-logo {
    float: left;
    img {
      width: 60px;
      height: 60px;
    }
    h1 {
      display: inline-block;
      margin-left: 20px;
      vertical-align: 70%;
    }
  }
  .header-info {
    float: right;
    display: block;
    height: 60px;
    line-height: 60px;
    .el-dropdown-link {
      color: #fff;
      font-size: 18px;
      font-weight: 700;
    }
  }
}
/* 左侧导航栏CSS */
.el-aside {
  border-right: 1px solid #e4e4e4;
  box-sizing: border-box;
  overflow: hidden;
  .toggle-button {
    line-height: 24px;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    color: #00BFFF;
    cursor: pointer;
    border-left: 5px solid deepskyblue;
    border-top: 5px solid transparent;
  }
  .el-menu {
    width: 100%;
    height: 100%;
    border: none;
    .el-submenu {
      height: 100%;
      border-left: 5px solid deepskyblue;
      border-top: 5px solid transparent;
      .el-menu-item {
        border: 0;
      }
      i {
        display: inline-block;
        width: 16px;
        margin-right: 5px;
      }
    }
  }
}
.el-scrollbar {
  height: 100%;
}
</style>
