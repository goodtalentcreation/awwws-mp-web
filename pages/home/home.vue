<template>
  <!-- <view style="padding: 20px;">
    <navigator url="/pages/test/test"><button type="primary">test</button></navigator>
  </view> -->
  <view class="firstSH">
    <image class='awwwslogo' src='https://cos.awwws.cn/applet/awwwslogo.png'></image>
    <view class="search">
      <text class="text">水果名称/商铺名称</text>
      <image class='saixuan' src='@/static/filter.png'></image>
    </view>
    <image class='sousuo' src='@/static/search.png'></image>
  </view>
  <view class='promote'>推介</view>
  <view class="container">
    <scroll-view class="image-scroll" scroll-x>
      <view class="image-item" v-for="(item, index) in itemList" :key="index">
        <view class="image-container">
          <image :src="item.image" class="image"></image>
          <text class="image-desc">{{ item.description }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
  <view class='activity'>活动</view>
  <view>
    <swiper class="swiper-box" @change="change">
      <swiper-item v-for="(item ,index) in info" :key="index">
        <image class="swiper-item" :src="item.content"></image>
      </swiper-item>
    </swiper>
    <uni-swiper-dot :info="info" :current="current" field="content" :mode="mode">
      <view class="custom-dots">
        <view v-for="(item, index) in info" :key="index" class="custom-dot"></view>
      </view>
    </uni-swiper-dot>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        itemList: [{
            image: 'https://cos.awwws.cn/applet/秋月梨.jpg',
            description: '秋月梨'
          },
          {
            image: 'https://cos.awwws.cn/applet/陈皮礼盒装.jpg',
            description: '陈皮礼盒装'
          },
          {
            image: 'https://cos.awwws.cn/applet/小庚柑普洱茶.jpg',
            description: '小庚柑普洱茶'
          },
          {
            image: 'https://cos.awwws.cn/applet/红提.jpg',
            description: '红提'
          },
          {
            image: 'https://cos.awwws.cn/applet/麒麟果.jpg',
            description: '麒麟果'
          },
          {
            image: 'https://cos.awwws.cn/applet/王林苹果.jpg',
            description: '王林苹果'
          },
        ],
        info: [{
            content: 'https://cos.awwws.cn/applet/活动1.jpg'
          },
          {
            content: 'https://cos.awwws.cn/applet/活动2.jpg'
          },
          {
            content: 'https://cos.awwws.cn/applet/活动3.jpg'
          },
          {
            content: 'https://cos.awwws.cn/applet/活动4.jpg'
          },
          {
            content: 'https://cos.awwws.cn/applet/活动5.jpg'
          },
        ],
        current: 0,
        mode: 'round',
      };
    },
    created() {
      // let that = this;
    },
    methods: {
      change(e) {
        this.current = e.detail.current;
      }
    },
    onShow() {
      getApp().globalData.lastIndex = 1; // 记录上一个 tabBar 页面的标识: 1=首页; 2=扫码; 3=个人中心
    },
  };
</script>

<style>
  .firstSH {
    display: flex;
    /* 将第一个元素固定在左侧 */
    justify-content: flex-start;
    padding: 0 10px;
    margin-top: 15px;
  }

  .firstSH>view:not(:first-child) {
    /* 调整第二个及后续元素之间的间距 */
    margin-left: 10px;
  }

  .awwwslogo {
    width: 9vw;
    height: 9vw;
    border-radius: 5px;
    /* 添加描边的阴影效果 */
    box-shadow: 0 0 7px rgba(0, 0, 0, 0.3);
  }

  .search {
    width: 75%;
    height: 32px;
    border-radius: 15px;
    border: 2px solid #646464;
    background-color: #f3f3f3;
    display: flex;
    margin-left: 7%;
    font-size: 15px;
  }

  .text {
    margin-left: 8px;
    font-size: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--secondary-secondary-850, #868686);
  }

  .saixuan {
    display: flex;
    width: 8vw;
    height: 8vw;
    margin-left: 48%
  }

  .sousuo {
    display: flex;
    width: 8vw;
    height: 8vw;
    margin-left: 3%
  }

  .promote {
    margin-left: 15px;
    margin-top: 20px;
    /* font-family: Sen; */
    font-size: 18px;
    font-weight: 700;
  }

  .activity {
    margin-left: 15px;
    /* font-family: Sen; */
    font-size: 18px;
    font-weight: 700;
    margin-top: 15px;
  }

  .container {
    width: 100%;
    /* 设置滚动区域的高度 */
    height: 100px;
    margin-left: 10px;
    margin-top: 15px;

  }

  .image-scroll {
    /* 横向排列 */
    white-space: nowrap;
    height: 100%;
    show-scrollbar: false;
  }

  .image-scroll ::-webkit-scrollbar {
    appearance: none;
    color: transparent;
    display: none;
    width: 0;
    height: 0;
  }

  .image-item {
    /* 横向排列 */
    display: inline-block;
    /* 图片之间的间距 */
    margin-right: 15px;
  }

  .image-container {
    text-align: center;
  }

  .image {
    /* 图片宽度 */
    width: 70px;
    /* 图片高度 */
    height: 70px;
    border-radius: 10px;
    /* 添加描边的阴影效果 */
    box-shadow: 0 0 7px rgba(0, 0, 0, 0.3);
  }

  .image-desc {
    /* 文字和图片的间距 */
    margin-top: 5px;
    /* 让文字显示在图片下方 */
    display: block;
    font-size: 9px;

  }

  .swiper-box {
    width: 100%;
    margin-top: 15px;
    overflow-x: auto;
    white-space: nowrap;
    /* 让图片在横幅中居中显示 */
    text-align: center;
    /* 设置高度 */
    height: 230px;
  }


  .swiper-item {
    /* 图片宽度填满父元素 */
    width: 95%;
    /* 图片高度填满父元素 */
    height: 100%;
    border-radius: 15px;
  }

  .custom-dots {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    height: 20px;
  }
</style>