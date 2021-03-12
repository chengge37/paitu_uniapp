<template>
  <view>
    <view class="list">
      <view class="list-item" v-for="(item, index) in list" :key="index" @click="toMy(item.direction)">
        <p>{{item.name}}</p>
        <p class="right">
          <image v-if="item.name=='当前头像'" class="img" :src="util.avatarUtil(user_data.avatar)" mode="aspectFill"></image>
          <span v-else-if="item.name=='昵称'" class="gray">{{user_data.nick}}</span>
          <span v-else-if="item.name=='性别'&&user_data.sex==1" class="gray">男</span>
          <span v-else-if="item.name=='性别'&&user_data.sex==2" class="gray">女</span>
          <span v-else-if="item.name=='性别'&&!user_data.sex" class="gray">未设置</span>
          <span v-else-if="item.name=='实名认证'" class="gray">
            <text v-if="user_data.trueCard">已实名</text>
          </span>
          <span v-else-if="item.name=='修改手机号'" class="gray">{{user_data.mobile}}</span>
          <span v-else-if="item.name=='关联邮箱'" class="gray">
            <text  v-if="user_data.email">{{user_data.email}}</text>
          </span>
          <span class="iconfont iconyoujiantou next"></span>
        </p>
      </view>
    </view>
    <!--#ifndef MP-WEIXIN -->
    <div class="logout" @click="logout">退出登录</div>
    <!--#endif -->
    <!--#ifdef MP-WEIXIN -->
    <div class="logout" @click="switchLog">切换账号</div>
    <!--#endif -->
    <uni-popup ref="popupNick" type="center" @change="nickPopupChange">
      <div class="pop-center">
        <text class="title">修改昵称</text>
        <input
          type="text"
          class="nick-input"
          v-model="inputnick"
          :placeholder="user_data.nick"
          placeholder-style="color:#999999"
        />
        <div class="comfirm-btn" @click="updateNick">确认</div>
      </div>
    </uni-popup>

    <uni-popup ref="popupGender" type="center">
      <div class="pop-center">
        <text class="title">修改性别</text>
        <div class="gender">
          <radio-group @change="radioChange">
            <label class="radio" v-for="item in genders" :key="item.value">
              <radio :value="item.value" :checked="item.checked" color="#651FFF" />
              {{item.label}}
            </label>
          </radio-group>
        </div>

        <div class="comfirm-btn" @click="updateGender">确认</div>
      </div>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue";
