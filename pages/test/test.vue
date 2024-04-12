<template>
  <div>
    <div v-if="loading"></div>
    <div v-else>

      <view class="bk-top">
        <view class="ln-top" :style="textAreaStyle">
          <image class="rw-lf" src="@/static/back.png" @tap="fnGoBack"></image>
          <view class="rw-md">
            <image class="tm-scan" src="@/static/scan1.png" @tap="fnScan"></image>
            <view class="tm-txt" @tap="fnScan"> 扫一扫 </view>
          </view>
          <view class="rw-rg">&nbsp;</view>
        </view>
      </view>

      <view class="bk-content">
        <image class="img" v-if="dtInfo.product_auth_image" :src="dtInfo.product_auth_image" />
        <view>
          <span class="title"> 扫码成功 </span>
        </view>
      </view>
      <div style="margin-top: 25rpx;margin-left: 50rpx;">
        <p v-text="dtInfo.product_name"></p><br>
      </div>

      <view class="bk-container">
        <view style="display: flex; justify-content: space-between;">
          <div>防伪码</div>
          <div>{{currentMsg }}</div>
        </view>
        <view style="display: flex; justify-content: space-between;">
          <div>产地</div>
          <div>
            <p v-text="dtInfo.product_origin"></p>
          </div>
        </view>
        <view style="display: flex; justify-content: space-between;">
          <div>品种</div>
          <div>
            <p v-text="dtInfo.product_variety"></p>
          </div>
        </view>
        <view style="display: flex; justify-content: space-between;">
          <div>大小/重量(约)</div>
          <div>
            <p v-text="dtInfo.product_size"></p>
          </div>
        </view>
        <view style="display: flex; justify-content: space-between;">
          <div>品牌</div>
          <div>
            <p v-text="dtInfo.product_brand"></p>
          </div>
        </view>
      </view>
    </div>
    
  </div>
</template>

<script>
  import { fnScanCode, fnLog } from '@/utils/custom.js'
  export default {
    data() {
      return {
        statusBarTop: 0,
        currentMsg: '',
        loading: true,
        dtInfo: {},
      }
    },
    onLoad() {
      this.loading = false;
      fnLog('onLoad in test page')
    },
    computed: {
      textAreaStyle() {
        return {
          marginTop: `${this.statusBarTop}rpx`,
        };
      },
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
      fnLog('info statusBarTop', info, this.statusBarTop)
      // 获取数据
      // this.fnGetDetail();
    },
    methods: {
      fnGetDetail() {
        let that = this;
        uni.showLoading({
          title: '验证中..'
        });
        uni.request({
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          url: 'https://www.ftd.world/laan/api/4wwws/auth/scan',
          method: 'POST',
          data: {
            token: '225046b9-8462-46f7-8c20-01292dd844b0',
            lang: 'cn',
            code: 'https://c.ftd.world/6YEPG39VBYLNGBW84',
            type: 'ios',
          },
          success: (res) => {
            fnLog('fnGetDetail success', res);
            this.dtInfo = res.data;
          },
          fail: (err) => {
            fnLog('fnGetDetail fail', res);
            // this.response = '请求失败';
          },
          complete: () => {
            uni.hideLoading();
            that.loading = false;
          },
        });
      },
      fnGoBack() {
        uni.switchTab({
          url:'/pages/home/home'
        })
      },
      fnScan() {
        let that = this;
        // 扫码
        fnScanCode().then((rr)=>{
          fnLog('fnScanCode then', rr);
          uni.redirectTo({
            url: '/pages/chenpi/chenpi' + '?sn=' + rr.sn,
          })
        }).catch((rr)=>{
          fnLog('fnScanCode catch', rr);
        })
      },
    }
  };
</script>
<style lang="scss" scoped>
  .bk-top{
    width: 100%;
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
        background: var(--secondary-secondary-50, #ffffff);
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
    /* 固定高度 */
    height: 250px;
    /* 宽度自适应 */
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
    .img {
      /* 宽度自适应 */
      width: 100%;
    }
    .title {
      border-radius: 16px;
      background: var(--secondary-secondary-50, #00aa7f);
      display: flex;
      padding: 8px 12px;
      margin-top: 40rpx;
    }
  }

  .bk-container{
    margin-top: 25rpx;
    margin-left: 50rpx;
    margin-right: 50rpx;
  }
  
  .bk-foot{
    position: fixed;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .check-Scan-record{
      padding: 1.5rem 1.0rem 1.0rem 1.0rem;
      align-items: center;
    }
    .fixed-button {
      border-radius: 30px;
      line-height: 33px;
      color: #FAFAFA;
      background-color: #1C6F55;
    }
  }

  // 弹窗
  .bk-pp-cont{
    background-color: rgba(0, 0, 0, 0.42);
    .popup-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      // justify-content: center;
      padding: 15px;
      margin: 0 15%;
      // border: 5px solid #00aa7f;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
      /* 添加描边的阴影效果 */
      background-color: #ffffff;
    }
    .product-name {
      font-size: calc(16px + 5px);
      font-weight: bold;
      font-family: "宋体", sans-serif;
      word-break: break-all;
    }
    .imgout {
      width: 100%;
      display: flex;
      justify-content: center;
      // border: 5px solid #00aa7f;
    }
    .product-image {
      width: 50%;
      /* text-align: center; */
      // right: 50%;
    }
  }

</style>
