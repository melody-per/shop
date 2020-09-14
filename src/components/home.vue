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
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="toggle_btn" @click="isCollapse=!isCollapse">| | |</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :default-active="activePath"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      >
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="savePath('/'+subItem.path)"><span class="el-icon-menu"></span>{{subItem.authName}}</el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
data(){
  return {
  // 左侧菜单数据
  menulist:[],
  iconObj:{
    '125':'iconfont icon-user',
    '103':'iconfont icon-tijikongjian',
    '101':'iconfont icon-shangpin',
    '102':'iconfont icon-danju',
    '145':'iconfont icon-baobiao',
  },
  activePath:'',
  isCollapse: false
  }
},
created(){
  //钩子函数中调用获取左侧数据方法
   this.getMenuList()
   this.activePath=sessionStorage.getItem('path')
},
methods:{
    logout(){
        //跳转到login页面
        this.$router.push('/login');
        //清除token
        sessionStorage.clear();
        //退出成功提示
        this.$message.success('退出成功')
    },
    //获取左侧菜单列表数据
    async getMenuList(){
      const {data : res}= await this.$http('menus')

      if(res.meta.status !==200) return this.$message.error('获取数据失败，请稍后重试');
      // console.log(res);
      this.menulist=res.data;
    },
    //修改激活路径
    savePath(path){
        console.log(path);
        this.activePath=path;
        //将路径保存到本地存储中
        sessionStorage.setItem('path',path)
        
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
  .el-aside{
    height: 100%;
    background-color: #333744;
    .iconfont{
      margin-right: 10px;
    }
    .toggle_btn {
      color:#fff;
      // letter-spacing: 5px;
      text-align: center;
      background-color: #373d41;
      cursor: pointer;

    }
    .el-menu {
      border-right: 0;
    }
  }
}
 

</style>
