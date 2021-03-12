<template>
	<view class="overflow">
		<status-background :status="status"></status-background>
		<!-- 商品订单 -->
		<view v-if="type==0">
			<!-- <div v-if="order_type == 'equip'"> -->
			<div>
				<view class="pick-way"  v-if="order_type == 'equip'">
					<!-- <div class="way" :class="item.active?'active':''" v-for="(item,index) in tabs" :key="index" @click="tabChangeClick(index)">{{item.name}} -->
					<div class="way" :class="{'active':tabIndex==index}" v-for="(item,index) in tabs" :key="index" @click="tabChangeClick(index)">{{item.name}}
						<div class="border"></div>
					</div>
				</view>
				<view class="address">
					<div class="left">
						<span class="iconfont icondizhi adr-icon"></span>
					</div>
					<div class="right" v-if="tabIndex==1">
						<div class="detail">
							<span v-if="defaultAddress">{{defaultAddress.address}}</span>
							<span v-else @click="gotoMyAddress">暂无地址，去添加？>></span>
						</div>
						<div class="name" v-if="defaultAddress">
							<span>{{defaultAddress.name}}</span><span class="tel">{{defaultAddress.mobile}}</span>
							<div class="operate">
								<picker @change="changeAddress" :value="addressId" :range="addressList" range-key="address">
									<span class='btn'>选择地址</span>
								</picker>
								<span class='btn' @click="gotoMyAddress">添加地址</span>
							</div>
						</div>
					</div>
					<div class="right" v-else>
						<div class="detail">{{orderInfo.to_user.address}}</div>
						<div class="name">
							<span>{{orderInfo.to_user.nick}}</span><span class="tel">{{orderInfo.to_user.mobile}}</span>
						</div>
					</div>
				</view>
			</div>
			<view class="order-item">
				<view class="i-top b-b">
					<span class="icondianpu iconfont"></span>
					<text class="shop_name" v-if="orderInfo.to_user&&orderInfo.to_user.nick">{{orderInfo.to_user.nick}}</text>
				</view>
				<view class="date-time">
					<text class="state">{{orderInfo.create_time_str}}</text>
				</view>
				<view class="goods-box-single" v-for="(item,index) in orderInfo.goodsList" :key="index">
					<image class="goods-img" :src="host+item.img" mode="aspectFill"></image>
					<view class="center">
							<text class="title clamp">{{item.name}}</text>
							<view class="attr">
								<text class="attr-box" v-if="orderInfo.rent_type==2">{{orderInfo.start_time}} - {{orderInfo.end_time}}</text>
								<text class="attr-box" v-else>{{orderInfo.rent_time_range}}</text>
							</view>
							<view class="attr">
								<text class="attr-box" v-if="orderInfo.rent_type==2">共{{orderInfo.days}}天</text>
								<text class="attr-box" v-else>共{{orderInfo.days}}小时</text>
							</view>
						</view>
						<view class="right">
							<text class="price">￥{{item.price}}</text>
							<text class="num">x{{item.order_count}}</text>
						</view>
				</view>
				<!--  -->
				<view class="check-box" v-if="orderInfo.pay_status=='2'||orderInfo.pay_status=='3'||orderInfo.pay_status=='6'||orderInfo.pay_status=='7'">
					<p class="left">
						核验单：
						<span v-if="orderCheck.chk_status_str">{{orderCheck.chk_status_str}}</span>
						<span v-else>待上传</span>
					</p>
					<p class="right" @click="gotoRefund">退款</p>
				</view>
				<view class="before-price-box">
					<p class="left">租金金额</p>
					<p class="right">
						<span class="price">{{total_price}}</span>
					</p>
				</view>
				<view class="discount-box" v-for="item in use_coupon" :key="item.id">
					<p class="left">
						<span v-if="item.to_uid!='0'&&item.coupon_type=='1'">店铺满减</span>
						<span v-else-if="item.to_uid!='0'&&item.coupon_type=='2'">折扣优惠</span>
						<span v-else-if="item.to_uid=='0'&&item.coupon_type=='1'">平台满减</span>
						<span v-else-if="item.to_uid=='0'&&item.coupon_type=='2'">平台折扣</span>
					</p>
					<p class="right">
						<span :class="item.coupon_type!='2'?'price1':'discount'">{{item.money}}</span>
					</p>
				</view>
				<view class="price-box">
					<p class="left">实付款</p>
					<p class="right">
						<span class="price">{{orderInfo.price}}</span>
					</p>
				</view>
			</view>
		</view>

		<!-- 活动订单 -->
		<view v-if="type==1">
			<div class="username">
				<span>{{orderInfo.contact_name}}</span><span class="tel">{{orderInfo.contact_mobile}}</span>
			</div>
			<view class="order-item">
				<view class="i-top b-b">
					<span class="icondianpu iconfont"></span>
					<text class="shop_name" v-if="orderInfo.activity&&orderInfo.activity.user&&orderInfo.activity.user.nick">{{orderInfo.activity.user.nick}}</text>
				</view>
				<view class="date-time">
					<text class="state">{{orderInfo.create_time_str}}</text>
				</view>
				<view class="goods-box-single">
					<image class="goods-img" :src="host+orderInfo.pic" mode="aspectFill"></image>
					<view class="center">
						<text class="title clamp">{{orderInfo.activity.name}}</text>
						<view class="attr">
							<text class="attr-box" v-if="orderInfo.activity">活动时间：{{orderInfo.activity.start_time}}-{{orderInfo.activity.end_time}}</text>
						</view>
						<view class="attr">
							<text class="attr-box" v-if="orderInfo.activity">地    址：{{orderInfo.activity.address}}</text>
						</view>
						
					</view>
				</view>
				<view class="attr1">
					<text class="attr-box">{{orderInfo.activity.fee}}元/人</text>
					<text class="attr-box">共{{orderInfo.person_nums}}人</text>
				</view>
				<view class="price-box">
					<p class="left">实付款</p>
					<p class="right">
						<span class="price">{{orderInfo.price}}</span>
					</p>
				</view>
			</view>
		</view>
		
		<!-- 模特订单 -->
		<view v-if="type==2">
			<div class="username" v-if="shop_user&&shop_user.nick">
				<span>{{shop_user.nick}}</span><span class="tel">{{shop_user.mobile}}</span>
			</div>
			<view class="order-item">
				<view class="i-top b-b">
					<span class="icondianpu iconfont"></span>
					<text class="shop_name" v-if="shop_user&&shop_user.nick">{{shop_user.nick}}</text>
				</view>
				<view class="date-time">
					<text class="state">{{orderInfo.create_time_str}}</text>
				</view>
				<view class="goods-box-single">
					<image class="goods-img" :src="host+util.picExplode(orderInfo.photo)" mode="aspectFill"></image>
					<view class="center">
						<text class="title clamp">{{orderInfo.title}}</text>
						<view class="attr">
							<text class="attr-box">预约时间：{{orderInfo.start_time}}-{{orderInfo.end_time}}</text>
						</view>
						<view class="attr">
							<p class="attr-box">备    注：
								<span v-if="orderInfo.remark">{{orderInfo.remark}}</span>
								<span v-else>无</span>
							</p>
						</view>
						
					</view>
				</view>
				<view class="price-box">
					<p class="left">实付款</p>
					<p class="right">
						<span class="price">{{orderInfo.price}}</span>
					</p>
				</view>
			</view>
		</view>

		<!-- 服务订单 -->
		<view v-if="type==3">
			<div class="username"  v-if="shop_user&&shop_user.nick">
				<span>{{shop_user.nick}}</span><span class="tel">{{shop_user.mobile}}</span>
			</div>
			<view class="order-item">
				<view class="i-top b-b">
					<span class="icondianpu iconfont"></span>
					<text class="shop_name" v-if="shop_user&&shop_user.nick">{{shop_user.nick}}</text>
				</view>
				<view class="date-time">
					<text class="state">{{orderInfo.create_time_str}}</text>
				</view>
				<view class="goods-box-single">
					<image class="goods-img" :src="host+util.picExplode(orderInfo.norms_pic)" mode="aspectFill"></image>
					<view class="center">
						<text class="title clamp">{{orderInfo.service_title}}</text>
						<view class="attr">
							<text class="attr-box">选择项目：{{orderInfo.norms_name}}</text>
						</view>
						<view class="attr">
							<p class="attr-box">描   述：{{orderInfo.norms_content}}
							</p>
						</view>
						
					</view>
					<view class="right">
						<text class="price">￥{{orderInfo.norms_price}}</text>
						<text class="num">x{{orderInfo.count}}</text>
					</view>
				</view>
				<view class="price-box">
					<p class="left">实付款</p>
					<p class="right">
						<span class="price">{{orderInfo.total_price}}</span>
					</p>
				</view>
			</view>
		</view>

		<!-- 拼拍订单 -->
		<view v-if="type==4">
			<div class="username"  v-if="shop_user&&shop_user.nick">
				<span>{{shop_user.nick}}</span><span class="tel">{{shop_user.mobile}}</span>
			</div>
			<view class="order-item">
				<view class="i-top b-b">
					<span class="icondianpu iconfont"></span>
					<text class="shop_name" v-if="shop_user&&shop_user.nick">{{shop_user.nick}}</text>
				</view>
				<view class="date-time">
					<text class="state">{{orderInfo.create_time_str}}</text>
				</view>
				<view class="goods-box-single">
					<image class="goods-img" :src="host+util.picExplode(orderInfo.photo)" mode="aspectFill"></image>
					<view class="center">
						<text class="title clamp">{{orderInfo.title}}</text>
						<view class="attr">
							<text class="attr-box">成团时间：{{orderInfo.team_receipt}}</text>
						</view>
						<view class="attr">
							<p class="attr-box">备    注：
								<span v-if="orderInfo.remark">{{orderInfo.remark}}</span>
								<span v-else>无</span>
							</p>
						</view>
						
					</view>
				</view>
				<view class="price-box">
					<p class="left">实付款</p>
					<p class="right">
						<span class="price">{{orderInfo.price}}</span>
					</p>
				</view>
			</view>
			
		</view>

		<view class="order-info" >
			<p v-if="type==1">举办方：{{orderInfo.activity.user.nick}}</p>
			<p v-if="type==1">举办电话：{{orderInfo.activity.user.mobile}}</p>
			<p class="order-id">订单号：{{orderInfo.show_id}}</p>
			<p class="create-time">创建时间：{{orderInfo.create_time_str}}</p>

			<view class="contact">
				<div class="item" @click="contactUs(1)">
					<span class="iconfont iconkefu"></span>
					<span class="name">联系客服</span>
				</div>
				<div class="border"></div>
				<div class="item" @click="contactUs(1)">
					<span class="iconfont icondianhua"></span>
					<span class="name">拨打电话</span>
				</div>
			</view>
		</view>

		<div ref="alipay"></div> 
		<min-action-sheet ref="popupRef"></min-action-sheet>
		<view class="bottom" v-if="show_bottom">
			<div class="gray btn" @click="cancelOrder" v-if="orderInfo.pay_status==1">取消订单</div>
			<!--#ifdef MP-WEIXIN -->
			<div class="red btn" @click="wxAppPay()" v-if="orderInfo.pay_status==1">去付款</div>
			<!--#endif -->
			<!--#ifdef MP-ALIPAY -->
			<div class="red btn" @click="aliAppPay()" v-if="orderInfo.pay_status==1">去付款</div>
			<!--#endif -->
			<!--#ifdef APP-PLUS || H5 -->
			<div class="red btn" @click="h5AppPay()" v-if="orderInfo.pay_status==1">去付款</div>
			<!--#endif -->
			<div class="red btn" @click="backToHome" v-if="orderInfo.pay_status==2">返回首页</div>

			<div class="purple btn" @click="gotoCheckDetail" v-if="(orderInfo.pay_status==3||orderInfo.pay_status==6)&&orderCheck&&orderCheck.status">核验清单</div>
			<!-- <div class="purple btn" @click="comfirmCheck" v-if="orderCheck.id&&orderCheck.status!='1'">确认核验</div> -->

		</view>
			
	</view>

	
