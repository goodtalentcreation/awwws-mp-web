<template>
  <view class="pg-body">
    <view v-if="loading"></view>
    <view v-else>

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

      <view class="bk-main">
        <view class="bk-content">
          <view v-if="dtInfo.exhibitionImgUrls && dtInfo.exhibitionImgUrls.length">
            <swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
              <swiper-item v-for="(vv, kk) in dtInfo.exhibitionImgUrls" :key="kk">
                <view class="swiper-item">
                  <image class="tm-img" :src="vv" mode="heightFix" @click="fnPreview(kk, dtInfo.exhibitionImgUrls)"></image>
                </view>
              </swiper-item>
            </swiper>
          </view>
        </view>

        <view class="bk-container" :style="stylePaddingBottom">
          <view class="ln-ok">
            <view class="tm-txt"> 认证成功 </view>
          </view>
          <view class="ln-title">
            <view class="tm-txt">{{dtInfo.name}}</view>
          </view>
          <view class="ln-list">
            <view v-for="(vv,kk) in dtShowList" :key="kk">
              <view class="ln-item" v-if="vv.value">
                <view class="tm-label">{{ vv.name }}</view>
                <view class="tm-txt">{{ vv.value }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="bk-foot" v-if="snValid">
        <view class="ln-opt">
          <button class="tm-btn" @click="fnShowFankui">提交反馈</button>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
  import { fnScanCode, getNestedProperty } from '@/utils/custom.js'
  export default {
    data() {
      return {
        loading: true,
        statusBarTop: 0, // 导航栏与状态栏拉开距离  margin-top: statusBarTop + 'rpx'; 
        snMark: '', // 标签sn
        snValid: false, // 标签是否有效
        dtInfo: {}, // 结果详情
        dtShowList: [], // 详情-展现列表  {type:'status', value:'', name:''},
        dtShowOrder: [
          // 展现顺序
          {type:'status'              , name:'产品状态'},
          {type:'parentProductName'   , name:'母产品名'},
          {type:'belongBrandName'     , name:'所属品牌'},
          {type:'fruitTypeName'       , name:'水果品类'},
          {type:'region'              , name:'原产地'},
          {type:'regionCode'          , name:'原产地区域编码'},
          {type:'orchardName'         , name:'果园名称'},
          {type:'harvestPeriod'       , name:'采收期'},
          {type:'shelfLifeDays'       , name:'保质期天数'},
          {type:'listingMonth'        , name:'上市月份'},
          {type:'productGrade'        , name:'水果等级说明'},
          {type:'nutritionalValue'    , name:'营养价值'},
          {type:'description'         , name:'描述'}, 
        ],
      };
    },
    onLoad(option){
      this.snMark = option.sn;
      this.fnLog('onLoad option', option, this.snMark)
      this.loading = true;
    },
    onShow() {
      // 调试
      // this.loading = false;
    },
    computed: {
      textAreaStyle() {
        return {
          paddingTop: `${this.statusBarTop}rpx`,
        };
      },
      stylePaddingBottom() {
        return {
          paddingBottom: `${this.statusBarTop}rpx`,
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
      this.fnLog('info statusBarTop', info, this.statusBarTop)
      // 获取数据
      this.fnGetDetail();
    },
    methods: {
      fnGetDetail() {
        let that = this;
        let snMark = that.snMark;
        if(!snMark){
          that.fnLog('获取标签信息失败')
          uni.redirectTo({url: '/pages/scanError/scanError'});
          uni.hideLoading();
          return false;
        }
        uni.showLoading({
          title: '验证中..',
        });
        const apiDomain = getApp().globalData.apiDomain; // 请求接口前缀
        uni.request({
          header: {
            'Accept-Language': 'zh-CN',
          },
          url: `${apiDomain}/awwws-label/common/api/v1/printLabel/productInfo/sn/${snMark}`,
          method: 'GET',
          success: (res) => {
            that.fnLog('fnGetDetail success', res, snMark);
            const code = getNestedProperty(res, 'data.code', '');
            if(code!=='00000'){
              // 失败
              uni.redirectTo({url: '/pages/scanError/scanError'});
            }else{
              // 成功
              that.dtInfo = getNestedProperty(res, 'data.data', {});
              let list = [];
              that.dtShowOrder.forEach((vv)=>{
                list.push({type:vv.type, value:that.dtInfo[vv.type], name:vv.name})
              })
              // that.fnLog('展现顺序 list', list)
              that.dtShowList = list;
              that.snValid = true; // 标签有效
              that.loading = false;
            }
          },
          fail: (err) => {
            that.fnLog('fnGetDetail fail', res, snMark);
            uni.redirectTo({url: '/pages/scanError/scanError'});
            // this.response = '请求失败';
          },
          complete: () => {
            uni.hideLoading();
          },
        });
      },
      // 预览图片
      fnPreview(index, list){
        uni.previewImage({
          urls:list,
          current:index
        })
      },
      // 返回
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
            uni.redirectTo({url:'/pages/scanError/scanError'})
          }else{
            // H5不支持扫码功能 || 扫码失败  => 跳转Tbar页面
            // uni.showToast({title: rr.msg, duration: 2000});
          }
        })
      },
      fnShowFankui() {
        let that = this;
        uni.navigateTo({
          url: '/pages/fankui/fankui' + '?sn=' + that.snMark,
        });
      },
      fnLog(...args){
        if(getApp().globalData.dbg){
          console.log(...args)
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
.pg-body{
  height: 100vh;
  overflow: hidden;
  .bk-main{
    height: calc(100vh - 88rpx - 160rpx);
    overflow: auto;
  }
}
.bk-top{
  width: 100%;
  .ln-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    background-color: #f8f8f8;
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
  padding-top: 20rpx;
  .swiper {
    height: 400upx;
    .swiper-item {
      display: flex;
      justify-content: center;
      height: 400upx;
    }
    .tm-img{
      width: 100%;
      height: 100%;
    }
  }
}
.bk-container{
  padding: 0rpx 50rpx;
  .ln-ok{
    display: flex;
    justify-content: center;
    padding-top: 40rpx;
    .tm-txt{
      border-radius: 16px;
      background: $aws-txt-ok;
      padding: 8px 12px;
      color:#FFFFFF;
    }
  }
  .ln-title{
    padding-top: 25rpx;
    .tm-txt{
      font-size: 16px;
      font-weight: 600;
    }
  }
  .ln-list{
    padding-top: 25rpx;
    padding-bottom: 100rpx;
    .ln-item{
      display: flex;
      padding: 10rpx 0rpx;
      border-top: 1px solid #efefef;
      font-size: 28rpx;
      .tm-label{
        flex-shrink: 0;
        line-height: 20px;
        color: #07855e;
        width: 200rpx;
        padding-right: 20rpx;
      }
    }
  }
}

.bk-foot{
  position: fixed;
  bottom: 0px;
  width: 100%;
  .ln-opt{
    display: flex;
    justify-content: center;
    padding: 40rpx;
    background-color: #f8f8f8;
  }
  .tm-btn {
    font-size: 32rpx;
    color: #FAFAFA;
    line-height: 40rpx;
    background-color: $aws-btn-main;
    border-radius: 32rpx;
    padding: 20rpx 30rpx;
  }
}
</style>