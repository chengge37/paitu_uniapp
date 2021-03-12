<template>
	<view>
        <div class="cart-edit" v-if="orderCount!=0">
            <span v-if="!editable" style="padding:40rpx;" @click="handleEditable">编辑</span>
            <span v-if="editable" style="padding:40rpx;" @click="handleEditable">完成</span>
        </div>
		<div class="cart-shop" :class="{'h5-cart-shop':isH5}" v-if="orderCount!=0">
            <div class="shop-name">
                <!-- <span class="select" :class="{'editableClass':editable}"></span> -->
                <checkbox-group @change="checkAll" class="select" :class="{'editableClass':editable}">
                    <!-- <checkbox :value="isAll" :checked="isAll"/> -->
                    <checkbox :checked="isAll"/>
                </checkbox-group>
                <span class="iconfont icondianpu" style="font-size:18px;"></span>
                <span class="name">{{cartOrder.user.nick}}</span>
                <span class="discount" @click="openPopup">优惠券</span>
            </div>
            <div class="studio-order" v-if="cartOrder.price.studioPriceArr.length!=0">
                <div class="cart-goods">
                    <!-- <div class="select">
                        <span class="select1" :class="{'editableClass':editable}"></span>
                    </div> -->
                    <checkbox-group @change="checkStudioChange" class="select1" :class="{'editableClass':editable}">
                        <!-- <checkbox :value="cartOrder.price.studioPriceArr.value" :checked="cartOrder.price.studioPriceArr.checked" /> -->
                        <checkbox :checked="cartOrder.price.studioPriceArr.checked" />
                    </checkbox-group>
                    <div class="img">
                        <!-- <image :src="host+cartOrder.price.studioPriceArr.pic"></image> -->
						<image :src="host + util.picExplode(studioUrl)" mode="aspectFit" @error="imgError(studioUrl,'studio')" />
                    </div>
                    
                    <div class="detail">
                        <p class="name">{{cartOrder.price.studioPriceArr.name}}</p>
                        <p class="date">{{cartOrder.cart.start_time}}-{{cartOrder.cart.end_time}}</p>
                        <p class="day" v-if="cartOrder.cart.rent_type==2">共{{day}}天</p>
                        <p class="day" v-else>共{{hour}}小时</p>
                    </div>                
                </div>
                <div class="price_num">
                    <p class="price">￥{{cartOrder.price.studioPriceArr.base}}</p>
                    <uni-number-box :min="1" :max="1" :disabled="true" @change="studioNumChange" class="num"></uni-number-box>
                </div>
            </div>
            <div class="equip-order" v-for="(equip,index) in cartOrder.price.equipPriceArr" :key="index">
                <div class="cart-goods">
                    <checkbox-group  @change="checkEquipChange($event,index)" class="select1" :class="{'editableClass':editable}">
                        <checkbox :value="equip.id" :checked="equip.checked"/>
                    </checkbox-group>
                    <div class="img">
                        <image :src="'https://pic.paitume.com/'+equip.equip_pic" @error="imgError(equip.id,'equip')"></image>
                    </div>
                    
                    <div class="detail">
                        <p class="name">{{equip.custom_desc}}</p>
                        <p class="date">{{cartOrder.cart.start_time}}-{{cartOrder.cart.end_time}}</p>
                        <p class="day" v-if="cartOrder.cart.rent_type==2">共{{day}}天</p>
                        <p class="day" v-else>共{{
                            hour}}小时</p>
                    </div>                
                </div>
                <div class="price_num">
                    <p class="price">￥{{equip.base}}</p>
                    <uni-number-box ref="numBox" :key="index" :min="0" :max="equip.count" :value="equip.number" @change="equipNumChange(index)" class="num"></uni-number-box>
                </div>
            </div>

        </div>
        <div class="footer" :class="{'h5-footer':isH5}" v-if="orderCount!=0">
            <div class="select">
                <checkbox-group v-if="editable" @change="checkAll" class="select" :class="{'editableClass':editable}">
                    <checkbox style="margin-right:12px" :checked="isAll"/> 全选
                </checkbox-group>
            </div>
            <div class="right" v-if="!editable">
                <span style="margin-right:15rpx;">总计:</span>
                <span style="margin-right:15rpx;color:#EA001F">￥{{cartOrder.price.order_price}}</span>
                <span class="pay" @click="toPay(cartOrder.id)">结算</span>
            </div>
            <div class="right" v-else>
                <span class="collect-btn" @click="collect">移至收藏</span>
                <span class="del-btn" @click="del" v-if="cartOrder.price.equipPriceArr.length>1">删除</span>
            </div>
        </div>
        
        <uni-popup ref="popup" type="bottom" >
            <div class="bottom">
                <div class="title">
                    <span>优惠券</span>
                    <span class="iconfont iconguanbi" @click="closePopup"></span>
                </div>

                <div class="quan" v-for="(item,index) in couponArr" :key="index">
                    <img :src="host+'images/miniapp/coupon.png'" class="bg-img" >
                    <div class="quan-content">
                        <div class="item">
                            <p class="price-color">
                                <span style="font-size:14px;">￥</span><span class="quan-price" style="margin-right:10rpx;">{{item.money}}</span><span>满￥{{item.limit_money}}可使用</span>
                            </p>
                            <p style="margin-bottom:15rpx;"><span class="price-color">{{item.coupon_type==1?'代金券':'折扣券'}} </span><span class="fenge">|</span><span>{{item.content}}</span></p>
                            <p class="date">{{item.st_time}} - {{item.end_time}}</p>
                        </div>
                        <div class="item">
                            <span class="picknow" :class="{'h5-picknow':isH5}" v-if="item.user_get<item.limit_count" @click="pickCoupon(item.id)">立即领取</span>
                            <span class="already-pick" v-else>已领取完</span>
                        </div>
                    </div>
                    
                </div>  
            </div>
            

        </uni-popup>
        <empty-show type='cart' v-if="orderCount==0"></empty-show>
       
	</view>
