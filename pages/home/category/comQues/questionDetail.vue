<template>
	<view class="body">
		<div class="product">
			<div class="left">
				<image class="product-img" :src="host+pic"></image>
				<span class="product-name">{{product_name}}</span>
			</div>
			<div class="right">
				<span class="iconfont iconyoujiantou"></span>
			</div>
		</div>

		<div class="question-content">
			<div class="question-item">
				<div class="line question">
					<span class="qus">Q</span>
					<span class="text">{{questionDetail.content}}</span>
				</div>
				<div class="dateOrCount">
					<span class="date">{{questionDetail.create_time_str}}</span>
				</div>
			</div>
		</div>

		<div class="ans-count">
			共{{questionDetail.children.length}}个问答
		</div>
		<div class="answer-content" v-if="questionDetail.children.length>0">
			<div class="answer-item" v-for="item in questionDetail.children" :key="item.key">
				<div class="line1">
					<div class="left">
						<image class="img" :src="host+item.user.avatar"></image>
						<span class="nick">{{item.user.nick}}</span>
						<span class="sign">已买</span>
					</div>
					<div class="date">{{item.create_time_str}}</div>
				</div>
				<div class="line2">
					<span class="ans">A</span>
					<span class="text">{{item.content}}</span>
				</div>
			</div>
		</div>

		<div class="reply">
            <input type="text" placeholder="只有近期购买过的用户才能回答" class="reply-input" v-model="ask_params.content">
            <div class="reply-btn" @click="answer" >回答</div>
        </div>
	</view>
</template>

<script>
import { question } from '@/common/api/api';
import { Format } from '@/common/utils/formatDate.js';
	export default {
		data() {
			return {
				host:this.$qiniuHost,
				myQuestion:'',
				ask_params:{
					to_uid:'',
					content:'',
					type:1,//1（影棚）或2（设备） 3活动
					relation_id:''//影棚or设备ID
				},
				questionDetail:{},
				product_name:'',
				pic:''
			};
		},
		onLoad(e){
			this.product_name = e.product_name
			this.pic = e.pic;
			this.ask_params.type = e.type
			uni.getStorage({
				key: 'questionDetail',
				success: (e) => {
					this.questionDetail = e.data;
					console.log('this.questionDetail---',this.questionDetail)
					this.questionDetail.create_time_str = Format.formatDateNoHouer(this.questionDetail.create_time*1000);
					if(this.questionDetail.children.length>0){
						this.questionDetail.children.forEach(item => {
							item.create_time_str = Format.formatDateNoHouer(item.create_time*1000);
						});
					}
					
					uni.removeStorage({key:'questionDetail'});
				}
			});
		},
        methods: {
            answer(){
				let that = this;
				this.ask_params.to_uid = this.questionDetail.uid;
				this.ask_params.relation_id = this.questionDetail.relation_id;
				this.$http.post(question.addQuestion,this.ask_params).then(res => {
					uni.showModal({
						title: '提示',
						content: '您的回复已成功发送，审核通过之后方可显示',
						showCancel:false,
						success: function (res1) {
							that.ask_params.content = ''
						}
					});
				})
			}
        },
	}
</script>

<style lang="scss" scope>
page{
	background-color: #ffffff;
}
.product{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #ffffff;
	border-top: 1rpx solid #f8f8f8;
	.left{
		display: flex;
		align-items: center
	}
	.product-img{
		width: 80rpx;
		height: 80rpx;
		border: 1rpx solid #f8f8f8;
	}
	.product-name{
		font-size: 28rpx;
		flex: 1;
		margin: 0 30rpx;
	}
}
.question-content{
	border-top: 1rpx solid #f8f8f8;
	.question-item{
		padding: 30rpx;
		background-color: #ffffff;
		margin-bottom: 20rpx;
		.line{
			margin-bottom: 30rpx;
			.qus{
				display: inline-block;
				width:40rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				color: #ffffff;
				font-size: 28rpx;
				margin-right: 20rpx;
			}
			.qus{
				background-color: #EA001F;
			}
			.text{
				font-size: 28rpx;
			}
		}
		.dateOrCount{
			font-size: 24rpx;
			color: #999999;
			display: flex;
			justify-content: space-between;
			span{
				display: inline-block;

			}
		}
		
	}
}
.ans-count{
	padding: 30rpx 40rpx;
	background-color: #f8f8f8;
	font-size: 24rpx;
	color: #666666;
}
.answer-content{
	padding: 30rpx;
	.answer-item{
		border-bottom: 1rpx solid #f8f8f8;
		.line1{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left{
				display: flex;
				align-items: center;
				span{
					display: inline-block;
					
				}
				.img{
					width: 60rpx;
					height: 60rpx;
					margin-right: 20rpx;
				}
				.nick{
					font-size: 30rpx;
					font-weight: bold;
					color: #333333;
					margin-right: 20rpx;
				}
				.sign{
					background-color: #007AD9;
					color: #ffffff;
					padding: 4rpx 8rpx;
					font-size: 24rpx;
				}
			}
			.date{
				font-size: 24rpx;
				color: #999999;
			}
		}
		.line2{
			margin: 30rpx 0;
			.ans{
				display: inline-block;
				width:40rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				color: #ffffff;
				font-size: 28rpx;
				margin-right: 20rpx;
			}
			.ans{
				background-color: #651FFF;
			}
			.text{
				font-size: 28rpx;
			}
		}
	}
}
.reply{
    background-color: #ffffff;
    position: fixed;
    bottom: 0rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
	border-top: 1rpx solid #f8f8f8;
    .reply-input{
        flex:4;
        margin: 20rpx 40rpx;
        padding: 15rpx 30rpx;
        background-color: #f8f8f8;
        font-size: 28rpx;
        ::placeholder{
            color: #999999;
            
        }
    }
    .reply-btn{
        margin:20rpx 40rpx 20rpx 0;
        flex:1;
        padding: 15rpx 30rpx;
        text-align:center;
        font-size: 28rpx;
        height: 52rpx;
        line-height: 52rpx;
        color: #ffffff;
        background-color: #651FFF;
    }
}
</style>
