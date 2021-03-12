<template>
    <view>
        <!-- 通知活动等信息 -->
        <div class="commom">
            <div class="message-item"  v-for="(item,index) in typeList" :key="index" @click="gotoDetailList(item,0)">
                <div class="left" :class="'bg'+item.all_type">
                    <span class="iconfont" :class="item.icon"></span>
                    <span class="number" v-if="item.uncount>0">{{item.uncount}}</span>
                </div>
                <div class="right">
                    <p class="line1">
                        <span class="msg-type">{{item.all_type | allTypeToStr}}</span><span class="msg-time">{{item.rows.create_time | createTimeToStr}}</span>
                    </p>
                    <p class="msg-content">{{item.rows.type | typeToStr}}</p>
                </div>
            </div>
            <div class="message-item" v-if="sys_uncount>0" @click="gotoDetailList(0,1)">
                <div class="left bg0">
                    <span class="iconfont icontongzhi"></span>
                    <span class="number" v-if="sys_uncount>0">{{sys_uncount}}</span>
                </div>
                <div class="right">
                    <p class="line1">
                        <span class="msg-type">系统通知</span><span class="msg-time">{{sys_msgs.create_time | createTimeToStr}}</span>
                    </p>
                    <p class="msg-content">{{sys_msgs.remark}}</p>
                </div>
            </div>
        </div>
        <empty-show  v-if="typeList.length==0&&!sys_msgs"></empty-show>
        
        <div class="shop">
            <div class="message-item"></div>
        </div>
    </view>
	
</template>

<script>
import { message } from '@/common/api/api';
import { Format } from '@/common/utils/formatDate.js';
	export default {
	    data() {
	        return {
                host:this.$qiniuHost,
                params:{
                    page:1,page_size:1000000,
                },
                sys_msgs:{},
                sys_uncount:0,
                typeList:[]

            }
        },
        components:{
            
        },
        computed:{
            
        },
        filters:{
            allTypeToStr(val){
                if(val==1){return '订单消息'}
                else if(val==2){return '订单消息'}
                else if(val==3){return '财务消息'}
                else if(val==4){return '代办消息'}
                else if(val==5){return '代办消息'}
                else if(val==6){return '活动消息'}
                else if(val==7){return '活动消息'}
            },
            createTimeToStr(val){
                return val?Format.formatDateNoHouer(val*1000):'';
            },
            typeToStr(val){
                if(val==71){return '活动报名'}
                else if(val==11){return '商家接单'}
                else if(val==12){return '核验单消息'}
                else if(val==13){return '订单开始'}
                else if(val==14){return '评论消息'}
                else if(val==15){return '退款消息'}
            },
        },
	    onLoad(options){
            
        },
        onShow(){
            this.getAllFirstList();
            this.getSysList()
        },
		methods:{
            getAllFirstList(){
                this.typeList = []
                this.$http.get(message.getAllFirst).then(res => {
                    let obj1 = res.type_1?Object.assign(res.type_1,{all_type:1}):'';
                    if(obj1) this.typeList.push(obj1);
                    let obj2 = res.type_2?Object.assign(res.type_2,{all_type:2}):'';
                    if(obj2) this.typeList.push(obj2);
                    let obj3 = res.type_3?Object.assign(res.type_3,{all_type:3}):'';
                    if(obj3) this.typeList.push(obj3);
                    let obj4 = res.type_4?Object.assign(res.type_4,{all_type:4}):'';
                    if(obj4) this.typeList.push(obj4);
                    let obj5 = res.type_5?Object.assign(res.type_5,{all_type:5}):'';
                    if(obj5) this.typeList.push(obj5);
                    let obj6 = res.type_6?Object.assign(res.type_6,{all_type:6}):'';
                    if(obj6) this.typeList.push(obj6);
                    let obj7 = res.type_7?Object.assign(res.type_7,{all_type:7}):'';
                    if(obj7) this.typeList.push(obj7);
                    this.typeList.forEach(item => {
                        if(item.all_type==1){item.icon = 'icondingdan'}
                        else if(item.all_type==2){item.icon = 'icondingdan'}
                        else if(item.all_type==3){item.icon = 'icontongzhi'}
                        else if(item.all_type==4){item.icon = 'icontongzhi'}
                        else if(item.all_type==5){item.icon = 'icontongzhi'}
                        else if(item.all_type==6){item.icon = 'iconhuodong1'}
                        else if(item.all_type==7){item.icon = 'iconhuodong1'}
                    })
                    
                }).catch(err=>{})
            },
            getSysList(){
                this.$http.get(message.getSysList,{type:1}).then(res => {
                    this.sys_msgs = res.rows;
                    this.sys_uncount = res.uncount
                })
            },
            gotoDetailList(data,sys){
                if(data){
                    uni.navigateTo({url:"/pages/my/message/detailList?type="+data.all_type})
                }else{
                    uni.navigateTo({url:"/pages/my/message/detailList?is_sys="+sys})
                }
                
            },
		}
	}
</script>
	
<style lang="scss" scope>
.commom{
    margin-bottom: 22rpx;
    background-color: #ffffff;
    border-top: 1rpx solid #f8f8f8;
    .message-item{
        display: flex;
        padding: 35rpx 0 0;
        .bg0{
            background:linear-gradient(to right,#29BDDA, #1795D3);
        }
        .bg1,.bg2{
            background:linear-gradient(to right,#72EE80, #16DC9F);
        }
        .bg7,.bg6{
            background:linear-gradient(to right,#F88B49, #F05721);
        }
        .bg4,.bg4{
            background:linear-gradient(to right,#F6CF35, #FAC023);
        }
        
        .left{
            width: 88rpx;
            height: 88rpx;
            border-radius: 10rpx;
            margin-left: 35rpx;
            margin-right: 30rpx;
            text-align: center;
            position: relative;
            .iconfont{
                font-size: 50rpx;
                line-height: 88rpx;
                color:#ffffff;
            }
            .number{
                position: absolute;
                top: -12rpx;
                right: -12rpx;
                width: 30rpx;
                height: 30rpx;
                font-size: 20rpx;
                color: #ffffff;
                background-color: #EA001F;
                border-radius: 20rpx;
            }
        }
        .right{
            flex:1;
            padding-right: 35rpx;
            padding-bottom: 35rpx;
            border-bottom: 1rpx solid #f8f8f8;
            
            .line1{
                display: flex;
                justify-content: space-between;
                padding-bottom: 10rpx;
                span{
                    display: inline-block; 
                }
                .msg-type{
                    font-size: 30rpx;
                    color: #333333;
                }
                .msg-time{
                    font-size: 28rpx;
                    color: #999999;
                }
            }
            .msg-content{
                font-size: 26rpx;
                color: #999999;
                padding-bottom: 10rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 564rpx;
            }
        }
    }
}
</style>
