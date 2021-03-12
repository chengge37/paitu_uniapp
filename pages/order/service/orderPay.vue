<template>
	<view>
		<view class="post">
			<view class="pick-way">
				<div class="way" :class="item.active?'active':''" v-for="(item,index) in tabs" :key="index" @click="tabChange(item.name)">{{item.name}}
					<div class="border"></div>
				</div>
			</view>
			<view class="address" v-if="tabIndex==0" @click="gotoMyAddress">
				<div class="left" >
					<div class="name" v-if="defaultAddress&&defaultAddress.id">
                        <span class="iconfont iconyonghu"></span>
						<span>{{defaultAddress.name}}</span><span class="tel">{{defaultAddress.mobile}}</span>
					</div>
                    <div class="detail">
                        <span class="iconfont icondizhi2"></span>
                        <span v-if="defaultAddress&&defaultAddress.id">{{defaultAddress.address+defaultAddress.addressPOI}}</span>
                        <span v-else>暂无地址，去添加？</span>
                    </div>
				</div>
                <div class="right">
                    <span class="iconfont iconyoujiantou"></span>
                </div>
			</view>
		</view>

		<view class="order-info">
			<div class="big-title">订单信息</div>

			<div class="order-cart">
				<div class="shop-name">
					<span class="iconfont icondianpu"></span>
					<span class="name">{{serviceDetail.user.nick}}</span>
				</div>
				<div class="goods-item">
					<div class="img">
						<image :src="host + util.picExplode(serviceDetail.pic)" mode="aspectFill"></image>
					</div>
					
					<div class="detail">
						<div class="name">{{serviceDetail.title}}</div>
						<div class="line">
							<p class="price" v-if="type==1">￥{{serviceDetail.norms[normIndex].price}}</p>
							<p class="price" v-else>￥{{serviceDetail.price}}</p>
							<div class="num">
								<uni-number-box 
								:min="1" 
								:value="type==1?order_params.count:order_params.num" 
								class="count"  
								@change="countChange"></uni-number-box>
							</div>
						</div>
					</div>
				</div>
			
			</div>
		</view>
		<view class="shopAddress" v-if="!tabIndex">
			<div class="addressinfo">
				<div class="title">商家信息</div>
				<div class="tips">请将样品寄到以下地址：</div>
				<div class="address">
					<span class="iconfont icondizhi2"></span>
					<span v-if="type==1">{{serviceDetail.address.address}}</span>
					<span v-else>{{serviceDetail.user.address}}</span>
				</div>
				<div class="info" v-if="type==1">
					<span class="name">{{serviceDetail.address.name}}</span>
					<span class="tel">{{serviceDetail.address.mobile}}</span>
				</div>
				<div class="info" v-else>
					<span class="name">{{serviceDetail.user.name}}</span>
					<span class="tel">{{serviceDetail.user.mobile}}</span>
				</div>
			</div>
			
		</view>
		<div class="footer">
			<div class="left">
				<span class="cost">￥{{orderPrice}}</span>
			</div>
			<div class="right" @click="validForm">去付款</div>
		</div>

        <!-- #ifdef H5 || APP-PLUS -->
        <div ref="alipay"></div>
        <min-action-sheet ref="popupRef"></min-action-sheet>
        <!-- #endif -->
	</view>
		
</template>

