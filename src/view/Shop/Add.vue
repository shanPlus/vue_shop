<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 进度条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addRuleForm" :rules="addRules" ref="AddRef" label-position="top">
        <!-- 左侧table栏切换-->
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="activeHandle" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addRuleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addRuleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addRuleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addRuleForm.goods_cat"
                :options="shopList"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                  children: 'children'
                 }"
                @change="cascaderChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              prop="goods_name"
              v-for="item of manyTableData"
              :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(it, i) of item.attr_vals" :key="i" :label="it" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item of onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :headers="headerObj"
              :action="imgUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addRuleForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮-->
            <el-button type="primary" plain class="btnAdd" @click="addShop">添加商品分类</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 显示图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible">
      <img :src="previewPath" alt="商品图片" title="商品图片" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
// 导入js工具库， 用来对象深拷贝
import _ from 'lodash'
export default {
  name: 'Add.vue',
  data () {
    return {
      // 切换上面进度条与table栏切换
      activeIndex: '0',
      // 添加表单里面双向数据绑定这里面
      addRuleForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 级联选择框选择数据存储数据的地方
        goods_cat: [],
        // 上传图片临时路径(对象)
        pics: [],
        // 富文本内容， 商品详情的描述
        goods_introduce: '',
        attrs: []
      },
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      },
      // 存储级联选择框中的分类
      shopList: [],
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 图片上传链接
      imgUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的路径存储
      previewPath: '',
      // 控制对话框的显示与隐藏
      previewVisible: false
    }
  },
  created () {
    this.getShopCat()
  },
  methods: {
    /**
     * 获取商品的所有分类
     *
     * @returns {Promise<void>}
     */
    async getShopCat () {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.shopList = res.data
    },
    /**
     * 切换标签之前的钩子,若返回false或者返回promise且被reject,则阻止借还
     */
    activeHandle (active, old) {
      console.log(active, old)
      if (old === '0' && this.addRuleForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        // 阻止切换
        return false
      }
    },
    /**
     * 级联选择框被触发
     */
    cascaderChange () {
      // console.log(this.shopValue)
      if (this.addRuleForm.goods_cat.length !== 3) {
        this.$message.error('请选择三级分类')
        this.shopValue = ''
      }
    },
    /**
     * tab栏选项被选中就会触发
     *    如果this.activeIndex = 1 动态参数面板就发发送请求, 获取数据
     */
    async tabClicked () {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        // 动态参数面板
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        res.data.forEach(item => {
          if (item.attr_vals.length === 0) {
            item.attr_vals = []
            return false
          }
          item.attr_vals = item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(res.data)
      } else if (this.activeIndex === '2') {
        // 静态属性面板
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    /**
     * 点击文件列表中的文件时的钩子
     *  file: 点击上传图片的名字的时候，会返回上传图片的信息
     */
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    /**
     * 文件列表移除文件时的钩子
     *  file: 将要被移除的信息
     */
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addRuleForm.pics.findIndex(x => x.pic === filePath)
      this.addRuleForm.pics.splice(i, 1)
      console.log(this.addRuleForm.pics)
    },
    /**
     * 监听图片上传成功时间
     *    - response 服务器响应回来的数据
     */
    handleSuccess (response) {
      console.log(response)
      // 拼接得到一个图片信息对象
      const picinfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象， push到数组中
      this.addRuleForm.pics.push(picinfo)
      console.log(this.addRuleForm.pics)
    },
    /**
     * 最后添加整个商品
     *    - 预验证
     */
    addShop () {
      console.log('1111')
      this.$refs.AddRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单信息')
        // 执行添加的业务逻辑, _.cloneDeep深拷贝
        const addRuleFormCopy = _.cloneDeep(this.addRuleForm)
        addRuleFormCopy.goods_cat = addRuleFormCopy.goods_cat.join()
        // // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addRuleForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addRuleForm.attrs.push(newInfo)
        })
        addRuleFormCopy.attr = this.addRuleForm.attrs
        const { data: res } = await this.$http.post('goods', addRuleFormCopy)
        console.log('1111')
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    /**
     * 分类ID
     * @returns {null|*}
     */
    cateId () {
      if (this.addRuleForm.goods_cat.length === 3) {
        return this.addRuleForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
