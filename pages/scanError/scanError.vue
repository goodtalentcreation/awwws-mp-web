<template>
  <view class="bk-top">
    <view class="ln-top" :style="textAreaStyle">
      <image class="rw-lf" src="@/static/back.png" @tap="fnGoBack"></image>
      <view class="rw-md">
        <image class="tm-scan" src="@/static/scan1.png" @tap="fnScan"></image>
        <view class="tm-txt" @tap="fnScan"> 重新扫码 </view>
      </view>
      <view class="rw-rg">&nbsp;</view>
    </view>
  </view>
  <view class="bk-content">
    <view class="text">抱歉，从产品未能被识别</view>
    <view class="text">请再次扫描或联系产品供应商</view>
    <view class="text">如有任何关于Awwws微信小程序的疑问，请发邮件至遨世有限公司客服部：cs@awwws.world</view>
    <view class="text">我们会尽快回复。</view>
  </view>
  <view class="bk-foot">
    <div class="check-Scan-record">
      <button class="fixed-button" @click="fnContact">联系我们</button>
    </div>
    <!-- <div class="check-Scan-record">
      <button class="fixed-button" @click="fnShowFankui">提交反馈</button>
    </div> -->
  </view>
</template>

<script>
  import { fnScanCode } from '@/utils/custom.js'
  export default {
    data() {
      return {
        statusBarTop: 0, // 导航栏与状态栏拉开距离  margin-top: statusBarTop + 'rpx'; 
      }
    },
    computed: {
      textAreaStyle() {
        return {
          marginTop: `${this.statusBarTop}rpx`,
        };
      }
    },
    mounted() {
      const info = uni.getSystemInfoSync(); // 获取系统信息的同步接口
      // 1.获取屏幕可使用宽度
      const windowWidth = info.windowWidth;
      // 2.获取状态栏高度
      const statusBarHeight = info.statusBarHeight;
      // 5.导航栏与状态栏拉开距离  margin-top: statusBarTop + 'rpx'; 
      this.statusBarTop = statusBarHeight * (750 / windowWidth);
      // 调试
      this.fnLog('info statusBarTop', info, this.statusBarTop)
    },
    methods: {
      fnGoBack() {
        // 记录上一个 tabBar 页面的标识: 1=首页; 2=扫码; 3=个人中心
        let lastIndex = getApp().globalData.lastIndex;
        if (lastIndex === 3) {
          uni.switchTab({url: '/pages/my/my'});
        }else{
          // 默认回到首页
          uni.switchTab({url: '/pages/home/home'});
        }
      },
      fnScan() {
        let that = this;
        // 扫码
        fnScanCode().then((rr)=>{
          that.fnLog('fnScanCode then', rr);
          uni.redirectTo({
            url: '/pages/chenpi/chenpi' + '?sn=' + rr.sn,
          })
        }).catch((rr)=>{
          that.fnLog('fnScanCode catch', rr);
          if(rr.type == 'unknown_scan_result_type'){
            // 未知类型的二维码
            uni.showToast({title: rr.msg, duration: 2000});
          }else{
            // H5不支持扫码功能 || 扫码失败  => 跳转Tbar页面
            // uni.showToast({title: rr.msg, duration: 2000});
          }
        })
      },
      fnContact(){
        this.fnLog('联系我们 fnContact');
      },
      fnShowFankui() {
        uni.navigateTo({
          url: '/pages/fankui/fankui'
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
.bk-top{
  width: 100%;
  background: #db0101;
  .ln-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 16px;
    // background: 'var(--secondary-secondary-50, #00aa7f)',
    .rw-lf {
      height: 40rpx;
      width: 40rpx;
      padding: 16rpx 24rpx;
    }
    .rw-md {
      display: flex;
      align-items: center;
      border-radius: 16px;
      // background: var(--secondary-secondary-50, #ffffff);
      
      /* 设置背景颜色的透明度为 0.8 */
      background: rgba(255, 255, 255, 0.7);
      
      /* 添加描边的阴影效果 */
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      padding: 6rpx 20rpx;
      margin: 16rpx 24rpx;
      .tm-scan {
        height: 40rpx;
        width: 40rpx;
        margin-right: 10px;
      }
      .tm-txt {
        color: #333;
        font-size: 12px;
      }
    }
    .rw-rg{
      height: 40rpx;
      width: 40rpx;
      padding: 16rpx 24rpx;
    }
  }
}

.bk-content{
  display: flex;
  flex-direction: column;
  margin-top: 50rpx;
  margin-left: 50rpx;
  .text {
    font-size: 30rpx;
    margin-bottom: 25rpx;
    text-align: left;
  }
}

.bk-foot{
  position: fixed;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  .check-Scan-record {
    padding: 1.5rem 1.0rem 1.0rem 1.0rem;
    align-items: center;
  }
  
  .fixed-button {
    border-radius: 5px;
    line-height: 40px;
    color: #FAFAFA;
    background-color: #7b00b8;
  }
}
</style>