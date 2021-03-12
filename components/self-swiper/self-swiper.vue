<template>
	<div class="swiper-box">
		<swiper class="imageContainer" @change.stop="handleChange" @touchend.stop circular autoplay>
			<swiper-item class="swiperitem" v-for="(item,index) in banner" :key="index">
				<image 
					@error="errorPic('imgList',index)"
					class="itemImg" :class="currentSwiper == index ? 'swiperactive': ''" 
					:src="host+item.key"
					lazy-load 
					:mode="type=='shop'||(type!='shop'&&item.id=='5')?'aspectFill':'aspectFit'"
					@click="toSwiper(item)">
				</image>
			</swiper-item>
		</swiper>
		<view class="dots" :class="type=='shop'?'toLeft':'toCenter'">
			<block v-for="(item,index) in banner" :key="index">
			<view :class="index == currentSwiper ? 'dot active' : 'dot'"></view>
			</block>
		</view>

		<uni-popup ref="popupRef" type="center">
			<div class="popupRef">
				<div class="tips">
					<div class="title">请选择你需要进入的地区店铺</div>
					<div class="info">
						<div class="area">
							<p class="ti">华南/华东地区：</p>
							<p class="te">上海、江苏、浙江、安徽、江西、福建、湖北、湖南、广东、广西地区可参加</p>
						</div>
						<div class="area">
							<p class="ti">华北地区：</p>
							<p class="te">北京、天津、成都、重庆、银川、哈尔滨、大连、沈阳、西安地区可参加</p>
						</div>
					</div>
					
				</div>
				<div class="tips-btn">
					<p class="btn btn1" @click="gotoShop('351')">华南/华东</p>
					<p class="btn" @click="gotoShop('350')">华北</p>
				</div>
			</div>
			
		</uni-popup>
	</div>
