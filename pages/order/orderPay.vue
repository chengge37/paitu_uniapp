<template>
	<view>
		<div v-if="order_type == 'equip'">
			<view class="pick-way">
				<div class="way" :class="item.active?'active':''" v-for="(item,index) in tabs" :key="index" @click="tabChange(item.name)">{{item.name}}
					<div class="border"></div>
				</div>
			</view>
			<view class="address">
				<div class="left">
					<span class="iconfont icondizhi adr-icon"></span>
				</div>
				<div class="right" v-if="tabIndex==1"  @click="gotoMyAddress">
					<div class="detail" v-if="defaultAddress&&defaultAddress.id">{{defaultAddress.address}}</div>
					<div class="detail" v-else>暂无地址，去添加？</div>
					<div class="name" v-if="defaultAddress&&defaultAddress.id">
						<span>{{defaultAddress.name}}</span><span class="tel">{{defaultAddress.mobile}}</span>
					</div>
				</div>
				<div class="right" v-else>
					<div class="detail">{{order_detail.to_user.address}}</div>
					<div class="name">
						<span v-if="order_detail.to_user&&order_detail.to_user.nick">{{order_detail.to_user.nick}}</span><span class="tel" v-if="order_detail.to_user&&order_detail.to_user.mobile">{{order_detail.to_user.mobile}}</span>
					</div>
				</div>
			</view>
		</div>
		
		<div class="order-content">
			<div class="cart-shop">
				<div class="shop-name">
					<span class="iconfont icondianpu" style="font-size:18px;"></span>
					<span class="name" v-if="order_detail.to_user&&order_detail.to_user.nick">{{order_detail.to_user.nick}}</span>
				</div>
				<div class="goods-item" v-for="(item,index) in order_detail.goodsList" :key="index">
					<div class="cart-goods">
						<div class="img">
							<image :src="item.img?host+item.img:host+defaultEquipPic"></image>
						</div>
						
						<div class="detail">
							<p class="name">{{item.name}}</p>
							<p class="date" >
								<span v-if="order_detail.rent_type=='2'">{{order_detail.start_time}}-{{order_detail.end_time}}</span>
								<span v-else>{{order_detail.rent_time_range}}</span>
							</p>
							<p class="day">
								共{{order_detail.days}}
								<span v-if="order_detail.rent_type=='2'">天</span>
								<span v-else>小时</span>
							</p>
							
						</div>
						
					</div>
					<div class="price_num">
						<p class="price">￥{{item.price}}</p>
						<!--  v-if="item.type==1" -->
						<p class="num"><span class="iconfont iconguanbi"></span>{{item.order_count}}</p>
						<!-- <uni-number-box :min="0" @change="numChange" class="num" :value='item.order_count' v-else></uni-number-box> -->
					</div>
				</div>
			
			</div>

			<div class="quan" @click="openCoupon">
				<div class="title">优惠券</div>
				<div class="right">
					<span class="youhui" v-if="reduced">已优惠￥{{reduced}}</span>
					<span class="noCoupon" v-if="useCoupon.length==0">暂无优惠券</span>
					<span v-else class="iconyoujiantou iconfont"></span>
				</div>
				
			</div>
		</div>
		

		<div class="footer">
			<div class="left">
				<span class="cost" v-if="order_detail.price">￥{{order_detail.price}}</span>
			</div>
			<!--#ifdef MP-WEIXIN || MP-ALIPAY  -->
			<div class="right" @click="comfirmToPay">去付款</div>
			<!--#endif -->
			<!--#ifdef APP-PLUS || H5 -->
			<!-- 如果不是微信小程序 先选支付方式 -->
			<div class="right" @click="selectPayWay">去付款</div>
			<!--#endif -->
		</div>
		<uni-popup ref="popupCoupon" type="bottom">
			<div class="coupon-popup">
				<div class="title">
					<span>优惠券</span>
					<span class="iconfont iconguanbi" @click="closeCouponPopup"></span>
				</div>
				<div class="coupon-radio">
					<p class="cou-title" v-if="plat_coupons1.length>0||plat_coupons2.length>0">平台优惠券</p>
					<radio-group @change="platRadioChange1" v-if="plat_coupons1.length>0">
						<p class="sub-title">--代金券--</p>
						<label class="radio-item" v-for="(item, index) in plat_coupons1" :key="index">
							<div>{{'满'+item.limit_money+'元减'+item.money}}</div>
							<div>
								<radio color="#651FFF" :value="item.id" :checked="item.id===cou_current1" />
							</div>
							
						</label>
					</radio-group>

					<radio-group @change="platRadioChange2" v-if="plat_coupons2.length>0">
						<p class="sub-title">--折扣券--</p>
						<label class="radio-item" v-for="(item, index) in plat_coupons2" :key="index">
							<div>{{'满'+item.limit_money+'元'+item.money+'折'}}</div>
							<div>
								<radio color="#651FFF" :value="item.id" :checked="item.id===cou_current2" />
							</div>
							
						</label>
						
					</radio-group>


					<p class="cou-title" v-if="shop_coupons1.length>0||shop_coupons2.length>0">店铺优惠券</p>
					<radio-group @change="shopRadioChange1" v-if="shop_coupons1.length>0">
						<p class="sub-title">--代金券--</p>
						<label class="radio-item" v-for="(item, index) in shop_coupons1" :key="index">
							<div>{{'满'+item.limit_money+'减'+item.money}}</div>
							<div>
								<radio color="#651FFF" :value="item.id" :checked="item.id===cou_current3" />
							</div>
							
						</label>
					</radio-group>
					<radio-group @change="shopRadioChange2" v-if="shop_coupons2.length>0">
						<p class="sub-title">--折扣券--</p>
						<label class="radio-item" v-for="(item, index) in shop_coupons2" :key="index">
							<div>{{'满'+item.limit_money+'元 '+item.money+'折'}}</div>
							<div>
								<radio color="#651FFF" :value="item.id" :checked="item.id===cou_current4" />
							</div>
							
						</label>
						<!-- <label class="radio-item">
							<div>不使用优惠券</div>
							<div>
								<radio color="#651FFF" value="0" />
							</div>
							
						</label> -->
					</radio-group>
				</div>
				<div class="comfirm-btn" @click="couComfirm">确认</div>
			</div>
			
		</uni-popup>

		<uni-popup ref="popupRef" type="center">
			<div class="close">
				<span class="iconfont iconguanbi" @click="closePay"></span>
			</div>
			<div class="payway-content">
				<p class="shop-name" v-if="order_detail.to_user&&order_detail.to_user.nick">{{order_detail.to_user.nick}}</p>
				<p class="cost">￥{{total_price}}</p>

				<div class="pay-pcker">
					<p>支付方式</p>
					<picker mode="selector" :range="payWay" range-key="name" :value="payIndex" @change="payWayChange">
						{{payWay[payIndex].name}}
						<span class="iconfont iconyoujiantou"></span>
					</picker>
				</div>
				<div class="comfirm-btn">确认支付</div>
			</div>
		</uni-popup>
		<div ref="alipay"></div>
		<min-action-sheet ref="popupRef"></min-action-sheet>
	</view>
