<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <el-steps :active="activename - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :label-position="'top'"
        label-width="80px"
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activename"
          @tab-click="handleClick"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="good_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="good_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascadeProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="(item, i) in manyData"
              :key="i"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                  :label="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headerobj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <button type="primary" class="add" @click="addGoods">
              添加商品
            </button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog title="预览" :visible.sync="previewDialogVisible" width="50%">
        <img :src="previewUrl" alt width="100%" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activename: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_cat: [],
        goods_weight: 0,
        goods_number: 0,
        pics: [],
        goods_introduce: '',
        attrs:[],
      },
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [{ required: true, message: "请现在分类", trigger: "blur" }]
      },
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
      manyData: [],
      onlyData: [],
      headerobj: {
        Authorization: sessionStorage.getItem("token")
      },
      previewDialogVisible: false,
      previewUrl: "",
      url: "http://127.0.0.1:8888/api/private/v1/upload"
    };
  },
  methods: {
    async getData(sel) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.addForm.goods_cat[2]}/attributes`,
        { params: { sel } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品参数失败");
      }
      // console.log(this.addForm.goods_cat);

      return res.data;
    },
    async handleClick() {
      // console.log(this.activename);
      //获取动态参数
      if (this.activename == 1) {
        this.manyData = await this.getData("many");
        this.manyData.forEach(item => {
          item.attr_vals = item.attr_vals.split(" ");
        });
      } else if (this.activename == 2) {
        //获取静态属性
        this.onlyData = await this.getData("only");
      }
      console.log(this.manyData);
      console.log(this.onlyData);
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品失败");
      }
      this.cateList = res.data;
    },
    beforeLeave(newTab, oldTab) {
      //newTab是tab跳转之后的name属性的值，oldTab是tab跳转之前的name属性的值
      if (oldTab === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请输入分类");
        return false;
      }
    },
    //上传成功的图书点击预览的时候触发的钩子
    handlePreview(file) {
      // console.log(file);
      this.previewDialogVisible = true;
      this.previewUrl = file.response.data.url;
    },
    //移除图片触发的钩子
    handleRemove(file) {
      // console.log(file);
      const i = this.addForm.pics.findIndex(
        item => item.pic === file.response.data.tmp_path
      );
      this.addForm.pics.splice(i, 1);
    },
    //图片上传成功触发的钩子
    handleSuccess(response, file) {
      //response参数只是响应对象
      // console.log(response);
      //file包含图片的详细信息  file中包含response
      // console.log(file);
      this.addForm.pics.push({
        pic: response.data.tmp_path
      });
    },
    //添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async boo => {
        if (!boo) {
          return this.$message.error("请填写完整的信息");
        }
        this.manyData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          }
          this.addForm.attrs.push(obj)
        });
        this.onlyData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(obj)
        });
     
      // console.log("12");
      var newform=JSON.parse(JSON.stringify(this.addForm))
      newform.goods_cat=newform.goods_cat.join(',')
      console.log(newform);
      const { data : res }=await this.$http.post('goods',newform);
      if(res.meta.status!==201){
        return this.$message.error('添加商品失败')
      }
      this.$message.success('添加商品成功');
      this.$router.push('/goods')
       });
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="less" scope>
.el-steps {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 15px;
}
.quill-editor {
  height: 300px;
}
.el-checkbox {
  margin-right: 10px;
}
.add {
  margin-top: 15px;
}
</style>
