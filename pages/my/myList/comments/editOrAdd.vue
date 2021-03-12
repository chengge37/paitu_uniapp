<template>
<view>
    <div class="contain">
		<div class="product_info">
            <image class="pic" :src="host+product_info.pic"></image>
            <span class="product-name">{{product_info.name}}</span>
        </div>

        <div class="scoreOrEvaluate">
            <div class="score" v-if="type=='1'">
                <p class="title">评分:</p>
                <p class="score-radio">
                    <radio-group @change="radioChange">
                        <label class="radio-item" v-for="(item, index) in scores" :key="item.value">
                            <radio :value="item.value" :checked="index === current" color="#651FFF"/>
                            {{item.name}}
                        </label>
                    </radio-group>
                </p>
                
            </div>
            <div class="eval">
                <span class="title" v-if="type=='1'">修改评价</span>
                <span class="title" v-if="type=='2'">写追评</span>
                <div class="description">
                    <textarea placeholder="请输入" class="des_input" maxlength="320" v-model="content"/>
                    <div class="comment-pic">
                        <div v-for="(pic_item,index) in imgInfo" :key="index" class="pic-item">
                            <image class="pics" :src="pic_item.url" mode="aspectFill"></image>
                            <span class="delPic iconfont iconguanbi" @click="delPic(index)"></span>
                        </div>
                        
                        <div class="addPic" @click="addPic">
                            <p class="iconfont iconqicai"></p>
                            <p class="text">添加图片</p>
                        </div>
                    </div>
                </div>
                <p class="tips" v-if="type=='1'">注：修改评价的机会只有一次且无法恢复</p>
            </div>
        </div>

        
	</div>
    <div class="footer" @click="commit">
        <span v-if="type=='1'">确认修改</span>
        <span v-else>提交追评</span>
    </div>
</view>
	
	


</template>

<script>
import { comment } from '@/common/api/api';
import getImgInfo from '@/common/utils/uploadImg.js';
	export default {
	    data() {
	        return {
                host:this.$qiniuHost,
                type:'',
                scores: [
                    {value: '4',name: '满意'},
                    {value: '5',name: '非常满意'},
                ],
                content:'',
                score:'',
                id:'',
                product_info:{},
                imgInfo:[]
	        };
        },
        components:{
            
        },
        computed:{
            
        },
	    onLoad(options){
            let that = this;
            this.type = options.type;
            this.id = options.id;
            uni.getStorage({
				key: 'productInfo',
				success: (e) => {
					that.product_info = e.data;
					uni.removeStorage({
						key: 'productInfo'
					})
				}
			});
	    },
		methods:{
            addPic(){
                // let info = getImgInfo();
                // console.log('info',info)
                getImgInfo().then(res=>{
                    console.log('res---------dgj',res)
                    this.imgInfo.push(res);
                })
            },
            delPic(idx){
                this.imgInfo.splice(idx,1);
                console.log('this.imgInfo',this.imgInfo)
            },
            radioChange(e){
                this.score = e.detail.value;
            },
            commit(){
                if(this.content==''){
                    uni.showToast({title: '内容不能为空！',icon: 'none'});
                }else{
                    if(this.type=='1'){
                        // 修改评论
                        if(this.score==''){
                            uni.showToast({title: '评分不能为空！',icon: 'none'});
                        }else{
                            let edit_params={id:this.id,score:this.score,content:this.content};
                            this.$http.post(comment.editComment,edit_params).then(res => {
                                uni.showToast({title: '修改成功！',icon: 'success'});
                                setTimeout(() => {
                                    uni.navigateTo({url:'/pages/my/myList/myComments'});
                                },1000)
                                
                            }).catch(err=>{})
                        }
                    }else{
                        let add_params = {id:this.id,reply:this.content};
                        this.$http.post(comment.addComment,add_params).then(res => {
                            uni.showToast({title: '追评成功！',icon: 'success'});
                            setTimeout(() => {
                                uni.navigateTo({url:'/pages/my/myList/myComments'});
                            },1000)
                        }).catch(err=>{})
                    }
                }
                
            }

		}
	}
</script>
	
<style lang="scss" scope>
page{
    background-color: #ffffff;
    .contain{
        padding: 35rpx;
        border-top: 1rpx solid #f8f8f8;
    }
    .product_info{
        display: flex;
        align-items: center;
        padding-bottom: 30rpx;
        border-bottom: 1rpx solid #D9D9D9;
        .pic{
            height: 100rpx;
            width: 100rpx;
            border: 1rpx solid #f8f8f8;
            margin-right: 30rpx;
        }
        .product-name{
            flex: 1;
            display: inline-block;
            font-size: 30rpx;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .scoreOrEvaluate{
        margin-top: 30rpx;
        .title{
            font-size: 30rpx;
            color: #333333;
        }
        
        .score{
            display: flex;
            .score-radio{
                font-size: 30rpx;
                .radio-item{
                    margin-right: 20rpx;
                    radio{
                        transform:scale(0.7);
                    }
                }
            }
            p{
                display: inline-block;
            }
            .title{
                margin-right: 20rpx;
            }
        }
        .eval{
            .description{
                margin-top: 20rpx;
                padding: 10rpx 20rpx 20rpx;
                border: 1rpx solid #f8f8f8;
                height: 300rpx;
                position: relative;
                .des_input{
                    font-size: 28rpx;
                    width: 100%;
                    height: 210rpx;
                }
                .comment-pic{
                    display: flex;
                    .pic-item{
                        position: relative;
                        .iconfont{
                            position: absolute;
                            top: 0;
                            right: 10rpx;
                            color: #f8f8f8;
                            display: inline-block;
                            font-size: 24rpx;
                            background-color: #000000;
                            opacity: 0.3;
                        }
                    }
                    .pics{
                        width: 100rpx;
                        height: 100rpx;
                        margin-right: 10rpx;
                        display: block;
                    }
                }
                .addPic{
                    width: 150rpx;
                    text-align: center;
                    .iconqicai{
                        color: #999999
                    }
                    .text{
                        margin: 20rpx 0;
                        color:#999999;
                        font-size: 24rpx;
                    }
                }
            }
            .tips{
                color: #FF5600;
                font-size: 24rpx;
                margin-top: 20rpx
            }
            
        }
    }
    .footer{
        position: fixed;
        bottom: 0;
        background-color: #651FFF;
        color: #ffffff;
        padding: 20rpx 0;
        width: 100%;
        font-size: 32rpx;
        text-align: center;
    }
}
</style>