</template>

<script>
import uniList from "@/components/uni-ui/uni-list/uni-list.vue"
import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue"
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
import minActionSheet from '@/components/min-action-sheet/min-action-sheet'
import { order,address,coupon } from '@/common/api/api';
import {Format} from '@/common/utils/formatDate.js'
import { defaultEquipPic } from '@/common/utils/config';
	export default {
		components:{
			uniNumberBox,uniPopup,minActionSheet,uniList,uniListItem
		},
		data() {
			return {
				order_type:'',//订单类型
				tabs:[
					{name:'到店使用',active:true,type:0},
					{name:'配送',active:false,type:1},
				],
				tabIndex:0,
				defaultEquipPic:defaultEquipPic,
				order_detail:{},
				host:this.$qiniuHost,
				payWay:[
					{name:'支付宝'},
					{name:'微信'},
					{name:'中国银行'},
				],
				payIndex:0,
				total_price:0,
				shop_name:'',
				shop_id:'',
				order_id:'',
				defaultAddress:{},
				my_coupons:[],
				useCoupon:[],
				couponList:[],
				reduced:'',
				showBadage:true,
				cou_current1:'',
				cou_current2:'',
				cou_current3:'',
				cou_current4:'',
				shop_coupons1:[],
				shop_coupons2:[],
				plat_coupons1:[],
				plat_coupons2:[]
			}
		},
		filters:{

		},
		mounted() {
			
		},
		onLoad: function(e) {
			let that = this;
			this.order_id = e.order_id;
			this.shop_id = e.uid;
			this.getDetail();//先获取一遍详情，getMyCoupons里需要判断一遍订单价格是否达到优惠券的最低价格
			uni.showLoading({title: '加载中'});
			
			this.initData()
			
		},
		onShow(){
			// 去选择地址返回
			if(this.util.getStorage("selectAddress")){
				this.defaultAddress = this.util.getStorage("selectAddress");
				this.util.delStorage("selectAddress");
			}else{
				this.getDefaultAddress();
			}
		},
		methods: {
			// 平台满减修改
			platRadioChange1(e){
				this.cou_current1 = e.detail.value;
				
			},
			// 平台折扣修改
			platRadioChange2(e){
				this.cou_current2 = e.detail.value;
			},
			// 店铺满减修改
			shopRadioChange1(e){
				this.cou_current3 = e.detail.value;
			},
			// 店铺折扣修改
			shopRadioChange2(e){
				this.cou_current4 = e.detail.value;
			},
			async initData(){
				uni.showLoading({title: '加载中'});
				let useCoupon = await this.getOrderCoupon();
				let myCoupon = await this.getMyCoupons();
				// 平台券
				let defaultPlat1 = this.cou_current1 = this.getMaxDiscId(this.plat_coupons1);//满减券
				let defaultPlat2 = this.cou_current2 = this.getMaxDiscId1(this.plat_coupons2);//折扣
				// 店铺券
				let defaultShop1 = this.cou_current3 = this.getMaxDiscId(this.shop_coupons1);//满减券
				let defaultShop2 = this.cou_current4 = this.getMaxDiscId1(this.shop_coupons2);//折扣
				// 若订单使用的优惠券类型已存在
				useCoupon.forEach(v => {
					if(v.to_uid=='0'&&v.coupon_type=='1'){
						defaultPlat1 = '';
						this.cou_current1 = v.id;
					}else if(v.to_uid=='0'&&v.coupon_type=='2'){
						defaultPlat2 = '';
						this.cou_current2 = v.id;
					}else if(v.to_uid!='0'&&v.coupon_type=='1'){
						defaultShop1 = '';
						this.cou_current3 = v.id;
					}else if(v.to_uid!='0'&&v.coupon_type=='2'){
						defaultShop2 = '';
						this.cou_current4 = v.id;
					}
					
				});
				if(defaultPlat1){
					await this.toUseCoupon(defaultPlat1)
				}
				if(defaultPlat2){
					await this.toUseCoupon(defaultPlat2)
				}
				if(defaultShop1){
					await this.toUseCoupon(defaultShop1)
				}
				if(defaultShop2){
					await this.toUseCoupon(defaultShop2)
				}
				this.getDetail()
			},
			cancelCouponUse(data){
				return new Promise((resolve,reject) => {
					this.$http.get(coupon.cancelUse,{order_id:this.order_id,id:data}).then(res=>{
						resolve(res)
					})
					.catch(err=> {
						reject(err)
					})
				})
				
			},
			async couComfirm(){
				if(this.cou_current1){
					let ret = this.useCoupon.findIndex(e=>(e.coupon_type=='1'&&e.to_uid=='0'));
					if(ret!=-1){
						await this.cancelCouponUse(this.useCoupon[ret].id)
					}
					await this.toUseCoupon(this.cou_current1);
				}
				if(this.cou_current2){
					let ret1 = this.useCoupon.findIndex(e=>(e.coupon_type=='2'&&e.to_uid=='0'));
					if(ret1!=-1){
						await this.cancelCouponUse(this.useCoupon[ret1].id);
					}
					await this.toUseCoupon(this.cou_current2)
				}
				if(this.cou_current3){
					let ret2 = this.useCoupon.findIndex(e=>(e.coupon_type=='1'&&e.to_uid!='0'));
					if(ret2!=-1){
						await this.cancelCouponUse(this.useCoupon[ret2].id);
					}
					await this.toUseCoupon(this.cou_current3)
				}
				if(this.cou_current4){
					let ret3 = this.useCoupon.findIndex(e=>(e.coupon_type=='2'&&e.to_uid!='0'));
					if(ret3!=-1){
						await this.cancelCouponUse(this.useCoupon[ret3].id);
					}
					await this.toUseCoupon(this.cou_current4)
				}
				this.getOrderCoupon();
				this.getDetail()
				this.$refs.popupCoupon.close();
			},
			closePay() {
				this.$refs.popupRef.close();
			},
			selectPayWay(item) {
				this.payItem = this.order_detail;
				// console.log('this.$refs.popupRef'+JSON.stringify(this.$refs));
				this.$refs.popupRef.handleShow({
					actions: [{
							name: '支付宝',
							// icon: 'iconfont active',
							color: '#651FFF'
						},
						{
							name: '微信',
							// image: 'http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
						}
					],
					success: (res) => {
						let payWay = 0;
						console.log('res---',res)
						switch (res.id) {
							// -1代表取消按钮
							case -1:
								console.log(res)
								break
							case 0:
								payWay = 2;
								break
							case 1:
								payWay = 1;
								break
						}
						if(payWay == 0){
							return;
						}
						let call_way = '';
						//#ifdef APP-PLUS
						call_way = 'app'
						//#endif
						//#ifdef H5
						call_way = 'h5'
						//#endif
						let payData = {
							'order_id': this.payItem.id,
							'total_price': this.payItem.price,
							'pay_way': payWay,
							'call_way': call_way
						};
						console.log('payData', payData);
						let _this = this;
						this.$http.post('/order/userPay', payData).then(res => {
							console.log('userPay succ', res);
							//#ifdef APP-PLUS
							uni.requestPayment({
								provider: payWay == 1 ? 'wxpay' : 'alipay',
								orderInfo: res,
								success: function(res) {
									uni.showToast({
										title: "支付成功",
										icon: "success",
										duration: 2000,
									});
									setTimeout(() => {
										_this.getOrderList();
									}, 2000);
								},
								fail: function(res) {
									let err_msg = ''
									if (res.errMsg == 'requestPayment:fail cancel') {
										err_msg = '取消支付'
									} else {
										err_msg = res.errMsg;
									}
									uni.showModal({
										content: "支付失败,原因为: " + err_msg,
										showCancel: false
									})
									console.log('fail:' + JSON.stringify(res));
								}
							});
							//#endif
							//#ifdef H5
								if (payWay == 1) {
									if (res.indexOf('https://wx.tenpay.com') != -1) {
										window.location.href = res;
									}
								} else if (payWay == 2) {
									this.$refs.alipay.innerHTML = res;
									console.log('res----',res)
									document.forms["alipay_submit"].submit();
								}
							//#endif
						}).catch(err => {
							console.log('userPay error', err);
						});
					}
				})
			},
			gotoMyAddress(){
				uni.navigateTo({url:'/pages/my/address?from=detail'})
			},
			getDefaultAddress(){
				this.$http.get(address.getDefault,{is_default:1}).then(res => {
					this.defaultAddress = res;
				}).catch(err=>{})
			},
			getDetail(){
				// return new Promise((resolve,reject)=> {
					this.$http.get(order.getOrderDetail,{id:this.order_id}).then(res => {
						this.order_detail = res;
						let price=0;
						
						if(this.order_detail.rent_type!='1'){
							this.order_detail.start_time = this.order_detail.start_time.split(' ')[0];
							this.order_detail.end_time = this.order_detail.end_time.split(' ')[0];
							this.order_detail.days = this.util.dayCount(this.order_detail.start_time,this.order_detail.end_time);
						}else{
							this.order_detail.rent_time_range = this.order_detail.start_time + ' ~ ' +this.order_detail.end_time.split(' ')[1]
							this.order_detail.days = this.util.calHours(this.order_detail.start_time.replace(/-/,'/'),this.order_detail.end_time.replace(/-/,'/'));
						}
						
						this.order_detail.create_time_str = Format.formatDateNoSecond(this.order_detail.create_time*1000);
						// 将订单商品数据格式处理一下 
						this.order_detail.goodsList = [];
						// 影棚订单
						if(this.order_detail.studio_order){
							this.order_type = 'studio';
							this.order_detail.goodsList.push(this.order_detail.studio_order);
							if(this.order_detail.studio_order.equip_order_array&&this.order_detail.studio_order.equip_order_array.length>0){
								// 如果影棚订单里有器材
								this.order_detail.goodsList = this.order_detail.goodsList.concat(this.order_detail.studio_order.equip_order_array)
							}
							this.order_detail.goodsList.forEach(v => {
								if(!v.order_count){
									v.order_count = 1;
									v.type =1;
									v.img = v.studio_detail.pic.split(',').filter(v=>{return v})[0];
									v.name = v.studio_detail.name;
								}else{
									if(v.equip.pic){v.img = v.equip.pic.split(',').filter(v=>{return v})[0]}
									else{v.img = v.equip.static.pic.split(',').filter(v=>{return v})[0]}
									v.name = v.equip.custom_desc;
									v.type = 2;
								}
								price += parseInt(v.price);
							})
						// 器材订单
						}else{
							this.order_type = 'equip';
							this.order_detail.goodsList =this.order_detail.equip_order;
							this.order_detail.goodsList.forEach(v => {
								v.img = v.equip.pic.split(',').filter(v=>{return v})[0]
								v.name = v.equip.custom_desc;
								v.type = 2;
								price += parseInt(v.price);
							})
						}
						this.reduced = price - this.order_detail.price;//优惠了多少钱
						uni.hideLoading();
						// resolve(res)
					}).catch(err=>{
						uni.hideLoading();
					// })
				})
				
			},
			getMyCoupons(){
				return new Promise((resolve,reject)=> {
					this.$http.get(coupon.getMyList,{group:1}).then(res =>{
						let cou_arr = res.rows;
						cou_arr.forEach(item => {
							// 订单总价满足优惠券最低价，该店铺和平台的优惠券
							// let flag = (&&(item.to_uid=='0'||item.to_uid==this.shop_id));
							if(item.coupon_type=='1'){
								item.money = item.money.split('.')[0]
							}else{
								item.money = Math.floor(parseInt(item.money))/10;
							}
							let is_used = item.order_id>0&&item.order_id!=this.order_id;//在别的订单使用过了
							if(parseInt(this.order_detail.price)>=parseInt(item.limit_money)&&!is_used){
								if(item.to_uid=='0'){
									if(item.coupon_type=='1'){
										this.plat_coupons1.push(item)
									}else if(item.coupon_type=='2'){
										this.plat_coupons2.push(item)
									}
									
								}else if(item.to_uid==this.shop_id){
									if(item.coupon_type=='1'){
										this.shop_coupons1.push(item)
									}else if(item.coupon_type=='2'){
										this.shop_coupons2.push(item)
									}
								}
							}
						});
						console.log('this.plat_coupons1---',this.plat_coupons1)
						console.log('this.shop_coupons1---',this.shop_coupons1)
						resolve(res);
					}).catch(err=>{})
				})
			},
			getOrderCoupon(){
				return new Promise((resolve,reject)=> {
					this.$http.get(order.getOrderCart,{order_id:this.order_id}).then(res => {
						this.useCoupon = res.price.coupon_array;
						this.useCoupon.forEach(item => {
							if(item.coupon_type=='1'){
								item.money = item.money.split('.')[0]
							}else{
								item.money = Math.floor(parseInt(item.money))/10;
							}
						});
						console.log('res----',this.useCoupon)
						resolve(this.useCoupon);
					})
				})
			
			},
			// 获取最大优惠id
			getMaxDiscId(coupons){
				let arr = [];
				coupons.forEach(item => {
					let is_use = item.order_id>0;//order_id为'0',null时是未使用
					if(!is_use){
						arr.push(item.money);
					}
				});
				let max = Math.max(...arr);
				let ret = coupons.findIndex(e=>e.money==max);
				if(ret!=-1){
					return coupons[ret].id
				}
			},
			getMaxDiscId1(coupons){
				let arr = [];
				coupons.forEach(item => {
					let is_use = item.order_id>0;//order_id为'0',null时是未使用
					if(!is_use){
						arr.push(item.money);
					}
				});
				let max = Math.min(...arr);
				let ret = coupons.findIndex(e=>e.money==max);
				if(ret!=-1){
					return coupons[ret].id
				}
			},
			updateAddress(){
				return new Promise((resolve,reject)=> {
					this.$http.post(order.addOrderAddress,{order_id:this.order_id,address_id:this.defaultAddress.id}).then(res => {
						resolve(res);
					}).catch(err=>{})
				})
			},
			// 修改配送类型
			editDelivery(){
				this.$http.get(order.editDelivery,{order_id:this.order_id,door_to_door:this.tabIndex}).then(res => {
					
				}).catch(err=>{})
			},
			tabChange(data){
				this.tabs.forEach(item => {
					if(item.name == data){
						item.active = true;
						this.tabIndex = item.type;
					}else{
						item.active = false;
					}
				});
			},
			numChange(){},
			payWayChange(e){
				this.payIndex = e.detail.value
			},
			toUseCoupon(id){
				return new Promise((resolve,reject)=> {
					this.$http.get(coupon.couponUse,{id:id,order_id:this.order_id}).then(res => {
						resolve(res);
					}).catch(err => {})
				})
				
			},
			toWxPay(){
				let _this = this;
				
				//微信小程序支付
				uni.getProvider({
					service: 'payment',
					success: function(res) {
						console.log('手机支持啥支付' + JSON.stringify(res));
					}
				});
				let payData = {
					'order_id': this.order_detail.id,
					'total_price': this.order_detail.price,
					'pay_way': 1,
					'call_way': 'mp-weixin'
				};
				this.$http.post('/order/userPay', payData).then(res => {
					console.log('小程序userPay succ', res);
					uni.requestPayment({
						provider: "wxpay",
						timeStamp: res.timeStamp,
						nonceStr: res.nonceStr,
						package: res.package,
						signType: "MD5",
						paySign: res.paySign,
						orderInfo: JSON.stringify(payData),
						success: function(res) {
							uni.showToast({
								title: "支付成功",
								icon: "success",
								duration: 2000,
							});
							setTimeout(() => {
								console.log('_this.order_detail.id',_this.order_detail.id);
								
								uni.navigateTo({url:'/pages/order/orderDetail?id='+_this.order_detail.id+'&type=0'});
							}, 2000);
						},
						fail: function(res) {
							let err_msg = ''
							if(res.errMsg=='requestPayment:fail cancel'){
								err_msg = '取消支付'
							}
							uni.showModal({
								content: "支付失败,原因为: " + err_msg,
								showCancel: false
							})
							console.log('fail:' + JSON.stringify(res));
						}
					});
				}).catch(err => {
					console.log('小程序userPay error', err);
				});
				
			},
			toAliPay(){
				let _this = this;
				let payData = {
					'order_id': this.order_detail.id,
					'total_price': this.order_detail.price,
					'pay_way': 2,
					'call_way': 'mp-alipay'
				};
				let payApi = '/order/userPay';
				
				this.$http.post(payApi, payData).then(res => {
					console.log('小程序userPay succ', res);
					uni.requestPayment({
						provider: "alipay",
						orderInfo: res.trade_no,
						success: function(res) {
							if(res.resultCode == 6001){
								uni.showToast({
									title: res.memo,
									icon: "none",
									duration: 2000,
								});
							} else if(res.resultCode == 9000) {
								uni.showToast({
									title: "支付成功",
									icon: "success",
									duration: 2000,
								});
								setTimeout(() => {
									uni.navigateTo({url:'/pages/order/orderDetail?id='+_this.order_detail.id+'&type=0'});
								}, 2000);
							} else {
								uni.showToast({
									title: "错误"+res.memo,
									icon: "none",
									duration: 2000,
								});
							}
						},
						fail: function(res) {
							let err_msg = ''
							if (res.errMsg == 'requestPayment:fail cancel') {
								err_msg = '取消支付'
							}
							uni.showModal({
								content: "支付失败,原因为: " + res,
								showCancel: false
							})
							console.log('fail:' + JSON.stringify(res));
						}
					});
				}).catch(err => {
					console.log('小程序userPay error', err);
				});
			},
			comfirmToPay(){
				// this.$refs.popupRef.open();
				// 设备订单才可以修改配送类型和修改地址
				let _this = this;
				// 订单为设备订单可以修改地址，修改配送类型
				if(this.order_type=='equip'){
					this.editDelivery();
					// 同城配送时，地址不能为空
					if(this.tabIndex==1){
						if(this.defaultAddress&&this.defaultAddress.id){
							this.updateAddress().then(res=>{
								// #ifdef MP-WEIXIN
								this.toWxPay()
								// #endif
								// #ifdef MP-ALIPAY
								this.toAliPay()
								// #endif
							})
							
						}else{
							uni.showModal({
								title: '提示',
								content: '地址不能为空，请先添加地址',
								success: function(res1) {
									if (res1.confirm) {
										_this.gotoMyAddress()
									} 
								}
							});
						}
					}else{
						// #ifdef MP-WEIXIN
						this.toWxPay()
						// #endif
						// #ifdef MP-ALIPAY
						this.toAliPay()
						// #endif
					}
				}else{
					// #ifdef MP-WEIXIN
					this.toWxPay()
					// #endif
					// #ifdef MP-ALIPAY
					this.toAliPay()
					// #endif
				}
				
			},
			closePay(){
				this.$refs.popupRef.close();
			},
			openCoupon(){
				if(this.shop_coupons1.length==0&&this.shop_coupons2.length==0&&this.plat_coupons1.length==0&&this.plat_coupons2.length==0){
					uni.showToast({title:"暂无优惠券",icon:'none',duration:1000})
				}else{
					this.$refs.popupCoupon.open()
				}
				
			},
			closeCouponPopup(){
				this.$refs.popupCoupon.close()
			},
		}
	}
