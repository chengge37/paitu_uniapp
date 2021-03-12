<template>
	<view>
		<view class="top">
			<swiper class="swiper" @change="changeImage" circular>
				<swiper-item v-for="(item, index) in Detail.photos" :key="index">
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
			<view class="current" v-if="Detail.photos&&Detail.photos.length>0">{{p_current}}/{{Detail.photos.length}}</view>
		</view>
		<view class="middle">
			<view class="detail">
				<view class="price-item">
					<span class="price">{{Detail.price}}</span>
					<span class="primier-price" v-if="Detail.price_base">原价￥{{Detail.price_base}}</span>
				</view>
				<view class="other">
					<view class="deal" >
						合作次数：
						<span>{{Detail.total}}</span>
					</view>
				</view>
			</view>
			<view class="title">
				<view class="name" >
					<span v-if="Detail.title">{{Detail.title}}</span>
					<span v-else>未定义标题</span>
				</view>
			</view>
			
		</view>
		<div class="mid-card">
			<!-- 交付速度 -->
			<div class="line">
				<p class="title">下单流程</p>
				<p class="item">到样后5个工作日</p>
			</div>
			<!-- 服务承诺 -->
			<div class="line">
				<p class="title">服务承诺</p>
				<p class="promise-list" v-for="(item,index) in promises" :key="index">
					<span class="promise-item">{{item.name}}</span>
					
				</p>
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

		<!-- <div class="select-norms">
			<p class="title">订购项目</p>
			<div class="picker">
				<picker @change="bindNormsChange" :value="normsIndex" :range="Detail.norms" range-key="name">
					<view class="normsPicker">
						<div class="left">选择订购项目</div>
						<div class="right">
							<span v-if="Detail.norms[normsIndex]">已选【{{Detail.norms[normsIndex].name}}】</span>
							<span class="iconfont iconyoujiantou"></span>
						</div>
					</view>
				</picker>
			</div>
			
		</div> -->
		<div class="buytimes">
			<p class="title">订购次数</p>
			<div class="num">
                <p class="count">
                    剩余{{lastTotal}}{{Detail.unit}}
                </p>
				<uni-number-box 
				:min="1" 
				:value="order_params.num" 
				class="count"  
				@change="countChange"></uni-number-box>
			</div>
		</div>
		<!-- 店铺 -->
		<div class="shop">
			<image @click="gotoShop(Detail)"
			:src="util.shopAvatarUtil(Detail.user.avatar)"
			mode="aspectFill" 
			class="shop-img" ></image>
			<div class="shop-name" @click="gotoShop(Detail)">
				<p class="title" v-text="Detail.user.nick?Detail.user.nick:'暂无店名'"></p>
				<p class="is_auth"></p>
				<p class="address">地址：{{Detail.user.address}}</p>
			</div>
			<div class="gotoshop">
				<p class="btn" @click="gotoShop(Detail)">进入主页</p>
			</div>
		</div>

		<view class="pick-way">
			<div class="way" v-for="item in detailNavList" :key="item.type" :class="item.active?'active':''" @click="detailChange(item.name)">{{item.name}}
				<div class="border"></div>
			</div>
		</view>
		<div class="service-info" v-if="detailNavTab==0">
			<div class="rich-text" v-html="Detail.content"></div>
		</div>
		<div class="service-info" v-if="detailNavTab==1">
			<div class="nodata">---暂无数据---</div>
		</div>
        <!-- 拼团倒计时 -->
        <view class="countdown">
            <image :src="util.avatarUtil(user.paitume_user.avatar)" class="avatar"></image>
            <p class="text">还差<span style="color:#FF0000">{{lastCount}}</span>件成团，剩余<span style="color:#FF0000">{{dateLine}}</span></p>
        </view>
		<!-- 底部 -->
		<view class="footer">
			<view class="left">
				<view class="service" v-for="(item,b) in bottom" :key="b" @click="bottomClick(b)" >
					<span class="iconfont" :class="item.icon"></span>
					<view>{{item.name}}</view>
				</view>
			</view>
			<view class="_right">
				<view class="right1">
					<span class="price">￥{{order_price}}</span>
				</view>
				<view class="right" @click="gotoPay">
                    <span v-if="isOpen">发起拼拍</span>
                    <span v-else>参与拼拍</span>
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
		<!-- #endif  -->
	</view>
