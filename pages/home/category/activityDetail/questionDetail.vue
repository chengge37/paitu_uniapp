<template>
    <view>
        <div class="discuss-content" >
            <div class="user">
                <image class="user-img" :src="util.avatarUtil(qus_detail.uid_avatar)"></image>
                <p class="user-name">{{qus_detail.uid_nick}}</p>
            </div>

            <div class="neirong">
                <p class="text">{{qus_detail.content}}</p>
                <p class="date_reply">
                    <span class="date">{{qus_detail.time_str}}</span>
                </p>
            </div>
        </div>

        <div class="discuss-child">
            <div class="discuss-title">
                <span class="border"></span>
				<span>所有回复</span>
				
			</div>
            <div class="discuss-content"  v-if="qus_detail.children.length>0" >
				<div v-for="item in qus_detail.children" :key="item.id" @click="replyOne(item)">
                    <div class="line1">
                        <div class="user">
                            <image class="user-img" :src="util.avatarUtil(item.user.avatar)"></image>
                            <p class="user-name">{{item.user.nick}}</p>
                            
                        </div>
                        <p class="date_reply">
                            <span class="date">{{item.time_str}}</span>
                        </p>
                    </div>
					
					<div class="neirong">
						<p class="text1">
                            回复
                            <span class="to_user">{{item.to_user.nick}}</span>
                            ：{{item.content}}
                        </p>
						
					</div>
				</div>
				
			</div>
            <div v-else class="nodata">
                ---暂无回复---
            </div>
        </div>

        <div class="reply">
            <input type="text" :placeholder="'回复'+reply_name" class="reply-input" v-model="params.content">
            <div class="reply-btn" @click="sent">发送</div>
        </div>
    </view>
</template>

<script>
import {Format} from '../../../../common/utils/formatDate.js'
import { question } from '@/common/api/api';
export default {
    data(){
        return{
            host:this.$qiniuHost,
            qus_detail:{},
            params:{
               qid:'',
               content:'',
               rid:'0',
            },
            reply_name:''
        }
    },
    onLoad(){
        uni.getStorage({
            key: 'questionDetail',
            success: (e) => {
                this.qus_detail = e.data;
                this.reply_name = e.data.uid_nick
                this.params.qid = e.data.id,
                this.qus_detail.time_str = Format.formatDateNoSecond(this.qus_detail.create_time*1000);
                this.qus_detail.children.forEach(v => {
                    v.time_str = Format.formatDateNoSecond(v.create_time*1000);
                })
                // uni.removeStorage({
                //     key: 'questionDetail'
                // })
            }
        });
    },
    methods: {
        sent(){
            this.$http.post(question.reply,this.params).then(res => {
                if(!res){
                    uni.showModal({
                        title: '错误提示',
                        content: '未知错误',
                        success: function (res1) {
                            if (res1.confirm) {
                            } else if (res1.cancel) {
                            }
                        }
                    });
                    
                }else{
                    uni.showModal({
                        title: '提示',
                        content: '您的回复已成功发送，审核通过之后方可显示',
                        success: function (res1) {
                            if (res1.confirm) {
                            } else if (res1.cancel) {
                            }
                        }
                    });
                }
                this.params.content = ''
            })
        },
        replyOne(data){
            this.reply_name = data.user.nick;
            this.params.rid = data.id
        }
    },
}
</script>

<style scoped lang='scss'>
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
.nodata{
    margin: 50rpx 0;
    width: 100%;
    text-align: center;
    font-size: 28rpx;
    color:#999999;
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
    .line1{
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