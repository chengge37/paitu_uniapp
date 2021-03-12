<template>
	<view class="model-content" :class="drowdownOpen?'banScroll':''" >
        <div class="fixed-top top-line">
			<div class="location" @click="toPickCity">
				<span class="iconfont icondizhi2"></span>
				<span>{{city.city}}</span>
			</div>
			<div class="search-box">
				<div class="location">
					<span></span>
				</div>
				<div class="search">
					<span class="iconfont iconsousuo"></span>
					<form action="#" class="search-input">
						<input type="search" placeholder="输入搜索内容"  placeholder-style="color:#999999;" v-model="params.search"
							@confirm="initModelList" />
					</form>
					<span class="iconfont iconcuo" v-if="params.search" @click="clearSearch"></span>
				</div>
			</div>
			
		</div>
		<!-- 广告位 -->
		<!-- <div class="advertisement">
			<advertise :type='3'  ref="advertise"></advertise>
		</div> -->
		<div :class="choose_fixed_top||advList.length==0?chooseFixed:''" id="chooseItem" @click="selectToFixed">
			<dropdown-menu>
				<dropdown-item 
				v-model="value" 
				:list="list1"
				 title="默认" 
				 @tapone="tapDropdown" 
				 @choose="chooseDefault" 
				 @close="dropdownClose"
				 @reset="reset"></dropdown-item>
				<dropdown-item 
				v-model="value" 
				:list="list2" 
				title="模特类型" 
				@tapone="tapDropdown" 
				@choose="chooseModelType" 
				@close="dropdownClose"
				@reset="reset"></dropdown-item>
				<dropdown-item 
				v-model="value" 
				:list="list3" 
				title="拍摄风格" 
				@tapone="tapDropdown" 
				@choose="chooseStyle" 
				@close="dropdownClose"
				@reset="reset"></dropdown-item>
				<dropdown-item 
				ref="dropdownItem"
				v-model="value" 
				:hasSlot="true" 
				title="筛选" 
				@tapone="tapDropdown" 
				@comfirm="menuComfirm"
				@reset="reset">
					<view class="screenOut">
						<view class="select-info">
							<view class="slider-cart">
								<view class="title">身高(cm)</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="height.min"
										:max="height.max"
										:value="height.range"
										:activeColor="'#651FFF'"
										:step="step"
										@rangechange="onRangeChange($event,1)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{height.range[0]}} ~ {{height.range[1]}}
									</view>
								</view>
							</view>
							<view class="slider-cart">
								<view class="title">体重(kg)</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="weight.min"
										:max="weight.max"
										:values="weight.range"
										:activeColor="'#651FFF'"
										:step="step"
										@rangechange="onRangeChange($event,2)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{weight.range[0]}} ~ {{weight.range[1]}}
									</view>
								</view>
							</view>
							<view class="slider-cart">
								<view class="title">臂展(cm)</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="wingspan.min"
										:max="wingspan.max"
										:value="wingspan.range"
										:activeColor="'#651FFF'"
										:step="step"
										@rangechange="onRangeChange($event,3)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{wingspan.range[0]}} ~ {{wingspan.range[1]}}
									</view>
								</view>
							</view>
							<view class="slider-cart">
								<view class="title">肩宽(cm)</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="shoulder.min"
										:max="shoulder.max"
										:value="shoulder.range"
										:activeColor="'#651FFF'"
										:step="step"
										@rangechange="onRangeChange($event,4)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{shoulder.range[0]}} ~ {{shoulder.range[1]}}
									</view>
								</view>
							</view>
							<view class="slider-cart">
								<view class="title">上围(cm)</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="bust.min"
										:max="bust.max"
										:value="bust.range"
										activeColor="'#651FFF'"
										step="step"
										@rangechange="onRangeChange($event,5)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{bust.range[0]}} ~ {{bust.range[1]}}
									</view>
								</view>
							</view>
							<view class="slider-cart">
								<view class="title">腰围(cm)</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="waist.min"
										:max="waist.max"
										:value="waist.range"
										:activeColor="'#651FFF'"
										:step="step"
										@rangechange="onRangeChange($event,6)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{waist.range[0]}} ~ {{waist.range[1]}}
									</view>
								</view>
							</view>
							<view class="slider-cart">
								<view class="title">臀围(cm)</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="hips.min"
										:max="hips.max"
										:value="hips.range"
										:activeColor="'#651FFF'"
										:step="step"
										@rangechange="onRangeChange($event,7)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{hips.range[0]}} ~ {{hips.range[1]}}
									</view>
								</view>
							</view>
							<view class="slider-cart">
								<view class="title">腿长(cm)</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="leg.min"
										:max="leg.max"
										:value="leg.range"
										:activeColor="'#651FFF'"
										:step="step"
										@rangechange="onRangeChange($event,8)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{leg.range[0]}} ~ {{leg.range[1]}}
									</view>
								</view>
							</view>
							<view class="slider-cart">
								<view class="title">鞋码</view>
								<view class="slider-line">
									<RangeSlider
										:width="slideWidth"
										:height="slideHeight"
										:blockSize="slideBlockSize"
										:min="shoes.min"
										:max="shoes.max"
										:value="shoes.range"
										:activeColor="'#651FFF'"
										:step="step"
										@rangechange="onRangeChange($event,9)"
									>
										<view slot="minBlock" class="range-slider-block"></view>
										<!-- 左边滑块的内容 -->
										<view slot="maxBlock" class="range-slider-block"></view>
										<!-- 右边滑块的内容 -->
									</RangeSlider>
									<view class="interval">
										{{shoes.range[0]}} ~ {{shoes.range[1]}}
									</view>
								</view>
							</view>


							<view class="select-cart">
								<view class="title">
									当前发型
								</view>
								<view class="select-list">
									<div class="item" :class="item.active?'active':''" v-for="(item,idx) in hairTypes" :key="idx" @click="pickChange(item.name,1)">{{item.name}}
										<span class="icon"></span>
									</div>
								</view>
							</view>
							<view class="select-cart">
								<view class="title">
									肤色
								</view>
								<view class="select-list">
									<div class="item" :class="item.active?'active':''" v-for="(item,idx) in skinTypes" :key="idx" @click="pickChange(item.name,2)">{{item.name}}
										<span class="icon"></span>
									</div>
								</view>
							</view>
							<view class="select-cart">
								<view class="title">
									脸型
								</view>
								<view class="select-list">
									<div class="item" :class="item.active?'active':''" v-for="(item,idx) in faceTypes" :key="idx" @click="pickChange(item.name,3)">{{item.name}}
										<span class="icon"></span>
									</div>
								</view>
							</view>
							<view class="select-cart">
								<view class="title">
									是否双眼皮
								</view>
								<view class="select-list">
									<div class="item" :class="item.active?'active':''" v-for="(item,idx) in eyelidTypes" :key="idx" @click="pickChange(item.name,4)">{{item.name}}
										<span class="icon"></span>
									</div>
								</view>
							</view>
						</view>
						
						<view class="comfirm-btn">
							<div class="reset" @click="reset">重置</div>
							<div class="confirm" @click="comfirm">确认</div>
						</view>
					</view>
					
				</dropdown-item>
			</dropdown-menu>
		</div>
		<div class="list" :class="choose_fixed_top||advList.length==0?'listTop':''">
			<twocol-list :List='modelList' :type="'1'" v-if="modelList.length>0"></twocol-list>
			<empty-show hasMenu='1' v-if="modelList.length==0&&!loading" :style="advList.length>0?'margin-top:500rpx':''"></empty-show>
		</div>
		<div class="nomoredata" v-if="isReachBottom&&modelList.length>0">到底了~</div>
	</view>
