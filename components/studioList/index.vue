<template>
	<view class="body">
		<div :class="isReachTop?'fixed-top':''" :style="'top:'+cssTop">
			<div class="search-box" :style="shop_id?'padding:18rpx 30rpx 0':'padding: 18rpx 30rpx;'">
				<div class="search">
					<span class="iconfont iconsousuo"></span>
					<form action="#" class="search-input">
						<input type="search" placeholder="输入搜索内容"  placeholder-style="color:#999999;" v-model="params.search"
							@confirm="searchChange" />
					</form>
					<span class="iconfont iconcuo" v-if="params.search" @click="clearSearch"></span>
				</div>
			</div>
			
		</div>
		<div :class="!shop_id?'advSel':''">
			<!-- 广告 -->
			<advertise :type='1' v-if="!shop_id" ref="advertise"></advertise>
			
			<view class="select-title" :class="selTop">
				<div class="title-item"  :class="shop_id?'shop-item':'list-item'">
					<div class="choose item" 
					:class="c_item.active?'active':''" 
					v-for="(c_item,index) in choose_list" 
					:key="index" 
					@click="chooseChange(c_item.name,index)"
					>
					<span style="margin-right:10rpx">{{c_item.name}}</span>
					<span v-if="index==1||index==2" class="up" :style="!c_item.up&&chooseIndex==index?'border-bottom:8rpx solid #651FFF':''"></span>
					<span v-if="index==1||index==2" class="down" :style="c_item.up&&chooseIndex==index?'border-top:8rpx solid #651FFF':''"></span>
					</div>
					<div class="item" @click="show" v-if="!shop_id">筛选 <span class="iconfont iconshaixuan"></span></div>
					
				</div>
				<div class="tag" v-show="selectTag.city||selectTag.studio||selectTag.price||selectTag.square">
					<div class="tag-item" v-if="selectTag.city">
						<span class="tag-name">{{selectTag.city}}</span>
						<image class="closeImg" :src="closeImg" @click="closeTag(4)"></image>
						<!-- <div class="close" @click="closeTag(4)">
							<span class="iconfont iconguanbi"></span>
						</div> -->
					</div>
					<div class="tag-item" v-if="selectTag.studio">
						<span class="tag-name">{{selectTag.studio}}</span>
						<image class="closeImg" :src="closeImg" @click="closeTag(1)"></image>
						<!-- <div class="close" @click="closeTag(1)">
							<span class="iconfont iconguanbi"></span>
						</div> -->
					</div>
					<div class="tag-item" v-if="selectTag.price">
						<span class="tag-name">{{selectTag.price}}</span>
						<image class="closeImg" :src="closeImg" @click="closeTag(2)"></image>
						<!-- <div class="close" @click="closeTag(2)">
							<span class="iconfont iconguanbi"></span>
						</div> -->
					</div>
					<div class="tag-item" v-if="selectTag.square">
						<span class="tag-name">{{selectTag.square}}</span>
						<image class="closeImg" :src="closeImg" @click="closeTag(3)"></image>
						<!-- <div class="close" @click="closeTag(3)">
							<span class="iconfont iconguanbi"></span>
						</div> -->
					</div>

				</div>
			</view>
		</div>
		<div class="list-body">
			<div class="studio1" v-if="studioList.length>0">
				<div class="item-big" v-for="item in studioList" :key="item.id">
					<div  @click="gotoDetail(item.id)">
						<div class="swiper-box">
							<swiper class="imageContainer" @change.stop="swiperItemChange($event,item.id)"  @touchend.stop circular>
								<swiper-item class="swiperitem" v-for="(img_item,img_idx) in item.pics" :key="img_idx">
									<image :src="host+img_item" class="img" mode="aspectFill"></image>
								</swiper-item>
							</swiper>
							<view class="dots" :class="type=='shop'?'toLeft':'toCenter'" v-if="item.pics.length>1">
								<block v-for="(d_item,d_idx) in item.pics" :key="d_idx">
								<view :class="d_idx == item.currentSwiper ? 'dot active' : 'dot'"></view>
								</block>
							</view>
						</div>
						
						<div class="info">
							<div class="name">{{ item.name }}</div>
							<div class="info-data">
								<p class="left">
									<span class="score">{{item.score}}分</span>
									<span class="other">
									/{{item.floor}}楼.{{item.square}}m².{{item.total}}销量
									</span>
								</p>
								
							</div>
							<scroll-view class="condition" scroll-x="true">
								<span v-for="(cdt_item,index) in item.conditions" :key="index">{{cdt_item}}</span>
							</scroll-view>
							<p class="line">
								<span class="pricebold">{{item.priceWorkDayWorkTimePerHour}}</span>
								<span class="shopName" @click.stop="gotoShop(item)" v-if="!shop_id">{{item.nick}}</span>
							</p>
							<p class="address">{{item.address}}</p>
						</div>
					</div>
					
					<div class="to-collect" :class="item.is_start?'iscollect':'notcollect'" @click="collectOrnot(item)">
						<span class="iconfont iconshoucang1-copy" v-if="!item.is_start"></span>
						<span class="iconfont iconshoucang" v-else></span>
					</div>
				</div>
				<div class="reachBottom" v-if="noMoreData">到底啦~</div>
			</div>
			
		</div>
		<empty-show v-if="studioList.length==0&&!loading" hasMenu='1'  :isShop="shop_id?true:false" :style="advList.length>0?'margin-top:450px':''"></empty-show>
		<uni-popup ref="popupRef" type="top">
			<view class="chooseForm">
				<view class="uni-list-one" style="margin-bottom: 0;" v-if="!type">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							使用城市
						</view>
						<view class="uni-list-cell-db-one" @click="toPickCity">
							<view class="uni-input">{{params.city}}</view>
							<view class="icon"></view>
						</view>
					</view>
					<view class="clear"></view>
				</view>

				<view class="uni-list-one clear">
					<view class="uni-list-cell-one" @click="onShowDatePicker('range')">
						<view class="uni-list-cell-left-one">
							租用时间
						</view>
						<!-- uni-list-cell-db-one -->
						<!--#ifdef MP-WEIXIN || APP-PLUS -->
						<view class="uni-list-cell-db-one-range" >
							<picker mode="date" :value="params.dateStart"   @change="bindDateChange($event, 'start')">
								<!-- @click="openDatePicker('start')" -->
								<view class="uni-input" v-if="params.dateStart">{{params.dateStart}}</view>
								<view class="uni-input" v-else>开始时间</view>
								<!-- <view class="icon"></view> -->
							</picker>
							<view class="line"></view>
							<picker mode="date" :value="params.dateEnd"  @change="bindDateChange($event, 'end')">
								<!-- @click="openDatePicker('end')" -->
								<view class="uni-input" v-if="params.dateEnd">{{params.dateEnd}}</view>
								<view class="uni-input" v-else>结束时间</view>
								<view class="icon"></view>
							</picker>
						</view>
						<!--#endif -->
						<!--#ifdef H5 -->
						<view class="uni-list-cell-db-one-range" >
								<view class="uni-input" v-if="params.dateStart">{{params.dateStart}}</view>
								<view class="uni-input" v-else>开始时间</view>
							
							<view class="line"></view>
								<view class="uni-input" v-if="params.dateEnd">{{params.dateEnd}}</view>
								<view class="uni-input" v-else>结束时间</view>
								<view class="icon"></view>
						</view>
						<!--#endif -->
					</view>
				</view>
				<view class="uni-list-one clear">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							影棚类型
						</view>
						<view class="equipment">
							<div class="eqi-item" :class="item.active?'active':''" v-for="(item,idx) in studioTypes" :key="idx" @click="studioPick(item.name,1)">{{item.name}}
								<span class="icon"></span>
							</div>
						</view>
					</view>
				</view>
				<view class="uni-list-one" style="margin-bottom: 0;">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							价格范围
						</view>

						<div class="studio-area">
							<div class="studio-item" :class="item.active?'active':''" v-for="(item,idx1) in prices " :key="idx1" @click="pricePick(item.name,1)">
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
							影棚面积
						</view>
						<div class="studio-area">
							<div class="studio-item" :class="item.active?'active':''" v-for="(item,idx1) in squares " :key="idx1" @click="squarePick(item.name,1)">
								{{item.name}}
								<span class="icon"></span>
							</div>
						</div>
					</view>
				</view>
			</view>
			<view class="choosebtn">
				<span plain="true" class="btn btnReset" @click="reset">重置</span>
				<span plain="true" class="btn btnSure" @click="sureClick">确定</span>
			</view>
		</uni-popup>
		<!-- <datetime-picker ref="datePicker" @onConfirm="dateOnConfirm" @onCancel="dateOnCancel"></datetime-picker> -->
		 <!-- #ifdef H5 -->
		 <mx-datepicker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
		<!-- #endif -->
	</view>
