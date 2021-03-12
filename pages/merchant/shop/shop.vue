<template>
	<view>
		<div class="shop-info">
			<image class="img" :src="shopInfo.logo?util.shopAvatarUtil(shopInfo.logo):util.shopAvatarUtil(shopInfo.avatar)" mode="aspectFill"></image>
			<div class="right">
				<div class="line1">
					<p class="shop-name">
						<span class="iconfont icondianpu1"></span>
						<span v-if="shopInfo.nick">{{shopInfo.nick}}</span>
					</p>
					<p class="shop-collect" @click="collectOrnot">
						<span class="iconfont iconshoucang1-copy" v-if="!isCollect"></span><span class="text" v-if="!isCollect">收藏</span>
						<span class="text" v-else>已收藏</span>
					</p>
				</div>
				<!-- <div class="line2">
					<p class="is-auth" v-if="shopInfo.trueName">
						<span class="iconfont iconrenzheng"></span><span>已认证</span>
					</p>
					<p class="not-auth" v-else>
						<span>未认证</span>
					</p>
					<uni-rate v-if="shopInfo.score" :disabled="rateDisable" :value="shopInfo.score" size="16" class="shop-rate"></uni-rate>
					<p class="collection">{{collect_num}}人收藏</p>
				</div> -->
				<div class="line3">
					<span class="iconfont iconbiaoqian"></span>
					地址：
					<span v-if="shopInfo.address">{{shopInfo.address}}</span>
					<span v-else>暂无地址</span>
				</div>
			</div>
		</div>
		<view class="choose-list-shop" :class="reachTop?'fixed-top':''">
			<text class="choose" :class="item.active?'active':''" v-for="(item,index) in choose_list" :key="index" @click="orderBy(item.name)">{{item.name}}</text>
			
		</view>
		<self-swiper :banner="banner" type="shop" v-if="choose_type==0&&banner.length>0"></self-swiper>
		<div class="home" v-if="choose_type==0">
			<!-- 影棚器材时间选择卡 -->
			<div class="select-cart" :style="select_cart_top">
				<div class="choose-list">
					<p class="choose-item" :class="item.active?'active':''" v-for="item in choose2_list" :key="item.type" @click="chooseItemChange(item.name)">{{item.name}}</p>
				</div>
				<div class="select-time">
					<view class="date">
						<picker mode="date" :value="choose_times.dateStart" @change="startDateChange" :start="currentDate">
							<view>
								<view class="title">开始日期</view>
								<view class="data">{{choose_times.dateStart}}</view>
							</view>
						</picker>
					</view>
					<view class="days">{{rent_days}}天</view>
					<view class="date">
						<picker mode="date" :value="choose_times.dateEnd" @change="endDateChange" :start="choose_times.dateStart">
							<view>
								<view class="title">结束日期</view>
								<view class="data">{{choose_times.dateEnd}}</view>
							</view>
						</picker>
					</view>
				</div>
				<div class="rent-btn" @click="gotoRent">立即租借</div>
			</div>
			<div class="coupon-box">
				<scroll-view class="discount-scroll" scroll-x="true" v-if="coupons.length>0" @scroll="couponScrollChange" @scrolltolower="couponScrolltolower">
					<div class="discount">
						<div class="quan"  v-for="(cou_item,index) in coupons" :key="index">
							<div class="coupon-img">
								<image :src="host+shop_coupon" class="shop-coupon-bg" mode="aspectFill"></image>
							</div>
							<div class="coupon-data" >
								<p class="price" v-if="cou_item.coupon_type=='1'">
									<span class="fuhao">￥</span><span class="num">{{cou_item.money}}</span>
								</p>
								<p class="price" v-if="cou_item.coupon_type=='2'">
									<span class="num">{{cou_item.money}}</span><span class="fuhao">折</span>
								</p>
								<p class="condition">满{{cou_item.limit_money}}元可用，不限品类</p>
								<p class="pick_btn" @click="addCoupon(cou_item.id)" v-if="!cou_item.unable">领取</p>
								<p class="unable-get"  v-else>已领取</p>
							</div>	
						</div>
						
					</div>
				</scroll-view>

				<div class="dots" v-if="dots.length>1">
					<span class="dot" :class="item.active?'active':''" v-for="(item,index) in dots" :key="index"></span>
				</div>
			</div>
			
			<!-- 影棚模块 -->
			<div class="big-title" v-if="studioList1.length>0">
				<p class="text">我们的影棚</p>
			</div>
			<div class="studio">
				<div class="item-big" v-for="item in studioList1" :key="item.id" @click="gotoDetail(item.id)">
					<image :src="host+item.img" class="img" mode="aspectFill"></image>
					<div class="info">
						<div class="name">{{ item.name }}</div>
						<div class="price">￥{{item.priceWorkDayWorkTimePerHour}}</div>
						<div class="info-data">
							<p class="left">
								<span class="iconfont iconbiaoqian"></span>
							</p>
							<p class="right">
								<span class="other">{{item.address}}</span>
							</p>
						</div>
						<div class="condition">
							<p>
								<i class="iconfont icondizhi1"></i>
							</p>
							<scroll-view scroll-x="true" class="cdt">
								<span>{{item.square}}m²</span>
								<span v-for="(cdt_item,index) in item.conditions" :key="index">{{cdt_item}}</span>
							</scroll-view>
							
						</div>
					</div>
					
				</div>
			</div>
			<div class="seemore" @click="orderBy('影棚')" v-if="studioList1.length>0">
				查看更多影棚
			</div>

			<!-- 器材模块 -->
			<div class="big-title" v-if="equipmentList.length>0">
				<p class="text">我们的器材</p>
			</div>
			<div class="equipment"  v-if="equipmentList.length>0">
				<view class="product-list">
					<view v-for="product in equipmentList" :key="product.id" >
						<div class="product" @click="toGoods(product)" style="border-radius:10px;">
							<image :src="host + util.picExplode(product.img)" mode="aspectFill" :onerror="util.errorPic"/>
							<view class="info" >
								<p class="name">{{ product.custom_desc }}</p>
								<view class="line1">
									<div class="left">
										<span class="fuhao">￥</span>
										<span class="price" v-if="product.only_rent_day!='1'">{{ product.price }}</span>
										<span class="price" v-else>{{ product.price_day_workday_in }}</span>
										<span class="per" v-if="product.only_rent_day!='1'">/每小时</span>
										<span class="per" v-else>/每天</span>
									</div>
								</view>
							</view>
						</div>
					</view>
				</view>
			</div>
			<div class="seemore" @click="orderBy('器材')" v-if="equipmentList.length>0">
				查看更多器材
			</div>


			<div class="big-title" v-if="activityList.length>0">
				<p class="text">我们的活动</p>
			</div>
			<view class="activity" v-if="activityList.length>0">
				<view class="list-item shadow" v-for="(item,key) in activityList" :key="key" @click="goActDetail(item)">
					<view class="image">
						<image :src="host+item.pic" mode="aspectFill" v-if="item.pic" class="act-img"></image>
						<div v-else class="nopic">暂无图片</div>
					</view>
					<view class="list-info">
						<div class="info-left">
							<view class="list-name">
								<text>{{item.name}}</text>
							</view>
							<view class="list-detail">
								<div class="left">
									<text class="title1">时间：{{item.start_time}}-{{item.end_time}}</text>
								</div>
							</view>
						</div>
					</view>
				</view>
			</view>
			<div class="seemore" @click="orderBy('活动')" v-if="activityList.length>0">
				查看更多活动
			</div>
		</div>


		<div class="studio-tab tab-content" v-if="choose_type==1">
			<studio type="shop" :shop_id="shop_id" :search="search" ref="studioList"></studio>
		</div>	
		

		<div class="equipment-tab tab-content" v-if="choose_type==2">
			<equipment type='shop' :shop_id="shop_id" :city_code="shopInfo.city_code" :search="search" ref="equipmentList"></equipment>
		</div>

		<div class="activity-tab tab-content"  v-if="choose_type==3">
			<activity type='shop' :shop_id="shop_id" :search="search" ref="activityList"></activity>
		</div>

	</view>
