<template>
	<view>
		<view class="model-order">
			<div class="work-info">
				<div class="big-title">工作信息</div>

				<div class="interval-time">
					<div class="text-line">
						<p class="start">开始时间</p>
						<p class="end">结束时间</p>
					</div>
					<div class="time-line">
						<p class="start">03月18日 18时</p>
						<p class="days">1天</p>
						<p class="end">03月18日 18时</p>
					</div>
				</div>

				<div class="work-content">
					<div class="mid-title">工作内容</div>
					<div class="text">
						<textarea class="content-text" type="text" placeholder="请输入模特具体工作内容" v-model="remark"/>
					</div>
					
				</div>
				<div class="work-place">
					<div class="mid-title">工作地点</div>
					<div class="address" @click="gotoMyAddress">
						<p class="add-left" v-text="address?address:'请添加工作地址'"></p>
						<p class="iconfont iconyoujiantou"></p>
					</div>
				</div>

				<div class="applyRefund">
					<radio-group class="apply-group" @change="applyRadioChange">
						<label class="apply-item" v-for="(item, index) in applyList" :key="item.value">
							<view>
								<radio :value="item.value" :checked="index === applyCurrent" color="#651FFF" />
								{{item.name}}
							</view>
						</label>
					</radio-group>
				</div>
			</div>

			<!-- #ifdef H5 || APP-PLUS -->
			<div ref="alipay"></div>
			<min-action-sheet ref="popupRef"></min-action-sheet>
			<!-- #endif -->
		</view>

		<view class="order-info">
			<div class="big-title">订单信息</div>

			<div class="order-cart">
				<div class="shop-name">
					<span class="iconfont icondianpu"></span>
					<span class="name">店名</span>
				</div>
				<div class="goods-item">
					<div class="img">
						<image src=""></image>
					</div>
					
					<div class="detail">
						<div class="name">detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail</div>
						<div class="price">￥300</div>
					</div>
				</div>
			
			</div>
		</view>

		<div class="footer">
			<div class="left">
				<span class="cost">￥300</span>
			</div>
			<!--#ifdef MP-WEIXIN || MP-ALIPAY  -->
			<div class="right" @click="comfirmToPay">去付款</div>
			<!--#endif -->
			<!--#ifdef APP-PLUS || H5 -->
			<!-- 如果不是微信小程序 先选支付方式 -->
			<div class="right" @click="selectPayWay">去付款</div>
			<!--#endif -->
		</div>
	</view>
		
</template>

<script>
import uniList from "@/components/uni-ui/uni-list/uni-list.vue"
import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue"
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
import minActionSheet from '@/components/min-action-sheet/min-action-sheet'
import { model } from '@/common/api/api';
import {Format} from '@/common/utils/formatDate.js'
import { defaultEquipPic } from '@/common/utils/config';
	export default {
		components:{
			uniNumberBox,uniPopup,minActionSheet,uniList,uniListItem
		},
		data() {
			return {
				applyList:[
					{name:'报销食宿'},{name:'报销差旅'},{name:'发票'}
				],
				applyCurrent:0,
				remark:'',
				address:'',
				addressObj:{},
				order_params:{}
			}
		},
		filters:{

		},
		mounted() {
			
		},
		onLoad: function(e) {
			
			
		},
		onShow(){
			let data = uni.getStorageSync('selectAddress');
			this.address = data.address+data.addressPOI;
			this.addressObj = data;
			this.order_params = uni.getStorageSync('orderParams')
			console.log('this.order_params--',this.order_params)
			
		},
		methods: {
			applyRadioChange(){

			},
			gotoMyAddress(){
				uni.navigateTo({url:'/pages/my/address?from=detail'})
			},
			validForm(){
				// if(this.address.id&&this)
			},
			subscribe(){
				let params = Object.assign(this.order_params,{address_id:this.addressObj.id,remark:this.remark});
				return new Promise((resolve,reject)=> {
					this.$http.post(model.appoit,params).then(res => {
						uni.removeStorage({key:'orderParams'});
						resolve(res)
					})
				})	
				
			},
			async comfirmToPay(){
				let order = await this.subscribe()
				let pay_data = {
					order_id:order.id,
					total_price:order.price,
					// #ifdef MP-WEIXIN
					pay_way:1,
					call_way:'mp-weixin',
					// #endif
					// #ifdef MP-ALIPAY
					pay_way:2,
					call_way:'mp-alipay',
					// #endif
				}
				
			},
			async selectPayWay(){
				let order = await this.subscribe()
				this.$refs.popupRef.handleShow({
					actions: [{
							name: '支付宝',
							// icon: 'iconfont active',
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
							'order_id': order.id,
							'total_price': order.price,
							'pay_way': payWay,
							'call_way': call_way
						};
						console.log('payData', payData);
						let _this = this;
						this.$http.post('/order/userPay', payData).then(res => {
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
										// _this.getOrderList();
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
			// #ifdef MP-WEIXIN
			// 微信端微信支付
			wxPay(){
				this.$http.post(model.pay,pay_data).then(res => {
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
							});
							setTimeout(() => {
								// uni.navigateTo({url:'/pages/order/orderDetail?id='+_this.order_detail.id+'&type=0'});
							}, 2000);
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
				}).catch(err=>{})
			},
			// #endif

			// #ifdef MP-ALIPAY
			aliPay(){
				let _this = this;
				let payData = {
					'order_id': this.order_detail.id,
					'total_price': this.order_detail.price,
					'pay_way': 2,
					'call_way': 'mp-alipay'
				};
				let payApi = '/order/userPay';
				
				this.$http.post(payApi, payData).then(res => {
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
									uni.navigateTo({url:'/pages/order/orderDetail?id='+_this.order_detail.id+'&type=0'});
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
								content: "支付失败,原因为: " + res,
								showCancel: false
							})
							console.log('fail:' + JSON.stringify(res));
						}
					});
				}).catch(err => {
					console.log('小程序userPay error', err);
				});
			},
			// #endif
		}
	}
