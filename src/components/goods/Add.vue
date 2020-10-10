<!-- 添加商品 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警示栏 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tab栏区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleCateChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyParamsList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyParamsList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadPic"
              :on-preview="handlePreview"
              list-type="picture"
              :headers="headerObj"
              :on-success="handlePicSuccess"
              :on-remove="handlePicRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 第三方编辑器插件 -->
            <quill-editor v-model="addGoodsForm.goods_introduce" />
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="addGoods" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 预览图片对话框 -->
      <el-dialog title="图片预览" :visible.sync="previewPicVisible" width="50%">
        <img :src="previewUrl" width="100%" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      activeIndex: "0",
      // Tab栏区域表单
      addGoodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], // 注意商品类别这里，请求参数要是字符串，而并非字符数组
        pics: [], // 上传图片后，后端给的图片存放路径
        goods_introduce: "", // 商品内容
        attrs: [], // 存放动态参数和静态参数
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品类别", trigger: "blur" },
        ],
      },
      // 级联选择器
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 图片上传
      uploadPic: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewUrl: "", // 预览图片绝对路径
      previewPicVisible: false,
      // 返回结果
      cateList: [],
      manyParamsList: [],
      onlyParamsList: [],
    };
  },
  computed: {
    // 根据级联选择器的选项改变，获取对应第三级分类的id
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2];
      } else {
        return null;
      }
    },
  },

  methods: {
    // Tab选项卡-选项被切换前的钩子函数
    beforeTabLeave(activeName, oldActiveName) {
      // 当由步骤1跳往其他选项&&用户没有选择商品分类时
      if (oldActiveName === "0" && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false; // 阻止跳转
      }
    },
    // Tab选项卡-Tab选项更换时被触发
    tabClick() {
      console.log("当前选择的选项卡索引为：" + this.activeIndex);
      // 步骤2："商品参数"被选
      if (this.activeIndex == 1) {
        this.getGoodsMany();
      } else if (this.activeIndex == 2) {
        this.getGoodsOnly();
      }
    },

    // 级联选择器-选项被改变时触发
    handleCateChange() {},

    // 图片上传-图片预览
    handlePreview(file) {
      /* console.log("预览图片的数据为：");
      console.log(file); */
      this.previewUrl = file.response.data.url;
      this.previewPicVisible = true;
    },
    // 图片上传-移出图片
    handleRemove() {},
    // 图片上传-文件上传成功时被调用
    handlePicSuccess(response) {
      // 1.利用response的返回数据，构造一个对象
      const picInfo = { pic: response.data.tmp_path };
      // 2.将该对象放入请求参数的pics数组中
      this.addGoodsForm.pics.push(picInfo);

      /* console.log('添加图片后的请求参数为：');
      console.log(this.addGoodsForm); */
    },
    // 图片上传-文件移出时被调用
    handlePicRemove(file) {
      // 1. 获取文件对应后端的路径
      const picSrc = file.response.data.tmp_path;
      // 2. 找到该路径对应请求参数中pics数组的索引
      const picIndex = this.addGoodsForm.pics.findIndex(
        (item) => item.pic === picSrc
      );
      // 3. 删除请求参数中pics数组该索引的元素
      this.addGoodsForm.pics.splice(picIndex, 1);

      /* console.log('删除图片后的请求参数为：');
      console.log(this.addGoodsForm); */
    },

    // 添加商品-被点击
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请把参数填写完整");
        }
        // 发送请求
        /* 1.处理请求参数addGoodsForm中的goods_cat，其双向绑定了级联选择器
      用JS库lodash中的深拷贝函数，拷贝后再做更改 */
        const addGoodsInfo = _.cloneDeep(this.addGoodsForm);
        addGoodsInfo.goods_cat = addGoodsInfo.goods_cat.join(",");
        /* 2.处理请求参数addGoodsForm中的attrs,
      取manyParamsList及onlyParamsList的部分项至该成员中 */
        this.manyParamsList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(","), // 数组变字符串
          };
          addGoodsInfo.attrs.push(newInfo);
        });
        this.onlyParamsList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          addGoodsInfo.attrs.push(newInfo);
        });
        console.log("添加商品的请求参数为：");
        console.log(addGoodsInfo);
        /* 3.发送添加商品请求 */
        const { data:res } = await this.$http.post('goods',addGoodsInfo);
        if(res.meta.status != 201){
          return this.$message.error('添加商品失败');
        }
        this.$router.push('/goods');
      });
    },

    // 获取商品分类
    async getGoodsCate() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data;
      /* console.log("返回的商品分类列表为：");
      console.log(this.cateList); */
    },
    // 获取商品"动态参数"
    async getGoodsMany() {
      // console.log('请求参数为：'+ this.cateId);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: "many",
          },
        }
      );
      if (res.meta.status != 200) {
        this.$message.error("获取商品动态参数失败");
      }
      res.data.forEach((item) => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
      });
      this.manyParamsList = res.data;
      console.log("获取的商品动态参数为：");
      console.log(res);
    },
    // 获取商品"静态属性"
    async getGoodsOnly() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: "only",
          },
        }
      );
      if (res.meta.status != 200) {
        this.$message.error("获取商品静态属性失败");
      }
      this.onlyParamsList = res.data;
      console.log("获取的静态属性为：");
      console.log(res);
    },
  },

  created() {
    this.getGoodsCate();
  },
};
</script>
<style lang='less' scoped>
.el-checkbox {
  margin: 0 10px !important;
}
.addGoods {
  margin-top: 10px;
}
</style>