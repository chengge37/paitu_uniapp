<template>
	<view>
		<div class="back">
			<p class="status">
				<span class="iconfont icondaifukuan2" v-if="status.pay_status==1||status.pay_status=='1'"></span>
				<span class="iconfont iconyifukuan2" v-if="status.pay_status==2||status.pay_status=='2'"></span>
				<span class="iconfont icondingdanjinhangzhong" v-if="status.pay_status==3||status.pay_status=='3'||status.pay_status==6||status.pay_status=='6'"></span>
				<span class="iconfont icontuikuanzhong" v-if="status.pay_status==4||status.pay_status==5||status.pay_status=='4'||status.pay_status=='5'"></span>
				<span class="iconfont icondaipingjia2" v-if="status.pay_status==7||status.pay_status=='7'"></span>
				<span class="iconfont iconchenggong" v-if="status.pay_status==8||status.pay_status=='8'"></span>
				<span class="iconfont icondingdanquxiao" v-if="status.pay_status==0||status.pay_status=='0'"></span>
				{{status.name}}
			</p>
			<p class="tips">{{status.tips}}</p>
		</div>
	</view>
</template>

<script>
	export default {
		props:{
			status:Object
		},
		components:{
			
		},
		data() {
			return {
				
			}
		},
		mounted() {
			
		},
		onload: function() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scope>
.back{
	background-color: #651FFF;
	padding: 50rpx 100rpx;
	color: #FFFFFF;
	position: relative;
	.status{
		font-size: 36rpx;
		padding-bottom: 20rpx;
		.iconfont{
			margin-right: 21rpx;
			font-size: 45rpx;
		}
	}
	.tips{
		font-size: 28rpx;
	}
}
// .back::after,.back::before{
// 	content: '';
// 	width:140rpx;
// 	// width:240rpx;
// 	height: 140rpx;
// 	// -moz-border-radius: 110px / 70px; 
//     // -webkit-border-radius: 110px / 70px; 
//     border-radius: 110px;
// 	// background-color: #DD001D;
// 	opacity: 0.1;
// 	position: absolute;
	
// }
.back::after{
	content: '';
	width:122rpx;
	height: 122rpx;
	opacity: 0.6;
	position: absolute;
	right: -50rpx;
	bottom: 0;
	border-radius: 110px;
	background:linear-gradient(to right bottom, #8049FA, #651FFF);
	// transform:rotate(-5deg);
}
.back::before{
	content: '';
	width:78rpx;
	height: 78rpx;
	opacity: 0.6;
	position: absolute;
	right: 152rpx;
	top: 40rpx;
	border-radius: 110px;
	background:linear-gradient(to right bottom, #8049FA, #651FFF);
	// transform:rotate(5deg);
}
</style>
