<template>
	<view>
		<div class="order-detail">
            <div class="title">订单详情</div>
            <div class="info">
                <div class="order-info">
                    <p class="info-title">订单信息</p>
                    <p class="info-detail">
                        <span>买家信息：</span><span>{{order_detail.user.nick}}({{order_detail.user.mobile}})</span>
                    </p>
                    <p class="info-detail">
                        <span>订单总额：</span><span>￥{{order_detail.price}}</span>
                    </p>
                    <p class="info-detail">
                        <span>租借时间：</span><span>{{order_detail.start_time}}-{{order_detail.end_time}}</span>
                    </p>
                    <p class="info-detail">
                        <span>下单时间：</span><span>{{order_detail.create_time_str}}</span>
                    </p>
                    <p class="info-detail">
                        <span>订单编号：</span><span>{{order_detail.show_id}}</span>
                    </p>
                    <p class="info-detail">
                        <span>订单类型：</span><span>{{order_detail.type_str}}</span>
                    </p>

                </div>
                <div class="product-info">
                    <p class="info-title">产品信息</p>
                    <p class="info-detail" v-for="(item,index) in orderCheck.detail_array" :key="index">
                        <span>{{index+1}}.</span><span>{{item.name}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="protocol">
            <div class="title">租赁协议</div>
            <div class="protocol-content" v-html="orderCheck.content"></div>
        </div>
        <div class="order-check">
            <div class="title">产品核验单</div>
            <div class="product-detail" v-for="(item,index) in orderCheck.detail_array" :key="index">
                <div class="pro-name">{{index+1}}.{{item.name}}</div>
                <div class="pro-description">{{item.content}}</div>
                <image class="pro-image" @click="perviewImage" :data-src="host+item.pic" :data-list="orderCheck.pics" :src="host+item.pic" mode="aspectFill"></image>
            </div>
        </div>
        <div class="operation" >
            <div class="title">是否同意</div>
            <div class="opt-box" v-if="orderCheck.status!='1'">
               <div class="agreement">
                    <radio-group @change="radioChange">
                        <div v-for="item in agreement" :key="item.value" class="agree-item">
                            <label class="radio">
                                <radio :value="item.value" :checked="item.value==orderCheck.status" color="#651FFF" />{{item.label}}
                            </label>
                        </div>
                    </radio-group>
                </div>

                <div class="reason">
                    <p class="re-title">理由：</p>
                    <div class="re-input">
                         <textarea maxlength="200" v-model="reason" />
                    </div>
                </div> 

                <div class="opt-btn">
                  <div class=" btn" :class="opt?'comfirm':'cancel'" @click="comfirmCheck">确定</div>  
                  <div class="cancel btn" @click="cancel">取消</div>  
                </div>
            </div>
            <div class="had-agree" v-else>
                <span class="iconfont iconchenggong"></span>我已阅读核验单，同意核验单上所描述内容
            </div>
        </div>
        
	</view>
</template>

<script>
import {order} from '@/common/api/api'
import {Format} from '@/common/utils/formatDate.js'
	export default {
		components:{
			
		},
		data() {
			return {
                host: this.$qiniuHost,
                order_id:'',
                orderCheck:{},
                order_detail:{},
                agreement:[{value:'1',label:'我已阅读核验单，同意核验单上所描述内容',checked:1},{value:'2',label:'实物与描述不符合',checked:0}],
                reason:'',
                opt:''
			}
		},
		mounted() {
			
		},
		onLoad: function(e) {
            this.order_id = e.order_id;
            this.getOrderDetail();
            this.getOrderCheck();
		},
		onShow(){
			
		},
		methods: {
            // 订单详情
            getOrderDetail(){
                this.$http.get(order.getOrderDetail,{id:this.order_id}).then(res => {
                    this.order_detail = res;
                    this.order_detail.start_time = this.order_detail.start_time.split(' ')[0];
                    this.order_detail.start_time = this.order_detail.start_time.split(' ')[0];
                    this.order_detail.create_time_str = Format.formatDateNoSecond(this.order_detail.create_time*1000);
                    if(this.order_detail.studio_order){
                        this.order_detail.type_str="影棚订单"
                    }else{
                        this.order_detail.type_str="设备订单"
                    }
                    
                }).catch(err=>{})
            },
            // 核验单详情
			getOrderCheck(){
				this.$http.get(order.getCheck,{order_id:this.order_id}).then(res => {
                    this.orderCheck = res;
                    this.orderCheck.content = this.orderCheck.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
                    this.opt = res.status;
                    this.orderCheck.pics = [];
                    this.orderCheck.detail_array.forEach(v => {
                        this.orderCheck.pics.push(this.host+v.pic)
                    });
                    console.log('this.orderCheck.pics ----',this.orderCheck.pics)
				}).catch(err=>{})
            },
            // 确认核验,data:1同意，2拒绝
			comfirmCheck(){
                let that = this;
                let msg = ''
                let msg1 = ''
                if(this.opt=='1'){
                    msg = '同意核验单';
                    msg1 = '核验单已同意';
                }else if(this.opt=='2'){
                    msg = '不同意核验单';
                    msg1 = '核验单已拒绝';
                }
                if(this.opt){
                    uni.showModal({
                        title: '提示',
                        content: '是否'+msg+'?',
                        success: function (res) {
                            if (res.confirm) {
                                that.$http.post(order.optCheck,{order_check_id:that.orderCheck.id,opt:that.opt,reject_msg:that.reason}).then(res => {
                                    uni.showToast({title: msg1,icon: 'success',duration: 2000});
                                    setTimeout(()=> {
                                        uni.navigateBack()
                                    },2000)			
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                }else{
                    uni.showToast({title: '您未勾选以上选项！',icon: 'none',duration: 2000});
                }
                
				
            },
            cancel(){
                uni.navigateBack()
            },
            radioChange(e){
                this.opt = e.detail.value
            },
            perviewImage(e){
                console.log(e)
                let src = e.currentTarget.dataset.src;
                // #ifdef MP-WEIXIN
                let imgList = e.currentTarget.dataset.list;
                // #endif
                // #ifdef H5
                let imgList = e.currentTarget.dataset.list.split(',');
                // #endif
                console.log('imgList----',imgList)
                uni.previewImage({
                    current: src, // 当前显示图片的http链接
                    urls: imgList // 需要预览的图片http链接列表
                })
            },
		}
	}
</script>

<style lang="scss" scope>
.title{
    padding: 20rpx 35rpx;
    border-top: 1rpx solid #D9D9D9;
    border-bottom: 1rpx solid #D9D9D9;
    background-color: #F8F8F8;
    color: #333333;
    font-size: 36rpx;
    font-weight: bold;
}
.order-detail{
    .info{
        padding: 20rpx 45rpx;
        background-color: #ffffff;
        .order-info{
            margin-bottom: 30rpx;
        }
        .info-title{
            color: #333333;
            font-size: 32rpx;
            margin-bottom: 20rpx;
        }
        .info-detail{
            color: #666666;
            font-size: 30rpx;
        }
    }
    p{
        height: 50rpx;
        line-height: 50rpx;
    }
}
.protocol{
    .protocol-content{
        padding: 20rpx 35rpx;
        background-color: #ffffff;
        color: #666666;
        font-size: 30rpx;
    }
}
.order-check{
    .product-detail{
        background-color: #ffffff;
        padding: 35rpx;
        .pro-name{
            color: #333333;
            font-size: 32rpx;
            margin-bottom: 20rpx;
        }
        .pro-description{
            color: #666666;
            font-size: 30rpx;
            margin-bottom: 10rpx;
        }
        .pro-image{
            width: 100%;
        }
    }
}
.operation{
    .opt-box{
        background-color: #ffffff;
        padding: 35rpx;
        .agreement{
            font-size: 30rpx;
            color: #333333;
            .agree-item{
                margin-bottom: 30rpx;
            }
            .radio{
                margin-right: 10rpx;
            }
        }
        .reason{
            .re-title{
                color: #333333;
                font-size: 32rpx;
                margin: 30rpx 0;
            }
            .re-input{
                border: 1rpx solid #D9D9D9;
                background-color: #FAFAFA;
                padding: 20rpx;
                color: #666666;
                font-size: 30rpx;
                border-radius: 8rpx;
            }
        }
        .opt-btn{
            display: flex;
            margin: 30rpx 0;
            .btn{
                color: #ffffff;
                padding: 10rpx 40rpx;
                border-radius: 8rpx;
                font-size: 30rpx;
            }
            .comfirm{
                background-color: #651FFF;
                margin-right: 20rpx;
            }
            .cancel{
                background-color: #999999;
                margin-right: 20rpx;
            }
        }
    }
    .had-agree{
        padding: 35rpx;
        background-color: #ffffff;
        font-size: 30rpx;
        color: #999999;
        .iconfont{
            margin-right: 10rpx;
            color:#651FFF;
        }
    }
}
</style>
