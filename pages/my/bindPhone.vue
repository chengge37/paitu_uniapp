<template>
	<div class="contain">
		<div class="bind-phone">
			<p class="title1">绑定手机</p>
			<div>
				<input type="text" class="phone-input1" :placeholder="type=='register'?'绑定手机号码':'登录手机号码'" v-model="register_form.mobile" placeholder-style="color:#999999" />
			</div>
			<div>
				<div class="yanzheng">
					<input type="text" class="phone-input" placeholder="请输入短信验证码" v-model="register_form.code" placeholder-style="color:#999999" />
					<div class="getbtn" :class="active?'active':''" @click="phoneReg">
						<p>{{active?wait+'秒重试':'获取验证码'}}</p>
					</div>
				</div>
			</div>
			<div class="toPswLogin" @click="goToPswLogin">
			已有账号，密码登录？
					<span class="iconfont iconyoujiantou"></span>
			</div>
		</div>
		<div @click="login" class="comfirm-btn" :style="register_form.code?'background-color:#651FFF':'background-color:#d9d9d9'">确认</div>
		<!-- <button @click="login" class="btn" v-if="register_form.code">绑定手机</button> -->
	</div>



</template>

<script>
	import store from '@/store'
	import {
		userLogin,user
	} from '@/common/api/api.js'
	export default {
		data() {
			return {
				register_form: {
					code: '',
					mobile: '',
					//#ifdef  MP-WEIXIN
					openid: '',
					//#endif
				},
				active: false,
				type:'',
				wait:60,
				hasNewFlag:0
			};
		},
		components:{
		},
		onLoad(e) {
			this.register_form.openid = this.$store.getters.wx_open_id;
			if(this.register_form.openid){
				this.type = 'register';
			}else{
				this.type = 'login';
			}
		},
		methods: {
			phoneReg(){
				if(!this.register_form.mobile){
					uni.showToast({title: '手机号码不能为空！',icon: "none"});
				}else if(!(/^1[3456789]\d{9}$/.test(this.register_form.mobile))){
					uni.showToast({title: '手机号码格式不正确！',icon: "none"});
				}else{
					this.setTime();
					this.getCode();
				}
			},
			//#ifdef  MP-WEIXIN
			getCode() {
				this.active = true;
				let param = {
					mobile: this.register_form.mobile,
					openid: this.register_form.openid
				};
				this.$http.post(userLogin.getCode,
					 param
				).then(res => {
					uni.showToast({
						title: '发送验证码成功',
						icon: "success"
					});
				}).catch(res => {
					uni.showToast({ 
						title: res,
						icon: "none"
					});
				})
			},
			login() {
				this.$http.post('/user/ajaxWxBindMobile', this.register_form
				).then(res => {
					if(res){
						store.commit('update_user_data', res);
						this.$store.dispatch('pimLogin');
						// this.$Router.replace({
						// 	name:'successStatus',
						// 	params: { data: '绑定手机成功' }
						// });
						// if(this.is_from_act){
						// 	console.log('2222222',this.is_from_act)
						// 	uni.redirectTo({url: "../my/successStatus?data=登录成功&type=NotabBar&url=/pages/my/myList/myShop"})
						// }else{
							
						// 	uni.redirectTo({url: "../my/successStatus?data=绑定手机成功&type=tabBar&url=my"})
						// }
						uni.redirectTo({url: "../my/successStatus?data=绑定手机成功&type=tabBar&url=my"})
						// uni.navigateBack()
						
					}
					// uni.navigateTo({
					// 	url: '../my/successStatus?data=' + '绑定手机成功！'
					// })
				})
			},
			//#endif

			//#ifdef  H5 
			getCode(){
				this.active = true;
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
										mobile:this.register_form.mobile,
										type:2,
										geetest_challenge: geetdata.geetest_challenge,
										geetest_validate: geetdata.geetest_validate,
										geetest_seccode: geetdata.geetest_seccode
									};
									console.log(params);
									this.$http.get(user.getMobilCode, params)
										.then(res => {
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
			
			login(){
				this.$http.post(userLogin.loginByCode,this.register_form).then(res => {
					console.log('user_data',res)
					if(res){
						uni.showToast({title: '登录成功!',duration: 2000});
						setTimeout(() => {
							uni.navigateBack({delta: 2})
						}, 2000);
						
						store.commit('update_user_data', res);
						// 登录成功后开始登录即时聊天系统，用户的id作为登录钥匙
						this.loginIM(res.id,res)
					}else{
						uni.showToast({title: '登录失败!',icon:'none',duration: 2000});
					}
				})
			},
			 
			//#endif

			// #ifdef APP-PLUS || MP-ALIPAY
			getCode(){
				this.active = true;
				let params = {
					mobile:this.register_form.mobile,
					type:2,
				};
				this.$http.get(user.getMobilCode, params)
				.then(res => {
					console.log('RES---',res)
				})
				.catch(err => {
					console.log('err---',err)
				});
			},
			login(){
				this.$http.post(userLogin.loginByCode,this.register_form).then(res => {
					console.log('user_data',res)
					if(res){
						uni.showToast({title: '登录成功!',duration: 2000});
						setTimeout(() => {
							uni.navigateBack({delta: 2})
						}, 2000);
						
						store.commit('update_user_data', res);
					}else{
						uni.showToast({title: '登录失败!',icon:'none',duration: 2000});
					}
				})
			},
			//#endif
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
			goToPswLogin(){
				uni.navigateTo({url:'/pages/my/loginApp'})
			}
		}
	}
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
			padding-bottom: 30rpx;
		}

		.phone {
			font-size: 32rpx;
			font-weight: bold;

		}

		.phone-input1 {
			background-color: #ffffff;
			font-size: 28rpx;
			padding: 20rpx;
			width: 630rpx;
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
				background-color: #651FFF;
				color: #ffffff;
			}

			.active {
				background-color: #999999;
			}
		}
		.toPswLogin{
			line-height: 50rpx;
			font-size: 28rpx;
			color: #FF5600;
			width: 100%;
			text-align: right;
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

	.comfirm-btn {
		// width:100%;
		margin-top: 60rpx;
		padding: 20rpx;
		text-align: center;
		color: #ffffff;
		font-size: 32rpx;

	}
</style>
