<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图-->
    <el-card>
      <!-- 为ECharts准备一个具备大小(宽高)的DOM -->
      <div id="main" style="width: 750px; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'Reports',
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  /**
   * 实例已经在内存中创建OK,此时data和methods已经被创建成功，此时还没有编译template
   */
  created () {
  },
  /**
   * 虚拟dom已经被渲染到真实的dom上边,在这个生命周期里面可以做, 数据请求, 赋值操作属性等
   */
  async mounted () {
    // 这个时候已经准备好了dom, 初始化echarts实例就可以了
    const myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    // 准备数据和配置项
    const result = _.merge(res.data, this.options)
    // 展示数据
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style scoped>

</style>
