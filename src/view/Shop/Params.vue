<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <div>
        <span>选择商品分类</span>
        <!-- 级联选择框 -->
        <el-cascader
          :options="CateList"
          v-model="selectedKeys"
          @change="CateChanged"
          :props="{
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
            expandTrigger: 'hover',
          }"></el-cascader>
        <!-- 标签页切换列表 -->
        <el-tabs v-model="activeTable" @tab-click="activeTableHandle">
          <!-- 添加动态参数列表 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button
              size="mini"
              :disabled="isButtonDisabled"
              @click="addShowDialogVisible=true">
              添加参数
            </el-button>
            <el-table :data="manyTableData" stripe>
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    :key="item.attr_id"
                    v-for="(item, index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    style="margin-right: 5px;"
                    @close="handleClose(index, scope.row)">
                    {{item}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model.trim="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native = "handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>
              <el-table-column v-slot="scope" label="操作">
                <template>
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    @click="editShowDialog(scope.row)">
                    修改
                  </el-button>
                  <el-button
                    type="warning"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    @click="delShowDialog(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加静态属性列表 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button size="mini" :disabled="isButtonDisabled" @click="addShowDialogVisible=true">添加属性</el-button>
            <el-table :data="onlyTableData" stripe>
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    :key="item.attr_id"
                    v-for="(item, index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    style="margin-right: 5px;"
                    @close="handleClose(index, scope.row)">
                    {{item}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model.trim="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native = "handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="attr_name" label="属性名称">
              </el-table-column>
              <el-table-column v-slot="scope" label="操作">
                <template>
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    @click="editShowDialog(scope.row)">
                    修改
                  </el-button>
                  <el-button
                    type="warning"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    @click="delShowDialog(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!--添加参数与添加属性按钮弹框-->
    <el-dialog :title="'添加'+dialogText" :visible.sync="addShowDialogVisible" @close="addDialogClose">
      <el-form :model="addDialogInput" :rules="addDialogRules" ref="addDialogRef">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="addDialogInput.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShowDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addShowDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表单中的修改按钮 -->
    <el-dialog :title="'修改'+dialogText" :visible.sync="editShowDialogVisible" @close="editDialogClose">
      <el-form :model="editDialogInput" :rules="editDialogRules" ref="editDialogRef">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="editDialogInput.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShowDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editShowDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 获取商品分类数据
      CateList: [],
      // 保存级联选择器分类的ID数组
      selectedKeys: [],
      // 标签页被激活的属性
      activeTable: 'many',
      // 控制两个标签页里面的按钮
      isFlag: true,
      // 标签页many的数据
      manyTableData: [],
      // 标签页only的数据
      onlyTableData: [],
      // 添加动态参数,静态属性按钮弹框
      addShowDialogVisible: false,
      // 存储添加动态参数,静态属性按钮表单绑定
      addDialogInput: {
        attr_name: ''
      },
      // 添加动态参数,静态属性按钮表单规则
      addDialogRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
        ]
      },
      // 编辑按钮弹框触发
      editShowDialogVisible: false,
      // 存储添加动态参数,静态属性按钮表单绑定
      editDialogInput: [],
      // 编辑动态参数,静态属性按钮表单规则
      editDialogRules: {
        attr_name: [
          { required: true, message: '请输入动态参数属性', trigger: 'blur' }
        ]
      }
    }
  },
  /**
   * 实例已经在内存中创建OK,此时data和methods已经被创建成功，此时还没有编译template
   */
  created () {
    this.getCateList()
  },
  methods: {
    /**
     * 获取商品分类的全部数据, 也就是级联选择框
     * @returns {Promise<ElMessageComponent>}
     */
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.CateList = res.data
      // console.log(res.data)
    },
    /**
     * 获取两个表单的数据进行绚烂
     */
    async getCateTable () {
      const { data: res } = await this.$http.get(`categories/${this.selectedKeys[2]}/attributes`, { params: { sel: this.activeTable } })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      res.data.forEach(item => {
        if (item.attr_vals.trim()) {
          item.attr_vals = item.attr_vals.trim().split(' ')
        } else {
          item.attr_vals = []
        }
        // 控制文本框的显示与隐藏, 为每个input的按钮添加boolean值控制
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })
      if (this.activeTable === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      // console.log(res.data)
    },
    /**
     * 级联选择框选择了数据,会触发这个事件
     *    如果选择的是3级分类就会通过, 不是那么就提醒选择3级分类
     *    选择3级分类通过,就会根据所选的id和当前所处的面板,获取对应的参数
     *
     * @constructor
     */
    async CateChanged () {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message.error('请选中三级分类')
      }
      this.getCateTable()
    },
    /**
     * 切换表单内容会触发
     */
    activeTableHandle () {
      // 动态参数table表格被选中
      this.getCateTable()
    },
    /**
     * 添加弹框被点击确定
     */
    addShowDialogSubmit () {
      // console.log(this.addDialogInput)
      this.$refs.addDialogRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.selectedKeys[2]}/attributes`, {
          attr_name: this.addDialogInput.attr_name,
          attr_sel: this.activeTable
        })
        if (res.meta.status !== 201) {
          return this.$message.error(this.meta.msg)
        }
        // console.log(res)
        this.getCateTable()
        this.addShowDialogVisible = false
        return this.$message.success(res.meta.msg)
      })
    },
    /**
     * 清空添加按钮表单重置
     */
    addDialogClose () {
      this.$refs.addDialogRef.resetFields()
    },
    /**
     * 编辑按钮被触发, 然后把参数名称或者属性名称赋值给表单
     */
    editShowDialog (value) {
      // console.log(value)
      this.editDialogInput = value
      this.editShowDialogVisible = true
    },
    /**
     * 编辑按钮被点击确定
     */
    editShowDialogSubmit () {
      this.$refs.editDialogRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.editDialogInput.cat_id}/attributes/${this.editDialogInput.attr_id}`, {
          attr_name: this.editDialogInput.attr_name, attr_sel: this.activeTable
        })
        if (res.meta.status !== 200) {
          return this.$message.error(this.meta.msg)
        }
        this.getCateTable()
        this.editShowDialogVisible = false
      })
    },
    /**
     * 编辑表单被关闭
     */
    editDialogClose () {
      this.$refs.editDialogRef.resetFields()
    },
    /**
     * 删除按钮 $config
     */
    async delShowDialog (value) {
      const result = await this.$confirm('此操作将永久删除文件,是否继续 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      if (result === confirm) {
        return this.$message.error('取消删除')
      }
      // console.log(value)
      const { data: res } = await this.$http.delete(`categories/${value.cat_id}/attributes/${value.attr_id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getCateTable()
      return this.$message.success(res.meta.msg)
    },
    /**
     * 表格下拉小选项后面有个 + New Tag按钮被单击
     *    $nextTick: 当页面上的元素被重新渲染之后,才会指定回调函数中的代码
     */
    async showInput (value) {
      // 显示input
      value.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /**
     *  发送请求修改列表展开行的小项
     *
     * @param {object} value 整个属性的(一行)的数据
     */
    async getAttrVals (value) {
      const { data: res } = await this.$http.put(`categories/${value.cat_id}/attributes/${value.attr_id}`, {
        attr_name: value.attr_name, attr_sel: this.activeTable, attr_vals: value.attr_vals.join(' ')
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    /**
     * 文本框被按下enter,或者失去焦点
     *    - 如果表单输入空格, 失去焦点就会清空
     *    - 隐藏表单, 则显示按钮
     */
    async handleInputConfirm (value) {
      // 显示按钮, 隐藏表单
      value.inputVisible = false
      if (value.inputValue.trim().length === 0) {
        // 表单内容重置
        value.inputValue = ''
        value.inputVisible = false
        return true
      }
      // console.log(value)
      // 输入的内容后续处理
      value.attr_vals.push(value.inputValue.trim())
      value.inputValue = ''
      value.inputVisible = false
      // console.log(value)
      this.getAttrVals(value)
    },
    /**
     *  列表下拉，删除下面对应的的参数与属性
     *
     *  @param {number} index 当前参数或者属性的索引
     *  @param {object} value  整个属性的(一行)的数据
     */
    handleClose (index, value) {
      // 删除一项
      value.attr_vals.splice(value, 1)
      this.getAttrVals(value)
    }
  },
  computed: {
    /**
     * 如果级联选择框选择了, 那么下面标签页的两个button就可以不被禁用
     * @returns {boolean}
     */
    isButtonDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    /**
     * 计算属性监听 button
     * @returns {string}
     */
    dialogText () {
      if (this.activeTable === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }
  }
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 10px;
}
.el-cascader {
  margin-left: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
