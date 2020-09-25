<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        stripe
        border
        show-index
        :expand-type="false"
        class="tree_table_style"
      >
        <!-- 是否有效列 -->
        <template slot="isDeleted" scope="scope">
          <span
            class="el-icon-success success_icon"
            v-if="scope.row.cat_deleted == false"
          ></span>
          <span class="el-icon-error error_icon" v-else></span>
        </template>
        <!-- 排序列 -->
        <template slot="level" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="opt" scope="scope">
          {{ scope.row.cat_id }}
          <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total - 0"
      ></el-pagination>
      <!-- 添加分类 -->

      <el-dialog
        title="提示"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateFormClosed"
      >
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="addFormRules"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectValue"
              :options="addCateList"
              :props="cascadeProps"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
        type: 3
      },
      cateList: [],
      total: "",
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isDeleted"
        },
        {
          label: "分类名称",
          prop: "cat_level",
          type: "template",
          template: "level"
        },
        {
          label: "操作",
          prop: "cat_opt",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialogVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      },
      // addForm: {
      //   cateName: ""
      // },
      // newaddForm: {
      //   cat_pid: "",
      //   cat_name: "",
      //   cat_level: ""
      // },
      addFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //级联选择器框中的数据
      selectValue: [],
      //添加分类的数据源  只要2级分类的数组
      addCateList: [],
      //级联选择器的配置项
      cascadeProps: {
        //触发状态
        expandTrigger: "hover",
        //父子关联节点
        children: "children",
        //提交给后台的id
        value: "cat_id",
        //给用户看到的数据
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  methods: {
    async getDoodsCate() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      //   console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },

    handleSizeChange(newval) {
      this.queryInfo.pagesize = newval;
      this.getDoodsCate();
    },
    handleCurrentChange(newval) {
      this.queryInfo.pagenum = newval;
      this.getDoodsCate();
    },

    handleChange() {
      console.log(this.selectValue);
      if (this.selectValue.length == 0) {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      } else {
        this.addForm.cat_level = this.selectValue.length;
        this.addForm.cat_pid = this.selectValue[this.selectValue.length - 1];
      }
    },
    addCate() {
      this.$refs.addFormRef.validate(async boo => {
        if (!boo) {
          return this.$message.error("请输入要添加的分类名称");
        }
        const { data: res } = await this.$http.post("categories", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.getDoodsCate();
        this.addCateDialogVisible = false;
      });
    },

    // handleChange(val) {
    //   // val是所选分类的cat_id的数组
    //   //   console.log(val);
    //   this.newaddForm.cat_pid = val[val.length - 1];
    //   this.newaddForm.cat_level = val.length;
    // },
    // //点击确定按钮 提交分类
    // async addCateForm() {
    //   this.newaddForm.cat_name = this.addForm.cateName;
    //   const { data: res } = await this.$http.post(
    //     "categories",
    //     this.newaddForm
    //   );
    //   console.log(res);

    //   if (res.meta.status !== 201) {
    //     return this.$message.error("添加失败");
    //   }
    //   this.getDoodsCate();
    //   this.addCateFormClosed();
    // },
    //点击添加按钮
    async showAddCateDialog() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      //   console.log(res);
      // console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("请稍后重试");
      }
      this.addCateList = res.data;

      this.addCateDialogVisible = true;
    },
    //关闭添加分类框
    addCateFormClosed() {
      this.$refs.addFormRef.resetFields();
      this.selectValue = [];
      this.addForm.cat_pid = 0;
      this.addForm.cat_level = 0;

      //getDoodsCate();
    }
  },
  created() {
    this.getDoodsCate();
  }

  //结束
};
</script>

<style>
.success_icon {
  color: #90ee90;
}
.error_icon {
  color: #e92322;
}
.tree_table_style {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
