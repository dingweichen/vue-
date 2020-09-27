<!-- 角色管理页面 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : ' ', 'vncenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRoleById(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vncenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRoleById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="deleteRoleById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button
              type="warning"
              icon="el-icon-star-off"
              size="small"
              @click="setRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <!-- 主体区 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <!-- 主体部分 -->
      <el-tree :data="rightsList" 
      ref="treeRef"
      :props="treeProps" 
      node-key="id"
      show-checkbox 
      default-expand-all 
      :default-checked-keys="defaultKeys"></el-tree>
      <!-- 按钮部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // "添加角色"对话框开关
      addDialogVisible: false,
      // "添加角色"表单数据绑定
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      // "添加角色"校验规则
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },

      // "编辑角色"对话框开关
      editDialogVisible: false,
      // "编辑角色"表单数据绑定
      editForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      // "编辑角色"校验规则
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },

      // "分配权限"对话框开关
      setRightDialogVisible: false,
      // "分配权限"树形结构绑定变量
      rightsList: [], // 后端返回结果
      treeProps: {
          children: 'children',// 父子节点关系传递变量
          label: 'authName'// 文本显示变量
      },
      defaultKeys: [109],// 默认被勾选的节点的id
      // "分配权限"对话框提交，角色id获取
      roleId:'',
    };
  },
  created() {
    // 获取角色列表
    this.getRolesList();
  },
  components: {},

  computed: {},

  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        this.$message.error("角色列表获取失败");
      }
      this.rolesList = res.data;
    },

    // 监听"添加角色"关闭,重置表单数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听"添加角色"提交,预校验后发起请求，注意这里添加的角色没有赋予对应权限
    addRole() {
      this.addDialogVisible = false;
      // 发起预校验,valid为true预校验通过，false预校验没通过
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status != 201) this.$message.error("添加角色失败");
        this.getRolesList();
      });
    },

    // 监听"编辑角色"按钮被点击
    showEditDialog(rolesinfo) {
      this.editDialogVisible = true;
      this.editForm.roleName = rolesinfo.roleName;
      this.editForm.roleDesc = rolesinfo.roleDesc;
      this.editForm.roleId = rolesinfo.id;
    },
    // 监听"编辑角色"对话框关闭，重置表单数据
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 监听"编辑角色"对话框提交，预校验后发起请求
    editRoles() {
      this.editDialogVisible = false;
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editForm.roleId}`,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status != 200) {
          this.$message.error("编辑角色失败");
          console.log(res);
        }
        this.getRolesList();
      });
    },

    // 监听"删除角色"按钮被点击
    async deleteRoles(id) {
      // 弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果点击"确定"，其返回值为 confirm
      // 如果点击"取消"，其返回值为 cancel
      if (confirmResult == "cancel") {
        this.$message.info("已取消删除");
        return;
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status != 200) {
        this.message.error("删除角色失败");
      }
      this.getRolesList();
    },

    // 监听"三级权限"关闭被点击
    async deleteRoleById(role, rightId) {
      // 操作弹框确认
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult == "cancel") {
        this.$message.info("已取消删除");
        return;
      }
      // 发起请求删除"指定角色"下的"指定权限"
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) {
        this.$message.error("删除权限失败");
        console.log(res);
      }
      role.children = res.data;
    },

    // 监听"分配权限"按钮被点击事件
    async setRights(row) {
      // 获取权限列表的“树”的形式
      const{ data : res } = await this.$http.get(`rights/tree`);
      if(res.meta.status != 200){
        this.$message.error('获取权限失败');
        return ;
      }
      this. rightsList = res.data;
      // 设置“树”结构默认被选中的节点的id
      this.getLeafRightsId(row);
      // 给data传值，data作为中间商给allotRights传参
      this.roleId = row.id;
      this.setRightDialogVisible = true;
    },
    // 监听"分配权限"对话框关闭事件
    setRightDialogClosed(){
       // "树"结构被选中的节点绑定的数组，在关闭对话框后，应该被清空
       // 以便下次被点击的时候再赋值
       this.defaultKeys = [];
    },
    // 监听"分配权限"对话框提交事件
    async allotRights(){ 
      // 树形节点绑定id,获取树形结构被选中的所有叶子节点和其父亲节点 对应的key即id
      let selected = [];
      let leafNode =  this.$refs.treeRef.getCheckedKeys();
      let parentNode = this.$refs.treeRef.getHalfCheckedKeys();
      selected = [...leafNode,...parentNode];// 展开运算符拼接数组
      let selectedStr = selected.join(',');// 字符数组转为字符串
      // 获取被点击角色的id
      let roleId = this.roleId;
      // 发起请求，给角色设置权限后，刷新列表
      const { data : res } = await this.$http.post(`roles/${roleId}/rights`,{rids: selectedStr});
      if(res.meta.status != 200){
        this.$message.error('更改角色权限失败');
      }
      this.getRolesList();
      // 注意"关闭对话框"得放到最后，因为关闭对话框会触发close事件，将defaultKeys清空，所以必须放
      // 最后面
      this.setRightDialogVisible = false;
    },
    // "分配权限"辅助函数：递归实现获得所有叶子节点的ID
    getLeafRightsId(Node) {
      // 出口：叶子节点没有children成员
      if(!Node.children){
        this.defaultKeys.push(Node.id);
        return;
      }
      // 递归：将每个非叶子节点的子节点递归
      for(let i = 0 ; i < Node.children.length ;i++){
          this.getLeafRightsId(Node.children[i]);
      } 
    },

  },
};
</script>
<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vncenter {
  display: flex;
  align-items: center;
}
</style>