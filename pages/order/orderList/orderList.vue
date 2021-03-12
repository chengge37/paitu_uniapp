<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item1, index1) in navList1" :key="index1" class="nav-item1" :class="{current: tabCurrentIndex1 === index1}"
			 @click="tabClick1(index1)">
				{{item1.text}}
			</view>
		</view>
		<view class="navbar">
			<view  v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === item.index}"
			 @click="tabClick(item.index)">
				{{item.text}}
			</view>
			<view class="seemoreStatus" @click="toUnfold">
				<span class="iconfont iconxiajiantou" v-if="!unfold"></span>
				<span class="iconfont iconshangjiantou" v-else></span>
			</view>
		</view>
		<view class="moreNavbar" v-if="unfold">
			<div class="status-item" v-if="!(tabCurrentIndex1==1&&item.index==7)" :class="tabCurrentIndex === item.index?'active':''" v-for="(item,index) in moreNavList" :key="index" @click="tabClick(item.index)">{{item.text}}</div>
		</view>
		<div class="orderList" v-if="orderList.length>0">
			<view v-for="(item,index) in orderList" :key="index" class="order-item">
				<view class="i-top b-b">
					<p class="shop_name">
						<span class="iconfont icondianpu"></span>
						<span v-if="tabCurrentIndex1==2||tabCurrentIndex1==0">{{item.user.nick}}</span>
						<!-- 活动 -->
						<!-- <span v-else-if="tabCurrentIndex1==1">{{item.activity.user.nick}}</span> -->
						<span v-else-if="tabCurrentIndex1==1||tabCurrentIndex1==3">{{item.to_user.nick}}</span>
					</p>
					<text class="state" v-if="item.pay_status=='1'">待付款</text>
					<text class="state" v-else-if="item.pay_status=='2'">已付款，待商家确认</text>
					<text class="state" v-else-if="item.pay_status=='3'">已接单</text>
					<text class="state" v-else-if="item.pay_status=='4'">退款中</text>
					<text class="state" v-else-if="item.pay_status=='5'">已退款</text>
					<text class="state" v-else-if="item.pay_status=='6'">订单进行中</text>
					<text class="state" v-else-if="item.pay_status=='7'">待评价</text>
					<text class="state" v-else-if="item.pay_status=='8'">已完成</text>
					<text class="state" v-else-if="item.pay_status=='0'">已关闭</text>
				</view>

				<view class="date-time">
					<text class="state">{{item.create_time_str}}</text>
				</view>
				<!-- 商品订单 -->
				<view v-if="tabCurrentIndex1==0">
					<view class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.goodsList" @click="gotoDetail(item.id,0)"
					 :key="goodsIndex">
						<image class="goods-img" :src="goodsItem.img?host+goodsItem.img:host+defaultEquipPic" mode="aspectFill" @error="imgError(goodsItem)"></image>
						<view class="center">
							<text class="title clamp">{{goodsItem.studio_detail?goodsItem.studio_detail.name:goodsItem.equip.custom_desc}}</text>
							<view class="attr">
								<text class="attr-box" v-if="item.rent_type==2">{{item.start_time}}-{{item.end_time}}</text>
								<text class="attr-box" v-else>{{item.rent_time_range}}</text>
							</view>
							<view class="attr">
								<text class="attr-box" v-if="item.rent_type==2">共{{item.days}}天</text>
								<text class="attr-box" v-else>共{{item.days}}小时</text>
							</view>
						</view>
						<view class="right">
							<text class="price">￥{{goodsItem.price}}</text>
							<text class="num">x{{goodsItem.count}}</text>
						</view>
					</view>
				</view>
				<!-- 活动订单 -->
				<!-- <view v-if="tabCurrentIndex1==1" class="goods-box-single" @click="gotoDetail(item.id,1)">
					<image class="goods-img" :src="item.pic?host+item.pic:host+defaultEquipPic" mode="aspectFill"></image>
					<view class="center">
						<text class="title clamp">{{item.activity.name}}</text>
						<view class="attr">
							<text class="attr-box">{{item.activity.start_time}}-{{item.activity.end_time}}</text>
						</view>
						<view class="attr">
						</view>
					</view>
					<view class="right">
						<text class="price">￥{{item.price}}</text>
					</view>
				</view> -->
				<!-- 模特订单 -->
				<view v-if="tabCurrentIndex1==1" class="goods-box-single" @click="gotoDetail(item.id,2)">
					<image class="goods-img" :src="item.pic?host+item.pic:host+defaultEquipPic" mode="aspectFill"></image>
					<view class="center">
						<text class="title clamp" v-text="item.title?item.title:'未命名标题'"></text>
						<view class="attr">
							<text class="attr-box">{{item.start_time}}-{{item.end_time}}</text>
						</view>
						<view class="attr">
							<!-- <text class="attr-box">共{{item.days}}天</text> -->
						</view>
					</view>
					<view class="right">
						<text class="price">￥{{item.price}}</text>
					</view>
				</view>

				<!-- 服务订单 -->
				<view v-if="tabCurrentIndex1==2" class="goods-box-single" @click="gotoDetail(item.id,3)">
					<image class="goods-img" :src="item.service_pic?host+item.service_pic:host+defaultEquipPic" mode="aspectFill"></image>
					<view class="center">
						<text class="title clamp" v-text="item.norms_name?item.norms_name:'未命名标题'"></text>
						<view class="attr">
							<!-- <text class="attr-box">{{item.start_time}}-{{item.end_time}}</text> -->
						</view>
						<view class="attr">
							<!-- <text class="attr-box">共{{item.days}}天</text> -->
						</view>
					</view>
					<view class="right">
						<text class="price">￥{{item.norms_price}}</text>
					</view>
				</view>
				<!-- 拼拍订单 -->
				<view v-if="tabCurrentIndex1==3" class="goods-box-single" @click="gotoDetail(item.id,4)">
					<image class="goods-img" :src="host+util.picExplode(item.photo)" mode="aspectFill"></image>
					<view class="center">
						<text class="title clamp" v-text="item.title?item.title:'未命名标题'"></text>
						<view class="attr">
							<!-- <text class="attr-box">{{item.start_time}}-{{item.end_time}}</text> -->
						</view>
						<view class="attr">
							<!-- <text class="attr-box">共{{item.days}}天</text> -->
						</view>
					</view>
					<view class="right">
						<text class="price">￥{{item.price}}</text>
					</view>
				</view>

				<view class="price-box price-box1">
					<p class="left check" v-if="(item.pay_status=='3'||item.pay_status=='6')&&tabCurrentIndex1==0">
						<span v-if="item.check&&item.check.status=='0'">核验单待核验</span>
						<span v-else-if="item.check&&item.check.status=='1'">核验单已同意</span>
						<span v-else-if="item.check&&item.check.status=='2'">核验单已拒绝</span>
						<span v-else>核验单待上传</span>
					</p>
					<p v-else>   </p>
					<div>
						<span class="left" v-if="tabCurrentIndex1==0">共{{item.goodsList.length}}件商品</span>
						<!-- 活动 -->
						<!-- <span class="left" v-else-if="tabCurrentIndex1==1">共{{item.person_nums}}人参加</span> -->
						<span class="right price" v-if="tabCurrentIndex1!=2">合计：{{item.price}}</span>
						<span class="right price" v-else>合计：{{item.total_price}}</span>
					</div>
					
				</view>

				<view class="price-box price-box2">
					<view class="action-box b-t" v-if="item.pay_status=='1'">
						<button class="action-btn" @click="cancelOrder(item.id)">取消订单</button>
						<!--#ifdef MP-WEIXIN || MP-ALIPAY -->
						<button class="action-btn recom" @click="miniAppPay(item)">去支付</button>

						<!--#endif -->
						<!--#ifdef H5 || APP-PLUS -->
						<!-- 如果不是微信小程序 先选支付方式 -->
						<button class="action-btn recom" @click="selectPayWay(item)">去支付</button>
						<!--#endif -->

					</view>
					<!-- <view class="action-box b-t" v-if="item.pay_status=='2'">
						<button class="action-btn">查看物流</button>
						<button class="action-btn recom">确认收货</button>
					</view> -->
					<view class="action-box b-t" v-if="item.pay_status=='7'">
						<button class="action-btn" @click="gotoGoodsDetail(item.id)">再来一单</button>
						<button class="action-btn recom" @click="gotoEval(item)">去评价</button>
					</view>
					<view class="action-box b-t" v-if="item.pay_status=='8'">
						<text class="close">订单已完成</text>
					</view>
				</view>
			</view>

			<!-- <uni-load-more :status="loadingType"></uni-load-more> -->
		</div>

		<empty-show type='order' v-if="orderList.length==0&&loadingType!='loading'"></empty-show>
		<div ref="alipay"></div>
		<min-action-sheet ref="popupRef"></min-action-sheet>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-ui/uni-load-more/uni-load-more'
	import minActionSheet from '@/components/min-action-sheet/min-action-sheet'

	import {
		order,
		activity,
		coupon,
		model,
		service,
		groupBook
	} from '@/common/api/api'
	import {
		Format
	} from '@/common/utils/formatDate.js'
	import {
		dayCount
	} from '@/common/utils/util.js';
	import {
		defaultEquipPic
	} from '@/common/utils/config';
	export default {
		components: {
			uniLoadMore,
			minActionSheet
		},
		data() {
			return {
				payWay: [{
						name: '支付宝'
					},
					{
						name: '微信'
					}
				],
				defaultEquipPic: defaultEquipPic,
				host: 'https://pic.paitume.com/',
				tabCurrentIndex: 0,
				tabCurrentIndex1: 0,
				unfold:false,//状态展开收起
				navList: [
					{text: '全部',state: '',index:0},
					{text: '未支付',state: 1,index:1},
					{text: '已支付',state: 2,index:2},
					{text: '已接单',state: 3,index:3},
					
				],
				moreNavList: [
					{text: '待评论',state: 7,index:4},
					{text: '退款中',state: 4,index:5},
					{text: '已退款',state: 5,index:6},
					{text: '进行中',state: 6,index:7},
					{text: '已评论',state: 8,index:8}
				],
				orderList: [],
				params: {
					page: 1,
					page_size: 10,
				},
				loadingType: 'more',
				navList1: [{
						text: '商品订单',
						type: 0
					},
					// {
					// 	text: '活动订单',
					// 	type: 1
					// },
					{
						text: '模特订单',
						type: 2
					},
					{
						text: '服务订单',
						type: 3
					},
					{
						text: '拼拍订单',
						type: 4
					},
					// {
					// 	text: '服务订单',
					// 	type: 4
					// },
				],
				payItem: null,
				use_coupon:[]
			}
		},
		onLoad(options) {
			this.tabCurrentIndex = +options.state;
			 if (this.tabCurrentIndex == 0) {
				delete this.params.pay_status
			} else if(this.tabCurrentIndex == 4) {
				this.params.pay_status = 7;
				this.unfold = true;
			}else {
				let navItem = this.navList[this.tabCurrentIndex];
				this.params.pay_status = navItem.state;
			}
		},
		onShow() {
			this.params.page = 1;
			this.orderList = [];
			this.initData()
		},
		methods: {
			// imgError(data){
			// 	data.img = defaultEquipPic
			// },
			toUnfold(){
				this.unfold = !this.unfold;
			},
			closePay() {
				this.$refs.popupRef.close();
			},
			
			initData(){
				if (this.tabCurrentIndex1==1) {
					// this.getAcivityOrders()
					this.getModelOrders();
				} else if (this.tabCurrentIndex1==0){
					this.getOrderList();
				}else if (this.tabCurrentIndex1==2){
					this.getServiceOrders()
				}else if (this.tabCurrentIndex1==3){
					this.getGBookOrder();
				}
			},
			getOrderList() {
				this.loadingType = 'loading';
				this.$http.get(order.getOrders, this.params).then(res => {
					console.log('res', res);
					if (this.orderList.length > 0) {
						this.orderList = this.orderList.concat(res.rows);
					} else {
						this.orderList = res.rows;
					}

					this.orderList.forEach(item => {
						item.create_time_str = Format.formatDateNoSecond(item.create_time * 1000);
						if(item.rent_type==2){
							item.end_time = item.end_time.split(' ')[0];
							item.start_time = item.start_time.split(' ')[0];
							item.days = dayCount(item.start_time, item.end_time)
						}else{
							item.rent_time_range = item.start_time + '~' +item.end_time.split(' ')[1]
							item.days = this.util.calHours(item.start_time.replace(/-/,'/'),item.end_time.replace(/-/,'/'));
						}
						
						//将订单影棚或器材都处理成同样的数据格式，放进goodslist
						item.goodsList = [];
						if (item.studio_order) {
							item.goodsList.push(item.studio_order);

							//影棚订单有设备
							if (item.studio_order.equip_order_array && item.studio_order.equip_order_array.length > 0) {
								item.goodsList = item.goodsList.concat(item.studio_order.equip_order_array);
							}
							item.goodsList.forEach(v => {
								if (v.studio_detail && v.studio_detail.pic) {
									v.img = v.studio_detail.pic.split(',').filter(v=>{return v})[0];
									// 如果是影棚，商品数量就是1
									v.count = 1;
								} else {
									if (v.equip.pic) {
										v.img = v.equip.pic.split(',').filter(v=>{return v})[0]
									} else if (v.equip.static && v.equip.static.pic) {
										v.img = v.equip.static.pic.split(',').filter(v=>{return v})[0]
									}

									// 设备商品数量
									v.count = v.order_count;
								}

							})
							console.log('item.studio_order', item.studio_order)
						} else {
							item.goodsList = item.equip_order;
							item.goodsList.forEach(v => {
								v.img = v.equip.pic.split(',').filter(v=>{return v})[0]
								v.count = v.order_count;
							})
							console.log('item.equip_order', item.equip_order)
						}
						
					})
					this.loadingType = 'more';
				}).catch(err => {
					this.loadingType = 'more';
				})
			},
			getAcivityOrders() {
				this.loadingType = 'loading';
				this.$http.get(activity.getOrder, this.params).then(res => {
					if (this.orderList.length > 0) {
						this.orderList = this.orderList.concat(res.rows);
					} else {
						this.orderList = res.rows;
					}
					this.orderList.forEach(item => {
						item.create_time_str = Format.formatDateNoSecond(item.create_time * 1000);
						item.activity.end_time = item.activity.end_time.split(' ')[0];
						item.activity.start_time = item.activity.start_time.split(' ')[0];
					})
					this.loadingType = 'more';
				}).catch(err => {
					this.loadingType = 'more';
				})
			},
			getModelOrders(){
				this.$http.get(model.getOrderList,this.params).then(res => {
					if (this.orderList.length > 0) {
						this.orderList = this.orderList.concat(res.rows);
					} else {
						this.orderList = res.rows;
					}
					this.orderList.forEach(item => {
						item.create_time_str = Format.formatDateNoSecond(item.create_time * 1000);
					})
				}).catch(err=> {})
			},
			getServiceOrders(){
				this.$http.get(service.getOrders,this.params).then(res => {
					if (this.orderList.length > 0) {
						this.orderList = this.orderList.concat(res.rows);
					} else {
						this.orderList = res.rows;
					}
					this.orderList.forEach(item => {
						item.create_time_str = Format.formatDateNoSecond(item.create_time * 1000);
					})
				})
			},
			getGBookOrder(){
				this.$http.get(groupBook.getOrder,this.params).then(res => {
					if (this.orderList.length > 0) {
						this.orderList = this.orderList.concat(res.rows);
					} else {
						this.orderList = res.rows;
					}
					this.orderList.forEach(item => {
						item.create_time_str = Format.formatDateNoSecond(item.create_time * 1000);
					})
				})
			},
			gotoDetail(data, type) {
				uni.navigateTo({
					url: '/pages/order/orderDetail?id=' + data + '&type=' + type
				})
			},

			//顶部tab点击
			tabClick(index) {
				console.log('index====',index);
				let ret = this.navList.findIndex(e=>e.index==index);
				let ret1 = this.moreNavList.findIndex(e=>e.index==index);
				this.orderList = [];
				this.params.page = 1;
				this.tabCurrentIndex = index;
				
				if (this.tabCurrentIndex) {
					if(ret!=-1){
						console.log('ret---------',ret)
						let navItem = this.navList[ret];
						this.params.pay_status = navItem.state;
					}else if(ret1!=-1){
						let navItem = this.moreNavList[ret1];
						console.log('ret1---------',ret1)
						this.params.pay_status = navItem.state;
						console.log('navItem---------',navItem)
					}
					
				} else {
					delete this.params.pay_status
				}
				this.initData()


			},
			
			tabClick1(index) {
				console.log(index)
				this.orderList = [];
				this.params.page = 1;
				this.tabCurrentIndex1 = index;
				this.initData()
			},
			//删除订单
			deleteOrder(index) {
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(() => {
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			//取消订单
			cancelOrder(data) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确认取消订单？',
					success: function(res) {
						if (res.confirm) {
							// that.$http.post(order.cancelOrder, {
							// 	order_id: data
							// }).then(res => {
							// 	that.orderList = [];
							// 	that.getOrderList();
							// })
							if(that.tabCurrentIndex1==0){
								that.confirmCancel(data)
							}else if(that.tabCurrentIndex1==1){
								that.cancelModel(data);
							}else if(that.tabCurrentIndex1==2){
								that.cancelService(data);
							}else if(that.tabCurrentIndex1==3){
								that.cancelPinpai(data);
							}
							
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			},
			// 取消使用优惠券
			async confirmCancel(id){
				let api = '';
				let param = {};
				if(!this.tabCurrentIndex1){
					// 商品订单
					api = order.cancelOrder
					param = {order_id:id}
				}else{
					// 活动订单
					api = activity.cancelOrder;
					param = {id:id}
				}
				let use_coupons = await this.getOrderCoupon(id)
				for (const item of use_coupons) {
					await this.cancelCoupon(id,item.id);
				}
				this.$http.post(api,param).then(res=>{
					uni.showToast({title: '取消成功！',icon: 'success',duration:1000});
					this.orderList = [];
					this.params.page = 1;
					if(!this.tabCurrentIndex1){
						this.getOrderList();
					}else{
						this.getAcivityOrders()
					}
					
				})
			},
			cancelCoupon(order_id,data){
				return new Promise((resolve,reject) => {
					this.$http.get(coupon.cancelUse,{order_id:order_id,id:data}).then(res=>{
						resolve(res)
					})
					.catch(err=> {
						reject(err)
					})
				})
			},
			cancelService(id){
				this.$http.get(service.cancelOrder,{order_id:id}).then(res => {
					uni.showToast({title: '取消成功！',icon: 'success',duration:1000});
					this.orderList = [];
					this.params.page = 1;
					this.getServiceOrders()
				}).catch(err => {})
			},
			cancelModel(id){
				this.$http.get(model.cancelOrder,{order_id:id}).then(res => {
					uni.showToast({title: '取消成功！',icon: 'success',duration:1000});
					this.orderList = [];
					this.params.page = 1;
					this.getModelOrders()
				}).catch(err => {})
			},
			cancelPinpai(id){
				this.$http.get(groupBook.cancelOrder,{order_id:id}).then(res => {
					uni.showToast({title: '取消成功！',icon: 'success',duration:1000});
					this.orderList = [];
					this.params.page = 1;
					this.getGBookOrder()
				}).catch(err => {})
			},
			getOrderCoupon(id){
				return new Promise((resolve,reject) => {
					this.$http.get(order.getOrderCart,{order_id:id}).then(res => {
						let use_coupon = res.price&&res.price.coupon_array?res.price.coupon_array:[];
						resolve(use_coupon)
					})
				})
			},
			gotoEval(data) {
				uni.setStorage({
					key: 'evalOrder',
					data: data
				});
				uni.navigateTo({
					url: '/pages/order/orderList/evaluate/evaluate'
				})
			},
			addPage() {
				this.params.page++;
				this.getOrderList()
			},
			selectPayWay(item) {
				this.payItem = item;
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
						let payApi = '';
						if(this.tabCurrentIndex1==0){
							payApi = '/order/userPay'
						}else if(this.tabCurrentIndex1==1){
							payApi = ''
						}else if(this.tabCurrentIndex1==2){
							payApi = service.pay
						}else if(this.tabCurrentIndex1==3){
							payApi = groupBook.pay
						}
						console.log('payApi----',payApi)
						let _this = this;
						this.$http.post(payApi, payData).then(res => {
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
									document.forms["alipay_submit"].submit();
								}
							//#endif
						}).catch(err => {
							console.log('userPay error', err);
						});
					}
				})
			},
			miniAppPay(data) {
				//小程序支付
				// uni.getProvider({
				// 	service: 'payment',
				// 	success: function(res) {
				// 		console.log('手机支持啥支付' + JSON.stringify(res));
				// 	}
				// });
				console.log(data.id)
				// #ifdef MP-WEIXIN
					this.wxMiniAppPay(data);
				// #endif
				// #ifdef MP-ALIPAY
					this.aliMiniAppPay(data);
				// #endif
			},
			wxMiniAppPay(data){
				let _this = this;
				let payData = {
					'order_id': data.id,
					'total_price': data.price,
					'pay_way': 1,
					'call_way': 'mp-weixin'
				};
				let payApi = '';
				if(this.tabCurrentIndex1==0){
					payApi = '/order/userPay'
				}else if(this.tabCurrentIndex1==1){
					payApi = ''
				}else if(this.tabCurrentIndex1==2){
					payApi = service.pay
				}else if(this.tabCurrentIndex1==3){
					payApi = groupBook.pay
				}
				this.$http.post(payApi, payData).then(res => {
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
								_this.params.pay_status = 2;
								if (_this.tabCurrentIndex1) {
									_this.getAcivityOrders()
								} else {
									_this.getOrderList();
								}
							}, 2000);
						},
						fail: function(res) {
							let err_msg = ''
							if (res.errMsg == 'requestPayment:fail cancel') {
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
			aliMiniAppPay(data){
				let _this = this;
				let payData = {
					'order_id': data.id,
					'total_price': data.price,
					'pay_way': 2,
					'call_way': 'mp-alipay'
				};
				let payApi = '';
				if(this.tabCurrentIndex1==0){
					payApi = '/order/userPay'
				}else if(this.tabCurrentIndex1==1){
					payApi = ''
				}else if(this.tabCurrentIndex1==2){
					payApi = service.pay
				}else if(this.tabCurrentIndex1==3){
					payApi = groupBook.pay
				}
				this.$http.post(payApi, payData).then(res => {
					console.log('小程序userPay succ', res);
					uni.requestPayment({
						provider: "alipay",
						orderInfo: res.trade_no,
						success: function(res) {
							console.log('请求支付成功,不一定是支付成功',res);
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
									_this.params.pay_status = 2;
									if (_this.tabCurrentIndex1) {
										_this.getAcivityOrders()
									} else {
										_this.getOrderList();
									}
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
								content: "支付失败,原因为: " + err_msg,
								showCancel: false
							})
							console.log('fail:' + JSON.stringify(res));
						}
					});
				}).catch(err => {
					console.log('小程序userPay error', err);
				});
			}
		},
		onReachBottom: function() {
			this.params.page++;
			if(this.tabCurrentIndex1==0){
				this.getOrderList()
			}else if(this.tabCurrentIndex1==1){
				// this.getAcivityOrders()
				this.getModelOrders()
			}else if(this.tabCurrentIndex1==2){
				this.getServiceOrders()
				
			}
			
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: #f8f8f8;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar,.moreNavbar {
		display: flex;
		height: 50px;
		padding: 0 10rpx;
		background: #fff;
		position: relative;
		z-index: 10;
		border-bottom: 1rpx solid #f8f8f8;

		.nav-item,
		.nav-item1,
		.status-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;

			color: #666666;
			position: relative;


		}
		.nav-item {
			font-size: 15px;

			&.current {

				color: #000;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 4rpx solid #651FFF;
				}
			}
		}

		.nav-item1 {
			font-size: 14px;

			&.current {

				color: #000;

				&:after {
					content: '';
					position: absolute;
					left: 40%;
					bottom: 0;
					transform: translateX(-50%);
					width: 24px;
					height: 0;
					border-bottom: 4rpx solid #651FFF;
				}
			}
		}
		.status-item{
			font-size: 24rpx;
		}
		.active{
			color: #651FFF;
		}
		.seemoreStatus{
			margin: 30rpx 0;
			height: 40rpx;
			line-height: 40rpx;
			padding: 0rpx 20rpx;
			border-left: 1rpx solid #d9d9d9;

		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30rpx;
		background: rgb(255, 255, 255);
		// box-shadow: 0px 0px 15px 0px rgba(4, 0, 0, 0.1);
		margin-top: 16rpx;
		margin: 20rpx 30rpx;
		border-radius: 8rpx;

		.i-top {
			display: flex;
			align-items: center;
			height: 50rpx;
			padding-right: 30rpx;
			font-size: 30rpx;
			color: #666666;
			position: relative;
			padding-top: 20rpx;

			.shopIcon {
				color: #666666;
			}

			.shop_name {
				flex: 1;

				// margin-left: 8rpx;
				.iconfont {
					margin-right: 10rpx;
				}
			}

			.state {
				color: #651FFF;
				font-size: 26rpx;
			}

			.del-btn {
				padding: 10rpx 0 10rpx 36rpx;
				// font-size: 28rpx;
				// color: #adadad;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30rpx;
					border-left: 1px solid #f7bcc8;
					position: absolute;
					left: 20rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		.date-time {
			font-size: 24rpx;
			margin-left: 40rpx;
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20rpx 0;
			font-size: 28rpx;

			.goods-img {
				display: block;
				width: 168rpx;
				height: 168rpx;
			}

			.center {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 0rpx 0 15rpx;
				overflow: hidden;

				.title {
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}

				.attr {
					display: flex;
					justify-content: space-between;
					font-size: 24rpx;
					padding: 20rpx 0 0;
					color: #999999;

					.style {
						color: #333333;

						&:before {
							content: '';
						}
					}
				}

			}

			.right {
				font-size: 28rpx;
				padding-right: 30rpx;
				display: flex;
				flex-direction: column;
				// align-items: center;
				text-align: right;

				text {
					line-height: 40rpx;
					display: block;
				}

				.price {
					color: #333333;
				}

				.num {
					color: #999999;
				}
			}
		}
		.price-box1{
			justify-content: space-between;
		}
		.price-box2{
			justify-content: flex-end;
		}
		.price-box {
			display: flex;
			align-items: baseline;
			padding: 0 0 20rpx;
			font-size: 28rpx;
			.left {
				font-size: 26rpx;
				color: #333333;
			}
			.check{
				color: #FF5700
			}
			.right {

				color: #333333;
				margin: 0 30rpx;
			}

			.price-left {
				color: #666666;
			}

			.price {
				font-size: 26rpx;
				color: #333333;
				font-weight: bold;

				&:before {
					content: '￥';
					// font-size: $font-sm;
					margin: 0 2rpx 0 8rpx;
				}
			}

			.close {
				color: #b4b4b4;
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100rpx;
			position: relative;
			padding-right: 30rpx;
		}

		.action-btn {
			width: 160rpx;
			height: 60rpx;
			margin: 0;
			margin-left: 24rpx;
			padding: 0;
			text-align: center;
			line-height: 60rpx;
			font-size: 28rpx;
			color: #909399;
			background: #fff;
			border-radius: 8rpx;

			&:after {
				border-radius: 0px;
			}

			&.recom {
				background: #651FFF;
				color: #fff;

				&:after {
					border-color: #651FFF;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80rpx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28rpx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
