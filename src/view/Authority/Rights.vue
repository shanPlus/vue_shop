<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
        <el-table :data="rightsList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column prop="authName" label="权限名称">
          </el-table-column>
          <el-table-column prop="path" label="路径">
          </el-table-column>
          <el-table-column label="权限等级">
            <template v-slot="scope">
              <el-tag v-if="scope.row.level === '0'"> 一 级 </el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'"> 二 级 </el-tag>
              <el-tag type="warning" v-else-if="scope.row.level === '2'"> 三 级 </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  /**
   * 实例已经在内存中创建OK,此时data和methods已经被创建成功，此时还没有编译template
   */
  created () {
    // 获取所有的权限函数
    this.getRightsList()
  },
  methods: {
    /**
     * 获取角色列表的信息
     *
     * @returns {Promise<ElMessageComponent>}
     */
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      return this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style scoped>

</style>