</script>

<style lang="scss" scope>
.big-title{
	font-size: 36rpx;
	color: #333333;
	font-weight: bold;
	margin-bottom: 30rpx;
}
.model-order{
    padding: 30rpx;
    background-color: #ffffff;
    
    .mid-title{
        color: #333333;
        font-size: 32rpx;
		margin-bottom: 30rpx;
    }
    .interval-time{
		.text-line{
			font-size: 30rpx;
			color: #333333;
			display: flex;
			justify-content: space-between;
			margin-bottom: 24rpx;
			p{
				width: 252rpx;
			}
		}
		.time-line{
			display: flex;
			justify-content: space-between;
			padding-bottom: 32rpx;
			margin-bottom: 32rpx;
			border-bottom: 1rpx solid #EBEBEB;
			.start,.end{
				font-size: 36rpx;
				color: #999999;
				width: 252rpx;
			}
			.days{
				color: #651FFF;
				font-size: 26rpx;
				display: table-cell;
				vertical-align: bottom;
			}
		}
		
	}
	.work-content{
		.text{
			width: 100%;
			background-color: #F8F8F8;
			border: 1rpx solid #EBEBEB;
			border-radius: 4rpx;
			margin-bottom: 30rpx;
			.content-text{
				margin: 0 auto;
				padding: 20rpx 0;
				font-size: 30rpx;
				width: 640rpx;
			}
		}
		
	}
	.work-place{
		.address{
			background-color: #F8F8F8;
			border-radius: 4rpx;
			border: 1rpx solid #EBEBEB;
			height: 80rpx;
			line-height: 60rpx;
			align-items: center;
			width: 100%;
			display: flex;
			justify-content: space-between;
			color: #333333;
			font-size: 30rpx;
			.add-left{
				margin: 0 20rpx;
			}
			.iconfont{
				margin-right: 20rpx;
			}
		}
	}
	.apply-group{
		display: flex;
		justify-content: space-between;
		font-size: 30rpx;
		margin: 30rpx 0;
		.apply-item{
			width: 200rpx;
			radio{ 
                transform:scale(.7);
            }
		}
	}
}
.order-info{
	padding: 30rpx;
	background-color: #ffffff;
	margin-top: 30rpx;
	margin-bottom: 100rpx;
	.order-cart{
		.shop-name{
			font-size: 26rpx;
			color: #333333;
			margin-bottom: 20rpx;
			.iconfont{
				color: #666666;
				font-size: 36rpx;
				margin-right: 20rpx;
			}
		}
		.goods-item{
			display: flex;
			justify-content: space-between;
			image{
				width: 168rpx;
				height: 168rpx;
				margin-right: 20rpx;
				background-color: #F8F8F8;
			}
			.detail{
				flex:1;
				height: 168rpx;
				display: flex;
				flex-flow: row wrap;
				align-content: space-between;
				.name{
					font-size: 28rpx;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 466rpx;
				}
				.price{
					color: #EA001F;
					font-size: 30rpx;
					font-weight: bold;
					width: 100%;
					height: 48rpx;
				}
			}
		}
	}
}
.footer{
	position: fixed;
	display: flex;
	justify-content: space-between;
	font-size: 36rpx;
	background-color: #ffffff;
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
