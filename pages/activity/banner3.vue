<template>
	<view>
		<div class="banner-content" v-if="img">
            <image class="banner-image" :src="img" mode="widthFix" :lazy-load="lazyLoad"></image>
        </div>
	</view>
</template>

<script>
	export default {
		components:{
			
		},
		data() {
			return {
                img:this.$qiniuHost+this.config.PageBanner3,
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
				title:'抗击疫情，安心租赁',
			    desc: '抗击疫情，安心租赁',  
			    img: this.$qiniuHost+'109-1578980959135.png' 
			});
			// #endif
        },
        onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: '抗击疫情，安心租赁',
				path: '/pages/activity/banner3'
			}
		},
		methods: {
            
		}
	}
</script>

<style lang="scss" scope>
.banner-content{
    width: 100%;
    position: relative;
    image{
        width: 100%;
    }
}

</style>