</template>

<script>
import StatusBackground from './component/statusBackground'
import minActionSheet from '@/components/min-action-sheet/min-action-sheet'
import {order,address,activity,coupon,model,service,groupBook} from '@/common/api/api'
import {Format} from '@/common/utils/formatDate.js'
	export default {
		components:{
			StatusBackground,minActionSheet
		},
		data() {
			return {
				order_type:'',//订单类型
				host: this.$qiniuHost,
				tabs:[
					{name:'到店自取',active:false,type:0},
					{name:'配送',active:true,type:1},
				],
				tabIndex:0,
				status:{
					name:'',
					tips:'',
					pay_status:null
				},
				order_id:'',
				orderInfo:{},
				defaultAddress:null,
				type:0,//0为商品订单，1为活动订单
				use_coupon:[],
				total_price:0,
				orderCheck:{},
				shop_user:{},
				payApi:'',
				addressList:[], //用户地址列表
			}
		},
		mounted() {
			
		},
		computed: {
			show_bottom:function(){
				if(this.orderInfo.pay_status==1||this.orderInfo.pay_status==2||this.orderCheck&&this.orderCheck.status){
					return true
				}else{
					return false
				}
			}
		},
		onLoad: function(e) {
			this.order_id = e.id;
			this.type = e.type;
		},
		onShow(){
			this.total_price = 0;
			if(this.type==0){
				// 商品订单
				this.getDetail();
				this.getOrderCoupon();
				this.getOrderCheck();
				this.payApi = '/order/userPay';
			}else if(this.type==1){
				// 活动订单
				this.getAcivityOrder()
			}else if(this.type==2){
				// 模特订单
				this.getModelOrder()
				this.payApi = model.pay
			}else if(this.type==3){
				// 服务订单
				this.getServiceOrder()
				this.payApi = service.pay
			}
			else if(this.type==4){
				// 拼拍订单
				this.getGBOrder()
				this.payApi = groupBook.pay
			}
			
		},
		methods: {
			//选择地址方法
			changeAddress(e){
				console.log("changeAddress-----",e.target.value);
				this.defaultAddress=this.addressList[e.target.value]
				console.log('changeAddress+++++++++++++++++',this.defaultAddress);
			},
			//获取用户地址列表
			getAddressList(){
				this.util.getAddressList().then(res=>{
					console.warn('getAddressList---------',res);
					this.addressList=res;
					if(res.length>0){
						let address=res.find(item=>item.is_default==1);
						if(address){
							this.defaultAddress=address;
						}else{
							this.defaultAddress=res[0];
						}
					}
				})
			},
			//切换配送方式方法
			tabChangeClick(index){
				console.log('tabChangeClick----------',index);
				if(this.orderInfo.pay_status=='1'){
					this.tabChange(index)
					this.editDelivery();
				}else{
					uni.showToast({title: '配送方式不能修改',icon: 'none',duration: 2000})
					return;
				}
				if(index==1){
					//获取用户地址
					this.getAddressList();
				}
			},
			tabChange(index){
				this.tabs.forEach((item,flag) => {
					if(flag == index){
						item.active = true;
						this.tabIndex = flag;
					}else{
						item.active = false;
					}
				});
			},
			gotoMyAddress(){
				uni.navigateTo({url:'/pages/my/address?from=detail'})
			},
			getOrderCoupon(){
				this.$http.get(order.getOrderCart,{order_id:this.order_id}).then(res => {
					if(res&&res.price){
						this.use_coupon = res.price.coupon_array;
					}
					this.use_coupon.forEach(item => {
						if(item.coupon_type=='1'){
							item.money = item.money.split('.')[0]
						}else{
							item.money = Math.floor(parseInt(item.money))/10;
						}
					})
				})
			},
			statusToStr(status){
				let status_str = {name:'',tips:'',pay_status:null};
				status_str.pay_status = status;
				let name,tips;
				switch(Number(status)){
					case 0:
						name = '订单失效';
						tips = '超时未支付';
						break;
					case 1:
						name = '待付款';
						tips = '请在2小时内支付';
						break;
					case 2:
						name = '已付款';
						tips = '您的订单已付款，等待商家确认！';
						break;
					case 3:
						name = '已接单';
						tips = '商家已接单';
						break;
					case 4:
						if(this.orderInfo.reject_reason){
							name = '退款中';
							tips = '退款原因：商家拒单，'+this.orderInfo.reject_reason;
						}else{
							name = '退款申请中';
							tips = '退款申请中，等待商家审核。';
						}	
						break;
					case 5:
						name = '退款完成';
						tips = '您的订单已退款完成。';
						break;
					case 6:
						name = '订单进行中';
						tips = '商品正在使用阶段，请按时使用及归还。';
						break;
					case 7:
						name = '待评价';
						tips = '订单已完成';
						break;
					case 8:
						name = '订单完成';
						tips = '谢谢惠顾，欢迎再次光临。';
						break;
				}
				status_str.name=name;
				status_str.tips=tips;
				return status_str;
			},
			// 商品订单
			getDetail(){
				this.$http.get(order.getOrderDetail,{id:this.order_id}).then(res => {
					this.orderInfo = res;
					console.log('getDetail-----------',res)
					if(res.is_door_to_door==1){
						this.tabChange(1);
						this.defaultAddress = res.address_detail;
						this.defaultAddress.id = res.address_id;
					}else{
						this.tabChange(0);
					}

					// 状态栏显示-
					this.status = this.statusToStr(this.orderInfo.pay_status);
					
					if(this.orderInfo.rent_type!='1'){
						this.orderInfo.start_time = this.orderInfo.start_time.split(' ')[0];
						this.orderInfo.end_time = this.orderInfo.end_time.split(' ')[0];
						this.orderInfo.days = this.util.dayCount(this.orderInfo.start_time,this.orderInfo.end_time);
					}else{
						this.orderInfo.rent_time_range = this.orderInfo.start_time + '~' +this.orderInfo.end_time.split(' ')[1]
						this.orderInfo.days = this.util.calHours(this.orderInfo.start_time.replace(/-/,'/'),this.orderInfo.end_time.replace(/-/,'/'));
					}
					
					
					this.orderInfo.create_time_str = Format.formatDateNoSecond(this.orderInfo.create_time*1000);
					// 将订单商品数据格式处理一下 
					this.orderInfo.goodsList = [];
					// 影棚订单
					if(this.orderInfo.studio_order){
						this.order_type = 'studio';
						this.orderInfo.goodsList.push(this.orderInfo.studio_order);
						if(this.orderInfo.studio_order.equip_order_array&&this.orderInfo.studio_order.equip_order_array.length>0){
							// 如果影棚订单里有器材
							this.orderInfo.goodsList = this.orderInfo.goodsList.concat(this.orderInfo.studio_order.equip_order_array)
						}
						
						this.orderInfo.goodsList.forEach(v => {
							if(!v.order_count){
								v.order_count = 1;
								v.type =1;
								v.img = v.studio_detail.pic.split(',')[0];
								v.name = v.studio_detail.name;
							}else{
								if(v.equip.pic){v.img = v.equip.pic.split(',')[0]}
								else{v.img = v.equip.static.pic.split(',')[0]}
								v.name = v.equip.custom_desc;
								v.type = 2;
							}
							this.total_price += parseFloat(v.price);
							
						})
					// 器材订单
					}else{
						this.order_type = 'equip';
						this.orderInfo.goodsList =this.orderInfo.equip_order;
						this.orderInfo.goodsList.forEach(v => {
							v.img = v.equip.pic.split(',').filter(v=>{return v})[0]
							v.name = v.equip.custom_desc;
							v.type = 2;
							this.total_price += parseFloat(v.price);
						})
					}
				}).catch(err=>{})
			},
			//获取订单核验单
			getOrderCheck(){
				this.$http.get(order.getCheck,{order_id:this.order_id}).then(res => {
					if(res){
						this.orderCheck = res;
						if(this.orderCheck.status=='0'){
							this.orderCheck.chk_status_str = '待核验'
						}else if(this.orderCheck.status=='1'){
							this.orderCheck.chk_status_str = '已确认'
						}else if(this.orderCheck.status=='2'){
							this.orderCheck.chk_status_str = '已拒绝'
						}
						console.log('this.orderCheck.status---',this.orderCheck.status)
					}else{
						// 核验单为空
						this.orderCheck.chk_status_str = '待上传'
					}
					console.log('this.orderCheck---',this.orderCheck)
				}).catch(err=> {
				})
			},
			// 活动订单
			getAcivityOrder(){
				this.$http.get(activity.getOrder,{id:this.order_id}).then(res => {
					this.orderInfo = res.rows[0];
					this.status = this.statusToStr(this.orderInfo.pay_status);
					this.orderInfo.create_time_str = Format.formatDateNoSecond(this.orderInfo.create_time * 1000);
					this.orderInfo.activity.end_time = this.orderInfo.activity.end_time.split(' ')[0];
					this.orderInfo.activity.start_time = this.orderInfo.activity.start_time.split(' ')[0];
					this.shop_user = this.orderInfo.activity.user;
					console.log('getAcivityOrder-------------',this.orderInfo)
				}).catch(err=>{
				})
			},
			// 模特订单
			getModelOrder(){
				this.$http.get(model.getOrderList,{id:this.order_id}).then(res => {
					this.orderInfo = res;
					this.status = this.statusToStr(this.orderInfo.pay_status);
					this.orderInfo.create_time_str = Format.formatDateNoSecond(this.orderInfo.create_time * 1000);
					this.shop_user = this.orderInfo.to_user;
				})
			},
			// 服务订单
			getServiceOrder(){
				this.$http.get(service.getOrderDetail,{id:this.order_id}).then(res => {
					this.orderInfo = res;
					this.status = this.statusToStr(this.orderInfo.pay_status);
					this.orderInfo.create_time_str = Format.formatDateNoSecond(this.orderInfo.create_time * 1000);
					this.shop_user = this.orderInfo.user;
				})
			},
			// 拼拍订单
			getGBOrder(){
				this.$http.get(groupBook.getOrder,{id:this.order_id}).then(res => {
					this.orderInfo = res;
					this.status = this.statusToStr(this.orderInfo.pay_status);
					this.orderInfo.create_time_str = Format.formatDateNoSecond(this.orderInfo.create_time * 1000);
					this.shop_user = this.orderInfo.to_user;
				})
			},
			// 取消订单
			cancelOrder(){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确认取消订单？',
					success: function(res) {
						if (res.confirm) {
							that.confirmCancel()
						} else if (res.cancel) {
							
						}
					}
				});
				
			},
			// 取消使用优惠券
			async confirmCancel(){
				let api = '';
				let param = {};
				if(this.type==0){
					// 商品订单
					api = order.cancelOrder
					param = {order_id:this.order_id}
				}else{
					// 活动订单
					api = activity.cancelOrder;
					param = {id:this.order_id}
				}
				for (const item of this.use_coupon) {
					let res = await this.cancelCoupon(item.id);
					console.log(res)
				}
				this.$http.post(api,param).then(res=>{
					uni.showToast({title: '取消成功！',icon: 'success',duration:1000});
					setTimeout(()=>{
						uni.navigateBack()
					},1000)
				})
			},
			// 取消优惠券
			cancelCoupon(data){
				return new Promise((resolve,reject) => {
					this.$http.get(coupon.cancelUse,{order_id:this.order_id,id:data}).then(res=>{
						resolve(res)
					})
					.catch(err=> {
						reject(err)
					})
				})
			},
			// 返回首页
			backToHome(){
				uni.switchTab({
					url: "/pages/tabBar/home"
				});
			},

			// 查看核验清单详情
			gotoCheckDetail(){
				uni.navigateTo({url:"/pages/order/orderCheckDetail?order_id="+this.order_id})
			},
			// 确认核验
			comfirmCheck(){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定已查看核验清单无误？',
					success: function(res) {
						if (res.confirm) {
							that.$http.post(order.optCheck,{order_check_id:that.orderCheck.id,opt:1}).then(res => {
								this.getDetail()
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},

			// 去退款
			gotoRefund(){
				uni.setStorage({key:'orderInfo',data:this.orderInfo});
				uni.navigateTo({url:'/pages/order/orderRefund?type='+this.type})
			},

			// 修改配送方式
			editDelivery(){
				this.$http.get(order.editDelivery,{order_id:this.order_id,door_to_door:this.tabIndex}).then(res => {

				}).catch(err=>{})
			},
			// 修改订单地址
			updateAddress(){
				return new Promise((resolve,reject)=>{
					this.$http.post(order.addOrderAddress,{order_id:this.order_id,address_id:this.defaultAddress.id}).then(res => {
						resolve(true);
					}).catch(err=>{})
				})
				
			},
			async wxAppPay() {
				let _this = this;
				//微信小程序支付
				// 设备订单才可以修改配送类型和修改地址
				if(this.order_type=='equip'){
					if(this.tabIndex==1){
						if(this.defaultAddress.id){
							await this.updateAddress()
						}else{
							this.util.showTip('您未选择配送地址!');
						}
					}
					
				}
				//#ifdef MP-WEIXIN
				uni.getProvider({
					service: 'payment',
					success: function(res) {
						console.log('手机支持啥支付' + JSON.stringify(res));
					}
				});
				let payData = {
					'order_id': this.orderInfo.id,
					'total_price': this.orderInfo.price,
					'pay_way': 1,
					'call_way': 'mp-weixin'
				};
				this.$http.post(this.payApi, payData).then(res => {
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
								_this.getDetail();
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
				//#endif
			},
			//#ifdef MP-ALIPAY
			aliAppPay(){
				let _this = this;
				let payData = {
					'order_id': this.orderInfo.id,
					'total_price': this.orderInfo.price,
					'pay_way': 2,
					'call_way': 'mp-alipay'
				};
				
				this.$http.post(this.payApi, payData).then(res => {
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
			// #endif
			//#ifdef H5 || APP-PLUS
			h5AppPay() {
				this.payItem = this.orderInfo;
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
						this.$http.post(this.payApi, payData).then(res => {
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
									console.log('window.location.href-------',res)
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
			testPay(payWay) {
				this.$http.post(this.payApi, {
					'order_id': this.order_id,
					'total_price': this.orderInfo.price,
					'pay_way': payWay,
					'H5': true
				}).then(res => {
					console.log(res);
					if (payWay == 1) {
						if (res.indexOf('https://wx.tenpay.com') != -1) {
							window.location.href = res;
						}
					} else if(payWay == 2) {
						this.$refs.alipay.innerHTML =res;
						document.forms["alipay_submit"].submit();
					}
				}).catch(err => {
					console.log('userPay error', err);
				});
				console.log('login');
				return;
			},
			//#endif
			//联系我们
			contactUs(){
				let _this = this;
				if(_this.type!=0){
					uni.showModal({
						title: '提示',
						content: '联系客服：'+_this.shop_user.mobile,
						success: function(res1) {
							if (res1.confirm) {
							uni.makePhoneCall({
								phoneNumber: _this.shop_user.mobile
							});							
							} else if (res1.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}else{
					
					uni.showModal({
						title: '提示',
						content: '联系客服：'+ _this.orderInfo.to_user.mobile,
						success: function(res1) {
							if (res1.confirm) {
								console.warn(_this.orderInfo.to_user.mobile)
								uni.makePhoneCall({
									phoneNumber: _this.orderInfo.to_user.mobile
								});
							} else if (res1.cancel) {
								console.log('用户点击取消');
							}
						},
					});
				}
				
			}
		}
	}
</script>

<style lang="scss" scope>
.overflow{
	overflow-x:hidden;
}
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
		padding: 20rpx 20rpx 20rpx 0rpx;
		line-height: 50rpx;
		font-size: 28rpx;
		color: #333333;
		width:100%;
		.tel{
			margin-left: 10rpx;
			color:#999999;
		}
	}
}
.username{
	padding: 38rpx 36rpx;
	font-size:32rpx;
	color: #999999;
	background-color: #ffffff;
	border-bottom: 1rpx solid #EBEBEB;
	.tel{
		color: #333333;
		margin-left:20rpx;
	}
}

.operate{
	display:flex;
	justify-content:flex-end;
	.btn{
		display:inline-block;
		padding:8rpx 20rpx;
		background:#651FFF;
		color:#fff;
		border-radius:40rpx;
		margin-right:10rpx;
		margin-top:10rpx;
	}
}

.order-item {
	display: flex;
	flex-direction: column;
	padding-left: 30rpx;
	background: rgb(255, 255, 255);
	border-radius: 8rpx;

	.i-top {
		display: flex;
		align-items: center;
		height: 50rpx;
		padding-right: 30rpx;
		font-size: 30rpx;
		color: #333333;
		position: relative;
		padding-top: 20rpx;
		.icondianpu {
			font-size: 35rpx;
		}

		.shop_name {
			flex: 1;
			margin-left: 20rpx;
		}

		.state {
			color: #651FFF;
			font-size: 26rpx;
		}

		.del-btn {
			padding: 10rpx 0 10rpx 36rpx;
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

	.date-time{
		font-size: 24rpx;
		margin-left: 50rpx;
		color: #999999
	}

	/* 单条商品 */
	.goods-box-single {
		display: flex;
		padding: 20rpx 0;
		font-size: 28rpx;

		.goods-img {
			display: block;
			width: 220rpx;
			height: auto;
		}

		.center {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 0rpx 0 15rpx;
			overflow: hidden;

			.title {
				color: #333333;
				overflow:hidden; 
				text-overflow:ellipsis;
				display:-webkit-box; 
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2; 
			}
			.attr {
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;
				padding: 20rpx 0;
				color: #999999;
				.style {
					color: #333333;
					&:before {
						content: '';
					}
				}
			}

		}
		
		.right{
			font-size: 28rpx;
			padding-right: 30rpx;
			display: flex;
			flex-direction: column;
			// align-items: center;
			text-align: right;
			text{
				line-height: 40rpx;
				display: block;
			}
			.price{
				color: #333333;
			}
			.num{
				color:#999999;
			}
		}
	}
	
	.attr1 {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		padding: 20rpx 30rpx 20rpx 240rpx;
		color: #333333;
		.style {
			color: #333333;
			&:before {
				content: '';
			}
		}
	}
	.check-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		height: 50rpx;
		line-height: 50rpx;
		.left{
			color: #FF5700;
			font-size: 26rpx;
			// text-decoration: underline;
		}
		.right{
			width: 120rpx;
			text-align: center;
			font-size: 26rpx;
			border: 1rpx solid #999999;
			border-radius: 32rpx;
			color: #333333;
			margin-right: 30rpx;
		}
	}
	.before-price-box,.discount-box{
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0 0 20rpx;
		font-size: 30rpx;
		color: #666666;
		.price {
			&:before {
				content: '￥';
				// font-size: $font-sm;
				margin: 0 2rpx 0 0rpx;
			}
		}
		.price1 {
			&:before {
				content: '-￥';
				// font-size: $font-sm;
				margin: 0 2rpx 0 0rpx;
			}
		}
		.discount {
			&:after {
				content: '折';
			}
		}
		.right{
			margin:0 30rpx;
		}
	}
	.price-box {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0 0 40rpx;
		font-size: 32rpx;
		.left{
			color: #333333;
		}
		.right{
			margin:0 30rpx;
		}
		.price-left {
			color:#666666;
		}

		.price {
			
			color: #EA001F;
			font-weight: bold;
			&:before {
				content: '￥';
				// font-size: $font-sm;
				margin: 0 2rpx 0 8rpx;
			}
		}
		
		.close{
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
		border-radius: 0px;

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

.order-info{
	background-color: #fffFFF;
	margin-top: 20rpx;
	color: #666666;
	padding-top: 30rpx;
	margin-bottom: 150rpx;
	p{
		padding: 20rpx 30rpx;
		font-size: 30rpx;
		
	}
	.contact{
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 32rpx;
		padding: 20rpx 0;
		margin-top: 20rpx;
		border-top: 1px solid #f8f8f8;
		border-bottom: 1px solid #f8f8f8;
		.border{
			width: 2rpx;
			height: 80rpx;
			background-color: #f8f8f8;
		}
		.iconfont{
			
			color: #007ad9;
		}
		.icondianhua{
			font-size: 40rpx;
		}
		.name{
			margin-left: 20rpx;
		}
	}
}
.bottom{
	padding: 30rpx 0;
	background-color: #ffffff;
	display: flex;
	justify-content: flex-end;
	position: fixed;
	bottom: 0;
	width: 100%;
	border-top: 1rpx solid #EAEAEA;
	.btn{
		border-radius: 8rpx;
	}
	.gray{
		padding: 15rpx 0;
		width: 200rpx;
		text-align: center;
		font-size: 32rpx;
		color: #666666;
		border: 1px solid #d9d9d9;
		margin-right: 20rpx;
	}
	.red{
		background-color: #EA001F;
		color: #ffffff;
		padding: 15rpx 0;
		width: 200rpx;
		text-align: center;
		font-size: 32rpx;
		margin-right: 30rpx;
	}
	.purple{
		background-color: #651FFF;
		color: #ffffff;
		padding: 15rpx 0;
		width: 200rpx;
		text-align: center;
		font-size: 32rpx;
		margin-right: 30rpx;
	}
}
</style>
