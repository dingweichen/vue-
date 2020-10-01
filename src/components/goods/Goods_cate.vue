<!-- 商品分类组件 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 功能栏 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 图表展示 -->
      <tree-table
        :data="goodsCateList"
        :columns="columns"
        show-index
        border
        :selection-type="false"
        :expand-type="false"
        class="treetable"
      >
        <!-- 在此引用具名插槽 -->
        <!-- 是否有效 -->
        <template slot="isOK" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen; font-size: 18px"
            v-if="scope.row.cat_deleted == false"
          ></i>
          <i
            class="el-icon-error"
            style="color: red; font-size: 18px"
            v-else
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opreate" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="small"
           @click="delCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="this.getCateListInfo.pagesize"
        :current-page="this.getCateListInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        ref="addCateRef"
        :model="addCateInfo"
        label-width="100px"
        :rules="addCateRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <!-- options绑定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="40%"
    >
      <!-- 主体区域 -->
      <el-form
        ref="editCateRef"
        :model="editCateForm"
        :rules="editCateRules"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 返回结果：
      goodsCateList: [],
      parentCateList: [],
      // 请求参数:
      // 添加商品分类，在树形结构中插入节点
      addCateInfo: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      // 获取商品分类列表
      getCateListInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },

      // "添加分类"
      addCateDialogVisible: false,
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 级联选择器
      cascaderProps: {
        expandTrigger: "hover", // 指定级联选择器的显示方式，也可为click方式
        value: "cat_id", // 指定选中后输出的值为goodsCateList中的id
        label: "cat_name", // 指定级联选择器显示的为goodsCateList中的cat_name
        children: "children", // 指定嵌套结构父层与子层传递的'成员名'，为goodsCateList中的children
      },
      selectedKeys: [], // 级联选择器，选中的值，输出后存放的数组，这里绑定的value为id，由cascaderProps.value绑定

      // "编辑分类"
      editCateDialogVisible: false,
      editCateId: "",
      editCateForm: {
        cat_name: "",
      },
      editCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 分页相关
      total: 0,

      // 第三方插件tree-table相关
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示该列为作用域插槽
          type: "template",
          // 表示该具名插槽的名称
          template: "isOK",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opreate",
        },
      ],
    };
  },

  components: {},

  computed: {},

  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      /* console.log("请求参数为：");
      console.log(this.getCateListInfo); */

      const { data: res } = await this.$http.get("categories", {
        params: this.getCateListInfo,
      });
      if (res.meta.status != 200) {
        this.$message.error("获取商品分类列表失败");
      }
      this.goodsCateList = res.data.result;
      this.total = res.data.total;

      /* console.log("获取商品分类列表成功");
      console.log(res); */
    },

    // "添加分类"按钮被点击
    showAddCateDialog() {
      this.getParentList();
      this.addCateDialogVisible = true;
    },
    // "添加分类"-对话框-获取两级商品分类
    async getParentList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200) {
        this.$message.error("获取二级列表失败");
      }
      /* console.log('返回二级菜单的数据为：');
      console.log(res); */
      this.parentCateList = res.data;
    },
    // "添加分类"-对话框-级联选择器选项改变
    parentCateChanged() {
      // console.log(this.selectedKeys);
      // 如果selectedKeys长度大于0，则说明添加的分类不为根级
      if (this.selectedKeys.length > 0) {
        // 父级id为数组最后一个元素
        this.addCateInfo.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
      } else {
        this.addCateInfo.cat_pid = 0;
      }
      // 当前添加的分类等级为数组长度一级为0，二级为1，三级为2
      this.addCateInfo.cat_level = this.selectedKeys.length;
      console.log(this.addCateInfo);
    },
    // "添加分类"-对话框-关闭事件
    addCateDialogClosed() {
      this.$refs.addCateRef.resetFields();
      // 清除级联选择器及它们绑定的请求参数
      this.selectedKeys = [];
      this.addCateInfo.cat_pid = 0;
      this.addCateInfo.cat_level = 0;
    },
    // "添加分类"-对话框-提交
    addCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请合法输入");
          return;
        }
        // 发起请求
        /*  console.log('添加分类请求参数为：');
        console.log(this.addCateInfo); */
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateInfo
        );
        if (res.meta.status != 201) {
          this.$message("分类创建失败");
        }
        /* console.log('添加分类返回结果为：');
        console.log(res); */
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },

    // "编辑分类"按钮被点击
    async showEditCateDialog(editCateId) {
      this.editCateId = editCateId;
      // 根据id查询分类
      const { data: res } = await this.$http.get(`categories/${editCateId}`);
      if (res.meta.status != 200) {
        this.$message.error("根据ID查询失败");
      }
      this.editCateForm.cat_name = res.data.cat_name;
      this.editCateDialogVisible = true;
    },
    // "编辑分类"-对话框-提交
    async editCate() {
      const{ data : res} = await this.$http.put(`categories/${this.editCateId}`, {
        cat_name: this.editCateForm.cat_name,
      });
      if(res.meta.status != 200){
        this.$message.error('修改分类名称失败');
        return;
      }
      this.getCateList();
      this.editCateDialogVisible = false;
    },

    // "删除分类"按钮被点击
    async delCate(delCateId){
      // 操作警示
        const confirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        // console.log(confirm);
        if(confirm == 'cancel'){
          this.$message.info('已取消删除');
          return;
        }
      // 发起请求
       const{ data : res } = await this.$http.delete(`categories/${delCateId}`);
       if(res.meta.status != 200){
         this.$message.error('删除分类失败');
         return;
       }
       this.getCateList();
    },

    // 分页相关函数
    // 每页显示size改变
    handleSizeChange(newPageSize) {
      this.getCateListInfo.pagesize = newPageSize;
      this.getCateList();
    },
    // 页码改变
    handleCurrentChange(newPageNum) {
      this.getCateListInfo.pagenum = newPageNum;
      this.getCateList();
    },
  },

  created() {
    this.getCateList();
  },
};
</script>
<style lang='less' scoped>
.treetable {
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-cascader {
  width: 100%;
}
</style>