</template>

<script>
import { model } from '@/common/api/api';
import advertise from "@/components/advertise/advertise.vue"
import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue';
import dropdownItem from '@/components/uni-ui/ms-dropdown/dropdown-item.vue';
import dropdownMenu from '@/components/uni-ui/ms-dropdown/dropdown-menu.vue';
import twoColList from '@/components/twocol-list/twocol-list.vue';
import RangeSlider from '@/components/range-slider/range-slider.vue';
	export default {
		components:{
			uniRate,twoColList,advertise,dropdownItem,dropdownMenu,RangeSlider
		},
		data() {
			return {
				city:this.config.defaultCity,
				value:0,
				list1: [
                    { name: '默认', id: 0 },
                    { name: '销量',  id: 1 },
                    { name: '价格', id: 2 }
				],
				list2:this.config.modelTypeList,
				list3:this.config.shootingTypeList,
				params:{
					page:1,page_size:10,search:'',isAutoMsg:1
				},
				b_params:{
					page:1,page_size:10
				},
				f_params:{
					shoes_max:45,
					shoes_min:24,
					leg_max:150,
					leg_min:60,
					waist_max:90,
					waist_min:45,
					upper_max:110,
					upper_min:50,
					shoulder_max:60,
					shoulder_min:24,
					wingspan_max:230,
					wingspan_min:50,
					weight_max:150,
					weight_min:35,
					height_max:220,
					height_min:50,
				},
				modelList:[],
				advList:[],
			    choose_list:[
					{name:'默认',type:'',active:true},
					{name:'价格',type:'price_day_workday_in',active:false,up:true},
					{name:'销量',type:'total',active:false,up:true},
				],
				firstDistance:0,
				chooseDistance:0,
				scrollTop:0,
				choose_fixed_top:false,
				drowdownOpen:false,
				isReachBottom:false,
				hairTypes:[
					{name:'长直发',value:1,active:false},
					{name:'短发',value:2,active:false},
				],
				hairSelect:0,
				skinTypes:[
					{name:'白色',value:1,active:false},
					{name:'黄色',value:2,active:false},
					{name:'黑色',value:3,active:false},
				],
				skinSelect:0,
				faceTypes:[
					{name:'圆脸',value:1,active:false},
					{name:'长脸',value:2,active:false},
					{name:'瓜子脸',value:3,active:false},
				],
				faceSelect:0,
				eyelidTypes:[
					{name:'是',value:2,active:false},
					{name:'否',value:1,active:false},
				],
				eyelidSelect:0,
				// 滑动条初始数据设置
				slideWidth: 500,
				slideHeight: 80,
				slideBlockSize: 30,
				slideMin: 0,
				slideMax: 10,
				step:1,
				rangeValues:[0,10],
				height:{
					range:[50,220],
					min:50,
					max:220
				},
				weight:{
					range:[35,150],
					min:35,
					max:150
				},
				wingspan:{
					range:[50,230],
					min:50,
					max:230
				},
				shoulder:{
					range:[24,60],
					min:24,
					max:60
				},
				bust:{
					range:[50,110],
					min:50,
					max:110
				},
				waist:{
					range:[45,90],
					min:45,
					max:90
				},
				hips:{
					range:[50,110],
					min:50,
					max:110
				},
				shoes:{
					range:[24,45],
					min:24,
					max:45
				},
				leg:{
					range:[60,150],
					min:60,
					max:150
				},
				loading:false
			}
		},
		mounted() {
			
		},
		computed:{
			chooseFixed(){
				// #ifdef MP-WEIXIN || MP-ALIPAY
				return 'mp-choose-fixed'
				// #endif
				// #ifdef H5
				return 'h5-choose-fixed'
				// #endif
			}
		},
		watch:{
			scrollTop(val){
				
				if(val<300){
					this.choose_fixed_top = false;
				}else{
					this.choose_fixed_top = true;
				}
			},
			hairSelect(val){
				if(val){
					this.f_params.hair = val;
				}else{
					delete this.f_params.hair
				}
				console.log('hair---',val)
				console.log('hair---param---',this.f_params)
			},
			skinSelect(val){
				if(val){
					this.f_params.skin = val;
				}else{
					delete this.f_params.skin
				}
			},
			faceSelect(val){
				if(val){
					this.f_params.face = val;
				}else{
					delete this.f_params.face
				}
			},
			eyelidSelect(val){
				if(val){
					this.f_params.eyelid = val;
				}else{
					delete this.f_params.eyelid
				}
			},
			city(val){
				if(val.code!='0'){
					this.initModelList();
				}else{
					delete this.params.city_code;
					this.initModelList();
				}
			}
		},
		onLoad: function(e) {
			this.getModelList();
			// 异步获取广告长度
			// setTimeout(()=>{
			// 	this.advList = this.$refs.advertise.advList
			// },1000)
		},
		onShow(){
			// #ifdef H5
			this.$wechatShare.share({  
				title:'模特列表',
			    desc: '派图么模特列表',  
			    img: this.$qiniuHost+'109-1578980959135.png' 
			});
			// #endif
			setTimeout(()=>{
				this.getChooseDistence();
			},1000)
			if (this.util.getStorage('saveCity')) {
				this.city = this.util.getStorage('saveCity');
				this.params.city_code = this.util.getStorage('saveCity').code;
				this.util.delStorage('saveCity');
				
				console.log(this.city)
			}
        },
        onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: '派图么模特',
				path: '/pages/home/category/model'
			}
		},
		onPageScroll:function(e){
			this.scrollTop = e.scrollTop;
			this.getChooseDistence()
			
		},
		methods: {
			toPickCity() {
				console.log('toPickCity----------', this.city);
				uni.navigateTo({
					url: '/pages/home/select-city/select-city?city=' + JSON.stringify(this.city)
				})
			},
			clearSearch(){
				this.params.search = '';
				this.initModelList()
			},
			initModelList(){
				this.params.page = 1;
				this.modelList = [];
				this.getModelList()
			},
            getModelList(){
				uni.showLoading({title: '加载中'});
				this.loading = true;
                this.$http.get(model.getModel,this.params).then(res => {
					if(res.rows.length>0){
						if(this.modelList.length>0){
							this.modelList = this.modelList.concat(res.rows)
						}else{
							this.modelList = res.rows;
						}
					}else{
						uni.showToast({title:'没有更多数据了~',icon:'none',duration:1000});
						this.isReachBottom = true;
					}
					this.modelList.forEach(item => {
						if(!item.score){
							item.score = '0';
						}
					})
					uni.hideLoading();
					this.loading = false;
                }).catch(err => {
					uni.hideLoading();
					this.loading = false;
				})
			},
			getChooseDistence(){
				const query = uni.createSelectorQuery()
				query.select('#chooseItem').boundingClientRect(data => {
					// console.log("节点离页面顶部的距离为" + data.top);
					this.chooseDistance = data.top
				}).exec();
			},
			selectToFixed(){
				if(!this.choose_fixed_top&&this.modelList.length>2){
					uni.pageScrollTo({
						scrollTop: this.chooseDistance + this.scrollTop,
						duration: 100
					});
				}
				
			},
		// 导航条/下拉组件部分
			// 默认下拉
			chooseDefault(val){
				if(val==1){
					this.params = Object.assign(this.params,{order_by:'total'})
				}else if(val==2){
					this.params = Object.assign(this.params,{order_by:'ppd'})
				}else{
					delete this.params.order_by;
				}
				this.initModelList();
			},
			// 模特类型下拉
			chooseModelType(val){
				this.params = Object.assign(this.params,{type:val})
				this.initModelList();
			},
			// 拍摄风格下拉
			chooseStyle(val){
				this.params = Object.assign(this.params,{style:val})
				this.initModelList();
			},
			// 筛选
			chooseMenu(){
				console.log('chooseMenu')
			},
			tapDropdown(){
				this.drowdownOpen = true;
			},
			// 关闭下拉
			dropdownClose(){
				this.drowdownOpen = false;
			},
			reset(){
				this.params = this.util.deepcopy(this.b_params);
				this.initModelList();
				this.$refs.dropdownItem.close();
			},
			menuComfirm(){
				this.params = this.util.deepcopy(this.b_params);
				this.params = Object.assign(this.params,this.f_params);
				this.initModelList();
				this.$refs.dropdownItem.close();
			},

		// 滑块滑动事件
			onRangeChange(e,val) {
				if(val==1){
					this.height.range = [e.minValue, e.maxValue];
					this.f_params.height_min = e.minValue;
					this.f_params.height_max = e.maxValue;
				}else if(val==2){
					this.weight.range = [e.minValue, e.maxValue];
					this.f_params.weight_min = e.minValue;
					this.f_params.weight_max = e.maxValue;
				}else if(val==3){
					this.wingspan.range = [e.minValue, e.maxValue];
					this.f_params.wingspan_min = e.minValue;
					this.f_params.wingspan_max = e.maxValue;
				}else if(val==4){
					this.shoulder.range = [e.minValue, e.maxValue];
					this.f_params.shoulder_min = e.minValue;
					this.f_params.shoulder_max = e.maxValue;
				}else if(val==5){
					this.bust.range = [e.minValue, e.maxValue];
					this.f_params.upper_min = e.minValue;
					this.f_params.upper_max = e.maxValue;
				}else if(val==6){
					this.waist.range = [e.minValue, e.maxValue]
					this.f_params.waist_min = e.minValue;
					this.f_params.waist_max = e.maxValue;
				}else if(val==7){
					this.hips.range = [e.minValue, e.maxValue];
					// this.f_params.hips_min = e.minValue;
					// this.f_params.hips_max = e.maxValue;
				}else if(val==8){
					this.leg.range = [e.minValue, e.maxValue]
					this.f_params.leg_min = e.minValue;
					this.f_params.leg_max = e.maxValue;
				}else if(val==9){
					this.shoes.range = [e.minValue, e.maxValue]
					this.f_params.shoe_min = e.minValue;
					this.f_params.shoe_max = e.maxValue;
				}

			},
		// 项目单选
			pickChange(name,val){
				if(val==1){
					this.hairTypes.forEach(v => {
						if(v.name==name){
							v.active = !v.active;
							if(v.active){
								this.hairSelect = v.value;
							}else{
								this.hairSelect = 0;
							}
							
						}else{
							v.active = false;
						}
					})
				}else if(val==2){
					this.skinTypes.forEach(v => {
						if(v.name==name){
							v.active = !v.active;
							if(v.active){
								this.skinSelect = v.value;
							}else{
								this.skinSelect = 0;
							}
						}else{
							v.active = false;
						}
					})
				}else if(val==3){
					this.faceTypes.forEach(v => {
						if(v.name==name){
							v.active = !v.active;
							if(v.active){
								this.faceSelect = v.value;
							}else{
								this.faceSelect = 0;
							}
						}else{
							v.active = false;
						}
					})
				}else if(val==4){
					this.eyelidTypes.forEach(v => {
						if(v.name==name){
							v.active = !v.active;
							if(v.active){
								this.eyelidSelect = v.value;
							}else{
								this.eyelidSelect = 0;
							}
						}else{
							v.active = false;
						}
					})
				}
			}
		},
		onReachBottom() {
			if(!this.isReachBottom){
				this.params.page++;
				this.getModelList()
			}
			
		}
	}
