<template>
  <el-container class="home_container">
  <el-header>
      <div>
          <div class="left">
              <img src="../assets/heima.png" alt="">
              电商后台管理系统
          </div>
           <el-button type="info" @click="logout">退出</el-button>
      </div>
  </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
data(){

},
methods:{
    logout(){
        //跳转到login页面
        this.$router.push('/login');
        //清除token
        sessionStorage.clear();
        //退出成功提示
        this.$message.success('退出成功')
    }
}
}
</script>

<style lang="less" scope>
.home_container{
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding-left: 0;
    >div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .left {
      font-size: 20px;
      color: #fff;
      img {
        vertical-align: middle;
        margin-right: 20px;
      }
    }
  }
}

</style>
