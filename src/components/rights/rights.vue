<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table border stripe :data="rightList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="evel" label="等级">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scoped.row.level == 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  //数据
  data() {
    return {
      rightList: []
    };
  },

  //方法
  methods: {
    async getrightList() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.rightList = res.data;
    }
  },

  //钩子函数
  created() {
    this.getrightList();
  }

  //结束
};
</script>

<style></style>
