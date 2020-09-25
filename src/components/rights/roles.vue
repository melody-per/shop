<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 第一层 -->
            <el-row
              :class="['bb', i1 == 0 ? 'bt' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="deleteRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <span class="el-icon-caret-right"></span>
              </el-col>
              <el-col :span="19">
                <!-- 第二层 -->
                <el-row
                  :class="[i2 == 0 ? '' : 'bt']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                  <el-col :span="16">
                    <!-- 第三层 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="deleteRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="200px"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="200px"
        ></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            {{ scoped.row.id }}
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >修改</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRightDialog(scoped.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 权限对话框 -->
      <el-dialog
        title="权限提示"
        :visible.sync="rightsDialogVisible"
        width="50%"
        @close="DialogClosed"
      >
        <!-- 树形结构 -->
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          default-expand-all
          :default-checked-keys="keys"
          ref="TreeRef"
          node-key="id"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  //数据
  data() {
    return {
      //权限数据列表
      rolesList: [],
      rightsDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children"
      },
      //默认选中的三级节点绑定的数组
      keys: [],
      id: ""
    };
  },

  //方法
  methods: {
    // 获取权限列表
    async getrolesList() {
      const { data: res } = await this.$http.get("roles");
      //console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.rolesList = res.data;
    },
    //删除权限
    async deleteRightById(role, rightId) {
      const res = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (res != "confirm") {
        return this.$message.info("已取消删除");
      }
      //   console.log("删除成功");
      const { data: ress } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (ress.meta.status != 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      role.children = ress.data;
    },

    //点击分配权限按钮
    async showRightDialog(role) {
      this.rightsDialogVisible = true;
      const { data: res } = await this.$http.get("rights/tree");
      console.log(res);

      if (res.meta.status != 200) {
        return this.$message.error("获取权限失败");
      }
      this.rightsList = res.data;
      this.getDefaultKeys(role, this.keys);
      console.log(this.rightsList);
      this.id = role.id;
    },
    //获取数据
    getDefaultKeys(ele, arr) {
      //是三级节点  将对应的id拿到
      if (!ele.children) {
        return arr.push(ele.id);
      }
      //不是三级节点  继续调用自己
      ele.children.forEach(item => {
        return this.getDefaultKeys(item, arr);
      });
    },
    //关闭对话框
    DialogClosed() {
      //当对话框关闭之后就将数组情况，保证下一次点开对话框追加的数组是一个空数组
      this.keys = [];
    },
    //完成权限分配
    async setRights() {
      const arr = [
        ...this.$refs.TreeRef.getCheckedKeys(),
        ...this.$refs.TreeRef.getHalfCheckedKeys()
      ];
      const str = arr.join(",");
      const { data: res } = await this.$http.post(`roles/${this.id}/rights`, {
        rids: str
      });
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.rightsDialogVisible = false;
      this.getrolesList();
    }
  },

  //钩子函数
  created() {
    this.getrolesList();
  }

  //结束
};
</script>

<style lang="less" scope>
.el-tag {
  margin: 10px;
}
.bt {
  border-top: 1px solid #ccc;
}
.bb {
  border-bottom: 1px solid #ccc;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
