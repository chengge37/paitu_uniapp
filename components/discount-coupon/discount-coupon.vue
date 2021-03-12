<template>
	<div class="contain">
        <!-- disabled为真时样式变灰 -->
		<!-- <div class="quan" :class="!item.ablePick?'disabled':''" v-for="item in couponList" :key="item.id">
            <img src="../../static/coupon.png" class="bg-img" >
            <div class="quan-content">
                 <div class="left">
                    <p class="left-content" v-if="item.coupon_type=='1'"><span class="price-color">店铺券 </span><span class="fenge">|</span><span> {{item.to_uid_name}}</span></p>
                    <p class="left-content" v-if="item.coupon_type=='2'"><span class="price-color">折扣券 </span><span class="fenge">|</span><span> {{item.to_uid_name}}</span></p>
                    <p class="date">{{item.st_time}}-{{item.end_time}}</p>
                </div>
                <div class="right">
                    <p class="price-color" v-if="item.coupon_type=='1'">
                        <span style="font-size:14px;">￥</span><span class="quan-price" style="margin-right:10rpx;">{{item.money}}</span>
                    </p>
                    <p class="price-color" v-else>
                        <span class="quan-price" style="margin-right:10rpx;">{{item.money}}</span><span style="font-size:14px;">折</span>
                    </p>
                    <p class="price-title">
                        <span>{{item.title}}</span>
                    </p>
                    <p class="pick-btn">
                        <span class="picknow" v-if="item.ablePick" @click="toPick(item.id)">立即领取</span>
                        <span class="picked" v-else>已领取完</span>
                    </p>
                    
                </div>
            </div>
            
        </div> -->
        <div class="quan" :class="!item.ablePick?'disabled':''" v-for="item in couponList" :key="item.id">
            <img :src="host+'images/miniapp/coupon.png'" class="bg-img" >
            <div class="quan-content">
                <div class="item">
                    <p class="price-color">
                        <span style="font-size:14px;" v-if="item.coupon_type==1">￥</span>
                        <span class="quan-price" :style="item.coupon_type==1?'margin-right:10rpx;':''">{{item.money}}</span>
                        <span style="font-size:14px;" v-if="item.coupon_type==2" :style="item.coupon_type==2?'margin-right:10rpx;':''">折</span>
                        <span>满￥{{item.limit_money}}可使用</span>
                    </p>
                    <p style="margin-bottom:15rpx;"><span class="price-color">{{item.coupon_type==1?'代金券':'折扣券'}} </span><span class="fenge">|</span><span>{{item.content}}</span></p>
                    <p class="date">{{item.st_time}} - {{item.end_time}}</p>
                </div>
                <div class="item">
                    <!-- <span class="price-color">已领取</span> -->
                    <span class="picknow" :class="{'h5-picknow':isH5}" v-if="item.user_get<item.limit_count" @click="toPick(item.id)">立即领取</span>
                    <span class="picked" v-else>已领取完</span>
                </div>
            </div>
            
        </div>
            
            
	</div>
	


</template>

<script>
import { coupon } from '@/common/api/api';
	export default {
        props:{
            couponList:Array
        },
	    data() {
	        return {
                disabled:false,
                host:this.$qiniuHost
	        };
	    },
	    onLoad(options){
			
	    },
		methods:{
			toPick(data){
                this.$http.get(coupon.getCoupon,{id:data}).then(res => {
                    this.$emit('getMyCoupons');
                    this.$emit('getShopCoupons');
                    uni.showToast({title: '领取成功！',icon: 'success'})
                })
            }
		}
	}
</script>
	
<style lang="scss" scope>
.contain{
    .disabled{
        color: #999999 !important;
        .price-color{
            color: #999999 !important;
        }
    }
    .quan{
        font-size: 12px;
        color: #333333;
        position: relative;
        // top: 90rpx;
        width: 95%;
        margin: 0 auto;
        .bg-img{
            position: absolute;
            width: 100%;
            height: 250rpx;
        }
        .quan-content{
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20rpx 40rpx;
            margin-bottom: 30rpx;
            .item{
                z-index: 2;
            }
        }
        
        span{
            padding-bottom: 20rpx;
        }
        .quan-price{
            font-size: 36px;
        }
        .price-color{
            color: #EA001F;
        }
        .fenge{
            margin: 0 10rpx;
        }
        .picknow{
            padding:10rpx 20rpx;
            background-color: #EA001F;
            border-radius: 10rpx;
            color: #ffffff;
            
        }
        .h5-picknow{
            padding: 10rpx 8rpx;
        }
        .picked{
            padding: 10rpx 8rpx;
        }
        .date{
            color: #999999;
        }

    }
   
}
</style>
