<template>
	<view>
		<view class="check-flow">
            <div class="title">核验单流程，交易更放心</div>
            <div class="flow-list" >
                <div class="flex-item" v-for="(item,index) in checkInfos" :key="index">
                    <div class="check-item">
                        <image class="check-pic" :src="host+'/images/'+item.pic"></image>
                        <p class="step">{{item.step}}</p>
                        <p class="info">{{item.info}}</p>
                    </div>
                    <div class="jiantou">
                        <img v-if="index!=2" class="arrow" src="https://pic.paitume.com/135-1574066481841.png"/>
                    </div>
                </div>
                
            </div>
            <div class="shujiantou">
                <img v-if="index!=1" class="arrow" src="https://pic.paitume.com/135-1574066481841.png"/>
            </div>
            <div class="flow-list1" >
                <div class="flex-item" v-for="(item,index) in checkInfos1" :key="index">
                    <div class="check-item">
                        <image class="check-pic" :src="host+'/images/'+item.pic"></image>
                        <p class="step">{{item.step}}</p>
                        <p class="info">{{item.info}}</p>
                    </div>
                    <div class="jiantou">
                        <img v-if="index!=1" class="arrow" src="https://pic.paitume.com/135-1574066481841.png"/>
                    </div>
                </div>
                
            </div>
        </view>
	</view>
</template>

<script>
	export default {
		components:{
			
		},
		data() {
			return {
                host:this.$qiniuHost,
                checkInfos:[{
					pic:'heyandan_01.png',
					step:'下单',
					info:'顾客付款'
				},{
					pic:'heyandan_02.png',
					step:'核验单',
					info:'商家上传核验单'
				},{
					pic:'heyandan_03.png',
					step:'验货',
					info:'核验单与订单货物一致'
				}],
                checkInfos1:[
                    {
                        pic:'heyandan_05.png',
                        step:'完成',
                        info:'使用设备和影棚'
                    },
                    {
                        pic:'heyandan_04.png',
                        step:'确认',
                        info:'核验单页面点击确认'
                    },
                ]
			}
		},
		mounted() {
			
		},
		
		methods: {
           
		}
	}
</script>

<style lang="scss" scope>
.check-flow{
    background-color: #F1F7FC;
    padding: 20rpx 20rpx 40rpx;
    .title{
        width: 100%;
        text-align: center;
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
        padding: 20rpx 0 30rpx;
    }
    .flow-list{
        display: flex;
        justify-content: space-between;
        flex-wrap:wrap;
        .flex-item{
            display: flex;
            
        }
        .check-item{
            width: 162rpx;
            text-align: center;
            .check-pic{
                width: 96rpx;
                height: 96rpx;
            }
            .step{
                color: #333333;
                font-size: 24rpx;
            }
            .info{
                color: #666666;
                font-size: 20rpx;
            }
        }
        .jiantou{
            .arrow{
                margin-top: 40rpx;
                margin-left: 20rpx;
                width: 64rpx;
                height: 20rpx;
            }
        }
    }
    .flow-list1{
        display: flex;
        justify-content: flex-end;
        .flex-item{
            display: flex;
            
        }
        .check-item{
            width: 162rpx;
            text-align: center;
            .check-pic{
                width: 96rpx;
                height: 96rpx;
            }
            .step{
                color: #333333;
                font-size: 24rpx;
            }
            .info{
                color: #666666;
                font-size: 20rpx;
            }
        }
        .jiantou{
            .arrow{
                margin-top: 40rpx;
                margin-left: 20rpx;
                margin-right: 25rpx;
                width: 64rpx;
                height: 20rpx;
                transform: rotate(180deg)
            }
        }
    }
    .shujiantou{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 120rpx;
        .arrow{
           margin-right: 45rpx;
            width: 64rpx;
            height: 20rpx;
            transform: rotate(90deg)
        }
    }
}
</style>
