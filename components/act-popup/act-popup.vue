<template>
    <view>
       <div class="step-one" v-if="step==1">
           <image class="bg-img" mode="widthFix" :src="host+'109-1575944459677.png'"></image>
           <div class="top-title">
               <h1 class="title">新人大礼包</h1>
               <p class="date">2019年12月12日 ～ 2020年1月1日</p>
           </div>
           <div class="coupon-content">
               <h1 class="coupon-title">200元优惠券</h1>
               <!-- <p class="line1">&emsp;</p> -->
               <p class="line2">/影棚/器材/</p>
           </div>
           <div class="pick-btn" @click="pickNow">立即领取</div>
       </div>

       <div class="step-two" v-else-if="step==2">
           <image class="bg-img" mode="widthFix" :src="host+'109-1575956494097.png'"></image>
           <div class="top-title1">
               <p class="line">恭喜你获得</p>
               <h1 class="title">200元新人大礼包</h1>
               <!-- <p class="line">首次下单立减100元</p> -->
           </div>
           <div class="register">
               <p class="date">活动时间：2019年12月12日 ～ 2020年1月1日</p>
               <div class="input-mobile">
                   <input class="input" v-model="register_form.mobile" type="text" placeholder="请输入手机号码" />
               </div>
               <div class="input-mobile">
                   <input class="input" v-model="register_form.code" type="text" placeholder="请输入验证码" />
                   <p class="getcode" :class="active?'active':''" @click="phoneReg">
                       <span>{{active?wait+'秒重试':'获取验证码'}}</span>
                   </p>
               </div>
           </div>
           <div class="pick-btn" @click="pickNow">注册领取</div>
       </div>

       <div class="step-three" v-else-if="step==3">
           <image class="bg-img" mode="widthFix" :src="host+'109-1575965650308.png'"></image>
           <div class="top-title1">
               <p class="line">领取成功</p>
               <h1 class="title">200元新人大礼包</h1>
           </div>
           <div class="effective">
               <p class="date">活动时间：2019年12月12日～2020年1月1日</p>
           </div>
           <div class="use-btn" @click="useNow">立即使用</div>
           <p class="see-detail" @click="gotoMyCoupon">
               查看详情
               <span class="iconfont iconyoujiantou"></span>
           </p>
       </div>
    </view>
</template>

