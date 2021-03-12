<template>
	<view class="address-content">
		<view class="list" v-if="addressList.length>0">
			<view class="row" v-for="(row,index) in addressList" :key="index" @click="select(row)">
				<!-- <view class="left">
					<view class="head">
						{{row.head}}
					</view>
				</view> -->
				<view class="center">
					<view class="name-tel">
						<view class="name">{{row.name}}</view>
						<view class="tel">{{row.mobile}}</view>
						<view class="default" v-if="row.is_default=='1'">
							默认
						</view>
					</view>
					<view class="address">
						{{row.address}}
					</view>
				</view>
				<view class="right">
					<view class="icon" @click.stop="edit(row)">
						<text class="edit">编辑</text>
					</view>
				</view>
			</view>
		</view>
		<empty-show v-else></empty-show>
		
		<view class="add">
			<view class="btn" @click="add">
				<text>新增地址</text>
			</view>
		</view>
	</view>
</template>
<script>
	import { address } from '@/common/api/api';
	
	export default {
		components: {
		},
		data() {
			return {
				isSelect: false,
				addressList: []
			};
		},
		onShow() {
			this.getAddressList();
		},
		onLoad(e) {
			if (e.from == 'detail') {
				this.isSelect = true;
			}
			
		},
		methods: {
			getAddressList(){
				this.$http.get(address.getList).then(res => {
					this.addressList = res;
				}).catch(err=>{})
			},
			edit(row) {
				uni.setStorage({
					key: 'address',
					data: row,
					success() {
						uni.navigateTo({
							url: "editAddress?type=edit"
						})
					}
				});

			},
			add() {
				uni.navigateTo({
					url: "editAddress?type=add"
				})
			},
			select(row) {
				//是否需要返回地址(从订单确认页跳过来选收货地址)
				if (!this.isSelect) {
					return;
				}
				uni.setStorage({
					key: 'selectAddress',
					data: row,
					success() {
						uni.navigateBack();
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.address-content{
		width:100%;
		justify-content: center;
	}
	view {
		display: flex;
	}

	.add {
		position: fixed;
		bottom: 100rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			width: 100%;
			margin:0 30rpx;
			height: 80rpx;
			background-color: #651FFF;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				justify-content: center;
				align-items: center;
			}

			.add-icon {
				margin-right: 10rpx;
			}

			font-size: 30rpx;
		}
	}

	.list {
		flex-wrap: wrap;

		.row {
			// width: 100%;
			padding: 30rpx;;
			margin-bottom: 15rpx;
			background-color: #ffffff;
			.left {
				width: 90rpx;
				flex-shrink: 0;
				align-items: center;

				.head {
					width: 70rpx;
					height: 70rpx;
					background: linear-gradient(to right, #ccc, #aaa);
					color: #fff;
					justify-content: center;
					align-items: center;
					border-radius: 60rpx;
					font-size: 35rpx;
				}
			}

			.center {
				width: 100%;
				flex-wrap: wrap;
				line-height: 50rpx;
				.name-tel {
					width: 100%;
					align-items: baseline;
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
					.name {
					}

					.tel {
						margin-left: 32rpx;
					}

					.default {
						font-size: 22rpx;
						background-color: #651FFF;
						color: #fff;
						padding: 0 18rpx;
						line-height: 40rpx;
						border-radius: 24rpx;
						margin-left: 20rpx;
					}
				}

				.address {
					width: 100%;
					font-size: 28rpx;
					color: #666666;
				}
			}

			.right {
				flex-shrink: 0;
				align-items: center;
				margin-left: 20rpx;

				.icon {
					// justify-content: center;
					// align-items: center;
					// width: 80rpx;
					// height: 30rpx;
					// border-left: solid 1rpx rgba(0, 0, 0, 0.4);
					// font-size: 40rpx;
					// color: #777;

					.edit {
						font-size: 28rpx;
						color: #EA001F
					}
				}

			}
		}
	}
</style>
