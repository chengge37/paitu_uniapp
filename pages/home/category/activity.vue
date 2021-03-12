<template>
	<view>
		<div :class="isReachTop?'fixed-top':''" :style="'top:'+cssTop">
			<div class="search-box">
				<div class="search">
					<span class="iconfont iconsousuo"></span>
					<form action="#"  class="search-input">
						<input type="search" placeholder="输入搜索内容" placeholder-style="color:#999999;" v-model="params.search"
							@confirm="searchChange" />
					</form>
					<span class="iconfont iconcuo" v-if="params.search" @click="clearSearch"></span>
				</div>
			</div>
			
			<view class="select-title">
				<div class="title-item" :class="shop_id?'shop-item':'list-item'">
					<p class="choose" :class="c_item.active?'active':''" v-for="(c_item,index) in choose_list" :key="index" @click="orderBy(c_item.name)">{{c_item.name}}</p>
					<p @click="show" v-if="!shop_id">筛选 <span class="iconfont iconshaixuan"></span></p>
					
				</div>

			</view>
		</div>
		<div class="list-body" :class="listTop">
			<div class="tag" v-show="selectTag.city||selectTag.type||selectTag.is_fee||selectTag.status||selectTag.time">
				<div class="tag-item" v-if="selectTag.city">
					<span class="tag-name">{{selectTag.city}}</span>
					<image class="closeImg" :src="closeImg" @click="closeTag(4)"></image>
					<!-- <div class="close" @click="closeTag(4)">
						<span class="iconfont iconguanbi"></span>
					</div> -->
				</div>
				<div class="tag-item" v-if="selectTag.type">
					<span class="tag-name">{{selectTag.type}}</span>
					<image class="closeImg" :src="closeImg" @click="closeTag(1)"></image>
					<!-- <div class="close" @click="closeTag(1)">
						<span class="iconfont iconguanbi"></span>
					</div> -->
				</div>
				<div class="tag-item" v-if="selectTag.is_fee">
					<span class="tag-name">{{selectTag.is_fee}}</span>
					<image class="closeImg" :src="closeImg" @click="closeTag(2)"></image>
					<!-- <div class="close" @click="closeTag(2)">
						<span class="iconfont iconguanbi"></span>
					</div> -->
				</div>
				<div class="tag-item" v-if="selectTag.status">
					<span class="tag-name">{{selectTag.status}}</span>
					<image class="closeImg" :src="closeImg" @click="closeTag(3)"></image>
					<!-- <div class="close" @click="closeTag(3)">
						<span class="iconfont iconguanbi"></span>
					</div> -->
				</div>
				<div class="tag-item" v-if="selectTag.time">
					<span class="tag-name">{{selectTag.time}}</span>
					<image class="closeImg" :src="closeImg" @click="closeTag(5)"></image>
					<!-- <div class="close" @click="closeTag(5)">
						<span class="iconfont iconguanbi"></span>
					</div> -->
				</div>
			</div>
			<OnecolList :oneStudioList="activityList"></OnecolList>
			<!-- <div style="display:flex;justify-content:center;" v-if="activityList.length==0">暂无数据</div> -->
			<empty-show hasMenu="1" v-if="activityList.length==0&&!loading" :isShop="shop_id?'isShop':''"></empty-show>
		</div>

		<uni-popup ref="popupRef" type="top">
			<view class="chooseForm">
				<view class="uni-list-one" style="margin-bottom: 0;" v-if="!type">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							使用城市
						</view>
						<view class="uni-list-cell-db-one" @click="toPickCity">
							<view class="uni-input" >{{city.city}}</view>
							<view class="icon"></view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
				
				<view class="uni-list-one clear">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							活动时间
						</view>
						<view class="equipment">
							<div class="eqi-item" :class="item.active?'active':''" v-for="(item,idx) in activity_time" :key="idx" @click="timePick(item.name)">{{item.name}}
								<span class="icon"></span>
							</div>
						</view>
					</view>
				</view>
				<view class="uni-list-one clear">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							是否收费
						</view>
						<view class="equipment">
							<div class="eqi-item" :class="item.active?'active':''" v-for="(item,idx) in is_pay" :key="idx" @click="payPick(item.name)">{{item.name}}
								<span class="icon"></span>
							</div>
						</view>
					</view>
				</view>
				<view class="uni-list-one" style="margin-bottom: 0;">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							活动类型
						</view>
						<div class="equipment">
							<div class="eqi-item" :class="item.active?'active':''" v-for="(item,idx1) in activity_type " :key="idx1" @click="typePick(item.name)">
								{{item.name}}
								<span class="icon"></span>
							</div>
						</div>
					</view>
					<view class="clear"></view>
				</view>

				<view class="uni-list-one clear">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							活动状态
						</view>
						<div class="equipment">
							<div class="eqi-item" :class="item.active?'active':''" v-for="(item,idx1) in activity_status " :key="idx1" @click="statusPick(item.name)">
								{{item.name}}
								<span class="icon"></span>
							</div>
						</div>
					</view>
				</view>
			</view>
			<view class="choosebtn">
				<button plain="true" class="btn btnReset" @click="reset">重置</button>
				<button plain="true" class="btn btnSure" @click="sureClick">确定</button>
			</view>
		</uni-popup>

		
		
	</view>
