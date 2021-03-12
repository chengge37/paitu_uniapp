<template>
	<view>
		<div class="rent-content" v-if="img">
			<!-- #ifndef MP-ALIPAY -->
            <image class="rent-image" :src="img" mode="widthFix" :lazy-load="lazyLoad"></image>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<image class="rent-image" :src="aliPayImg" mode="widthFix" :lazy-load="lazyLoad"></image>
			<!-- #endif -->
        </div>
        <div class="bottom">
            <button class="go-btn" @click="gotoHome">立即租借</button>
        </div>
	</view>
</template>

<script>
// #ifdef H5
import jswx from 'jweixin-module/out/index.js'

// #endif
	export default {
        
		components:{
			
		},
		data() {
			return {
                img:this.$qiniuHost+this.config.RentFlow,
				// #ifdef MP-ALIPAY
				aliPayImg:this.$qiniuHost+this.config.AlipayRentFlow,
				// #endif
                lazyLoad:true,
                config:null
			}
		},
		mounted() {
			
		},
		onLoad: function(e) {
			
			
		},
		onShow(){
			// #ifdef H5
			this.$wechatShare.share({  
				title:'租赁流程',
			    desc: '派图么租赁流程',  
			    img: this.$qiniuHost+'109-1578980959135.png' 
			});
			// #endif
        },
        created(){
        },
        onShareAppMessage(res) {
            if (res.from === 'menu') {// 来自页面内分享按钮
            
			}
			return {
				title: '派图么租赁流程',
				path: '/pages/home/flow/rentFlow'
			}
		},
		methods: {
            gotoHome(){
                uni.switchTab({url: "/pages/tabBar/home"});
            }
		}
	}
</script>

<style lang="scss" scope>
.rent-content{
    width: 100%;
    position: relative;
    image{
        width: 100%;
    }
}
.bottom{
    width: 100%;
    text-align: center;
    height: 98rpx;
    line-height: 98rpx;
    background-color: #ffffff;
    padding-bottom: 20rpx;
    .go-btn{
        background-color: #651FFF;
        color: #ffffff;
        padding: 18rpx 68rpx;
        border-radius: 40rpx;
		line-height:30px
    }
}
</style>
