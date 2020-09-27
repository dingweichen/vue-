<!-- 权限管理页面 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 用户列表 -->
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level == 0">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
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
      // 权限管理列表数据
      rightsList: [],
    };
  },
  created() {
    // 调用获取权限管理列表
    this.getRightsList();
  },
  components: {},

  computed: {},

  methods: {
    // 获取权限管理列表
    async getRightsList() {
      const { data: res } = await this.$http.get(`rights/list`);
      //  console.log(res);
      if (res.meta.status != 200) {
        this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
    },
  },
};
</script>
<style lang='scss' scoped>
</style>