<template>
	<view class="home-content">
		<!-- 搜索栏 -->
		<div class="search-box">
			<div class="search" @click="gotoSearch">
				<span class="iconfont iconsousuo"></span>
				<span class="text">搜索影棚、器材、店铺</span>
				<!-- <input type="text" placeholder="搜索影棚、器材" class="search-input" placeholder-style="color:#999999;" 
					@blur="searchChange" /> -->
				<!-- <span class="iconfont iconcuo" @click="clearSearch"></span> -->
			</div>
		</div>
		<!-- 轮播图 -->
		<div class="banner-swiper">
			<SelfSwiper :banner="banner" :city="city"></SelfSwiper>
		</div>
		
		<!-- 搜索框 -->
		<div class="select-box">
			<div class="tab">
				<div class="tab-name" v-for="(item,index) in tab" :key="index" :class="item.active?'active':''" @click="tabClick(item.name)">{{item.name}}</div>
			</div>
			<swiper class="select-swiper" @change="selectSwiperChange" @touchend.stop :current="rent_type">
				<swiper-item v-for="(item,index) in 2" :key="index" circular >
					<!-- #ifndef MP-ALIPAY -->
					<div class="select-city item fontcolor1" @click="selectCity">
						<div class="city">{{city.city}}</div>
						<div class="area">
							<span class="iconfont iconhere"></span>
							<span>当前位置</span>
						</div>
					</div>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY -->
					<div class="select-city item fontcolor1" >
						<div class="city">{{city.city}}</div>
						<div class="area" @click="delCity" v-if="city.city != '全国'">
							<span class="iconfont iconcuo"></span>
							<span>取消选择</span>
						</div>
						<div class="area" @click="selectCity">
							<span class="iconfont iconhere"></span>
							<span>选择城市</span>
						</div>
					</div>
					<!-- #endif -->
					<div class="select-time"  @click="onShowDatePicker('range')">
						<div class="item fontcolor2">
							<div >
								<!--#ifdef MP-WEIXIN || APP-PLUS || MP-ALIPAY -->
								<picker mode="date" :value="start.start_date" @change="startDateChange" :start="currentDate">
									<view class="uni-input">
										<span class="date">{{start.start_date |dateTostr}}</span>
										<span class="week">{{start.week_str}}</span>
									</view>
								</picker>
								<!--#endif -->
								<!--#ifdef H5 -->
								<view class="uni-input">
									<span class="date">{{start.start_date |dateTostr}}</span>
									<span class="week">{{start.week_str}}</span>
								</view>
								<!--#endif -->
							</div>
							<div class="day">
								<span class="day-box">{{days}}天</span>
							</div>
							<div >
								<!--#ifdef MP-WEIXIN || APP-PLUS || MP-ALIPAY -->
								<picker mode="date" :value="end.end_date" @change="endDateChange" :start="start.start_date">
									<view class="uni-input">
										<span class="date">{{end.end_date | dateTostr}}</span>
										<span class="week">{{end.week_str}}</span>
									</view>
								</picker>
								<!--#endif -->
								<!--#ifdef H5 -->
								<view class="uni-input">
									<span class="date">{{end.end_date | dateTostr}}</span>
									<span class="week">{{end.week_str}}</span>
								</view>
								<!--#endif -->
								
							</div>
						</div>
					</div>
					<div class="select-price item fontcolor1" @click="openPrice">
						<div v-if="priceVal">{{priceVal}}</div>
						<div v-else class="priceRange">价格区间</div>
						<div>
							<span class="iconfont iconyoujiantou"></span>
						</div>
					</div>
					
				</swiper-item>
			</swiper>
			<view class="borrow-btn" @click="gotoRent">去租借</view>
		</div>
		<!-- 分类列表 -->
		<view class="category-list">
			<view class="category" v-for="(row, index) in categoryList" :key="index" @click="toCategory(row)">
				<!-- <view class="img" :style="'background-image:url('+row.img+')'"> -->
				<image :src="host+row.img" mode="aspectFit"></image>
				<!-- <view class="text" style="color:#ffffff;font-weight:bold;">{{ row.name }}</view>
        </view> -->
				<view class="text">{{ row.name }}</view>
			</view>
		</view>


		<!-- 优选好店 -->
		<div class="cat-block" v-if="shopList.length>0">
			<view class="title" style="padding-bottom:0">
				<span class="text">优选店铺</span>
			</view>
			<view class="shopScroll">
				<p class="shopCurrent">{{shopCurrentIndex}}/{{shopList.length}}</p>
				<scroll-view  scroll-x="true" @scroll.stop="shopScroll" @scrolltolower='shopTolower'  @touchend.stop>
					<view class="shopsHot">
						<div class="shop-item" v-for="(item,index) in shopList" :key="index" @click="goinShop(item.uid)">
							<div class="shop-img">
								<image :src="host + util.picExplode(item.pic)" mode="aspectFill" class="item-img" />
								<div class="item-info">
									<image :src="util.shopAvatarUtil(item.user.avatar)" mode="aspectFill" class="item-logo" />
									<p class="item-name">
										{{item.user.nick}}
									</p>
								</div>
							</div>
							<div class="shop-info">
								<p class="name" v-if="item.title">{{item.title}}</p>
								<!-- <p class="address" v-if="item.adv.address">{{item.adv.address}}</p>
								<p class="address" v-else>暂无地址</p> -->
							</div>
						</div>
					</view>
				</scroll-view>
			</view>
			
			<!-- <view  class="shopsHot">
				<div class="shop-item" v-for="(item,index) in shopList" :key="index" @click="goinShop(item.uid)">
					<div class="shop-img">
						<image :src="host + util.picExplode(item.pic)" mode="aspectFill" class="item-img" />
						<image :src="item.adv.logo?util.shopAvatarUtil(item.adv.logo):util.shopAvatarUtil(item.adv.avatar)" mode="aspectFill" class="item-logo" />
					</div>
					<div class="shop-info">
						<p class="name">{{item.user.nick}}</p>
						<p class="address" v-if="item.adv.address">{{item.adv.address}}</p>
						<p class="address" v-else>暂无地址</p>
					</div>
				</div>
				<div class="shop-item" @click="goinShopList">
					<div class="shop-img">
						<image :src="host + recmShop" mode="aspectFill" class="item-img" />
						<div class="list-title">
							<div class="icon-img">
								<image class="icon" :src="host + shopIcon" mode="aspectFill" />
							</div>
							<p class="i-title">优选好店</p>
						</div>
					</div>
					<div class="shop-info">
						<p class="line1">优选好店铺</p>
						<p class="line2">每一家都是精选优质店铺</p>
					</div>
				</div>
			</view> -->
		</div>

		<!-- 器材推荐列表 -->
		<div class="cat-block">
			<view class="title">
				<span class="text">热门器材</span>
			</view>
			<view v-if="equimentList.length>0" >
				<!-- <scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll">
					<view class="flex-view">
						<view class="view-item" v-for="(item,idx) in equimentList" :key="idx" @click="gotoDetail(item.id,1)">
							<image :src="host + util.picExplode(item.img)" mode="aspectFit" class="item-img" :onerror="util.errorPic">
							</image>
							<p class="item-name">{{item.name}}</p>
							<p class="item-price">
								<span style="font-size:10px">￥</span>
								<span style="font-size:14px">{{item.price}}</span>
								<span style="font-size:12px;color:#999999">/每小时</span>
							</p>
						</view>
						<view class="view-item1" @click="gocamera">
							查看更多
							<span class="iconfont iconyoujiantou"></span>
						</view>
					</view>
					
				</scroll-view> -->
				<div class="scroll-view_H">
					<view class="flex-view">
						<view class="view-item" v-for="(item,idx) in equimentList" :key="idx" @click="gotoDetail(item.id,1)">
							<image :src="host + item.img" mode="aspectFit" class="item-img" :onerror="util.errorPic">
							</image>
							<p class="item-name">
								<span v-text="item.custom_desc?item.custom_desc:item.name"></span>
							</p>
							<p class="item-price">
								<span style="font-size:10px">￥</span>
								<span style="font-size:14px" v-if="item.only_rent_day!='1'">{{ item.price }}</span>
								<span style="font-size:14px" v-else>{{ item.price_day_workday_in }}</span>
								<span style="font-size:12px;color:#999999" v-if="item.only_rent_day!='1'">/每小时</span>
								<span style="font-size:12px;color:#999999" v-else>/每天</span>
							</p>
						</view>
						<view class="see-more-btn" @click="gocamera">
							查看更多
							<!-- <span class="iconfont iconyoujiantou"></span> -->
						</view>
					</view>
					
				</div>
			</view>
			<div v-else class="noData">---{{noData}}---</div>
		</div>


		<!-- 影棚推荐列表 -->
		<div class="cat-block">
			<view class="title">
				<span class="text">专业影棚</span>
			</view>
			<view>
				<!-- <scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" v-if="studioList.length>0">
					<view class="flex-view">
						<view class="view-item" v-for="(item,idx) in studioList" :key="idx" @click="gotoDetail(item.id,2)">
							<image :src="host + util.picExplode(item.img)" mode="aspectFill" class="item-img1" @error="imgError(item.id,'studio')"/>
							
							<p class="item-name1">{{item.name}}</p>
							<p class="item-price">
								<span style="font-size:10px">￥</span>
								<span style="font-size:14px">{{item.price}}</span>
								<span style="font-size:12px;color:#999999">/每小时</span>
							</p>
						</view>
						<view class="view-item1" @click="gostudio">
							查看更多
							<span class="iconfont iconyoujiantou"></span>
						</view>
					</view>
					
				</scroll-view> -->
				<div class="studioHot"  v-if="studioList.length>0">
					<view class="studio-view">
						<view class="studio-item" v-for="(item,idx) in studioList" :key="idx" @click="gotoDetail(item.id,2)">
							<div class="studio-img">
								<image :src="host + item.img" mode="aspectFill" class="item-img" @error="imgError(item.id,'studio')"/>
								<div class="info">
									<span class="text">{{item.score}}分/{{item.floor}}楼.{{item.square}}m².{{item.total}}销量</span>
									
								</div>
							</div>
							
							<p class="item-name">{{item.name}}</p>
							<p class="item-price">
								<span class="price">￥{{item.price}}</span>
								<span class="per">/每小时</span>
							</p>
						</view>
						<view class="see-more-btn" @click="gostudio">
							查看更多
							<!-- <span class="iconfont iconyoujiantou"></span> -->
						</view>
					</view>
					
				</div>
				<div class="noData" v-else>---{{noData}}---</div>
			</view>
		</div>

		<!-- 活动推荐列表 -->
		<!-- <div class="cat-block">
			<view class="title title1">
				<div class="title-left">
					<span class="text">热门活动</span>
				</div>
			</view>
			<div class="activitys" v-if="activityList.length>0">
				<div class="activity-item" v-for="item in activityList" :key="item.id" @click="gotoDetail(item,3)">
					<div class="act-img">
						<image :src="host + item.pic" mode="aspectFill" class="item-img" @error="imgError(item.id,'activity')"/>
						<div class="info">
							<span class="iconfont icondizhi"></span>
							<span class="text">{{item.address}}</span>
						</div>
					</div>
					<div class="act-info">
						<p class="act-name">{{item.name}}</p>
						<p class="act-price" v-if="item.fee>0">￥{{item.fee}}</p>
						<p class="act-price" v-else>免费</p>
						
					</div>
				</div>
				<view class="see-more-btn" @click="toMore('activity')">
					查看更多
				</view>
			</div>
			<div class="nodata" v-else>---{{noData}}---</div>
		</div> -->

		<div class="cat-block flow-box">
			<view class="title title1">
				<div class="title-left">
					<span class="text">租赁指南</span>
				</div>
			</view>
			<div class="rent-box">
				<div class="left" @click="gotoRentFlow">
					<image class="rent-flow" :src="host+rentFlowPic"></image>
					<div class="rent-text">
						<p class="r-title">租赁流程</p>
						<p class="r-text">详细用户租赁流程解答</p>
					</div>
				</div>
				<div class="right">
					<div class="pick-box" @click="gotoPickFlow">
						<image class="pick-flow" :src="host+pickFlowPic"></image>
						<div class="p-text">
							<p class="r-title">取货流程</p>
						</div>
					</div>
					<!-- <web-view src="https://jinshuju.net/f/jg9L2r" class="rent-re-box"> -->
					<div class="rent-re-box" @click="gotoFeedback">
						<image class="rent-res" :src="host+rentResPic"></image>
						<div class="rent-r-text">
							<p class="r-title">意见反馈</p>
						</div>
					</div>
						
					<!-- </web-view> -->
				</div>
			</div>
		</div>

		<!-- <div class="new-service">
			<div class="service-tab" :class="fixedTop?'tab-fixed':''">
				<div  v-for="(item,index) in serviceTabs" :key="index" @click="serviceTabClick(item.name)" class="tab-item" :class="item.active?'active':''">{{item.name}}</div>
			</div>
			<div :class="fixedTop?'service-content':''"  v-show="serviceTabIndex==0">
				<twocol-list :List='serviceList1' :type="'2'" v-if="serviceList1.length>0"></twocol-list>
				<div :style="{'height':windowHeight}" v-else-if="!loading&&serviceList1.length==0">
					<empty-show hasMenu='1'></empty-show>
				</div>
			</div>	
			<div :class="fixedTop?'service-content':''" :style="{'height':windowHeight}" v-show="serviceTabIndex==1">
				<twocol-list :List='serviceList2' :type="'2'" v-if="serviceList2.length>0"></twocol-list>
				<div :style="{'height':windowHeight}" v-else-if="!loading&&serviceList2.length==0">
					<empty-show hasMenu='1'></empty-show>
				</div>
			</div>	
			<div :class="fixedTop?'service-content':''" :style="{'height':windowHeight}" v-show="serviceTabIndex==2">
				<twocol-list :List='serviceList3' :type="'2'" v-if="serviceList3.length>0"></twocol-list>
				<div :style="{'height':windowHeight}" v-else-if="!loading&&serviceList3.length==0">
					<empty-show hasMenu='1'></empty-show>
				</div>
			</div>	
			<div :class="fixedTop?'service-content':''" :style="{'height':windowHeight}" v-show="serviceTabIndex==3">
				<twocol-list :List='modelList' :type="'1'" v-if="modelList.length>0"></twocol-list>
				<div :style="{'height':windowHeight}" v-else-if="!loading&&modelList.length==0">
					<empty-show hasMenu='1'></empty-show>
				</div>
			</div>	
		</div> -->
		
		<uni-popup ref="popupprice" type="bottom">
			<view class="uni-list-one">
				<view class="uni-list-cell-one">
					<div class="priceRange">
						<div class="uni-list-cell-left-one">价格范围</div>
						<div class="confirm"  @click="pricePick(priceIndex,true)">确定</div>
					</div>
					<div class="studio-area">
						<!-- <div class="studio-item" :class="item.active?'active':''" v-for="(item,idx1) in prices " :key="idx1" @click="pricePick(item.name)"> -->
						<div class="studio-item" :class="item.active?'active':''" v-for="(item,idx1) in prices " :key="idx1" @click="pricePick(item.name,false)">
							{{item.name}}
							<span class="icon"></span>
						</div>
					</div>
				</view>
				<view class="clear"></view>
			</view>
		</uni-popup>

		<uni-popup ref="popupActivity" type="center" class="popupActivity" :lucency="true">
			<act-popup @close="closePopupActivity"></act-popup>
		</uni-popup>
		
		<!-- #ifdef H5 -->
		 <mx-datepicker 
		 :show="showPicker" 
		 :type="type" 
		 :value="value" 
		 :show-tips="true" 
		 :begin-text="'开始'" 
		 :end-text="'结束'" 
		 :show-seconds="true" 
		 @confirm="onSelected" 
		 @cancel="onSelected"
		 :selectable="true" />
		 <!-- #endif -->
		<!-- <div class="max-bottom">到底啦~</div> -->
		<div id="postion" class="postion"></div>
	</view>
