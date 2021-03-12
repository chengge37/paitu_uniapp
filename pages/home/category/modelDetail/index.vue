<template>
	<view>
		<view class="top">
			<swiper class="swiper" @change="changeImage" circular>
				<swiper-item v-for="(item, index) in modelDetail.photo" :key="index">
					<image :src="host + item" class="image" mode="aspectFit" v-if="item"></image>
					<image :src="host + defaultEquipPic" class="image" mode="aspectFit" v-else></image>
				</swiper-item>
			</swiper>
			<view :class="!isCollect?'iscollect':'notcollect'" class="collect" @click="collectOrnot">
				<span class="iconfont iconshoucang1-copy" v-if="!isCollect"></span>
				<span class="iconfont iconshoucang" v-else></span>
			</view>
			
			<!-- #ifndef H5  -->
			<view  class="share" @click="share">
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="share-btn"></button>
				<!-- #endif -->
				<span class="iconfont iconfenxiang2"></span>
			</view>
			<!-- #endif -->
			<view class="current" v-if="modelDetail.photo&&modelDetail.photo.length>0">{{p_current}}/{{modelDetail.photo.length}}</view>
		</view>
		<view class="middle">
			<view class="detail">
				<view class="price">{{modelDetail.ppd}}</view>
				<view class="other">
					<view class="deal">销量：{{modelDetail.total}} 次</view>
				</view>
			</view>
			<view class="title">
				<view class="name" >
					<span v-if="modelDetail.title">{{modelDetail.title}}</span>
					<span v-else>未定义标题</span>
				</view>
			</view>
			
		</view>

		<!-- 档期 -->
		<div class="schedule">
			
			<div class="sign" @click="openSchedule">
				<span class="iconfont icondangqi"></span>
				<span>模特档期</span>
			</div>
			<div class="interval-time" @click="openDateInter">
				<div class="text-line">
					<p class="start">开始时间</p>
					<p class="end">结束时间</p>
				</div>
				<div class="time-line">
					<p class="start" v-text="dateShow.start?dateShow.start:currentDate"></p>
					<p class="days">{{rent_times}}</p>
					<p class="end" v-text="dateShow.end?dateShow.end:currentDate"></p>
				</div>
			</div>
			<div class="worktime">
				<p class="title">工作时间</p>
				<p class="time-content">周一到周五、周日 9:00 ~ 18:00 ·  周六休息</p>
			</div>
		</div>
		<!-- 下单流程 -->
		<div class="order-flow">
			<p class="title">下单流程</p>
			<p class="flow-item" v-for="(item,index) in orderFlow" :key="index">
				{{item.name}}
				<span class="iconfont iconchangjiantou" v-if="index!=3"></span>
			</p>
		</div>
		<!-- 店铺 -->
		<div class="shop">
			<image @click="gotoShop(modelDetail)"
			:src="util.shopAvatarUtil(modelDetail.avatar)"
			mode="aspectFill" 
			class="shop-img" ></image>
			<div class="shop-name" @click="gotoShop(modelDetail)">
				<p class="title" v-text="modelDetail.to_user.nick?modelDetail.to_user.nick:'暂无店名'"></p>
				<p class="is_auth"></p>
				<p class="address">常驻地：{{modelDetail.city}}</p>
			</div>
			<div class="gotoshop">
				<p class="btn" @click="gotoShop(modelDetail)">进入主页</p>
			</div>
		</div>

		<view class="pick-way">
			<div class="way" v-for="item in detailNavList" :key="item.type" :class="item.active?'active':''" @click="detailChange(item.name)">{{item.name}}
				<div class="border"></div>
			</div>
		</view>
		
		<div class="model-info" v-if="detailNavTab==0">
			<div class="info-title">基础资料</div>
			<div class="base-info">
				<div class="info-line">
					<p class="item">
						<span class="property">姓名：</span><span class="value" v-text="modelDetail.real_name?modelDetail.real_name:'未实名'"></span>
					</p>
					<p class="item">
						<span class="property">性别：</span><span class="value" v-if="modelDetail.sex=='1'">男</span><span class="value" v-else>女</span>
					</p>
				</div>
				<div class="info-line">
					<p class="item1">
						<span class="property">常驻城市：</span><span class="value">{{modelDetail.city}}</span>
						<!-- <span class="iconfont">！</span><span class="tips">接单范围只限北京</span> -->
					</p>
				</div>
				<div class="info-line">
					<p class="item">
						<span class="property">国籍：</span><span class="value" v-text="modelDetail.nationality?modelDetail.nationality:'暂无数据'"></span>
					</p>
				</div>
			</div>
			<div class="info-title">个人资料</div>
			<div class="body-info">
				<div class="info-line">
					<p class="item">
						<span class="property">身高：</span><span class="value">{{modelDetail.height}}cm</span>
					</p>
					<p class="item">
						<span class="property">体重：</span><span class="value">{{modelDetail.weight}}kg</span>
					</p>
				</div>
				<div class="info-line">
					<p class="item">
						<span class="property">三维：</span>
						<span class="value" v-if="modelDetail.bust&&modelDetail.waist&&modelDetail.hips">{{modelDetail.bust}}/{{modelDetail.waist}}/{{modelDetail.hips}}</span>
						<span class="value" v-else>暂无数据</span>
					</p>
					<p class="item">
						<span class="property">鞋码：</span><span class="value" v-text="modelDetail.shoes?modelDetail.shoes:'暂无数据'"></span>
					</p>
				</div>
				<div class="info-line">
					<p class="item">
						<span class="property">肤色：</span>
						<span class="value" v-if="modelDetail.skin==1">白色</span>
						<span class="value" v-else-if="modelDetail.skin==2">黄色</span>
						<span class="value" v-else-if="modelDetail.skin==3">黑色</span>
						<span class="value" v-if="!modelDetail.skin">暂无数据</span>
					</p>
					<p class="item">
						<span class="property">当前发型：</span>
						<span class="value" v-if="modelDetail.hair==1">直长发</span>
						<span class="value" v-else-if="modelDetail.hair==2">短发</span>
						<span class="value" v-if="!modelDetail.hair">暂无数据</span>
					</p>
				</div>
				<div class="info-line">
					<p class="item">
						<span class="property">脸型：</span>
						<span class="value" v-if="modelDetail.face==1">圆脸</span>
						<span class="value" v-else-if="modelDetail.face==2">长脸</span>
						<span class="value" v-else-if="modelDetail.face==3">瓜子脸</span>
						<span class="value" v-else>暂无数据</span>
					</p>
					<p class="item">
						<span class="property">腿长：</span>
						<span class="value" v-if="modelDetail.leg">{{modelDetail.leg}}</span>
						<span class="value" v-else>暂无数据</span>
					</p>
				</div>
				<div class="info-line">
					<p class="item">
						<span class="property">臀展：</span>
						<span class="value" v-if="modelDetail.wingspan">{{modelDetail.wingspan}}</span>
						<span class="value" v-else>暂无数据</span>
					</p>
					<p class="item">
						<span class="property">肩宽：</span>
						<span class="value" v-if="modelDetail.shoulder">{{modelDetail.shoulder}}</span>
						<span class="value" v-else>暂无数据</span>
					</p>
				</div>
				<div class="info-line">
					<p class="item1">
						<span class="property">是否有双眼皮：</span>
						<span class="value" v-if="modelDetail.eyelid==1">单眼皮</span>
						<span class="value" v-else-if="modelDetail.eyelid==2">双眼皮</span>
						<span class="value" v-else>暂无数据</span>
					</p>
				</div>
				<div class="info-line">
					<p class="item">
						<span class="property">第一语言：</span><span class="value">{{modelDetail.lan_one | lanToStr}}</span>
					</p>
				</div>
				<div class="info-line">
					<p class="item">
						<span class="property">第二语言：</span><span class="value">{{modelDetail.lan_two | lanToStr}}</span>
					</p>
				</div>
			</div>
			<div class="info-title">拍摄风格</div>
			<div class="model-style">
				<span v-for="(item,index) in modelDetail.style_arr" :key="index" class="style-item">{{item}}</span>
			</div>

			<div class="info-title">模特标签</div>
			<div class="model-type">
				<span v-for="(item,index) in modelDetail.type_arr" :key="index" class="type-item">{{item}}</span>
			</div>
		
		</div>

		<!-- 底部 -->
		<view class="footer">
			<view class="left">
				<view class="model" v-for="(item,b) in bottom" :key="b" @click="bottomClick(b)" >
					<span class="iconfont" :class="item.icon"></span>
					<view>{{item.name}}</view>
				</view>
			</view>
			<view class="_right">
				<view class="right1">
					<span class="price" v-if="modelDetail.ppd">￥{{modelDetail.ppd}}</span>
				</view>
				<view class="right" @click="gotoPay">
					立即预约
				</view>	
			</view>
			
		</view>

		<!-- <uni-popup ref="popupCalendar" type="center" :radius="true">
			<view class="calender">
				<uni-calendar 
				:insert="true"
				:lunar="true" 
				:range="true"
				@change="dateChange"
				></uni-calendar>
			</view>
			
		</uni-popup> -->
		<!-- #ifdef H5 -->
		<mx-datepicker 
		ref="mxDatePicker"
		:show="showPicker" 
		:type="'range'" 
		:show-tips="showTips" 
		:begin-text="'开始'" 
		:end-text="'结束'" 
		:show-seconds="false"
		:selectable="selectable"
		:showDate='showDate'
		:busyDate="busyDate"
		@confirm="dateOnSelected" 
		@cancel="dateOnCancel" 
		@dateChange="dateChange"/>
		<!-- #endif-->
	</view>
