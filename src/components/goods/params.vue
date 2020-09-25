<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为三级分类相关参数"
        type="warning"
        show-icon
      ></el-alert>
      <div class="casstyle">
        选择商品分类:
        <el-cascader
          v-model="selectKeys"
          :options="cateList"
          :props="cascadeProps"
          @change="handleChange"
          clearable
        ></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button
            border
            stripe
            size="mini"
            type="primary"
            :disabled="isdisabled"
            @click="addAttrbuteViseble = true"
            >添加参数</el-button
          >
          <!-- 动态参数表单 -->
          <el-table :data="manyData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环展示的tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="removeTag(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 按钮和输入框的切换区域 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column prop="attr_name" label="操作">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParamsBtn(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性按钮 -->
          <el-button
            size="mini"
            type="primary"
            :disabled="isdisabled"
            @click="addAttrbuteViseble = true"
            >添加属性</el-button
          >
          <!-- 静态属性表单 -->
          <el-table :data="onlyData" style="width: 100%" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column prop="attr_name" label="操作">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParamsBtn(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加属性/参数的对话框 -->
      <el-dialog
        :title="'添加' + Text"
        :visible.sync="addAttrbuteViseble"
        width="50%"
        @close="addFormClosed"
      >
        <!-- 表单 -->
        <el-form
          ref="addAttrbuteRef"
          :model="addForm"
          label-width="80px"
          :rules="addFormRules"
        >
          <el-form-item :label="Text" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addAttrbuteViseble = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑属性/参数的对话框 -->
      <el-dialog
        :title="'修改' + Text"
        :visible.sync="editAttrbuteViseble"
        width="50%"
      >
        <!-- 表单 -->
        <el-form
          ref="editAttrbuteRef"
          :model="editForm"
          label-width="80px"
          :rules="addFormRules"
        >
          <el-form-item :label="Text" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAttrbuteViseble = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择框选中的数据存放的数组
      selectKeys: [],
      // 级联选择框的数据源
      cateList: [],
      cascadeProps: {
        //触发状态
        expandTrigger: "hover",
        //父子关联节点
        children: "children",
        //提交给后台的id
        value: "cat_id",
        //给用户看到的数据
        label: "cat_name"
      },
      //tabs选项卡的激活的面板
      activeName: "many",
      //动态参数列表数据
      manyData: [],
      //静态属性参数列表数据
      onlyData: [],
      //添加属性/参数的对话框的布尔值
      addAttrbuteViseble: false,
      //编辑属性/参数的对话框的布尔值
      editAttrbuteViseble: false,
      //添加的表单对象
      addForm: {
        attr_name: ""
      },
      //修改的表单对象
      editForm: {
        attr_name: "",
        attr_id: ""
      },
      //添加的校验规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入必填信息", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //获取分类数据的方法
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      console.log(res);

      this.cateList = res.data;
    },
    //级联选择框触发的事件
    handleChange() {
      //只允许为三级分类设置相关参数
      console.log(this.selectKeys);
      if (this.selectKeys.length == 0) {
        return (this.manyData = this.onlyData = []);
      }
      this.getParamsList();
    },
    //获取参数列表
    async getParamsList() {
      if (this.selectKeys.length !== 3) {
        return (this.selectKeys = []);
      }
      const { data: res } = await this.$http.get(
        `categories/${this.selectKeys[2]}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      //要在展开行中渲染多个tag标签，需要将data中的attr_vals以空格分隔，转换成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length ? item.attr_vals.split(" ") : [];
        item.inputValue = "";
        item.inputVisible = false;
      });
      this.activeName == "many"
        ? (this.manyData = res.data)
        : (this.onlyData = res.data);
    },
    //tabs切换会触发的方法
    handleClick() {
      // console.log(this.activeName);
      this.getParamsList();
    },
    //重置添加属性表单
    addFormClosed() {
      this.$refs.addAttrbuteRef.resetFields();
    },
    //添加参数/属性
    addParams() {
      this.$refs.addAttrbuteRef.validate(async boo => {
        // console.log(boo);

        if (!boo) {
          return this.$message.error("请输入必填参数");
        }
        const { data: res } = await this.$http.post(
          `categories/${this.selectKeys[2]}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        // console.log(res);

        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.getParamsList();
        this.addAttrbuteViseble = false;
      });
    },
    // 删除属性/参数
    async deleteParam(id) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      //   console.log(result);

      if (result !== "confirm") {
        return this.$message.info("已取消删除");
      }
      //   console.log(id);
      const { data: res } = await this.$http.delete(
        `categories/${this.selectKeys[2]}/attributes/${id}`
      );
      //   console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getParamsList();
    },
    //点击修改提交确定按钮
    async editParams() {
      const { data: res } = await this.$http.put(
        `categories/${this.selectKeys[2]}/attributes/${this.editForm.attr_id}`,
        {
          attr_sel: this.activeName,
          attr_name: this.editForm.attr_name
        }
      );
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("更新失败");
      }
      this.$message.success("更新成功");
      this.getParamsList();
      this.editAttrbuteViseble = false;
    },
    //点击修改参数/属性按钮触发事件
    editParamsBtn(val) {
      this.editAttrbuteViseble = true;
      this.editForm.attr_name = val.attr_name;
      this.editForm.attr_id = val.attr_id;
    },
    handleInputConfirm(row) {
      if (!row.inputValue.trim().length) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      this.saveParams(row);
      row.inputVisible = false;
      row.inputValue = "";
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async saveParams(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.selectKeys[2]}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("添加失败");
      }
      this.$message.success("添加成功");
    },
    removeTag(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveParams(row);
    }
  },
  computed: {
    isdisabled() {
      return this.selectKeys.length == 3 ? false : true;
    },
    Text() {
      return this.activeName == "many" ? "动态参数" : "静态属性";
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="less" scoped>
.casstyle {
  margin-top: 20px;
}
.el-cascader {
  width: 260px;
}
.input-new-tag {
  width: 120px;
}
</style>
