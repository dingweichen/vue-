<!-- 商品列表 -->
<template> 
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="getGoodsListInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 普通列 -->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="105px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="85px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="165px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteGood(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getGoodsListInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="getGoodsListInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 请求参数
      getGoodsListInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 返回结果
      goodsList: [],
      total: 0,
    };
  },

  computed: {},

  methods: {
    // "添加商品"按钮被点击
    goAddPage(){
        this.$router.push('/goods/add');
    },
    // "删除"按钮被点击
    async deleteGood(goodsId){
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch( err => err);
        if ( confirmResult == 'cancel' ){
            this.$message.info('已取消删除');
        }
        const{ data:res } = await this.$http.delete(`goods/${goodsId}`);
        if(res.meta.status != 200){
            return this.$message.error('删除商品失败');
        }
        this.getGoodsList();
    },

    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.getGoodsListInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取商品列表失败");
      }

      /* console.log('获取的商品列表为:');
        console.log(res.data); */
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 分页相关函数
    handleSizeChange(newPageSize) {
      this.getGoodsListInfo.pagesize = newPageSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPageIndex) {
      this.getGoodsListInfo.pagenum = newPageIndex;
      this.getGoodsList();
    },
  },

  created() {
    this.getGoodsList();
  },
};
</script>

<style lang='less' scoped>
.el-pagination {
  margin-top: 10px;
}
</style>