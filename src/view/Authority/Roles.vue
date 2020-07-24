<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!--添加角色按钮-->
      <el-button type="primary" plain @click="addRolesDialogVisible=true">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, i1) of scope.row.children"
              :key="item1.id"
              :class="['dbbottom', i1 === 0?'dbtop':'', 'vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="4" >
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限-->
              <el-col :span="20">
                <el-row
                  v-for="(item2, i2) of item1.children"
                  :key="item2.id"
                  :class="[i2 === 0?'':'dbtop', 'vcenter']">
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) of item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleName" label="角色描述">
        </el-table-column>
        <el-table-column label="操作" width="300vw">
          <!-- 这里的scope.row给函数， 然后getLeafKey递归拿去所有的三级节点-->
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRoles(scope.row)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="showSetRightDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesDialogVisible"
        @close="addRolesDialogClose">
        <el-form :model="addRolesForm" :rules="addRolesRules" ref="addRolesRef">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model.trim="addRolesForm.roleName" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model.trim="addRolesForm.roleDesc" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRolesDialog">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 编辑弹框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisible"
      @close="editRolesDialogClose">
      <el-form :model="editRolesForm" :rules="editRolesRules" ref="editRolesRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="editRolesForm.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="editRolesForm.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesDialog">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限对话框"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="clearDefKeys">
      <!-- 树型控件 -->
      <el-tree
        :data = "rightslist"
        :props="treeProps"
        :default-checked-keys="defKeys"
        ref="treeRef"
        node-key="id"
        show-checkbox
        default-expand-all>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      // 控制权限对话框显示和隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树型控件的分支结构
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 添加角色Dialog弹框
      addRolesDialogVisible: false,
      // 添加角色信息绑定
      addRolesForm: {
        // 角色名称
        roleName: '',
        // 角色描述
        roleDesc: ''
      },
      // 添加角色信息验证
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 编辑弹框控制
      editRolesDialogVisible: false,
      // 编辑弹框信息绑定
      editRolesForm: {
        // 角色名称
        roleName: '',
        // 角色描述
        roleDesc: ''
      },
      // 编辑角色信息验证
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  /**
   * 实例已经在内存中创建OK,此时data和methods已经被创建成功，此时还没有编译template
   */
  created () {
    this.getRolesList()
  },
  methods: {
    /**
     * 获取角色列表的所有数据数据
     */
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
    },
    /**
     *  列表下拉，权限删除
     *     把MessageBox组件挂载到Vue的peototype上，用this.$confirm访问
     *
     *  @param {Object} role 当前删除权限与权限分支
     *  @param {number} rightId 当前删除权限(子权限)的id
     */
    async removeRightById (role, rightId) {
      // 弹窗, 注意$confirm必须全局挂载
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.error('取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 这里不用this.getRolesList来更新列表， 用这个更新列表导致整个网页刷新
      // res.data每次请求成功都会返回，最新的数据，然后把他赋值给权限列表
      role.children = res.data
      return this.$message.success('删除该权限成功')
    },
    /**
     * 点击分配按钮权限，弹窗显示现在已有的权限
     *
     * @param role  点击当前角色描述所拥有的信息权限
     * @returns {Promise<ElMessageComponent>}
     */
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightslist = res.data
      // console.log(role)
      // console.log(this.rightslist)
      // 获取三级节点ID
      this.getLeafKeys(role, this.defKeys)
      // console.log(this.defKeys)
      // 单击后显示权限对话框
      this.setRightDialogVisible = true
    },
    // 通过递归函数拿取第三节点的所有权限，保存到defKeys中(这个三级节点是表单下面隐藏的权限)
    /**
     * 通过递归函数拿取点击分配权限的角色三级节点(当前角色所拥有的权限), 并保存到defkeys中
     *
     * @param node 当前角色所拥有的所有节点(不包含没有拥有的)
     * @param arr 当前节点存储位置
     * @returns {Arr}  返回当前角色所拥有的全部三级节点id
     */
    getLeafKeys (node, arr) {
      // 如果当前节点不包含children属性，说明是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    /**
     * 每次关闭分配权限弹窗就会清除，关闭弹框前所拥有的三级节点id
     */
    clearDefKeys () {
      this.defKeys = []
    },
    /**
     * 给角色分配权限
     * 分配权限弹窗被确定
     *
     * @returns {Promise<void>}
     */
    async allotRights () {
      // 获取所有的单选和半选状态的id
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      // console.log(idStr)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    /**
     * 删除角色
     */
    async delRoles (val) {
      // console.log(val)
      const result = await this.$confirm('是否确定删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.error('取消删除该用户')
      const { data: res } = await this.$http.delete('roles/' + val.id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    /**
     * 添加角色
     */
    addRolesDialog () {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    },
    /**
     * 听见添加角色按钮弹框关闭
     */
    addRolesDialogClose () {
      this.$refs.addRolesRef.resetFields()
    },
    /**
     * 编辑按钮被触发
     */
    async editRoles (value) {
      // console.log(value)
      const { data: res } = await this.$http.get('roles/' + value.id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      Object.assign(this.editRolesForm, res.data)
      // console.log(this.editRolesForm)
      this.editRolesDialogVisible = true
    },
    /**
     * 监听编辑按钮被点击确定
     */
    editRolesDialog () {
      this.$refs.editRolesRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId, {
          roleName: this.editRolesForm.roleName, roleDesc: this.editRolesForm.roleDesc
        })
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.editRolesDialogVisible = false
      })
    },
    /**
     * 监听编辑弹框被关闭
     */
    editRolesDialogClose () {
      this.$refs.editRolesRef.resetFields()
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
