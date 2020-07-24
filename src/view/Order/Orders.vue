<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图-->
    <el-card>
      <!-- 搜索框与添加用户按钮 -->
      <el-input placeholder="请输入订单号" class="input-with-select" v-model="queryInfo.query" @clear="getOrdersList" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
      </el-input>
      <el-table  stripe style="width: 100%" :data="tableData">
        <!-- 添加索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="warning" else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{new Date(scope.row.create_time).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              plain
              class="el-icon-edit"
              @click="editShowBox"
              size="mini"></el-button>
            <el-button
              type="success"
              plain
              class="el-icon-location-outline"
              size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" @close="addressDialogClose">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-position="top">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="showProgressBox">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 展示物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  name: 'Orders',
  data () {
    return {
      // 订单数据列表
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示的条数
        pagesize: 5
      },
      // 存储表单数据
      tableData: [],
      // 数据总条数
      total: 0,
      // 编辑按钮被触发,弹出框
      addressVisible: false,
      // 修改地址的存储信息
      addressForm: {
        // 省市区/县
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      // 存储城市, 二级联动
      cityData,
      // 控制物流进度弹框
      progressVisible: false,
      // 快递信息
      progressInfo: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    /**
     * 获取订单列表数据
     * @returns {Promise<ElMessageComponent>}
     */
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.tableData = res.data.goods
      this.total = res.data.total
    },
    /**
     * 当每页显示多少条数据被更改就会被触发
     *
     * @param newSize  最新的每页显示多少条数据
     */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    /**
     * 当前的页码值页改变就会被触发
     *
     * @param newNum  最新页码值
     */
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrdersList()
    },
    /**
     * 修改按钮被触发: 修改的是地址
     */
    editShowBox () {
      this.addressVisible = true
    },
    /**
     * 监听修改地址对话框被关闭
     */
    addressDialogClose () {
      this.$refs.addressFormRef.resetFields()
    },
    /**
     * 展示物流进度的对话框
     */
    async showProgressBox () {
      const { data: res } = await this.$http.get('kuaidi/804909574412544580')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.progressInfo = res.data
      // console.log(this.progressInfo)
      this.progressVisible = true
    }
  }
}
</script>

<style scoped>
.input-with-select {
  max-width: 300px;
  min-width: 200px;
  width: 40%;
}
.el-pagination {
  width: 100%;
}
</style>
