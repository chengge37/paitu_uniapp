<template>
	<div class="contain">
		<!--#ifdef H5 || APP-PLUS -->
		<div class="bind-phone">
			<div>
                <input type="text" class="phone-input" v-model="login_form.mobile" placeholder="请输入当前登录手机号码" placeholder-style="color:#999999"/>
            </div>
            <div>
                <input type="text" class="phone-input" password v-model="login_form.pwd" placeholder="6-20位数字/字母/字符组合" placeholder-style="color:#999999" />
            </div>
			<div class="line3">
				<div class="remenber">
					<label class="radio" @click="toRemenber">
						<radio :checked="remenberPsw" color="#651fff"/>
						<span class="text">记住密码</span>
					</label>
				</div>
				<div class="loginByCode" @click="loginByCode"> 
					短信登录/注册
					<span class="iconfont iconyoujiantou"></span>
				</div>
			</div>
			
		</div>
		<div>
			<div class="confirm-btn confirm" v-if="toConfirm" @click="login">
				确认登录
			</div>
			<div class="confirm-btn notdo" v-else>
				确认登录
			</div>
		</div>
		
		<!--#endif   -->
	</div>
</template>

<script>
	//#ifdef H5
	import {
		userLogin
	} from '@/common/api/api.js'
	import store from '@/store'
	import {setCookie,getCookie,delCookie} from '@/common/utils/cookie.js'
	export default {
		data() {
			return {
				login_form: {
					mobile: '',
					pwd: '',
				},
				toConfirm:true,
				is_from_act:false,
				remenberPsw:false,
				hasNewFlag:0
			}
		},
		onLoad(){
			this.is_from_act = uni.getStorageSync('from_act_login');
			this.loadUserInfo()
		},
		methods: {
			toRemenber(){
				this.remenberPsw = !this.remenberPsw;
			},
			remenberUserInfo(){
				let userInfo = this.login_form.mobile +'&' +this.login_form.pwd
				if(this.remenberPsw){
					setCookie('userInfo',userInfo,1440*365);//记住365天
					console.log('记住密码成功')
				}else{
					delCookie('userInfo')
				}
				
                console.log('href----',window.location.href)
            	// 若为本地环境 则手写cookie
				// if(window.location.href.indexOf('localhost') != -1){
                // 	setCookie('token','17363478582_58e0cbbea951f0e79fafcee80da522b8',1440);
				// }
			},
			loadUserInfo(){
				let userInfo = getCookie('userInfo');
				console.log('userInfo-----',userInfo)
				//如果cookie里没有账号信息
				if(Boolean(userInfo) == false){
					console.log('cookie中没有检测到账号信息！');
					return false;
				}
				else{
				//如果cookie里有账号信息
					console.log('cookie中检测到账号信息！现在开始预填写！');
					let account = "";
					let passWord = "";
					let index = userInfo.indexOf("&");
	
					account = userInfo.substring(0,index);
					passWord = userInfo.substring(index+1);
	
					this.login_form.mobile = account;
					this.login_form.pwd = passWord;
					this.remenberPsw = true;
				}
			},
			login() {
				this.toConfirm = false;
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
										...this.login_form,
										geetest_challenge: geetdata.geetest_challenge,
										geetest_validate: geetdata.geetest_validate,
										geetest_seccode: geetdata.geetest_seccode
									};
									console.log(params);
									this.$http.post(userLogin.h5login, params)
										.then(res => {
											let that=this
											console.log('登录结果1', res);
											this.remenberUserInfo()
											if (res) {
												uni.showToast({
													title: '登录成功',
													duration: 2000
												});
												store.commit('update_user_data', res);
												console.log('登录成功 看看是不是pop出的登录框',store.getters.last_url);
												// 登录成功后开始登录即时聊天系统，用户的id作为登录钥匙
												this.loginIM(res.id,res)
									

												if(store.getters.last_url != 0){
													store.commit('update_url', 0);
													uni.navigateBack();	
												} else {
													if(this.is_from_act){
														uni.redirectTo({url: "/pages/my/myList/myShop"})
													}else{
														uni.reLaunch({url: '/'});
													}
													
												}
											}
										})
										.catch(err => {
											this.toConfirm = true;
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
					this.toConfirm = true;
					console.log(err);
				})
			},
			testPay(payWay) {
				this.$http.post('/order/userPay', {
					'order_id': 1,
					'total_price': 1,
					'pay_way': payWay,
					'H5': true
				}).then(res => {
					console.log(res);
					if (payWay == 1) {
						if (res.indexOf('https://wx.tenpay.com') != -1) {
							window.location.href = res;
						}
					} else if(payWay == 2) {
						this.$refs.alipay.innerHTML =res;
						document.forms["alipay_submit"].submit();
					}
				}).catch(err => {
					console.log('userPay error', err);
				});
				console.log('login');
				return;
			},

			loginByCode(){
				uni.navigateTo({url:'/pages/my/bindPhone?type=login&is_from_act='+this.is_from_act});
			},
		 
		}
	}
	//#endif
</script>

<style lang="scss" scope>
.contain{
	padding: 50rpx;
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
	.line3{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.radio /deep/ .uni-radio-input{
			width: 12px;
			height: 12px;
		}
		.radio /deep/ .uni-radio-input-checked:before{
			font-size: 10px;
		}
		.radio{
			.text{
				font-size: 12px;
			}
		}
		.loginByCode{
			font-size: 24rpx;
			color: #FF5600;
		}
	}	
    
}
.confirm-btn{
    width: 100%;
    padding:20rpx 0;
    text-align: center;
    
    font-size: 32rpx;
}
.confirm{
	background-color: #651FFF;
    color: #ffffff;
}
.notdo{
	background-color: #d9d9d9;
	color: #333333;
}
</style>
