<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图-->
    <el-card>
      <!-- 搜索框与添加用户按钮 -->
      <el-input placeholder="请输入登录名" class="input-with-select" v-model="queryInfo.query" @clear="getUserList" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
      <el-button type="primary" plain @click="addDialogVisible = true">添加用户</el-button>

      <!-- 表格 -->
      <el-table  stripe style="width: 100%" :data="tableData">
        <!-- 添加索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120px">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="120px">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="120px">
        </el-table-column>
        <el-table-column label="状态" width="90px">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDelDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 点击添加用户弹出的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="AddHandleClose">
      <el-form :model="addUserInfo" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserInfo.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password">
          <el-input v-model="addUserInfo.password" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" prop="email">
          <el-input v-model="addUserInfo.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手 机" prop="mobile">
          <el-input v-model="addUserInfo.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddUserSubmit">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" @close="editHandleClose">
      <el-form :model="editUserInfo" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserInfo.username" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" prop="email">
          <el-input v-model="editUserInfo.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手 机" prop="mobile">
          <el-input v-model="editUserInfo.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserSubmit">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 删除用户弹出框 -->
    <el-dialog title="删除用户" :visible.sync="delDialogVisible"  >
      <span>请输入 <span class="delFont">{{delUserInfo.username}}</span>,然后确认删除</span>
      <el-input v-model="delUserData" class="delInput" placeholder="请输入上面红色的字体用户名"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置分配角色弹出框 -->
    <el-dialog title="分配角色" :visible.sync="setDialogVisible"  @close="setHandleClose">
      <div>
        <p>当前用户：{{userinfo.username}}</p>
        <p>当前角色：{{userinfo.role_name}}</p>
        <p>分配角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User.vue',
  data () {
    // 自定义校验规则, value 用户输入的值
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      console.log(regEmail.test(value))
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      console.log(regMobile.test(value))
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表参数对象
      queryInfo: {
        // 查询的关键字: 登录名
        query: '',
        // 当前页码值
        pagenum: 1,
        // 当前每页显示的数据
        pagesize: 2
      },
      tableData: [],
      total: 0,
      // 添加用户的弹窗
      addDialogVisible: false,
      // 修改用户的弹窗
      editDialogVisible: false,
      // 删除用户弹窗
      delDialogVisible: false,
      // 分配角色用户弹窗
      setDialogVisible: false,
      // 添加用户的信息
      addUserInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 保存编辑请求信息
      editUserInfo: {},
      // 保存查询需要删除用户的信息
      delUserInfo: {},
      // 删除输入框 中的内容
      delUserData: '',
      // 分配角色信息存储
      userinfo: '',
      // 角色列表信息
      rolesList: [],
      // 已选中的角色ID值
      selectedRoleId: '',
      // 添加用户的校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户的校验规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  /**
   * 实例已经在内存中创建OK,此时data和methods已经被创建成功，此时还没有编译template
   */
  created () {
    this.getUserList()
  },
  methods: {
    /**
     * 获取所有用户名与数据
     *
     * @returns {Promise<ElMessageComponent>}
     */
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.tableData = res.data.users
      this.total = res.data.total
      // console.log(this.tableData)
    },
    /**
     * 当每页显示多少条数据被更改就会被触发
     *
     * @param newSize  最新的每页显示多少条数据
     */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    /**
     * 当前的页码值页改变就会被触发
     *
     * @param newNum  最新页码值
     */
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getUserList()
    },
    /**
     * 监听用户状态被改变
     *
     * @param data 当前用户的所有数据
     * @returns {Promise<ElMessageComponent>}
     */
    async userStateChange (data) {
      // console.log(data)
      const { data: res } = await this.$http.put(`users/${data.id}/state/${data.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        data.mg_state = !data.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('更新用户状态成功')
    },
    /**
     * 监听添加用户弹框被关闭，然后初始化弹框表单
     *
     * @constructor
     */
    AddHandleClose () {
      this.$refs.addFormRef.resetFields()
    },
    /**
     * 监听添加用户弹框被点击确定， 添加用户
     *
     * @constructor
     */
    AddUserSubmit () {
      // 表单预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加请求
        const { data: res } = await this.$http.post('/users', this.addUserInfo)
        console.log(res)
        if (res.meta.status === 201) {
          this.addDialogVisible = false
          this.getUserList()
          return this.$message.success(res.meta.msg)
        }
        return this.$message.error(res.meta.msg)
      })
    },
    /**
     * 修改按钮被触发, 根据用户id查询当前用户的信息
     *
     * @param id  当前被点击编辑的用户id
     * @returns {Promise<ElMessageComponent>}
     */
    async showEditDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('查询信息失败')
      this.editUserInfo = res.data
      this.editDialogVisible = true
    },
    /**
     * 编辑按钮弹框被提交
     *  1. 预验证
     *  2. 发请求
     *  3. 关闭弹框， 更新数据， 提示用户
     */
    editUserSubmit () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息请求
        const info = this.editUserInfo
        const { data: res } = await this.$http.put('users/' + info.id, { email: info.email, mobile: info.mobile })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('更新信息失败')
        this.editDialogVisible = false
        this.getUserList()
        return this.$message.success(res.meta.msg)
      })
    },
    /**
     * 编辑按钮弹窗被关闭，初始化弹窗的内容
     */
    editHandleClose () {
      this.$refs.editFormRef.resetFields()
    },
    /**
     * 根据当前用户的id查询给用户的信息，并弹框
     *
     * @param id  获取当前用户的id值
     * @returns {Promise<void>}
     */
    async showDelDialog (id) {
      // 查询的点击用户
      const { data: res } = await this.$http.get('users/' + id)
      this.delUserInfo = res.data
      this.delDialogVisible = true
    },
    /**
     * 用户表单输入该用户名提交就可以删除当前的用户
     *
     * @returns {Promise<ElMessageComponent>}
     */
    async delUserSubmit () {
      if (this.delUserData !== this.delUserInfo.username) {
        this.delUserData = ''
        return this.$message.error('删除的用户不一致')
      }
      const { data: res } = await this.$http.delete('users/' + this.delUserInfo.id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      // 当前页的数据等于1， 那么删除成功就跳转上一页
      if (this.tableData.length === 1 && this.queryInfo.pagenum !== 1) {
        this.queryInfo.pagenum -= 1
        // console.log(this.queryInfo.pagenum)
      }
      this.delUserData = ''
      this.getUserList()
      this.delDialogVisible = false
      return this.$message.success('删除用户成功')
    },
    /**
     * 点击设置按钮，弹出分配角色弹出框
     *
     * @param {number} userinfo 当前被点击的用户的信息
     * @returns {Promise<void>}
     */
    async showSetDialog (userinfo) {
      this.userinfo = userinfo
      // 获取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
      console.log(this.rolesList)
      this.setDialogVisible = true
    },
    /**
     * 分配角色弹框，被确定了，那么就把下拉框里面的角色保存到当前用户信息中
     */
    async setUserSubmit () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setDialogVisible = false
    },
    /**
     * 监听分配角色弹框被关闭
     */
    setHandleClose () {
      // 清空 下拉框上一次的内容
      this.selectedRoleId = ''
      // 清空 分配角色弹框的内容
      this.userinfo = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
}
.input-with-select {
  max-width: 300px;
  min-width: 200px;
  width: 40%;
  + .el-button {
    float: right;
  }
}
.delInput {
  margin-top: 20px;
  margin-bottom: 20px;
}
.delFont {
  color: red;
  font-weight: 700;
  font-size: 18px;
  background: #e4e4e4;
}
.el-dialog div p {
  margin-bottom: 10px;
}
</style>
