<template>
  <div class="contain">
    <div class="bind-phone" v-if="one">
      <p class="title1">请完成一下验证</p>

      <div>
        <text class="title">请输入{{user.paitume_user.mobile}}收到的短信验证码</text>
        <div class="yanzheng">
          <input
            type="text"
            class="phone-input"
            placeholder="请输入短信验证码"
            v-model="code"
            placeholder-style="color:#999999"
          />
          <p class="getbtn" :class="active?'active':''" @click="getCode">
            <span>{{active?wait+'秒重试':'获取验证码'}}</span>
          </p>
        </div>
      </div>

      <view class="comfirm" @click="save">
        <view class="btn1">确认</view>
      </view>
    </div>
    <div class="bind-phone" v-if="two">
      <div v-if="whoin === 0">
        <div class="zh">
          <div class="title title-margin">绑定手机号</div>
          <input type="text" v-model="mobile" class="phone-input" placeholder="请输入新手机号码" />
        </div>
        <div>
          <div class="title">短信验证码</div>
          <div class="yanzheng">
            <input
              type="text"
              class="phone-input"
              placeholder="请输入短信验证码"
              v-model="code"
              placeholder-style="color:#999999"
            />
            <p class="getbtn" :class="active?'active':''" @click="getNewCode">
              <span>{{active?wait+'秒重试':'获取验证码'}}</span>
            </p>
          </div>
        </div>
        
      </div>
      <div v-if="whoin === 1">
        <div class="zh">
          <div class="title title-margin">绑定邮箱</div>
          <input type="text" class="phone-input" placeholder="请输入邮箱" v-model="email" />
        </div>
        <div>
          <div class="title">邮箱验证码</div>
          <div class="yanzheng">
            <input
              type="text"
              class="phone-input"
              placeholder="请输入邮箱验证码"
              v-model="code"
              placeholder-style="color:#999999"
            />
            <p class="getbtn" :class="active?'active':''" @click="getCodeByEmail">
              <span>{{active?wait+'秒重试':'获取验证码'}}</span>
            </p>
          </div>
        </div>
      </div>
      <view class="comfirm" @click="Twosave">
        <view class="btn1">确认</view>
      </view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { user } from "@/common/api/api";
export default {
  data() {
    return {
      active: false,
      code: "",
      mobile: "",
      email: "",
      title: "",
      whoin: 0,
      one: true,
      two: false,
      three: false,
      wait: 60
    };
  },
  computed: {
    ...mapState(["user"])
  },
  onLoad(options) {
    console.log(this.user);
    console.log(options.type, "用户信息");
    switch (options.type) {
      case "updatephone":
        this.title = "修改手机号码";
        this.whoin = 0;
        break;
      case "email":
        this.title = "关联邮箱";
        this.whoin = 1;
        break;
      default:
        break;
    }
    uni.setNavigationBarTitle({
      title: this.title
    });
  },
  methods: {
    getCode() {
      if (!this.active) {
        let sendData = {
          mobile: this.user.paitume_user.mobile,
          type: 1,
          openid: this.user.paitume_user.wx_app_open_id
        };
        this.sendCode(sendData);
      }
    },
    getNewCode() {
      if (!this.active) {
        let sendData = {
          mobile: this.mobile,
          type: 2,
          openid: this.user.paitume_user.wx_app_open_id
        };
        this.sendCode(sendData);
      }
    },
    sendCode(params) {
      this.$http
        .get(user.getMobilCode, params)
        .then(res => {
          this.startTime();
          uni.showToast({ title:'发送成功', icon: "success" });
        });
    },
    save() {
      if (this.code !== "") {
        let data = {
          mobile: this.user.paitume_user.mobile,
          code: this.code
        };
        this.$http
          .get(user.VaildCode, data)
          .then(res => {
            console.log(res);
            if (res) {
              this.one = !this.one;
              this.two = !this.two;
              this.endTime();
              this.code = "";
              uni.showToast({ title: '成功', icon: "success" });
            } else {
              uni.showToast({ title: '网络故障', icon: "none" });
            }
          })
          .catch(err => {});
      } else {
        uni.showToast({ title: "必要信息丢失", icon: "none" });
      }
    },
    getCodeByEmail() {
      let params = {
        email: this.email
      };
      this.$http.get(user.getEmailCode, params).then(res => {
          console.log(res);
          this.startTime();
          uni.showToast({title: '成功', icon: "success" });
      });
    },
    Twosave() {
      switch (this.whoin) {
        case 0:
          let data = {
            mobile: this.mobile,
            code: this.code
          };
          this.$http.post(user.userEditMobile, data).then(res => {
              this.endTime();
              uni.navigateTo({
                url:
                  "../my/successStatus?data=手机号码修改成功&type=tabBar&url=my"
              });
          });
          break;
        case 1:
          let params = {
            email: this.email,
            code: this.code
          };
          this.$http.get(user.eidtEmail, params).then(res => {
            this.endTime();
              uni.navigateTo({
                url:
                  "../my/successStatus?data=邮箱绑定成功&type=tabBar&url=my"
              });
          });
          break;
        default:
          break;
      }
    },
    startTime() {
      this.active = true;
      this.setTime();
    },
    endTime() {
      this.wait = 60;
      this.active = false;
      clearTimeout(this.timer);
    },
    setTime() {
      if (this.wait == 0) {
        this.active = false;
        this.wait = 60;
        return;
      } else {
        this.wait--;
      }
      this.timer = setTimeout(() => {
        this.setTime();
      }, 1000);
    },

    
  }
};
</script>
	
<style lang="scss" scope>
.contain {
  padding: 40rpx;
}
.bind-phone {
  margin-bottom: 100rpx;

  .title {
    font-size: 28rpx;
    color: #333333;
  }
  .title1 {
    font-size: 36rpx;
    color: #333333;
    font-weight: 500;
    padding-bottom: 50rpx;
  }
  .phone {
    font-size: 32rpx;
    font-weight: bold;
  }
  .yanzheng {
    display: flex;
    justify-content: center;
    margin: 20rpx 0;
    .phone-input {
      width: 60%;
      background-color: #ffffff;
      font-size: 28rpx;
      padding: 20rpx;
      display: inline-block;
    }
    .getbtn {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      width: 30%;
      padding: 20rpx;
      background-color: #651fff;
      color: #ffffff;
    }
    .active {
      background-color: #999999;
    }
  }
  .zh {
    margin: 20rpx 0;
    .phone-input {
      width: 94%;
      background-color: #ffffff;
      font-size: 28rpx;
      padding: 20rpx;
      display: inline-block;
    }
  }
}
.input {
  border: 1px solid #cccccc;
  border-radius: 4px;
}
.input,
.btn {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-left: 10px;
}

.comfirm {
  view {
    display: flex;
  }

  width: 100%;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 150rpx 0rpx;
  .btn1 {
    width: 100%;

    height: 80rpx;
    background-color: #651fff;
    color: #fff;
    justify-content: center;
    align-items: center;

    .icon {
      height: 80rpx;
      color: #fff;
      font-size: 30rpx;
      justify-content: center;
      align-items: center;
    }

    font-size: 30rpx;
  }
}
.title-margin {
  margin-bottom: 10rpx;
}
</style>