<script>
import uniList from "@/components/uni-ui/uni-list/uni-list.vue"
import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue"
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
import minActionSheet from '@/components/min-action-sheet/min-action-sheet'
import { service,groupBook } from '@/common/api/api';
import {Format} from '@/common/utils/formatDate.js'
import { defaultEquipPic } from '@/common/utils/config';
	export default {
		components:{
			uniNumberBox,uniPopup,minActionSheet,uniList,uniListItem
		},
		data() {
			return {
				host: this.$qiniuHost,
				type:1,
                tabs:[
					{name:'寄回样品',active:true,type:0},
					{name:'不需寄回样品',active:false,type:1},
                ],
                defaultAddress:{},
                tabIndex:0,
				applyList:[
					{name:'报销食宿'},{name:'报销差旅'},{name:'发票'}
				],
				applyCurrent:0,
				remark:'',
				address:'',
				addressObj:{},
                order_params:{},
				serviceDetail:{},
				normIndex:0,
				payApi:''
			}
		},
		computed:{
			orderPrice(){
				if(this.type==1){
					return this.serviceDetail.norms[this.normIndex].price*this.order_params.count
				}else if(this.type==2){
					return this.serviceDetail.price*this.order_params.num
				}
				
			}
		},
		filters:{

		},
		mounted() {
			
		},
		onLoad: function(e) {
            this.order_params = uni.getStorageSync('orderParams');
			this.serviceDetail = uni.getStorageSync('Detail');
			this.type = e.type;
			if(e.type==1){
				let ret = this.serviceDetail.norms.findIndex(e=>e.id==this.order_params.norms_id);
				if(ret!=-1){
					this.normIndex = ret;
				}
				this.payApi = service.pay;
			}else{
				this.payApi = groupBook.pay;
			}
			uni.removeStorage({key:'orderParams'});
			uni.removeStorage({key:'Detail'});
            // uni.removeStorage({key:'serviceDetail'});
			console.log('this.order_params--',this.order_params)
			console.log('this.serviceDetail--',this.serviceDetail)
			console.log('this.payApi--',this.payApi)
			
		},
		onShow(){
			let data = uni.getStorageSync('selectAddress');
			this.address = data.address+data.addressPOI;
			this.defaultAddress = data;
			
		},
		methods: {
			applyRadioChange(){

            },
            tabChange(data){
				this.tabs.forEach(item => {
					if(item.name == data){
						item.active = true;
						this.tabIndex = item.type;
					}else{
						item.active = false;
					}
				});
			},
			gotoMyAddress(){
				uni.navigateTo({url:'/pages/my/address?from=detail'})
			},
			countChange(val){
				this.order_params.count = val
			},
			validForm(val){
				if(this.tabIndex==0&&!(this.defaultAddress.id&&this.defaultAddress.id)){
					uni.showToast({title:'请添加寄回样品的地址',icon:'none'})
				}else{
					// #ifdef MP-WEIXIN || MP-ALIPAY
					this.comfirmToPay()
					// #endif
					// #ifdef APP-PLUS || H5
					this.selectPayWay()
					// #endif
				}
				
			},
			subscribe(){
				let params = {};
				let api = '';
				if(this.type==1){
					params = Object.assign(this.order_params,{remark:this.remark});
					api = service.appoit
				}else{
					params = Object.assign(this.order_params,{});
					api = groupBook.appoit
				}
				if(this.defaultAddress.id&&this.defaultAddress.id){
					params = Object.assign(this.order_params,{address_id:this.defaultAddress.id})
				}
				
				return new Promise((resolve,reject)=> {
					this.$http.post(api,params).then(res => {
						resolve(res)
					})
				})	
				
			},

			async comfirmToPay(){
				let order = await this.subscribe();
				let order_id;
				if(this.type==1){
					order_id = order
				}else{
					order_id = order.id
				}
				let pay_data = {
					order_id:order_id,
				}
				if(this.type==2){
					pay_data.total_price = order.price
				}
				// #ifdef MP-WEIXIN
				pay_data.pay_way = 1
				pay_data.call_way = 'mp-weixin'
				this.wxPay(pay_data);
				// #endif
				// #ifdef MP-ALIPAY
				pay_data.pay_way = 2
				pay_data.call_way = 'mp-alipay'
				this.aliPay(pay_data)
				// #endif
			},
			async selectPayWay(){
				let order = await this.subscribe();
				let order_id;
				if(this.type==1){
					order_id = order
				}else{
					order_id = order.id
				}
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
							'order_id': order_id,
							'pay_way': payWay,
							'call_way': call_way
						};
						if(this.type==2){
							payData.total_price = order.price
						}
						console.log('payData', payData);
						let _this = this;
						let api;
						this.$http.post(this.payApi, payData).then(res => {
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
			wxPay(pay_data){
				this.$http.post(this.payApi,pay_data).then(res => {
					uni.requestPayment({
						provider: "wxpay",
						timeStamp: res.timeStamp,
						nonceStr: res.nonceStr,
						package: res.package,
						signType: "MD5",
						paySign: res.paySign,
						orderInfo: JSON.stringify(pay_data),
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
			aliPay(payData){
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
.post{
    .pick-way{
        padding: 30rpx;
        display: flex;
        justify-content: space-around;
        
        background-color: #ffffff;
        border-top: 1px solid #f8f8f8;
        border-bottom: 1px solid #f8f8f8;
        
        .way{
            width: 50%;
            text-align: center;
            font-size: 28rpx;
            color: #999999;
            position: relative;
            
        }
        .active{
            color: #651FFF;
            .border{
                position: absolute;
                left: 115rpx;
                top: 45rpx;
                width: 40rpx;
                height: 6rpx;
                background-color: #651FFF;
            }
        }
        .way:first-child{
            border-right: 1px solid #f8f8f8;
        }
        
        
    }
    .address{
        display:flex;
        justify-content:space-between;
        background: #ffffff;
        align-items: center;
        padding: 0 30rpx;
        .left{
            padding: 20rpx 20rpx 20rpx 0;
            line-height: 50rpx;
            font-size: 30rpx;
            color: #333333;
            .tel{
                margin-left: 10rpx;
                // color:#999999;
            }
            .iconfont{
                color: #651FFF;
                margin-right: 36rpx;
                font-size: 44rpx;
            }
        }
        .right{

        }
    }
}
.order-info{
	padding: 30rpx;
	background-color: #ffffff;
	margin-top: 30rpx;
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
				.line{
					width: 100%;
					height: 48rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price{
						color: #EA001F;
						font-size: 30rpx;
						font-weight: bold;
					}
					.num{
						/deep/ .uni-numbox__minus,/deep/  .uni-numbox__plus{
							width: 50rpx;
							font-size: 36rpx;
						}
						/deep/ .uni-numbox{
							height:50rpx;
						}
						/deep/ .uni-numbox__value{
							width: 60rpx;
							font-size: 28rpx;
						}
					}
				}
			}
		}
	}
}
.shopAddress{
	padding: 30rpx;
	background-color: #ffffff;
	margin-bottom: 100rpx;
	line-height: 50rpx;
	.addressinfo{
		border-top: 1rpx solid #d9d9d9;
		padding-top: 30rpx;
	}
	.title{
		font-size: 30rpx ;
		color: #333333;
		font-weight: bold;
	}
	.tips{
		color: #E8B61B;
		font-size: 26rpx;
	}
	.address{
		color: #333333;
		font-size: 30rpx;
		.iconfont{
			margin-right: 20rpx;
			font-size: 40rpx;
		}
	}
	.info{
		color: #333333;
		font-size: 30rpx;
		.name{
			margin-right: 20rpx;;
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
