<template>
  <view class="contain">
    <div class="bind-phone">
      <div>
        <input
          v-model="upload.name"
          type="text"
          class="phone-input"
          placeholder="请输入真实姓名"
          placeholder-style="color:#999999"
        />
      </div>
      <div>
        <input
          v-model="upload.card"
          type="text"
          class="phone-input"
          placeholder="身份证号码与真实姓名对应"
          placeholder-style="color:#999999"
        />
      </div>
    </div>

    <div class="confirm" @click="confirm">确认</div>
  </view>
</template>

<script>
import { user } from "@/common/api/api";
export default {
  data() {
    return {
      upload: {
        name: "",
        card: ""
      }
    };
  },
  onLoad(e) {},
  methods: {
    validForm(){
      if(!this.upload.name){
        uni.showToast({title: '姓名不能为空',icon: 'none'});
        return false;
      }
      if(!this.upload.card){
        uni.showToast({title: '身份证号码不能为空',icon: 'none'});
        return false;
      }
      return true;
    },
    confirm() {
      if(this.validForm()){
        this.$http.post(user.authUserTrue, this.upload).then(res => {
          console.log(res);
          if (res == 1) {
            uni.navigateTo({
              url: "../my/successStatus?data=已完成实名认证&type=tabBar&url=my"
            });
          }
        });
      }
      
    }
  }
};
</script>

<style lang="scss" scope>
	input{
		display: block;
	}
page {
  background-color: #ffffff;
}
.contain {
  padding: 40rpx;
}
.bind-phone {
  margin-bottom: 100rpx;
  .phone {
    font-size: 32rpx;
    font-weight: bold;
  }
  .phone-input {
    margin: 20rpx 0;
    border-bottom: 1px solid #d9d9d9;
    font-size: 28rpx;
    padding: 20rpx 0 10rpx;
  }
  .tips {
    font-size: 24rpx;
    color: #ff5600;
    width: 100%;
    text-align: right;
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
