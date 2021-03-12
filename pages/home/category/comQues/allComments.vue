<template>
	<view class="body">
		<!-- <div class="conditions">
			<span v-for="item in comment_cdts" :key="item.type" class="cdt_item" :class="item.active?'active':''">{{item.name}}</span>
		</div> -->

		<div class="comment-content">
			<div v-for="item in commentList" :key="item.id" class="comment-item">
				<div class="line1">
					<div class="left">
						<img :src="util.avatarUtil(item.user_avatar)" class="header-img">
						<span class="name">{{item.user_nick}}</span>
						<uni-rate :disabled="rateDisable" :value="item.score" size="16" class="comment-rate"></uni-rate>
					</div>
				</div>
				<div class="line2">
					<span>{{item.content}}</span>
				</div>
				<div class="line3" v-if="item.reply">
					<p class="comment-add">用户追评</p>
					<p class="comment-add-content">{{item.reply}}</p>
				</div>

				<div class="line4">
					<div class="left">{{item.time_str}}</div>
					<!-- <div class="right" @click="gotoDetail">回复</div> -->
				</div>
			</div>
			
		</div>
	</view>
</template>

<script>
import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue';
import { comment } from '@/common/api/api';
import { Format } from '@/common/utils/formatDate.js';

	export default {
		data() {
			return {
				rateDisable:true,
				host:this.$qiniuHost,
				comment_cdts:[
					{name:'全部',active:true,type:0},
					{name:'最新',active:false,type:1},
					{name:'有图',active:false,type:2},
					{name:'追加',active:false,type:3},
					{name:'好用',active:false,type:4},
					{name:'配置很好',active:false,type:5},
				],
				comment_params:{
					page:1,
					page_size:10,
					type:2,
				},
				commentList:[]
			};
		},
		components:{
			uniRate
		},
		onLoad(e){
			if(e.type==1){
				this.comment_params = Object.assign(this.comment_params,{studio_id:e.relation_id});
				
			}else if(e.type==2){
				this.comment_params = Object.assign(this.comment_params,{equip_id:e.relation_id});
			}
			this.getComment();
		},
        methods: {
            gotoDetail(){
				uni.navigateTo({
					url:'/pages/home/category/comQues/commentDetail'
				})
			},
			getComment(){
				this.$http.get(comment.getList,this.comment_params).then(res => {
					if(this.commentList.length>0){
						this.commentList = this.commentList.concat(res.rows)
					}else{
						this.commentList = res.rows;
					}
					
					this.commentList.forEach(item => {
						item.time_str = Format.formatDateNoHouer(item.create_time*1000);
					})
				}).catch(err=>{
					
				});
			},
		},
		onReachBottom:function(){
			this.comment_params.page++;
			this.getComment();
		 },
	}
</script>

<style lang="scss">
.conditions{
	padding-top: 30rpx;
	background-color: #ffffff;
	margin-bottom: 30rpx;
	.cdt_item{
		padding: 10rpx 20rpx;
		background-color: #FFE6D0;
		margin-left: 30rpx;
		margin-bottom: 30rpx;
		font-size: 28rpx;
		display: inline-block;
		color: #333333;
	}
	.active{
		background-color: #FF5600;
		color: #f8f8f8
	}
}
.comment-content{
	.comment-item{
		margin-bottom: 20rpx;
		background-color: #ffffff;
		padding: 0 30rpx;
	}
	.line1{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0 10rpx;
		.left{
			display: flex;
			align-items: center;
			.name{
				font-size: 28rpx;
				color: #333333;
				margin: 0px 20rpx;
				font-weight: bold;
			}
			.comment-rate{
				margin-bottom: 5rpx;
			}
		}
		.right{
			font-size: 24rpx;
			color: #999999;
		}
	}
	.header-img{
		width: 70rpx;
		height: 70rpx;
		border-radius: 40rpx;
	}
	.line2{
		padding: 0 20rpx 20rpx 0;
		span{
			font-size: 28rpx;
			color: #333333;
			line-height: 40rpx;
			display: inline-block;
			
		}
		.nodata{
			color: #999999;
		}

	}
	.line3{
		border-top: 1rpx solid #f8f8f8;
		.comment-add{
			font-size: 28rpx;
			color:#FF5600;
			margin: 20rpx 0;
		}
		.comment-add-content{
			font-size: 28rpx;
			color: #333333;
			line-height: 40rpx;
		}
	}
	.line4{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left{
			margin: 30rpx 0;
			color: #999999;
			font-size: 24rpx;
		}
		.right{
			margin: 20rpx;
			padding: 10rpx 30rpx;
			border: 1px solid #999999;
			color: #666666;
			font-size: 28rpx;
		}
	}
}
</style>
