<template>
	<view>
		<div class="rent-content" v-if="img">
            <image class="rent-image" :src="img" mode="widthFix" :lazy-load="lazyLoad"></image>
        </div>
        <div class="bottom">
            <span class="go-btn" @click="gotoHome">立即租借</span>
        </div>
	</view>
</template>

<script>
	export default {
		components:{
			
		},
		data() {
			return {
                img:this.$qiniuHost+this.config.PickFlow,
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
				title:'取货流程',
			    desc: '派图么取货流程',  
			    img: this.$qiniuHost+'109-1578980959135.png' 
			});
			// #endif
        },
        onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: '派图么进货流程',
				path: '/pages/home/flow/pickFlow'
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