</template>

<script>
import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue';
import SelfSwiper from "@/components/self-swiper/self-swiper";
import Studio from '@/components/studioList/index'
import Equipment from '@/components/equipList/index'
import Activity from '@/components/activityList/index'
import { studio,equipment,user,coupon,collectOrFollow,picture,company  } from '@/common/api/api'
import { getUserLsObj,collectOther } from '@/common/utils/collect';
import { getConditions } from '@/common/utils/util'
import {mapState} from 'vuex'
export default {
	data() {
		const currentDate = this.util.getDate();
		return {
			currentDate:currentDate,
			rateDisable:true,
			choose_type:0,
			choose2_type:1,
			choose_list:[
				{name:'首页',active:true,type:0},
				{name:'影棚',active:false,type:1},
				{name:'器材',active:false,type:2},
				{name:'活动',active:false,type:3},
			],
			choose2_list:[
				{name:'租影棚',active:true,type:1},
				{name:'租器材',active:false,type:2},
			],
			choose_times:{
				dateStart:currentDate,
				dateEnd:currentDate
			},
			coupon_params:{
				page:1,page_size:10,status:1
			},
			shop_coupon:'images/miniapp/blue_coupon.png',
			shopInfo:{},
			studioList:[],
			studioList1:[],
			activityList:[],
			studioItem1:{},
			host:this.$qiniuHost,
			equipmentList:[],
			shop_id:'',
			search:'',
			isCollect:false,
			shop_city_code:'',
			coupons:[],
			collect_num:'0',
			reachTop:false,
			banner:[],
			dots:[],
			isLower:false,
			equipList:[],
		}
	},
	components:{
		Studio,Equipment,Activity,uniRate,SelfSwiper
	},
	computed: {
		...mapState(['user']),
		rent_days(){
			return this.util.dayCount(this.choose_times.dateStart,this.choose_times.dateEnd)
		},
		select_cart_top(){
			if(this.banner.length>0){
				return 'top:-10px'
			}else{
				return 'top:10px'
			}
		}
	},
	watch:{
		choose_times:{
			handler(newVal, oldVal) {
				let startTem = this.util.toTimestamp(this.choose_times.dateStart);
				let endTem = this.util.toTimestamp(this.choose_times.dateEnd);
				if(startTem>endTem){
					this.choose_times.dateEnd = this.choose_times.dateStart
				}
	　　　　},
	　　　　deep: true
		},
		shopInfo(val){
			if(val){
				// #ifdef H5
				this.$wechatShare.share({  
					title:this.shopInfo.nick,
					desc: '派图么平台店铺-'+this.shopInfo.nick,  
					img: this.host+this.shopInfo.logo?this.util.shopAvatarUtil(this.shopInfo.logo):this.util.shopAvatarUtil(this.shopInfo.avatar)
				});
				// #endif
			}
		}
	},
	onShareAppMessage(res) {
		if (res.from === 'menu') {// 来自页面内分享按钮
		console.log(res.target)
		}
		return {
			title: this.shopInfo.nick,
			path: '/pages/merchant/shop/shop?id='+this.shop_id
		}
	},
	
	onLoad(e){
		this.shop_id = e.id;
		this.getShopDetail();
		this.getStudioHot();
		this.getEquips();
		this.getActivities();
		if(this.user&&this.user.paitume_user){
			getUserLsObj(this.shop_id,0,1).then(res=>{this.isCollect=res});
			this.getCoupon().then(res =>{
				let count = Math.ceil(this.coupons.length/2); 
				for(let i=0;i<count;i++){
					if(i==0){
						this.dots.push({index:i,active:true})
					}else{
						this.dots.push({index:i,active:false})
					}
				}
				console.log('this.dots--',this.dots)
			})
			this.getCollect();
		}
		this.getBanner()
	},
	mounted() {
		
	},
	methods: {
		getBanner(){
			this.$http.get(picture.banner,{uid:this.shop_id}).then(res => {
				this.banner = res;
			})
		},
		collectOrnot(){
			collectOther(this.shop_id,0,1,0).then(res => {
				this.isCollect = res;
				this.getCollect()
			});
			
			
		},
		getCollect(){
			this.$http.get(collectOrFollow.getShopCount,{uid:this.shop_id,obj:1,type:0}).then(res => {
				this.collect_num = res;
			})
		},
		orderBy(data){
			setTimeout(()=> {
				if(data=='影棚'){
					this.studioList = this.$children[0].studioList;
					console.log('this.$children--',this.$children[0].studioList)
				}else if(data=='器材'){
					this.equipList = this.$children[0].equipList;
					console.log('this.$children--',this.$children[0].equipList)
				}
			},1000)
			
			this.choose_list.forEach(item => {
				if(item.name==data){
					item.active = true;
					this.choose_type = item.type
				}else{
					item.active = false;
				}
			});
		},
		searchChange(e){
			console.log('e.detail',e.detail.value)
		},
		getShopDetail(){
			uni.showLoading({title: '加载中'});
			this.$http.get(company.get,{uid:this.shop_id}).then(res => {
				this.shopInfo = res;
				this.shop_city_code = res.city_code;
				uni.setNavigationBarTitle({title: res.nick});
				uni.hideLoading()
			}).catch(err=>{
				uni.hideLoading()
			})
		},
		getCoupon(){
			return new Promise((resolve,reject)=> {
				this.$http.get(coupon.getList,Object.assign(this.coupon_params,{uid:this.shop_id})).then(res => {
					this.coupons = res.rows;
					this.coupons.forEach(v => {
						if(parseInt(v.limit_count)==v.user_get){
							v.unable = true
						}else{
							v.unable = false
						}
						if(v.coupon_type == '2'){
							v.money = v.money.split('.')[0];
							console.log('v.money---',v.money)
						}	
					})
					console.log('------coupon',this.coupons)
					resolve(res)
				})
			})
			
		},
		addCoupon(data){
			console.log('data---------',data)
			this.$http.get(coupon.getCoupon,{id:data}).then(res => {
				uni.showToast({title: '领取成功！',icon: 'success'});
				this.getCoupon();
			})
		},
		getStudioHot(){
			let param = {page:1,page_size:3,studio_uid:this.shop_id};
			this.$http.get(studio.getList,param).then(res => {
				this.studioList = res.rows.slice(1);
				this.studioItem1 = res.rows[0];
				this.studioList1 = res.rows;
				if(this.studioItem1.pic.split(",").length>0){
					this.studioItem1.img = this.studioItem1.pic.split(',')[0];
				}
				this.studioList.forEach(item => {
					item.conditions = [];
					item.conditions = getConditions(item.serviceConditionArray)
					item.price = item.priceWorkDayWorkTimePerHour;
					if(item.pic.split(",").filter(v=>{return v}).length>0){
						item.img = item.pic.split(',').filter(v=>{return v})[0];
					}
				})
			}).catch(err=>{})
		},
		getEquips(){
			let param = {page:1,page_size:4,uid:this.shop_id};
			this.$http.get(equipment.getList,param).then(res => {
				this.equipmentList = res.rows;
				this.equipmentList.forEach(item => {
					if(item.pic.split(",").filter(v=>{return v}).length>0){
						item.img = item.pic.split(',').filter(v=>{return v})[0];
					}
				})
			}).catch(err=>{})
		},
		getActivities(){
			let params = {page:1,page_size:2,uid:this.shop_id}
			this.common.getActivityList(params).then(res=>{
				this.activityList = res.rows;
				this.activityList.forEach(item => {
					item.start_time = item.start_time.split(' ')[0];
					item.end_time = item.end_time.split(' ')[0];
				})
			}).catch(err=>{})
		},
		toGoods(data){
			uni.navigateTo({
				url: '/pages/home/category/equipmentDetail/equipmentDetail?equip_id=' + data.id
			});
		},
		gotoDetail(data){
			uni.navigateTo({
				url: '/pages/home/category/studioDetail/studioDetail?studio_id=' + data
			});
		},
		goActDetail(data){
			uni.navigateTo({
				url: '/pages/home/category/activityDetail/activityDetail?activity_id=' + data.id +'&name=' +data.name
			});
		},
		// 选择卡方法
		startDateChange(e){
			this.choose_times.dateStart = e.detail.value;
		},
		endDateChange(e){
			this.choose_times.dateEnd = e.detail.value;
		},
		chooseItemChange(data){
			this.choose2_list.forEach(item=>{
				if(item.name==data){
					item.active = true;
					this.choose2_type = item.type;
				}else{
					item.active = false;
				}
			})
		},
		gotoRent(){
			this.is_search = true;
			this.times = this.choose_times;
			this.choose_list.forEach(item => {
				if(item.type==this.choose2_type){
					item.active = true;
					this.choose_type = item.type
				}else{
					item.active = false;
				}
			});
		},
		// 优惠券方法
		couponScrollChange(e){
			let page = parseInt(e.detail.scrollLeft/335);
			let rem = this.coupons.length%2;
			// console.log('scrollLeft---',e.detail.scrollLeft,'page--',page,'deltaX---',e.detail.deltaX)
			if(e.detail.deltaX<0&&this.isLower&&rem!==0){
				this.dots.forEach((item,index) => {
					if(index==(page+1)){
						this.$set(item,'active',true)
					}else{
						this.$set(item,'active',false)
					}
				})
			}else{
				this.isLower = false;
				this.dots.forEach((item,index) => {
					if(index==(page)){
						this.$set(item,'active',true)
					}else{
						this.$set(item,'active',false)
					}
				})
			}
			
		},
		couponScrolltolower(e){
			this.isLower = true;
		}
	},
	onReachBottom:function(){
		if(this.choose_type==1){
			this.$refs.studioList.addPageOne()
		}else if(this.choose_type==2){
			this.$refs.equipmentList.addPageOne()
		}else if(this.choose_type==3){
			this.$refs.activityList.addPageOne()
		}
		
	},
	onPageScroll:function(e){
		//这个就是滚动到差不多的位置使搜索框固定(。-`ω´-)
		if(e.scrollTop>200){
			if(this.choose_type==1&&this.studioList.length>2){
				this.reachTop = true;
				this.$refs.studioList.reachTop();
			}else if(this.choose_type==2&&this.equipList.length>4){
				this.reachTop = true;
				this.$refs.equipmentList.reachTop();
			}else if(this.choose_type==3){
				this.reachTop = true;
				this.$refs.activityList.reachTop();
			}
		}else{
			this.reachTop = false;
			if(this.choose_type==1){
				this.$refs.studioList.notReachTop();
			}else if(this.choose_type==2){
				this.$refs.equipmentList.notReachTop();
			}else if(this.choose_type==3){
				this.$refs.activityList.notReachTop();
			}
		}
	},
}
</script>

