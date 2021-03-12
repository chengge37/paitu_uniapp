<template>
	<view >
        <div class="contain">
            <div class="atitle">活动信息</div>
            <div class="act-info">
                <image class="img" :src="host+a_detail.pic" mode="aspectFill" v-if="a_detail.pic"></image>
                <div class="info">
                    <p class="title">{{a_detail.name}}</p>
                    <p class="message">
                        <span class="msg-title">活动时间:</span><span class="msg-content">{{a_detail.start_time}}~{{a_detail.end_time}}</span>
                    </p>
                    <p class="message">
                        <span class="msg-title">地&emsp;&emsp;址:</span><span class="msg-content">{{a_detail.address}}</span>
                    </p>
                    <p class="price message">
                        <span class="msg-title">票&emsp;&emsp;价:</span><span class="msg-content">{{a_detail.fee}}元 / 人</span>
                    </p>
                </div>
            </div>
        </div>
        
        <div class="userform">
            <div class="form-item form-item1">
                <p class="left">报名人数</p>
                <p class="right">
                    <span class="lastcount">还剩{{a_detail.max_person-a_detail.current_person}}个名额</span>
                    <uni-number-box :min="1" :max="a_detail.max_person-a_detail.current_person" @change="numChange" class="num" :value="param.person_nums"></uni-number-box>
                </p>
            </div>
            <p class="tips">请确保手机号码填写无误，这是您的入场凭证</p>
            <div class="form-item form-item2">
                <p class="left">手机号</p>
                <div>
                    <p class="right">
                        <input type="text" placeholder="请输入手机号码" class="phone-input" :value="param.mobile"/>
                        <span class="iconfont iconyoujiantou" style="display:inline-block"></span>
                    </p>
                </div>
            </div>
             <!-- <div class="form-item form-item1" @click="openCoupon">
                <p class="left">优惠券</p>
                <p class="right">
                    <span class="iconfont iconyoujiantou" style="display:inline-block"></span>
                </p>
            </div>        -->

        </div>

        <div class="footer">
			<div class="left">
				<span class="cost">￥{{param.price}}</span>
			</div>
			<div class="right" @click="applyOrder">去付款</div>
		</div>
        <div ref="alipay"></div> 
		<min-action-sheet ref="popupRef"></min-action-sheet>
	</view>
</template>

