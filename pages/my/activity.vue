<template>
	<view class="content">
		<view class="search">
			<input placeholder="搜索您想要的内容" placeholder-style="color:#c0c0c0;" @click="toSearch()" class="input" />
		</view>
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

					<!-- 活动列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.goodsList" :key="goodsIndex">
							<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.title}}</text>
								<text class="detail">{{goodsItem.detail}}</text>
								<view class="attr">
									<text class="attr-box">{{goodsItem.time}}</text>
									<text class="state">{{goodsItem.state}}</text>
								</view>
							</view>
						</view>
					</view>

					<uni-load-more :status="tabItem.loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-ui/uni-load-more/uni-load-more'
	export default {
		components: {
			uniLoadMore,
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部活动',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '进行中',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '已结束',
						loadingType: 'more',
						orderList: []
					}
				],
				orderList: [{
						state: 1,
						goodsList: [{
							title: '2019摄影大赛证是征稿',
							image: '../../static/img/my/6.png',
							detail: '摄影，是一门艺术，它并非仅仅记录视觉那么简单通过摄影师的精心“雕刻”，呈现...',
							time: '2019-06-11 至 2019-6-23',
							state: '进行中'
						}]
					},
					{
						state: 1,
						goodsList: [{
							title: '2019摄影大赛证是征稿',
							image: '../../static/img/my/6.png',
							detail: '摄影，是一门艺术，它并非仅仅记录视觉那么简单通过摄影师的精心“雕刻”，呈现...',
							time: '2019-06-11 至 2019-6-23',
							state: '进行中'
						}]
					},
					{
						state: 2,
						goodsList: [{
							title: '2019摄影大赛证是征稿',
							image: '../../static/img/my/6.png',
							detail: '摄影，是一门艺术，它并非仅仅记录视觉那么简单通过摄影师的精心“雕刻”，呈现...',
							time: '2019-06-11 至 2019-6-23',
							state: '已结束'
						}]
					},
					{
						state: 2,
						goodsList: [{
							title: '2019摄影大赛证是征稿',
							image: '../../static/img/my/6.png',
							detail: '摄影，是一门艺术，它并非仅仅记录视觉那么简单通过摄影师的精心“雕刻”，呈现...',
							time: '2019-06-11 至 2019-6-23',
							state: '已结束'
						}]
					},
					{
						state: 1,
						goodsList: [{
							title: '2019摄影大赛证是征稿',
							image: '../../static/img/my/6.png',
							detail: '摄影，是一门艺术，它并非仅仅记录视觉那么简单通过摄影师的精心“雕刻”，呈现...',
							time: '2019-06-11 至 2019-6-23',
							state: '进行中'
						}]
					},
					{
						state: 2,
						goodsList: [{
							title: '2019摄影大赛证是征稿',
							image: '../../static/img/my/6.png',
							detail: '摄影，是一门艺术，它并非仅仅记录视觉那么简单通过摄影师的精心“雕刻”，呈现...',
							time: '2019-06-11 至 2019-6-23',
							state: '已结束'
						}]
					},
					{
						state: 2,
						goodsList: [{
							title: '2019摄影大赛证是征稿',
							image: '../../static/img/my/6.png',
							detail: '摄影，是一门艺术，它并非仅仅记录视觉那么简单通过摄影师的精心“雕刻”，呈现...',
							time: '2019-06-11 至 2019-6-23',
							state: '已结束'
						}]
					},
					{
						state: 2,
						goodsList: [{
							title: '2019摄影大赛证是征稿',
							image: '../../static/img/my/6.png',
							detail: '摄影，是一门艺术，它并非仅仅记录视觉那么简单通过摄影师的精心“雕刻”，呈现...',
							time: '2019-06-11 至 2019-6-23',
							state: '已结束'
						}]
					}

				]
			}
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */

			// this.tabCurrentIndex = +options.state;
			this.loadData()
			// // #ifndef MP
			// this.loadData()
			// // #endif
			// // #ifdef MP
			// if (options.state == 0) {
			// 	this.loadData()
			// }
			// // #endif

		},
		methods: {
			//获取订单列表
			loadData(source) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;

				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}

				navItem.loadingType = 'loading';

				setTimeout(() => {
					let orderList = this.orderList.filter(item => {
						//添加不同状态下订单的表现形式
						item = Object.assign(item, this.orderStateExp(item.state));
						//演示数据所以自己进行状态筛选
						if (state === 0) {
							//0为全部订单
							return item;
						}
						return item.state === state
					});
					orderList.forEach(item => {
						navItem.orderList.push(item);
					})
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);

					//判断是否还有数据， 有改为 more， 没有改为noMore 
					navItem.loadingType = 'more';
				}, 600);
			},

			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index) {
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(() => {
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			//取消订单
			cancelOrder(item) {
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(() => {
					let {
						stateTip,
						stateTipColor
					} = this.orderStateExp(0);
					item = Object.assign(item, {
						state: 0,
						stateTip,
						stateTipColor
					})

					//取消订单后删除待付款中该项
					let list = this.navList[1].orderList;
					let index = list.findIndex(val => val.id === item.id);
					index !== -1 && list.splice(index, 1);

					uni.hideLoading();
				}, 600)
			},

			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#a0a0a0';
				switch (+state) {
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '待发货';
						break;
					case 0:
						stateTip = '订单已关闭';
						stateTipColor = '#909399';
						break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			},
			toSearch() {
				uni.showToast({
					title: '搜索功能'
				});
			},
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background: #fff;
		height: 100%;
	}

	.search {
		height: 30px;
		font-size: 28rpx;
		margin: 0 20rpx;
		border-width: 1px;
		border-color: rgb(204, 204, 204);
		border-style: solid;
		border-radius: 10rpx;
		background-color: rgb(255, 255, 255);
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		display: flex;
		justify-content: flex-start;
		align-items: center;
		text-align: left;

		.input {
			flex: 1;
			padding: 6px 10px;
		}

		.icon {
			color: #cccccc;
			padding-left: 10px;
		}
	}

	.swiper-box {
		height: calc(100% - 72px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;

		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: #666666;
			position: relative;

			&.current {
				color: #000;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 6rpx solid #4a8bff;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;

		border-bottom: 1rpx solid #eeeeee;
		// box-shadow: 0px 0px 15px 0px rgba(4, 0, 0, 0.1);
		margin-top: 16rpx;
		margin: 0 20rpx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80rpx;
			padding-right: 30rpx;
			font-size: 30rpx;
			color: #666666;
			position: relative;

			.state {
				color: #b4b4b4;
			}
		}


		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20rpx 0;
			font-size: 28rpx;

			.goods-img {
				display: block;
				width: 200rpx;
				height: auto;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-left: 24rpx;
				overflow: hidden;

				.title {
					font-size: 32rpx;
				}

				.detail {
					margin-top: 10rpx;
					color: #333333;
					font-size: 24rpx;
					text-overflow: ellipsis;
				}
				.attr {
					display: flex;
					justify-content: space-between;
					font-size: 24rpx;
					padding: 15rpx 0 0;
					color: #999999;

					.state {
						color: #333333;

						&:before {
							content: '';
						}
					}
				}
			}
		}
	}

	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80rpx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28rpx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
