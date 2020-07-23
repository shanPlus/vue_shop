<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图-->
      <el-card>
        <!-- 搜索框与添加用户按钮 -->
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model.trim="queryInfo.query"
          clearable
          @clear="getShopList">
          <el-button slot="append" icon="el-icon-search" @click="getShopList"></el-button>
        </el-input>
        <el-button type="primary" plain @click="goAddPage">添加商品</el-button>

        <!-- 表格 -->
        <el-table  stripe style="width: 100%" :data="tableData">
          <!-- 添加索引列 -->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称">
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(RMB)">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量">
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间">
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-tooltip content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDelDialog(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!-- 编辑商品Dialog弹框 -->
    </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      tableData: [],
      // 获取商品列表参数列表
      queryInfo: {
        // 查询的参数
        query: '',
        // 当前的页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 总商品数量
      total: 0,
      // 添加商品dialog弹框
      addShopDialogVisible: false
    }
  },
  created () {
    this.getShopList()
  },
  methods: {
    /**
     * 商品列表数据获取
     * @returns {Promise<void>}
     */
    async getShopList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.goods.forEach(item => {
        item.add_time = new Date(item.add_time).toLocaleString()
      })
      this.tableData = res.data.goods
      this.total = res.data.total
      console.log(this.tableData)
    },
    /**
     *   每页显示多少条数据被更改就会被触发
     * @param {number} newSize  每页显示的新数据
     */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getShopList()
    },
    /**
     * 页数发生改变就会触发
     * @param {number} newNum 最新页
     */
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getShopList()
    },
    async goAddPage () {
      this.$router.push('/goods/add')
    },
    async showEditDialog () {},
    /**
     * 根据商品id删除商品
     * @param {object} value 一个商品的所有信息
     */
    async showDelDialog (value) {
      const result = await this.$confirm('此操作将永久删除该商品,是否继续?', '提示', {
        configButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== confirm) return this.$message.error('取消删除商品')
      const { data: res } = await this.$http.delete('goods' + value.goods_id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getShopList()
    }
  }
}
</script>

<style lang="scss" scoped>
.input-with-select {
  max-width: 300px;
  min-width: 200px;
  width: 40%;
  + .el-button {
    float: right;
  }
}
</style>