<script>
import {activity,question} from '@/common/api/api'
import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue"
import minActionSheet from '@/components/min-action-sheet/min-action-sheet'
import {mapState} from 'vuex'
	export default {
		data() {
			return {
                host:this.$qiniuHost,
                a_detail:{},
                param:{id:'',price:0,person_nums:1,mobile:''},
			}
        },
        components:{
            uniNumberBox,minActionSheet
        },
        computed: {
            ...mapState(['user']),
        },
		onLoad(e){
            let that = this;
            this.param.mobile = this.user.paitume_user.mobile;
			uni.getStorage({
                key: 'activityApply',
                success: function (res) {
                    console.log(res.data);
                    that.a_detail = res.data;
                    that.param.id = that.a_detail.id
                    that.param.price = that.a_detail.fee
                    uni.removeStorageSync('activityApply')
                }
            });
		},
		methods: {
			numChange(val){
                this.param.price = this.a_detail.fee*val;
                this.param.person_nums = val;
            },
            applyOrder(){
                console.log('applyOrder---')
                this.$http.post(activity.applyOrder,this.param).then(res => {
                    //微信小程序支付
                    let payData = {
                        'id': res.order_id,
                        'price': res.price,
                        // #ifdef MP-WEIXIN
                        'pay_way': 1,
                        'call_way': 'mp-weixin',
                        // #endif
                        // #ifdef MP-ALIPAY
                        'pay_way': 2,
                        'call_way': 'mp-alipay'
                        // #endif
                    };
                    console.log('payData',payData)
                    if(res.price>0){
                        // #ifdef MP-WEIXIN
                        this.wxPay(res.order_id,payData)
                        // #endif
                        // #ifdef MP-ALIPAY
                        this.alipayPay(res.order_id,payData)
                        // #endif
                        // #ifdef H5 || APP-PLUS
                        this.h5AppPay(payData)
                        // #endif
                    }else{
                        uni.showToast({
                            title: "报名成功",
                            icon: "success",
                            duration: 2000,
                            complete: function() {
                                uni.navigateTo({url:'/pages/order/orderDetail?id='+res.order_id+'&type=1'})
                            }
                        });
                        
                    }
                    
                }).catch(err=>{})
                
                    
            },
            wxPay(order_id,payData){
                this.$http.post('/activity/userPay', payData).then(res => {
                        console.log('小程序userPay succ', res);
                        uni.requestPayment({
                            provider: "wxpay",
                            timeStamp: res.timeStamp,
                            nonceStr: res.nonceStr,
                            package: res.package,
                            signType: "MD5",
                            paySign: res.paySign,
                            orderInfo: JSON.stringify(payData),
                            success: function(res) {
                                uni.showToast({
                                    title: "支付成功",
                                    icon: "success",
                                    duration: 2000,
                                    complete: function() {
                                        uni.navigateTo({url:'/pages/order/orderDetail?id='+order_id+'&type=1'})
                                    }
                                });
                            },
                            fail: function(res) {
                                let err_msg = ''
                                if(res.errMsg=='requestPayment:fail cancel'){
                                    err_msg = '取消支付'
                                }
                                uni.showModal({
                                    content: "支付失败,原因为: " + err_msg,
                                    showCancel: false
                                })
                                console.log('fail:' + JSON.stringify(res));
                            }
                        });
                    }).catch(err => {
                        console.log('小程序userPay error', err);
                    });
            },
            alipayPay(order_id,payData){
                let _this = this;
				this.$http.post('/activity/userPay', payData).then(res => {
					console.log('小程序userPay succ', res);
					uni.requestPayment({
						provider: "alipay",
						orderInfo: res.trade_no,
						success: function(res) {
							if(res.resultCode == 6001){
								uni.showToast({
									title: res.memo,
									icon: "none",
									duration: 2000,
								});
							} else if(res.resultCode == 9000) {
								uni.showToast({
									title: "支付成功",
									icon: "success",
									duration: 2000,
								});
								setTimeout(() => {
									uni.navigateTo({url:'/pages/order/orderDetail?id='+order_id+'&type=1'})
								}, 2000);
							} else {
								uni.showToast({
									title: "错误"+res.memo,
									icon: "none",
									duration: 2000,
								});
							}
						},
						fail: function(res) {
							let err_msg = ''
							if (res.errMsg == 'requestPayment:fail cancel') {
								err_msg = '取消支付'
							}
							uni.showModal({
								content: "支付失败,原因为: " + err_msg,
								showCancel: false
							})
							console.log('fail:' + JSON.stringify(res));
						}
					});
				}).catch(err => {
					console.log('小程序userPay error', err);
				});
            },
            h5AppPay(payData) {
				let payItem = payData;
				this.$refs.popupRef.handleShow({
					actions: [{
							name: '支付宝',
							icon: 'iconfont active',
							color: '#651FFF'
						},
						{
							name: '微信',
							// image: 'http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
						}
					],
					success: (res) => {
						let payWay = 0;
						console.log('res---',res)
						switch (res.id) {
							// -1代表取消按钮
							case -1:
								console.log(res)
								break
							case 0:
								payWay = 2;
								break
							case 1:
								payWay = 1;
								break
						}
						if(payWay == 0){
							return;
						}
						let call_way = '';
						//#ifdef APP-PLUS
						call_way = 'app'
						//#endif
						//#ifdef H5
						call_way = 'h5'
						//#endif
						let payData = {
							'id': payItem.id,
							'price': payItem.price,
							'pay_way': payWay,
							// 'call_way': call_way
						};
						console.log('payData', payData);
						let _this = this;
						this.$http.post('/activity/userPay', payData).then(res => {
							console.log('userPay succ', res);
							//#ifdef APP-PLUS
							uni.requestPayment({
								provider: payWay == 1 ? 'wxpay' : 'alipay',
								orderInfo: res,
								success: function(res) {
									uni.showToast({
										title: "支付成功",
										icon: "success",
										duration: 2000,
									});
									setTimeout(() => {
										_this.getOrderList();
									}, 2000);
								},
								fail: function(res) {
									let err_msg = ''
									if (res.errMsg == 'requestPayment:fail cancel') {
										err_msg = '取消支付'
									} else {
										err_msg = res.errMsg;
									}
									uni.showModal({
										content: "支付失败,原因为: " + err_msg,
										showCancel: false
									})
									console.log('fail:' + JSON.stringify(res));
								}
							});
							//#endif
							//#ifdef H5
								if (payWay == 1) {
									if (res.indexOf('https://wx.tenpay.com') != -1) {
										window.location.href = res;
									}
								} else if (payWay == 2) {
									this.$refs.alipay.innerHTML = res;
									console.log('res----',res)
									document.forms["alipay_submit"].submit();
								}
							//#endif
						}).catch(err => {
							console.log('userPay error', err);
						});
					}
				})
			},
		}
	}