<style lang="scss" scope>
/*  #ifdef  H5  */
	page{
		// background-color: transparent;
	}
/*  #endif  */
.swiper{
	width: 100%;
	height: 500rpx;
}
.banner{
	.banner-img{
		width: 100%;
		height: 100%;
	}
}
.home{
	margin-bottom: 200rpx;
}
.shop-info{
	display: flex;
	// justify-content: space-between;
	align-content: flex-start;
	padding: 40rpx 30rpx 20rpx;
	background-color: #ffffff;
	border-top: 1px solid #f8f8f8;
	color: #333333;
	.img{
		width: 130rpx;
		height: 130rpx;
		margin-right: 20rpx;
	}
	.right{
		flex:1
	}
	.line1{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
		color: #7F8990;
		.iconfont{
			font-size: 28rpx;
			margin-right: 10rpx;
		}
		.shop-name{
			font-size: 28rpx;
			flex: 1;
		}
		.shop-collect{
			color: #999999;
			padding: 0rpx 25rpx;
			border-radius: 25rpx;
			line-height: 40rpx;
			display: flex;
			align-items: center;
			border: 1rpx solid #d9d9d9;
			span{
				display: flex;
			}
			.text{
				font-size: 24rpx;
				margin-left: 10rpx;
			}
			
		}
		
	}
	.line2{
		display: flex;
		font-size: 24rpx;
		margin-bottom: 10rpx;
		line-height: 30rpx;
		.is-auth{
			color:#651FFF;
			margin-right: 25rpx;
			
			.iconfont{
				margin-right: 10rpx;

			}
		}
		.not-auth{
			color: #999999;
			margin-right: 25rpx;
		}
		.shop-rate{
			margin-right: 25rpx;
		}
		.collection{
			color: #999999;
		}
	}
	.line3{
		color: #7F8990;
		font-size: 28rpx;
		.iconfont{
			font-size: 36rpx;
			position: relative;
			left: -5rpx;
			margin-right: 2rpx;
		}
	}
}
.choose-list-shop {
	font-size: 30rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	color:#7F8990;
	z-index: 10;
	width:100%;
	.active{
		position: relative;
		color: #192B39;
	}
	.active::after{
		content: '';
		position: absolute;
		top: 70rpx;
		left: 50rpx;
		width: 60rpx;
		height: 4rpx;
		background-color: #192B39;
	}
	.choose {
		padding: 30rpx 50rpx;
	}
}
.fixed-top{
	position: fixed;
	top: 0;
}
.search{
	border: 1px solid #D9D9D9;
	padding: 0 5rpx 0 40rpx;
	display: flex;
	align-items: center;
	.search-input{
		width: 80rpx;
		// text-align: center;
	}
	.iconsousuo{
		font-size: 40rpx;
		color: #999999;
	}
}
.home{
	// background-color: #ffffff	
}
.select-cart{
	margin: 0 20rpx;
	background-color: #ffffff;
	position: relative;
	padding: 20rpx;
	border-radius: 4rpx;
	box-shadow:0px 4px 4px 0px rgba(0,0,0,0.14);
	.choose-list{
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #F0F0F0;
		.choose-item{
			font-size: 28rpx;
			margin-right: 60rpx;
			color: #7F8990;
		}
		.active{
			position: relative;
			font-weight: bold;
			color: #192B39;
		}
		.active::after{
			content: "";
			width: 10rpx;
			height: 10rpx;
			border-radius: 10rpx;
			position: absolute;
			top: 36rpx;
			left: 8rpx;
			color: #192B39;
		}

	}
	.select-time{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:20rpx;
		.date{
			.title{
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
				color: #192B39;
			}
			.data{
				font-size: 24rpx;
				color: #7F8990;
			}
		}
		.days{
			font-size: 28rpx;
			padding: 10rpx;
			background-color: #EFF4F8;
		}
	}
	.rent-btn{
		width: 100%;
		height: 82rpx;
		line-height: 82rpx;
		text-align: center;
		color: #ffffff;
		font-size: 28rpx;
		background-color: #192B39;
		
	}

}
.coupon-box{
	padding: 0 20rpx;
	.discount-scroll{
		margin: 0 auto;
	}	
}

