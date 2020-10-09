<!-- 参数管理 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col class="cate_opt">
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="selectCateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParmasDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 表格 -->
          <el-table :data="manyParamslist" style="width: 100%" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(scope.row,i)" 
                  >{{ item }}</el-tag
                >
                <!-- 添加tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 普通列 -->
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态参数" name="only">
          <!-- 按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParmasDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 表格 -->
          <el-table :data="onlyParamslist" style="width: 100%" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
               <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(scope.row,i)" 
                  >{{ item }}</el-tag
                >
                <!-- 添加tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 普通列 -->
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParmasDialogVisible"
      @close="addParmasDialogClosed"
      width="50%"
    >
      <!-- 主体区域 -->
      <el-form
        ref="addParamsFormRef"
        :model="addParamsForm"
        :rules="addParamsFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParmasDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParmasDialogVisible"
      @close="editParmasDialogClosed"
      width="50%"
    >
      <!-- 主体区域 -->
      <el-form
        ref="editParamsFormRef"
        :model="editParamsForm"
        :rules="editParamsFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParmasDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 返回结果
      onlyParamslist: [],
      manyParamslist: [],

      // 级联选择器相关
      cateList: [], // 绑定数据源
      cateProps: {
        // 相关配置
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectCateKeys: [], // 选中项输出结果

      // tab页签相关
      activeName: "many", // 被激活的选项，随用户点击切换选项卡改变而改变

      // "添加参数"对话框相关
      addParmasDialogVisible: false,
      addParamsForm: {
        attr_name: "",
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      // "修改参数"对话框相关
      editParmasDialogVisible: false,
      editParamsForm: {
        attr_name: "",
      },
      editParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      // "添加tag"相关
      inputVisible: false,
      inputValue: "",
    };
  },

  methods: {
    // 级联选择器-获取商品分类
    async getCate() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) {
        this.$message.error("获取商品分类失败");
        return;
      }
      this.cateList = res.data;
      /* console.log('获取商品分类为：');
         console.log(this.cateList); */
    },
    // 级联选择器-选中项被改变
    async selectCateChange() {
      // console.log(this.selectCateKeys);
      this.getParamsData();
    },

    // Tab页签选项点击切换
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },

    // "添加参数"对话框-close事件:重置表单
    addParmasDialogClosed() {
      this.$refs.addParamsFormRef.resetFields();
    },
    // "添加参数"对话框-确认按钮被点击
    addParams() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status != 201) {
          this.$message.error("添加参数失败");
          return;
        }
        this.addParmasDialogVisible = false;
        this.getParamsData();
      });
    },

    // "编辑"按钮被点击
    async showEditParamsDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status != 200) {
        this.$message.error("查询参数失败");
        return;
      }
      this.editParamsForm = res.data;
      this.editParmasDialogVisible = true;
    },
    // "修改参数"对话框-close事件：重置表单
    editParmasDialogClosed() {
      this.$refs.editParamsFormRef.resetFields();
    },
    // "修改参数"对话框-提交事件
    async editParams() {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status != 200) {
          this.$message.error("编辑参数失败");
          return;
        }
        this.getParamsData();
        this.editParmasDialogVisible = false;
      });
    },

    // "删除"按钮被点击
    async deleteParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult == "cancel") {
        this.$message.info("已取消删除操作");
        return;
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status != 200) {
        this.$message.error("删除参数失败");
      }
      this.getParamsData();
    },

    // "new Tag"被点击
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // "new Tag"切换为input后，按下Enter或者失去焦点blur被触发
    handleInputConfirm(row) {
      // 去除输入的非法字符串
      if(row.inputValue.trim().length == 0){
        row.inputValue = "";
        row.inputVisible = false;
      }
      // 输入合法后的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 发送给后端
      this.saveAttrVals(row);

    },
    // "Tag"关闭被点击-close事件
    handleClose(row,i){
      row.attr_vals.splice(i,1);
      this.saveAttrVals(row);
    },

    // 将tag的attr_vals增加及删除操作同步到后端
    async saveAttrVals(row) {
      // 发起请求将添加的参数发送到后端
      const { data:res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(','),
      });
      if ( res.meta.status != 200){
        return this.$message.error('添加参数项失败');
      }
    },
    // 获取分类列表
    async getParamsData() {
      // 根据选项卡改变，发起请求获取'动态参数'或'静态参数'对应的参数列表

      /* console.log('获取参数列表请求参数为');
        console.log(this.cateId);
        console.log(this.activeName); */
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("获取参数列表失败");
      }
      // 将res.data中的attr_vals由字符串转化为字符数组
      res.data.forEach((item) => {
        if (item.attr_vals.length != 0) {
          item.attr_vals = item.attr_vals.split(",");
        }else{
          item.attr_vals = [];
        }
        // 为每一列的new tag添加inputVisible和inputValue
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (this.activeName == "only") {
        this.onlyParamslist = res.data;
      } else {
        this.manyParamslist = res.data;
      }
      /* console.log('获取参数列表返回结果为：');
      console.log(res); */
    },
  },

  created() {
    this.getCate();
  },

  computed: {
    // "添加参数"、"添加属性"按钮-能否使用根据"级联选择器"的输出值所变化
    isBtnDisabled() {
      // 没被选中第三级分类则按钮不可用
      if (this.selectCateKeys.length != 3) {
        return true;
      }
      return false;
    },
    // 根据"级联选择器"的选项改变，而改变其被选的第三级的分类的id
    cateId() {
      if (this.selectCateKeys.length == 3) {
        return this.selectCateKeys[2];
      }
      return null;
    },
    // 添加参数对话框-根据Tab的activeName切换标题内容
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>
<style lang='less' scoped>
.cate_opt {
  margin: 15px 0px;
}
.el-cascader {
  width: 270px;
}
.el-tag {
  margin-right: 20px;
}
.input-new-tag {
  width: 100px;
}
</style>