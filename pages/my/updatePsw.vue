<template>
	<view class="contain">
        <div class="getcode">
            <div>
                <text class="title">请输入{{user.paitume_user.mobile}}收到的短信验证码</text>
                <div class="yanzheng">
                    <input type="text" class="phone-input" placeholder="请输入短信验证码" v-model="updatePsw_form.code" placeholder-style="color:#999999" />
                    <p class="getbtn" :class="active?'active':''" @click="getCode">
                        <span>获取验证码</span>
                    </p>
                </div>
            </div>
        </div>
		<div class="bind-phone">
            <div>
                <text class="title">设置新密码</text>
                <input type="text" class="phone-input" password v-model="pwd" placeholder="6-20位数字/字母/字符组合" placeholder-style="color:#999999" />
            </div>
            <div>
                <text class="title">确认新密码</text>
                <input type="text" class="phone-input" password v-model="updatePsw_form.pwd" placeholder="6-20位数字/字母/字符组合" placeholder-style="color:#999999" />
            </div>


        </div>

        <div class="confirm" @click="pswReg">
            确认
        </div>
	</view>
</template>

<script>
import { user,userLogin } from '@/common/api/api'
import {mapState} from 'vuex'
	export default {
		data() {
			return {
                pwd:'',
                updatePsw_form:{
                    code:'',
                    pwd:''
                },
                active:false
			}
        },
        computed:{
			...mapState(['user'])
		},
		onLoad(e){
		},
		methods: {
            // 获取验证码
			//#ifdef  H5
			getCode(){
				this.$http.get(userLogin.getGeetGt).then(res => {
					this.$initGeet({
							gt: res.gt,
							challenge: res.challenge,
							product: "bind",
							offline: !res.success,
							new_captcha: true
						},
						geetres => {
							geetres
								.onReady(() => {
									geetres.verify();
								})
								.onSuccess(() => {
									let geetdata = geetres.getValidate();
									let params = {
										mobile:this.user.paitume_user.mobile,
										type:1,
										geetest_challenge: geetdata.geetest_challenge,
										geetest_validate: geetdata.geetest_validate,
										geetest_seccode: geetdata.geetest_seccode
									};
									console.log(params);
									this.$http.get(user.getMobilCode, params)
										.then(res => {
                                            this.active = true;
										})
										.catch(err => {
											console.log('登录失败', err);
											geetres.reset();
										});
								});
							geetres.onError(err => {
								console.error("失败" + err.msg);
							});
							geetres.onClose(() => {
								geetres.reset();
							});
						}
					);
				}).catch(err => {
					console.log(err);
				})
            },
            
            pswReg(){
                if(this.pwd!=this.updatePsw_form.pwd){
                    uni.showToast({ title: "两次输入密码不一致！", icon: "none" });
                }else if(this.updatePsw_form.pwd.length<6){
                    uni.showToast({ title: "密码不能少于6个字符！", icon: "none" });
                }else if(!this.updatePsw_form.code){
                    uni.showToast({ title: "验证码不能为空！", icon: "none" });
                }else{
                    this.comfirmPsw();
                }
            },
            comfirmPsw(){
                let params = Object.assign(this.updatePsw_form,{mobile:this.user.paitume_user.mobile});
                this.$http.post(userLogin.resetPsw,params).then(res =>{
                    uni.showToast({title: '修改密码成功！',icon: "none",duration: 2000});
                    setTimeout(() => {
                        this.$router.back(1);
                    }, 2000);
                })
            }

            //#endif
		}
	}
</script>

<style lang="scss" scope>
.getcode{
    margin-bottom: 50rpx;
    .title{
        font-size: 28rpx;
        color: #333333;
    }
    .phone-input1{
        background-color: #ffffff;
        font-size: 28rpx;
        padding:20rpx;
    }
    .yanzheng{
        display: flex;
        justify-content: center;
        margin: 20rpx 0;
        .phone-input{
            width: 60%;
            background-color: #ffffff;
            font-size: 28rpx;
            padding:20rpx;
            display: inline-block;
        }
        .getbtn{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            width: 30%;
            padding:20rpx;
            background-color: #651FFF;
            color: #ffffff;
        }
        .active{
            background-color: #999999;
        }
    }
}

	
.contain{
    padding: 40rpx;
}
.bind-phone{
    margin-bottom: 100rpx;
    .title{
        font-size: 32rpx;
        color: #333333;
    }
    .phone{
        font-size: 32rpx;
        font-weight: bold;

    }
    .phone-input{
        margin: 20rpx 0;
        background-color: #ffffff;
        font-size: 28rpx;
        padding:20rpx;
    }
    .tips{
        font-size: 24rpx;
        color: #FF5600;
        width: 100%;
        text-align: right;
    }
}
.confirm{
    width: 100%;
    padding:20rpx 0;
    text-align: center;
    background-color: #651FFF;
    color: #ffffff;
    font-size: 32rpx;
}
</style>
