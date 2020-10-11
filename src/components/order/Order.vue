<!-- 订单列表 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表栏 -->
      <el-table :data="orderList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 普通列 -->
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="85px">
        </el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="85px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="85px">
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="190px">
          <template slot-scope="scope">{{
            scope.row.create_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="155px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditAddrDialog"
            ></el-button>
            <!-- 查看物流进度 -->
            <el-button
              type="success"
              icon="el-icon-location"
              size="small"
              @click="showPrecess"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getOrderListInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="getOrderListInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改订单地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddrDialogVisible"
      width="40%"
      @close="editAddrDialogClosed"
    >
      <!-- 主体 -->
      <el-form
        ref="editAddrFormRef"
        :model="editAddrForm"
        label-width="100px"
        :rules="editAddrFormRules"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editAddrForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddrForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddrDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查看物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="precessVisible" width="40%">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in precessList"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      // 级联选择器 城市选项数据来源
      cityData: cityData,
      // 修改订单地址-对话框
      editAddrDialogVisible: false,
      editAddrForm: {
        address1: [],
        address2: "",
      },
      editAddrFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      // 查看物流进度-对话框
      precessVisible: false,
      // 请求参数
      getOrderListInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 返回结果
      orderList: [],
      total: 0,
      precessList: [],
    };
  },
  methods: {
    // 修改按钮-被点击
    showEditAddrDialog() {
      this.editAddrDialogVisible = true;
    },
    // 修改地址对话框-close事件
    editAddrDialogClosed() {
      this.$refs.editAddrFormRef.resetFields();
    },

    // 查看物流进度-被点击
    async showPrecess() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status != 200) {
        return this.$message.error("获取物流信息失败");
      }
      this.precessList = res.data;
      /* console.log('获取到的物流信息为：');
      console.log(this.precessList); */
      this.precessVisible = true;
    },

    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.getOrderListInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取订单列表失败");
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;

      console.log("获取订单列表为：");
      console.log(this.orderList);
    },
    // 分页相关函数
    handleSizeChange(newPageSize) {
      this.getOrderListInfo.pagesize = newPageSize;
      this.getOrderList();
    },
    handleCurrentChange(newPageIndex) {
      this.getOrderListInfo.pagenum = newPageIndex;
      this.getOrderList();
    },
  },

  created() {
    this.getOrderList();
  },

  computed: {},
};
</script>
<style lang='less' scoped>
.el-pagination {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>