</script>

<style lang="scss" scope>
.contain{
    padding: 30rpx;
    background-color: #ffffff;
    margin-bottom: 20rpx;
}
.atitle{
    font-size: 32rpx;
    color: #999999;
    padding: 20rpx 0;

}
.act-info{
    display: flex;
    // align-items: flex-start;
    justify-content: space-between;
    .img{
        width: 250rpx;
        height: 180rpx;
    }
    .info{
        width: 450rpx;
        margin-left: 30rpx;
        display: flex;
		flex-direction: column;
        p{
			line-height: 50rpx;
		}
		.title{
			font-weight: bold;
			color: #333333;
		}
		.message{
			font-size: 28rpx;
            color: #666666;
            display: flex;
            justify-content: space-around;
            span{
                display: block;
            }
            .msg-title{
                width:180rpx;
            }
            .msg-content{
                width: 400rpx;

            }
			.price{
				color:#DB1522;
				font-weight: bold;
			}
        }
        .price{
            color: #333333;

        }
    }
}
.userform{
    background-color: #ffffff;
    .tips{
            color:#FF5600;
            font-size: 24rpx;
            margin: 10rpx 30rpx;
            text-align: right;
        }
    .form-item1{
        padding: 30rpx;
    }    
    .form-item2{
        padding: 0 30rpx 30rpx 30rpx;
    } 
    .form-item{
        display: flex;
        justify-content: space-between;
        
        border-bottom: #f8f8f8 1px solid;
        p{
            line-height: 40rpx;
        }
        .left{
            font-size: 30rpx;
            font-weight: bold;
        }
        .right{
            height: 40rpx;
            display: flex;
            align-items: center;
        }
        
        .phone-input{
            font-size: 28rpx;
            display: inline-block;
            width: 200rpx;
        }
        .right1{
            height: 40rpx;
            display: flex;
            align-items: center;
        }
        .lastcount{
            font-size: 24rpx;
            color: #333333;
            margin-right: 20rpx;
        }
    }
}
.footer{
	display: flex;
	justify-content: space-between;
	font-size: 36rpx;
	background-color: #ffffff;
	position: absolute;
	width: 100%;
	align-items: center;
	bottom: 0;
	.cost::before{
		content: '合计：';
		color:#333333;
	}
	.cost{
		color: #EA001F;
		margin-left: 30rpx;
	}
	.right{
		padding: 25rpx 60rpx;
		background-color: #EA001F;
		color: #ffffff;
	}
}
</style>