</template>

<script>
import { model } from '@/common/api/api';
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
import mxDatepicker from "@/components/mx-datepicker/mx-datepicker.vue"
import { getUserLsObj,collectOther } from '@/common/utils/collect';
import {mapState} from 'vuex'
	export default {
		components:{
			uniPopup,
			// #ifdef H5
			mxDatepicker
			// #endif
		},
		data() {
			const currentDate = this.getDate();
			const currentFormatDate = this.getDateFormat();

			return {
				host: this.$qiniuHost,
				typeList:this.config.modelTypeList,
				styleList:this.config.shootingTypeList,
				currentDate:currentDate,
				dateShow:{
					start:'',
					end:''
				},
				model_id:'',
			    modelDetail:[],
				dateLine:'',
				isCollect:false,
				p_current:1,
				orderFlow:[
					{name:'下单'},
					{name:'模特确认订单'},
					{name:'开始服务'},
					{name:'完成服务'},
				],
				detailNavList:[
					{name:'个人资料',active:true,type:1},
					{name:'服务介绍',active:false,type:2},
					{name:'评论',active:false,type:3},
				],
				detailNavTab:0,
				bottom: [
					{icon: 'icondianpu',name: '店铺'},
					{icon: 'iconkefu',name: '联系商家'},
					{icon: 'icondangqi',name: '模特档期'},
				],
				showPicker:false,
				showTips:true,
				selectable:true,
				showDate:false,
				busyDate:[],
				busy_params:{
					start_time:currentFormatDate,
					end_time:currentFormatDate,
					model_id:'',
					uid:''
				},
				order_params:{
					rent_type:2,
					start_time:currentFormatDate,
					end_time:currentFormatDate,
					id:'',
				}
			}
		},
		filters:{
			lanToStr(val){
				if(val==1){
					return '普通话'
				}else if(val==2){
					return '粤语'
				}else if(val==3){
					return '英语'
				}else if(val==4){
					return '西班牙语'
				}else{
					return '其他'
				}
			},
			styleToStr(val){
				if(val==1){
					return '运动'
				}else if(val==2){
					return 'OL'
				}else if(val==3){
					return '日韩'
				}else if(val==4){
					return '街头'
				}else if(val==5){
					return '甜美'
				}else if(val==6){
					return '英伦'
				}else if(val==7){
					return '中国风'
				}else if(val==8){
					return '孕妇装'
				}else if(val==9){
					return '复古'
				}
			},
		},
		mounted() {
			
		},
		computed:{
			...mapState(['user']),
			rent_times(){
				let days = this.util.dayCount(this.order_params.start_time,this.order_params.end_time);
				return `${days}天`;
			}
		},
		onLoad: function(e) {
			this.model_id = this.busy_params.model_id = this.order_params.id = e.id;
			
			this.getModelDetail();
			console.log(this.user)
			if(this.user&&this.user.paitume_user){
				console.log(this.user)
				getUserLsObj(this.model_id,4,1).then(res=>{
				this.isCollect=res});
			}
		},
		onShow(){
			// #ifdef H5
			this.$wechatShare.share({  
				title:'派图租赁模特',
			    desc: this.modelDetail.title, 
			    img: this.$qiniuHost+this.modelDetail.photo[0]
			});
			// #endif
        },
        onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: '派图么模特',
				path: '/pages/home/category/modelDetail/index?id='+this.model_id
			}
		},
		methods: {
			getDateFormat() {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getDate() {
				const date = new Date();
				// let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				let hour = date.getHours();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				if(hour<10){
					hour = '0' + JSON.stringify(hour)
				}
				return `${month}月${day}日 00时`;
			},
			getDateToStr(date){
				let month = date.getMonth() + 1;
				let day = date.getDate();
				let hour = date.getHours();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				if(hour<10){
					hour = '0' + JSON.stringify(hour)
				}
				return `${month}月${day}日 00时`;
			},
            getModelDetail(){
				this.$http.get(model.getModel,{id:this.model_id,isAutoMsg:1}).then(res => {
					this.modelDetail = res;
					this.busy_params.uid = this.modelDetail.to_user.id;
					this.modelDetail.photo = this.modelDetail.photo.split(',');
					this.modelDetail.style_arr = [];
					this.modelDetail.type_arr = [];
					let style_arr = this.modelDetail.style.split(',');
					let type_arr = this.modelDetail.type.split(',');
					style_arr.forEach(s_item => {
						this.styleList.forEach(v=> {
							if (v.id == s_item){
								this.modelDetail.style_arr.push(v.name)
							}
						})
					})
					type_arr.forEach(t_item => {
						this.typeList.forEach(v=> {
							if (v.id == t_item){
								this.modelDetail.type_arr.push(v.name)
							}
						})
					})
				})
			},
			getCalendar(){
				return new Promise((resolve,reject)=>{
					this.$http.get(model.getCalendar,this.busy_params).then(res => {
						console.log('getCalendar--',res)
						this.busyDate = res;
						resolve(res)
					})
				})
				
			},
			collectOrnot(){
				collectOther(this.modelDetail.to_user.id,4,1,this.model_id).then(res => {
					this.isCollect = res;
				})
			},
			detailChange(data){
				this.detailNavList.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.detailNavTab = item.type;
					}else{
						item.active = false;
					}
				})
			},
			openSchedule(){
				this.showPicker = true;
				this.showTips = false;
				this.selectable = false;
				this.showDate = false;
				this.getCalendar().then(res => {
					this.$refs.mxDatePicker.refreshCalendars(true)
				})
			},
			openDateInter(){
				// this.$refs.popupCalendar.open()
				this.showPicker = true;
				this.showTips = true;
				this.selectable = true
				this.showDate = true;
				this.getCalendar().then(res => {
					this.$refs.mxDatePicker.refreshCalendars(true)
				})
			},
			dateOnSelected(val){
				console.log('dateOnSelected--',val)
				this.dateShow.start = this.getDateToStr(val.date[0])
				this.dateShow.end = this.getDateToStr(val.date[1])
				this.order_params.start_time = val.value[0].split('/').join('-'),
				this.order_params.end_time = val.value[1].split('/').join('-'),
				this.showPicker = false;
			},
			dateOnCancel(){
				this.showPicker = false;
			},
			dateChange(val){
				console.log('dateChange--',val);
				this.busy_params.start_time = this.util.dateToStr(this.currentMonthFirst(val))
				this.busy_params.end_time = this.util.dateToStr(this.currentMonthLast(val))
				this.getCalendar().then(res => {
					this.$refs.mxDatePicker.refreshCalendars(true)
				})
			},
			currentMonthFirst(date){
				date.setDate(1);
				return date;
			},
			currentMonthLast(date){
				var currentMonth=date.getMonth();
				var nextMonth=++currentMonth;
				var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
				var oneDay=1000*60*60*24;
				return new Date(nextMonthFirstDay-oneDay);
			},
			gotoPay(){
				uni.setStorage({key: 'orderParams',data: this.order_params})
				uni.navigateTo({url:'/pages/order/model/orderPay'})
			},
			share(){
				// #ifdef APP-PLUS
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 2,
					title: this.modelDetail.title,
					imageUrl: this.modelDetail.photo[0],
					success: function (res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
				// #endif
			},
			gotoShop(data){
				if(data.auto_msg_user.role=='16'){
					uni.navigateTo({url:'/pages/merchant/company/index?id='+data.auto_msg_user.id})
				}else if(data.auto_msg_user.role=='128'){
					uni.navigateTo({url:'/pages/merchant/personal/index?id='+data.auto_msg_user.id})
				}
			}
		}
	}