</template>
<script>
import { picture } from '@/common/api/api';
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
	export default {
		props:{
			city:Object,
			type: {
				type: String,
				default: 'default'
			},
			banner:{
				type: Array,
			}
		},
		components:{
			uniPopup
		},
		data() {
			return {
				host: this.$qiniuHost,
				indicatorDots: false,
				currentSwiper: 0,
			}
		},
		mounted() {
		},
		methods: {
			//轮播图左右移动
			handleChange(e) {
				this.currentSwiper = e.detail.current
			},
			//点击轮播图
			toSwiper(e) {
				// console.log(e)
				if(this.type!='shop'){
					// currentSwiper变化才让点击有效，否则ios会点击反应过快
					if(e.id=='0'){
						// #ifdef H5
						window.location.href="https://mp.weixin.qq.com/s/wFpiNy3GolpyJ-U4NjEs8w"
						// #endif
						// #ifndef H5
						uni.navigateTo({url: '/pages/activity/banner5'})
						// #endif
					}else if(e.id=='1'){
						// #ifdef H5
						window.location.href="https://mp.weixin.qq.com/s/MKs2_JPL4fAR0LL6JqdU-Q"
						// #endif
						// #ifndef H5
						uni.navigateTo({url: '/pages/activity/feiyan'})
						// #endif
					}else if(e.id=='2'){
						// uni.navigateTo({url: '/pages/merchant/shop/shop?id=187'})
						// #ifdef H5
						window.location.href="https://mp.weixin.qq.com/s/b0LqHI8s5bD8ngzUztjtkA"
						// #endif
						// #ifndef H5
						uni.navigateTo({url: '/pages/activity/banner3'})
						// #endif
					}else if (e.id=='3'){
						uni.navigateTo({url: '/pages/home/category/studio'})
					}else if (e.id=='4'){
						uni.navigateTo({url: '/pages/home/category/equipment'})
					}else if (e.id=='5'){
						uni.navigateTo({url: '/pages/merchant/shop/shop?id=188'})
					}else if (e.id=='6'){
						// uni.showModal({
						// 	title: '提示',
						// 	content: '请选择你需要进入的地区店铺',
						// 	confirmText:'华北',
						// 	cancelText:'华南/华东',
						// 	cancelColor:'#651FFF',
						// 	confirmColor:'#651FFF',
						// 	success: function (res) {
						// 		if (res.confirm) {
						// 			uni.navigateTo({url: '/pages/merchant/shop/shop?id=350'})
						// 		} else if (res.cancel) {
						// 			uni.navigateTo({url: '/pages/merchant/shop/shop?id=351'})
						// 		}
						// 	}
						// })
						this.$refs.popupRef.open()
					}
				}
			},
			gotoShop(id){
				uni.navigateTo({url: '/pages/merchant/shop/shop?id='+id})
				this.$refs.popupRef.close()
			},
			selectCity(){
				uni.navigateTo({
					url: '/pages/home/select-city/select-city?city=' + JSON.stringify(this.city)
				})
			},
			//图片加载失败方法
			errorPic(key,index){
				console.log('errorPic-------------------------',key,index);
				// this.src=this.$qiniuHost+this.;
				this[key][index].url = this.$qiniuHost;
				this[key][index].key = this.config.errorPic;
				// console.log('this.imgList----------',this.imgList);
			},
			gotoMessage(){
				uni.navigateTo({
					url: '/pages/my/message/message'
				})
			},
			gotoSee(){
				uni.navigateTo({
					url: '/pages/merchant/shop/shop?id=182'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
.my-plan-style{
	position:relative;
}
.swiper-box{
	position: relative;
	width: 100%;
	.imageContainer{
		width:100%;
		height: 312rpx;
		.itemImg{
			width:100%;
			height: 312rpx;
		}
	}
	
	.dots{
		position: absolute;
		display: flex;
		justify-content: center;
		bottom: 40rpx;
		.dot{
			margin: 0 8rpx;
			width: 12rpx;
			height: 12rpx;
			background: rgba(217,217,217,0.4);
			border-radius: 8rpx;
			transition: all .6s;
		}
		.dot.active{
			width: 32rpx;
  			background: #FFFFFF;
		}
	}
	.toLeft{
		left: 20rpx;
	}
	.toCenter{
		left: 0;
		right: 0;
		bottom: 20rpx;
	}
}
// 3D轮播样式
// .imageContainer {
// 	width: 100%;
// 	position:relative;
// 	height: 312rpx;
// 	background-color: #fff;
// }


// .swiperitem {
// 	.itemImg {
// 		/* #ifndef MP-ALIPAY */
// 		display: inline;
// 		/* #endif */
// 		z-index: 5;
// 		opacity: 0.7;
// 		top: 5%;
// 		box-shadow: 0px 4rpx 15rpx 0px rgba(153, 153, 153, 0.24);
// 	}

// 	.swiperactive {
// 		width: 95%;
// 		opacity: 1;
// 		z-index: 10;
// 		top: 0%;
// 		transition: all .2s ease-in 0s;
// 	}
// }
.gotoSeeBtn{
	position: absolute;
	bottom: 50rpx;
	right: 80rpx;
	width:180rpx;
	height: 70rpx;
	// opacity: 0;
	// transition: 1s;
}
.gotoSeeText{
	position: absolute;
	top: 20rpx;
	left: 240rpx;
	// right: 0rpx;
	width:300rpx;
	height: 140rpx;
}
.btncss{
	// opacity: 1;
}
.popupRef{
	position: relative;
}
.tips{
	padding: 30rpx;
	background-color: #FFFFFF;
	
	.title{
		width: 100%;
		text-align: center;
		color: #333333;
		font-weight: bold;
		font-size: 36rpx;
		margin-bottom: 30rpx;
	}
	.info{
		margin-bottom: 100rpx;
	}
	.area{
		font-size: 26rpx;
		.ti{
			color: #333333
		}
		.te{
			color: #999999
		}
	}
	
}
.tips-btn{
	position: absolute;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	height: 98rpx;
	line-height: 98rpx;
	background-color: #FFFFFF;
	width: 100%;
	.btn{
		font-size: 30rpx;
		width: 50%;
		text-align: center;
		color: #651FFF;
		border-top: 1rpx solid #d9d9d9;
	}
	.btn1{
		border-right: 1rpx solid #d9d9d9;
	}
}

</style>