<script>
import store from '@/store'
import {
    userLogin,user,coupon
} from '@/common/api/api.js'
    export default{
        name:'cat-signature',
        props:{
            type: {
                type: String,
                default: 'home'
            }
        },
        data(){
            return{
                host: this.$qiniuHost,
                step:1,
                register_form: {
					code: '',
					mobile: '',
					//#ifdef  MP-WEIXIN
					openid: '',
					//#endif
                },
                active: false,
                wait:60,
                c_params:{
                    page:1,
                    page_size:10000,
                    uid:'0',
                    is_show:2
                },
                couponArr:[]
            }
        },
        watch:{
            
        },
        
        created(options) {
           
        },
        mounted() {
            //#ifdef  MP-WEIXIN
            this.register_form.openid = this.$store.getters.wx_open_id;
            //#endif
            // this.getCouponList()
        },
        methods:{
            pickNow(){
                if(this.step==1){
                    this.step = 2;
                }else{
                    if(this.register_form.code){
                        this.toPickCoupons()
                        // this.login()
                    }else{
                        uni.showToast({title: '验证码不能为空!',icon:'none',duration: 2000});
                    }
                    
                }
            },
            useNow(){
                this.$emit('close')
            },
            getCouponList(){
                return new Promise((resolve,reject) => {
                    this.$http.get(coupon.getList,this.c_params).then(res=>{
                        this.couponArr = res.rows;
                        console.log('coupon-res-----',this.couponArr);
                        resolve(this.couponArr);                  
                    }).catch(err=>{
                        reject(err)
                    })
                })
                // 16637924362
            },
            async toPickCoupons(){
                let user = await this.login();
                // let couponArr = await this.getCouponList();
                let startTemp = 1576080000;//2019-12-12
                let endTemp = 1577894399;//2020-1-1
                if((user.time-user.create_time)<=30){
                    // couponArr.forEach(v => {
                    //     if(!v.user_get){
                    //         this.addCoupon(v.id)
                    //     }
                    // });
                    this.step = 3;
                }else{
                    uni.showToast({title: '您已经是老用户或您已领取过优惠。',icon: "none",duration: 2000});
                    this.$emit('close')
                }
            },
            addCoupon(data){
                this.$http.get(coupon.getCoupon,{id:data}).then(res => {

                }).catch(err => {
                    console.log(err)
                })
            },
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
            gotoMyCoupon(){
                uni.navigateTo({url:'/pages/my/myList/myDiscount'})
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
                return new Promise((resolve,reject) => {
                    this.$http.post('/user/ajaxWxBindMobile', this.register_form).then(res => {
                        if(res){
                            store.commit('update_user_data', res);
                            resolve(res)
                        }
                    }).catch(err =>{
                        reject(err)
                    })
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
                return new Promise((resolve,reject) => {
                    this.$http.post(userLogin.loginByCode,this.register_form).then(res => {
                        console.log('user_data',res)
                        if(res){
                            console.log('注册用户信息-----------',res)
                            store.commit('update_user_data', res);
                            resolve(res)

                        }else{
                            uni.showToast({title: '登录失败!',icon:'none',duration: 2000});
                        }
                    }).catch(err => {
                         reject(err)
                    })
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
			}
        }
    }
</script>

<style lang="scss">
 .step-one,.step-two,.step-three{
     position: relative;
     .bg-img{
         width: 640rpx;
         height: 640rpx;
     }
     .top-title{
         position: absolute;
         top: 80rpx;
         margin-left: 20rpx;
         width: 100%;
         text-align: center;
         .title{
             color: #663300;
             font-size: 40rpx;
             font-weight: bold
         }
         .date{
             color: #663300;
             font-size: 20rpx;
         }
     }
     .coupon-content{
         position: absolute;
         top:250rpx;
         margin-left: 10rpx;
         width: 100%;
         text-align: center;
         .coupon-title{
             color: #F45125;
             font-size: 40rpx;
             font-weight: bold;
         }
         .line1,.line2{
             font-size: 28rpx;
             color: #663300;
         }
         .line1{
             margin-bottom: 30rpx;
         }
         .line2{
             margin-top: 40rpx;
         }
     }
     .pick-btn{
        position: absolute;
        bottom: 50rpx;
        left: 170rpx;           
        color: #663300;
        font-size: 40rpx;
        font-weight: bold;
        // background-color: #f8f8f8;
        // opacity: 0.8;
        padding: 10rpx 75rpx;
        border-radius: 50rpx;
     }
     .top-title1{
         position: absolute;
         margin-left: 10rpx;
         top: 65rpx;
         width: 100%;
         text-align: center;
         .title{
             color: #663300;
             font-size: 40rpx;
             font-weight: bold
         }
         .line{
             color: #663300;
             font-size: 28rpx;
         }
     }
     .register{
        width: 640rpx;
        position: absolute;
        bottom: 150rpx;
        margin-left: 10rpx;
        .date{
            color: #663300;
            font-size: 20rpx;
            width: 100%;
            text-align: center;
        }
        .input-mobile{
            width: 400rpx;
            border: 1rpx solid #E8B776;
            background-color: #ffffff;
            margin-left: 120rpx;
            margin-top: 20rpx;
            font-size: 24rpx;
            display: flex;
            .input{
                margin-left: 20rpx;
                font-size: 24rpx;
                height: 52rpx;
                line-height: 52rpx;
            }
            .getcode{
                color: #663300;
                font-weight: bold;
                display: inline-block;
                width: 200rpx;
                height: 52rpx;
                line-height: 52rpx;
                text-align: center;
                border-left: 1rpx solid #E8B776;
            }
        }
     }
     .effective{
        width: 640rpx;
        position: absolute;
        bottom: 300rpx;
        margin-left: 10rpx;
        .date{
            color: #663300;
            font-size: 20rpx;
            width: 100%;
            text-align: center;
        }
     }
     .use-btn{
        position: absolute;
        bottom: 150rpx;
        left: 170rpx;           
        color: #663300;
        font-size: 40rpx;
        font-weight: bold;
        padding: 10rpx 75rpx;
        border-radius: 50rpx;
     }
     .see-detail{
        position: absolute;
        margin-left: 10rpx;
        height: 50rpx;
        line-height: 50rpx;
        bottom: 50rpx;
        color: #663300;
        font-size: 24rpx;
        width: 100%;
        text-align: center;
        .iconfont{
            font-size: 26rpx;
        }
     }
 }
</style>