</template>

<script>
	import permision from "@/js_sdk/wa-permission/permission.js"

	import {
		studio,
		equipment,
		activity,
		user,
		advertise,
		city,
		service,
		model
	} from "@/common/api/api";
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue";
	import twoColList from '@/components/twocol-list/twocol-list.vue';
	//轮播
	import SelfSwiper from "@/components/self-swiper/self-swiper";
	// 优惠弹框
	import actPopup from "@/components/act-popup/act-popup";
	//高德SDK
	// #ifdef MP-WEIXIN
	import amap from "@/common/SDK/amap-wx";
	import { weixin } from "@/common/login/login";
	// #endif
	// #ifdef H5
	import {
		lazyAMapApiLoaderInstance
	} from "vue-amap";
	import datetimePicker from "@/components/datetime-picker/datetime-picker.vue"
	import mxDatepicker from "@/components/mx-datepicker/mx-datepicker.vue"
	// #endif
	
	import { errorPic } from '@/common/utils/config'
	import {mapState} from 'vuex'
	export default {
		data() {
			const currentDate = this.util.getDate();
			const currentTime = this.util.getTime();
			return {
				map: null,
				noData: this.config.noData,
				days: 1,
				host: this.$qiniuHost,
				recmShop:this.config.recmShop,
				shopIcon:this.config.shopIcon,
				rentFlowPic:this.config.HRentFlow,
				pickFlowPic:this.config.HPickFlow,
				rentResPic:this.config.HRentQus,
				afterHeaderOpacity: 1, //不透明度
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				banner:[
					{id:'6',key:this.config.bannerHome6},
					{id:'5',key:this.config.bannerHome0},
					{id:'0',key:this.config.bannerHome5},
					{id:'1',key:'109-1581493883095.png'},
					{id:'2',key:this.config.bannerHome3},
					{id:'3',key:'109-1575859646201.png'},
					{id:'4',key:'109-1575859085115.png'},
				],
				city:this.config.defaultCity,
				// 分类菜单
				categoryList: [
					{
						url: "service",
						name: "拍摄",
						img: 'images/miniapp/categories/service.png'
					},
					// {
					// 	url: "pinpai",
					// 	name: "拼拍",
					// 	img: 'images/miniapp/categories/pinpai.png'
					// },
					{
						url: "studio",
						name: "场地",
						img: 'images/miniapp/categories/studio.png'
					},
					{
						url: "equipment",
						name: "器材",
						img: 'images/miniapp/categories/equip.png'
					},
					
					{
						url: "model",
						name: "模特",
						img: 'images/miniapp/categories/model.png'
					},
					// {
					// 	url: "discount",
					// 	name: "优惠券",
					// 	img: "images/miniapp/categories/equip.png"
					// },
					// {
					// 	url: "activity",
					// 	name: "活动",
					// 	img: '/static/icon/activity_image.png'
					// }
				],
				tab: [{
						name: "影棚",
						active: true,
						type: 0
					},
					{
						name: "器材",
						active: false,
						type: 1
					}
				],
				rent_type: 0,
				shopList:[],
				studioList: [],
				equimentList: [],
				activityList: [],
				start: {
					start_date: currentDate,
					start_time: currentTime,
					day: "",
					week_str:this.util.getWeek()
				},
				currentDate: currentDate,
				end: {
					end_date: currentDate,
					end_time: currentTime,
					day: "",
					week_str:this.util.getWeek()
				},
				prices: this.config.pricesRange,
				priceVal: "",
				priceIndex: 0,
				param: {
					city: {},
					start_time: "",
					end_time: "",
					price: ""
				},
				showPicker: false,
                type: 'range',
				value: '',
				windowHeight:'',
				emptyHeight:'',
				shopCurrentIndex:2,
				serviceTabs:[
					{name: "平面摄影",active: true,type: 0},
					{name: "视频拍摄",active: false,type: 1},
					{name: "后期处理",active: false,type: 2},
					{name: "模特",active: false,type: 3},
				],
				serviceTabIndex:0,
				s_params1:{page:1,page_size:10,category_id:1},
				serviceList1:[],
				s_params2:{page:1,page_size:10,category_id:2},
				serviceList2:[],
				s_params3:{page:1,page_size:10,category_id:3},
				serviceList3:[],
				loading:false,
				fixedTop:false,
				flowTop:1000,
				modelList:[],
				m_params:{page:1,page_size:10},
			};
		},
		components: {
			SelfSwiper,
			uniPopup,
			actPopup,
			twoColList,
			// #ifdef H5
			datetimePicker,
			mxDatepicker
			// #endif
		},
		computed:{
			...mapState(['user']),
		},
		filters:{
			dateTostr(val){
				let arr = val.split('-');
				return `${arr[1]}月${arr[2]}日`
			}
		},
		
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: '派图租赁',
				path: '/pages/tabBar/home'
			}
		},
		watch:{
			start:{
				handler(newVal, oldVal) {
					// console.log('开始时间变化 '+newVal)
					let startTem = this.util.toTimestamp(this.start.start_date);
					let endTem = this.util.toTimestamp(this.end.end_date);
					if(startTem>endTem){
						this.end.end_date = this.start.start_date
					}
					//console.log('计算天数差',this.start.start_date,this.end.end_date);
					this.days = this.util.dayCount(this.start.start_date, this.end.end_date);
					this.start.week_str = this.util.getWeek(this.start.start_date)
					this.end.week_str = this.util.getWeek(this.end.end_date)
					// console.log('开始时间变化计算days'+this.days);
		　　　　},
		　　　　deep: true
			},
			end:{
				handler(newVal, oldVal) {
					// console.log(newVal)
					let startTem = this.util.toTimestamp(this.start.start_date);
					let endTem = this.util.toTimestamp(this.end.end_date);
					if(startTem>endTem){
						this.end.end_date = this.start.start_date
					}
					//计算两个时间天数
					this.days = this.util.dayCount(this.start.start_date, this.end.end_date);
					this.start.week_str = this.util.getWeek(this.start.start_date)
					this.end.week_str = this.util.getWeek(this.end.end_date)
					// console.log('结束时间变化计算days'+this.days);
		　　　　},
		　　　　deep: true
			},
			flowTop(val){
				if(val<=-190){
					this.fixedTop = true;
				}else{
					this.fixedTop = false
				}
			}
			
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + "px";
			this.getFlowTop()
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			this.getSystemInfo()

			// #ifdef APP-PLUS
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
			// #ifdef MP-WEIXIN
			this.amapPlugin = new amap.AMapWX({
				//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
				key: this.config.amapKey
			});
			//定位地址
			// this.amapPlugin.getRegeo({
			// 	success: data => {
			// 		console.log("location", data);
			// 		let address = data[0].regeocodeData.addressComponent;
			// 		let city = {
			// 			city: address.city,
			// 			code: address.citycode,
			// 			province: address.province,
			// 			province_code: address.adcode.substring(0, 2)
			// 		};
			// 		this.city = city;
			// 		this.getListData();
			// 	}
			// });
			// #endif
			// #ifdef H5
			// console.log("H5定位");
			// let _loadApiPromise = lazyAMapApiLoaderInstance.load();
			// _loadApiPromise.then(() => {
			// 	this.init();
			// });
			// #endif
			this.start.day = this.end.day = this.util.getWeek();
			this.getListData();
		},
		onShow() {
			// #ifdef APP-PLUS
			//this.requestAndroidPermission('android.permission.ACCESS_FINE_LOCATION');
			// document.addEventListener('plusready', function(){  
			//     // 页面加载时触发  
			//  //    var pinf = plus.push.getClientInfo();  
			// 	// console.error('pinf = '+JSON.stringify(pinf))
			//  //    var cid = pinf.clientid;//客户端标识  
			// 	// console.error('cid = ' + cid);
				
			// }, false );
			
			//保存push标识
			// let clientInfo = plus.push.getClientInfo();
			// console.error('PUSH TOKEN = '+JSON.stringify(clientInfo))
			// if(clientInfo){
			// 	this.$store.commit('update_user_push_token',clientInfo.token)
			// } else {
			// 	console.error('同步获取标识失败');
			// }
			plus.push.getClientInfoAsync(function(clientInfo){
			   console.error('PUSH TOKEN = '+JSON.stringify(clientInfo))
			   this.$store.commit('update_user_push_token',clientInfo.token)
			 }, function(e){
			   console.error('异步获取标识失败');
			   console.log(JSON.stringify(e));
			 })
			// uni.showModal({
			// 	title: '提示',
			// 	content: JSON.stringify(a),
			// 	showCancel:false,
			// });
			// #endif
			// 退出登录跳转回首页的同时也要把IM聊天给退出
			if(!this.user.paitume_user&&this.$IM.IM){
				// this.$IM.IM.close().then(function() {
				// 	console.warn('IM聊天下线');
				// }).catch(err=>{console.error(err,'聊天退出失败')});
			}
			// this.getLocation();
			//默认为全国(暂时用法)
			if (this.util.getStorage('saveCity')) {
				this.city=this.util.getStorage('saveCity');
				// console.log('saveCity------',this.city)
			}else{
				this.util.setStorage('saveCity',this.config.defaultCity);
			}
			// this.getImg()
			// #ifdef H5
			this.$wechatShare.share({  
				title:'派图么',
				desc: '派图么影棚设备租赁平台',  
				// img: this.host+this.studioDetail.pics[0]
			});
			// #endif
			//首页显示后登录
			// 微信登录
			//#ifdef  MP-WEIXIN
			if(!this.$store.getters.is_login_in){
				// this.$store.commit('update_origin', 'mx-weixin'); //请求头
				this.$store.commit('update_origin', 'mp-weixin'); //请求头
				weixin();
				this.$store.commit('update_store_appid', uni.getAccountInfoSync().miniProgram.appId); //请求头
			} else {
				//如果没有IM 登录
				if(this.$IM.IM == null){
					this.$store.dispatch('pimLogin')
				}
			}
			//#endif 
			
			//#ifdef APP-PLUS
			this.$store.commit('update_origin', 'app-normal');
			if(this.$store.getters.is_login_in){
				if(this.$IM.IM == null){
					console.log('APP有用户数据 登录IM');
					this.$store.dispatch('pimLogin')	
				} else {
					console.log('IM已经有了');
				}
			} else {
				console.log('没有用户数据 无法登录IM');
			}
			//#endif
		},
		// mounted() {
		// 	// this.$refs.popupActivity.open();
		// 	if(!(this.user&&this.user.paitume_user)){
		// 		// this.$refs.popupActivity.open();
		// 	}
		// },
		methods: {
			async requestAndroidPermission(permisionID) {
			    var result = await permision.requestAndroidPermission(permisionID)
			    var strStatus
			    if (result == 1) {
			        strStatus = "已获得授权"
			    } else if (result == 0) {
			        strStatus = "未获得授权"
			    } else {
			        strStatus = "被永久拒绝权限"
			    }
			    uni.showModal({
			        content: permisionID + strStatus,
			        showCancel: false
			    });
			},

			closePopupActivity(){
				this.$refs.popupActivity.close();
			},
			getSystemInfo() {
				uni.getSystemInfo().then(res => {
					let [error, data] = res
					this.windowHeight = `${data.windowHeight}px`
					this.emptyHeight = `${data.windowHeight-102}px`
					// console.log('this.windowHeight--',this.windowHeight)
				})
			},
			gotoSearch(){
				uni.navigateTo({url:'/pages/home/search/search'})
			},
			imgError(id,type){
				if(type=='studio'){
					let ret = this.studioList.findIndex(e=>e.id==id);
					let arr = this.studioList[ret];
					if(ret!=-1){
						this.studioList[ret].img = errorPic
					}
					this.studioList.splice(ret,1,arr)
				}else if(type=='activity'){
					let ret = this.activityList.findIndex(e=>e.id==id);
					let arr = this.activityList[ret];
					if(ret!=-1){
						this.activityList[ret].pic = errorPic
					}
					this.activityList.splice(ret,1,arr)
				}
				
			},
			onShowDatePicker(type){//显示
				// #ifdef H5
                this.type = type;
                this.showPicker = true;
				this.value = this[type];
				// #endif
            },
            onSelected(e) {//选择
                this.showPicker = false;
                if(e) {
					this[this.type] = e.value; 
                    //选择的值
					console.log('value => '+ e.value);
					this.start.start_date = this[this.type][0].split(' ')[0].replace(/\//g, '-');
					this.end.end_date = this[this.type][1].split(' ')[0].replace(/\//g, '-');
					this.days = this.util.dayCount(this.start.start_date, this.end.end_date);
                }
            },
			openStartDate(){
				this.$refs.startDatePicker.show()
			},
			openEndDate(){
				this.$refs.endDatePicker.show()
			},
			goinShopList(){
				uni.navigateTo({url: '/pages/merchant/shop/shopList'})
			},
			goinShop(data){
				uni.navigateTo({url:'/pages/merchant/shop/shop?id='+data})
			},
			gocamera() {
				let params = {
					city: this.city,
				}
				uni.navigateTo({
					url: '/pages/home/category/equipment?options=' + JSON.stringify(params)
				})
			},
			gostudio() {
				let params = {
					city: this.city,
				}
				uni.navigateTo({
					url: '/pages/home/category/studio?options=' + JSON.stringify(params)
				})
			},
			// #ifdef H5
			init() {
				try {
					this.map = new AMap.Map("postion", {
						resizeEnable: true
					});
					let geocoder = new AMap.Geocoder();
					let param = this.map.getCenter();
					console.log('initMap--map--',this.map) 
					console.log('initMap--PARAM--',param)
					geocoder.getAddress(this.map.getCenter(), (status, result) => {
						console.log("高德H5", result);
						console.log("高德H5", status);
						if (status === "complete" && result.info === "OK") {
							let data = result.regeocode.addressComponent;
							let city = {
								city: data.city == "" ? data.province : data.city,
								code: data.citycode,
								province: data.province,
								province_code: data.adcode.substring(0, 2)
							};
							alert("高德定位" + JSON.stringify(city));
							this.city = city;
						} else {
							alert("哦吼，定位失败");
						}
					});
				} catch (err) {
					console.log(err);
				}
			},
			// #endif
			//获取localtion位置

			getLocation() {
				if (this.util.getStorage("saveCity")) {
					this.city = this.util.getStorage("saveCity");
					this.util.delStorage("saveCity");
					this.getListData();
				}
			},
			// 获取首页banner
			getImg(){
				this.$http.get(picture.banner,{uid:0}).then(res => {
					let obj = {id:'1',key:'109-1575702872103.png',url: "https://pic.paitume.com/"};
					
					this.banner = res.splice(1,2);
					this.banner.unshift(obj)
				}).catch(err=>{})
			},
			//获取列表数据
			getListData() {
				this.getShopList();
				this.getStudios();
				this.getEquiments();
				// this.getActivitys();
				// this.initServiceList();
				// this.getModelList()
			},
			getShopList(){
				let params = {
					page_size:100,
					position:0,
					type:4
				};
				this.$http.get(advertise.getList,params).then(res => {
					this.shopList = res.rows;
				}).catch(err => {
					console.log(err)
				})
			},
			
			getStudios() {
				let param = {
					page: 1,
					page_size: 5,
				};
				this.common.getStudioList(param).then(res => {
					// console.log('studioList-------------',res);
					this.studioList = res.rows;
					this.studioList.forEach(item => {
						item.price = item.priceWorkDayWorkTimePerHour;
						if (item.pic.split(",").filter(v=>{return v}).length > 0) {
							item.img = item.pic.split(",").filter(v=>{return v})[0];
						}
					});
				}).catch(err => {

				});
			},
			getEquiments() {
				let param = {
					page: 1,
					page_size: 6,
					borrow_type:'0'
				};
				this.common.getEquipList(param).then(res => {
					// console.log("getEquipList--------------", res);
					this.equimentList = res.rows;
					this.equimentList.forEach(item => {
						if (item.pic.split(",").filter(v=>{return v}).length > 0) {
							item.img = item.pic.split(",").filter(v=>{return v})[0];
						}
					});
				}).catch(err => {});
			},
			getActivitys() {
				let param = {
					page: 1,
					page_size: 4,
				};
				this.$http
					.get(
						activity.getList,
						param
					)
					.then(res => {
						this.activityList = res.rows;
					})
					.catch(err => {});
			},

			initServiceList(){
				this.getServiceList1();
				this.getServiceList2();
				this.getServiceList3();
			},
			getServiceList1(){
				this.loading = true;
				this.$http.get(service.getList,this.s_params1).then(res => {
					if(res.rows.length>0){
						if(this.serviceList1.length>0){
							this.serviceList1 = this.serviceList1.concat(res.rows)
						}else{
							this.serviceList1 = res.rows;
						}
					}
					this.loading = false;
				}).catch(err => {
					this.loading = false;
				})
			},
			getServiceList2(){
				this.loading = true;
				this.$http.get(service.getList,this.s_params2).then(res => {
					if(res.rows.length>0){
						if(this.serviceList2.length>0){
							this.serviceList2 = this.serviceList2.concat(res.rows)
						}else{
							this.serviceList2 = res.rows;
						}
					}
					this.loading = false;
				}).catch(err => {
					this.loading = false;
				})
			},
			getServiceList3(){
				this.loading = true;
				this.$http.get(service.getList,this.s_params3).then(res => {
					if(res.rows.length>0){
						if(this.serviceList3.length>0){
							this.serviceList3 = this.serviceList3.concat(res.rows)
						}else{
							this.serviceList3 = res.rows;
						}
					}
					this.loading = false;
				}).catch(err => {
					this.loading = false;
				})
			},
			getModelList(){
				this.loading = true;
				this.$http.get(model.getModel,this.m_params).then(res => {
					if(res.rows.length>0){
						if(this.modelList.length>0){
							this.modelList = this.modelList.concat(res.rows)
						}else{
							this.modelList = res.rows;
						}
					}
					this.loading = false;
				}).catch(err => {
					this.loading = false;
				})
			},
			shopScroll(e){
				// #ifdef H5
				if (e && e.stopPropagation) {
					e.stopPropagation() 
				} else  {
					window.event.cancelBubble = true 
				}
				 if (e && e.preventDefalut) {
					 e.preventDefalut() 
				 } else{
					 window.event.retuenValue = false 
				 }
				// #endif
				let add = parseInt((e.detail.scrollLeft - 125)/160);
				if(e.detail.scrollLeft >= 125){
					add+=1
				}
				this.shopCurrentIndex = 2 + add;
			},
			// 防止误差
			shopTolower(e){
				this.shopCurrentIndex = this.shopList.length;
			},
			selectSwiperChange(e){
				if(!e.detail.current){
					this.tabClick('影棚')
				}else{
					this.tabClick('器材')
				}
				
			},
			// 搜索tab切换
			tabClick(data) {
				this.tab.forEach(item => {
					if (item.name == data) {
						item.active = true;
						this.rent_type = item.type;
					} else {
						item.active = false;
					}
				});
			},
			//去租借方法，跳到影棚/设备列表
			gotoRent() {
				let params = {
					city: this.city,
					priceIndex: this.priceIndex,
					dateStart: this.start.start_date,
					dateEnd: this.end.end_date
				}
				if (this.rent_type == 0) {
					console.log('params------------', params);
					uni.navigateTo({
						// url: '../home/category/studio?city='+JSON.stringify(this.city)
						url: '/pages/home/category/studio?options=' + JSON.stringify(params)
					});
				} else {
					uni.navigateTo({
						// url: '../home/category/equipment?city='+JSON.stringify(this.city)
						url: '/pages/home/category/equipment?options=' + JSON.stringify(params)
					});
				}

			},
			//搜索跳转
			toSearch() {
				uni.showToast({
					title: "搜索功能"
				});
			},
			//筛选
			repeated() {
				uni.showToast({
					title: "筛选功能"
				});
			},
			//选择城市
			selectCity() {
				// #ifdef MP-ALIPAY
				my.chooseCity({
				      showLocatedCity: true,
				      showHotCities: true,
				      success: (res) => {
				        let adminCode = res.adCode;
						this.$http.get(city.getByAdminCode,{admin_code:adminCode}).then(cityRes => {
							 this.city = cityRes;
							 this.util.setStorage('saveCity',this.city);
						}).catch(err=>{})
				      },
				    });
				// #endif
				console.log("###### selectCity");
				// uni.chooseLocation({
				//   success: function(res) {
				//     console.log("位置名称：" + res.name);
				//     console.log("详细地址：" + res.address);
				//     console.log("纬度：" + res.latitude);
				//     console.log("经度：" + res.longitude);
				//   }
				// });
				// return;
				// #ifndef MP-ALIPAY
				uni.navigateTo({
					url: '../home/select-city/select-city?city=' + JSON.stringify(this.city)
				})
				// #endif
			},
			delCity(){
				this.city = this.config.defaultCity;
				this.util.delStorage("saveCity");
			},
			//分类跳转
			toCategory(e) {
				//uni.showToast({title: e.name,icon:"none"});
				let params = {
					city: this.city
				};
				// uni.navigateTo({
				// 	url: "../home/category/" + e.url + "?options=" + JSON.stringify(params)
				// });
				if(e.url=='model'){
					uni.showToast({title:'功能开发中！',icon:'none'})
				}else{
					uni.navigateTo({
						url: "../home/category/" + e.url + "?options=" + JSON.stringify(params)
					});
				}
				
			},
			//更多跳转
			toMore(e) {
				//uni.showToast({title: e.name,icon:"none"});
				let params = {
					city: this.city
				};
				uni.navigateTo({
					// url: '../home/category/' + e +'?city='+JSON.stringify(this.city)
					url: "../home/category/" + e + "?options=" + JSON.stringify(params)
				});
			},
			scroll() {},
			gotoDetail(data, type) {
				if (type === 2) {
					uni.navigateTo({
						url: "/pages/home/category/studioDetail/studioDetail?studio_id=" + data
					});
				} else if (type === 1) {
					uni.navigateTo({
						url: "/pages/home/category/equipmentDetail/equipmentDetail?equip_id=" +
							data
					});
				} else if (type === 3) {
					uni.navigateTo({
						url: "/pages/home/category/activityDetail/activityDetail?activity_id=" +
							data.id + '&name=' + data.name
					});
				}
			},
			startDateOnConfirm(e){
				this.start.start_date = e;
				console.log('eezxxxe',e)
			},
			endDateOnConfirm(e){
				this.end.end_date = e;
			},
			startDateChange(e) {
				this.start.start_date = e.detail.value;
			},
			endDateChange(e) {
				this.end.end_date = e.detail.value;
				
			},
			startTimeChange(e) {
				this.start.start_time = e.detail.value;
			},
			endTimeChange(e) {
				this.end.end_time = e.detail.value;
			},
			openPrice() {
				console.log('openPrice----------',this.priceVal);
				this.prices.forEach((item,index)=>{
					if(this.priceVal==item.name){
						this.priceIndex = item.type;
						item.active=true;
					}else{
						item.active=false;
					}
				})
				console.log('priceIndex----------',this.priceIndex);
				this.$refs.popupprice.open();
			},
			pricePick(data,type) {
				console.log('data--------',data,type);
				this.prices.forEach(item => {
					if (item.name == data || item.type==data) {
						item.active = true;
						this.priceIndex = item.type;
						if(type){
							this.priceVal = item.name;
							this.$refs.popupprice.close();
						}
					} else {
						item.active = false;
					}
				});
			},
			gotoRentFlow(){
				uni.navigateTo({url:'/pages/home/flow/rentFlow'})
			},
			gotoPickFlow(){
				uni.navigateTo({url:'/pages/home/flow/pickFlow'})
			},
			gotoFeedback(){
				uni.navigateTo({url:'/pages/home/flow/feedback'})
			},

			serviceTabClick(data){
				this.serviceTabs.forEach(item => {
					if (item.name == data) {
						item.active = true;
						this.serviceTabIndex = item.type;
					} else {
						item.active = false;
					}
				});
			},
			getFlowTop(){
				const query = uni.createSelectorQuery()
				query.select('.flow-box').boundingClientRect(data => {
					this.flowTop = data.top
				}).exec();
			},
		}
	};
</script>

<style lang="scss" scoped>
	.home-content{
		overflow-x:hidden;
		/*  #ifdef  H5  */
		padding-bottom: 110rpx;
		/*  #endif  */
	}
	.search-box{
		background-color: #ffffff;
		position: fixed;
		top: 0;
		z-index: 10;
		width: 100%;
		border-top: 1px solid #f8f8f8;
		.search {
			border: 1px solid #F0F0F0;
			background-color: #F0F0F0;
			padding: 10rpx 20rpx;
			/* #ifdef APP-PLUS  */
			margin: 70rpx 30rpx 17rpx;
			/*  #endif  */
			/*  #ifdef MP_WEIXIN || H5 || MP-ALIPAY */
			margin: 17rpx 30rpx;
			/*  #endif  */
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #999999;
			border-radius: 10rpx;
			.search-input {
				flex: 1;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				padding-left: 20rpx;
				// text-align: center;
			}

			.iconfont {
				// font-size: 40rpx;
				color: #999999;
				margin-right: 25rpx;
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
	.banner-swiper{
		/* #ifdef APP-PLUS  */
		margin-top: 150rpx;
		/*  #endif  */
		/*  #ifdef MP_WEIXIN || H5 || MP-ALIPAY */
		margin-top: 105rpx;
		/*  #endif  */
		
	}

	.select-box {
		position: relative;
		z-index: 1;
		background-color: #fff;
		padding: 0  30rpx 30rpx;
		.tab {
			display: flex;
			justify-content: space-around;
			// border-bottom: 1px solid #d9d9d9;
			border-bottom: 20rpx;
			.tab-name {
				font-size: 40rpx;
				// padding: 10rpx;
				padding: 25rpx 50rpx;
				font-weight: 600;
				position: relative;
			}

			.active::after {
				width: 55rpx;
				height: 6rpx;
				content: "";
				position: absolute;
				bottom: 10rpx;
				background-color: #651FFF;
				left:62rpx;
			}
		}
		.select-swiper{
			height: 350rpx;
		}
		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}

		.select-city,
		.select-price {
			font-size: 16px;
			margin: 20rpx 0rpx;
			padding: 0rpx 40rpx;
			height:98rpx;
			line-height: 98rpx;
			background-color: #F0F0F0;
			border-radius: 8rpx;
			.city{
				font-size:16px;
				font-weight:600;
				color:#333;
			}
			
		}
		.select-city{
			align-items:center;
			.area{
				font-size: 20rpx;
			}
		}
		.select-price {
			border-color: #D9D9D9;

			.priceRange {
				color: #999999;
			}
		}

		.select-time {
			font-size: 15px;
			padding: 0rpx 40rpx;
			border-radius: 8rpx;
			height: 98rpx;
			line-height: 98rpx;
			background-color: #F0F0F0;
			.text {
				color: #999999;
			}
		}

		.fontcolor1 {
			color: #333333;
		}

		.fontcolor2 {
			color: #333333;
			.uni-input{
				.date{
					font-size: 36rpx;
					font-weight: bold;
					margin-right: 10rpx;
				}
				.week{
					font-size: 26rpx;

				}
			}
		}

		.day {
			display: flex;
			align-items: center;

			span {
				display: inline-block;
			}

			.day-box {
				color: #333333;
				width: 108rpx;
				text-align: center;
				height: 48rpx;
				line-height: 48rpx;
				border: 1rpx solid #333333;
				border-radius: 30rpx;
			}

			.dot {
				width: 8rpx;
				height: 8rpx;
				border-radius: 8rpx;
				background-color: #651fff;
			}

			.line {
				width: 20rpx;
				height: 2rpx;
				background-color: #651fff
			}
		}

		.borrow-btn {
			line-height: 88rpx;
			margin: 20rpx 0;
			background-color: #651fff;
			color: #fff;
			font-size: 18px;
			text-align: center;
			border-radius:50rpx;
		}
	}

	.category-list {
		padding: 0rpx 30rpx 30rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		background-color: #ffffff;
		margin-top: 20rpx;
		.category {
			width: 60rpx;
			// width: 80rpx;
			margin-top: 20rpx;
			padding: 0px 20rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			// margin-right: 20rpx;
			.img {
				background-size: 100%;
				// width: 80rpx;
				// height: 80rpx;
				width: 60rpx;
				height: 60rpx;
				display: flex;
			}

			.text {
				margin-top: 16rpx;
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 26rpx;
				color: #333333;
			}

			image {
				height: 100rpx;
			}
		}
	}

	.cat-block {
		padding: 30rpx 0 40rpx;
		background-color: #ffffff;
	}
	.max-bottom{
		font-size:14px;
		color:#999999;
		width:100%;
		text-align:center;
		height:60rpx;
		background-color: #ffffff;
	}

	.space {
		height: 20rpx;
		background: #F8F8F8;
	}

	.title1 {
		display: flex;
		justify-content: space-between;
	}

	.title {
		padding: 40rpx 30rpx;
		// text-align: center;
		font-size: 48rpx;
		margin-top: 10rpx;

		.title-icon {
			display: inline-block;
			width: 8rpx;
			height: 36rpx;
			background-color: #651fff;
			border-radius: 5rpx;
		}


		.text {
			// padding: 0 6%;
			font-weight: bold;
			bottom: 5rpx;
			position: relative;
		}

		.right {
			font-size: 14px;
			color: #999999;
		}
	}
	.see-more-btn{
		font-size: 14px;
		color: #323333;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		border: 1rpx solid #BFBFBF;
		text-align: center;
		margin: 20rpx 0;
	}
	.shopScroll{
		padding: 0 30rpx;
		.shopCurrent{
			color: #333333;
			font-size: 30rpx;
			text-align: right;
			width: 100%;
			margin-bottom: 30rpx;
		}
	}
	.shopsHot{
		display: flex;
		// justify-content: space-between;
		// flex-wrap: wrap;
		// padding: 0 35rpx;
		.shop-item{
			width: 300rpx;
			// margin-bottom: 50rpx;
			margin-right: 20rpx;
			.shop-img{
				position: relative;
				margin-bottom: 20rpx;
				width: 100%;
				height: 400rpx;
				.item-img {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
				.item-info{
					width: 100%;
					position: absolute;
					bottom: 30rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.item-logo{
						width: 50rpx;
						height: 50rpx;
						border-radius: 50rpx;
						background-color: #ffffff;
						box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, 0.3);
					}
					.item-name{
						color:#ffffff;
						font-size: 24rpx;
						// text-align: center;
						height: 50rpx;
						line-height: 50rpx;
						width: 200rpx;
						padding: 0 10rpx;
						margin-left: 10rpx;
						border-top-left-radius: 9rpx;
						border-top-right-radius: 25rpx;
						border-bottom-left-radius: 9rpx;
						border-bottom-right-radius: 25rpx;
						background-color: rgba($color: #000000, $alpha: 0.4);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				
				.list-title{
					display: flex;
					align-items: center;
					position: absolute;
					left: 50%;
					top: 65%;
					margin-top: 42rpx;
					margin-left: -122rpx;
					width:244rpx;
					height: 64rpx;
					line-height: 64rpx;
					justify-content: space-between;
					border-radius: 32rpx;
					background-image: linear-gradient(to right,#68BBFA,#2888EB);
					.icon-img{
						width: 54rpx;
						height: 54rpx;
						border-radius: 30rpx;
						background-color: #ffffff;
						text-align: center;
						margin-left: 4rpx;
						.icon{
							width: 50rpx;
							height: 50rpx;
						}
					}
					.i-title{
						color: #ffffff;
						font-size: 30rpx;
						flex: 1;
						text-align: center;
					}
				}
			}
		}
		.shop-info{
			width: 300rpx;
			.name{
				font-size: 30rpx;
				color: #333333;
				 text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.address{
				font-size: 24rpx;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.line1{
				font-size: 28rpx;
				color: #333333;
				text-align: center;
			}
			.line2{
				font-size: 28rpx;
				color: #2888EB;
				text-align: center;
			}
		}
	}
	.scroll-view_H {
		// white-space: nowrap;
		.flex-view{
			display: flex;
			align-items: center;
			padding: 0 35rpx;
			flex-wrap: wrap;
			justify-content: space-between;
			
		}
		.view-item {
			display: inline-block;
			border: 1px solid #e7e7e7;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			// flex: 1;
			p {
				padding: 0px 20rpx;
			}
		}

		.item-name {
			font-size: 30rpx;
			width: 260rpx;
			margin-top: 20rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.item-name1 {
			font-size: 14px;
			width: 280rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.item-img {
			width: 330rpx;
			height: 330rpx;
		}
		.item-img1 {
			width: 320rpx;
			height:154rpx;
		}
		.item-price {
			line-height: 60rpx;
			height: 60rpx;
			color: #db1522;
			font-size: 14px;
		}
	}
	.studioHot{
		.studio-view{
			padding: 0 35rpx;
		}
		.studio-item{
			font-size: 14px;
			margin-bottom: 50rpx;
		}
		.studio-img{
			position: relative;
			width: 680rpx;
			.item-img {
				width: 100%;
				height: 330rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
			}
			.info{
				position: absolute;
				font-size:26rpx;
				color: #ffffff ;
				background-color: rgba($color: #000000, $alpha: 0.4);
				height: 70rpx;
				line-height: 70rpx;
				bottom: 29rpx;
				width: 100%;
				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;
				.text{
					margin-left: 30rpx;
				}
			}
		}

		.item-name{
			font-size: 14px;
			width: 680rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-weight: bold;
			color: #333333;
			margin: 10rpx;
		}
		.item-price{
			width: 680rpx;
			.price{
				font-size: 30rpx;
				color: #DB1522;
			}
			.per{
				font-size: 20rpx;
				color: #999899;
			}
		}
	}
	.activitys {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin: 0 35rpx;
		.activity-item {
			width: 332rpx;
			margin-bottom: 30rpx;
			.act-img{
				position: relative;
				.item-img {
					width: 100%;
					height: 200rpx;
					border-radius: 10rpx;
				}
				.info{
					position: absolute;
					font-size:26rpx;
					color: #ffffff ;
					background-color: rgba($color: #000000, $alpha: 0.4);
					height: 70rpx;
					line-height: 70rpx;
					bottom: 11rpx;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					border-bottom-left-radius: 10rpx;
					border-bottom-right-radius: 10rpx;
					.iconfont{
						margin: 0 10rpx;
					}
				}
			}
			.act-name {
				font-size: 28rpx;
				color: #333333;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.act-price {
				font-size: 28rpx;
				color: #db1522;
			}

			.act-address {
				font-size: 24rpx;
				color: #999999;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				.icondizhi {
					font-size: 26rpx;
					margin-right: 10rpx;
				}
			}

			.act-info {
				padding: 10rpx;
			}
		}
	}
	.rent-box{
		display: flex;
		justify-content: space-between;
		padding: 0 35rpx;
		.left{
			position: relative;
			width: 360rpx;
			.rent-flow{
				width: 100%;
				height: 360rpx;
			}
			.rent-text{
				position: absolute;
				top: 50rpx;
				left: 40rpx;
				.r-title{
					font-size: 36rpx;
					font-weight: bold;
					color: #C5661B;
					margin-bottom: 10rpx;
				}
				.r-text{
					font-size: 22rpx;
					color: #333333;
					padding: 6rpx 20rpx;
					background-color: rgba($color: #7F5028, $alpha: 0.2);
					border-radius: 30rpx;
				}
			}
		}
		.right{
			.pick-box{
				position: relative;
				.pick-flow{
					width: 298rpx;
					height: 170rpx;
				}
				.p-text{
					position: absolute;
					top: 20rpx;
					left: 30rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #7FA61A;
				}
			}
			.rent-re-box{
				position: relative;
				margin-top: 10rpx;
				.rent-res{
					width: 298rpx;
					height: 170rpx;
				}
				.rent-r-text{
					position: absolute;
					top:20rpx;
					left: 30rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #D2B116;
				}
			}
		}
	}
	.nodata{
		font-size: 28rpx;
		color: #999999;
		width: 100%;
		text-align: center;
	}
	.uni-list-one {
		// margin-bottom: 20rpx;
		overflow: hidden;
		padding: 0 30rpx 20rpx;
		background-color: #ffffff;
		.uni-list-cell-one {
			.uni-list-cell-left-one {
				display: block;
				font-size: 32rpx;
				font-weight: bold;
				line-height: 100rpx;
			}

			.studio-area {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				font-size: 28rpx;
				align-items: stretch;
				align-content: stretch;
				&:after {
					content: ""; 
					width: 300rpx; 
				} 
				.studio-item {
					padding: 10rpx 40rpx;
					background: #f0f0f0;
					width: 200rpx;
					margin-bottom: 20rpx;
					text-align: center;
					margin-right:20rpx;
				}

				.active {
					color: #651fff;
					border: 1px solid #651fff;
					position: relative;
					background-color: #ffffff;

					.icon {
						width: 0;
						height: 0;
						border: 8rpx solid;
						border-color: transparent #651fff #651fff transparent;
						position: absolute;
						bottom: 0;
						right: 0;
						content: "";
					}
				}
			}
		}
	}

	.img-box {
		padding: 0 45rpx;
		position: relative;

		image {
			height: 240rpx;
			width: 100%;
		}

		.more-box {
			display: flex;
			align-items: center;
			position: absolute;
			bottom: 50rpx;
			right: 290rpx;
			font-size: 22rpx;
			height: 30rpx;
			line-height: 30rpx;
			padding: 8rpx 20rpx;
			padding-right: 0rpx;

			border-radius: 20rpx;
		}

		.cbg-color {
			background-color: rgba(206, 211, 179, 1);
		}

		.sbg-color {
			background-color: rgba(185, 203, 213, 1);
		}

		.more-top {
			top: 55rpx;
		}
	}
	
	.priceRange{
		display:flex;
		justify-content:space-between;
		align-items:center;
		.confirm{
			padding:5px;
			font-size:32rpx;
		}
	}
	.area{
		display:flex;
		flex-direction:column;
		align-items:center;
		color:#651FFF;
		span{
			font-size:10px;
		}
		.iconhere{
			font-size:15px;
			height:15px;
			margin-bottom:5rpx;
		}
		.iconcuo{
			font-size:15px;
			height:15px;
			margin-bottom:10rpx;
		}
	}
	.popupActivity /deep/ .uni-popup__wrapper-box{
		background-color: #333
	}
.new-service{
	.tab-fixed{
		position: fixed;
		top: 100rpx;
		width: 100%;
		background-color: #f8f8f8;
	}
	.service-tab{
		display: flex;
		justify-content: space-between;
		font-size: 36rpx;
		color: #333333;
		z-index: 5;
		.tab-item{
			padding: 25rpx;
		}
		.active{
			font-weight: bold;
			position: relative;
			font-size: 40rpx;
		}
		.active::after{
			content: '';
			width: 12rpx;
			height: 12rpx;
			border-radius: 12rpx;
			position: absolute;
			bottom: 0;
			left: 0rpx;
			top: 75rpx;
			right: 0;
			background-color: #651FFF;
			margin: auto;
		}
	}
	.service-content{
		overflow: auto;
		width: 100%;
		margin-top: 100rpx;
	}

}
</style>