import { mapState } from "vuex";
import { user } from "@/common/api/api";
import { weixin } from "@/common/login/login";
//#ifdef H5
import * as qiniu from 'qiniu-js'
//#endif
import {uploadImg} from "@/common/utils/uploadImg.js"
export default {
  components: {
    uniPopup
  },
  computed: {
    ...mapState(["user"])
  },
  data() {
    return {
      host: this.$qiniuHost,
      list: [
        { name: "当前头像", direction: "avatar" },
        { name: "昵称", direction: "nick" },
        { name: "性别", direction: "gender" },
        { name: "收货地址管理", direction: "address" },
        { name: "实名认证", direction: "bindRealname" },
        { name: "修改手机号", direction: "updatePhone?type=updatephone" },
        {name: '关联邮箱',direction: "updatePhone?type=email"},
        //#ifdef H5
        {name: '设置登录密码',direction: 'updatePsw'},
        //#endif
      ],
      token: "",
      url: "",
      user_data: {
        avatar: "",
        nick: "",
        brief: "",
        sex: "",
        birthday: ""
      },
      inputnick:'',
      genders: [
        { label: "男", value: "1", checked: false },
        { label: "女", value: "2", checked: false }
      ],
      sex_radio:''
    };
  },
  onLoad() {
    
  },
  watch:{
    'user.paitume_user'(val){
      console.warn(val有变化哦)
    }
  },
  onShow(){
    this.user_data = this.user.paitume_user
  },
  methods: {
    toMy(e) {
      switch (e) {
        case "avatar":
			console.log('点击换头像');
          uploadImg().then(res=>{
            console.log('成功',res)
            //#ifdef MP-WEIXIN
            this.user_data.avatar = res.key;
            //#endif
            //#ifdef H5 || APP-PLUS
            this.user_data.avatar = res;
            //#endif
            this.updateAvatar();
          }).catch(err=>{
            console.log('失败',err)
          });
          break;
        case "nick":
          this.inputnick = this.user_data.nick
          this.$refs.popupNick.open();
          break;
        case "gender":
          this.$refs.popupGender.open();
          break;
          case "bindRealname":
            this.user.paitume_user.trueCard ? uni.showToast({title:'您已实名',icon:'none'}) : uni.navigateTo({url: '../my/' + e});
          break;
        default:
          uni.navigateTo({url: '../my/' + e});
          break;
      }
    },
    updateAvatar() {
      this.$http
        .post(user.updateSetting, { avatar: this.user_data.avatar })
        .then(res => {
          uni.showToast({ title: "修改头像成功！", icon: "success" });
        }).catch(err=>{});
    },
    radioChange(e) {
      this.sex_radio = e.target.value;
      console.log("e.target.value", e.target.value);
    },
    nickPopupChange(e){
      // if(!e.show){
      //   if(!this.user_data.nick){
      //     this.user_data.nick = this.user.paitume_user.nick
      //   }
      // }
    },
    updateNick() {
      if(this.inputnick){
        this.$http
        .post( user.updateSetting, { nick: this.inputnick } )
        .then(res => {
          if (res) {
            this.user_data.nick = this.inputnick;
            uni.showToast({ title: "修改昵称成功！", icon: "success" });
          }
          this.$refs.popupNick.close();
        }).catch(err=>{});
      }else{
        uni.showToast({ title: "昵称不能为空", icon: "none" })
      }
      
    },
    updateGender() {
      this.user_data.sex = this.sex_radio;
      this.$http
        .post( user.updateSetting,  { sex: this.user_data.sex  })
        .then(res => {
          if (res) {
            uni.showToast({ title: "修改性别成功！", icon: "success" });
          }
          this.$refs.popupGender.close();
        }).catch(err=>{});
    },
    logout(){
      this.$store.dispatch('h5Logout')
    },
    switchLog(){
      this.$store.dispatch('switchAccount')
    }
  }
};
</script>

<style lang="scss">
.list {
  // margin: -15rpx 40rpx 60rpx;
  color: rgb(51, 51, 51);
  font-size: 30rpx;
  background-color: #ffffff;
  .order {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #f8f8f8;
    .order-item {
      width: 200rpx;
      text-align: center;
    }
    span {
      display: block;
      font-size: 24rpx;
    }
    .icon {
      color: #7000ff;
      font-size: 54rpx;
    }
    .name {
      color: #333333;
      line-height: 45rpx;
    }
  }
  .list-item:nth-child(4) {
    border-top: 30rpx solid #f8f8f8;
    border-bottom: 30rpx solid #f8f8f8;
  }
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f8f8f8;
    background-color: rgb(255, 255, 255);
    height: 100rpx;
    line-height: 85rpx;
    padding: 0 40rpx;

    .icon {
      margin-right: 10rpx;
    }

    .right {
      display: flex;
      align-items: center;
      .img {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
      }
      .next {
        flex: 1;
        text-align: right;
        margin-left: 30rpx;
      }
      .gray {
        color: #999999;
        font-size: 28rpx;
      }
    }
  }

  .list-item:active {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
}
.pop-center {
    padding: 30rpx;
    .title {
      font-size: 32rpx;
      color: #333333;
    }
    .nick-input {
      width: 350rpx;
      margin: 20rpx 0;
      background-color: #ffffff;
      font-size: 28rpx;
      padding: 20rpx 0;
      border-bottom: 1px solid #999999;
    }
    .gender {
      font-size: 28rpx;
      margin: 40rpx 0;
      width: 350rpx;
    }
    .radio {
      margin-right: 40rpx;
    }
    .comfirm-btn {
      padding: 15rpx;
      background-color: #651fff;
      color: #ffffff;
      text-align: center;
    }
  }
.logout{
  margin: 20px 35rpx;
  padding: 20rpx;
  border: 1rpx solid #999999;
  color: #333333;
  text-align: center;
  background-color: #ffffff;
}
</style>
