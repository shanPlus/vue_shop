<template>
  <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域-->
      <el-card>
        <!-- 添加分类 -->
        <el-button type="primary" plain @click="showAddCateDialog">添加分类</el-button>
        <!-- 表格区域 -->
        <zk-table
          :data="catelist"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          max-height="60"
          index-text="#"
          show-index
          strope
          border>
          <!-- 是否有效 -->
          <template v-slot:isok="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted===true"
              style="color: #409EFF"></i>
            <i
              class="el-icon-error"
              v-else-if="scope.row.cat_deleted === false"
              style="color: #F56C6C"></i>
          </template>
          <!-- 排序一列 -->
          <template v-slot:order="scope">
            <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.cat_level === 2">三级</el-tag>
          </template>
          <!-- 操作一列 -->
          <template v-slot:opt>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-search" size="mini">删除</el-button>
          </template>
        </zk-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="queryinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!-- 添加分类弹框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="showCateDialogVisible"
        @close="addCateDialogClosed">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="AddCateFormRes">
          <el-form-item label="添加分类" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- option: 数据源 -->
            <!-- expandTrigger: hover鼠标滑过触发-->
            <el-cascader
              clearable
              :options="parentCateList"
              :props = "{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true}"
              v-model="selectedKeys"
              @change="parentCateChanged">
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="showCateDialog">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return {
      // 商品分类的数据列表
      catelist: [],
      // 请求参数
      queryinfo: {
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 当前每页显示的数据
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列定义为模板列
          type: 'template',
          // 具名插槽
          template: 'isok'
        },
        {
          label: '排序',
          // 当前列定义为模板列
          type: 'template',
          // 具名插槽
          template: 'order'
        },
        {
          label: '操作',
          // 当前列定义为模板列
          type: 'template',
          // 具名插槽
          template: 'opt'
        }
      ],
      // 添加分类弹框控制
      showCateDialogVisible: false,
      // 添加分类表单数据对象
      addCateForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 默认是一级分类，分类等级
        cat_level: 0
      },
      // 添加分类表单验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' }
        ]
      },
      // 添加分类，父级分类存储信息
      parentCateList: [],
      // 保存选中父级分类的ID数组
      selectedKeys: []
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
     * 获取商品分类的全部数据
     * @returns {Promise<ElMessageComponent>}
     */
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryinfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catelist = res.data.result
      // console.log(res.data)
      this.total = res.data.total
    },
    /**
     * 当每页显示多少条数据被更改就会被触发
     *
     * @param newSize  最新的每页显示多少条数据
     */
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryinfo.pagesize = newSize
      this.getCateList()
    },
    /**
     * 当前的页码值页改变就会被触发
     *
     * @param newNum  最新页码值
     */
    handleCurrentChange (newNum) {
      this.queryinfo.pagenum = newNum
      this.getCateList()
    },
    /**
     * 单机 添加分类 分类按钮触发
     * @returns {Promise<void>}
     */
    async showAddCateDialog () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
      this.showCateDialogVisible = true
    },
    /**
     * 添加分类弹框 被点击确定
     *    1. 预验证表单
     *    2. 发起添加分类请求
     */
    showCateDialog () {
      this.$refs.AddCateFormRes.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.getCateList()
        this.showCateDialogVisible = false
      })
    },
    /**
     * 选择项发生变化,就会触发
     *  selectedKeys.length = 0
     *    - 父级分类没有被选中,那么cat_pid = 0
     *    - 没有父级分类,那么自己就是父级分类,分类等级为:0 cat_level=0
     *  selectedKeys.length > 0
     *    - 有父级分类, 那么父级的id为 cat_pid
     *    - 属于第几级分类: 看返回的长度,长度为1,那么是二级分类, 长度为2,那么是三级分类
     */
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 父级分类被选中
      if (this.selectedKeys.length > 0) {
        // 将要添加对象的名称
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // console.log(this.addCateForm.cat_pid)
        // length = 1 那么分类等级为二级分类, =2 那么分类等级为三级分类
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      // 父级分类为0 代表没有父级分类
      this.addCateForm.cat_pid = 0
      // 0 代表一级分类
      this.addCateForm.cat_level = 0
    },
    /**
     * 监听添加分类弹框被关闭
     *      1. 重置表单数据
     *      2. 清空父级分类里面的数据,清空级联选择框
     *      3.请空等级分类与父级分类
     */
    addCateDialogClosed () {
      this.$refs.AddCateFormRes.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style scoped>
.zk-table {
  margin-top: 20px;
}
.el-icon-error:before {
  font-size: 18px
}
.el-cascader {
  width: 100%;
}
</style>