.coupon-box{
	.discount{
		display: flex;
		.quan{
			margin-right: 20rpx;
		}
		.coupon-img{
			z-index: 1;
			position: relative;
			border-radius: 4rpx;
			.shop-coupon-bg{
				width:320rpx;
				height: 164rpx;
			}
		}
		.coupon-data{
			position: absolute;
			top: 0;
			width: 320rpx;
			height: 164rpx;
			padding: 20rpx;
			z-index: 2;
			.price{
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 5rpx;
				color: #192B39;
			}
			.condition{
				font-size: 20rpx;
				margin-bottom: 10rpx;
				color: #7F8990;
			}
			.pick_btn{
				width: 144rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				font-size: 24rpx;
				color: #ffffff;
				background-color: #192B39;
				border-radius: 4rpx;
			}
			.unable-get{
				width: 144rpx;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 24rpx;
				color: #192B39;
			}
		}
	}
	.dots{
		padding: 0 25rpx 20rpx;
		.dot{
			display: inline-block;
			width: 10rpx;
			height:10rpx;
			border-radius: 10rpx;
			background-color: #d9d9d9;
			margin-right: 10rpx;
		}
		.active{
			width:20rpx;
			background-color: #192B39;
		}
	}
	
}

.big-title{
	padding: 40rpx 0 0;
	.text{
		color: #192B39;
		font-size: 28rpx;
		text-align: center;
		width: 100%;
		letter-spacing:5rpx;
		font-weight: bold;
	}
}
.seemore{
	border:1px solid #192B39;
	border-radius: 4rpx;
	color: #192B39;
	height: 92rpx;
	line-height: 92rpx;
	font-size: 24rpx;
	text-align: center;
	background-color: #ffffff;
	margin:20rpx;
}
.hot{
	padding: 30rpx 0;
	.tab{
		font-size: 26rpx;
		color: #ffffff;
		span{
			padding: 8rpx 40rpx;
			background-color: #999999;
		}
		.active{
			background-color: #651FFF;
		}
	}
	
	.list{
		margin-top: 30rpx;
	}
}
.equipment{
	padding: 0 20rpx;
	.product-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 30rpx;
		.product {
			background-color: #ffffff;
			width: 348rpx;
			margin-bottom: 20rpx;
			image {
				width: 324rpx;
				margin: 12rpx;
				height: 272rpx;
				border-radius: 16rpx;
			}
			.detail {
				width: 92%;
				padding: 0 4%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				text-align: justify;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 28rpx;
				color: #807c87;
			}
			.info{
				margin-top: -10rpx;
				
			}
			.info1 {
				width: 92%;
				padding:20rpx 0;
				.name {
					width: 92%;
					padding:0 20rpx;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
					font-size: 28rpx;
					height: 76rpx;
				}
				.line1{
					.left{
						text-align: center;
						width: 100%;
					}
				}
				.fuhao{
					font-size:12px;
					color: #e65339;
				}
				.price {
					color: #e65339;
					font-size: 32rpx;
					font-weight: 600;

					.other {
						color: #807c87;
						font-size: 26rpx;
						font-weight: 500;
					}
				}
				.per,.deal{
					font-size: 24rpx;
					color:#999999;
				}
				.shop{
					font-size: 28rpx;
					color: #999999;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: flex;
					justify-content: space-between;
					line-height: 60rpx;
					span{
						display: inline-block;

					}
					
				}
				.cart{
						color: #e65339;
					}
			}
			.info {
				width: 92%;
				padding: 10rpx 4% 10rpx 4%;
				.name {
					width: 92%;
					height:76rpx;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
					font-size: 20rpx;
					color: #7F8990;
				}
				.line1{
					.left{
						text-align: center;
						width: 100%;
						margin-bottom: 30rpx;
						color: #192B39;
					}
				}
				.fuhao{
					font-size:12px;
				}
				.price {
					font-size: 28rpx;
					font-weight: 600;

					.other {
						font-size: 28rpx;
						font-weight: 500;
					}
				}
				.per,.deal{
					font-size: 24rpx;
				}
				
			}
		}
	}
}
.studio{
	.item-big{
		// padding: 30rpx;
		padding-bottom: 35rpx;
		margin-top: 30rpx;
		width: 100%;
		background-color: #ffffff;
		.img{
			width: 710rpx;
			margin: 20rpx;
			border-radius: 7rpx;
			height: 396rpx;
		}
		.name {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			text-align: justify;
			overflow: hidden;
			font-size: 36rpx;
			color: #333333;
			font-weight: bold;
			color: #333333;
			font-size:28rpx;
			margin: 8rpx 0;
		}
		.price{
			color: #192B39;
			font-size: 28rpx;
		}
		.price::after{
			content: '/小时起';
			color: #7F8990;
			font-size: 20rpx;
		}
		.price{
			color: #192B39;
			font-size: 28rpx;
		}
		.condition{
			display: flex;
			align-items: center;
			margin: 5rpx 0;
			p{
				display: inline-block;
			}
			.icondizhi1{
				color: #192B39;
				margin-right: 10rpx;
			}
			.cdt{
				overflow: hidden;
				white-space: nowrap;
				span{
					padding: 6rpx 20rpx;
					font-size: 20rpx;
					margin-right: 10rpx;
					display: inline-block;
					border-radius:4rpx; 
					color: #999999;
					border:1rpx solid #F0F0F0;
				}
			}
		}
		.info-data{
			display: flex;
			align-items: center;
			
			.left{
				.score{
					font-weight: bold;
					font-size: 26rpx;
				}
				.other{
					font-size: 22rpx;
					margin-left: 10rpx;
				}
			}
			.price{
				color:#192B39;
				font-size: 28rpx;
				font-weight: bold;
			}
			.price:before{
				content:'￥';
				color:#192B39;
				font-size: 28rpx;
				font-weight: bold;
			}
			.price:after{
				content:'/小时';
				font-size: 20rpx;
			}
			.iconbiaoqian{
				margin-right: 10rpx;
			}
			.other{
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				text-align: justify;
				overflow: hidden;
				font-size:20rpx;
			}
		}
		.info {
			// margin: 0 15rpx;
			padding: 25rpx 20rpx;    
		}
	}
}

