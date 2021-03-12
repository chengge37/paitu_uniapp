<template>
	<view class="content">
		<view class="top">
			<swiper class="swiper" @change="changeImage" circular>
				<swiper-item v-for="(item, index) in studioDetail.pics" :key="index">
					<image :src="host+item" class="image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view :class="!isCollect?'iscollect':'notcollect'" class="collect" @click="collectOrnot">
				<span class="iconfont iconshoucang1-copy" v-if="!isCollect"></span>
				<span class="iconfont iconshoucang" v-else></span>
			</view>
			<view class="current">{{current}} / {{studioDetail.pics.length}}</view>
		</view>
		<view class="middle">
			<view class="detail">
				<view class="price">{{studioDetail.priceHolidayWorkTimePerHour}}</view>
				<view class="other">
					<view class="deal">销量：{{studioDetail.total}} 次</view>
				</view>
			</view>
			<view class="title">
				<view class="name">{{studioDetail.name}}</view>
			</view>
			<div class="conditionArray">
				<span class="cdt-item" v-for="(cdt_item,index) in condition" :key="index">{{cdt_item.name}}</span>
			</div>
			<view class="workTime">
				<view class="info" >
					<text>
						工作日：{{storeInfo.normalWorkStartTime}}-{{storeInfo.normalWorkEndTime}} (可接单时间：{{storeInfo.normalOpenStartTime}}-{{storeInfo.normalOpenEndTime}})
						</text>
					<text>
						节假日：{{storeInfo.holidayWorkStartTime}}-{{storeInfo.holidayWorkEndTime}} (可接单时间：{{storeInfo.holidayOpenStartTime}}-{{storeInfo.holidayOpenEndTime}})
					</text>
				</view>
			</view>
		</view>
		<view class="quan" @click="openCoupon">
			<view class="coupon">
				<text class="subtitle">优 惠 券</text>
				<scroll-view class="discount-scroll" scroll-x="true" v-if="my_coupons.length>0">
					<div class="discount">
						<span class="myquan" v-for="item in my_coupons" :key="item.id">{{item.title}}</span>
					</div>
				</scroll-view>
			</view>
			<span v-if="my_coupons.length==0">暂无优惠券</span>
			<span v-else class="iconyoujiantou iconfont"></span>
		</view>
		<div class="timeequip">
			<view class="renttime" @click="selectTime">
				<view class="date">
					<text  class="subtitle">租用时间</text>
					<text class="time" v-if="params.rent_type==2&&params.start_time&&params.end_time">{{params.start_time}} 至 {{params.end_time}}</text>
					<text class="time" v-if="params.rent_type==1">{{currentDate}} {{time.timeStart}} 至 {{time.timeEnd}}</text>
					<text class="time">{{rent_times}}</text>
				</view>
				<span class="iconyoujiantou iconfont"></span>
			</view>
			<view class="renttime" @click="addEquip">
				<view class="date">
					<text  class="subtitle">添加器材</text>
				</view>
				<span class="iconyoujiantou iconfont"></span>
			</view>
			<div class="tag" v-if="equip_tags.length>0">
				<div class="tag-item" v-for="item in equip_tags" :key="item">	
					<span class="tag-name">{{item.name}}</span>
					<div class="close" @click="closeTag(item.id)">
						<span class="iconfont iconguanbi"></span>
					</div>
				</div>
			
			</div>
		</div>
		
		<!-- 评价问答 -->
		<div class="comments">
			<div class="tabs">
				<p  class="comment-tab"  :class="seemore_type==1?'active':''">
					<span @click="commentTabClick('评论')">评论</span>
					<span >({{com_total}})</span>
				</p>
				<p class="comment-tab"  :class="seemore_type==2?'active':''">
					<span @click="commentTabClick('Q&A')">Q&A</span>
					<span>({{qus_total}})</span>
				</p>
			</div>
			<div class="comment-content" v-if="seemore_type==1">
				<div v-for="comment_item in commentList" :key="comment_item.id" @click="gotoComDetail(item)">
					<div class="line1">
						<div class="left">
							<image :src="util.avatarUtil(comment_item.user_avatar)" mode="aspectFit" class="header-img"></image>
							<span class="name">{{comment_item.user_nick}}</span>
							<uni-rate :disabled="rateDisable" :value="comment_item.score" size="16" class="comment-rate"></uni-rate>
						</div>
						<div class="right">
							<span>{{comment_item.time_str}}</span>
						</div>
					</div>
					<div class="line2">
						<span v-if="comment_item.content">{{comment_item.content}}</span>
						<span class="nodata" v-else>用户无评论内容</span>
					</div>
				</div>
				
			</div>
			<div class="question-content" v-else>
				<div class="question-item" @click="gotoQueDetail(item)" v-for="item in questionList" :key="item.id">
					<div class="line question">
						<span class="qus">Q</span>
						<span class="text">{{item.content}}</span>
					</div>
					<div class="line answer" >
						<span class="ans">A</span>
						<span class="text" v-if="item.children.length>0">{{item.children[0].content}}</span>
						<span class="text" v-else>暂无回答</span>
					</div>

					<div class="dateOrCount">
						<span class="date">{{item.create_time_str}}</span>
						<span class="count">全部{{item.children.length}}个回答</span>
					</div>
				</div>
			</div>
			<div class="seemore" v-if="(commentList.length>0&&seemore_type==1)||(questionList.length>0&&seemore_type==2)">
				<span class="seemore-btn" @click="seemore">查看更多</span>
			</div>
			<div class="seemore" v-else-if="questionList.length==0&&seemore_type==2">
				<span class="seemore-btn" @click="seemore">去提问</span>
			</div>
			<div class="nodata" v-else>暂无数据</div>
		</div>

		<!-- 店铺 -->
		<div class="shop">
			<image @click="gotoShop(storeInfo)"
			:src="storeInfo.logo?util.shopAvatarUtil(storeInfo.logo):util.shopAvatarUtil(storeInfo.avatar)" 
			class="shop-img" 
			mode="aspectFill" ></image>
			<div class="shop-name">
				<p class="title">{{storeInfo.nick}}</p>
				<p class="address">{{storeInfo.address}}</p>
			</div>
			<div class="gotoshop">
				<p class="btn" @click="gotoShop(storeInfo)">进入店铺</p>
			</div>
		</div>
		<view class="pick-way">
			<div class="way" v-for="item in detailNavList" :key="item.type" :class="item.active?'active':''" @click="detailChange(item.name)">{{item.name}}
				<div class="border"></div>
			</div>
		</view>
		<!-- 基本信息 -->
		<view class="studio" >
			<!-- 价格表 -->
			<view class="charge-mode" v-if="detailNavTab==2">
				<view class="mode">
					<view class="title">
						<div>按天计算</div>
						<div class="explain">此价格不包含器材，若需要器材可在预定时选择</div>
					</view>
					<view class="detail">
						<view class="header1">
							<text>使用时间</text>
							<text>价格/天</text>
						</view>
						<view class="detail-content">
							<view class="rightx">
								<view class="usetime">工作日</view>
								<view class="price">
									<text>{{studioDetail.priceWorkDayAllDay}}</text>
								</view>
							</view>
						</view>
						<view class="detail-content">
							<view class="rightx">
								<view class="usetime">周末</view>
								<view class="price">
									<text>{{studioDetail.priceWeekEndAllDay}}</text>
								</view>
							</view>
						</view>
						<view class="detail-content">
							<view class="rightx">
								<view class="usetime">节假日</view>
								<view class="price">
									<text>{{studioDetail.priceHolidayAllDay}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="mode">
					<view class="title">
						<div>按小时计算</div>
						<div class="explain">此价格不包含器材，若需要器材可在预定时选择</div>
					</view>
					<view class="detail">
						<view class="header">
							<text>使用时间</text>
							<text>具体时间</text>
							<text>价格/小时</text>
						</view>
						<view class="detail-content">
							
							<view class="right">
								<view class="usetime">工作日</view>
								<view class="infacttime">
									<text class="line">{{storeInfo.normalWorkStartTime}}-{{storeInfo.normalWorkEndTime}}</text>
									<text>加班：{{storeInfo.normalWorkEndTime}}-{{storeInfo.normalOpenEndTime}}</text>
								</view>
								<view class="price">
									<text class="line">{{studioDetail.priceWorkDayWorkTimePerHour}}</text>
									<text>{{studioDetail.priceWorkDayOverTimePerHour}}</text>
								</view>
							</view>
						</view>
						<view class="detail-content">
							<view class="right">
								<view class="usetime">周末</view>
								<view class="infacttime">
									<text class="line">{{storeInfo.normalWorkStartTime}}-{{storeInfo.normalWorkEndTime}}</text>
									<text>加班：{{storeInfo.normalWorkEndTime}}-{{storeInfo.normalOpenEndTime}}</text>
								</view>
								<view class="price">
									<text class="line">{{studioDetail.priceWeekEndWorkTimePerHour}}</text>
									<text>{{studioDetail.priceWeekEndOverTimePerHour}}</text>
								</view>
							</view>
						</view>
						<view class="detail-content">
							<view class="right">
								<view class="usetime">节假日</view>
								<view class="infacttime">
									<text class="line">{{storeInfo.holidayWorkStartTime}}-{{storeInfo.holidayWorkEndTime}}</text>
									<text>加班：{{storeInfo.holidayWorkEndTime}}-{{storeInfo.holidayOpenEndTime}}</text>
								</view>
								<view class="price">
									<text class="line">{{studioDetail.priceHolidayWorkTimePerHour}}</text>
									<text>{{studioDetail.priceHolidayOverTimePerHour}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="detailNavTab==1">
				<view class="facility">
					<p class="big-title">产品参数</p>
					<div class="product_param">
						<div class="item">
							<span class="name">影棚类型：</span><span class="item-content">{{studioDetail.studio_type}}</span>
						</div>
						<div class="item">
							<span class="name">影棚面积：</span><span class="item-content">{{studioDetail.square}}m²</span>
						</div>
						<div class="item">
							<span class="name">所在楼层：</span><span class="item-content">{{studioDetail.floor}}楼</span>
						</div>
					</div>
					<video id="myVideo" :src="host+studioDetail.video" class="video" v-if="studioDetail.video"></video>
				</view>
				<view class="product-info">
					<p class="big-title">产品信息</p>
					<view v-html="studioDetail.intro"></view>
				</view>
				<view class="location">
					<p class="big-title">地理位置</p>
					<p class="address">
						<span class="iconfont icondizhi"></span>
						<span>{{studioDetail.address}}</span>
					</p>
					<map style="width: 100%; height: 300px;" :latitude="storeInfo.lat" :longitude="storeInfo.lng" :markers="covers">
					</map>
				</view>
			</view>
			<view v-if="detailNavTab==3" class="common-questions">
				<div class="question-content" v-if="com_questions.length>0">
					<div class="question-item" v-for="item in com_questions" :key="item.id">
						<div class="line question">
							<span class="qus">Q</span>
							<span class="text">{{item.content}}</span>
						</div>
						<div class="line answer">
							<span class="ans">A</span>
							<span class="text" v-if="item.relpy">{{item.relpy}}</span>
							<span class="text" v-else>暂无回答</span>
						</div>
					</div>
				</div>
				<div v-else class="nodata">
					---暂无数据---
				</div>
			</view>
		</view>

		<advertise :type='1'></advertise>
		<check-flow ></check-flow>
		<!-- 底部 -->
		<view class="footer">
			<view class="left">
				<view class="model" v-for="(item,b) in bottom" :key="b" @click="bottomClick(b)" >
					<span class="iconfont" :class="item.icon"></span>
					<view>{{item.name}}</view>
				</view>
			</view>
			<view class="_right">
				<view class="right1" @click="gotoPriceDetail">
					<span class="price" v-if="priceDetail.order_price">￥{{priceDetail.order_price}}</span>
					<span class="price" v-else>￥{{studioDetail.priceHolidayWorkTimePerHour}}</span>
					<span class="price-detail" v-if="priceDetail&&priceDetail.studioPriceArr">明细</span>
				</view>
				<view class="right" @click="subscribe">
					立即租借
				</view>
			</view>
			
		</view>

		<!-- 添加器材弹框 -->
		<uni-popup ref="popup" type="bottom">
			<div class="equipPopup">
				<div class="title">
					<p>器材列表</p>
					<p class="iconfont iconguanbi" @click="sureClick"></p>
				</div>
				<div class="list-content" v-if="equipment.equips.length>0">
					<div class="equip-list">
						<div class="equip-item" :class="item.value>0?'active':''" v-for="item in equipment.equips" :key="item.name">
							<span class="selected-sign"></span>
							<div class="left">
								<p class="equip-name">{{item.name}}</p>
								<p class="equip-store">库存：{{item.count}}</p>
							</div>
							<div class="right">
								<p class="price">￥{{item.price}}</p>
								<uni-number-box :min="0" :max="item.count" class="count" :value="item.value" @change="countChange($event,item)"></uni-number-box>
							</div>
							
						</div>
					</div>
					
					<div class="equip-footer">
						<div class="uni-pagina">
							<uni-pagination show-icon="true" :total="equipment.total" :current="equipment.equip_param.page" @change="pageChange" pageSize="10"></uni-pagination>
						</div>
					</div>
				</div>
				<div class="equip-list-nodata" v-else>
					---暂无数据---
				</div>
			</div>
			
		</uni-popup>

		<!-- 选择租用时间弹框 -->
		<uni-popup ref="popuptime" type="bottom">
			<div class="timePopup">
				<div class="title">
					<p>租用时间</p>
					<p class="iconfont iconguanbi" @click="closeTimePopup"></p>
				</div>
				<div class="timepopup">
					<div class="list-item">
						<div class="title1">类型选择</div>
						<div class="studio-area">
							<div class="studio-item" :class="item.active?'active':''" v-for="(item,idx1) in dayAndtime " :key="idx1" @click="time_type(item.name)">
								{{item.name}}
								<span class="icon"></span>
							</div>
						</div>
					</div>
					<div class="list-item" v-if="params.rent_type==2">
						<div class="title1">租用时间</div>
						<!--#ifdef MP-WEIXIN || APP-PLUS || MP-ALIPAY-->
						<div class="picktime">
							<picker mode="date" :value="params.start_time" :start="currentDate" @change="bindDateChange($event, 'start')">
								<view class="uni-input">{{params.start_time}}</view>
							</picker>
							<view class="line"></view>
							<picker mode="date" :value="params.end_time" :start="currentDate"  @change="bindDateChange($event, 'end')">
								<view>
									<view class="uni-input">{{params.end_time}}</view>
									<view class="icon"></view>
								</view>
							</picker>
						</div>
						<!--#endif -->
						<!--#ifdef H5 -->
						<div class="picktime" @click="onShowDatePicker('range','')">
							<view class="uni-input">{{params.start_time}}</view>
							<view class="line"></view>
							<view class="uni-input">{{params.end_time}}</view>
							<view class="icon"></view>
						</div>
						<!--#endif -->
						

					</div>

					<!-- 按小时选择 -->
					<div class="list-item" v-else>
						<!--#ifdef MP-WEIXIN || APP-PLUS || MP-ALIPAY -->
						<div class="picktime">
							<picker mode="date" :value="currentDate" @change="bindTimeChange($event, 'rent_time')">
								<view class="uni-input" >{{currentDate}}</view>
							</picker>
							<view class="line"></view>
								<view class="uni-input1"  @click="openTimePicker('start')" v-if="time.timeStart">{{time.timeStart}}</view>
								<view class="uni-input1" @click="openTimePicker('start')" v-else>-请选择-</view>
							
							<view class="line"></view>
								<view class="uni-input1" @click="openTimePicker('end')" v-if="time.timeEnd">{{time.timeEnd}}</view>
								<view class="uni-input1" @click="openTimePicker('end')" v-else>-请选择-</view>
							
						</div>
						<!--#endif -->
						<!--#ifdef H5 -->
						<div class="picktime" >
							<view class="uni-input" @click="openDatePicker('current')">{{currentDate}}</view>
							<view class="line"></view>
							<view class="uni-input1" @click="onShowDatePicker('time','start')"  v-if="time.timeStart">{{time.timeStart}}</view>
							<view class="uni-input1" @click="onShowDatePicker('time','start')" v-else>-请选择-</view>
							<view class="line"></view>
							<view class="uni-input1" @click="onShowDatePicker('time','end')"  v-if="time.timeEnd">{{time.timeEnd}}</view>
							<view class="uni-input1" @click="onShowDatePicker('time','end')" v-else>-请选择-</view>
							<view class="icon"></view>
						</div>
						<!--#endif -->
					</div>
					<div class="comfirmBtn" @click="comfirmtime">确认</div>
				</div>
			</div>
		</uni-popup>

		<!-- 价格明细弹框 -->
		<uni-popup ref="popupPrice" type="bottom" >
			<div class="price-table">
				<div class="big-title">
					<p class="left">价格明细</p>
					<p class="iconfont iconguanbi right" @click="closePricepopup"></p>
				</div>
				<div class="price-table-title">
					<span class="title-name">商品</span>
					<span class="title-name">时间</span>
					<span class="title-name">类型</span>
					<span class="title-name">价格</span>
				</div>
				
				<div class="price-item" v-for="(item,index) in priceDetail.equipPriceArr" :key="index">
					<div class="left">{{item.name}}</div>
					<div class="right">
						<div class="line" v-for="(val,idx) in item.detail" :key="idx">
							<span class="date">{{val.time}}</span>
							<span class="type" v-if="val.Daytype==1">节假日</span>
							<span class="type" v-else-if="val.Daytype==2">非工作日</span>
							<span class="type" v-else-if="val.Daytype==3">工作日</span>
							<span class="price">￥{{val.price}}</span>
						</div>
					</div>
				</div>
			</div>
		</uni-popup>

		<!-- 选择优惠券 -->
		<uni-popup ref="popupCoupon" type="bottom">
			<div class="couponPopup">
				<div class="title">
					<p>优惠券</p>
					<p class="iconfont iconguanbi" @click="closeCouponPopup"></p>
				</div>
				<div class="couponList">
					<discount-coupon :couponList="shop_coupons" @getMyCoupons="getMyCoupons"></discount-coupon>
				</div>
			</div>
			
		</uni-popup>
		<datetime-picker ref="datePicker" @onConfirm="dateOnConfirm" type='date' @onCancel="dateOnCancel" ></datetime-picker>
		<!-- <datetime-picker ref="timePicker" @onConfirm="timeOnConfirm" type="time" @onCancel="timeOnCancel" :startTime="storeInfo.normalWorkStartTime" :endTime="storeInfo.normalWorkEndTime" v-if="storeInfo&&(storeInfo.normalWorkStartTime||storeInfo.normalWorkEndTime)"></datetime-picker> -->
		<datetime-picker ref="timePicker" @onConfirm="timeOnConfirm" type="time" @onCancel="timeOnCancel"></datetime-picker>
		<!--#ifdef H5 -->
		<mx-datepicker :show="showPicker" :type="datetype" :value="value" :show-tips="show_tips" :begin-text="'开始'" :end-text="'结束'" :show-seconds="show_seconds" @confirm="onSelected" @cancel="onSelected" />
		<!--#endif -->
	</view>
</template>

<script>
	import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue';
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue";
	import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue";
	import uniPagination from "@/components/uni-ui/uni-pagination/uni-pagination.vue";
	import discountCoupon from "@/components/discount-coupon/discount-coupon.vue"
	import datetimePicker from "@/components/datetime-picker/datetime-picker.vue"
	import advertise from "@/components/advertise/advertise.vue"
	import checkFlow from "@/components/check-flow/check-flow.vue"
	// #ifdef H5
	import mxDatepicker from "@/components/mx-datepicker/mx-datepicker.vue"
	// #endif
	import { studio,equipment,order,comment,question,coupon } from '@/common/api/api';
	import { getUserLsObj,collectOther } from '@/common/utils/collect';
	import { Format } from '@/common/utils/formatDate.js';
	import {mapState} from 'vuex'
	import {
		promptLogin
	} from '@/common/login/login'
	import PIM from '@/common/SDK/PIM/index.js'
	export default {
		components: {
			uniRate,uniPopup,uniPagination,uniNumberBox,discountCoupon,datetimePicker,advertise,checkFlow,
			// #ifdef H5
			mxDatepicker
			// #endif
		},
		data() {
			const currentDate = this.getDate();
			const currentTime = this.getTime();
			return {
				rateDisable:true,
				host:this.$qiniuHost,
				current: 1,
				activeBottom: 0,
				studioDetail:{
					pics:[],
				},
				storeInfo:{},
				bottom: [{
						icon: 'icondianpu',
						name: '店铺'
					},
					{
						icon: 'iconkefu',
						name: '客服'
					},
					{
						icon: 'icongouwuche2',
						name: '购物车'
					},
					
				],
				equipment: {
					equips:[],
					equip_param:{
						page:1,
						page_size:10,
						uid:'',
						order_id:'',
						dateStart:'',
						dateEnd:''
					},
					total:0,
				},

				condition:[],
				equip_tags:[],
				dayAndtime:[
					{name:'按天租',active:true,type:2},
					{name:'按小时',active:false,type:1},
				],
				comment_tabs:[
					{name:'评论',active:true,type:1},
					{name:'Q&A',active:false,type:2},
				],
				tabActive:1,
				seemore_type:1,
				params:{
					start_time:currentDate,
					end_time:currentDate,
					rent_type:2,
					type:1,
					price:1,
					obj_id:'',
					is_out:1
					// equip_array:''//设备json数组
				},
				date_flag:'',
				time_flag:'',
				edit_params:{
					order_id:'',
					equip_id:'',
					count:'',
					door_to_door:0
				},
				is_renting:false,
				currentDate:currentDate,
				currentTime:currentTime,
				time:{
					timeStart:'',
					timeEnd:''
				},
				detailNavList:[
					{name:'基本信息',active:true,type:1},
					{name:'价格列表',active:false,type:2},
					{name:'常见问题',active:false,type:3},
				],
				detailNavTab:1,
				isCollect:false,
				comment_params:{
					page:1,
					page_size:2,
					type:2,
					studio_id:''
				},
				commentList:[],
				com_total:0,
				ques_params:{
					page:1,
					page_size:1,
					type:1,//1（影棚）或2（设备） 3活动
					relation_id:''//影棚or设备ID
				},
				questionList:[],
				qus_total:0,
				covers: [{
					latitude: 0.0000,
					longitude: 0.0000,
				}, {
					latitude: 0.0000,
					longitude: 0.0000,
				}],
				priceDetail:{
					equipPriceArr:[]
				},
				price_array:[],
				shop_coupons:[],
				my_coupons:[],
				showPicker:false,
				datetype: 'range',
				value: '',
				show_tips:true,
				show_seconds:false,
				hourtype:'start',
				advList:[],
				order_id:'',
				com_questions:[],
			};
		},
		computed: {
			...mapState(['user']),
			rent_times(){
				if(this.params.rent_type==2){
					let days = this.util.dayCount(this.params.start_time,this.params.end_time);
					return `共${days}天`;
				}else{
					let time = this.util.calHours(this.params.start_time.replace(/-/,'/'),this.params.end_time.replace(/-/,'/'));
					if(time){
						return `共${time}小时`;
					}else{
						return ``;
					}
				}
				
			}
		},
		watch:{
			equipment(val){
				console.log(val.equips)
			},
			studioDetail(val){
				if(val.id){
					// #ifdef H5
					this.$wechatShare.share({  
						title:this.studioDetail.name,
						desc: this.storeInfo.nick + '店铺影棚',  
						img: this.host+this.studioDetail.pics[0]
					});
					// #endif
				}
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.name = option.name;
			this.params.obj_id = this.comment_params.studio_id = option.studio_id;
			this.getStudio().then(res => {
				this.studioDetail = res.detail;
				uni.setNavigationBarTitle({title: this.studioDetail.name});
				this.studioDetail.intro = this.studioDetail.intro.replace(/\<img/gi,'<img style="max-width:100%;height:auto" ');
				console.log('this.studioDetail.intro----',this.studioDetail.intro)
				console.log('this.onLoad----',res)
				// 价格要根据选择日期决定是属于哪个价钱，这里先定是priceWorkDayAllDay
				// this.priceDetail.order_price = this.studioDetail.priceWorkDayAllDay;
				
				//获取店铺信息
				this.getShopInfo(this.studioDetail.uid);
				
				this.condition = res.serviceConditionArray;
				this.studioDetail.vrs = this.studioDetail.vr_array.split(',');
				this.studioDetail.pics = this.studioDetail.pic.split(',').filter(v=>{return v});
				this.studioDetail.studio_type = this.getTypeClassfy(this.studioDetail.typeClassify);
			})
			this.getComment();
			this.getQuestions();
			this.getCommonQuestions();
			
		},
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: this.studioDetail.name,
				path: '/pages/home/category/studioDetail/studioDetail?studio_id='+this.params.obj_id
			}
		},
		methods: {
			//获取商家店铺基本信息
			getShopInfo(uid){
				console.error('getShopInfo------------',uid);
				this.util.getShopInfo(uid).then(res=>{
					this.storeInfo=res;
					this.equipment.equip_param.uid = this.storeInfo.id;
					this.covers.forEach(v =>{v.latitude=this.storeInfo.lat;v.longitude=this.storeInfo.lng});
					if(this.user&&this.user.paitume_user){
						this.getMyCoupons();
						getUserLsObj(this.params.obj_id,1,1).then(res=>{
						this.isCollect=res});
					}
				})
			},
			
			onShowDatePicker(type,hourtype){//显示
				// #ifdef H5
                this.datetype = type;
                this.showPicker = true;
				this.value = this[type];
				this.hourtype = hourtype;
				console.log('type---',type)
				console.log('value---',this.value)
				// #endif
            },
			
            onSelected(e) {//选择
                this.showPicker = false;
                if(e) {
					if(this.datetype=='range'){
						this[this.datetype] = e.value; 
						//选择的值
						console.log('value => '+ e.value);
						this.params.start_time = this[this.datetype][0].split(' ')[0].replace(/\//g, '-');
						this.params.end_time= this[this.datetype][1].split(' ')[0].replace(/\//g, '-');
						//原始的Date对象
						console.log('date => ' + e.date);
					}else{
						if(this.hourtype=='start'){
							this.time.timeStart = e.time
						}else{
							this.time.timeEnd = e.time
						}
						console.log('time => ' +e.time);
					}
					
                }
            },
			
			getTypeClassfy(data){
				let studio_type = ''
				if(data=='1'){studio_type='录音棚'}
				else if(data=='2'){studio_type='实景棚'}
				else if(data=='3'){studio_type='无影棚'}
				else if(data=='4'){studio_type='特效棚'}
				else if(data=='5'){studio_type='白棚'}
				else if(data=='6'){studio_type='绿棚'}
				else{studio_type='无分类'}
				return studio_type;
			},
			
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			
			getTime() {
				const date1 = new Date();
				let hour = date1.getHours();
				let minutes = date1.getMinutes();
				if(hour<10){
					hour = '0' + JSON.stringify(hour)
				}
				if(minutes<10){
					minutes = '0' + JSON.stringify(minutes)
				}
				return `${hour}:${minutes}`;
			},

			collectOrnot(){
				collectOther(this.storeInfo.id,1,1,this.params.obj_id).then(res => {
					this.isCollect = res;
				})
				
			},
			
			bindDateChange: function(e, flag) {
				if (flag === 'start') {
					this.params.start_time = e.target.value;
				} else if (flag === 'end') {
					this.params.end_time = e.target.value;
				}
				
			},
			
			openDatePicker(flag){
				console.log('openDatePicker--------------',flag);
				this.$refs.datePicker.show();
				this.date_flag = flag;
			},
			
			openTimePicker(flag){
				console.log('openTimePicker--------------',flag);
				// this.$refs.popuptime.close();
				this.time_flag = flag;
				this.$refs.timePicker.show();
			},
			
			dateOnConfirm(e){
				if (this.date_flag === 'start') {
					this.params.start_time = e;
				} else if (this.date_flag === 'end') {
					this.params.end_time = e;
				}else{
					this.currentDate = e
				}
			},
			
			dateOnCancel(e){
				if (this.date_flag === 'start') {
					this.params.start_time = e;
				} else if (this.date_flag === 'end') {
					this.params.end_time = e;
				}
			},
			
			timeOnConfirm(e){
				console.log('e----',e)
				if (this.time_flag === 'start') {
					this.time.timeStart = e;
					this.params.start_time = this.currentDate+' '+this.time.timeStart + ':00';
				}else if (this.time_flag === 'end') {
					this.time.timeEnd = e;
					this.params.end_time = this.currentDate+' '+this.time.timeEnd + ':00';
				}
			},
			
			timeOnCancel(e){
				if (this.time_flag === 'start') {
					this.time.timeStart = e;
					this.params.start_time = this.currentDate+' '+this.time.timeStart + ':00';
				}else if (this.time_flag === 'end') {
					this.time.timeEnd = e;
					this.params.end_time = this.currentDate+' '+this.time.timeEnd + ':00';
				}
			},
			
			commentTabClick(data){
				this.comment_tabs.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.seemore_type = item.type;
					}else{
						item.active = false;
					}
				})
			},
			
			bindTimeChange: function(e, flag) {
				console.log('eeeee',e.target.value)
				if (flag === 'start') {
					this.time.timeStart = e.target.value;
					this.params.start_time = this.currentDate+' '+this.time.timeStart + ':00';
				} else if (flag === 'end') {
					this.time.timeEnd = e.target.value;
					this.params.end_time = this.currentDate+' '+this.time.timeEnd + ':00';
				}else{
					this.currentDate = e.target.value;
				}
			},
			
			gotoPriceDetail(){
				if(this.priceDetail&&this.priceDetail.equipPriceArr.length>0){
					this.$refs.popupPrice.open();
				}
			},
			
			getShopCoupons(){
				return new Promise((resolve,reject)=>{
					this.$http.get(coupon.getList,{page:1,page_size:1000,uid:this.storeInfo.id}).then(res =>{
						if(res){
							this.shop_coupons = res.rows;
							if(this.shop_coupons.length>0){
								this.shop_coupons.forEach(item => {
									item.money = item.money.split('.')[0];
									if(item.coupon_type=='2'){
										item.money = Math.floor(parseInt(item.money))/10;
									}
									item.st_time = item.st_time.split(' ')[0];
                        			item.end_time = item.end_time.split(' ')[0];
									if((parseInt(item.limit_count)-item.user_get)>0){
										item.ablePick = 1
									}else{
										item.ablePick = 0
									}
								});
								this.getMyCoupons();
							}else{
								uni.showToast({title: '暂无优惠券',icon: 'none',duration:2000})
							}
							resolve(res)
						}
						
					})
				})
				
			},
			
			getMyCoupons(){
				this.$http.get(coupon.getMyList,{uid:this.storeInfo.id,order_use:0,group:1}).then(res =>{
					this.my_coupons = res.rows;
					console.log('getMyCoupons--',this.my_coupons)
				})
			},
			
			changeImage(e) {
				this.current = e.detail.current + 1
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
			
			async subscribe() {
				console.log('this.edit_params.order_id---',this.edit_params.order_id)
				if(!this.is_renting){
					let cart = await this.getCart()
					if(!cart.count){
						this.appoitOrder().then(res => {
							uni.navigateTo({
								url: '/pages/order/orderDetail?id=' + res + '&type=0'
							})
						})
						
					}	
				}else{
					let useCoupon = await this.getOrderCoupon();
					for(const v of useCoupon){
						await this.cancelCouponUse(v.id);
					}
					let cancel = await this.cancelOrder();
					let appoit = await this.appoitOrder()
					if(this.equip_tags.length>0){
						this.equip_tags.forEach(item => {
							this.edit_params.equip_id = item.id;
							this.edit_params.count = item.value;
							this.editOrder()
						})
					}
					// uni.navigateTo({
					// 	url:"/pages/order/orderPay?order_id="+appoit+'&uid='+this.storeInfo.id
					// })
					uni.navigateTo({
						url: '/pages/order/orderDetail?id=' + res + '&type=0'
					})
				}
				
				
			},
			
			addEquip(){
				if(this.is_renting){
					this.equipment.equip_param.dateStart = this.params.start_time;
					this.equipment.equip_param.dateEnd = this.params.end_time;
					this.getEquips();
					console.log('equip_tags',this.equip_tags);
					this.$refs.popup.open();
				}else{
					this.getCart().then(res =>{
						if(!res.count){
							uni.showModal({
								title: '预约提示',
								content: '创建预约单后选择器材，确定后租用时间不可修改，请确认租用时间无误。',
								success: (res) => {
									if (res.confirm) {
										this.appoitOrder();
										
										this.$refs.popup.open();
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
					}).catch(err=>{})
				}
			},
			
			getOrderCoupon(){
				return new Promise((resolve,reject)=> {
					this.$http.get(order.getOrderCart,{order_id:this.order_id}).then(res => {
						resolve(res.price.coupon_array);
					})
				})
			
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
			
			cancelOrder(){
				let param = {order_id:this.order_id}
				return new Promise((resolve,reject) => {
					this.$http.post(order.cancelOrder,param).then(res=>{
						resolve(res)
					})
				})
				 
			},
			
			getCart(){
				return new Promise((resolve,reject)=> {
					this.$http.get(order.getOrderCart).then(res =>{
						if(res.count){
							uni.showModal({
								title: '系统提示',
								content: '已有未支付订单，请先去处理',
								success: (res1) => {
									if (res1.confirm) {
										uni.navigateTo({url:"/pages/order/orderDetail?id="+res.id+'&type=0'})
									} else if (res1.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
						resolve(res)
					}).catch(err=>{})
				})
			},
			
			// 添加预约订单
			appoitOrder(){
				return new Promise((resolve,reject)=> {
					this.$http.post(order.appoitment,this.params).then(res => {
						this.is_renting = true;
						let data = res;
						this.order_id = res.id
						if(data){
							this.price_array.push(data.price_array);
							this.priceDetail.order_price = data.price_array.base;
							this.edit_params.order_id = data.id;
							this.equipment.equip_param.order_id = data.id;
							this.equipment.equip_param.dateStart = this.params.start_time;
							this.equipment.equip_param.dateEnd = this.params.end_time;
							this.getEquips();
							resolve(data.id);
						}else{
							uni.showToast({title: res.data.msg,icon: 'none',duration:2000})
						}
						
					}).catch(err=>{})
				})
				
			},
			
			// 修改预约订单
			editOrder(){
				let new_params = this.util.deepcopy(this.params);
				delete new_params.obj_id;
				delete new_params.is_out;
				this.edit_params = Object.assign(this.edit_params,new_params)
				
				this.$http.post(order.editRentOrder,this.edit_params).then(res => {
					this.priceDetail = res.price;
					this.price_array = res.price.equipPriceArr;
					this.price_array.forEach(v=>{v.pic=v.static_pic});
					this.price_array.unshift(res.price.studioPriceArr);
					
				}).catch(err=>{})
			},
			
			// 选择器材
			countChange(val,data){
				console.log('val----',val,'data----',data);
				let ret = this.equipment.equips.findIndex(e=>e.id==data.id);
				let ret1 = this.equip_tags.findIndex(e => e.id==data.id);
				if(ret!=-1){
					this.edit_params.equip_id = data.id;
					this.edit_params.count = val;
					this.editOrder();

					this.equipment.equips[ret].value = val;
					this.equip_tags = JSON.parse(JSON.stringify(this.equip_tags));
					
					if(val==1){
						// 若选择数量等于1，将器材push进数组
						if(ret1==-1){
							let tag = this.util.deepcopy(this.equipment.equips[ret])
							this.equip_tags.push(tag);
						}
					}else if(val>1){
						// 若选择数量大于1,增加数量
						this.equip_tags[ret1].value++;
					}else{
						if(ret1!=-1){
							this.equip_tags.splice(ret1,1);
						}
					}
					console.log('this.equip_tags',this.equip_tags)
				}
				
				
			},
			closeTag(data){
				let ret = this.equip_tags.findIndex(e => e.id==data);
				if(ret!=-1){
					this.equip_tags.splice(ret,1);
					this.edit_params.equip_id = data;
					this.edit_params.count = '0';
					this.editOrder();
				}
			},
			selectTime(){
				this.$refs.popuptime.open();				
			},
			openPriceDetail(){
				if(this.priceDetail&&this.priceDetail.studioPriceArr){
					this.$refs.popupPrice.open();
				}
				
			},
			bindPickerChange(e, i) {
				this.mode[i].time = e.target.value
				this.mode[i].content.some(v => {
					v.price0 = v.price0 * 2;
					v.price1 = v.price1 * 2;
				})
			},
			bottomClick(index) {
				let _this = this;
				if(index==0){
					_this.gotoShop(_this.storeInfo);
				} else if(index==1){
					// 此处为联系商家
					if(this.user.paitume_user){
						//判断会话列表
						console.log('this.$IM  = ' + JSON.stringify(this.$IM));
						if(this.$IM.IM == null){
							PIM.createPIMClient()
								.then(pim => {
									console.log('PIM 成功');
									this.getConv();
								})
								.catch(err => {
									console.error('PIM 失败' + JSON.stringify(err));
									uni.showModal({
										title: '错误',
										content: "IM服务器连接失败",
										showCancel:false,
									});
								});
						} else {
							console.error('PIM 不为空 检查SOCKET连接情况');
							console.log(JSON.stringify(this.$IM.IM.$Socket));
							if(!this.$IM.IM.$Socket.isconnect){
								PIM.createPIMClient()
									.then(pim => {
										console.log('PIM 成功');
										this.getConv();
									})
									.catch(err => {
										console.error('PIM 失败' + JSON.stringify(err));
										uni.showModal({
											title: '错误',
											content: "IM服务器连接失败",
											showCancel:false,
										});
									});
							} else {
								this.getConv();
							}
						}
						
					}  else {
						// #ifdef MP-WEIXIN
							promptBind();
						// #endif
						// #ifdef H5 || APP-PLUS
							promptLogin();
						// #endif	
					}
				} else{
					uni.navigateTo({url: "/pages/order/cart/cart"});
				}
			},
			getConv(){
				let conversationExist = false;
				if(this.user.conv_list){
					//创建会话
					let chatToId = this.storeInfo.id;
					for (let i = 0, n = this.user.conv_list.length; i < n; i++) {
						let existConv = this.user.conv_list[i];
						if (chatToId == existConv.chatToObj.id || chatToId == existConv.creatorObj.id) {
							conversationExist = true;
							break;
						}
					}
				}
				if(conversationExist){
					console.log('已经有了会话不用创建');
					var navData = encodeURIComponent(JSON.stringify({id:this.storeInfo.id,name:this.storeInfo.nick,avatar:this.storeInfo.logo?this.util.shopAvatarUtil(this.storeInfo.logo):this.util.shopAvatarUtil(this.storeInfo.avatar)})); // 这里转换成 字符串
					uni.navigateTo({
							url:'/pages/my/myList/chatBox?chatObj='+navData
					})
				} else {
					this.$IM.IM.createConversation(this.storeInfo.id)
						.then(res => {
							console.log('创建回话res' + JSON.stringify(res));
							this.$store.commit('add_new_conv', res);
							// 已登陆跳转到聊天窗口
							var navData = encodeURIComponent(JSON.stringify({id:this.storeInfo.id,name:this.storeInfo.nick,avatar:this.storeInfo.logo?this.util.shopAvatarUtil(this.storeInfo.logo):this.util.shopAvatarUtil(this.storeInfo.avatar)})); // 这里转换成 字符串
							uni.navigateTo({
									url:'/pages/my/myList/chatBox?chatObj='+navData
							})
						})
						.catch(err => {
							console.error('创建回话err' + JSON.stringify(err));
							uni.showModal({
								title: '错误',
								content: err!=undefined?err:"创建回话失败",
								showCancel:false,
							});
						});
				}
				
			},
			
			getComment(){
				this.$http.get(comment.getList,this.comment_params).then(res => {
					this.commentList = res.rows;
					this.com_total = res.total_count;
					this.commentList.forEach(item => {
						item.time_str = Format.formatDateNoHouer(item.create_time*1000);
					})
				}).catch(err=>{})
			},
			getStudio(){
				return new Promise((resolve, reject) => {
					uni.showLoading({title: '加载中'});
					this.$http.get(studio.getStudioDetail,{studio_id:this.params.obj_id}).then(res => {
						resolve(res);
						uni.hideLoading();
					}).catch(err=>{});
				})
			},
			getEquips(){
				this.$http.get(equipment.getList,this.equipment.equip_param).then(res => {
					let arr = this.util.deepcopy(res.rows);//天和时都可以租
					let arr1 = [];//除去仅按时租
					arr.forEach((v,ret) => {
						if(v.only_rent_day=='0'){
							arr1.push(ret,1);
						}
					}) 
					console.log('arr---',arr)
					console.log('arr1---',arr1)
					if(this.params.rent_type==2){
						// 若订单为日租订单
						this.equipment.equips = arr;
					}else{
						// 若订单为时租订单
						this.equipment.equips = arr1;
					}
					this.equipment.equips = res.rows;
					this.equipment.equips.forEach(v => {
						if(this.equip_tags.length>0){
							this.equip_tags.forEach(item => {
								if(item.id==v.id){
									v.value = item.value;
								}
							})
						}else{
							v.value = 0;
						}
					})
					this.equipment.total = res.total_count;
				}).catch(err=>{})
			},
			getCommonQuestions(){
				let params = {type:1,obj_id:this.params.obj_id};
				this.$http.get(question.getCommon,params).then(res => {
					this.com_questions = res;
				})
			},
			getQuestions(){
				let param = Object.assign(this.ques_params,{relation_id:this.params.obj_id});
				this.$http.get(question.getList,param).then(res => {
					this.qus_total = res.total_count;
					this.questionList = res.rows;
					this.questionList.forEach(item => {
						item.create_time_str =  Format.formatDateNoHouer(item.create_time*1000);
					})
				}).catch(err=>{})
			},
			pageChange(val){
				if(val.type=='prev'){
					if(this.equipment.equip_param.page>1){
						this.equipment.equip_param.page -= 1;
						this.getEquips();
					}
				}else{
					this.equipment.equip_param.page += 1;
					this.getEquips();
				}
			},
			sureClick(){
				this.$refs.popup.close();
			},
			time_type(data){
				this.dayAndtime.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.params.rent_type = item.type;
						if(this.params.rent_type==1){
							this.params.start_time = this.currentDate+' '+this.time.timeStart + ':00';
							this.params.end_time = this.currentDate+' '+this.time.timeEnd + ':00';
						}else{
							this.params.start_time = this.currentDate;
							this.params.end_time = this.currentDate;
						}
					}else{
						item.active = false;
					}
				})
			},
			comfirmtime(){
				this.$refs.popuptime.close();
			},
			closeTimePopup(){
				this.$refs.popuptime.close();
			},
			closePricepopup(){
				this.$refs.popupPrice.close();
			},
			openCoupon(){
				this.getShopCoupons().then(res=>{
					if(this.shop_coupons.length>0){
						this.$refs.popupCoupon.open()
					}
				})
			},
			closeCouponPopup(){
				this.$refs.popupCoupon.close()
			},
			gotoShop(data){
				console.log(1)
				uni.navigateTo({
					url:"/pages/merchant/shop/shop?id="+data.id+'&&name='+data.nick
				})
			},
			seemore(){
				if(this.seemore_type==1){
					uni.navigateTo({url:'/pages/home/category/comQues/allComments?relation_id='+this.params.obj_id+'&type=1'+'&shop_id='+this.storeInfo.id+'&product_name='+this.studioDetail.name+'&pic='+this.studioDetail.pics[0]});
				}else{
					uni.navigateTo({url:'/pages/home/category/comQues/allQuestions?relation_id='+this.params.obj_id+'&type=1'+'&shop_id='+this.storeInfo.id+'&product_name='+this.studioDetail.name+'&pic='+this.studioDetail.pics[0]});
				}
				
			},
			gotoQueDetail(data){
				uni.setStorage({key: 'questionDetail',data:data});
				uni.navigateTo({url:'/pages/home/category/comQues/questionDetail?product_name='+this.studioDetail.name+'&pic='+this.studioDetail.pics[0]+'&type=1'});

			},
			gotoComDetail(data){
				
			},
			
		},
	}
</script>

<style lang="scss" scoped>

	page,
	.content {
		background-color: #f9f9f9;
		-webkit-overflow-scrolling: touch;
	}

	.content {
		padding-bottom: 100rpx;
	}

	.top {
		position: relative;

		.swiper {
			width: 100%;
			height: 422rpx;

			.image {
				width: 100%;
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
		.conditionArray{
			span{
				display: inline-block;
				padding: 6rpx 20rpx;
				background-color: #F5F5F5;
				color: #333333;
				font-size: 22rpx;
				margin-right: 20rpx;
				border-radius: 4rpx;
				margin-bottom: 10rpx;
			}
		}
		.workTime{
			.info{
				display:flex;
				flex-direction:column;
				font-size:22rpx;
				color:#999999;
				margin-top:10rpx;
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
				content: '/小时';
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
	.subtitle{
				font-size: 28rpx;
				color: #999999;
				width: 120rpx;
				display: inline-block;
				// text-align: right;
			}
	.quan {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			font-size: 30rpx;
			margin-bottom: 20rpx;
			padding: 30rpx;
			background-color: #fff;
			.coupon{
				display: flex;
				flex-wrap: nowrap;
				.discount-scroll{
					flex:1;
					width: 500rpx;
					.discount{
						display: flex;
						// justify-content: space-between;
						
						span{
							display: block;
							white-space: nowrap;
						}
					}
				}
				
			}
			.myquan{
				font-size: 24rpx;
				padding: 5rpx 20rpx;
				color: #EA001F;
				border: 1px solid #EA001F;
				margin-left: 20rpx;
				position: relative;
			}
			.myquan::before{
				content:'';
				width: 10rpx;
				height: 15rpx;
				border-radius: 0 40rpx 40rpx 0;
				background-color: #ffffff;
				position: absolute;
				top: 14rpx;
				left: -1rpx;
				border-top: 1rpx solid #EA001F;
				border-bottom: 1rpx solid #EA001F;
				border-right: 1rpx solid #EA001F;
			}
			.myquan::after{
				content:'';
				width: 10rpx;
				height: 15rpx;
				border-radius: 40rpx 0 0 40rpx;
				background-color: #ffffff;
				position: absolute;
				top: 14rpx;
				right: -1rpx;
				border-top: 1rpx solid #EA001F;
				border-bottom: 1rpx solid #EA001F;
				border-left: 1rpx solid #EA001F;
			}
			.youjiantou::before{
				content: '领券';
				color: #999999;
				margin-right: 20rpx;
				font-size: 24rpx;
			}
		}
		.timeequip{
			margin-bottom: 20rpx;
			background-color: #fff;
		}
		.renttime {
			font-size: 28rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #f8f8f8;
			padding: 30rpx;
			
			.date {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.time{
					color: #333333;
					font-size: 26rpx;
					margin-left: 20rpx;
				}
			}

			// .date:not(:last-child)::after {
			// 	content: '，'
			// }
		}
	.charge-mode {
		margin-top: 18rpx;
		// padding: 25rpx 30rpx 2rpx;
		color: rgb(51, 51, 51);
		background-color: #ffffff;
		.title{
			margin-bottom: 30rpx;
		}
		.mode {
			.title {
				font-size: 28rpx;
				font-weight: bold;

				.explain {
					font-size: 24rpx;
					color: #ff8326;
				}
			}

			.detail {
				margin: 22rpx 0 34rpx;
				font-size: 28rpx;
				.header1{
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #f5f8fe;
					border: 1rpx solid #cccccc;
					border-bottom: none;

					text {
						width: 50%;
						text-align: center;
						padding: 14rpx 0;
					}

					text:not(:last-child) {
						border-right: 1rpx solid #eeeeee;
					}
				}
				.header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #f5f8fe;
					border: 1rpx solid #cccccc;
					border-bottom: none;

					text {
						width: 33.3%;
						text-align: center;
						padding: 14rpx 0;
					}

					text:not(:last-child) {
						border-right: 1rpx solid #eeeeee;
					}
				}

				.detail-content {
					display: flex;
					justify-content: space-between;
					align-items: center;
					border: 1rpx solid #cccccc;
					background-color: #ffffff;
					border-top: none;

					.hour {
						margin: 0 auto;

						.pick {
							position: relative;

							.next {
								position: absolute;
								right: 0;
								top: 10rpx;
								color: #cccccc;
							}
						}

						.input {
							border: 1rpx solid #cccccc;
							padding: 10rpx 46rpx 10rpx 20rpx;
							border-radius: 8rpx;
						}
					}

					.right,.rightx {
						display: flex;
						justify-content: space-between;
						align-items: center;
						width: 100%;
						text-align: center;
						border-left: 1rpx solid #eeeeee;
						.infacttime {
							border-left: 1rpx solid #eeeeee;
							border-right: 1rpx solid #eeeeee;
						}

						.price {
							text::before {
								content: '￥';
							}
						}

						
					}
					.right{
						.usetime {
							width: 33.3%;
						}
						.infacttime,
						.price {
							display: flex;
							flex-direction: column;
							width: 33.3%;

							text {
								padding: 16rpx 0;
							}

							.line {
								border-bottom: 1rpx solid #eeeeee;
							}
						}
					}
					.rightx{
						text {
								padding: 25rpx 0;
							}
						.usetime{
							border-right: 1px solid #eeeeee;
						}
						.usetime,.price {
							width: 50%;
							padding: 20rpx 0;
							border-bottom: 1px solid #eeeeee;
						}
					}
				}

				.detail-content:not(:last-child) {
					border-bottom: none;

					.right {
						border-bottom: 1rpx solid #eeeeee;
					}
				}
			}
		}
	}

	.equipment {
		margin-top: 18rpx;
		background-color: #ffffff;
		padding: 25rpx 30rpx 10rpx;

		.title {
			font-size: 26rpx;
			color: #666666;

			text {
				margin: 10rpx 0;
				padding: 0 10rpx;
			}

			text:not(:last-child) {
				border-right: 1rpx solid #858585;
			}

			.active {
				font-size: 28rpx;
				color: #333333;
			}
		}
		.condition{
			color: #333333;
			font-size: 26rpx;
			line-height: 60rpx;
			.condition-item:not(:last-child):after{
				content: '，';
			}
		}

	}

	.comments{
		padding: 0rpx 30rpx 20rpx;
		margin-top: 20rpx;
		background-color: #ffffff;
		.tabs{
			padding: 30rpx 0 20rpx;
			border-bottom: 1px solid #f8f8f8;
			.comment-tab{
				margin-right: 40rpx;
				font-size: 32rpx;
				color: #333333;
				padding-bottom: 20rpx;
				display: inline-block;
			}
			.active{
				color: #651FFF;
				// border-bottom: 4rpx solid #651FFF;
			}
		}
		.comment-content{
			
			.line1{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx 0 10rpx;
				.left{
					display: flex;
					align-items: center;
					.name{
						font-size: 28rpx;
						color: #333333;
						margin: 0px 20rpx;
						font-weight: bold;
						width: 150rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						
					}
					.comment-rate{
						margin-bottom: 5rpx;
					}
				}
				.right{
					font-size: 24rpx;
					color: #999999;
				}
			}
			.header-img{
				width: 70rpx;
				height: 70rpx;
				border-radius: 40rpx;
			}
			.line2{
				padding: 0 20rpx 20rpx;
				border-bottom: 1px solid #f8f8f8;
				span{
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
					display: inline-block;
					
				}
				.nodata{
					color: #999999;
				}

			}
		}
		.question-content{
			.question-item{
				padding: 30rpx 0;
				background-color: #ffffff;
				margin-bottom: 20rpx;
				.line{
					margin-bottom: 30rpx;
					.qus,.ans{
						display: inline-block;
						width:40rpx;
						height: 40rpx;
						line-height: 40rpx;
						text-align: center;
						color: #ffffff;
						font-size: 28rpx;
						margin-right: 20rpx;
					}
					.qus{
						background-color: #EA001F;
					}
					.ans{
						background-color: #651FFF;
					}
					.text{
						font-size: 28rpx;
					}
				}
				.dateOrCount{
					font-size: 24rpx;
					color: #999999;
					display: flex;
					justify-content: space-between;
					span{
						display: inline-block;

					}
				}
				
			}
		}
		.seemore{
			margin-top: 20rpx;
			padding: 30rpx 0 10rpx;
			display: flex;
			justify-content: center;
			.seemore-btn{
				border:1px solid #651FFF;
				padding: 10rpx 40rpx;
				color: #651FFF;
				font-size: 28rpx;
				border-radius: 40rpx;
			}
		}
		.nodata{
			width: 100%;
			text-align: center;
			font-size: 28rpx;
			color: #999999;
			margin-top: 10rpx;
		}
	}
	.shop{
		padding: 20rpx 30rpx;
		margin-top: 20rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-around;
		// align-items: center;
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
				left: 56rpx;
				top: 65rpx;
				width: 40rpx;
				height: 6rpx;
				background-color: #651FFF;
			}
		}
		
		
	}
	.studio {
		.nodata{
			font-size: 28rpx;
			color: #999999;
			width: 100%;
			text-align: center;
			margin: 50rpx 0;
		}
		background-color: #ffffff;
		padding: 25rpx 30rpx 2rpx;
		
		.big-title{
				font-size: 40rpx;
				font-weight: bold;
				color:#333333;
				margin-bottom: 30rpx;
			}
		.title {
			font-size: 30rpx;
			color: #333333;
			
		}
		.facility{
			margin-bottom: 40rpx;
			
			.fa-item{
			margin: 20rpx 0 40rpx 0;
			span{
				display: inline-block;
				margin-bottom: 10rpx;
				padding: 5px 30rpx;
				font-size: 24rpx;
				background-color: #EDFEF0;
				color: #333333;
				margin-right: 20rpx;
				border-radius: 5rpx;
			}
			
			}
			.video{
				width: 100%;
				
			}
			.product_param{
				padding:  0 20rpx 20rpx;
				display: flex;
				flex-wrap: wrap;
				background-color: #FAF7FF;
				margin-bottom: 30rpx;
				.item{
					width: 50%;
					padding-top: 20rpx;
					font-size: 28rpx;
					color: #333333;
					display: flex;
					align-items: flex-start;
					span{
						display: inline-block;
						
					}
					.name{
						width: 45%;
					}
					.item-content{
						width: 55%;
					}
				}
			}
		}
		.product-info{
			width: 100%;
			margin-bottom: 30rpx;
			.info-image{
				width: 100%;
				display: block;
			}
		}
		.location{
			margin-bottom: 80rpx;
			.address{
				font-size: 30rpx;
				color:#333333;
				margin-bottom: 20rpx;
				.iconfont{
					color: #651FFF;
					margin-right: 20rpx;
					
				}
			}
		}
		
		.intruduce {
			padding-bottom: 30rpx;

			.img {
				// margin: 30rpx 0 0rpx;
				display: block;
				width: 100%
			}

			.text {
				font-size: 26rpx;
				color: rgb(51, 51, 51);
				line-height: 1.5;
			}
		}
		.common-questions{
			.question-content{
				.question-item{
					padding: 30rpx;
					background-color: #ffffff;
					margin-bottom: 20rpx;
					.line{
						margin-bottom: 30rpx;
						.qus,.ans{
							display: inline-block;
							width:40rpx;
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							color: #ffffff;
							font-size: 28rpx;
							margin-right: 20rpx;
						}
						.qus{
							background-color: #EA001F;
						}
						.ans{
							background-color: #651FFF;
						}
						.text{
							font-size: 28rpx;
						}
					}
					
				}
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
			font-size: 24rpx;
			text-align: center;
			// margin-left: 10rpx;
			.model {
				// flex: 1;
				color: #666666;
				margin:0rpx 30rpx;
				flex-shrink: 0;
			}

			// .model:not(:last-child) {
			// 	border-right: 1rpx solid #cccccc;
			// }

			.active_model {
				color: #EA001F;
			}
		}
		._right{
			flex:1;
			display: flex;
			justify-content: flex-end;
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
				// position: relative;
				flex: 1;
				text-align: center;
				.price{
					margin-top: 30rpx;
				}
				.price-detail{
					font-size: 20rpx;
					margin-top: 36rpx;
					margin-left: 10rpx;
					height: 30rpx;
					line-height: 30rpx;
					border-bottom: 1px solid #ffffff;
				}
			}
		}
		
	}
	.tag{
		padding: 30rpx; 
		background-color: #ffffff;
		// margin-bottom: 10rpx;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		.tag-item{
			margin-right: 20rpx;
			margin-bottom: 30rpx;
			display:flex;
			position: relative;
			width: 30%;
		}
		.tag-name{
			display: inline-block;
			padding: 8rpx 30rpx;
			font-size: 14px;
			color: #651FFF;
			border: 1px solid #651FFF;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.close{
			position: absolute;
			display: inline-block;
			top: -20rpx;
			right: -10rpx;
			color: #651FFF;
			background-color: #ffffff;
			border: 1px solid #651FFF;
			border-radius: 20rpx;
			padding: 5rpx;
			width: 25rpx;
			height: 25rpx;
			.iconfont{
				font-size:20rpx;
				position: relative;
				top: -20rpx;
				left: 3rpx;
			}
		}
	}
.popup{
		padding: 20rpx 40rpx 0;
		// position: relative;
	}
	.equi-title{
		font-size: 32rpx;
		color: #333333;
		padding: 20rpx 0;
		width: 100%;
		text-align: center;
		background-color: #f8f8f8;
		
	}
	.equip-list-nodata{
		width: 100%;
		font-size: 28rpx;
		text-align: center;
		margin: 150rpx 0;
		color: #999999;
	}
	.equip-list{
		margin-top: 120rpx;
		margin-bottom: 250rpx;
	}
	.equip-item{
		display: flex;
		justify-content: space-between;
		align-content: space-between;
		padding: 20rpx;
		margin: 20rpx;
		box-shadow:0 0 20rpx #E4E4E4;
		height: 140rpx;
		
		.left,.right{
			display: flex;
			// flex-direction: column;
			flex-wrap: wrap;
			align-content: space-between;
			height: 100%;
		}
		.left{
			flex: 3;
			.equip-name{
				width: 90%;
				font-size: 32rpx;
				color: #333333;
				line-height: 40rpx;
				overflow:hidden; 
				text-overflow:ellipsis;
				display:-webkit-box; 
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2; 
			}
			.equip-store{
				font-size: 24rpx;
				color: #999999;
			}
		}
		.right{
			flex:1;
			.price{
				color: #DB1522;
				font-size: 28rpx;
				width: 100%;
				text-align: center;
			} 
			.count {
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
	}
	
	.active{
		position: relative;
		background-color: #ffffff;
		.selected-sign {
			width: 0;
			height: 0;
			border: 20rpx solid;
			border-color: #651FFF transparent transparent #651FFF ;
			position: absolute;
			top:0;
			left: 0;
			content: '';
		}
	}
	.equip-footer{
		position: fixed;
		width: 100%;
		bottom: 100rpx;
		z-index: 5;
		border-top: 1rpx solid #f8f8f8;
		.uni-pagina{
			background-color: #fff;
			padding: 20rpx 0;
		}
	}
	.table-title{
		padding: 20rpx 20rpx 0;
		display: flex;
		justify-content: space-around;
		margin-left: 70rpx;
		span{
			display: inline-block;
			padding: 10rpx 20rpx;
			font-size: 28rpx;
			color: #666666;
			
		}
		span:first-child{
			width: 50%;
		}
		span:last-child{
			margin-right: 20rpx
		}
	}
	.checkbox-list{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.equip-name{
			font-size: 28rpx;
			color: #333333;
			line-height: 40rpx;
			margin-left: 20rpx;
			width: 60%;
		}
		.equip-num,.equip-price{
			width:20%;
			font-size: 28rpx;
			color: #333333;
			line-height: 40rpx;
			text-align: center;
		}
		.equip-price{
			color: #EA001F;
		}
		.equip-price::before{
			content: '￥';
			

		}
	}
	.choosebtn {
		display: flex;
		justify-content: space-between;
		// margin: 0 30rpx 30rpx;
		// margin-top: 20rpx;
		.btn {
			font-size: 28rpx;
			height: 80rpx;
			line-height: 80rpx;

		}

		.btnReset {
			width: 50%;
			border: 1rpx solid #f8f8f8;
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
.timepopup{
	padding-bottom:180rpx;
	padding-top: 120rpx;
}
.type-title{
	font-size: 32rpx;
	color: #333333;
	padding: 20rpx;
	width: 100%;
	text-align: center;
	background-color: #f8f8f8;
}
.list-item{
	display: flex;
	justify-content: flex-start;
	margin: 20rpx;
	.title1{
		font-size: 28rpx;
		color: #999999;
		padding: 10rpx 20rpx;
	}
	.studio-area{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		
		font-size: 28rpx;
		.studio-item{
			padding: 10rpx 20rpx;
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
	.picktime{
		text-align: center;
		display: flex;
		justify-content: space-around;
		position: relative;
		padding: 9rpx 20rpx 9rpx 0;
		text-align: center;
		position: relative;
		top: -6rpx;
		.uni-input{
			width: 200rpx;
			border: 1rpx solid #cccccc;
			padding: 10rpx;
			color: #651FFF;
			font-size: 26rpx;
			// margin-right: 20rpx;
		}
		.uni-input1{
			width: 150rpx;
			border: 1rpx solid #cccccc;
			padding: 10rpx;
			color: #651FFF;
			font-size: 26rpx;
			// margin-right: 20rpx;
		}
		.line {
			width: 20rpx;
			height: 40rpx;
			position: relative;
			bottom: 10rpx;
			margin: 0 20rpx;
			border-bottom: 1rpx solid #cccccc;
		}
	}
}
.comfirmBtn{
	padding:20rpx;
	width:100%;
	position:absolute;
	bottom:0;
	background-color:#651FFF;
	color:#ffffff;
	font-size:28rpx;
	text-align:center;
}
.price-table{
	margin-bottom: 150rpx;

	.big-title{
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		.left{
			font-size: 32rpx;
			
		}
		.right{
			font-size: 30rpx;
		}
	}
	.price-table-title{
		width: 100%;
		display: flex;
		justify-content: space-between;
		span{
			padding: 20rpx;
			display: inline-block;
			font-size: 28rpx;
			width: 100%;
			text-align: center;
			background-color: #f8f8f8;
		}
	}
	.price-item{
		display: flex;
		font-size: 24rpx;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f8f8f8;
		.left{
			width: 188rpx;
			text-align: center;
			overflow:hidden; 
			text-overflow:ellipsis;
			display:-webkit-box; 
			-webkit-box-orient:vertical;
			-webkit-line-clamp:2;
		}
		.right{
			flex:1;
			.line{
				display: flex;
				justify-content: space-around;
				width: 100%;
				span{
					display: inline-block;
					width: 188rpx;
					padding: 20rpx 0;
					border-left: 1rpx solid #f8f8f8;
					text-align: center;
				}
			}
			
		}
	}
}
.couponPopup,.equipPopup,.timePopup{
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
        p{
            padding: 0 25rpx;
            display: inline-block;
        }
    }
}
.couponPopup{
	.couponList{
		// background-color: #f8f8f8;
		padding: 30rpx 0 ;
		position:relative;
		top:90rpx;
		margin-bottom: 200rpx;
	}
}
</style>
