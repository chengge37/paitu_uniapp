<template>
	<view class="album-content">
		<div class="album-list">
            <image class="album-item" :src="host+item" v-for="(item,index) in album" :key="index" mode="aspectFill"></image>
        </div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                host:this.$qiniuHost,
                albumItem:{},
                album:[]
			}
		},
		mounted() {
			
		},
		onLoad: function(e) {
            this.albumItem = uni.getStorageSync('album')
            console.log(' this.albumItem---', this.albumItem)
            this.album = this.albumItem.content.split(',').filter(v=>{return v})
            uni.setNavigationBarTitle({title: this.albumItem.name});
            this.util.delStorage('album');
		},
		methods: {
            
		}
	}
</script>

<style lang="scss" scope>
.album-list{
    display: flex;
    flex-wrap: wrap;
    width: 748rpx;
    margin: 0 auto;
    .album-item{
        width: 244rpx;
        height: 244rpx;
        margin: 2rpx;
    }
}
</style>
