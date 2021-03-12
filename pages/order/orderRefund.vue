<template>
	<view>
		<view class="order-item">
            <!-- 影棚/器材订单 -->
            <view v-if="type==0||type=='0'">
                <view class="goods-box-single" v-for="(item,index) in order_detail.goodsList" :key="index" >
                    <image class="goods-img" :src="host+item.img" mode="aspectFill"></image>
                    <view class="center">
                        <text class="title clamp">{{item.name}}</text>
                        <view class="attr">
                            <text class="attr-box">{{order_detail.start_time}}-{{order_detail.end_time}}</text>
                        </view>
                        <view class="attr">
                            <text class="attr-box">共{{order_detail.days}}天</text>
                        </view>
                    </view>
                    <view class="right">
                        <text class="price">￥{{item.price}}</text>
                        <text class="num">x{{item.order_count}}</text>
                    </view>
                </view>
            </view>
            <!-- 活动订单 -->
            <view class="goods-box-single" v-else>
                <image class="goods-img" :src="host+order_detail.pic" mode="aspectFill"></image>
                <view class="center">
                    <text class="title clamp">{{order_detail.activity.name}}</text>
                    <view class="attr">
                        <text class="attr-box" v-if="order_detail.activity">活动时间：{{order_detail.activity.start_time}}-{{order_detail.activity.end_time}}</text>
                    </view>
                    <view class="attr">
                        <text class="attr-box" v-if="order_detail.activity">地    址：{{order_detail.activity.address}}</text>
                    </view>
                    
                </view>
            </view>
            <div class="refund-detail">
                <picker @change="bindPickerChange" :value="reasonIndex" :range="reasons" >
                    <div class="line reason-picker">
                        <div class="title">退款原因：</div>
                        <div class="re-pick">
                            <span v-if="refund_form.refund_reason">{{refund_form.refund_reason}}</span>
                            <span v-else>请选择</span>
                            <span class="iconfont iconyoujiantou"></span>
                        </div>
                    </div>
                    
                </picker>
                <div class="line">
                    <span class="title">退款金额：</span>
                    <span class="price">￥{{order_detail.price}}</span>
                </div>
                <div class="line line3">
                    <div class="title">退款说明：</div>
                    <div class="explain">
                        <input type="text" placeholder="选填" v-model="refund_form.refund_explain" />
                    </div>
                </div>
            </div>
            
            <div class="commit" @click="refundCommit">提交</div>
        </view>
	</view>
</template>

<script>
import { order } from '@/common/api/api';

	export default {
		components:{
			
		},
		data() {
			return {
                host: this.$qiniuHost,
                order_detail:{},
                type:'',//0为商品订单，1为活动订单
                reasonIndex:0,
                reasons:['核验单与实物不符','多拍/拍错/不想要了','缺货','协商退款','退款'],
                refund_form:{
                    order_type:'',
                    refund_price:'',
                    refund_reason:'',
                    refund_explain:''
                }
			}
		},
		mounted() {
			
		},
		onLoad: function(e) {
            this.order_detail = uni.getStorageSync('order_detail');
            this.refund_form.refund_price = this.order_detail.price;
            console.log('eeee',e)
            this.type = e.type;
            if(e.type=='1'){
                this.refund_form.order_type = '3';
            }else{
                if(this.order_detail.studio_order){
                    this.refund_form.order_type = '1';
                }else{
                    this.refund_form.order_type = '2';
                }
            }
            
            uni.removeStorage({key:'order_detail'});
			
		},
		onShow(){
			
		},
		methods: {
			bindPickerChange(e){
                this.reasonIndex = e.detail.value;
                this.refund_form.refund_reason = this.reasons[this.reasonIndex]
                console.log('eeeeee---',e)
            },
            refundCommit(){
                let params = Object.assign({order_id:this.order_detail.id},this.refund_form)
                this.$http.post(order.refund,params).then(res => {
                    if(res){
                        uni.showModal({
                            title: '提示',
                            content: '已提交退款申请，等待商家同意',
                            showCancel:false,
                            success: function(res1) {
                                uni.navigateBack()
                            }
                        });
                    }
                    
                }).catch(err => {})
            }
		}
	}