</template>

<script>
import { service,groupBook } from '@/common/api/api';
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue";
// #ifdef H5
import mxDatepicker from "@/components/mx-datepicker/mx-datepicker.vue"
// #endif
import { getUserLsObj,collectOther } from '@/common/utils/collect';
import {mapState} from 'vuex'
	export default {
		components:{
			uniPopup,
			uniNumberBox,
			// #ifdef H5
			mxDatepicker
			// #endif
		},
		data() {
			const currentDate = this.getDate();
			const currentFormatDate = this.getDateFormat();

			return {
				host: this.$qiniuHost,
				typeList:this.config.serviceTypeList,
				styleList:this.config.shootingTypeList,
                currentDate:currentDate,
                timeStr:0,
				dateShow:{
					start:'',
					end:''
				},
				g_id:'',
			    Detail:{
                    user:{nick:'',address:'',avatar:''}
				},
				dateLine:'',
				isCollect:false,
				p_current:1,
				promises:[
					{name:'延迟退款'},
					{name:'不满意重拍'},
					{name:'24小时响应'},
				],
				orderFlow:[
					{name:'下单'},
					{name:'收件'},
					{name:'拍摄'},
					{name:'交付'},
				],
				detailNavList:[
					{name:'服务介绍',active:true,type:0},
					{name:'评论',active:false,type:1},
				],
				detailNavTab:0,
				bottom: [
					{icon: 'icondianpu',name: '店铺'},
					{icon: 'iconkefu',name: '联系商家'},
				],
				showPicker:false,
				showTips:true,
				selectable:true,
				showDate:false,
				busyDate:[],
				busy_params:{
					start_time:currentFormatDate,
					end_time:currentFormatDate,
					service_id:'',
					uid:''
				},
				order_params:{
					id:'',
					num:1,
				},
				order_price:0,
                normsIndex:0,
                lastCount:0,
                lastTotal:0,
                setInterval:null,
                isOpen:false
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
		watch:{
			Detail(val){
				// #ifdef H5
                this.$wechatShare.share({  
                    title:'拍摄服务详情',
                    desc: val.title,  
                    img: this.$qiniuHost+val.photos[0]
                });
                // #endif
			}
		},
		computed:{
			...mapState(['user']),
			
		},
		onLoad: function(e) {
			this.g_id  = this.order_params.id = e.id;
			this.getGroupBooking()

			if(this.user&&this.user.paitume_user){
				console.log(this.user)
				getUserLsObj(this.g_id,5,1).then(res=>{
				this.isCollect=res});
			}
		},
		onShow(){
			
        },
        destroyed(){
			//清除定时器
			clearTimeout(this.setInterval);
		},
        onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: '派图么拼拍',
				path: '/pages/home/category/groupBooking/detail?id='+this.g_id
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
            async getServerTime(){
                let that = this;
                this.timeStr = await this.common.getServerTime()*1000;
                let endTime = this.util.strToDate(this.Detail.team_receipt)
                this.setInterval = setInterval(() => {
                    let startTime = new Date(this.timeStr);
                    let count = endTime.getTime()-startTime.getTime();
                    if(count>0){
                        that.dateLine = that.filterDeadline(startTime,endTime)
                        this.timeStr += 100;
                        this.isOpen = false
                    }else{
                        this.isOpen = true
                        clearInterval(this.setInterval)
                    }
                    
                }, 100);
            },
			getGroupBooking(){
				this.$http.get(groupBook.getList,{id:this.g_id,isAutoMsg:1}).then(res => {
                    this.Detail = res;
					this.Detail.photos = this.Detail.photo.split(',');
					this.order_price = this.Detail.price*this.order_params.num;
                    this.getServerTime();
                    if(this.Detail.user_order&&this.Detail.user_order.user_num){
                        this.lastCount = this.Detail.team_num - this.Detail.user_order.user_num;
                        this.lastTotal = this.Detail.team_max - this.Detail.user_order.user_num;
                    }else{
                        this.lastCount = this.Detail.team_num
                        this.lastTotal = this.Detail.team_max
                    }
				}).catch(err => {
				})
			},
			getCalendar(){
				return new Promise((resolve,reject)=>{
					this.$http.get(service.getCalendar,this.busy_params).then(res => {
						console.log('getCalendar--',res)
						this.busyDate = res;
						resolve(res)
					})
				})
				
			},
			collectOrnot(){
				collectOther(this.Detail.user.id,5,1,this.g_id).then(res => {
					this.isCollect = res;
				})
			},
			filterDeadline(startTime,endTime) {
				//当前时间
				// let startTime = new Date();
				// //结束时间
				// let endTime =  new Date(time);
				//算出中间差，以毫秒数返回.
                let countDown = (endTime.getTime()-startTime.getTime());
				//获取天数
				let oDay = parseInt(countDown/1000/60/60/24);
				//获取小时数
				let oHour = parseInt(countDown/1000/60/60%24);
				//获取分钟数
				let oMinute = parseInt(countDown/1000/60%60);
				//获取秒数
				let oSecond = parseInt(countDown/1000%60);
				// 获取毫秒
				let oMSecond = parseInt((countDown/100)%10);
				return ` ${this.checkTime(oDay)} 天 ${this.checkTime(oHour)} 时 ${this.checkTime(oMinute)} 分 ${oSecond}.${oMSecond} 秒`
			},
			checkTime(time){
				return time = time < 10 ? `0${time}` : time
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
			gotoPay(){
				uni.setStorage({key: 'orderParams',data: this.order_params})
				uni.setStorage({key: 'Detail',data: this.Detail})
				uni.navigateTo({url:'/pages/order/service/orderPay?type=2'})
			},
			countChange(val){
				this.order_params.num = val;
				this.order_price = this.Detail.price * val;
			},
			share(){
				// #ifdef APP-PLUS
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 2,
					title: this.Detail.title,
					imageUrl: this.Detail.photo[0],
					success: function (res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
				// #endif
			},
			bindNormsChange(e){
				console.log(e.detail.value)
				this.normsIndex = e.detail.value;
				this.order_price = this.Detail.norms[this.normsIndex].price*this.order_params.count
			},
			gotoShop(data){
				if(data.auto_msg_user.role=='4'||data.auto_msg_user.role=='8'){
					uni.navigateTo({url:'/pages/merchant/company/index?id='+data.auto_msg_user.id})
				}else if(data.auto_msg_user.role=='10'||data.auto_msg_user.role=='64'){
					uni.navigateTo({url:'/pages/merchant/personal/index?type=2&id='+data.auto_msg_user.id})
				}
			},
			bottomClick(index) {
				let _this = this;
				console.log(index)
				if(index==0){
					this.gotoShop(_this.Detail);
				}else if(index==1){
					// 此处为联系商家
					// #ifdef H5 || MP-WEIXIN
					console.warn(this.user.paitume_user,'点击器材详情页面下的客服，打印用户信息')
					if(this.user.paitume_user){
						// 已登陆跳转到聊天窗口
						var navData = encodeURIComponent(JSON.stringify({id:this.Detail.id,name:this.Detail.user.nick,avatar:this.Detail.avatar})); // 这里转换成 字符串
						uni.navigateTo({
								url:'/pages/my/myList/chatBox?chatObj='+navData
						})
					}else{
						// 未登录跳转到登录,登录完再跳转到聊天窗口
						promptLogin();
					}
					// #endif
				}
			},
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
			font-size: 30rpx;
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
			font-size: 30rpx;
		}
		.primier-price{
			color: #999999;
			margin-left: 4rpx;
			font-size: 26rpx;
			text-decoration:line-through;
			margin-left: 30rpx
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
				font-size: 26rpx;
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
.mid-card{
	padding: 0 30rpx;
	background-color: #ffffff;
	.line{
		height: 98rpx;
		line-height: 98rpx;
		width: 100%;
		border-bottom: 1rpx solid #d9d9d9;
		display: flex;

	}
	.title{
		color: #999999;
		font-size: 26rpx;
		margin-right: 40rpx;
	}
	.item{
		font-size: 26rpx;
		color: #333333;
	}
	.promise-list{
		display: flex;
		align-items: center;
		.promise-item{
			display: block;
			padding: 5rpx 20rpx;
			height: 44rpx;
			line-height: 44rpx;
			text-align: center;
			background-color: #4BD99D;
			color: #FFFFFF;
			border-radius: 37px 37px 37px 0px;
			margin-right: 20rpx;
			font-size: 22rpx;
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
		margin-right: 40rpx;
	}
	.flow-item{
		color: #333333;
		.iconfont{
			display: inline-block;
			margin: 0 6rpx;
		}
	}
}
.select-norms,.buytimes{
	padding: 0 30rpx;
	height: 98rpx;
	line-height: 98rpx;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	.title{
		color: #999999;
		font-size: 26rpx;
	}
	.picker{
		flex: 1;
		margin-left: 40rpx;
		font-size: 26rpx;
		.normsPicker{
			display: flex;
			justify-content: space-between;
			color: #333333;
			.left{
				// color: #333333;
			}
			.right{
				.iconfont{
					color: #999999;

				}
			}
		}
	}
	.num{
        display: flex;
        align-items: center;
        .count{
            font-size: 26rpx;
            color: #999999;
            margin-right: 20rpx;
        }
		/deep/ .uni-numbox__minus,/deep/  .uni-numbox__plus{
			width: 50rpx;
			font-size: 36rpx;
		}
		/deep/ .uni-numbox{
			height:50rpx;
		}
		/deep/ .uni-numbox__value{
			width: 60rpx;
			font-size: 28rpx;
		}
	}
    
}

.select-norms{
	border-bottom: 1rpx solid #d9d9d9;
}

.buytimes{
	justify-content: space-between;
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
	margin-top: 20rpx;
	background-color: #ffffff;
	border-bottom: 1px solid #f8f8f8;
	
	.way{
		width: 144rpx;
		font-size: 36rpx;
		color: #333333;
		position: relative;
		margin-right: 100rpx;
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
.service-info{
	padding: 30rpx 30rpx 300rpx;
	background-color: #ffffff;
	.rich-text{
		font-size: 30rpx;
		color: #333333;
		margin-top: 50rpx;
	}
	.nodata{
		width: 100%;
		font-size: #333333;
		text-align: center;
		font-size: 30rpx;
	}
}
.countdown{
    z-index: 10;
    background-color: #FDF4B7;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 26rpx;
    position: fixed;
    bottom: 100rpx;
    display: flex;
    align-items: center;
    width: 100%;
    .avatar{
        width: 56rpx;
        height: 56rpx;
        margin: 0 30rpx;
        border-radius: 28rpx;
        background-color: #ffffff;
    }
}
.footer {
    z-index: 10;
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	border-top: 1px solid #f8f8f8;
	.left {
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 20rpx;
		text-align: center;
		flex:1;
		padding:0 10rpx;
		.service {
			width: 96rpx;
			color: #666666;
			flex-shrink: 0;
		}
		.active_service {
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
			padding: 0 68rpx;
		}
		.right1{
			background-color: #FF5500;
			width:240rpx;
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
