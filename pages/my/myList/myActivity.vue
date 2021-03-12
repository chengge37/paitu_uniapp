<template>
	<div class="contain">
		<div class="list-item" v-for="(item,index) in myActivities" :key="index" @click="gotoDetail(item)">
            <image class="img" :src="host+item.pic" mode="widthFix"></image>
            <div class="list-info">
                <div class="title">{{item.activity.name}}</div>
                <p class="date">
                    <span class="name">活动时间：</span><span class="content">{{item.activity.start_time}}-{{item.activity.end_time}}</span>
                </p>
                <p class="address">
                    <span class="name">地&emsp;&emsp;址：</span><span class="content">{{item.activity.address}}</span>
                </p>
                <p class="cost">
                    <span class="name" style="color:#333333">费&emsp;&emsp;用：</span><span class="price">{{item.activity.fee}}</span>
                    <span class="status" v-if="item.pay_status=='1'">待付款</span>
                    <span class="status" v-if="item.pay_status=='2'">已付款</span>
                </p>
            </div>
        </div>
		<empty-show v-if="myActivities.length==0&&!loading"></empty-show>
		
	</div>
	


</template>

<script>
import {activity} from '@/common/api/api'
	export default {
	    data() {
	        return {
                host:this.$qiniuHost,
				myActivities:[],
				loading:true
	        };
	    },
	    onLoad(options){
			this.getMyActivities()
	    },
		methods:{
			getMyActivities(){
				this.loading=true;
                this.$http.get(activity.getOrder).then(res => {
                    this.myActivities = res.rows;
                    this.myActivities.forEach(item => {
                        item.activity.start_time = item.activity.start_time.split(' ')[0];
                        item.activity.end_time = item.activity.end_time.split(' ')[0];
                    })
					this.loading=false;
                }).catch(err=>{})
            },
            gotoDetail(data){
                console.log('----data---',data)
                uni.navigateTo({
					url: '/pages/home/category/activityDetail/activityDetail?activity_id=' + data.activity.id +'&name=' +data.activity.name
				});
            }
		}
	}
</script>
	
<style lang="scss" scope>
.contain{
    
    .list-item{
        padding: 30rpx;
        background-color: #ffffff;
        display: flex;
        justify-content: space-around;
        border-top: 1px solid #f8f8f8;
        .img{
            flex: 1;
            height: 120rpx;
        }
        .list-info{
            flex: 2;
            margin-left: 20rpx;
            .title{
                color: #333333;
                font-size: 32rpx;
                font-weight: bold;
                margin-bottom: 10rpx;
            }
            p{
                font-size: 26rpx;
                color: #999999;
                line-height: 40rpx;
            }
            .date,.address,.cost{
                display: flex;
                justify-content: space-between;
                span{
                    display: inline-block;
                    
                }
                .name{
                   width: 130rpx;
                //    flex-wrap: nowrap;
                }
                .content{
                    // flex:2
                    width: 320rpx;
                }
                .price{
                    flex:1;
                    color: #333333;
                    font-weight: bold;
                }
                .status{
                    flex:1;
                    text-align: right;
                }
            }
        }
    }
}
</style>
