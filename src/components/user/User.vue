<!-- 用户管理页面 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜素栏 -->
          <div>
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table :data="userList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
        <!-- 作用域插槽会覆盖prop的功能 -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteUser(scope.row.id)"
          ></el-button>
          <!-- 分配角色 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRoleDialog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="addFormRef"
        :model="addFrom"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="editFormRef"
        :model="editFrom"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <!-- 主体区域 -->
      <div>
        <p>当前的用户: {{ oneUser.username }}</p>
        <p>当前的角色: {{ oneUser.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则
    var checkEmail = (rule, value, cb) => {
      setRoleDialogVisible;
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 邮箱合法,调用回调函数
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[0-9]{10}$/;
      if (regMobile.test(value)) {
        // 手机合法,调用回调函数
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索框中的关键字
        query: "",
        // 当前页码
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      // 用户列表数据
      userList: [],
      // 用户列表总数
      total: 0,

      // 添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户的规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户的表单数据
      editFrom: {
        userid: "", // 用户id,用户表主键,没有和表单绑定
        username: "",
        email: "",
        mobile: "",
      },
      // 修改用户的规则对象
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 分配角色
      setRoleDialogVisible: false,
      oneUser: "",
      rolesList: [],
      selectedId: '',
    };
  },
  created() {
    // 获取用户列表数据
    this.getUserList();
  },
  components: {},

  computed: {},

  methods: {
    // 获取用户数据列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error(res.meta.$message);
      this.userList = res.data.users;
      this.total = res.data.total;
      //   console.log(res);
    },

    // 监听pagesize改变的事件
    handleSizeChange(newPagesize) {
      //   console.log(newPagesize);
      this.queryInfo.pagesize = newPagesize;
      // 当请求参数改变时，就必须重新发起请求
      this.getUserList();
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 监听开关状态发生改变的事件
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        // 注意这里模板字符串的使用 可以向字符串中插入变量
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        this.$message.error(res.meta.message);
      }
      //  console.log(res);
    },

    // 监听"添加用户"对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听"添加用户"对话框的提交事件
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 预校验通过再发起请求,预校验就是校验规则通过
        const { data: res } = await this.$http.post("users", this.addFrom);
        if (res.meta.status != 201) {
          this.$message.error("添加用户失败!");
          console.log(res);
        }
        // 关闭对话框,并重新获取用户列表数据
        this.addDialogVisible = false;
        this.getUserList();
      });
    },

    // 监听"修改用户"对话框的开启事件
    showEditDialog(userinfo) {
      this.editDialogVisible = true;
      this.editFrom.userid = userinfo.id;
      this.editFrom.username = userinfo.username;
      this.editFrom.email = userinfo.email;
      this.editFrom.mobile = userinfo.mobile;
      //   console.log(userinfo);
    },
    // 监听"修改用户"对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 监听"修改用户"对话框的提交事件
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 预校验通过,发起请求
        // console.log(this.editFrom.userid);
        const { data: res } = await this.$http.put(
          `users/${this.editFrom.userid}`,
          {
            email: this.editFrom.email,
            mobile: this.editFrom.mobile,
          }
        );
        if (res.meta.status != 200) this.$message.error("修改用户信息失败");
        // console.log(res);
        this.editDialogVisible = false;
        this.getUserList();
      });
    },

    // 监听"删除用户"提交事件
    async deleteUser(userid) {
      // 删除前，用Element-ui的消息盒子进行提示,其返回值为Promise对象，
      // 故对其进行封装
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      // 如果点击"确定"，其返回值为 confirm
      // 如果点击"取消"，其返回值为 cancel
      // console.log(confirmResult);
      if (confirmResult == "cancel") {
        this.$message.info("已取消删除");
        return;
      }
      const { data: res } = await this.$http.delete(`users/${userid}`);
      // console.log(res);
      if (res.meta.status == 400) {
        this.$message.error("管理员用户禁止被删除");
        return;
      }
      if (res.meta.status != 200) {
        this.$message.error("删除用户失败");
        return;
      }
      this.getUserList();
    },

    // 监听"分配角色"按钮被点击
    async showSetRoleDialog(oneUser) {
      // 渲染用户有关信息
      this.setRoleDialogVisible = true;
      this.oneUser = oneUser;
      // 渲染可选角色
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        this.$message.error("获取角色列表失败");
        return;
      }
      this.rolesList = res.data;
    },
    // 监听"分配角色"对话框提交按钮被点击
    async setRole(){
      // 角色未被选择
      if(!this.selectedId){
        this.$message.error('角色未被选择');
      }
      const { data : res} = await this.$http.put(`users/${this.oneUser.id}/role`,{
        rid: this.selectedId
      });
      if( res.meta.status != 200 ){
        this.$message.error('分配角色失败');
      }
      // 重新返回用户列表数据
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 监听"分配角色"对话框被关闭——实现参数重置
    setRoleDialogClosed() {
      this.selectedId = '';
    }
  },
};
</script>
<style lang='scss' scoped>
</style>