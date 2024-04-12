<template>
  <view>
    <uni-card class="bk-item">
      <view class="tm-title">联系方式（必填）</view>
      <view class="tm-desc">请填写联系方式，以便我们进一步推进</view>
      <view class="ln-contact">
        <input class="tm-ipt" placeholder="姓名（必填）:" @input="fnOnNameChange" :maxlength="60" />
        <input class="tm-ipt" placeholder="手机号或微信ID（必填）:" @input="fnOnPhoneChange" :maxlength="20" />
      </view>
    </uni-card>
    <uni-card class="bk-item">
      <view class="ln-type">
        <picker @change="fnOnTypeChange" range-key="name" :value="currTypeIndex" :range="listType">
          <view class="rw-type">
            <view class="tm-title">反馈类型（必选）</view>
            <view class="tm-txt">{{listType[currTypeIndex].name}}</view>
          </view>
        </picker>
      </view>
      <view class="ln-desc">
        <view class="tm-title">反馈描述（必填）</view>
        <textarea class="tm-text" placeholder="请说说你的建议或问题" :maxlength="500" @input="fnOnDescChange"></textarea>
      </view>
    </uni-card>
    <uni-card class="bk-item bk-img">
      <view class="tm-title">添加图片</view>
      <view class="tm-desc">请上传相关的产品照片及产品二维码标签</view>
      <view class="ln-list">
        <image class="tm-img" v-for="(url, index) in listImg" :key="index" :src="url" mode="aspectFit"></image>
      </view>
      <view class="ln-opt">
          <button class="tm-btn" @click="chooseImage">上传</button>
      </view>
    </uni-card>
    <view class="bk-foot">
      <div class="check-Scan-record">
        <button class="fixed-button" :class="[subDisabled?'':'btn-ok']" :disabled="subDisabled" @click="submitFeedback">提交反馈</button>
      </div>
    </view>
  </view>
</template>

