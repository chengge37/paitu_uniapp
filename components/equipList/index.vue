<template>
	<view class="body">
		<div :class="isReachTop?'fixed-top':''" :style="'top:'+cssTop">
			<div class="search-box">
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
			<advertise :type='2' v-if="!shop_id" @change="selTopChange" ref="advertise"></advertise>
			
			<view class="select-title" :class="selTop">
				<div class="title-item"  :class="shop_id?'shop-item':'list-item'">
					<p class="choose" :class="c_item.active?'active':''" v-for="(c_item,index) in choose_list" :key="index" @click="chooseChange(c_item.name,index)">
						<span style="margin-right:10rpx">{{c_item.name}}</span>
						<span v-if="index==1||index==2" class="up" :style="!c_item.up&&chooseIndex==index?'border-bottom:8rpx solid #651FFF':''"></span>
						<span v-if="index==1||index==2" class="down" :style="c_item.up&&chooseIndex==index?'border-top:8rpx solid #651FFF':''"></span>
					</p>
					
					<p @click="show" v-if="!shop_id">筛选 <span class="iconfont iconshaixuan"></span></p>
					
				</div>

				<div class="tag" v-show="selectTag.city||selectTag.studio||selectTag.price||selectTag.square">
					<div class="tag-item" v-if="selectTag.city">	
						<span class="tag-name">{{selectTag.city}}</span>
						<image class="closeImg" :src="closeImg" @click="closeTag(4)"></image>
						<!-- <div class="close" @click="closeTag(4)">
							<span class="iconfont iconcha"></span>
						</div> -->
					</div>
					<div class="tag-item" v-if="selectTag.studio">	
						<span class="tag-name">{{selectTag.studio}}</span>
						<image class="closeImg" :src="closeImg" @click="closeTag(1)"></image>
						<!-- <div class="close" @click="closeTag(1)">
							<span class="iconfont iconcha"></span>
						</div> -->
					</div>
					<div class="tag-item" v-if="selectTag.price">	
						<span class="tag-name">{{selectTag.price}}</span>
						<image class="closeImg" :src="closeImg" @click="closeTag(2)"></image>
						<!-- <div class="close" @click="closeTag(2)">
							<span class="iconfont iconcha"></span>
						</div> -->
					</div>
					<div class="tag-item" v-if="selectTag.brand">	
						<span class="tag-name">{{selectTag.brand}}</span>
						<image class="closeImg" :src="closeImg" @click="closeTag(3)"></image>
						<!-- <div class="close" @click="closeTag(3)">
							<span class="iconfont iconcha"></span>
						</div> -->
					</div>
					
				</div>
			</view>
			
		</div>
		<div >
			
			<!-- <scroll-view :style="'height:'+windowHeight" :scroll-y="true" @scrolltolower="equipScrollLoad" @scroll="equipScrollHide" v-if="equipList.length>0">
				
				
			</scroll-view> -->
			<div class="equi-list">
				<div v-for="(product,index) in equipList" :key="index">
					<!-- <product-card  :product="item" class="equip-card" type="equipment"></product-card> -->
					<view class="product">
						<div @click="toGoods(product)" >
							<!-- v-if="showEquipIndex + 14 > index && showEquipIndex - 6 < index" -->
							<image  :src="host + util.picExplode(product.img)" mode="aspectFit"></image>
							<view class="name">
								<span v-text="product.custom_desc?product.custom_desc:product.name"></span>
							</view>
							<view class="info">
								<view class="line1">
									<div class="left">
										<span class="fuhao">￥</span>
										<span class="price" v-if="product.only_rent_day!='1'">{{ product.price }}</span>
										<span class="price" v-else>{{ product.price_day_workday_in }}</span>
										<span class="per" v-if="product.only_rent_day!='1'">/每小时</span>
										<span class="per" v-else>/每天</span>
									</div>
									<div class="right">
										<span class="deal">销量 {{product.total}}次</span>
									</div>
								</view>
								<view class="shop" v-if="type!='shopStudio'&&type!='shopEquip'&&!shop_id">
									<span>{{product.nick}}</span>
								</view>
							</view>
						</div>
					</view>
				</div>
			</div>
			<div class="reachBottom" v-if="noMoreData&&equipList.length>0">到底啦~</div>
			<empty-show v-if="equipList.length==0&&!loading" hasMenu='1' :isShop="shop_id?'isShop':''" :style="advList.length>0?'margin-top:450px':''"></empty-show>
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
					<view class="uni-list-cell-one"  @click="onShowDatePicker('range')">
						<view class="uni-list-cell-left-one">
							租用时间
						</view>
						<!--#ifdef MP-WEIXIN || APP-PLUS || MP-ALIPAY -->
						<view class="uni-list-cell-db-one-range">
							<picker mode="date" :value="params.dateStart" :start="util.setDate('start')" :end="util.setDate('end')" @change="bindDateChange($event, 'start')">
								<view class="uni-input"  v-if="params.dateStart">{{params.dateStart}}</view>
								<view class="uni-input" v-else>开始时间</view>
								<!-- @click="openDatePicker('start')" -->
								<!-- <view class="icon"></view> -->
							</picker>
							<view class="line"></view>
							<picker mode="date" :value="params.dateEnd" :start="util.setDate('start')" :end="util.setDate('end')" @change="bindDateChange($event, 'end')">
								<view class="uni-input" v-if="params.dateEnd">{{params.dateEnd}}</view>
								<view class="uni-input" v-else>结束时间</view>
								<!--  @click="openDatePicker('start')" -->
								<view class="icon"></view>
							</picker>
						</view>
						<!--#endif -->
						<!--#ifdef H5 -->
						<view class="uni-list-cell-db-one-range" >
								<view class="uni-input" v-if="params.dateStart">{{params.dateStart}}</view>
								<view class="uni-input" v-else>开始时间</view>
							<view class="line"></view>
								<view class="uni-input" v-if="params.dateEnd" >{{params.dateEnd}}</view>
								<view class="uni-input" v-else>结束时间</view>
								<view class="icon"></view>
						</view>
						<!--#endif -->
						
					</view>
				</view>
				<view class="uni-list-one clear">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							器材类型
						</view>
						<view class="equipment">
							<div class="eqi-item" :class="item.active?'active':''" v-for="(item,idx) in equiptypes" :key="idx" @click="equipPick(item.name,1)">{{item.name}}
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
				<view class="uni-list-one clear" v-if="brand.length>0">
					<view class="uni-list-cell-one">
						<view class="uni-list-cell-left-one">
							品牌
						</view>
						<div class="studio-area">
							<div class="studio-item" :class="item.active?'active':''" v-for="(item,idx1) in brand " :key="idx1" @click="brandPick(item.name,1)">
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
		<!-- #ifdef H5  -->
		 <mx-datepicker :show="showPicker" :type="datetype" :value="value" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
		<!-- #endif -->
	</view>
