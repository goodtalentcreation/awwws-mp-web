<template>
  <view class="profile">
    <!-- <view class="avatar">
      <image class="avatar-image" :src="avatarUrl"></image>
      <text class="username">{{ nickName }}</text>
    </view> -->
    <view class="avatar">
      <image class="avatar-image" src="https://cos.awwws.cn/applet/avatar.jpg"></image>
      <text class="username">用户名</text>
    </view>
    <view class="small-font">户口</view>
    <view class="profile-item" @click="fnLinkTo('maQRcode')">
      <image class="icon" src="@/static/qrcode-icon.png"></image>我的二维码
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnLinkTo('household')">
      <image class="icon" src="@/static/my.png"></image>户口
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnLinkTo('changePassword')">
      <image class="icon" src="@/static/changePassword.png"></image>更改密码
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnLinkTo('email')">
      <image class="icon" src="@/static/email.png"></image>邮箱
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnLinkTo('phone')">
      <image class="icon" src="@/static/phone.png"></image>联系电话
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnLinkTo('scanRecords')">
      <image class="icon" src="@/static/scanRecords.png"></image>扫码记录
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnLinkTo('myShop')">
      <image class="icon" src="@/static/myShop.png"></image>我的商铺
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="small-font">关于</view>
    <view class="profile-item" @click="fnLinkTo('language')">
      <image class="icon" src="@/static/language.png"></image>语言
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnLinkTo('privacyPolicy')">
      <image class="icon" src="@/static/privacyPolicy.png"></image>隐私政策
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnLinkTo('terms')">
      <image class="icon" src="@/static/terms.png"></image>条款及细则
      <image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
    <view class="profile-item" @click="fnDoLogout">登出<image class="arrow-icon" src="@/static/arrow-icon.png"></image>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        avatarUrl: '',
        nickName: ''
      };
    },
    mounted() {
      this.getUserInfo();
    },
    onShow() {
      getApp().globalData.lastIndex = 2; // 记录上一个 tabBar 页面的标识: 1=首页; 2=扫码; 3=个人中心
    },
    methods: {
      getUserInfo() {
        // #ifndef H5
          uni.getUserInfo({
            success: (res) => {
              this.fnLog('getUserInfo success', res)
              this.avatarUrl = res.userInfo.avatarUrl; // 更新头像URL
              this.nickName = res.userInfo.nickName; // 更新用户名
            },
            fail: (res) => {
              this.fnLog('getUserInfo fail', res)
            }
          });
        // #endif
      },
      fnLinkTo(type){
        this.fnLog('fnLinkTo', type)
      },
      fnDoLogout(){
        this.fnLog('fnDoLogout')
      },
      fnLog(...args){
        if(getApp().globalData.dbg){
          console.log(...args)
        }
      }
    },
  }
</script>

<style lang="scss">
  .profile {
    padding: 20px;
  }

  .arrow-icon {
    width: 18px;
    height: 18px;
    margin-left: auto;
  }

  .profile-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    font-size: 16px;
    color: #000000;
    border-bottom: 1px solid #ddd;
  }

  .avatar {
    display: flex;
    align-items: center;
  }

  .avatar-image {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
    /* 将头像样式修改为圆形 */
  }

  .icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    color: #000000;
  }

  .small-font {
    padding: 8px 0;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
    margin-top: 10px;
  }
</style>