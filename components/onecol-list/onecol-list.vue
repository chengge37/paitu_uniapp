<template>
	<view class="list-card">
		<view class="list-item" v-for="(item,key) in oneStudioList" :key="key">
			<view class="list-line">
				<view class="image"  @click="goDetail(item)">
					<image :src="host+item.pic" mode="aspectFill" v-if="item.pic"></image>
					<div v-else class="nopic">暂无图片</div>
				</view>
				<view class="list-info" @click="goDetail(item)">
					<view class="list-name">
						<text>{{item.name}}</text>
					</view>
					<view class="list-btm">
						<view class="list-detail">
							<text class="title1">时间：</text>
							<text class="content">
								{{item.start_time}}
							</text>
						</view>
						<view class="list-detail">
							<text class="title1">地址：</text>
							<text class="content">
								{{item.address}}
							</text>
						</view>
					</view>
					<!-- <div class="info-right" @click="baoming(item)">
						<span class="iconfont icontianjia"></span>
						<span class="add" >立即报名</span>
					</div> -->
				</view>
			</view>
			<view class="item-bottom">
				<div class="price">
					<p  v-if="item.fee>0">
						<span class="fuhao">￥</span>
						<span class="fee">{{item.fee}}</span>
						<span class="per">/人</span>
					</p>
					<p v-else class="fee">免费</p>
				</div>
				<div class="baoming" @click="baoming(item)">立即报名</div>
			</view>
		</view>
	</view>
</template>

<script>
	import uniRate from "@/components/uni-ui/uni-rate/uni-rate.vue"
	export default {
		components: {
			uniRate,
		},
		props: {
			oneStudioList: Array
		},
		data() {
			return {
				host:this.$qiniuHost
			}
		},
		methods: {
			goDetail(data) {
				uni.navigateTo({
					url: '/pages/home/category/activityDetail/activityDetail?activity_id=' + data.id +'&name=' +data.name
				});
			},
			baoming(data){
				uni.setStorage({key: 'activityApply',data: data});
				uni.navigateTo({
					url: '/pages/order/activity/comfirmOrder'
				});
			},
		}
	}
</script>

<style lang="scss" scope>

	.list-item {
		background-color: #ffffff;
		// border-radius: 10rpx;
		// margin: 30rpx;
		margin-bottom: 20rpx;
		padding: 30rpx;
		
		.list-line{
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
		}
		.nopic{
			background-color: #f8f8f8;
			text-align: center;
			line-height: 320rpx;
			font-size: 28rpx;
			color: #666666
		}
		.image {
			image {
				width: 290rpx;
				height: 218rpx;
				border-radius: 10rpx;
			}
		}
	}


	.list-name {
		line-height: 50rpx;
		font-size: 32rpx;
		font-weight: bold;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.list-info {
		height: 218rpx;
		background-color: #fff;
		flex: 1;
		margin-left: 20rpx;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
	}
	.list-detail {
		width: 100%;
		font-size: 22rpx;
		color: #666666;
		display: flex;
		justify-content: flex-start;
		margin-top: 10rpx;
		.content{
			width: 300rpx;
			display: inline-block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
	}
	.item-bottom{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 380rpx;
		margin-left: 310rpx;
		margin-top: 20rpx;
		.price{
			.fuhao{
				color:#DB1522;
				font-size: 22rpx;
			}
			.fee{
				color:#DB1522;
				font-weight: bold;
				font-size: 36rpx;
			}
			.per{
				color:#999999;
				font-size: 22rpx;
			}
		}
		.baoming{
			width: 140rpx;
			height: 54rpx;
			border-radius: 8rpx;
			background-color: #651FFF;
			color: #FFFFFF;
			font-size: 26rpx;
			line-height: 54rpx;
			text-align: center;

		}
	}

	
</style>
