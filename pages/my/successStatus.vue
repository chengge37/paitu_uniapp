<template>
  <view class="contain">
    <div class="bind-phone">
      <span class="iconfont iconchenggong"></span>
      <span class="success-data">{{successData}}</span>
    </div>

    <div class="confirm" @click="goBack">确认</div>
  </view>
</template>

<script>
// 跳转到这里时，你需要传递三个参数，信息必不可少，其次是类型
// 这个类型是用来觉得你是否需要返回tab页，如果是就传tabBar如果不是就是NotabBar
// 然后是连接，tab不需要完整的链接，只需要tabBar/后的，而非tabBar则需要完整的地址
import { weixin } from "@/common/login/login";
export default {
  data() {
    return {
      successData: "",
      type: "",
      url: ""
    };
  },
  onLoad(e) {
    console.log(e);
    this.successData = e.data;
    this.type = e.type;
    this.url = e.url;
    weixin()
  },
  methods: {
    goBack() {
      switch (this.type) {
        case "tabBar":
          uni.switchTab({
            url: "/pages/tabBar/" + this.url
          });
          break;
        case "NotabBar":
          uni.navigateTo({
            url: this.url
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scope>
page {
  background-color: #ffffff;
}
.contain {
  padding: 40rpx;
}
.bind-phone {
  margin: 50rpx 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  align-items: center;
  span {
    display: block;
  }
  .iconchenggong {
    font-size: 180rpx;
    color: #651fff;
  }
  .success-data {
    font-size: 32rpx;
    color: #333333;
    margin-top: 20rpx;
  }
}
.confirm {
  width: 100%;
  padding: 20rpx 0;
  text-align: center;
  background-color: #651fff;
  color: #ffffff;
  font-size: 32rpx;
}
</style>
