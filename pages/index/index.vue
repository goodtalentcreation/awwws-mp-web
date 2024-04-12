<template>
  <view v-if="dbgCurr" class="ln-scan">
    <button class="text" @click="goToPage()">test</button>
    <button class="text" @click="fnLinkRet()">=>扫描结果页</button>
    <button class="text" @click="fnLinkErr()">=>扫码失败页</button>
    <button class="text" @click="fnLinkFeed()">=>反馈页面</button>
    <image class="scan" src="@/static/scan1.png" @tap="fnScan()"></image>
  </view>
  <view v-else></view>
</template>

<script>
  import { fnScanCode } from '@/utils/custom.js'
  export default {
    data() {
      return {
        dbgCurr: false, // 是否调试:true=开启;false=关闭
      };
    },
    // onLoad 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
    onLoad() {
      // getApp().globalData.lastIndex = 2; // 记录上一个 tabBar 页面的标识: 1=首页; 2=扫码; 3=个人中心
      this.fnLog('onLoad in 扫码页面');
      // 正式时
      if(!this.dbgCurr){
        this.fnScan();
      }
    },
    methods: {
      fnLinkRet(){
        let snMark = '4BB2A05F6BF9'; // pro
        snMark = "93C0D0CDFA54-1"; // dev
        uni.navigateTo({
          url: '/pages/chenpi/chenpi' + '?sn=' + snMark,
        })
      },
      fnLinkErr(){
        uni.navigateTo({url: '/pages/scanError/scanError'})
      },
      fnLinkFeed(){
        let snMark = '4BB2A05F6BF9';
        uni.navigateTo({
          url: '/pages/fankui/fankui' + '?sn=' + snMark,
        })
      },
      fnScan() {
        let that = this;
        // 扫码
        fnScanCode().then((rr)=>{
          that.fnLog('fnScanCode then', rr);
          uni.showLoading({
            title: '验证中..',
          });
          // 关闭当前页面，跳转到应用内的某个页面。
          uni.redirectTo({
            url: '/pages/chenpi/chenpi' + '?sn=' + rr.sn,
          })
        }).catch((rr)=>{
          that.fnLog('fnScanCode catch', rr);
          if(rr.type == 'unknown_scan_result_type'){
            // 未知类型的二维码
            uni.redirectTo({url:'/pages/scanError/scanError'})
          }else{
            // H5不支持扫码功能 || 扫码失败  => 跳转Tbar页面
            uni.showToast({
              title: rr.msg,
              duration: 2000
            });
            setTimeout(()=>{
              that.fnLinkTbar();
            }, 2000)
          }
        })
      },
      fnLinkTbar(){
        // 记录上一个 tabBar 页面的标识: 1=首页; 2=扫码; 3=个人中心
        let lastIndex = getApp().globalData.lastIndex;
        if (lastIndex === 3) {
          uni.switchTab({url: '/pages/my/my'});
        }else{
          uni.switchTab({url: '/pages/home/home'});
        }
      },
      goToPage() {
        uni.navigateTo({
          url: '/pages/test/test'
        });
      },
      fnLog(...args){
        if(getApp().globalData.dbg){
          console.log(...args)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ln-scan {
    height: 100vh;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    .text{
      border:1px solid #ddd;
      border-radius: 4px;
      padding:20px;
      margin-bottom: 50px;
    }
    .scan{
      width: 200rpx;
      height: 200rpx;
      border:1px solid #ddd;
    }
  }
</style>