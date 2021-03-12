<template>
	<div class="contain">
        <img :src="img" mode="widthFix" class="aver-img" />

        <!-- <div class="fixed-btn" @click="gotoHome">去首页</div> -->
	</div>
</template>

<script>
	export default {
        components:{
            
        },
        computed: {
			
		},
	    data() {
	        return {
                img:this.$qiniuHost+this.config.myAdvertise,
	        };
	    },
	    onLoad(options){
			
        },
        onReady(){
            
        },
        mounted() {
            
           
        },
        methods:{
             gotoHome(){
                uni.switchTab({url: "/pages/tabBar/home"});
            }
        }
	}
</script>
	
<style lang="scss" scope>
.aver-img{
    width: 100%;
    // height: 15000rpx
}
.fixed-btn{
    position: fixed;
    bottom: 10rpx;
    right: 0;
    background-color: rgba(101, 31, 255,0.7);
    color: #ffffff;
    font-size: 24rpx;
    border-radius: 40rpx;
    padding: 20rpx;
    
}
</style>
