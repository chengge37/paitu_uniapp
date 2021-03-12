<template>
	<div class="contain">
        <img :src="img" mode="widthFix" class="aver-img" />

        <image :src="code" class="code" @click="perviewImage"></image>
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
                img:this.$qiniuHost+this.config.myOfficial,
                code:this.$qiniuHost+this.config.OfficialCode,
	        };
	    },
	    onLoad(options){
			
        },
        onReady(){
            
        },
        mounted() {
            
           
        },
        methods:{
            perviewImage(e){
                console.log(e)
                let src = this.code;
                let list = [];
                list.push(this.$qiniuHost+this.config.OfficialCode);
                uni.previewImage({
                    current: src, // 当前显示图片的http链接
                    urls: list // 需要预览的图片http链接列表
                })
            },
        }
	}
</script>
	
<style lang="scss" scope>
.contain{
    position: relative;
}
.aver-img{
    width: 100%;
    // height: 15000rpx
}
.code{
    width: 350rpx;
    height: 350rpx;
    position: absolute;
    left: 50%;
    top: 530rpx;
    transform: translate(-50%,-50%)
}
</style>