</template>

<script>
	import advertise from "@/components/advertise/advertise.vue"
	//引入单列展示
	import OnecolList from '@/components/onecol-list/onecol-list'
	//引入弹出层
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
	// import datetimePicker from "@/components/datetime-picker/datetime-picker.vue"
	// #ifdef H5
	import mxDatepicker from "@/components/mx-datepicker/mx-datepicker.vue"
	// #endif
	//区间滑块
	import RangeSlider from '@/components/range-slider/range-slider'
	import {equipment} from '@/common/api/api'
	export default {
		props:{
			type:String,
			shop_id:String,
			shop_city_code:String
		},
		data() {
			//阻止元素发生默认的行为
			const _stop = (e) => e.preventDefault()
			//日期
			const currentDate = this.util.getDate();
			return {
				host:this.$qiniuHost,
				is_h5:false,
				closeImg:'../../../static/icon/close.png',
				slideRange: {
					minValue: 0,
					maxValue: 1200,
					rangeValues: [0, 1200],
					slideWidth: 550,
					slideHeight: 70,
					slideBlockSize: 50,
					slideMin: 0,
					slideMax: 1200,
					step: 200,
					data: [0, 200, 400, 600, 800, 1000, '无限'],
				},
				studioChoose: {
					name: ['索尼', '佳能', '123', '其它名字'],
					nameindex: 0,
					produce: ['EOS M101', 'EOS M100', 'EOS M110', 'EOS M120'],
					produceindex: 0,
					style: ['相机', '镜头', '无人机', '摄像机', '电箱', '灯头'],
					stylefocus: 0,
					startDate: currentDate,
					endDate: currentDate,
					minPrice: 0,
					maxPrice: '无限',
				},
				choose_list:[
					{name:'默认',type:'',active:true},
					{name:'价格',type:'price_day_workday_in',active:false,up:true},
					{name:'销量',type:'total',active:false,up:true},
				],
				chooseIndex:0,
				equiptypes:[],
				brand:[],
				prices:this.config.pricesRange,
				priceIndex:0,
				selectTag:{price:'',studio:'',brand:'',city:''},
				equipList:[],
				currentDate:currentDate,
				params:{
					page:1,
					page_size:10,
					cityCode:'',
					dateStart:'',
					dateEnd:'',
					brand:'',
					equipPrice:'0',
					category:'0',
					uid:'',
					search:'',
					order_by:'',
					borrow_type:'0'
				},
				date_flag:'',
				city:this.config.defaultCity,
				addPage:false,
				loading:true,
				isShop:true,
				isReachTop:false,
				showPicker:false,
				datetype: 'range',
				value: '',
				noMoreData:false,
				equipScrollData: {
					offetHeight: 105, // px
					height: 269, // px
					colunm: 2
				},
				showEquipIndex:0,
				windowHeight:'',
				advHide:false,
				advList:[]
			}
		},
		components: {
			OnecolList,
			uniPopup,
			RangeSlider,
			advertise,
			// datetimePicker
			// #ifdef H5
			mxDatepicker
			// #endif
		},
		computed: {
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
		created(){
			this.getCategory();
			console.log('equipment------------vue---------------');
		},
		onLoad(e){
			let res = wx.getSystemInfoSync();
			this.windowHeight = `${res.windowHeight-105}px`
			console.log('onLoad------------vue---------------');
			// #ifdef H5
			this.is_h5 = true
			// #endif
			if(e.options){
				let obj=JSON.parse(e.options);
				console.log('equipment----------------------',obj.type);
				if(obj.priceIndex){
					this.params.equipPrice=obj.priceIndex;
					this.pricePick(obj.priceIndex);
				}
				if(obj.city){
					// this.params.city=obj.city.city;
					this.params.cityCode =obj.city.code;
					if(this.params.cityCode!=0){
						this.selectTag.city=obj.city.city;
					}
					this.city=obj.city;
				}
				//分类参数，单反相机，镜头等
				if(obj.type){
					this.params.category=obj.type;
					let timer=setInterval(()=>{
						if(this.equiptypes.length>0){
							this.equipPick(obj.type,1);
							clearInterval(timer);
						}
					},100);
				}
				if(obj.dateStart){
					this.params.dateStart=obj.dateStart;
				}
				if(obj.dateEnd){
					this.params.dateEnd=obj.dateEnd;
				}
			}
			if (e.search) {
				this.params.search = e.search;
			}
			setTimeout(()=>{
				this.advList = this.$refs.advertise.advList
			},500)
		},
		mounted() {
			// this.getCategory();
			if(this.shop_id){
				this.params.uid = this.shop_id;
				this.isReachTop = false;
				
			}else{
				this.isReachTop = true;
			}
			this.getEquips();
		},
		onShow(){
			// this.params.page = 1;
			if (this.util.getStorage('saveCity')) {
				this.city = this.util.getStorage('saveCity');
				this.params.cityCode = this.util.getStorage('saveCity').code;
				// this.params.city = this.util.getStorage('saveCity').city;
				// this.util.delStorage('saveCity');
				//如果是默认全国，则删除清楚标签
				if(this.util.getStorage('saveCity').city==this.config.defaultCity.city){
					this.selectTag.city='';
				}else{
					this.selectTag.city=this.util.getStorage('saveCity').city;
				}
			}
			// this.getEquips();
		},
		// onPullDownRefresh:function(){
		// 	this.params.page = 1;
		// 	this.getEquips();
		// },
		watch:{
			params:{
				handler(newVal, oldVal) {
					let startTem = this.util.toTimestamp(this.params.dateStart);
					let endTem = this.util.toTimestamp(this.params.dateEnd);
					if(startTem>endTem){
						this.params.dateEnd = this.params.dateStart
					}
		　　　　},
		　　　　deep: true
			}
		},
		onReachBottom:function(){
			this.addPageOne();
		},
		methods: {
			selTopChange(e){
			},
			toGoods(item) {
				uni.navigateTo({
					url: '/pages/home/category/equipmentDetail/equipmentDetail?equip_id=' + item.id
				});

			},
			equipScrollLoad(){
				this.addPageOne()
			},
			equipScrollHide(e){
				let data = [
					this.equipScrollData.offetHeight,
					e.detail.scrollTop,
					this.equipScrollData.height,
					this.equipScrollData.colunm,
				];
				this.showEquipIndex = this.util.countIndex(...data)
				console.log('this.showEquipIndex--',this.showEquipIndex)
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
			clearSearch(){
				this.params.search = '';
				this.searchChange();
			},
			chooseChange(data,index){
				this.chooseIndex = index;
				if(index==1){
					this.choose_list[1].up = !this.choose_list[1].up
					if(this.choose_list[1].up){
						this.params.order = 'asc'
					}else{
						this.params.order = 'desc'
					}
				}else if(index==2){
					this.choose_list[2].up = !this.choose_list[2].up
					if(this.choose_list[2].up){
						this.params.order = 'asc'
					}else{
						this.params.order = 'desc'
					}
				}
				this.choose_list.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.params.order_by = item.type;
						this.params.page = 1;
						this.equipList = [];
						this.getEquips();
					}else{
						item.active = false;
					}
				})
			},
			addPageOne(){
				this.params.page += 1;
				this.addPage=true;
				this.getEquips();
			},
			// 获取设备列表
			getEquips(){
				uni.showLoading({title: '加载中'});
				this.loading=true;
				this.common.getEquipList(this.params).then(res=>{
					if(this.addPage){
						this.equipList = this.equipList.concat(res.rows);
					}else{
						this.equipList = res.rows;
					}
					this.equipList.forEach(item => {
						
						if(item.pic.split(",").filter(v=>{return v}).length>0){
							item.img = item.pic.split(',').filter(v=>{return v})[0];
						}
					})
					this.addPage = false;
					if(res.rows.length==0&&this.params.page!=1){
						this.noMoreData = true;
						// uni.showToast({title: '无更多数据',duration: 2000,icon:'none'});
					}
					
					uni.hideLoading();
					this.loading=false;
				}).catch(err=>{
					uni.hideLoading();
					this.loading=false;
				})
				
			},
			getCategory(){
				this.$http.get(equipment.getCategory).then(res => {
					this.equiptypes = res;
					this.equiptypes.forEach(e => {e.active = false});
					//添加一个不限的选项
					let obj={id:'0','name':'不限','active':true};
					this.equiptypes.unshift(obj);
					console.log('equipment----------------',this.equiptypes);
					

				}).catch(err=>{})
			},
			show() {
				this.$refs.popupRef.open();
			},
			close() {
				this.$refs.popupRef.close();
			},
			styleEvent: function(index, e) {
				this.studioChoose.stylefocus = index
			},
			bindDateChange: function(e, flag) {
				if (flag === 'start') {
					this.params.dateStart = e.target.value
					this.studioChoose.startDate = e.target.value
				} else if (flag === 'end') {
					this.params.dateEnd = e.target.value
					this.studioChoose.endDate = e.target.value
				}

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
			reset(){
				this.params = {
					page:1,
					page_size:10,
					cityCode:this.city.code,
					dateStart:this.currentDate,
					dateEnd:this.currentDate,
					brand:'',
					equipPrice:'0',
					category:'0',
					borrow_type:'0'
					// city:this.params.city
				};
				this.selectTag = {price:'',studio:'',brand:''};
				this.brand = [];
				this.equiptypes.forEach(v1 => {
					if(v1.name=='不限'){
						v1.active=true;
					}else{
						v1.active = false
					}
				});
				this.prices.forEach(v3 => {
					if(v3.name=='不限'){
						v3.active=true;
					}else{
						v3.active = false
					}
				});
				this.getEquips();
				this.$refs.popupRef.close();
			},
			sureClick: function () {
				this.$refs.popupRef.close();
				this.equipList = [];
				this.params.page= 1;
				this.getEquips();
				
			},
			toPickCity(){
				uni.navigateTo({
					url: '../select-city/select-city?city=' + JSON.stringify(this.city)
				})
			},
			getBrand(id){
				if(id==0){
					this.brand=[];
					this.params.brand='';
					return;
				}
				this.$http.get(equipment.getBrand,{category_id:id}).then(res => {
					this.brand = res;
					this.brand.forEach(v => {v.active = false});
				}).catch(err=>{})
			},
			//器材类型选择，如果不传type,不重新获取列表，如果传type/1，即重新加载列表
			equipPick(data,type){
				console.log('equipPick--------------------',this.equiptypes,data);
				this.equiptypes.forEach(item => {
					if(item.name==data || item.id==data){
						item.active = true;
						this.params.category = item.id;
						if (data == '不限' || data == '0') {
							this.selectTag.studio = '';
						}else{
							this.selectTag.studio = item.name;
						}
						this.getBrand(item.id);
					}else{
						item.active = false;
					}
				})
				if(type){
					this.getEquips();
				}
			},
			//品牌选项选择,如果不传type,不重新获取列表，如果传type/1，即重新加载列表
			brandPick(data,type){
				this.brand.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.params.brand = item.id;
						this.selectTag.brand = item.name;
					}else{
						item.active = false;
					}
				})
				if(type){
					this.getEquips();
				}
			},
			//价格范围选择,如果不传type,不重新获取列表，如果传type/1，即重新加载列表
			pricePick(data,type){
				this.prices.forEach(item => {
					if(item.name==data  || item.type == data){
						item.active = true;
						this.params.equipPrice	 = item.type;
						if (data == '不限' || data == '0') {
							this.selectTag.price = '';
						}else{
							this.selectTag.price = item.name;
						}
					}else{
						item.active = false;
					}
				})
				if(type){
					this.getEquips();
				}
			},
			closeTag(val){
				this.params.page = 1;
				switch(parseInt(val)){
					case 1:
						this.selectTag.studio = '';
						this.params.category = '0';
						this.equipPick('0');
						break;
					case 2:
						this.selectTag.price = '';
						this.params.equipPrice = '0';
						this.pricePick('0');
						break;
					case 3:
						this.selectTag.brand = '';
						this.params.brand = '';
						break;
					case 4:
						this.util.delStorage('saveCity');
						this.selectTag.city = '';
						this.params.city = '全国';
						this.params.cityCode='0';
						break;
				}
				
				this.getEquips();
			},
			searchChange(e){
				this.params.page=1;
				this.getEquips();
			},
			reachTop(){
				this.isReachTop = true;
			},
			notReachTop(){
				this.isReachTop = false;
			}
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
/*  #ifdef  H5  */
	page{
		// background-color: transparent;
	}
