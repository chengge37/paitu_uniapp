<template>
	<view>
        <div class="search-box">
			<div class="search-content">
				<span class="iconfont iconsousuo"></span>
				<input 
				type="text" 
				v-model="searchText"
				:placeholder="'搜索'+navList[tabCurrentIndex].text" 
				class="search-input"
				placeholder-style="color:#999999;"
				@confirm="toSearch"
				/>
				<span class="iconfont iconcuo" v-if="searchText" @click="clearSearch"></span>
			</div>
            <div class="search-btn" @click="toSearch">搜索</div>
		</div>
        <div class="navbar">
			<div v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</div>
		</div>
    </view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			
			return {
				navList: [
					{text: '影棚',index:0},
					{text: '器材',index:1},
					{text: '活动',index:2},
					{text: '店铺',index:3},
                ],
				tabCurrentIndex:0,
				searchText:''
			}
		},
		onLoad() {

		},
		methods: {
			tabClick(idx){
                this.tabCurrentIndex = idx;
			},
			clearSearch(){
				this.searchText = '';
			},
			toSearch(){
				if(this.tabCurrentIndex==0){
					uni.navigateTo({url:'/pages/home/category/studio?search='+this.searchText})
				}else if(this.tabCurrentIndex==1){
					uni.navigateTo({url:'/pages/home/category/equipment?search='+this.searchText})
				}else if(this.tabCurrentIndex==2){
					uni.navigateTo({url:'/pages/home/category/activity?search='+this.searchText})
				}else if(this.tabCurrentIndex==3){
					uni.navigateTo({url:'/pages/merchant/shop/shopList?type=all&search='+this.searchText})
				}
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ffffff;
}
.search-box{
    padding:20rpx 35rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.search-content{
		background-color: #F8F8F8;
		padding: 10rpx 30rpx 10rpx 40rpx;
		border-radius: 16rpx;
		margin-right: 30rpx;
		display: flex;
		align-items: center;
		flex: 1;
		.search-input{
			font-size: 30rpx;
			flex: 1;
			background-color: inherit;
		}
		.iconfont{
			color: #999999;
		}
		.iconsousuo{
			font-size: 40rpx;
			margin-right: 20rpx;
		}
		.iconcuo{
			font-size: 36rpx;
		}
	}
	.search-btn{
		font-size: 32rpx;
		color: #333333;
		
	}
}
.navbar{
	display: flex;
	justify-content: space-around;
	padding: 30rpx;
	border-bottom: 1rpx solid #f8f8f8;
	font-size: 30rpx;
	color: #666666;
	.nav-item{
		&.current{
			color: #333333;
			font-weight: bold;
			font-size: 36rpx;
			position: relative;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: -30rpx;
				transform: translateX(-50%);
				width: 56rpx;
				height: 0;
				border-bottom: 4rpx solid #651FFF;
			}	
		}
	
	}
	
}
</style>