</template>

<script>
	import advertise from "@/components/advertise/advertise.vue"
	//引入弹出层
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
	//区间滑块
	import RangeSlider from '@/components/range-slider/range-slider'
	// #ifdef H5
	import mxDatepicker from "@/components/mx-datepicker/mx-datepicker.vue"
	// #endif
	import {
		studio
	} from '@/common/api/api'
	import {
		conditionArray,errorPic
	} from '@/common/utils/config'
	import { collectOther } from '@/common/utils/collect';
	import {mapState} from 'vuex'
	export default {
		props: {
			type: String,
			shop_id: String,
			search: String,
			// shop_city_code: String
		},
		computed: {
			...mapState(['user']),
			listTop(){
				if(this.shop_id){
					return 'list-top0'
				}else{
					// #ifdef H5
					return 'list-top1'
					// #endif
					// #ifdef MP-WEIXIN || MP-ALIPAY
					return 'list-top2'
					// #endif
				}
			},
			selTop(){
				if(this.shop_id){
					if(this.isReachTop){
						// #ifdef MP-WEIXIN || H5 || MP-ALIPAY
						return 'selTop'
						// #endif
						// #ifdef APP-PLUS
						return 'selTopApp'
						// #endif
					}else{
						return ''
					}
				}else{
					if(this.advHide){
						// #ifdef MP-WEIXIN || APP-PLUS || MP-ALIPAY
						return 'adv-hide'
						// #endif
						// #ifdef H5
						return 'adv-hide-h5'
						// #endif
					}else{
						return ''
					}
				}
			},
			cssTop(){
				if(this.shop_id){
					// #ifdef H5
					return '80rpx'
					// #endif
					// #ifdef MP-WEIXIN || MP-ALIPAY
					return '88rpx'
					// #endif
				}else{
					// #ifdef H5
					return '80rpx'
					// #endif
					// #ifdef MP-WEIXIN || APP-PLUS || MP-ALIPAY
					return '0rpx'
					// #endif
					
				}
			}
		},
		components: {
			RangeSlider,
			uniPopup,
			advertise,
			// datetimePicker,
			// #ifdef H5
			mxDatepicker
			// #endif
		},
		watch:{
			params:{
				handler(newVal, oldVal) {
					this.params.dateStart = this.params.dateStart.replace('/','-');
					this.params.dateEnd = this.params.dateEnd.replace('/','-');
					let startTem = this.util.toTimestamp(this.params.dateStart);
					let endTem = this.util.toTimestamp(this.params.dateEnd);
					if(startTem>endTem){
						this.params.dateEnd = this.params.dateStart
					}
					
		　　　　},
		　　　　deep: true
			}
		},
		data() {
			//阻止元素发生默认的行为
			const _stop = (e) => e.preventDefault()
			//日期
			const currentDate = this.util.getDate();
			return {
				is_h5:false,
				host: this.$qiniuHost,
				closeImg:'../../../static/icon/close.png',
				choose_list: [{
						name: '默认',
						type: '',
						active: true
					},
					{
						name: '价格',
						type: 'priceWorkDayWorkTimePerHour',
						active: false,
						up:true
					},
					{
						name: '销量',
						type: 'total',
						active: false,
						up:true
					},
				],
				chooseIndex:0,
				slideRange: {
					minValue: 0,
					maxValue: 1200,
					rangeValues: [0, 1200],
					slideWidth: 650,
					slideHeight: 70,
					slideBlockSize: 50,
					slideMin: 150,
					slideMax: 1200,
					step: 200,
					data: [0, '￥1000+']
				},
				studioTypes: [{
						name: '不限',
						active: true,
						type: 0
					},
					{
						name: '录音棚',
						active: false,
						type: 1
					},
					{
						name: '实景棚',
						active: false,
						type: 2
					},
					{
						name: '无影棚',
						active: false,
						type: 3
					},
					{
						name: '特效棚',
						active: false,
						type: 4
					},
					{
						name: '白棚',
						active: false,
						type: 5
					},
					{
						name: '绿棚',
						active: false,
						type: 6
					},
				],
				squares: [{
						name: '不限',
						active: true,
						type: 0
					},
					{
						name: '100m²以下',
						active: false,
						type: 1
					},
					{
						name: '100m²-200m²',
						active: false,
						type: 2
					},
					{
						name: '1200m²-300m²',
						active: false,
						type: 3
					},
					{
						name: '300m²以上',
						active: false,
						type: 4
					},
				],
				prices:this.config.pricesRange,
				priceIndex: 0,
				studioChoose: {

					stylefocus: 0,
					startDate: currentDate,
					endDate: currentDate,
					minPrice: 0,
					maxPrice: '无限',
					minSize: 0,
					maxSize: '无限'
				},
				studioList: [],
				params: {
					page: 1,
					page_size: 10,
					cityCode: '',
					dateStart: '',
					dateEnd: '',
					studioPrice: '0',
					square: '0',
					typeClassify: '0',
					studio_uid: '',
					search: '',
					order_by: '',
				},
				date_flag:'',
				city:this.config.defaultCity,
				currentDate: currentDate,
				selectTag: {
					price: '',
					studio: '',
					square: '',
					city:''
				},
				addPage: false,
				loading:true,
				isShop:true,
				isReachTop:false,
				showPicker:false,
				datetype: 'range',
				value: '',
				studioScrollData: {
					offetHeight: 105, // px
					height: 175, // px
					colunm: 1
				},
				showStudioIndex:0,
				windowHeight:'',
				noMoreData:false,
				advHide:false,
				advList:[]
			}
		},
		onLoad(e) {
			let res = wx.getSystemInfoSync();
			this.windowHeight = `${res.windowHeight-105}px`
			if (e.options) {
				let obj = JSON.parse(e.options);
				if (obj.priceIndex) {
					this.params.studioPrice = obj.priceIndex;
					this.pricePick(obj.priceIndex);
				}
				//类型,白棚，绿棚等
				if(obj.type){
					this.params.typeClassify=obj.type;
					this.studioPick(obj.type);
				}
				if (obj.city) {
					this.params.cityCode = obj.city.code;
					this.params.city = obj.city.city;
					if(this.params.cityCode!=0){
						this.selectTag.city=obj.city.city;
					}
					this.city=obj.city;
				}
				if (obj.dateStart) {
					this.params.dateStart = obj.dateStart;
				}
				if (obj.dateEnd) {
					this.params.dateEnd = obj.dateEnd;
				}
			}
			if (e.search) {
				this.params.search = e.search;
			}
			// #ifdef H5
			this.is_h5 = true
			// #endif
		},
		onShow() {
			// this.params.page = 1;
			if (this.util.getStorage('saveCity')) {
				this.city = this.util.getStorage('saveCity');
				this.params.cityCode = this.util.getStorage('saveCity').code;
				this.params.city = this.util.getStorage('saveCity').city;
				// this.util.delStorage('saveCity');
				//如果是默认全国，则删除清楚标签
				if(this.params.city==this.config.defaultCity.city){
					this.selectTag.city='';
				}else{
					this.selectTag.city=this.params.city;
				}
			}
			
		},
		mounted() {
			if(this.user&&this.user.paitume_user&&this.user.paitume_user.id){
				this.params.user_id = this.user.paitume_user.id
			}
			if (this.shop_id) {
				// this.isShop = 'shop';
				this.isReachTop = false;
				delete this.params.dateStart;
				delete this.params.dateEnd;
				delete this.params.studioPrice;
				delete this.params.square;
				delete this.params.typeClassify;
				delete this.params.shop_city_code;
				this.params.studio_uid = this.shop_id;
				// this.params.cityCode = this.shop_city_code;
				
			}else{
				this.isReachTop = true;
			}
			this.getStudioList()
			setTimeout(()=>{
				this.advList = this.$refs.advertise.advList
			},500)
			
		},
		methods: {
			studioScrollLoad(){
				this.addPageOne();
			},
			studioScrollHide(e){
				// console.log('e.detail.scrollTop--',e.detail.scrollTop)
				let data = [
					this.studioScrollData.offetHeight,
					e.detail.scrollTop,
					this.studioScrollData.height,
					this.studioScrollData.colunm,
				];
				this.showStudioIndex = this.util.countIndex(...data)
				console.log('this.showStudioIndex--',this.showStudioIndex)
			},
			onShowDatePicker(type){//显示
				// #ifdef H5
                this.datetype = type;
                this.showPicker = true;
				this.value = this[type];
				// #endif
            },
            onSelected(e) {//选择
                this.showPicker = false;
                if(e) {
					this[this.datetype] = e.value; 
                    //选择的值
					console.log('value => '+ e.value);
					this.params.dateStart = this[this.datetype][0].split(' ')[0].replace(/\//g, '-');
					this.params.dateEnd = this[this.datetype][1].split(' ')[0].replace(/\//g, '-');
                    //原始的Date对象
                    console.log('date => ' + e.date);
                }
			},
			swiperItemChange(e,data){
				let ret = this.studioList.findIndex(e=>e.id==data);
				if(ret!=-1){
					let item = this.studioList[ret];
					this.studioList.splice(ret,1,item);
					this.studioList[ret].currentSwiper = e.detail.current;
				}
			},
			imgError(id){
				let ret = this.studioList.findIndex(e=>e.id==id);
				let arr = this.studioList[ret];
				if(ret!=-1){
					this.studioList[ret].img = errorPic
				}
				this.studioList.splice(ret,1,arr)
			},
			clearSearch(){
				this.params.search = '';
				this.searchChange();
			},
			gotoDetail(data) {
				uni.navigateTo({
					url: '/pages/home/category/studioDetail/studioDetail?studio_id=' + data
				});
			},
			gotoShop(data){
				uni.navigateTo({
					url:"/pages/merchant/shop/shop?id="+data.uid+'&&name='+data.nick
				})
			},
			getOrderUpOrDown(){
				// if(this.chooseIndex==1){
				// 	this.choose_list[1].up = !this.choose_list[1].up
					
				// }else if(this.chooseIndex==2){
				// 	this.choose_list[2].up = !this.choose_list[2].up
					
				// }
			},
			chooseChange(data,index) {
				this.showStudioIndex = 0;
				this.chooseIndex = index;
				if(index==1){
					this.choose_list[1].up = !this.choose_list[1].up
					if(this.choose_list[1].up){
						this.params.order = 'desc'
					}else{
						this.params.order = 'asc'
					}
				}else if(index==2){
					this.choose_list[2].up = !this.choose_list[2].up
					if(this.choose_list[2].up){
						this.params.order = 'desc'
					}else{
						this.params.order = 'asc'
					}
				}
				this.choose_list.forEach(item => {
					if (item.name == data) {
						item.active = true;
						this.params.order_by = item.type;
						this.params.page = 1;
						this.studioList = [];
						this.getStudioList();
					} else {
						item.active = false;
					}
				})

			},
			show() {
				// #ifdef H5
				document.body.style.overflow = 'hidden';
				document.addEventListener("touchmove", this._stop, false); //禁止页面滑动
				// #endif
				this.$refs.popupRef.open(); // 或者 boolShow = rue
			},
			close() {
				// #ifdef H5
				document.body.style.overflow = ''; //出现滚动条
				document.removeEventListener("touchmove", this._stop, false)
				// #endif
				this.$refs.popupRef.close(); // 或者 boolShow = false
			},
			bindPickerChange: function(e, val) {
				console.log('picker发送选择改变，携带值为', e.target.value, val)
				if (val === 'name') {
					this.studioChoose.nameindex = e.target.value
				} else if (val === 'produce') {
					this.studioChoose.produceindex = e.target.value
				}
			},
			styleEvent: function(index, e) {
				this.studioChoose.stylefocus = index
			},
			openDatePicker(flag){
				this.$refs.datePicker.show();
				this.date_flag = flag;
			},
			dateOnConfirm(e){
				if (this.date_flag === 'start') {
					this.params.dateStart = e;
				} else if (this.date_flag === 'end') {
					this.params.dateEnd = e;
				}
			},
			dateOnCancel(e){
				if (this.date_flag === 'start') {
					this.params.dateStart = e;
				} else if (this.date_flag === 'end') {
					this.params.dateEnd = e;
				}
			},
			bindDateChange: function(e, flag) {
				if (flag === 'start') {
					this.params.dateStart = e.target.value;
				} else if (flag === 'end') {
					this.params.dateEnd = e.target.value;
				}

			},
			onRangeChange: function(e) {
				this.slideRange.rangeValues = [e.minValue, e.maxValue]
				this.studioChoose.minPrice = e.minValue === '0' && e.minValue !== '1200' ? 0 : '¥' + e.minValue
				this.studioChoose.maxPrice = e.maxValue === '0' && e.maxValue !== '1200' ? 0 : '¥' + e.maxValue
				if (e.maxValue === '1200') {
					this.studioChoose.maxPrice = '无限'
				}
				if (e.minValue === '1200') {
					this.studioChoose.minPrice = '无限'
				}
			},
			reset() {
				this.$refs.popupRef.close();
				this.params = {
					page: 1,
					page_size: 10,
					cityCode: '',
					dateStart: this.currentDate,
					dateEnd: this.currentDate,
					studioPrice: '0',
					square: '0',
					typeClassify: '0',
					city:'全国'
				};
				this.studioTypes.forEach(v1 => {
					if(v1.name=='不限'){
						v1.active=true;
					}else{
						v1.active = false
					}
					
				});
				this.squares.forEach(v2 => {
					if(v2.name=='不限'){
						v2.active=true;
					}else{
						v2.active = false
					}
				});
				this.prices.forEach(v3 => {
					if(v3.name=='不限'){
						v3.active=true;
					}else{
						v3.active = false
					}
				});
				this.selectTag = {
					price: '',
					studio: '',
					square: ''
				};
				this.getStudioList();
			},
			sureClick: function() {
				this.$refs.popupRef.close();
				this.studioList = [];
				this.params.page = 1;
				this.showStudioIndex = 0;
				this.getStudioList();
			},
			onStudioRangeChange: function(e) {
				this.sizeRange.rangeValues = [e.minValue, e.maxValue]
				this.studioChoose.minSize = e.minValue === '0' && e.minValue !== '1200' ? 0 : this.sizeInTrue(e.minValue)
				this.studioChoose.maxSize = e.maxValue === '0' && e.maxValue !== '1200' ? 0 : this.sizeInTrue(e.maxValue)
				if (e.maxValue === '1200') {
					this.studioChoose.maxSize = '无限'
				}
				if (e.minValue === '1200') {
					this.studioChoose.minSize = '无限'
				}
			},
			getStudioList() {
				uni.showLoading({
					title: '加载中'
				});
				this.loading=true;
				console.log('getStudioList-------------', this.params);
				this.common.getStudioList(this.params).then(res => {
					uni.hideLoading();
					if (this.addPage) {
						this.studioList = this.studioList.concat(res.rows);
					} else {
						this.studioList = res.rows;
					}
					if(res.rows.length==0&&this.params.page!=1){
						this.noMoreData = true;
						// uni.showToast({title: '无更多数据',duration: 2000,icon:'none'});
					}
					this.studioList.forEach(item => {
						item.conditions = [];
						conditionArray.forEach(cdt_item => {
							item.serviceConditionArray.forEach(scdt_item => {
								if (scdt_item == cdt_item.id) {
									item.conditions.push(cdt_item.name);
								}
							})
						})
						item.price = item.priceHolidayWorkTimePerHour;
						item.pics = item.pic.split(',').filter(v=>{return v});
						item.currentSwiper = 0;
						if (item.pic.split(",").filter(v=>{return v}).length > 0) {
							item.img = item.pic.split(',').filter(v=>{return v})[0];
						}

					})
					this.addPage = false;
					this.loading=false;
					
				}).catch(err => {
					uni.hideLoading();
					this.loading=false;
				})

			},
			toPickCity() {
				console.log('toPickCity----------', this.city);
				uni.navigateTo({
					url: '../select-city/select-city?city=' + JSON.stringify(this.city)
				})
			},
			//类型范围选择,如果不传type,不重新获取列表，如果传type/1，即重新加载列表
			studioPick(data,type) {
				this.params.page = 1;
				this.showStudioIndex = 0;
				this.studioTypes.forEach(item => {
					if (item.name == data || item.type == data) {
						item.active = true;
						this.params.typeClassify = item.type;
						if (data == '不限' || data == '0') {
							this.selectTag.studio = '';
						}else{
							this.selectTag.studio = item.name;
						}
					} else {
						item.active = false;
					}
				})
				if(type){
					this.getStudioList();
				}
			},
			//大小范围选择,如果不传type,不重新获取列表，如果传type/1，即重新加载列表
			squarePick(data,type) {
				this.params.page = 1;
				this.showStudioIndex = 0;
				this.squares.forEach(item => {
					if (item.name == data || item.type == data) {
						item.active = true;
						this.params.square = item.type;
						if (data == '不限' || data == '0') {
							this.selectTag.square = '';
						}else{
							this.selectTag.square = item.name;
						}
					} else {
						item.active = false;
					}
				})
				if(type){
					this.getStudioList();
				}
			},
			//价格范围选择,如果不传type,不重新获取列表，如果传type/1，即重新加载列表
			pricePick(data,type) {
				this.params.page = 1;
				this.showStudioIndex = 0;
				this.prices.forEach(item => {
					if (item.name == data || item.type == data) {
						item.active = true;
						this.params.studioPrice = item.type;
						if (data == '不限' || data == '0') {
							this.selectTag.price = '';
						}else{
							this.selectTag.price = item.name;
						}
					} else {
						item.active = false;
					}
				})
				if(type){
					this.getStudioList();
				}
			},
			closeTag(val) {
				this.params.page = 1;
				this.showStudioIndex = 0;
				switch(parseInt(val)){
					case 1:
						this.selectTag.studio = '';
						this.params.typeClassify = '0';
						this.studioPick('0');
						break;
					case 2:
						this.selectTag.price = '';
						this.params.studioPrice = '0';
						this.pricePick('0');
						break;
					case 3:
						this.selectTag.square = '';
						this.params.square = '0';
						this.squarePick('0');
						break;
					case 4:
						this.util.delStorage('saveCity');
						this.selectTag.city = '';
						this.params.city = '全国';
						this.params.cityCode='0';
						break;
				}
				this.getStudioList();
			},
			// 商店的影棚列表收藏或取消收藏
			collectOrnot(data){
				collectOther(data.uid,1,1,data.id).then(res => {
					this.studioList.forEach(item=> {
						if(item.id==data.id){
							this.$set(item,'is_start',!item.is_start);
						}
					})
				})
			},
			searchChange() {
				this.params.page = 1;
				this.getStudioList();
			},
			addPageOne() {
				this.params.page += 1;
				this.addPage = true;
				this.getStudioList();
			},
			reachTop(){
				this.isReachTop = true;
			},
			notReachTop(){
				this.isReachTop = false;
			}

		},
		onPullDownRefresh: function() {
			this.params.page = 1;
			this.getStudioList();
		},
		onReachBottom: function() {
			this.addPageOne();
		},
		onPageScroll:function(e){
			if(e.scrollTop>266){
				this.advHide = true
			}else{
				this.advHide = false
			}
		}
		
	}
</script>

<style lang="scss">
page{
	background-color: #f8f8f8;
	// overflow-y: hidden;
}
	.fixed-top{
		position: fixed;
		width: 100%;
		z-index: 1;
		overflow: hidden;
	}
	.list-body{
		// background-color: #ffffff;
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
	.advSel{
		margin-top: 86rpx;
	}
	.adv-hide{
		position: fixed;
		top: 96rpx;
		width: 100%;
	}
	.adv-hide-h5{
		position: fixed;
		top: 166rpx;
		width: 100%;
		z-index: 1;
	}
	.selTop{
		position: fixed;
		top: 160rpx;
		width: 100%;
		z-index: 1;
	}
	.selTopApp{
		position: fixed;
		top: 100rpx;
		width: 100%;
		z-index: 1;
	}
	.select-title {
		font-size: 30rpx;
		background-color: #ffffff;
		border-bottom: 1px solid #f8f8f8;
		color: #333333;
		z-index: 2;
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
			.choose{
				position: relative;
				.up{
					position: absolute;
					top: 12rpx;
					// right: -10rpx;
					display: inline-block;
					width: 0;
					height: 0;
					border-bottom: 8rpx solid #d9d9d9;
					border-top: 8rpx solid transparent;
					border-left: 8rpx solid transparent;
					border-right: 8rpx solid transparent;
				}
				.down{
					position: absolute;
					bottom: 8rpx;
					display: inline-block;
					width: 0;
					height: 0;
					border-bottom: 8rpx solid transparent;
					border-top: 8rpx solid #d9d9d9;
					border-left: 8rpx solid transparent;
					border-right: 8rpx solid transparent;
				}
			}
			.item{
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
					background-color: inherit
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
	
	.tag {
		// padding: 30rpx;
		padding: 30rpx 30rpx 10rpx;
		background-color: #ffffff;
		margin-bottom: 20rpx;

		.tag-item {
			margin-right: 20rpx;
			display: inline-block;
			position: relative;
			margin-bottom:20rpx;
		}

		.tag-name {
			padding: 8rpx 30rpx;
			font-size: 14px;
			color: #651FFF;
			border: 1px solid #651FFF;
		}
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

				.uni-input {
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

			.equipment {
				display: flex;
				// justify-content: space-around;
				flex-wrap: wrap;

				.eqi-item {
					padding: 10rpx 40rpx;
					background: #F0F0F0;
					width: 120rpx;
					margin: 0 28rpx 10rpx 0;
					text-align: center;
				}

				.active {
					color: #651FFF;
					border: 1px solid #651FFF;
					position: relative;
					background-color: #ffffff;

					.icon {
						width: 0;
						height: 0;
						border: 8rpx solid;
						border-color: transparent #651FFF #651FFF transparent;
						position: absolute;
						bottom: 0;
						right: 0;
						content: '';
					}
				}
			}

			.studio-area {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;

				.studio-item {
					padding: 10rpx 40rpx;
					background: #F0F0F0;
					width: 200rpx;
					margin: 0 30rpx 20rpx 0;
					text-align: center;
				}

				.active {
					color: #651FFF;
					border: 1px solid #651FFF;
					position: relative;
					background-color: #ffffff;

					.icon {
						width: 0;
						height: 0;
						border: 8rpx solid;
						border-color: transparent #651FFF #651FFF transparent;
						position: absolute;
						bottom: 0;
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

	.studio {
		width: 100%;
		padding-top: 30rpx;
		.product-item {
			// background-color: #fff;
			padding: 0 35rpx;
			margin-bottom: 40rpx;
			.line-top {
				display: flex;
				// padding: 0upx 35rpx;
				.left {
					margin-right: 20rpx;

					.img {
						width: 240rpx;
						height: 136rpx;
					}
				}

				.right {
					flex: 1;

					.product-name {
						font-size: 30rpx;
						font-weight: bold;
						margin-bottom: 10rpx;
					}

					.product-data {
						font-size: 26rpx;
						margin-bottom: 20rpx;
						line-height: 40rpx;

						.score {
							font-size: 28rpx;
							color: #651FFF;
							font-weight: bold;
							margin-right: 10rpx;
						}
					}

					.product-other {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.price {
							font-size: 30rpx;
							color: #DB1522;
							font-weight: bold;
						}

						.price:before {
							content: '￥';
							font-size: 20rpx;
							color: #DB1522;
						}

						.perhour {
							font-size: 20rpx;
							color: #999999;
							font-weight: 400;
						}

						.shop-name {
							display: flex;
							align-items: center;
							color: #999999;

							span {
								display: inline-block;
							}

							.name {
								font-size: 26rpx;
								margin-left: 10rpx;
							}
						}

					}
				}
			}

			.product-address {
				color: #999999;
				margin-top: 20rpx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				// padding: 0upx 35rpx;
				.address {
					font-size: 26rpx;
					margin-left: 20rpx;

				}
			}

			.conditionArray {
				// padding: 0upx 35rpx;
				color: #8D5EF4;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				span {
					display: inline-block;
					padding: 6rpx 20rpx;
					background-color: #F9F5FF;
					color: #8D5EF4;
					font-size: 20rpx;
					margin-right: 10rpx;
					border-radius: 20rpx;
				}
			}
		}

		
	}
	.studio1{
		margin: 0 35rpx 30rpx;
		
		.item-big{
			// padding: 30rpx;
			padding-bottom: 20rpx;
			margin-top: 30rpx;
			background-color: #ffffff;
			border-radius: 10rpx;
			position: relative;
			.to-collect{
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
				background:  rgba(0,0,0,0.5);
				
			}
			.notcollect{
				background: rgba(0,0,0,0.5);
			}
			.swiper-box{
				position: relative;
				.imageContainer{
					width:100%;
					height: 384rpx;
					.img{
						width:100%;
						height: 384rpx;
						border-radius: 10rpx 10rpx 0 0;
					}
				}
				
				.dots{
					position: absolute;
					display: flex;
					justify-content: center;
					left: 0;
					right: 0;
					bottom: 20rpx;
					.dot{
						margin: 0 8rpx;
						width: 10rpx;
						height: 10rpx;
						background: #ffffff;
						border-radius: 8rpx;
						transition: all .6s;
					}
					.dot.active{
						width: 24rpx;
						background: #651FFF;
					}
				}
				
			}
			
			.name {
				// width: 92%;
				// padding: 10rpx 4%;
				// display: -webkit-box;
				// -webkit-box-orient: vertical;
				// -webkit-line-clamp: 2;
				// text-align: justify;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 36rpx;
				// line-height: 36rpx;
				color: #333333;
				font-weight: bold;
				margin-bottom: 20rpx;
				margin-top: 20rpx;
			}
			.condition{
				margin:20rpx 0 40rpx;
				overflow: hidden;
				white-space: nowrap;
				span{
					padding: 6rpx 20rpx;
					background-color: #F5F5F5;
					color: #333333;
					font-size: 22rpx;
					margin-right: 20rpx;
					border-radius: 4rpx;
				}
			}
			.info-data{
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 26rpx;
				.left{
					.score{
						color: #651FFF;
						font-weight: bold;
						font-size: 26rpx;
					}
					.other{
						font-size: 22rpx;
						margin-left: 10rpx;
					}
				}
				
			}
			.line{
				display: flex;
				justify-content: space-between;
				line-height: 30rpx;
				span{
					display: inline-block;
				}
				.shopName{
					color: #999899;
					font-size: 26rpx;
					text-decoration: underline;
				}
			}
			.pricebold{
				font-size: 30rpx;
				color:#DB1522;
				font-weight: bold;
			}
			.pricebold:before{
				content:'￥';
				font-size: 22rpx;
				color:#DB1522;
			}
			.pricebold:after{
				content:'/每小时';
				font-size: 22rpx;
				color:#999999;
			}
			.address{
				font-size: 26rpx;
				line-height: 26rpx;
				color: #999899;
				margin-top: 20rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.info {
				padding: 10rpx 35rpx; 
				
			}
		}
	}
.reachBottom{
	width: 100%;
	padding: 20rpx 0;
	text-align: center;
	color: #999999;
	font-size: 28rpx;
}
</style>
