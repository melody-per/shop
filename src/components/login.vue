<template>
  <div class="login">
    <div class="login_box">
        <div class="logo">
            <img src="../assets/logo.png" alt="">
        </div>
         <!-- 表单区域 --> 
        <el-form class="form" :model='formmsg' :rules="loginRules" ref="loginformRef">
            <!-- 账号 -->
            <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user-solid" v-model="formmsg.username"></el-input >
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" v-model="formmsg.password"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLogin">重置</el-button>
            </el-form-item>
            </el-form>
    </div>
  </div>
</template>

<script>
export default {
data(){
    return {
        formmsg:{
            username: "1",
            password: "2",
        },
        loginRules:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
        }
       
    };
},
methods: {
resetLogin() {
  this.$refs.loginformRef.resetFields();
},
login() {
  this.$refs.loginformRef.validate(async valid=> {
    if(!valid) return;
    // console.log(this);
    const { data: res }=await this.$http.post("login", this.formmsg);
    if(res.meta.status != 200) return this.$message.error("登录失败！");
    this.$message.success("登录成功！")
    console.log(res);
    sessionStorage.setItem('token', res.data.token)
    this.$router.push('/home') 
  });
}
}

};
</script>

<style lang="less" scope>
.login {
    width: 100%;
    height: 100%;
    background-color: #2b4b6b;
    .login_box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 2px 3px 3px rgba(255, 255, 255, .6);
        .logo {
            position: absolute;
            left: 50%;
            top: -75px;
            transform: translateX(-50%);
            width: 130px;
            height: 130px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 50%;
            overflow: hidden;
            padding: 10px;
            img {
                width: 100%;
                background-color: #ccc;
                border-radius: 50%;
            } 
        }
        .form {
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                .btns {
                    float: right;
                }
            }    
    }
}
</style>
