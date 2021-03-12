<template>
	<div class="contain">
		<div class="bind-phone">
			<div>
				<!-- <text class="title">账号</text> -->
				<input type="text" class="phone-input" v-model="login_form.mobile" placeholder="请输入当前登录手机号码" placeholder-style="color:#999999" />
			</div>
			<div>
				<!-- <text class="title">密码</text> -->
				<input type="text" class="phone-input" password v-model="login_form.pwd" placeholder="6-20位数字/字母/字符组合" placeholder-style="color:#999999" />
			</div>
			<div class="check-code">
				<input type="text" class="code-input" v-model="login_form.captcha" placeholder="请输入验证码" placeholder-style="color:#999999" />
				<image :src="host + captchaImg" class="code-img" @click="changeCap"></image>
			</div>
			<div class="loginByCode" @click="loginByCode">
				短信登录
				<span class="iconfont iconyoujiantou"></span>
			</div>
		</div>

		<div class="confirm" @click="login">确认登录</div>
	</div>
</template>

<script>
// #ifdef APP-PLUS || MP-WEIXIN
import store from '@/store'
import { userLogin } from '@/common/api/api.js';
import {paitumeHost} from '@/common/utils/config.js'
export default {
	data() {
		return {
			host: paitumeHost,
			login_form: {
				mobile: '',
				pwd: '',
				captcha: '',
				uuid: ''
			},
			captchaImg: '',
			hasNewFlag: 0
		};
	},
	mounted() {
		this.getCaptcha();
	},
	methods: {
		uploadUserAppPushToken(){
			if(this.$store.getters.user_push_token){
				this.$http.post(userLogin.uploadUserAppPushToken, { app_type :1 ,token: this.$store.getters.user_push_token }).then(res => {
					 console.error('上传token成功');
				});
			} else {
				console.error('没有TOKEN');
			}
		},
		getCaptcha() {
			this.login_form.uuid = this.util.generateUUID();
			console.log('this.login_form.uuid---', this.login_form.uuid);
			this.$http.get(userLogin.appGetCaptcha, { uuid: this.login_form.uuid }).then(res => {
				// this.$http.get(userLogin.appGetCaptcha,{uuid:'12958349823489583485'}).then(res => {
				this.captchaImg = res;
				console.log('captchaImg', res);
			});
		},
		changeCap() {
			this.getCaptcha();
		},
		login() {
			this.$http
				.post(userLogin.applogin, this.login_form)
				.then(res => {
					console.log('登录结果1', res);
					if (res) {
						uni.showToast({
							title: '登录成功',
							duration: 2000
						});
						this.$store.commit('update_user_data', res);
						// 登录成功后开始登录即时聊天系统，用户的id作为登录钥匙
						this.$store.dispatch('pimLogin');
						// 登录成功上传push token;
						this.uploadUserAppPushToken();
						console.log('登录成功 看看是不是pop出的登录框', store.getters.last_url);
						if (this.$store.getters.last_url != 0) {
							this.$store.commit('update_url', 0);
							uni.navigateBack();
						} else {
							uni.navigateBack();
						}
					}
				})
				.catch(err => {
					console.log('登录失败', err);
				});
		},
		loginByCode() {
			uni.navigateTo({ url: '/pages/my/bindPhone?type=login' });
		},
	}
};
// #endif
</script>

<style lang="scss" scope>
.contain {
	padding: 50rpx;
}
.bind-phone {
	margin-bottom: 100rpx;
	.title {
		font-size: 32rpx;
		color: #333333;
	}
	.phone {
		font-size: 32rpx;
		font-weight: bold;
	}
	.phone-input {
		margin: 20rpx 0;
		background-color: #ffffff;
		font-size: 28rpx;
		padding: 20rpx;
		width: 610rpx;
	}
	.check-code {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.code-input {
			width: 400rpx;
			margin: 20rpx 0;
			background-color: #ffffff;
			font-size: 28rpx;
			padding: 20rpx;
		}
		.code-img {
			width: 200rpx;
			height: 90rpx;
		}
	}
	.loginByCode {
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
