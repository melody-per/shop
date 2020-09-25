<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
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
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table border stripe :data="userList" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              @change="userStateChange(scoped.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column width="180px" label="操作">
          <template v-slot="scoped">
            <!-- 编辑 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="getUserInfoById(scoped.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delUserById(scoped.row.id)"
            ></el-button>
            <!-- 修改 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="用户修改"
              placement="top"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRoleDialog(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户弹出框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserVisible"
        width="50%"
        @close="addFormClose"
      >
        <!-- 添加用户表单 -->
        <el-form
          ref="addFormRef"
          :rules="addFormRules"
          :model="addForm"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户弹出框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editUserVisible"
        width="50%"
        @close="editFormClose"
      >
        <!-- 修改用户表单 -->
        <el-form
          ref="editFormRef"
          :rules="addFormRules"
          :model="editForm"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserForm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色的对话框 -->

      <el-dialog
        title="分配角色"
        :visible.sync="setRoleVisible"
        width="50%"
        @close="RoleDialogCloses"
      >
        <div>
          <p>当前的用户：{{ userInfo.username }}</p>
          <p>当前的角色：{{ userInfo.role_name }}</p>
          <p>
            分配新角色：
            <!-- 下拉列表组件 -->
            <el-select v-model="value" placeholder="请选择" multiple>
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 数据
  data() {
    var checkEmail = (rule, value, callback) => {
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (reg.test(value)) {
        return callback();
      }
      return callback(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(value)) {
        return callback();
      }
      return callback(new Error("请输入合法的电话号码"));
    };
    return {
      // get请求用户列表的查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        //每页条数
        pagesize: 2
      },
      // 用户列表
      userList: [],
      // 总数
      total: 0,
      //控制添加用户对话框的布尔值
      addUserVisible: false,
      //控制修改用户对话框的布尔值
      editUserVisible: false,

      //添加用户的对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //修改用户的对象
      editForm: {},

      //添加用户校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      setRoleVisible: false,
      // 用户信息
      userInfo: {},
      //角色列表
      roleList: [],
      //下拉列表双向绑定的值
      value: ""
    };
  },

  //钩子函数
  created() {
    // 调用获取用户列表的方法
    this.getUserList();
  },

  //方法
  methods: {
    // 发送axios获取数据
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败!");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 分页模块
    handleSizeChange(newpage) {
      this.queryInfo.pagesize = newpage;
      this.getUserList();
    },
    handleCurrentChange(newcurrent) {
      this.queryInfo.pagenum = newcurrent;
      this.getUserList();
    },
    // 用户状态修改
    async userStateChange(info) {
      // console.log(info);
      const { data: res } = await this.$http.put(
        `users/${info.id}/state/${info.mg_state}`
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("更新状态失败");
      }
      this.$message.success("更新状态成功");
    },
    //关闭添加用户弹出框表单重置
    addFormClose() {
      this.$refs.addFormRef.resetFields();
    },
    //添加用户
    addUserForm() {
      this.$refs.addFormRef.validate(async boo => {
        // 预校验
        if (!boo) return this.$message.error("请填写完整的信息");
        //发送请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        //重新加载
        this.getUserList();
        //关闭对话框
        this.addUserVisible = false;
      });
    },

    //关闭修改用户弹出框表单重置
    editFormClose() {
      this.$refs.editFormRef.resetFields();
    },

    async getUserInfoById(id) {
      this.editUserVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败");
      }
      this.editForm = res.data;
    },
    //修改用户
    editUserForm() {
      this.$refs.editFormRef.validate(async boo => {
        // 预校验
        if (!boo) return this.$message.error("请填写完整的信息");
        //发送请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status !== 200) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        //关闭对话框
        this.editUserVisible = false;
        //重新加载
        this.getUserList();
      });
    },
    //删除用户
    async delUserById(id) {
      const res = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //res打出来的结果是confirm
      // console.log(res);

      if (res != "confirm") {
        return this.$message.info("以取消删除");
      }
      //发送删除的请求
      const { data: result } = await this.$http.delete("users/" + id);
      if (result.meta.status !== 200) {
        return this.$message.error("删除失败，请稍后重试");
      }
      this.$message.success("删除成功");
      this.getUserList();
    },
    async showSetRoleDialog(role) {
      this.userInfo = role;
      const { data: res } = await this.$http.get("roles");
      console.log(res);
      if (res.meta.status != 200) {
        this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      this.setRoleVisible = true;
    },
    //关闭分配角色对话框将表单清空
    RoleDialogCloses() {
      this.value = "";
    },
    //分配角色发送请求
    async setRole() {
      if (!this.value) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.value
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配角色失败");
      }
      this.getUserList();
      this.setRoleVisible = false;
    }
  }
};
</script>

<style></style>
