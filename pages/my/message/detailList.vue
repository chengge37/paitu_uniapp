<template>
    <view>
        <div class="msg-item" v-for="(item,index) in detailList" :key="index" @click="gotoDetail(item.rel_id)">
            <div class="line1">
                <p class="msg-type" v-if="msg_type">{{type_str}}</p>
                <p class="msg-type" v-else>
                    <span v-if="item.title">{{item.title}}</span>
                    <span v-else>系统通知</span>
                </p>
                <p class="msg-time">{{item.create_time | createTimeToStr}}</p>
            </div>
            <div class="line2">
                <!-- <div class="left" v-if="item.pics.length>0">
                    <image class="img" :src="host+item.pics" v-if="item.pic"></image>
                </div> -->
                <div class="msg-content">
                    <span v-if="msg_type">{{item.type | typeToStr}}</span>
                    <span v-else>{{item.remark}}</span>
                </div>
            </div>
        </div>
        <empty-show  v-if="detailList.length==0"></empty-show>
    </view>
	
</template>

<script>
import { mapState } from 'vuex'
import { message } from '@/common/api/api';
import { Format } from '@/common/utils/formatDate.js';
	export default {
	    data() {
	        return {
                host:this.$qiniuHost,
                allSys:[],
                detailList:[],
                params:{
                    page:1,
                    page_size:10,
                    type:3,
                    is_sys:0,
                },
                read_ids:[],
                msg_type:''
            }
        },
        components:{
            
        },
        computed:{
            type_str(){
                if(this.params.type==1||this.params.type==2){
                    return '订单消息'
                }else if(this.params.type==3){
                    return '财务消息'
                }else if(this.params.type==4||this.params.type==5){
                    return '代办消息'
                }else if(this.params.type==6||this.params.type==7){
                    return '活动消息'
                }
            },
            ...mapState(['user'])
        },
        watch:{
            detailList(val){
                val.forEach(item => {
                    this.read_ids.push(item.id)
                });
                if(this.read_ids.length>0){
                    this.markToRead()
                }
            }
        },
        filters:{
            typeToStr(val){
                if(val==71){return '报名活动成功'}
                else if(val==11){return '您有订单已接单'}
                else if(val==12){return '您有订单已上传核验单'}
                else if(val==13){return '您有订单已开始'}
                else if(val==14){return '您有订单已评论'}
                else if(val==15){return '您有订单已退款'}
            },
            createTimeToStr(val){
                return val?Format.formatDateNoHouer(val*1000):'';
            }
        },
	    onLoad(e){
            this.msg_type = e.type;
            if(e.type){
                this.params.type = e.type;
                this.getNoticeList()
            }
            if(e.is_sys){
                delete this.params.is_sys;
                this.getAllSys();
                
            }
            
	    },
		methods:{
            getNoticeList(){
                this.$http.get(message.getList,this.params).then(res => {
                    this.detailList = this.detailList.concat(res.rows);
                    this.detailList.forEach(item => {
                        if(item.pic){
                            item.pics = item.pic.split(',');
                        }else{
                            item.pics = [];
                        }
                        
                    })
                })
            },
            getAllSys(){
                this.params.type = 2
                this.$http.get(message.getAllSysList,this.params).then(res => {
                    this.detailList = this.detailList.concat(res.rows);
                    this.getMySys()
                })
                
                
            },
            getMySys(){
                this.params.type = 3
                let params = Object.assign(this.params,{uid:this.user.paitume_user.id})
                this.$http.get(message.getAllSysList,params).then(res => {
                    this.detailList = this.detailList.concat(res.rows);
                    this.detailList.forEach(item => {
                        if(item.pic){
                            item.pics = item.pic.split(',');
                        }else{
                            item.pics = [];
                        }
                    })
                })
            },
            markToRead(){
                let ids = this.read_ids.join(',')
                this.$http.get(message.toRead,{id:ids}).then(res => {

                }).catch(err => {})
            },
            gotoDetail(data){
                if(this.msg_type){
                    if(this.params.type==1){
                        uni.navigateTo({url:"/pages/order/orderDetail?type=0&id="+data})
                    }else if(this.params.type==7){
                        uni.navigateTo({url:"/pages/order/orderDetail?type=1&id="+data})
                    }
                }
            }
        },
        onReachBottom(){
            this.params.page++;
            if(this.msg_type){
                this.getNoticeList()
            }else{
                this.getAllSys()
            }
        },
	}
</script>
	
<style lang="scss" scope>
.msg-item{
    margin: 20rpx 35rpx 0;
    background-color: #ffffff;
    padding: 30rpx 35rpx;
    border-radius: 15rpx;
    .line1{
        display: flex;
        justify-content: space-between;
        .msg-type{
            color: #333333;
            font-size: 36rpx;
            font-weight: bold;
        }
        .msg-time{
            font-size: 26rpx;
            color: #999999;
        }
    }
    .line2{
        display: flex;
        align-items: center;
        .img{
            width:108rpx;
            height: 108rpx;
            margin-right: 30rpx;
        }
        .msg-content{
            line-height: 40rpx;
            font-size: 30rpx;
            color:#333333;
            margin-top: 10rpx;
        }
    }
}
</style>
