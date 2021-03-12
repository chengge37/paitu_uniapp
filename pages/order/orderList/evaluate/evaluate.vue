<template>
	<view class="body">
        <div class="order-item" v-for="(item,index) in orderDetail.goodsList" :key="index">
            <div class="product">
                <div class="img">
                    <image :src="host+item.img" class="image" mode="aspectFill"></image>
                </div>
                <div class="info">
                    <p class="line1">
                        <span class="sign">{{item.sign}}</span><span class="name">{{orderDetail.user.nick}}</span>
                    </p>
                    <p class="price">{{item.price}}</p>
                </div>
            </div>
            <div class="scoreOrEvaluate">
                <div class="score">
                    <p class="title">评分:</p>
                    <p>
                        <uni-rate size="18" :value="item.score" @change="rateChange($event,item.id)"></uni-rate>
                    </p>
                    
                </div>
                <div class="eval">
                    <span class="title">描述:</span>
                    <div class="description">
                        <textarea placeholder="添加文字描述" class="des_input" maxlength="320" v-model="item.content"/>
                        <div class="comment-pic">
                            <image class="pics" :src="host+pic_item" v-for="(pic_item,index) in item.keys" :key="index" mode="aspectFill"></image>
                            <div class="addPic" @click="addPic(item.id)">
                                <p class="iconfont iconqicai"></p>
                                <p class="text">添加图片</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
		
        <div class="comfirm-btn" @click="comfirm">确认评价</div>
	</view>
</template>

<script>
import { comment } from '@/common/api/api';
import {uploadImg} from "@/common/utils/uploadImg.js"
import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue';
	export default {
        components:{
            uniRate
        },
		data() {
			return {
                host:this.$qiniuHost,
				params:{
                    order_id:'',
                    type:2,
                    content:'',
                    score:5,//店铺评分
                },
                content:[],
                orderDetail:{},
                url:''
			};
		},
		onLoad(e){
            let that = this;
			uni.getStorage({
                key:'evalOrder',
                success:function(res){
                    that.orderDetail = res.data;
                    that.params.order_id = res.data.id;
                    that.orderDetail.goodsList.forEach(v => {
                        v.pics = [];
                        v.keys = [];
                        if(v.equip_id){
                            v.sign='设备'
                        }else{
                            v.sign='影棚'
                        }
                    });
                    console.log('that.orderDetail',that.orderDetail)
                    uni.removeStorage({key:'evalOrder'})
                }
            })
		},
        methods: {
            rateChange(e,data){
                this.orderDetail.goodsList.forEach(v =>{
                    if(v.id == data){
                        v.score = e.value;
                    }
                })
            },
            addPic(data){
                let idx = this.orderDetail.goodsList.findIndex(e=>e.id==data);
                let arr = this.orderDetail.goodsList[idx];
                if(arr.keys.length<=5){
                    uploadImg().then(res=>{
                        console.log('成功',res)
                        this.orderDetail.goodsList = this.orderDetail.goodsList.splice(idx,1,arr)
                        //#ifdef MP-WEIXIN
                        this.orderDetail.goodsList[idx].keys.push(res.key);
                        //#endif
                        //#ifdef H5 || APP-PLUS
                        this.orderDetail.goodsList[idx].keys.push(res);
                        //#endif
                    }).catch(err=>{
                        console.log('失败',err)
                    });
                }else{
                    uni.showToast({title:'请上传不超过5张图片',icon:'none',duration:1000})
                }
                
            },
            uploadImg(data) {
                console.log("-------tempFilePaths", this.url);
                var that = this;
                wx.uploadFile({
                    url: "https://upload-z2.qiniup.com",
                    name: "file",
                    filePath: this.url,
                    header: {
                        "Content-Type": "multipart/form-data"
                    },
                    formData: {
                        token: data.token,
                        key: data.key
                    },
                    success: function(res) {
                        let data = JSON.parse(res.data);
                    },
                    fail: function(res) {
                        console.log(res);
                    }
                });
            },
            comfirm(){
                let arr = [];
                this.orderDetail.goodsList.forEach(item => {
                    let obj = {
                        id:'',//对应设备/影棚id
                        type:1,//type类型1影棚 2设备
                        content:item.content,
                        score:item.score,
                        pic:item.keys.join(','),//图片数组多图逗号分隔
                    };
                    if(item.equip_id){
                        obj.type = 2;
                        obj.id = item.equip_id;
                    }else{
                        obj.type = 1;
                        obj.id = item.studio_id;
                    }
                    arr.push(obj)
                    
                })
                this.params.content = JSON.stringify(arr);
                console.log('this.params.content',this.params.content)
                this.$http.post(comment.userAddComment,this.params).then(res => {
                    if(res){
                        uni.showToast({title: '评价成功！',icon: 'success'});
                        setTimeout(() => {
                            uni.navigateTo({url:'/pages/order/orderList/orderList?state=7'})
                        },1000)
                        
                    }
                    
                }).catch(err=>{})
            }
        },
	}
</script>

<style lang="scss">
.order-item{
    padding: 35rpx;
    background-color: #ffffff;
    margin-bottom: 20rpx;
    .product{
        display: flex;
        justify-content: space-between;
        border-bottom: 1rpx solid #f8f8f8;
        padding-bottom: 20rpx;
        .img{
            
            margin-right: 20rpx;
            .image{
                width: 100rpx;
                height: 100rpx; 
            }
        }
        .info{
            flex: 1;
            .line1{
                line-height: 30rpx;
                .sign{
                    background-color: #651FFF;
                    font-size: 20rpx;
                    border-radius: 20rpx;
                    padding: 4rpx 15rpx;
                    color: #ffffff;
                    margin-right: 20rpx;
                }
                .name{
                    font-size: 26rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .price{
                font-size: 24rpx;
                color: #333333;
                margin-top: 14rpx;
            }
            .price::before{
                content: '￥'
            }
            .price::after{
                content: '/小时'
            }
        }
    }
    .scoreOrEvaluate{
        margin-top: 30rpx;
        .title{
            font-size: 30rpx;
            color: #333333;
        }
        .title::before{
            content: '*';
            color: #EA001F;
            margin-right: 10rpx;
        }
        .score{
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
            
        }
    }
}
.comfirm-btn{
    padding: 20rpx;
    width: 100%;
    text-align: center;
    background-color: #651FFF;
    color: #ffffff;
    font-size: 30rpx;
}
</style>