</script>

<style lang="scss" scope>
.order-item {
	display: flex;
	flex-direction: column;
	border-radius: 8rpx;

	/* 单条商品 */
	.goods-box-single {
		display: flex;
		padding: 20rpx 35rpx;
		font-size: 28rpx;
        background-color: #ffffff;
		.goods-img {
			display: block;
			width: 220rpx;
			height: auto;
		}

		.center {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30rpx 0 24rpx;
			overflow: hidden;

			.title {
				color: #333333;
				overflow:hidden; 
				text-overflow:ellipsis;
				display:-webkit-box; 
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2; 
			}
			.attr {
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;
				padding: 20rpx 0;
				color: #999999;
				.style {
					color: #333333;
					&:before {
						content: '';
					}
				}
			}

		}
		
		.right{
			font-size: 28rpx;
			padding-right: 30rpx;
			display: flex;
			flex-direction: column;
			// align-items: center;
			text-align: right;
			text{
				line-height: 40rpx;
				display: block;
			}
			.price{
				color: #333333;
			}
			.num{
				color:#999999;
			}
		}
	}
    .refund-detail{
        background-color: #ffffff;
        margin-top: 30rpx;
        padding: 35rpx;
        .reason-picker{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .re-pick{
                color: #999999;
                height: 35rpx;
                line-height: 35rpx;
                display: flex;
                align-items: center;
                .iconfont{
                    font-size: 40rpx;
                }
            }
        }
        .line{
            margin-bottom: 20rpx;
            font-size: 26rpx;
            .title{
                color: #333333;
            }
            
            .price{
                color: #EA001F;
            }
            
        }
        .line3{
            display: flex;
            align-items: center;
        }
    }
    .commit{
        position: fixed;
        bottom: 0;
        width: 100%;
        color: #ffffff;
        font-size: 36rpx;
        height: 98rpx;
        line-height: 98rpx;
        background-color: #651FFF;
        text-align: center;
    }
	.attr1 {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		padding: 20rpx 30rpx 20rpx 240rpx;
		color: #333333;
		.style {
			color: #333333;
			&:before {
				content: '';
			}
		}
	}
	.check-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		height: 50rpx;
		line-height: 50rpx;
		.left{
			color: #FF5700;
			font-size: 26rpx;
			text-decoration: underline;
		}
		.right{
			width: 120rpx;
			text-align: center;
			font-size: 26rpx;
			border: 1rpx solid #999999;
			border-radius: 32rpx;
			color: #333333;
			margin-right: 30rpx;
		}
	}
	.before-price-box{
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0 0 20rpx;
		font-size: 30rpx;
		color: #666666;
		.price {
			&:before {
				content: '￥';
				// font-size: $font-sm;
				margin: 0 2rpx 0 0rpx;
			}
		}
		.price1 {
			&:before {
				content: '-￥';
				// font-size: $font-sm;
				margin: 0 2rpx 0 0rpx;
			}
		}
		.discount {
			&:after {
				content: '折';
			}
		}
		.right{
			margin:0 30rpx;
		}
	}
	.price-box {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0 0 40rpx;
		font-size: 32rpx;
		.left{
			color: #333333;
		}
		.right{
			margin:0 30rpx;
		}
		.price-left {
			color:#666666;
		}

		.price {
			
			color: #EA001F;
			font-weight: bold;
			&:before {
				content: '￥';
				// font-size: $font-sm;
				margin: 0 2rpx 0 8rpx;
			}
		}
		
		.close{
			color: #b4b4b4;
		}
	}

	.action-box {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100rpx;
		position: relative;
		padding-right: 30rpx;
	}

	.action-btn {
		width: 160rpx;
		height: 60rpx;
		margin: 0;
		margin-left: 24rpx;
		padding: 0;
		text-align: center;
		line-height: 60rpx;
		font-size: 28rpx;
		color: #909399;
		background: #fff;
		border-radius: 0px;

		&:after {
			border-radius: 0px;
		}

		&.recom {
			background: #651FFF;
			color: #fff;

			&:after {
				border-color: #651FFF;
			}
		}
	}
}
</style>
