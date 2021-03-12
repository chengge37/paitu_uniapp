<template>
	<view class="body">
		<view class="logo">
			<image :src="logo"></image>
		</view>
		<view class="companyName">{{companyName}}</view>
		<view class="explanation">{{explanation}}</view>
		<view class="detail">
			<view>{{detail.text0}}</view>
			<view>{{detail.text1}}</view>
			<view>{{detail.text2}}</view>
		</view>
		<view class="mainServer">
			<view class="title">主要服务</view>
			<view class="box">
				<view v-for="(item, index) in server" :key="index" class="ml-box">
					<image :src="item.icon" :class="item.class"></image>
					<text>{{item.name}}</text>
				</view>
			</view>

			<view class="line"></view>
			<view class="phone">
				<text>服务电话:</text>
				<text class="num">{{phone}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logo: '../../static/img/my/logo.png',
				companyName: '珠海穿山甲科技有限公司',
				explanation: '为影像从业者提供一站式的解决方案',
				detail: {
					text0: '珠海穿山甲科技有限责任公司2018年成立于深圳，资本投入1000万，管理团队由影像行业知名人士和国内顶级大学教授组成，公司目前有员工30人左右，70%研发人员为本科以上学历，目前已累计获得发明专利及软件著作权认证数十件。',
					text1: '穿山甲科技从成立至今，就旨在与影像行业从业者共同成长，为影像行业提供全方位的解决方案，包括全平台的推广和高效、科学的管理工具。',
					text2: '公司经过一年多的发展，客户已经遍及北、上、广、深一线城市及厦门、三亚、武汉、长沙等等二线城市。我们的客户包括行业顶级的影像器材品牌和影棚及工作室等。'
				},
				server: [{
						icon: '../../static/img/my/xiangji.png',
						class: 'xiangji',
						name: '器材租贷'
					},
					{
						icon: '../../static/img/my/zhangpeng.png',
						class: 'zhangpeng',
						name: '场地租贷'
					},
					{
						icon: '../../static/img/my/hulianwang.png',
						class: 'hulianwang',
						name: '软件管理'
					},
					{
						icon: '../../static/img/my/yunying.png',
						class: 'yunying',
						name: '推广工具'
					},
					{
						icon: '../../static/img/my/chanpin.png',
						class: 'chanpin',
						name: '版权运营'
					},
					{
						icon: '../../static/img/my/jingjiren.png',
						class: 'jingjiren',
						name: '模特经纪'
					}
				],
				phone: '0756-3666414'
			};
		}
	}
</script>

<style lang="scss">
	.body {
		text-align: center;
		color: rgb(51, 51, 51);

		.logo {
			padding-top: 10rpx;

			image {
				width: 146rpx;
				height: 146rpx;
			}
		}

		.companyName {
			margin: 10rpx 0 20rpx;
			font-size: 32rpx;

		}

		.explanation {
			font-size: 30rpx;
			height: 60rpx;
			line-height: 60rpx;
			border: 1rpx solid rgb(204, 204, 204);
			border-radius: 10rpx;
			margin: 0 90rpx;
		}

		.detail {
			margin: 20rpx 40rpx;
			font-size: 28rpx;
			text-align: left;
			text-indent: 2em;
			line-height: 1.5;
		}

		.mainServer {
			border-radius: 20rpx;
			background-color: rgb(255, 255, 255);
			box-shadow: 0px 0px 15px 0px rgba(4, 0, 0, 0.1);
			margin: 20rpx 40rpx;

			.title {
				display: block;
				padding: 20rpx 0;
				color: rgb(51, 51, 51);
				font-weight: bold;
			}

			.box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				font-size: 28rpx;

				.ml-box {
					width: 33.33%;

					.xiangji {
						display: block;
						margin: 10rpx auto;
						width: 60rpx;
						height: 50rpx;
					}

					.zhangpeng {
						display: block;
						margin: 10rpx auto;
						width: 70rpx;
						height: 50rpx;
					}

					.hulianwang {
						display: block;
						margin: 10rpx auto;
						width: 50rpx;
						height: 50rpx;
					}

					.yunying {
						display: block;
						margin: 10rpx auto;
						width: 50rpx;
						height: 50rpx;
					}

					.chanpin {
						display: block;
						margin: 10rpx auto;
						width: 50rpx;
						height: 50rpx;
					}

					.jingjiren {
						display: block;
						margin: 10rpx auto;
						width: 56rpx;
						height: 50rpx;
					}
				}
			}

			.line {
				border-bottom: 1px dotted #cecece;
				padding: 20rpx 0;
			}

			.phone {
				padding: 20rpx 0;
				font-size: 30rpx;
				color: #ff8326;

				.num {
					font-size: 32rpx;
					padding-left: 10rpx;
					font-weight: bold;
				}
			}

		}
	}
</style>
