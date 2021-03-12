<template>
	<view class="select-city-wrap">
		<view class="index" :style="smallSize ? 'top:20rpx; font-size:24rpx' :'font-size: 32rpx'">
			<view class="index-item index-top" :class="activeClass === '#' ? 'active' : ''" @touchstart="alphabetScrollStart"
				@touchmove="alphabetScrollMove" @touchend="alphabetScrollEnd">#</view>
			<view class="index-item" v-for="item in citys" :key="item.letter" :class="activeClass === item.letter ? 'active' : ''"
				@touchstart="alphabetScrollStart" @touchmove="alphabetScrollMove" @touchend="alphabetScrollEnd" @click="scrollTo(item.letter)">
				{{item.letter}}
			</view>
		</view>		
		<view class="select-city">

			<scroll-view class="scro" @scroll="scroll" :scroll-into-view="scrollIntoId" :scroll-y="true" :scroll-with-animation="false"
			 :style="{height:windowHeight}">
				<view class="content">
					<view class="section" id="current">
						<view class="city-title">您正在看：</view>
						<view class="city-list city-flex">
							<view class="current-city">
								<span class="iconfont icondizhi adr-icon"></span>
								{{current.city}}
							</view>
							<!-- <view class="return-btn">
								确定
							</view> -->
						</view>
					</view>
					<view class="section" id="current">
						<view class="city-title">定位城市</view>
						<view class="city-list">
							<view class="city-item" @click="onSelect(location)">
								<span v-if="location.city">{{location.city}}</span>
								<span v-else>定位失败</span>
							</view>
						</view>
					</view>
					<view class="section" id="hot" v-if="hotCitys.length>0">
						<view class="city-title">热门城市</view>
						<view class="city-list">
							<view class="city-item" :class="{active: current === item}" v-for="(item, i) in hotCitys" :key="i" @click="onSelect(item)">{{item.city}}</view>
						</view>
					</view>
					<view class="section" :id="item.letter" v-for="item in citys" :key="item.letter">
						<view class="letter">{{item.letter}}</view>
						<view class="city-list">
							<view class="city-item" :class="{active: current === subItem}" v-for="(subItem,itemIndex) in item.list" :key="itemIndex"
							 @click="onSelect(subItem)">{{subItem.city}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- #ifdef H5 -->
		<div id="position" class="position"></div>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	import amap from "@/common/SDK/amap-wx";
	// #endif
	// #ifdef H5
	import { lazyAMapApiLoaderInstance } from "vue-amap";
	// #endif
	export default {
		data() {
			return {
				hotCitys:[
					this.config.defaultCity,
					{"id":"38","city":"珠海市","code":"0756","province":"广东省","province_code":"44"},
					{"id":"3","city":"天津市","code":"022","province":"天津市","province_code":"12"},
					{"id":"1","city":"北京市","code":"010","province":"北京市","province_code":"11"},
					{"id":"2","city":"上海市","code":"021","province":"上海市","province_code":"31"},
					{"id":"37","city":"深圳市","code":"0755","province":"广东省","province_code":"44"},
					{"id":"32","city":"广州市","code":"020","province":"广东省","province_code":"44"},
					{"id":"51","city":"成都市","code":"028","province":"四川省","province_code":"51"},
					{"id":"4","city":"重庆市","code":"023","province":"重庆市","province_code":"50"},
					{"id":"29","city":"厦门市","code":"0592","province":"福建省","province_code":"35"},
				] ,
				citys: [],
				touchStatus: false,
				windowHeight: '',
				activeClass: '',
				scrollIntoId: 'F',
				letterDetails: [],
				current: {},
				location:{},
				smallSize:false
			}
		},
		onLoad(e) {
			this.current = JSON.parse(e.city);
			console.log('当前城市----------',this.current);
			this.getCityList();
			
			// #ifdef MP-WEIXIN
			this.amapPlugin = new amap.AMapWX({
				//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
				key: this.config.amapKey
			});
			//定位地址
			this.amapPlugin.getRegeo({
				success: data => {
					console.log("location", data);
					let address = data[0].regeocodeData.addressComponent;
					let city = {
						city: address.city,
						code: address.citycode,
						province: address.province,
						province_code: address.adcode.substring(0, 2)
					};
					this.location = city;
					console.log('this.city---',this.city)
				}
			});
			// #endif
			// #ifdef H5
			console.log("H5定位");
			let _loadApiPromise = lazyAMapApiLoaderInstance.load();
			_loadApiPromise.then(() => {
				this.initMap();
			});
			// #endif
		},
		mounted() {
			this.getSystemInfo();	
		},
		computed: {
			letters() {
				const letters = []
				for (let i in this.citys) {
					letters.push(this.citys[i].letter)
				}
				letters.unshift('current')
				return letters
			}
		},
		methods: {
			// #ifdef H5
			initMap() {
				try {
					this.map = new AMap.Map("position", { //position是嵌地图div的id
						resizeEnable: false, //是否监控地图容器尺寸变化
					});
					let geocoder = new AMap.Geocoder();
					let param = this.map.getCenter();
					geocoder.getAddress(param, (status, result) => {
						console.log("高德H5", result);
						if (status === "complete" && result.info === "OK") {
							let data = result.regeocode.addressComponent;
							let city = {
								city: data.city == "" ? data.province : data.city,
								code: data.citycode,
								province: data.province,
								province_code: data.adcode.substring(0, 2)
							};
							this.location = city;
						} else {
							alert("哦吼，定位失败");
						}
					});
				} catch (err) {
					console.log(err);
				}
			},
			// #endif
			getCityList() {
				if (this.util.getStorage('staticCity')) {
					console.log('直接返回存储的城市列表');
					this.citys = this.util.getStorage('staticCity');
					this.citys.sort(this.util.compare('letter'));
				}
				this.$http.get('/city/ajaxGet').then(res => {
					var map = {},dest = [];
					for(var i = 0; i < res.length; i++) {
						var ai = res[i];
						if(!map[ai.pinyin]) {
							dest.push({
								letter: ai.pinyin,
								list: [ai]
							});
							map[ai.pinyin] = ai;
						} else {
							for(var j = 0; j < dest.length; j++) {
								var dj = dest[j];
								if(dj.letter == ai.pinyin) {
									dj.list.push(ai);
									break;
								}
							}
						}
					}
					this.citys = dest;
					
					//按照字母排序数组
					this.util.setStorage('staticCity',this.citys).then(res=>{
						console.log('保存城市列表结果',res);
						this.citys.sort(this.util.compare('letter'));
					}).catch(err=>{
						uni.showToast({
						   title: '保存城市列表失败',
						   duration: 500  
						});  
						uni.navigateBack();
					})
				}).catch(err=>{
					uni.showToast({
					   title: '获取城市列表失败',
					   duration: 500  
					});  
					uni.navigateBack();
				})
			},
			onSelect(city) {
				console.log('select',city)
				console.log('uni.setStorage000000000',uni.setStorage);
				this.current = city

				this.util.setStorage('saveCity',city).then(res=>{
					console.log('saveCity----------',res);
					if(res){
						uni.navigateBack();
					}
				})
			},
			getSystemInfo() {
				uni.getSystemInfo().then(res => {
					let [error, data] = res
					this.windowHeight = `${data.windowHeight}px`
					if(data.windowHeight <= 650){
						this.smallSize = true;
					}
				})
			},
			scroll(e) {
				if (this.letterDetails.length === 0) {
					let view = uni.createSelectorQuery().in(this).selectAll('.section')
					view.boundingClientRect(data => {
						let top = data[0].top
						data.forEach((item, index) => {
							item.top = item.top - top
							item.bottom = item.bottom - top
							this.letterDetails.push({
								id: item.id,
								top: item.top,
								bottom: item.bottom
							})
						})
					}).exec()
				}
				const scrollTop = e.detail.scrollTop
				this.letterDetails.some((item, index) => {
					if (scrollTop >= item.top && scrollTop <= item.bottom - 5) {
						// this.activeClass = item.id === 'current' ? '#' : item.id
						return true
					}
				})
			},
			scrollTo(letter) {
				// this.activeClass = letter
				this.scrollIntoId = letter === '#' ? 'current' : letter
			},
			alphabetScrollStart(e) {
				this.touchStatus = true
				console.log("点击字母")
				console.log(e)
			},
			alphabetScrollMove(e) {
				console.log(e)
				if (this.touchStatus) {
					const touchY = e.touches[0].clientY //滑动的高度
					const top = this.smallSize ? 10 : 70;
					const index = Math.floor((touchY - top) / 21.5) //（滑动的高度-#距离顶部的高度）/字母的高度
					if (index >= 0 && index < this.letters.length) {
						uni.showToast({
							title: this.letters[index] === 'current' ? '#' : this.letters[index],
							icon: "none"
						});
						// this.activeClass = this.letters[index] === 'current' ? '#' : this.letters[index]
						this.scrollIntoId = this.letters[index]
					}
				}
				console.log(e)
				e.preventDefault();
				return false;
			},
			alphabetScrollEnd() {
				this.touchStatus = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-city-wrap {
		position: relative;
		padding: 0 30rpx;
		background-color: #fff;
		box-sizing: border-box;
		overflow-y: scroll;
	}

	.index {
		position: absolute;
		right: 0;
		border-radius: 20rpx;
		padding: 10rpx 0;
		z-index: 999;
		color: #651FFF;
		top: 140rpx;
		.index-item {
			width: 40rpx;
			height: 42rpx;
			line-height: 42rpx;
			text-align: center;
		}

		.active,
		.hover {
			color: #fff;
			background-color: #651FFF;
			border-radius: 50%;
		}
	}

	.select-city {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.scro{

			::-webkit-scrollbar {
				width: 0;
				height: 0;
				color: transparent;
			}		
		}
		.content{

		}
		.section {
			margin-bottom: 19rpx;

			.city-title {
				color: #333;
				font-size: 28rpx;
				margin-bottom: 28rpx;
			}

			.letter {
				width: 44rpx;
				height: 44rpx;
				color: #fff;
				border-radius: 50%;
				background-color: #651FFF;
				font-size: 28rpx;
				line-height: 44rpx;
				text-align: center;
				margin-bottom: 30rpx;
			}
			
			.city-flex{
				display: flex;
				justify-content: space-between;
			}
			.city-list {
				display: flex;
				flex-wrap: wrap;
				.current-city{
					box-sizing: border-box;
					padding: 0 20rpx; 
					line-height: 55rpx;
					text-align: center;
					border: 1px solid #dcdcdc;
					border-radius: 6rpx;
					color: #999;
					font-size: 28rpx;
					&.active {
						background-color: #d5ebff;
						border-color: #651FFF;
						color: #651FFF;
					}
					.iconfont{
						color:#651FFF;
						margin-right:25rpx;
					}									
				}
				.return-btn{
					width: 150rpx;
					height: 50rpx;
					border-radius: 4rpx;
					line-height: 50rpx;
					background-color: #651FFF;
					color: #ffffff;
					font-size: 26rpx;
					text-align: center;
					margin-right: 20rpx;
				}
				.city-item {
					width: 190rpx;
					height: 55rpx;
					margin-right: 36rpx;
					margin-bottom: 28rpx;
					line-height: 55rpx;
					text-align: center;
					border: 1px solid #dcdcdc;
					border-radius: 6rpx;
					color: #999;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;					
					&.active {
						background-color: #d5ebff;
						border-color: #651FFF;
						color: #651FFF;
					}
					.iconfont{
						color:#651FFF;
						margin-right:25rpx;
					}
				}
			}
		}
	}
</style>
