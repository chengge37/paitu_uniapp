<template> 
	<view>
		<view class="model-list" v-if="type=='1'">
			<div class="model-item" v-for="(item,index) in List" :key="index" @click="gotoDetail(item.id)">
				<image :src="host + util.picExplode(item.photo)" class="item-img" mode="aspectFill" @error="errorPic(index)"></image>
				<div class="item-info">
					<div class="item-title" v-text="item.title?item.title:'未定义标题'"></div>
					<div class="item-line1">
						<div class="price">{{item.ppd}}</div>
						<div class="sale">
							<span >销量：{{item.total}}</span>
						</div>
					</div>
					<div class="item-line2" >
						<uni-rate :value="item.score" size="15"></uni-rate>
						<span class="rate-text">{{item.score}}分</span>
					</div>
					<div class="item-line3" @click.stop="gotoShop(item)">
						<span class="iconfont iconruzhu"></span>
						<span class="shop-name" >{{item.to_user.nick}}</span>
					</div>
				</div>
			</div>
		</view>
		<view class="model-list" v-else-if="type=='2'">
			<div class="model-item" v-for="(item,index) in List" :key="index" @click="gotoDetail(item.id)">
				<image :src="host + util.picExplode(item.pic)" class="item-img" mode="aspectFill"></image>
				<div class="item-info">
					<div class="item-title" v-text="item.title?item.title:'未定义标题'"></div>
					<div class="item-line1">
						<div class="price">{{item.norms[0].price}}</div>
						<div class="sale">
							<span>合作次数：{{item.user.deal_count}}</span>
						</div>
					</div>
					<div class="item-line2" >
						<uni-rate :value="item.user.score" size="15" v-if="item.user.score"></uni-rate>
						<span class="rate-text">{{item.user.score}}分</span>
					</div>
					<div class="item-line3" @click.stop="gotoShop(item)">
						<span class="iconfont iconruzhu"></span>
						<span class="shop-name">{{item.user.nick}}</span>
					</div>
				</div>
			</div>
		</view>
		<view class="model-list" v-else-if="type=='3'">
			<div class="model-item" v-for="(item,index) in List" :key="index" @click="gotoDetail(item.id)">
				<image :src="host + util.picExplode(item.photo)" class="item-img" mode="aspectFill"></image>
				<div class="item-info">
					<div class="item-title" v-text="item.title?item.title:'未定义标题'"></div>
					<div class="item-line1">
						<div class="price">{{item.price}}</div>
						<div class="sale">
							<span>销量：{{item.total}}</span>
						</div>
					</div>
					<div class="item-line2" >
						<uni-rate :value="item.score" size="15" v-if="item.score"></uni-rate>
						<span class="rate-text">{{item.score}}分</span>
					</div>
					<div class="item-line3" @click.stop="gotoShop(item)">
						<span class="iconfont iconruzhu"></span>
						<span class="shop-name">{{item.user.nick}}</span>
					</div>
				</div>
			</div>
		</view>
	</view>
	
</template> 

<script>
import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue';
	export default {
        props:{
            List:{
				type:Array,
				default:function(){
					return []
				}
			},
			type:String
        },
		components:{
			uniRate
		},
		watch:{
			
		},
		data() {
			return {
				host:this.$qiniuHost,
			}
		},
		mounted(){
		},
		methods: {
			errorPic(index){
				console.log('errorPic-------------------------',index);
				let obj = this.List[index]
				obj.photo= this.config.errorPic;
				this.List.splice(index,1,obj);
			},
            gotoDetail(id){
				if(this.type=='1'){
					uni.navigateTo({url:'/pages/home/category/modelDetail/index?id='+id})
				}else if(this.type=='2'){
					uni.navigateTo({url:'/pages/home/category/serviceDetail/index?id='+id})
				}else if(this.type=='3'){
					uni.navigateTo({url:'/pages/home/category/groupBooking/detail?id='+id})
				}
                
			},
			gotoShop(val){
				console.log(val)
				if(this.type=='1'){
					if(val.auto_msg_user.role==16){
						uni.navigateTo({url:'/pages/merchant/company/index?id='+val.auto_msg_user.id})
					}else if(val.to_user.role==128){
						uni.navigateTo({url:'/pages/merchant/personal/index?type=1&id='+val.auto_msg_user.id})
					}
				}else{
					if(val.auto_msg_user.role==8){
						uni.navigateTo({url:'/pages/merchant/company/index?id='+val.auto_msg_user.id})
					}else if(val.auto_msg_user.role==64){
						uni.navigateTo({url:'/pages/merchant/personal/index?type=2&id='+val.auto_msg_user.id})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scope>
.model-list{
	padding: 30rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	.model-item{
        margin-bottom: 20rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		
		.item-img {
			width: 338rpx;
			height: 448rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}
		.item-info{
			padding: 20rpx;
			border-left: 1rpx solid rgba($color: #999999, $alpha: 0.6);
			border-right: 1rpx solid rgba($color: #999999, $alpha: 0.6);
			border-bottom: 1rpx solid rgba($color: #999999, $alpha: 0.6);
			border-bottom-left-radius: 10rpx;
			border-bottom-right-radius: 10rpx;
			margin-top: -10rpx;
			.item-title{
				margin-bottom: 10rpx;
				width: 296rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 30rpx;
			}
			.item-line1{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
				.price{
					color: #EA001F;
					font-size: 32rpx;
					font-weight: bold;
				}
				.price::after{
					content: '/天';
					font-size: 30rpx;
					color: #999999;
					font-weight: 400;
				}
				.sale{
					font-size: 22rpx;
					color: #999999;
				}
			}
			.item-line2{
				margin-bottom: 6rpx;
				display: flex;
				align-items: center;
				.rate-text{
					display: inline-block;
					font-size: 26rpx;
					color: #999999;
					margin-left: 10rpx;
				}
			}
			.item-line3{
				color: #999999;
				display: flex;
				align-items: center;
				.iconfont{
					font-size: 40rpx;
				}
				.shop-name{
					font-size: 26rpx;
					margin-left: 10rpx;
					text-decoration: underline;
				}
			}
		}
		
	}
}
</style>