</template>

<script>
import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue"
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
import discountCoupon from "@/components/discount-coupon/discount-coupon.vue"
import { errorPic } from '@/common/utils/config'
import {order,collectOrFollow,coupon} from '@/common/api/api'

	export default {
        
		components: {
			uniNumberBox,uniPopup,discountCoupon
		},
		computed:{
			
		},
		data() {
			return {
				host: this.$qiniuHost,
                cartOrder:null,
                equipNumArr:[],
                editable:false,
                equipNumber:1,
                editForm:{
                    order_id:null,
                    rent_type:null,
                    start_time:null,
                    end_time:null,
                    equip_id:null,
                    count:null,
                    price:1,
                    door_to_door:null,

                },
                isAll:false,
                checkedArr:[],
                orderCount:0,
                day:0,
                hour:0,
                couponArr:[],
                studioUrl:'',
                isH5:false
			}
		},
		
		onLoad() {
        },
        mounted(){
            this.getOrderList()	
            //#ifdef  H5
            this.isH5=true
            //#endif
        },
        onShow(){
            
        },
		methods: {
            imgError(id,type){
                if(type=='equip'){
                    let ret = this.cartOrder.price.equipPriceArr.findIndex(e=>e.id==id);
                    let arr = this.cartOrder.price.equipPriceArr[ret];
                    if(ret!=-1){
                        this.cartOrder.price.equipPriceArr[ret].equip_pic = errorPic
                    }
                    this.cartOrder.price.equipPriceArr.splice(ret,1,arr)
                }else{
                    this.studioUrl = errorPic
                }
				
				
			},
            getOrderList(){
                this.$http.get(order.getOrderCart).then(res => {
					console.log('getOrderCart--------------------',res);
                    this.orderCount=res.count
                    this.cartOrder=res;
                    this.studioUrl=this.cartOrder.price.studioPriceArr.pic
                    this.cartOrder.price.equipPriceArr.forEach((item,index)=>{
                        item.checked=false
                        item.value=parseInt(this.cartOrder.cart.equip_array[index].equip_id)
                        this.cartOrder.cart.equip_array.forEach(v=> {
                            if(item.id==v.equip_id){
                                item.count = parseInt(v.detail.count);//库存数量
                            }
                        })
                    })
                    console.warn(this.$refs.equipSelect,'...')
                    this.$set(this.cartOrder.price.studioPriceArr,'checked',false)
                    this.$set(this.cartOrder.price.studioPriceArr,'value',this.cartOrder.price.studioPriceArr.studio_id)
                    this.equipNumArr={...this.cartOrder.price.equipPriceArr}
                    this.editForm.order_id=this.cartOrder.id
                    this.editForm.rent_type=this.cartOrder.cart.rent_type
                    this.editForm.door_to_door = this.cartOrder.cart.is_door_to_door;
                    if(this.editForm.rent_type==2){
                        this.editForm.start_time=this.cartOrder.cart.start_time.split(' ')[0];
                        this.editForm.end_time=this.cartOrder.cart.end_time.split(' ')[0];
                    }else{
                        this.editForm.start_time=this.cartOrder.cart.start_time;
                        this.editForm.end_time=this.cartOrder.cart.end_time;
                    }
                    
                    this.day=this.util.dayCount(this.cartOrder.cart.start_time,this.cartOrder.cart.end_time)
                    this.hour=this.countHour(this.cartOrder.cart.start_time,this.cartOrder.cart.end_time)
                    this.getCouponList(this.cartOrder.user.id)
                }).catch(err=>{})
            },
            getCouponList(uid){
                this.$http.get(coupon.getList,{page:1,page_size:30,uid:uid}).then(res=>{
                    this.couponArr=res.rows;
                    this.couponArr.forEach(item=> {
                        item.money = item.money.split('.')[0];
                        item.st_time = item.st_time.split(' ')[0];
                        item.end_time = item.end_time.split(' ')[0];

                    })
                }).catch(err=>{})
            },
            toPay(order_id){
                uni.navigateTo({url:'/pages/order/orderDetail?id='+order_id+'&type=0'});
                // uni.navigateTo({url:'/pages/order/orderDetail?id='+order_id+'&type=0'});
            },
            studioNumChange(val){
                
            },
			equipNumChange(i){
                console.warn(this.$refs.numBox[i].inputValue,'888')
                this.editForm.equip_id=parseInt(this.cartOrder.cart.equip_array[i].equip_id)
                let frontValue=this.editForm.count
                this.editForm.count=this.$refs.numBox[i].inputValue
                this.editForm.price=1
                this.$http.post(order.editRentOrder,this.editForm).then(res=>{
                    console.warn(res,'res')
                    this.getOrderList()
                }).catch(err=>{
                    this.$refs.numBox[i].inputValue=this.cartOrder.cart.equip_array[i].detail.count
                    this.editForm.count=this.cartOrder.cart.equip_array[i].detail.count
                })
            },
            collect(){
                if(this.cartOrder.price.studioPriceArr.checked){
                    this.$http.post(collectOrFollow.userCollectOrFollow,{
                        to_uid:this.cartOrder.user.id,
                        type:1,
                        obj:1,
                        relation_id:this.cartOrder.cart.studio_array.id
                    }).then(res=>{
                        uni.showToast({ 
                            title: res.data.msg,
                            icon: 'none'
                        })
                        console.warn(res,'收藏成功')
                    }).catch(err=>{})
                }
                this.cartOrder.price.equipPriceArr.forEach((item,index)=>{
                    if(item.checked){
                        this.$http.post(collectOrFollow.userCollectOrFollow,{
                            to_uid:this.cartOrder.user.id,
                            type:2,
                            obj:1,
                            relation_id:item.id
                        }).then(res=>{
                            console.warn(res,'收藏成功')
                            uni.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            })
                        }).catch(err=>{})
                    }
                })

            },
            del(){
                // 选中影棚删除等同于删除订单清空购物车
                if(this.cartOrder.price.studioPriceArr.checked){
                    this.$http.post(order.clearCart,{id:this.cartOrder.id}).then(res=>{
                        uni.showToast({
                            title: '删除成功',
                            icon: 'none'
                        })
                        console.warn(res,'清空成功')
                        this.getOrderList()
                    }).catch(err=>{})
                }else{
                    this.cartOrder.price.equipPriceArr.forEach((item,index)=>{
                        if(item.checked){
                            this.editForm.equip_id=item.id
                            this.editForm.count=0
                            this.$http.post(order.editRentOrder,{...this.editForm}).then(res=>{
                                console.warn(res,'修改成功')
                                uni.showToast({
                                    title: '删除成功',
                                    icon: 'none'
                                })
                                this.getOrderList()
                            }).catch(err=>{})
                        }
                    })
                }
            },
            checkAll(){
                this.isAll=!this.isAll
                if(this.isAll){
                    this.$set(this.cartOrder.price.studioPriceArr,'checked',true)
                    this.cartOrder.price.equipPriceArr.forEach((item,index)=>{
                        this.$set(item,'checked',true)
                    })
                }else{
                    this.$set(this.cartOrder.price.studioPriceArr,'checked',false)
                    this.cartOrder.price.equipPriceArr.forEach((item,index)=>{
                        this.$set(item,'checked',false)
                    })
                }
            },
            checkStudioChange(e){
                if(e.detail.value.length==1){
                    this.$set(this.cartOrder.price.studioPriceArr,'checked',true)
                }else{
                    this.$set(this.cartOrder.price.studioPriceArr,'checked',false)
                }
                console.warn(this.cartOrder.price.studioPriceArr,'8888')
                let checkAllEquip=this.cartOrder.price.equipPriceArr.every(item=>{
                    return item.checked
                })
                if(checkAllEquip&&this.cartOrder.price.studioPriceArr.checked){
                    this.isAll=true
                }else{
                    this.isAll=false
                }
            },
            checkEquipChange(e,i) {
                this.checkedArr=[]
                this.cartOrder.price.equipPriceArr.forEach((item,index)=>{
                    if(item.value==e.detail.value[0]){
                        this.$set(item,'checked',true)
                    }
                    if(e.detail.value.length==0){
                        this.$set(this.cartOrder.price.equipPriceArr[i],'checked',false)
                    }
                    if(item.checked){
                        this.checkedArr.push(item.value)
                    }
                        
                })
                this.checkedArr=[...new Set(this.checkedArr)]
                console.warn(this.checkedArr,'6666')
                
                let checkAllEquip=this.cartOrder.price.equipPriceArr.every(item=>{
                    return item.checked
                })
                console.log('checkAllEquip----',checkAllEquip)
                if(checkAllEquip){
                    this.isAll=true
                }else{
                    this.isAll=false
                }
            },
            openPopup(){
                if(this.couponArr.length>0){
                    this.$refs.popup.open()
                }else{
                    uni.showToast({title: '暂无优惠券',icon: 'none'});
                }
            },
            closePopup(){
                this.$refs.popup.close()
            },
            
            // 计算小时数
            countHour(startTime,endTime){
                let hour =(new Date(endTime).getTime() -new Date(startTime).getTime()) / 3600000;
                return Math.ceil(hour);
            },
            handleEditable(){
                this.editable=!this.editable
            },
            pickCoupon(id){
                this.$http.get(coupon.getCoupon,{id}).then(res=>{
                    console.warn(res,'领取优惠券成功')
                    this.getCouponList(this.cartOrder.user.id)
                }).catch(err=>{})
            }
        }
    }
