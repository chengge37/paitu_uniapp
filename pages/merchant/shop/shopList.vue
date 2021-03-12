<template>
	<view class="shops">
		<div class="top-box" v-if="type!='all'">
			<div class="top"></div>
			<div class="top1"></div>
			<div class="top2">
				<div class="top-title">
					<p class="iconfont iconshangcheng"></p>
					<p class="title">优选好店</p>
				</div>
			</div>
		</div>
		
		<view class="shopsList" v-if="type=='all'">
            <view class="shop-item" v-for="(item,index) in shopList" :key="index">
                <div class="shop-header">
					<image mode="aspectFill" class="shop-logo"  :src="item.avaLogo"></image>
					
					<div class="head-center">
						<p class="shop-name" >{{item.nick}}</p>
						<p class="shop-address" >
							<span v-if="item.address">{{item.address}}</span>
							<span v-else>暂无地址</span>
						</p>
						
					</div>
					<div class="goin" @click="goinShop(item.id)">
						进店
						<span class="iconfont iconyoujiantou"></span>
					</div>
				</div>
				<scroll-view class="banner" scroll-x="true" v-if="item.pics.length>0">
					<view class="flex-view">
						<view class="view-item"  v-for="(b_item,idx) in item.pics" :key="idx" >
							<image :src="host + b_item" mode="aspectFill" class="item-img"/>
						</view>
					</view>
					
				</scroll-view>
            </view>
        </view>
		<view class="shopsList" v-else>
            <view class="shop-item" v-for="(item,index) in shopList" :key="index">
                <div class="shop-header">
					<image mode="aspectFill" class="shop-logo" :src="item.adv.logo?util.shopAvatarUtil(item.adv.logo):util.shopAvatarUtil(item.adv.avatar)"></image>
					
					<div class="head-center">
						<p class="shop-name" >{{item.user.nick}}</p>
						<p class="shop-address" >
							<span v-if="item.address">{{item.adv.address}}</span>
							<span v-else>暂无地址</span>
						</p>
					</div>
					<div class="goin" @click="goinShop(item.uid)">
						进店
						<span class="iconfont iconyoujiantou"></span>
					</div>
				</div>
				<scroll-view class="banner" scroll-x="true" v-if="item.pic.length>0">
					<view class="flex-view">
						<view class="view-item"  v-for="(b_item,idx) in item.pic" :key="idx" >
							<image :src="host + b_item" mode="aspectFill" class="item-img"/>
						</view>
					</view>
					
				</scroll-view>
            </view>
        </view>
	</view>
</template>

<script>
import { advertise,user } from "@/common/api/api";
	export default {
		components: {
			
		},
		computed:{
			
		},
		data() {
			return {
				type:'',
				shopList:[],
				params:{
					page:1,
					page_size:10
				},
				host: this.$qiniuHost,
			}
		},
		
		onLoad(e) {
			if(e.search){
				console.log(e.search)
				this.params = Object.assign(this.params,{nick:e.search});
			}
			this.type = e.type;
			if(e.type=='all'){
				uni.setNavigationBarTitle({title: '店铺'});
				this.getShopUsers()
			}else{
				this.getShopList()
			}
			
		},
		methods: {
			getShopList(){
				let params = {
					page_size:10000,
					position:0,
					type:4
				};
				this.$http.get(advertise.getList,params).then(res => {
					this.shopList = res.rows;
					this.shopList.forEach(item => {
						item.pic= item.pic.split(',').filter(v=>{return v})
					})
				}).catch(err => {
					console.log(err)
				})
			},
			getShopUsers(){
				this.$http.get(user.getStores,this.params).then(res => {
					if(res.rows.length>0){
						if(this.params.page==1){
							this.shopList = res.rows;
						}else{
							this.shopList = this.shopList.concat(res.rows);
						}
					}else{
						if(this.shopList.length>0){
							uni.showToast({title:'暂无更多数据~',icon:'none'})
						}else{
							uni.showToast({title:'暂无数据~',icon:'none'})
						}
						
					}
					
					this.shopList.forEach(item => {
						if(item.logo){
							if(item.logo.indexOf("http") != -1||item.logo.indexOf("https") != -1){
								item.avaLogo = item.logo;
							}else{
								item.avaLogo = this.host +item.logo
							}
						}else if(item.avatar){
							if(item.avatar.indexOf("http") != -1||item.avatar.indexOf("https") != -1){
								item.avaLogo = item.avatar;
							}else{
								item.avaLogo = this.host +item.avatar
							}
						}else{
							item.avaLogo = this.host + this.config.defaultStorePic;
						}
						item.pics = [];
						let banner_pics = item.banner_pic.split(',').filter(v=>{return v}) 
						if(item.bannerArray.length>0){
							item.bannerArray.forEach(v => {
								item.pics.push(v.key);
							})	
						}else{
							item.pics = banner_pics;
						}
						// item.pic= item.pic.split(',').filter(v=>{return v})[0]
					})
				}).catch(err => {
					console.log(err)
				})
			},
			goinShop(data){
				uni.navigateTo({url:'/pages/merchant/shop/shop?id='+data})
			}
		},
		onReachBottom: function() {
			if(this.type=='all'){
				this.params.page++;
				this.getShopUsers()
			}
		},
    }
</script>

<style lang="scss">
.top{
	background-color: rgba($color: #651FFF, $alpha: 0.6);
	height: 1500rpx;
	width:1660rpx;
	border-bottom-left-radius: 750rpx;
	border-bottom-right-radius: 750rpx;
	margin-top: -1260rpx;
	margin-left: -455rpx;
}
.top1{
	background-color: rgba($color: #651FFF, $alpha: 0.6);
	height: 1500rpx;
	width:1580rpx;
	border-bottom-left-radius: 750rpx;
	border-bottom-right-radius: 750rpx;
	margin-top: -1500rpx;
	margin-left: -415rpx;
}
.top2{
	background-color: #651FFF;
	height: 1500rpx;
	width:1500rpx;
	border-bottom-left-radius: 740rpx;
	border-bottom-right-radius: 740rpx;
	margin-top: -1500rpx;
	margin-left: -375rpx;
	position: relative;
	.top-title{
		color: #ffffff;
		width: 100%;
		text-align: center;
		position: absolute;
		bottom: 20rpx;
		.iconfont{
			font-size: 50rpx;
			margin-bottom: 20rpx;
		}
		.title{
			font-size:40rpx;
			font-weight: bold; 
		}
	}
}
.shopsList{
	padding: 35rpx;
	.shop-item{
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		.shop-header{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.shop-logo{
				width: 80rpx;
				height: 80rpx;
				border:1rpx solid #f8f8f8;
			}
			.head-center{
				margin-left: 20rpx;
				flex:1;
				.shop-name{
					color: #333333;
					font-weight: bold;
					font-size: 30rpx;
				}
				.shop-address{
					color: #666666;
					font-size: 22rpx;
					width: 400rpx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
			}
			.goin{
				width: 108rpx;
				height: 48rpx;
				line-height: 48rpx;
				text-align: center;
				border-radius: 24rpx;
				color: #ffffff;
				font-size: 24rpx;
				background-color: #651FFF;
			}
		}
		.banner{
			margin-top: 20rpx;
			.flex-view{
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.view-item{
					.item-img{
						margin-right: 20rpx;
						width: 330rpx;
						height: 200rpx;
						border-radius: 10rpx;
					}
				}
			}
			
		}
	}
}
</style>