.activity {
		background-color: #ffffff;
		padding: 20rpx 20rpx 10rpx;
		margin-top: 30rpx;
		.list-info {
			background-color: #fff;
			// box-shadow: 0 5rpx 25rpx rgba(0, 0, 0, 0.1);
			// border-radius: 0 0 10rpx 10rpx;
			padding: 0 22rpx;
			display: flex;
			justify-content: space-between;
			width: 380rpx;
		}
		.list-name {
			font-size: 36rpx;
			font-weight: bold;
			margin-bottom: 15rpx;
			color: #192B39;
		}

		.list-detail {
			// margin: 16rpx 0;
			font-size: 22rpx;
			display: flex;
			justify-content: flex-start;
			align-content: space-between;
			color:#7F8990;
			.title1{
				
			}
			.content1{
				width: 270rpx;
				display: inline-block;
			}
			.price{
				color:#333333;
				font-weight: bold;
			}
		}
		.list-item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			.nopic{
				background-color: #f8f8f8;
				text-align: center;
				line-height: 320rpx;
				font-size: 28rpx;
				color: #666666
			}
			.image {
				flex:1;
				image {
					width: 280rpx;
					height: 210rpx;
					border-radius: 16rpx;
				}
			}
		}
	}
.studio-tab{
	// background-color: #ffffff
}
.tab-content{
	margin-bottom: 50rpx;
}
</style>
