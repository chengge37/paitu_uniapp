<template>
    <view>
        <view v-if="advList.length>0">
            <!-- 广告 -->
            <view class="advertise" v-if="type=='1'">
                <div class="adv-title">推荐影棚</div>
                <scroll-view class="adv" scroll-x="true" @scroll.stop="handleScroll" v-if="advList.length>0" @touchend.stop>
                    <view class="flex-view">
                        <view class="view-item"  v-for="(a_item,idx) in advList" :key="idx"  @click="gotoAdvDetail(a_item.rel_id)">
                            <div class="img-info">
                                <image :src="host + a_item.pic" mode="aspectFill" class="item-img"/>
                                <div class="infos">
                                    <span class="text">{{a_item.adv.score}}分/{{a_item.adv.floor}}楼.{{a_item.adv.square}}m².{{a_item.adv.total}}销量</span>
                                </div>
                            </div>
                            
                            <div class="info">
                                <p class="name">{{a_item.adv.name}}</p>
                                <p class="price">
                                    <span class="left">￥{{a_item.adv.priceHolidayWorkTimePerHour}}</span>
                                    <span class="right">/小时</span>
                                </p>
                            </div>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <view class="advertise" v-if="type=='2'">
                <div class="adv-title">精选设备</div>
                <scroll-view class="adv" scroll-x="true" @scroll.stop="handleScroll" v-if="advList.length>0" @touchend.stop>
                    <view class="flex-view">
                        <view class="view-item"  v-for="(a_item,idx) in advList" :key="idx"  @click="gotoAdvDetail(a_item.rel_id)">
                            <div class="img-info">
                                <image :src="host + a_item.pic" mode="aspectFill" class="item-img1"/>
                            </div>
                            
                            <div class="info">
                                <p class="name1">
                                    <span v-text="a_item.adv.custom_desc?a_item.adv.custom_desc:a_item.adv.name"></span>
                                </p>
                                <p class="price">
                                    <span class="left">￥{{a_item.adv.price_day_workday_in}}</span>
                                    <span class="right">/小时</span>
                                </p>
                            </div>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <view class="advertise" v-if="type=='3'">
                <div class="adv-title">精选模特</div>
                <scroll-view class="adv" scroll-x="true" @scroll.stop="handleScroll" v-if="advList.length>0" @touchend.stop>
                    <view class="flex-view">
                        <view class="view-item"  v-for="(a_item,idx) in advList" :key="idx"  @click="gotoAdvDetail(a_item.rel_id)">
                            <div class="img-info">
                                <image :src="host + a_item.pic" mode="aspectFill" class="item-img2"/>
                                <div class="infos">
                                    <span class="text">{{a_item.adv.name}}</span>
                                </div>
                            </div>
                            
                            <div class="info">
                                <!-- <p class="name">{{a_item.adv.name}}</p> -->
                                <p class="price price1">
                                    <span class="left">￥{{a_item.adv.priceHolidayAllDay}}</span>
                                    <span class="right">/天</span>
                                </p>
                            </div>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
	
</template>

<script>
import { advertise } from '@/common/api/api';
	export default {
		props:{
            type:''
        },
		data() {
			return {
               params:{
                   page_size:5,
                   position:0,
               },
               advList:[],
               host:this.$qiniuHost,
			}
		},
		mounted() {
            this.getAdvs();
            this.$emit('getAdv',{advList:this.advList});
		},
		watch:{
            advList(val){
                if(val.length>0){
                    this.$emit('change',{hasAdv:true})
                }else{
                    this.$emit('change',{hasAdv:false})
                }
            }
        },
		methods: {
            handleScroll(){
                
            },
            getAdvs(){
                let params;
                if(this.type!=3){
                    params = Object.assign(this.params,{type:this.type})
                }else{
                    params = Object.assign(this.params,{model:0,type:1})
                }
				
				this.$http.get(advertise.getList,params).then(res => {
					this.advList = res.rows;
				}).catch(err => {
                    this.advList = []
					console.log(err)
				})
            },
            gotoAdvDetail(data){
                console.log(data)
                console.log(this.type)
                if(this.type==1){
                    uni.navigateTo({url:'/pages/home/category/studioDetail/studioDetail?studio_id='+data})
                }else if(this.type==2){
                    uni.navigateTo({url:'/pages/home/category/equipmentDetail/equipmentDetail?equip_id='+data})
                }else if(this.type==3){

                }
                
            }
		}
	}
</script>

<style lang="scss" scope>
.advertise{
    padding: 35rpx;
    background-color: #ffffff;
    margin-top: 20rpx;
    .adv-title{
        color: #333333;
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
    }
    .adv{
        .flex-view{
            display: flex;
            .view-item{
                margin-right: 15rpx;
                .img-info{
                    position: relative;
                    .item-img {
                        width: 498rpx;
                        height: 280rpx;
                        border-radius: 10rpx;
                        
                    }
                    .item-img1 {
                        width: 280rpx;
                        height: 280rpx;
                        border-radius: 10rpx;
                        
                    }
                    .item-img2 {
                        width: 300rpx;
                        height: 400rpx;
                        border-radius: 8rpx;
                        background-color: #D8D8D8;
                    }
                    .infos{
                        position: absolute;
                        font-size:26rpx;
                        color: #ffffff ;
                        background-color: rgba($color: #000000, $alpha: 0.4);
                        height: 70rpx;
                        line-height: 70rpx;
                        bottom: 11rpx;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        border-bottom-left-radius: 10rpx;
                        border-bottom-right-radius: 10rpx;
                        .text{
                            margin-left:20rpx;
                        }
                    }
                }
                
                .info{
                    margin-top: 20rpx;
                    .name,.name1{
                        color: #333333;
                        font-size: 30rpx;
                        font-weight: bold;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .name{
                        width: 498rpx;
                    }
                    .name1{
                        width: 280rpx;
                    }
                    .price{
                        .left{
                            font-size: 30rpx;
                            color: #EA001F;
                            font-weight: bold;
                        }
                        .right{
                            font-size: 22rpx;
                            color: #333333;

                        }
                    }
                    .price1{
                        text-align: center;
                        .right{
                            color: #999999;
                        }
                    }
                }
            }
        }
    }
}
</style>
