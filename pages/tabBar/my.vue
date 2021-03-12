<template>
	<view class="content">
		<view class="head">
			<view class="header">
				<div class="avatar-box">
					<div class="img">
						<image  :src="util.avatarUtil(user.paitume_user.avatar)"   @click="toMy('setting')" mode="aspectFill"></image>
					</div>
					
					<div class="true-name" v-if="!user.paitume_user.trueName" @click="gotoTruename">去实名认证</div>
				</div>
				<!-- <image class="img" src="./../../static/img/my/1.png"></image> -->
				<view class="header-info">
					<p class="name" v-if="user.paitume_user">
						<span v-if="user.paitume_user.nick">{{user.paitume_user.nick}}</span>
						<span v-else>未命名</span>
					</p>
					<p class="name" v-else>
						未登录
					</p>
					
					
					<text class="phone" v-if="user.paitume_user.mobile">{{user.paitume_user.mobile}}</text>
					<!-- <p class="sign " v-if="user.paitume_user.trueName">
						<span class="iconfont iconrenzheng"></span>
						<span>已实名</span>
					</p>
					<p class="sign " v-else>未实名</p> -->
				</view>
				<div class="setting">
					<div class="gotoMessage" @click="gotoMessage">
						<span class="iconfont iconxiaoxi1"></span>
						<span class="new" v-if="read.length>0"></span>
					</div>
					<p class="iconfont iconshezhi"  @click="toMy('setting')"></p>
				</div>
			</view>
			<div class="collect">
				<div v-for="(item,index) in collect" :key="index" class="collect-item" @click="gotoCollect(item.type)">
					<span class="number">{{item.num}}</span>
					<span class="name">{{item.name}}</span>
				</div>
			</div>
		</view>

		<div class="cart">
			<div class="list-title">我的订单</div>
			<div class="order">
				<div v-for="(item,index) in order" :key="index" class="order-item" @click="gotoOrder(item.type)">
					<span class="iconfont icon" :class="item.icon"></span>
					<span class="name">{{item.name}}</span>
					<span class="count" v-if="item.count&&item.count!=0">{{item.count}}</span>
				</div>
			</div>
		</div>
		
		<div class="cart1">
			<div class="list-title">我的工具</div>
			<div class="using-list">
				<div class="using-item" v-for="(item, index) in list" :key="index" @click="toMyList(item.direction)">
					<span class="iconfont" :class="item.icon"></span>
					<span class="name">{{item.name}}</span>
				</div>
				<!-- #ifdef MP-WEIXIN -->
				<div class="using-item" @click="chatToPaitu">
					<button open-type="contact" bindcontact="handleContact" class="contectBtn">{{sevice.name}}</button>
					<span class="iconfont" :class="sevice.icon"></span>
					<span class="name">{{sevice.name}}</span>
				</div>
				<!-- #endif  -->
				<!-- #ifdef MP-ALIPAY -->
				<div class="using-item">
					<contact-button tnt-inst-id="MEh_Sx6x" scene="SCE00184167"/>
					<span class="iconfont" :class="sevice.icon"></span>
					<span class="name">{{sevice.name}}</span>
				</div>
				<!-- #endif -->
				
			</div>
		</div>
		
		
		<!-- <view class="list">
			<view class="list-item" v-for="(item, index) in list" :key="index" @click="toMyList(item.direction)">
				<span class="iconfont icon" :class="item.icon"></span>
				<text>{{item.name}}</text>
				<text class="iconfont iconyoujiantou next"></text>
			</view>
			<view class="list-item" @click="toMyList(sevice.direction)">
				<span class="iconfont icon" :class="sevice.icon"></span>
				<button open-type="contact" bindcontact="handleContact" class="contectBtn">{{sevice.name}}</button>
				<text class="iconfont iconyoujiantou next"></text>
			</view>
		</view> -->

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		collectOrFollow,
		message,
		order
	} from '@/common/api/api'
	// #ifdef H5 || APP-PLUS
	import { promptLogin } from '@/common/login/login';
	// #endif
	
	// #ifdef MP-WEIXIN
	import { promptBind,weixin } from '@/common/login/login';
	// #endif
	export default {
		components: {
		},
		computed: {
			...mapState(['user'])
		},
		data() {
			return {
				host: this.$qiniuHost,
				header: {},
				collect: [{
						num: 0,
						name: '影棚收藏',
						direction: 'collectProduce',
						type: 1
					},
					{
						num: 0,
						name: '器材收藏',
						direction: 'collectEquitment',
						type: 2
					},
					{
						num: 0,
						name: '店铺收藏',
						direction: 'collectShop',
						type: 0
					},
					{
						num: 0,
						name: '模特收藏',
						direction: 'collectActivity',
						type: 4
					},
				],
				order: [
					{
						name: '全部订单',
						icon: 'iconquanbudingdan1',
						type: 0,
						count: null
					},
					{
						name: '未支付',
						icon: 'icondaifukuan1',
						type: 1,
						count: null
					},
					{
						name: '已付款',
						icon: 'iconyifukuan1',
						type: 2,
						count: null
					},
					{
						name: '待评论',
						icon: 'iconpingjia',
						type: 4,
						count: null
					},
					
				],
				list: [{
						name: '我的活动',
						icon: 'iconhuodong2',
						next: true,
						direction: 'myActivity'
					},
					{
						name: '优惠券',
						icon: 'iconyouhuiquan1',
						next: true,
						direction: 'myDiscount'
					},
					{
						name: '我的评价',
						icon: 'iconwodepingjia',
						next: true,
						direction: 'myComments'
					},
					// #ifdef H5 || MP-WEIXIN || APP-PLUS
					{
						name: '聊天列表',
						icon: 'iconxiaoxi1',
						next: true,
						direction: 'myChat'
					},
					// #endif
					// #ifndef MP-ALIPAY
					{
						name: '关注公众号',
						icon: 'iconsaomaweixin',
						next: true,
						direction: 'myOfficial'
					},
					//#endif
					{
						name: '我要合作',
						icon: 'iconwoyaohezuo',
						next: true,
						direction: 'myCooperation'
					},
				],
				sevice:{
						name: '联系客服',
						icon: 'iconlianxikefu',
						next: true,
						direction: 'sevice'
					},
				order_count: [],
				read:''
			}
		},

		onLoad() {
			console.log('user.paitume_user', this.user.paitume_user)
		},
		onShow() {
			if(this.user&&this.user.paitume_user){
				this.getCollections()
				this.getOrderCount();
				this.getMessages()
			}
		},
		mounted() {},
		// onGotUserInfo: function(e) {
		// 	console.log('e.detail.errMsg', e.detail.errMsg)
		// 	console.log('e.detail.userInfo', e.detail.userInfo)
		// 	console.log('e.detail.rawData', e.detail.rawData)
		// },
		methods: {
			// 点击联系客服开启和派图客服的聊天
			chatToPaitu(){
				// #ifdef H5
				// 此处为联系商家
				if(this.user.paitume_user){
					// 已登陆跳转到聊天窗口
					var navData = encodeURIComponent(JSON.stringify({id:'3',name:'派图租赁',avatar:'https://pic.paitume.com/3-1574930649906.jpg'})); // 这里转换成 字符串
					uni.navigateTo({
							url:'/pages/my/myList/chatBox?chatObj='+navData
					})
				}else{
					// 未登录跳转到登录,登录完再跳转到聊天窗口
					promptLogin();
				}
				// #endif
				
			},
			getMessages(){
				this.$http.get(message.getMsgNum).then(res => {
					this.read = res.read;
				})
			},
			//跳转到我的消息页面
			gotoMessage(){
				if(this.read.length>0){
					uni.navigateTo({
						url: '/pages/my/message/message'
					})
				}else{
					uni.showToast({title: "暂无消息",icon: 'none'});
				}
				
			},
			gotoTruename(){
				uni.navigateTo({
					url: '/pages/my/bindRealname'
				});
			},
			//跳转
			gotoCollect(type) {
				uni.navigateTo({
					url: '/pages/my/myCollection/myCollection?type=' + type
				});
			},
			handleContact(e){
				console.log('eee---',e)
			},
			toMyList(e) {
				if (!this.$store.getters.is_login_in) {
					// #ifdef H5 || APP-PLUS
					promptLogin();
					// #endif
					// #ifdef MP-WEIXIN
					promptBind();
					// #endif
				} else {
					if (e === 'sevice') {
					} else {
						this.$Router.push('/pages/my/myList/' + e)
					}
				}
				
			},
			toMy(e) {
				if(this.$store.getters.is_login_in){
					this.$Router.push('/pages/my/' + e)
				}else{
					 // #ifdef H5 || APP-PLUS
					promptLogin();
					// #endif
					// #ifdef MP-WEIXIN
					weixin()
					// #endif
				}
				
			},
			login() {
				let that = this;
				uni.login({
					provider: 'weixin',
					success: (res) => {
						this.code = res.code;
						console.log('code', res);
						this.$store.dispatch("Login", res.code);
						console.log('this.user.user_data.has_reg', this.user)

					}
				});

			},
			getCollections() {
				this.$http.get(collectOrFollow.getCount, {
					obj: '1'
				}).then(res => {
					this.collect.forEach(v => {
						if (v.type == 0) {
							v.num = res.user_count
						}
						if (v.type == 1) {
							v.num = res.studio_count
						}
						if (v.type == 2) {
							v.num = res.equip_count
						}
						if (v.type == 3) {
							v.num = res.activity_count
						}
					});
					console.log('this.collect_count-------', this.collect_count)
				}).catch(err=>{
					
				})
			},
			getOrderCount() {
				this.$http.get(order.getOrders).then(res => {
					this.order.forEach(item => {
						// if(item.type==0){item.count=res.total_count}
						if (item.type == 1) {
							item.count = res.OrderStatusWaitPay
						}
						if (item.type == 2) {
							item.count = res.OrderStatusPaid
						}
						if (item.type == 3) {
							item.count = res.OrderStatusWaitComment
						}
					})
					console.log('this.order_count-------', this.order_count)
				}).catch(err=>{
					
				})
			},
			gotoOrder(type) {
				uni.navigateTo({
					url: '../order/orderList/orderList?state=' + type
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: #f8f8f8;
	}

	.head {
		/* #ifndef APP-PLUS  */
		padding: 46rpx;
		/* #endif */
		/* #ifdef APP-PLUS  */
		padding: 76rpx 46rpx 46rpx;
		/* #endif */
		background-color: #651FFF;
	}

	.header {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.avatar-box{
			position: relative;
			.img {
				background-color: #ffffff;
				width: 129rpx;
				height: 129rpx;
				border-radius: 50%;
				image{
					width: 129rpx;
					height: 129rpx;
					border-radius: 50%;
				}
				
			}
			.true-name{
				width: 136rpx;
				height: 36rpx;
				line-height: 36rpx;
				background-color: #DCD2F4;
				border-radius: 18rpx;
				font-size: 22rpx;
				color: #333333;
				position: absolute;
				bottom: -9rpx;
				text-align: center;
			}
		}
		

		.setting {
			display: flex;
			justify-content: center;
			align-items: baseline;
			height: 129rpx;
			color: #ffffff;
			.iconfont{
				font-size: 23px;
			}
		}

		.header-info {
			flex: 1;
			padding-left: 36rpx;
			color: #ffffff;

			.name {
				display: block;
				font-size: 28rpx;
				font-weight: bold;
				// margin-bottom: 10rpx;

			}

			.phone {
				display: block;
				font-size: 24rpx;
				height: 40rpx;
				line-height: 40rpx;
				width: 180rpx;
				text-align: center;
				color: #ffffff;
				background:rgba($color: #B79BF5, $alpha: 0.5);
				margin-top: 10rpx;
				border-radius: 20rpx;
			}

			.sign {
				font-size: 24rpx;
				color: #7000FF;
				display: flex;
				align-items: center;
				span{
					display: inline-block;
				}
				/deep/.iconfont{
					margin-right: 5rpx;
					font-size: 26rpx;
				}
			}
		}

	}

	.collect {
		margin:21rpx 0rpx;
		padding:25rpx 0rpx 0;
		display: flex;
		justify-content: space-around;
		.collect-item {
			width: 200rpx;
			text-align: center;
			color: #ffffff;

			span {
				display: block;

			}

			.number {
				font-size: 36rpx;
				font-weight: bold;
				line-height: 60rpx;
				height: 60rpx;
			}

			.name {
				font-size: 26rpx;
			}
		}

	}
	.cart{
		margin: -30rpx 35rpx 35rpx;
		border-radius: 16rpx;
		background-color:#fff;
	}
	.cart1{
		margin: 35rpx;
		border-radius: 16rpx;
		background-color:#fff;
	}
	.list-title{
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
		padding: 20rpx 40rpx; 
	}
	.order,.using-list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 20rpx 0;
		flex-wrap: wrap;
		.order-item,.using-item {
			text-align: center;
			position: relative;
			width: 170rpx;
			.count {
				display: inline-block;
				width: 28rpx;
				height: 28rpx;
				line-height: 28rpx;
				text-align: center;
				border-radius: 28rpx;
				background-color: #EA001F;
				color: #ffffff;
				font-size: 22rpx;
				position: absolute;
				top: 0;
				right: 55rpx;
			}
		}
	
		span {
			display: block;
			font-size: 24rpx;
		}
	
		.icon {
			color: #E1B10B;
			
		}
		.iconfont{
			font-size: 65rpx;
		}
		.name {
			color: #333333;
			line-height: 45rpx;
		}
		.using-item{
			position: relative;
			height: 150rpx;
			.contectBtn,contact-button{
				width: 170rpx;
				height: 150rpx;
				opacity: 0;
				top: 0;
				position: absolute;
			}
		}
	}

	.list {
		// margin: -15rpx 40rpx 60rpx;
		color: rgb(51, 51, 51);
		font-size: 30rpx;
		background-color: #ffffff;

		.list-item {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom: 1px solid #f8f8f8;
			background-color: rgb(255, 255, 255);
			height: 100rpx;
			line-height: 85rpx;
			padding: 0 40rpx;

			.icon {
				margin-right: 30rpx;
				color:#E1B10B;
				font-size:26px;
			}

			.next {
				flex: 1;
				text-align: right;
			}
			.contectBtn{
				background-color: #ffffff;
				font-size: 30rpx;
				margin: 0;
				padding: 0;
				width: 100%;
				border: 0;
				text-align: left;
			}
			button::after {
				background-color: transparent;
				outline: none;
				border: 0;
			}
			

		}
	}

	.gotoMessage {
		position: relative;
		margin-right: 34rpx;

		.new {
			width: 12rpx;
			height: 12rpx;
			border-radius: 12rpx;
			background-color: #EA001F;
			position: absolute;
			top: 8rpx;
			right: -3rpx;
		}

	}
</style>
