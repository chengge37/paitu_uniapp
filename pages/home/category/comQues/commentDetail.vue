<template>
	<view class="body">
		<div class="comment-content">
			<div>
				<div class="line1">
					<div class="left">
						<img :src="host + '61-1567389108356.jpg'" alt="" class="header-img">
						<span class="name">发个</span>
						<uni-rate :disabled="rateDisable" :value="4" size="16" class="comment-rate"></uni-rate>
					</div>
				</div>
				<div class="line2">
					<span>的符合东方太化股份</span>
				</div>
				<div class="line4">
					<div class="left">2019-11-2</div>
				</div>
			</div>
			
		</div>

		<div class="discuss-child">
            <div class="discuss-title">
                <span class="border"></span>
				<span>所有回复</span>
				
			</div>
            <div class="discuss-content" >
				<div>
                    <div class="line">
                        <div class="user">
                            <image class="user-img" :src="host + '61-1567389108356.jpg'" ></image>
                            <p class="user-name">fdgfvbdf</p>
                            
                        </div>
                        <p class="date_reply">
                            <span class="date">4574</span>
                        </p>
                    </div>
					
					<div class="neirong">
						<p class="text1">
                            回复
                            <span class="to_user">dssagd</span>
                            ：fdgdfg
                        </p>
						
					</div>
				</div>
			</div>
        </div>
		<div class="reply">
            <input type="text" placeholder="回复" class="reply-input">
            <div class="reply-btn" @click="sent">发送</div>
        </div>
	</view>
</template>

<script>
import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue';
	export default {
		data() {
			return {
				host:this.$qiniuHost,
				rateDisable:true
			};
		},
		components:{
			uniRate
		},
        methods: {
            
        },
	}
</script>

<style lang="scss">
.comment-content{
	padding: 30rpx;
	background-color: #ffffff;	
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
	.line4{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left{
			margin: 30rpx 0;
			color: #999999;
			font-size: 24rpx;
		}
	}
}
.discuss-content{
    background-color: #ffffff;
    padding-top: 30rpx;
    border-top: 1px solid #f8f8f8;
    .user{
        display: flex;
        align-items: center;
        padding-left: 30rpx;
        .user-img{
            width: 70rpx;
            height: 70rpx;
            border-radius: 40rpx;
            margin-right: 20rpx;
        }
        .user-name{
            font-size: 28rpx;
            
        }
    }
    .neirong{
        font-size: 28rpx;
        margin-top: 20rpx;
        padding: 0 50rpx 30rpx 30rpx;
        .date_reply{
            display: flex;
            justify-content: space-between;
            margin-top: 10rpx;
            color: #999999;
            span{
                display: inline-block;
                
            }
            .date{
                padding: 10rpx 0;
            }
            .btn{
                padding: 10rpx 50rpx;
                border: 1px solid #999999;
            }
        }
        .text1{
            margin-left: 90rpx;
            .to_user{
                color: #228CDE
            }
        }
    }
}
.discuss-child{
    margin-top: 20rpx;
    .discuss-title{
		background-color: #ffffff;
		padding: 30rpx;
		font-size: 32rpx;
        display: flex;
        align-items: center;
        span{
            display: inline-block;
        }
		.border{
            margin-right: 30rpx;
			width: 6rpx;
            height: 40rpx;
            background-color: #228CDE;
		}
	}
    .line{
        display: flex;
        justify-content: space-between;
        .date{
            font-size: 28rpx;
            color: #999999;
            margin-right: 30rpx;
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