</template>

<script>
	import {activity} from '@/common/api/api'
	import OnecolList from '@/components/onecol-list/onecol-list'
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
	export default {
		props:{
			type:String,
			shop_id:String,
			city_code:String
		},
		data() {
			return {
				closeImg:'../../../static/icon/close.png',
				activityList:[],
				params:{
					page:1,
					page_size:10,
					// city_code:'',
					type_time:0,
					// is_fee:0,
					// is_manual:0,
					// status:1,
					// order_by:'',
					// uid:'',
					// search:''
				},
				selectTag: {
					is_fee: '',
					type: '',
					status: '',
					city:'',
					time:''
				},
				city:{},
				choose_list:[
					{name:'默认',active:true,type:''},
					{name:'最热',active:false,type:1},
					{name:'最新',active:false,type:0},
				],
				activity_time:[
					{name:'全部',active:true,type:0},
					{name:'今天',active:false,type:1},
					{name:'明天',active:false,type:2},
					{name:'本周',active:false,type:3},
					{name:'本月',active:false,type:4},
				],
				is_pay:[
					{name:'不限',active:true,type:0},
					{name:'免费',active:false,type:1},
					{name:'收费',active:false,type:2},
				],
				activity_type:[
					{name:'不限',active:true,type:0},
					{name:'线上活动',active:false,type:1},
					{name:'线下活动',active:false,type:2},
				],
				activity_status:[
					{name:'不限',active:true,type:0},
					{name:'报名中',active:false,type:1},
					{name:'进行中',active:false,type:2},
					{name:'已结束',active:false,type:3},
				],
				addPage:false,
				isShop:true,
				isReachTop:false,
				loading:false
			}
		},
		computed: {
			listTop(){
				if(this.shop_id){
					return 'list-top0'
				}else{
					// #ifdef H5
					return 'list-top1'
					// #endif
					// #ifdef MP-WEIXIN || APP-PLUS ||MP-ALIPAY
					return 'list-top2'
					// #endif
				}
			},
			cssTop(){
				if(this.shop_id){
					// #ifdef H5
					return '88rpx'
					// #endif
					// #ifdef MP-WEIXIN
					return '88rpx'
					// #endif
				}else{
					// #ifdef H5
					return '88rpx'
					// #endif
					// #ifdef MP-WEIXIN || APP-PLUS
					return '0rpx'
					// #endif
				}
			}
		},
		components:{
			OnecolList,uniPopup
		},
		onShow() {
			if (this.util.getStorage('saveCity')) {
				this.city = this.util.getStorage('saveCity');
				this.params.city_code = this.util.getStorage('saveCity').code;
				// this.params.city = this.util.getStorage('saveCity').city;
				// this.util.delStorage('saveCity');
				//如果是默认全国，则删除清楚标签
				if(this.params.city==this.config.defaultCity.city){
					this.selectTag.city='';
				}else{
					this.selectTag.city=this.params.city;
				}
			}
			
		},
		onLoad(e) {
			console.log('eee',e.city)
			if(e.city){
				this.params.city_code =JSON.parse(e.city).code;
				this.city = JSON.parse(e.city);
			}
			if (e.search) {
				this.params.search = e.search;
			}
			this.getActivities();
		},
		mounted() {
			if(this.shop_id){
				this.params.uid = this.shop_id;
				this.isReachTop = false;
				this.params.cityCode = this.city_code;
				// this.isShop = 'shop';
			}else{
				this.isReachTop = true;
			}
			this.getActivities()
		},
		
		methods:{
			clearSearch(){
				this.params.search = '';
				this.searchChange();
			},
			toPickCity() {
				console.log('toPickCity----------', this.city);
				uni.navigateTo({
					url: '../select-city/select-city?city=' + JSON.stringify(this.city)
				})
			},
			getActivities(){
				uni.showLoading({title: '加载中'});
				this.loading = true;
				this.common.getActivityList(this.params).then(res=>{
					console.log('res',res);
					this.loading = false;
					if(res.rows.length==0&&this.activityList.length>0){
						uni.showToast({title: '无更多数据',duration: 2000,icon:'none'});
					}
					// else{
						if(this.addPage){
							this.activityList = this.activityList.concat(res.rows);
						}else{
							this.activityList = res.rows;
						}
					// }
					this.addPage = false;
					uni.hideLoading();
				}).catch(err=>{
					uni.hideLoading();
					this.loading = false;
				})
			},
			show() {
				this.$refs.popupRef.open(); // 或者 boolShow = rue
			},
			orderBy(data){
				this.choose_list.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.params.order_by = item.type;
					}else{
						item.active = false;
					}
				});
				this.params.page = 1;
				this.activityList = [];
				this.getActivities()
			},
			
			timePick(data){
				this.activity_time.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.params.type_time = item.type;
						if(item.type!=0){
							this.selectTag.time = item.name
						}else{
							this.selectTag.time = ''
						}
					}else{
						item.active = false;
					}
				})
				
			},
			payPick(data){
				this.is_pay.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.params.is_fee = item.type;
						if(item.type!=0){
							this.selectTag.is_fee = item.name
						}else{
							this.selectTag.is_fee = ''
						}
					}else{
						item.active = false;
					}
				})
			},
			typePick(data){
				this.activity_type.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.params.is_manual = item.type;
						if(item.type!=0){
							this.selectTag.type = item.name
						}else{
							this.selectTag.type = ''
						}
					}else{
						item.active = false;
					}
				})
			},
			statusPick(data){
				this.activity_status.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.params.status = item.type;
						if(item.type!=0){
							this.selectTag.status = item.name
						}else{
							this.selectTag.status = ''
						}
						
					}else{
						item.active = false;
					}
				})
			},
			sureClick(){
				this.params.page = 1;
				this.activityList = [];
				this.getActivities();
				this.$refs.popupRef.close();
			},
			reset(){

			},
			closeTag(val) {
				this.params.page = 1;
				switch(parseInt(val)){
					case 1:
						this.selectTag.type = '';
						this.params.is_manual = '0';
						this.typePick('0');
						break;
					case 2:
						this.selectTag.is_fee = '';
						this.params.is_fee = '0';
						this.payPick('0');
						break;
					case 3:
						this.selectTag.status = '';
						this.params.status = '0';
						this.statusPick('0');
						break;
					case 4:
						this.selectTag.city = '';
						this.params.city = '全国';
						this.params.city_code='0';
						break;
					case 5:
						this.selectTag.time = '';
						this.params.type_time='0';
						this.timePick('0')
						break;
				}
				this.getActivities();
			},
			searchChange(){
				this.params.page = 1;
				this.getActivities()
			},
			addPageOne(){
				this.addPage = true;
				this.params.page += 1;
				this.getActivities();
			},
			reachTop(){
				this.isReachTop = true;
			},
			notReachTop(){
				this.isReachTop = false;
			}
		},
		onPullDownRefresh:function(){
			this.params.page = 1;
			this.getActivities();
		 },
		 onReachBottom:function(){
			this.addPageOne();
		 },
	}
