<template>
  <div class="login-container">
    <!--登录组件-->
    <img src="../assets/logo.png" alt="头像" title="头像">
    <el-form ref="refFormLogin" :model="loginData" :rules="loginFormRules" >
      <el-form-item label="账 号: " prop="username">
        <el-input v-model="loginData.username" clearable placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密 码: " prop="password">
        <el-input v-model="loginData.password" clearable show-password placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-button type="primary" plain @click="submitClick">登 录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginData: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitClick () {
      // 点击后马上进行表单预验证
      this.$refs.refFormLogin.validate(async valid => {
        // 预验证valid 返回false 不发送请求
        if (valid) {
          const { data: res } = await this.$http.post('/login', this.loginData)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            // 登录成功
            // 将服务器发送到客户端的token保存下来, 保存到sessionStorage中
            window.sessionStorage.setItem('token', res.data.token)
            window.sessionStorage.setItem('User', this.loginData.username)
            // 页面跳转
            this.$router.push('/home')
          }
        } else {
          this.$message.error('登录失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 300px;
  padding: 20px;
  transform: translate(-50%, -50%);
  box-shadow: 2px -2px 10px #e4e4e4;
  img {
    display: block;
    width: 100px;
    height: 100px;
    margin-left: 85px;
    margin-bottom: 10px;
  }
  .el-button {
    width: 100%;
  }
}
</style>