</script>

<style lang="scss" scope>
.banScroll{
	overflow: hidden;
}
.fixed-top{
	position: fixed;
	/* #ifndef H5 */
	top: 0;
	/* #endif */
	/* #ifdef H5 */
	top: 80rpx;
	/* #endif */
	width: 100%;
	z-index: 1;
	overflow: hidden;
	display: flex;
	background-color: #ffffff;
	align-items: center;
}	

.location{
	color: #333333;
	font-size: 30rpx;
	padding-left: 30rpx;
	display: flex;
	align-items: center;
	span{
		display: inline-block;
	}
	.iconfont{
		font-size: 40rpx;
		margin-right: 5rpx;
	}
}
.search-box{
	padding: 18rpx 30rpx;
	flex: 1;
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
			// name-align: center;
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
.advertisement{
	margin-top: 100rpx;
}
.title-item{
	display: flex;
	font-size: 30rpx;
	background-color: #ffffff;
	// justify-content: space-between;
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

.mp-choose-fixed{
	position: fixed;
	top: 106rpx;
	z-index: 10;
	width: 100%;
}
.h5-choose-fixed{
	position: fixed;
	top: 166rpx;
	z-index: 10;
	width: 100%;
}
.listTop{
	margin-top: 204rpx;
}
.nomoredata{
	width: 100%;
	text-align: center;
	font-size: 30rpx;
	color: #999999;
	margin-bottom: 50rpx;
}
.screenOut{
	position: relative;
	background-color: #ffffff;
}
.select-info{
	padding: 30rpx;
	.title{
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
		margin-bottom: 30rpx;
	}
	.slider-cart{
		margin-bottom: 40rpx;
		font-size: 30rpx;
		.slider-line{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 20rpx;
		}
	}
	.select-cart{
		margin-bottom: 40rpx;
		font-size: 30rpx;
		.select-list{
			display: flex;
			flex-wrap: wrap;
			.item {
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
		
	}
	
}
.comfirm-btn{
	height: 98rpx;
	line-height: 98rpx;
	width: 100%;
	display: flex;
	font-size: 36rpx;
	.reset{
		border-top: 1rpx solid #d9d9d9;
		width: 50%;
		text-align: center;
		color: #d9d9d9;
		background-color: #ffffff;
	}
	.confirm{
		background-color: #651FFF;
		width: 50%;
		text-align: center;
		color: #ffffff;
	}	
}

</style>