</script>

<style lang="scss">
.cart-edit{
    padding: 20rpx 0;
    width: 100%;
    text-align: right;
    background-color: #ffffff;
    font-size: 12px;
    border-top: 1px solid #f8f8f8;
    span{
        padding: 40rpx;
        box-sizing: border-box;
    }
}
.cart-shop{
    background-color: #ffffff;
    margin: 20rpx;
    margin-bottom: 120rpx;
    .shop-name{
        display: flex;
        padding: 20rpx;
        span{
            display: inline-block;
            height: 45rpx;
            line-height: 45rpx;
            
        }
        .select{
            // width: 45rpx;
            // height: 45rpx;
            // border: 1px solid #d9d9d9;
            // border-radius: 45rpx;
            margin: 0px 10rpx;
            margin-left: -88rpx;
        }
        .icondianpu,.discount{
            flex-grow: 1;
            text-align: center;
        }
        .discount{
            font-size: 12px;
            color: #EA001F;
        }
        .name{
            flex-grow: 5;
            font-size: 14px;
        }
    }
    .cart-goods{
        display: flex;
        padding: 20rpx 20rpx 0rpx;
        align-items: flex-start;
        height:200rpx;
        .select1{
            margin: 0px 10rpx;
            margin-left: -88rpx;
            margin-right: 20px;
        }
        
        .img{
            
            flex-grow: 1;
            image{
                margin-left: 20rpx;
                width: 200rpx;
                height: 200rpx;
                border: 1px solid #d9d9d9;
            }
        }
        .detail{
            flex-grow: 3;
            padding-left: 20rpx;
            p{
                padding-bottom: 10rpx;
            }
            .name{
                font-size: 14px;
            }
            .date,.day{
                font-size: 12px;
                color: #999999;
            }
            
        }
        
    }
    .price_num{
            display: flex;
            justify-content: space-between;
            width: 50%;
            margin-left: 40%;
            padding:0 20px 20rpx;
            .price{
                color: #EA001F;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 16px
            }
        }
    
}
.h5-cart-shop{
    margin-bottom: 120px;
}
.editableClass{
    margin-left: 10rpx!important;
    transition: margin-left .8s;
}
.footer{
    position: fixed;
    bottom: 0rpx;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border: 1px solid #f8f8f8;
    width: 100%;
    font-size: 16px;
    z-index: 99;
    span{
        // padding: 30rpx;
        display: inline-block;

    }
    .select{
        // flex-grow: 1; 
        padding: 20rpx 30rpx 12rpx;
        .select1{
            // width: 45rpx;
            // height: 45rpx;
            border: 1px solid #d9d9d9;
            border-radius: 45rpx;
            padding: 20rpx;
            // margin: 0px 10rpx;
            // display: block;
        }
        .text{
            // padding-bottom:10rpx;
            display: inline-block;
            bottom: 5rpx;
            left: 30rpx;
            position: relative;
        }
    }
    .right{
        // flex-grow: 1;
        display: flex;
        align-items: center;
        .collect-btn{
            padding: 10px 20px;
            box-sizing: border-box;
            border:1px solid rgb(153,153,153);
            margin-right: 20px;
        }
        .del-btn{
            padding: 10px 18px;
            box-sizing: border-box;
            background: #EA001F;
            color:#fff;
            margin-right: 15px;
        }
    }
    .pay{
        padding:30rpx;
        background-color: #EA001F;
        color:#ffffff;
        width: 160rpx;
        text-align: center;
    }
}
.h5-footer{
    bottom: 50px;
}
.bottom{
    margin-bottom: 100rpx;
    .title{
        height: 100rpx;
        line-height: 100rpx;
        background-color: #f8f8f8;
        color: #333333;
        display: flex;
        justify-content: space-between;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 10;
        span{
            padding: 0 25rpx;
            display: inline-block;
        }
    }
    .quan{
        font-size: 12px;
        color: #333333;
        position: relative;
        top: 100rpx;
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
        .already-pick{
            padding:10rpx 20rpx;
            color: #F31734;
        }
        .date{
            color: #999999;
        }

    }
}
.no-order{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 500px;
}
</style>