</script>

<style lang="scss" scope>
.top {
	position: relative;
	background-color: #ffffff;
	.swiper {
		// width: 100%;
		// height: 632rpx;
		width:750rpx;
		height:750rpx;
		border-bottom: 1rpx solid #f8f8f8;
		.image {
			width: 100%;
			height:100%;
			display: block;
		}
	}
	.collect{
		position: absolute;
		top:38rpx;
		right: 40rpx;
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 60rpx;
		color: #ffffff;
		
		.iconfont{
			font-size: 40rpx;
		}
		.iconshoucang{
			color:#FFFFFF;
		}
	}
	.iscollect{
		background: rgba(0,0,0,0.5);
	}
	.notcollect{
		background: rgba(0,0,0,0.5);
	}
	.share{
		position: absolute;
		top:128rpx;
		right: 40rpx;
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 60rpx;
		color: #ffffff;
		font-size: 40rpx;
		background: rgba(0,0,0,0.5);
		.share-btn{
			width: 60rpx;
			height: 60rpx;
			background-color: #999999;
			position: absolute;
			bottom: 0;
			opacity: 0;
		}
	}
	.current {
		position: absolute;
		bottom: 38rpx;
		right: 40rpx;
		color: #f9f9f9;
		font-size: 26rpx;
		padding: 5rpx 25rpx;
		line-height: 31rpx;
		background: rgba(0,0,0,0.6);
		border-radius: 20rpx;
	}
}
.middle {
	clear: both;
	padding: 25rpx 30rpx;
	color: rgb(51, 51, 51);
	background-color: #fff;
	margin-bottom: 20rpx;
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		.name {
			font-size: 34rpx;
			font-weight: bold;
		}

		.info {
			font-size: 24rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.info-item{
				display: flex;
				flex-direction: column;
				align-items: center;
				color: #999999;
				margin: 10rpx;
				span{
					line-height: 40rpx;
				}
				.iconshoucang1-copy{
					font-size: 40rpx;
					
				}
				.iconshoucang{
					font-size: 40rpx;
					color:#651FFF;
				}
			}
		}
	}

	.address {
		font-size: 26rpx;
		margin: 20rpx 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.location {
			color: #000;
			margin-right: 10rpx;
		}
	}

	.detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		// border-bottom: 1rpx dotted #dddddd;
		padding-bottom: 10rpx;

		.price::before {
			content: '¥';
			font-size: 26rpx;
			margin-right: 4rpx;
		}

		.price {
			color: #DB1522;
			font-size: 40rpx;
		}

		.price::after {
			content: '/天';
			color: #999999;
			margin-left: 4rpx;
			font-size: 24rpx;
		}

		.other {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.point {
				font-size: 26rpx;
			}

			.point::after {
				content: '分';
				margin-right: 20rpx;
			}

			.deal {
				font-size: 24rpx;
				margin-left: 4rpx;
				color: #999999;
			}
		}
	}

	.server {
		margin-top: 22rpx;
		border-bottom: 1rpx dotted #dddddd;
		font-size: 26rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		.server-item {
			margin: 0 8rpx;
			margin-bottom: 22rpx;
		}

		.space {
			margin: 0 2rpx;
		}
	}

	
}
.schedule{
	padding: 20rpx 30rpx;
	background-color: #FFFFFF;
	margin-bottom: 20rpx;
	.sign{
		border: 1rpx solid #651FFF;
		color: #651FFF;
		width: 160rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		span{
			display: inline-block;
		}
		.iconfont{
			margin-right: 5rpx;
		}
	} 
	.interval-time{
		.text-line{
			font-size: 26rpx;
			color: #999999;
			display: flex;
			justify-content: space-between;
			margin-bottom: 24rpx;
			p{
				width: 252rpx;
			}
		}
		.time-line{
			display: flex;
			justify-content: space-between;
			padding-bottom: 32rpx;
			margin-bottom: 32rpx;
			border-bottom: 1rpx solid #D9D9D9;
			.start,.end{
				font-size: 36rpx;
				color: #333333;
				font-weight: bold;
				width: 252rpx;
			}
			.days{
				color: #651FFF;
				font-size: 26rpx;
				display: table-cell;
				vertical-align: bottom;
			}
		}
		
	}
	.worktime{
		display: flex;
		font-size: 26rpx;
		margin-bottom: 10rpx;
		.title{
			color: #999999;
			margin-right: 20rpx;
		}
		.time-content{
			color: #333333;
		}
	}
}
.order-flow{
	display: flex;
	flex-wrap: nowrap;
	font-size: 26rpx;
	margin-bottom: 20rpx;
	padding: 30rpx;
	background-color: #ffffff;
	.title{
		color: #E9941F;
		margin-right: 20rpx;
	}
	.flow-item{
		color: #333333;
		.iconfont{
			display: inline-block;
			margin: 0 6rpx;
		}
	}
}
.shop{
	padding: 20rpx 30rpx;
	margin-top: 20rpx;
	background-color: #fff;
	display: flex;
	justify-content: space-around;
	margin-bottom: 20rpx;
	.shop-img{
		width: 120rpx;
		height: 120rpx;
		display: block;
	}
	.shop-name{
		line-height: 50rpx;
		width: 50%;
		
		.title{
			font-size: 30rpx;
			color: #333333;
		}
		.address{
			font-size: 24rpx;
			color: #999999;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.gotoshop{
		.btn{
			padding: 10rpx 30rpx;
			font-size: 24rpx;
			background-color: #651FFF;
			color: #fff;
			border-radius: 30rpx;
		}
	}
}
.pick-way{
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	margin-top: 20rpx;
	background-color: #ffffff;
	border-bottom: 1px solid #f8f8f8;
	
	.way{
		width: 144rpx;
		font-size: 36rpx;
		color: #333333;
		position: relative;
		
	}
	.active{
		color: #651FFF;
		.border{
			position: absolute;
			left: 0rpx;
			top: 65rpx;
			width: 40rpx;
			height: 6rpx;
			background-color: #651FFF;
		}
	}
	
	
}
.model-info{
	padding: 30rpx 30rpx 200rpx;
	background-color: #ffffff;
	.info-title{
		color: #333333;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 80rpx;
	}
	.base-info,.body-info{
		padding: 30rpx 0;

		.info-line{
			display: flex;
			justify-content: space-between;
			font-size: 32rpx;
			.item{
				width: 300rpx;
				line-height: 60rpx
			}
			.item1{
				line-height: 60rpx
			}
			.property{
				margin-right: 20rpx;
				color: #999999;
			}
			.value{
				color: #333333
			}
			.iconfont{
				margin-left: 30rpx;
				margin-right: 10rpx;
			}
			.tips{
				font-size: 24rpx;
				color: #999999;
			}
		}
	}
	.model-style{
		padding: 30rpx 0;
		.style-item{
			color: #999999;
			font-size: 32rpx;
			margin-right: 10rpx;
			line-height: 60rpx;
		}
	}
	.model-type{
		padding: 30rpx 0;
		.type-item{
			color: #999999;
			font-size: 32rpx;
			margin-right: 20rpx;
			border: 1rpx solid #999999;
			padding: 5rpx 20rpx;
			border-radius: 30rpx;
		}
	}
}
.footer {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	border-top: 1px solid #f8f8f8;
	z-index: 999;
	.left {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 20rpx;
		text-align: center;
		flex:1;
		padding:0 10rpx;
		.model {
			width: 96rpx;
			color: #666666;
			flex-shrink: 0;
		}
		.active_model {
			color: #EA001F;
		}
	}
	._right{
		display: flex;
		// justify-content: flex-end;
		.right,.right1 {
			color: #ffffff;
			font-size: 32rpx;
			display: flex;
			justify-content: center;
		}
		.right{
			background-color: #EA001F;
			align-items: center;
			padding: 0 50rpx;
		}
		.right1{
			background-color: #FF5500;
			width:200rpx;
			text-align: center;
			.price{
				margin-top: 30rpx;
			}
			.price-detail{
				// position: absolute;
				font-size: 20rpx;
				margin-top: 36rpx;
				margin-left: 10rpx;
				// bottom: 15rpx;
				// right: 20rpx;
				height: 30rpx;
				line-height: 30rpx;

				border-bottom: 1px solid #ffffff;
			}
		}
	}
	
}
.calender{
	border: 1rpx solid #999999;
	border-radius: 20rpx;
}
</style>
