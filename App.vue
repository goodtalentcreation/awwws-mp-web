<script>
  export default {
    globalData:{
      apiDomain: 'https://manage.awwws.cn:10000', // 请求接口前缀: 正式
      // apiDomain: 'http://180.180.1.222:9000', // 请求接口前缀: 开发
      lastIndex: 0, // 记录上一个 tabBar 页面的标识: 1=首页; 2=扫码; 3=个人中心
      dbg: false, // 是否开启调试: true=开启;false=关闭。在对应的页面console.log调试
    },
    onLaunch: function() {
      console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
      console.log('App Launch')
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    },
  }
</script>

<style lang="scss">

  /*每个页面公共css */
  @import '@/uni_modules/uni-scss/index.scss';
  /* #ifndef APP-NVUE */
  @import '@/static/customicons.css';
  // 设置整个项目的背景色
  page {
    background-color: #f8f8f8;
  }

  /* #endif */
  .example-info {
    font-size: 14px;
    color: #333;
    padding: 10px;
  }
</style>
