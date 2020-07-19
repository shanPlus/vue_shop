<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
html, body, #app, section {
  width: 100%;
  height: 100%;
}
h1, h2,h3,h4,h5,h6, body, a, p, ul, li, ol, dd, dt,dl,form, input,button {
  padding: 0;
  margin: 0;
}
img {
  border: 0px
}
@font-face {
  font-family: 'iconfont';
  src: url('./assets/font_icon/iconfont.eot');
  src: url('./assets/font_icon/iconfont.eot?#iefix') format('embedded-opentype'),
  url('./assets/font_icon/iconfont.woff2') format('woff2'),
  url('./assets/font_icon/iconfont.woff') format('woff'),
  url('./assets/font_icon/iconfont.ttf') format('truetype'),
  url('./assets/font_icon/iconfont.svg#iconfont') format('svg');
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* 面包屑导航 */
.el-breadcrumb {
  font-size: 12px;
  margin-bottom: 20px;
}
/*  卡片视图 */
.el-card {
  min-width: 900px;
}
</style>
