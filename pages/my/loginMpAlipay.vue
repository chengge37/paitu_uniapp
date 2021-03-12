<template>
	<div class="contain">
		<div class="bind-phone">
			<div class="get-input">
                <!-- <text class="title">账号</text> -->
                <input type="text" class="phone-input" v-model="login_form.mobile" placeholder="请输入手机号码" placeholder-style="color:#999999"/>
				<button class="btn" @click="getPhone">获取支付宝手机</button>
            </div>
			
            <div class="get-input">
                <input type="text" class="phone-input" v-model="login_form.nick" placeholder="昵称" placeholder-style="color:#999999" />
					<button class="btn"
					open-type="getAuthorize" 
					@click="onGetAuthorize" onError="onAuthError" 
					scope='userInfo'>
					    获取支付宝昵称
					</button>
            </div>

			<div class="check-code">
                <input type="text" class="code-input" v-model="login_form.captcha" placeholder="请输入验证码" placeholder-style="color:#999999" />
				<image :src="host+captchaImg" class="code-img" @click="changeCap"></image>
			</div>
			<div class="get-input">
			    <input type="text" class="phone-input" v-model="login_form.sms_code" placeholder="请输入短信验证码" placeholder-style="color:#999999"/>
				<button class="btn btn1" @click="sendSMS" >发送验证码</button>
			</div>
		</div>
		
		<div class="confirm" @click="login">
            确认绑定
        </div>
	</div>
</template>

<script>
	import {
		userLogin
	} from '@/common/api/api.js'
	import store from '@/store'
	export default {
		data() {
			return {
				// host:'http://192.168.0.2/',
				host:'https://www.paitume.com/',
				login_form: {
					mobile: '',
					nick: '',
					captcha:'',
					uuid:'',
					sms_code:'',
					auth_code:'',//auth_code,
					from_alipay:0,
					avatar:null
				},
				captchaImg:'',
				hasNewFlag:0,
			}
		},
		mounted(){
			this.getCaptcha()
			this.autoLogin()
		},
		methods: {
			getPhone(){
				uni.showToast({
					title:'暂未开通，请手动输入'
				})
			},
			onGetAuthorize(res) {
				let _this = this;
			     my.getOpenUserInfo({
			      fail: (res) => {
					  console.log('支付宝获取用户信息失败',res);
			      },
			      success: (res) => {
			        let userInfo = JSON.parse(res.response).response 
					console.log('支付宝用户信息',userInfo);
					if(userInfo.code == 10000){
						console.log('成功');
						if(userInfo.nickName != undefined){
							console.log('昵称'+userInfo.nickName);
						}
						this.login_form.nick = userInfo.nickName!=undefined?userInfo.nickName:this.login_form.nick;
						this.login_form.avatar = userInfo.avatar!=undefined?userInfo.avatar:'';
					} else {
						console.log('userInfo == '+userInfo.code);
						if(userInfo.code == 40003){
							this.onGetAuthorize();
						}
					}
			      }
			    });
			},
			getCaptcha(){
				this.login_form.uuid = this.util.generateUUID()
				console.log('this.login_form.uuid---',this.login_form.uuid)
				this.$http.get(userLogin.appGetCaptcha,{uuid:this.login_form.uuid}).then(res => {
					this.captchaImg = res;
					console.log('captchaImg',res)
				})
			},
			changeCap(){
				this.getCaptcha()
			},
			login() {
				if(!(/^1[3456789]\d{9}$/.test(this.login_form.mobile))){
					uni.showToast({title: '手机号码格式不正确！',icon: "none"});
					return;
				}
				if(!this.login_form.auth_code){
					uni.showToast({title: '登陆支付宝失败！',icon: "none"});
					return;
				}
				console.log('登陆支付宝参数',this.login_form);
				uni.showLoading({title: '绑定中'});
				this.$http.post(userLogin.alipayMiniAppLogin, this.login_form)
					.then(res => {
						uni.hideLoading();
						console.log('登录结果1', res);
						if (res) {
							uni.showToast({
								title: '登录成功',
								duration: 2000
							});
							store.commit('update_user_data', res);
							console.log('登录成功 看看是不是pop出的登录框',store.getters.last_url);
							if(store.getters.last_url != 0){
								store.commit('update_url', 0);
								uni.navigateBack();	
							} else {
								uni.navigateBack();	
							}
						}
					})
					.catch(err => {
						uni.hideLoading();
						console.log('登录失败', err);
					});
			},
			autoLogin(){
				uni.login({
					scopes: 'auth_base',
					success: (res) => {
						console.log('自动登录支付宝成功 code', res);
						//现在没有手机号不能注册
						//store.dispatch("alipayCodeLogin", res.code);
						this.login_form.auth_code = res.code;
					},
					fail:(err)=>{
						console.log('登陆失败',err);
					}
				});
			},
			sendSMS(){
				//发送验证码 TODO 验证手机号
				if(!(/^1[3456789]\d{9}$/.test(this.login_form.mobile))){
					uni.showToast({title: '手机号码格式不正确！',icon: "none"});
					return;
				}
				if(!(/^\d{4}$/.test(this.login_form.captcha))){
					uni.showToast({title: '验证码格式不正确！',icon: "none"});
					return;
				}
				let sendSMSData = {
					captcha:this.login_form.captcha,
					mobile:this.login_form.mobile,
					uuid: this.login_form.uuid
				}
				uni.showLoading({title: '请求发送验证码'});
				this.$http.post(userLogin.getCodeByCaptcha, sendSMSData)
					.then(res => {
						uni.hideLoading();
						console.log('发送结果', res);
						if(res){
								uni.showToast({
									title: '发送短信成功,验证码2分钟内有效',
									duration: 2000
								});
						}
					})
					.catch(err => {
						uni.hideLoading();
						console.log('发动短信失败', err);
					});
			},
		}
	}
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
	.get-input{
		display: flex;
		align-items: center;
		margin: 20rpx 0;
		.btn{
			background-color: #651FFF;
			border: none;
			border-radius: 0;
			color: #ffffff;
			font-size: 30rpx;
			text-align: center;
			width: 252rpx;
			height: 90rpx;
		}
		.btn1{
			width: 200rpx;
		}
		.phone-input{
			// border: 1px solid #ffffff;
			background-color: #ffffff;
			font-size: 28rpx;
			padding:20rpx;
			flex: 1;
			height: 50rpx;
		}
	}
    .phone{
        font-size: 32rpx;
        font-weight: bold;

    }
    
	.check-code{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.code-input{
			// width: 400rpx;
			margin: 20rpx 0;
			background-color: #ffffff;
			font-size: 28rpx;
			padding:20rpx; 
			flex: 1;
		}
		.code-img{
			width: 200rpx;
			height: 90rpx;
		}
	}
    .loginByCode{
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