</script>

<style lang="scss">
page{
	background-color: #f8f8f8;
}
.fixed-top{
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 1;
	overflow: hidden;
}
.list-top0{
	position: relative;
	top: 0rpx;
}
.list-top1{
	position: relative;
	top: 200rpx;
}
.list-top2{
	position: relative;
	top: 200rpx;
}
.list-body{
	.tag {
		padding: 50rpx 30rpx 10rpx;
		background-color: #ffffff;
		margin-bottom: 20rpx;

		.tag-item {
			margin-right: 20rpx;
			display: inline-block;
			position: relative;
			margin-bottom:20rpx;
			.closeImg{
				position: absolute;
				top: -20rpx;
				right: -10rpx;
				width: 36rpx;
				height: 36rpx;
			}
			.close {
				position: absolute;
				display: flex;
				align-items: center;
				justify-content: center;
				top: -20rpx;
				right: -10rpx;
				color: #651FFF;
				background-color: #ffffff;
				border: 1px solid #651FFF;
				border-radius: 20rpx;
				padding: 5rpx;
				width: 26rpx;
				height: 26rpx;
				line-height: 26rpx;
				text-align:center;
				.iconfont {
					font-size:26rpx;
				}
			}
		}

		.tag-name {
			padding: 8rpx 30rpx;
			font-size: 14px;
			color: #651FFF;
			border: 1px solid #651FFF;
		}

		
	}
}
.select-title {
	font-size: 30rpx;
	background-color: #ffffff;
	border-bottom: 1px solid #f8f8f8;
	color: #333333;

	.active {
		color: #651FFF;
	}

	.choose {
		margin-left: 5rpx;
		padding-right: 40rpx;
	}

	.iconshaixuan {
		margin-left: 10rpx;
		font-size: 30rpx
	}
	.title-item{
		display: flex;
		p{
			padding: 10rpx 20rpx;
		}

	}
	.shop-item{
		padding: 30rpx 35rpx;
		justify-content: flex-start;
	}
	.list-item{
		padding: 30rpx;
		justify-content: space-between;
	}
	
}
.search-box{
	background-color: #ffffff;
	padding: 18rpx 30rpx 0;
	// border-top: 1px solid #f8f8f8;
	// display: flex;
	// align-items: center;
	// justify-content: space-between;
	.search {
		border: 1px solid #F0F0F0;
		background-color: #F0F0F0;
		padding: 10rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 10rpx;
		.search-input {
			flex: 1;
			input{
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				padding-left: 20rpx;
			}
			// text-align: center;
		}

		.iconfont {
			// font-size: 40rpx;
			color: #999999;
		}
		.iconsousuo{
			font-size: 40rpx;
		}
		.iconcuo{
			font-size: 36rpx;
			padding-left: 10rpx;
		}
	}
}
.chooseForm {
		margin: 30rpx 30rpx;
		font-size: 28rpx;
		padding-bottom: 150rpx;
	}

	.fixposition {
		margin-left: 9rpx;
	}

	.uni-list {
		width: 50%;
		margin-bottom: 20rpx;
		float: left;

		.uni-list-cell {
			.uni-list-cell-left {
				float: left;
				line-height: 55rpx;
			}

			.uni-list-cell-db {
				float: right;
				border: 1rpx solid #cccccc;
				border-radius: 4rpx;
				width: 65%;
				padding: 9rpx 20rpx 9rpx 0;
				text-align: center;
				position: relative;

				.icon {
					width: 0;
					height: 0;
					border: 10rpx solid transparent;
					border-top-color: #cccccc;
					position: absolute;
					top: 22rpx;
					right: 10rpx;
					content: '';
				}
			}
		}
	}

	.list-btn {
		width: 100%;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.minibtn {
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
		-webkit-user-select: none;
		-moz-user-focus: none;
		-moz-user-select: none;
		background: #f9f9f9;
		color: rgba(51, 51, 51, 1);
		border: 1rpx solid rgba(204, 204, 204, 1);
		border-radius: 6rpx;
		cursor: pointer;
		font-size: 30rpx;
		padding: 9rpx 16rpx;
		outline: none;
	}

	.focus {
		background: #4a8bff;
		border: 1px solid #4a8bff;
		color: #fff;
	}


	.uni-list-one {
		margin-bottom: 20rpx;
		overflow: hidden;

		.uni-list-cell-one {
			.uni-list-cell-left-one {
				display: block;
				font-size: 32rpx;
				font-weight: bold;
				line-height: 100rpx;
			}

			.uni-list-cell-db-one {
				// float: right;
				border: 1rpx solid #651FFF;
				border-radius: 4rpx;
				width: 25%;
				padding: 10rpx 20rpx;
				text-align: center;
				position: relative;
				color: #651FFF;
				.icon {
					width: 0;
					height: 0;
					border: 10rpx solid transparent;
					border-top-color: #651FFF;
					position: absolute;
					top: 22rpx;
					right: 10rpx;
					content: '';
				}
			}

			.uni-list-cell-db-brand {
				float: right;
				width: 75%;
				padding: 9rpx 20rpx 9rpx 0;
				text-align: left;
				@media only screen and (max-width: 320px) {
					.label {
						padding: 12rpx;
					}
				}
			}

			.uni-list-cell-db-one-range {
				// width: 74%;
				text-align: center;
				display: flex;
				justify-content: space-around;
				position: relative;
				// float: right;
				padding: 9rpx 20rpx 9rpx 0;
				text-align: center;
				position: relative;
				top: -6rpx;

				.uni-input0 {
					width: 250rpx;
					border: 1rpx solid #cccccc;
					padding: 2rpx 10rpx;
					color: #651FFF;
				}
				.uni-input{
					width: 250rpx;
					border: 1rpx solid #cccccc;
					padding: 10rpx 20rpx;
					color: #651FFF;
				}

				.uni-input1 {
					width: 250rpx;
					padding: 2rpx 10rpx;
					border: 1rpx solid #cccccc;
					color: #651FFF;
				}

				.line {
					width: 40rpx;
					height: 40rpx;
					position: relative;
					bottom: 10rpx;
					margin: 0 20rpx;
					border-bottom: 1rpx solid #cccccc;
				}
				
				
			}
			.equipment{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				.eqi-item{
					padding: 10rpx 40rpx;
					background: #F0F0F0;
					width: 120rpx;
					margin: 0 20rpx 20rpx 0;
					text-align: center;
				}
				.active{
					color: #651FFF;
					border: 1px solid #651FFF;
					position: relative;
					background-color: #ffffff;
					.icon {
						width: 0;
						height: 0;
						border: 8rpx solid;
						border-color: transparent #651FFF #651FFF transparent ;
						position: absolute;
						bottom:0;
						right: 0;
						content: '';
					}
				}
			}
			.studio-area{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				.studio-item{
					padding: 10rpx 40rpx;
					background: #F0F0F0;
					width: 200rpx;
					margin: 0 30rpx 20rpx 0;
					text-align: center;
				}
				.active{
					color: #651FFF;
					border: 1px solid #651FFF;
					position: relative;
					background-color: #ffffff;
					.icon {
						width: 0;
						height: 0;
						border: 8rpx solid;
						border-color: transparent #651FFF #651FFF transparent ;
						position: absolute;
						bottom:0;
						right: 0;
						content: '';
					}
				}
			}
		}
	}

	.clear {
		clear: both;
	}
	
	.range-size {
			position: relative;
			right: 3%;
			margin: 0 auto;
			width: 90%;
	}

	.uni-list-range {
		text-align: center;
		// float: right;
		.range-data {
			display: flex;
			justify-content: space-between;

			.data {
				position: relative;
				top: 25rpx;
				width: 80rpx;
			}
			
			.size {
				position: relative;
				top: 25rpx;
				width: 105rpx;
			}
			.line {
				border-left: 1rpx solid #cccccc;
				height: 20rpx;
				width: 80rpx;
				position: relative;
				left: 35rpx;
				top: 35rpx;
			}
		}
		
	}

	.choosebtn {
		display: flex;
		justify-content: space-between;
		// margin: 0 30rpx 30rpx;
		position: fixed;
		bottom: 0;
		width: 100%;

		.btn {
			font-size: 28rpx;
			height: 90rpx;
			line-height: 90rpx;

		}

		.btnReset {
			width: 50%;
			border: 1rpx solid #cccccc;
			text-align: center;
			background-color: #ffffff;
		}

		.btnSure {
			width: 50%;
			border: 1rpx solid #651FFF;
			color: #fff;
			background-color: #651FFF;
			text-align: center;
		}
		
		.btnSure:active {
			background-color: #651FFF;
		}
	}
</style>