</script>

<style lang="scss" scope>
.pick-way{
	padding: 30rpx;
	display: flex;
	justify-content: space-around;
	
	background-color: #ffffff;
	border-top: 1px solid #f8f8f8;
	border-bottom: 1px solid #f8f8f8;
	
	.way{
		width: 50%;
		text-align: center;
		font-size: 28rpx;
		color: #999999;
		position: relative;
		
	}
	.active{
		color: #651FFF;
		.border{
			position: absolute;
			// left: 128rpx;
			left:50%;
			top: 45rpx;
			width: 40rpx;
			height: 6rpx;
			transform: translate(-50%, 0%);
			background-color: #651FFF;
		}
	}
	.way:first-child{
		border-right: 1px solid #f8f8f8;
	}
	
	
}
.address{
	display:flex;
	justify-content:flex-start;
	background: #ffffff;
	align-items: flex-start;
	.left{
		padding: 20rpx 30rpx;
		line-height: 50rpx;
		.adr-icon{
			color:#651FFF;
			font-size: 40rpx;
		}
	}
	.right{
		padding: 20rpx 20rpx 20rpx 0;
		line-height: 50rpx;
		font-size: 28rpx;
		color: #333333;
		.tel{
			margin-left: 10rpx;
			color:#999999;
		}
	}
}
.order-content{
	margin-bottom: 120rpx;
}
.cart-shop{
    background-color: #ffffff;
    padding: 20rpx 20rpx 0rpx 20rpx;
    margin-top: 20rpx;
    .shop-name{
        display: flex;
        padding: 20rpx 0rpx;
        span{
            display: inline-block;
            height: 45rpx;
            line-height: 45rpx;
            
        }
        .select{
            width: 45rpx;
            height: 45rpx;
            border: 1px solid #d9d9d9;
            border-radius: 45rpx;
            margin: 0px 10rpx;
        }
        .icondianpu,.discount{
            text-align: center;
        }
        .discount{
            font-size: 12px;
            color: #EA001F;
        }
        .name{
			margin-left: 20rpx;
            font-size: 14px;
        }
    }
    .cart-goods{
        display: flex;
        padding: 10rpx 20rpx 0rpx;
        // align-items: flex-start;
        height:200rpx;
        
        .img{
            
            // flex-grow: 1;
            image{
                margin:0  20rpx;
                width: 200rpx;
                height: 200rpx;
                border: 1px solid #d9d9d9;
            }
        }
        .detail{
            // flex-grow: 3;
            // padding-left: 20rpx;
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
            margin-left: 35%;
            padding:0 10px 20rpx 0;
            .price{
                color: #EA001F;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 16px
            }
			.num{
				color: #999999;
				font-size: 16px;
				height: 80rpx;
                line-height: 80rpx;
			}
        }
   .goods-item{
		margin-bottom: 20rpx;
	}
	.goods-item:not(:last-child){
		border-bottom: 1px solid #f8f8f8;
	} 
}
.quan{
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	background-color: #ffffff;
	margin-top: 20rpx;
	align-items: center;
	
	.title{
		font-size: 36rpx;
		color: #333333;
	}
	.right{
		display: flex;
		align-items: center;
		span{
			display: inline-block;
			
		}
		.youhui{
			color: #EA001F;
			font-size: 24rpx;
			margin-right: 20rpx;
			
		}
		.iconyoujiantou{
			color: #999999;
			font-size: 40rpx;
		}
		.noCoupon{
			font-size:24rpx;
			color:#999999;
		}
	}
	
}
.footer{
	position: fixed;
	display: flex;
	justify-content: space-between;
	font-size: 36rpx;
	background-color: #ffffff;
	width: 100%;
	align-items: center;
	bottom: 0;
	.cost::before{
		content: '合计：';
		color:#333333;
	}
	.cost{
		color: #EA001F;
		margin-left: 30rpx;
	}
	.right{
		padding: 25rpx 60rpx;
		background-color: #EA001F;
		color: #ffffff;
	}
}
.close{
	width:440rpx;
	padding: 10rpx 20rpx 0;
	text-align: right;
}
.payway-content{
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.shop-name,.cost{
		width: 400rpx;
		text-align: center;
		font-size: 32rpx;
		color: #333333;
		margin-bottom: 20rpx;
	}
	.cost{
		font-weight: bold;
	}
	.pay-pcker{
		margin-top: 30rpx;
		font-size: 28rpx;
		color: #999999;
		display: flex;
		width: 400rpx;
		justify-content: space-between;
	}
	.comfirm-btn{
		font-size: 32rpx;
		padding: 15rpx 0rpx;
		color: #ffffff;
		background-color: #651FFF;
		width: 250rpx;
		text-align: center;
		margin-top: 70rpx;
	}
}
.coupon-popup{
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
	.coupon-radio{
		padding: 30rpx;
		font-size: 26rpx;
		color: #999999;
		margin: 90rpx 0;
		
		.radio-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			radio{
				transform:scale(0.7);
			}
		}
		.sub-title{
			margin-bottom: 20rpx;
			color: #333333;
		}
		.cou-title{
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
			margin: 20rpx 0;
		}
		
	}
	.comfirm-btn{
		width: 600rpx;
		margin: 0rpx auto;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		background-color: #651FFF;
		color: #ffffff;
		text-align: center;
		position: fixed;
		bottom: 20rpx;
		left: 0;
		right: 0;
	}
}

</style>
