<!-- 主页 -->
<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠菜单 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#359BFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              @click="saveNavState('/' + subitem.path)"
            >
              <!-- 二级菜单的模板区 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 左侧菜单栏图标绑定
      icons: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-lock_fill",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 折叠菜单控制开关
      isCollapse: false,
      // 左侧菜单被点击的状态
      activePath: '',
    };
  },

  components: {},

  computed: {},

  created() {
    // vue声明周期中页面刚载入时被调用
    // 获取列表
    this.getMenuList();
    // 设置被激活的菜单栏
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      // 退出登录的操作
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      // 获取所有的菜单数据
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      console.log(res);
    },
    toggleCollapse() {
      // 菜单栏折叠功能
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      // 保存链接的激活状态
      // 直接赋值实现了瞬时的效果
      this.activePath = activePath;
      // 保存至本地会话中，在created函数中赋值实现的是加载时被激活的效果
      window.sessionStorage.setItem("activePath",activePath);
    },
  },
};
</script>

<style lang='less' scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  background-color: #363d40;
  font-size: 20px;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #313743;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf1;
}
.home_container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #475163;
  font-size: 10px;
  color: #fff;
  height: 24px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>