/*  #endif  */

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
// .scoll-body{
// 	position: relative;
// 	top: 200rpx;
// }
// .scoll-body1{
// 	position: relative;
// 	top: 100rpx;
// }
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
			.choose{
				position: relative;
				.up{
					position: absolute;
					top: 12rpx;
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
		top: 168rpx;
		width: 100%;
		z-index: 1;
	}
	.selTopApp{
		position: fixed;
		top: 100rpx;
		width: 100%;
		z-index: 1;
	}
	.search-box{
		background-color: #ffffff;
		padding: 18rpx 30rpx;
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
					background-color: inherit;
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
	.advSel{
		margin-top: 86rpx;
	}
	.pop{
	   height:100%;
	   background-color: rgba(0, 0, 0, .3);

	}
	
	.chooseForm {
		margin: 60rpx 30rpx 30rpx;
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
				justify-content:space-between;
				flex-wrap: wrap;
				padding-right: 25rpx;
				box-sizing: border-box;
				.eqi-item{
					padding: 10rpx 30rpx;
					background: #F0F0F0;
					width: 140rpx;
					margin: 10rpx 0;
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
		position:fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		// margin: 0 30rpx 30rpx;
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
			background-color: #fff
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
	.tag{
		// padding: 30rpx; 
		padding: 30rpx 30rpx 10rpx;
		background-color: #ffffff;
		margin-bottom: 20rpx;
		.tag-item{
			margin-right: 20rpx;
			display: inline-block;
			position: relative;
			margin-bottom:20rpx;
		}
		.tag-name{
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
				font-size:24rpx;
			}
		}
	}
.equi-list{
	padding: 0rpx 20rpx 30rpx;
	background-color: #f8f8f8;
	display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
	margin-top: 20rpx;
	.product {
		width: 345rpx;
		// height: 570rpx;
		border: 1px solid #EEE;
		// box-shadow:0px 0px 1rpx 0px rgba(153,152,153,0.7);
		background-color: #ffffff;
		margin-bottom: 10rpx;
		border-radius: 10rpx;
		image {
			width: 100%;
			height: 345rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			// border-radius: 10rpx 10rpx 0 0;
		}

		.name {
			width: 92%;
			padding: 10rpx 4%;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			// text-align: justify;
			overflow: hidden;
			font-size: 28rpx;
			height:70rpx;
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

		.info {
			// display: flex;
			// justify-content: space-between;
			// align-items: flex-end;
			width: 92%;
			padding: 10rpx 4% 10rpx 4%;
			.line1{
				display: flex;
				justify-content: space-between;
				.left,.right{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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
				
				display: flex;
				justify-content: space-between;
				line-height: 60rpx;
				span{
					display: inline-block;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
			}
			.cart{
					color: #e65339;
				}
		}
	}
}
.reachBottom{
	width: 100%;
	margin: 20rpx 0;
	text-align: center;
	color: #999999;
	font-size: 28rpx;
}
</style>