<script>
  import { getNestedProperty } from '@/utils/custom.js'
  export default {
    data() {
      return {
        listImg: [], // 上传后的图片列表
        name: '',
        phoneNumber: '',
        feedback: '',
        snMark: '',
        feedbackType: 3, // 反馈类型枚举
        currTypeIndex: 2, // 当前选中的[反馈类型枚举]的下标
        listType: [
          {value:1, name:'产品投诉建议'},
          {value:2, name:'商务咨询合作'},
          {value:3, name:'App意见反馈'},
          {value:10, name:'其他问题'},
        ],
        opting:false, // 是否操作中
      };
    },
    onLoad(option){
      this.snMark = option.sn;
      this.fnLog('onLoad option', option, this.snMark)
    },
    computed:{
      subDisabled() {
        if(this.name && this.phoneNumber && this.feedback && this.snMark && !this.opting){
          return false;
        }
        return true;
      },
    },
    methods: {
      fnOnNameChange(ret){
        this.name = ret.detail.value;
      },
      fnOnPhoneChange(ret){
        this.phoneNumber = ret.detail.value;
      },
      fnOnDescChange(ret){
        this.feedback = ret.detail.value;
      },
      fnOnTypeChange(ret){
        let that = this;
        that.currTypeIndex = ret.detail.value;
        that.feedbackType = that.listType[that.currTypeIndex].value;
        that.fnLog('fnOnTypeChange', that.feedbackType, that.listType[that.currTypeIndex], ret); // 选中信息
      },
      chooseImage() {
        uni.showActionSheet({
          itemList: ['从相册选择', '拍照'],
          success: (res) => {
            if (res.tapIndex === 0) {
              // 从相册选择图片
              this.chooseImageFromAlbum();
            } else if (res.tapIndex === 1) {
              // 拍照
              this.takePhoto();
            }
          }
        });
      },
      chooseImageFromAlbum() {
        let that = this;
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success: (chooseImageRes) => {
            // 处理选择图片后的逻辑
            that.fnLog('选择的图片路径：', chooseImageRes.tempFilePaths[0]);
            this.uploadImage(chooseImageRes.tempFilePaths[0]);
          }
        });
      },

      takePhoto() {
        let that = this;
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera'],
          success: (chooseImageRes) => {
            // 处理拍照后的逻辑
            that.fnLog('拍照的图片路径：', chooseImageRes.tempFilePaths[0]);
            this.uploadImage(chooseImageRes.tempFilePaths[0]);
          }
        });
      },

      uploadImage(imagePath) {
        var that = this
        return new Promise((resolve, reject) => {
          uni.showLoading({
            title: '上传中...'
          });
          const apiDomain = getApp().globalData.apiDomain; // 请求接口前缀
          uni.uploadFile({
            url: `${apiDomain}/awwws-system/sys_api/v1/public/feedback/images`,
            filePath: imagePath,
            name: 'files',
            header: {
              'Accept-Language': 'zh-CN',
            },
            success: (res) => {
              that.fnLog('uploadImage success', res);
              const responseData = JSON.parse(res.data);
              if (responseData && responseData.data && responseData.data.length > 0) {
                const fullUrl = responseData.data[0].fullUrl;
                that.fnLog('上传成功，图片完整 URL:', fullUrl);
                that.listImg.push(fullUrl);
              } else {
                that.fnLog('未找到 fullUrl');
              }
            },
            fail: (res) => {
              that.fnLog('uploadImage fail', res);
            },
            complete: () => {
              uni.hideLoading();
            },
          });
        });
      },

      // 提交反馈
      submitFeedback() {
        let that = this;
        if(that.opting){return false;} // 操作中
        that.opting = true;
        let data = {
          labelSN: this.snMark,
          feedbackType: this.feedbackType, // 反馈类型枚举
          contact: '',
          userName: this.name,
          mobile: this.phoneNumber,
          wechatId: "",
          feedbackContent: this.feedback,
          submitPlatformType: 1, // 反馈提交平台类型枚举: 1=Awwws小程序
          showImgUrls: this.listImg,
        };
        const apiDomain = getApp().globalData.apiDomain; // 请求接口前缀
        uni.showLoading({title: '加载中...'});
        uni.request({
          url: `${apiDomain}/awwws-system/sys_api/v1/public/feedback/add`,
          method: 'POST',
          header: {
            'Accept-Language': 'zh-CN',
          },
          data: data,
          success: (res) => {
            that.fnLog('submitFeedback success', res);
            uni.hideLoading();
            const code = getNestedProperty(res, 'data.code', '');
            if(code==='00000'){
              uni.showToast({
                title: '反馈成功',
                icon: 'success',
                duration: 2000 // 2秒
              });
              uni.navigateBack({delta: 1});
            }else{
              // 失败
              const msg = getNestedProperty(res, 'data.msg', '反馈失败');
              uni.showToast({
                title: msg,
                icon: 'error',
                duration: 2000 // 2秒
              });
            }
          },
          fail: (res) => {
            that.fnLog('submitFeedback fail', res);
            uni.hideLoading();
            uni.showToast({
              title: '反馈失败，请联系管理员',
              icon: 'none',
              duration: 2000
            });
          },
          complete: () => {
            that.opting = false;
          },
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

<style scoped lang="scss">
.bk-item{
  border-radius: 10px;
  .tm-title{
    color: $uni-main-color;
    font-size: 16px;
  }
  .tm-desc{
    color: $uni-secondary-color;
    font-size: 14px;
    padding-left: 10px;
    line-height: 30px;
  }
  .ln-contact{
    .tm-ipt{
      color: black;
      border: none;
      outline: none;
      font-size: 14px;
      height: 80rpx;
      border-bottom: 1px solid #EDEDED;
    }
  }
  .ln-type{
    border-bottom: 1px solid #EDEDED;
    .rw-type{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tm-txt{
        height: 80rpx;
        line-height: 80rpx;
        color: $uni-main-color;
        padding-left: 10px;
      }
    }
  }
  .ln-desc{
    padding-top: 15px;
    .tm-text{
      color: grey;
      border: none;
      outline: none;
      font-size: 14px;
      margin-top: 5px;
    }
  }
}
.bk-img{
  position: relative;
  min-height: 500rpx;
  .ln-list{
    width: 100%;
    min-height: 145px;
    padding-top: 20rpx;
    .tm-img{
      display: inline-block;
      width: 90px;
      height: 90px;
      border-radius: 8rpx;
      margin: 0px 10px 10px 0px;
      vertical-align: middle;
    }
  }
  .ln-opt{
    .tm-btn{
      border-radius: 5px;
      width: 80px;
      height: 40px;
      line-height: 40px;
      background-color: azure;
    }
  }
}
.bk-foot{
  position:relative;
  bottom: 0px;
  width: 100%;
  .check-Scan-record {
    padding: 1.0rem 1.0rem 7rem 1.0rem;
    align-items: center;
  }
  .fixed-button {
    border-radius: 5px;
    line-height: 40px;
  }
  .btn-ok{
    color: #FAFAFA;
    background-color: $aws-btn-main;
  }
}
</style>