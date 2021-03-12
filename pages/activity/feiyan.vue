<template>
	<view>
		<div class="rent-content" v-if="img">
            <image class="rent-image" :src="img" mode="widthFix" :lazy-load="lazyLoad"></image>
        </div>
	</view>
</template>

<script>
	export default {
		components:{
			
		},
		data() {
			return {
                img:this.$qiniuHost+this.config.feiyan,
                lazyLoad:true
			}
		},
		mounted() {
			
		},
		onLoad: function(e) {
			
			
		},
		onShow(){
			// #ifdef H5
			this.$wechatShare.share({  
				title:'影像租赁商',
			    desc: '新型肺炎期间，如何提高工作效率',  
			    img: this.$qiniuHost+'109-1578980959135.png' 
			});
			// #endif
        },
        onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: '派图租赁',
				path: '/pages/activity/feifan'
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
    }
}
</style>
