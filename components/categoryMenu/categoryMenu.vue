<template>
	<div class="category">
		<view class="category-wrapper" v-if="catrgoryList.length>0">
			<!-- 左边导航 -->
			<scroll-view scroll-y="true" class="left-wrapper" scroll-with-animation="true" :scroll-top="left_scroll">
				<view class="left-content">
					
					<view class="title-content" :class="selectIndex === index?'onSelected':''" v-for="(item,index) in catrgoryList"
					 :key="index" @click="choose(index)">
						<div class="line" :class="{'active':selectIndex === index}"></div>
						{{item}}
					 </view>
				</view>
			</scroll-view>
			<!-- 右边内容 -->
			<scroll-view scroll-y="true" class="right-wrapper" scroll-with-animation="true" :scroll-top="right_scroll" @scroll="myscroll">
				<div class="right-content">
					<!-- 产品区 -->
					<div class="product-wrapper">
						<div class="category-item" v-for="(item,index) in productList" :key="index" @click="toPage(item.id)">
							<!-- <div v-if="selectIndex==0">
								<image class="info-image" :key="index" :src="item.img" mode="widthFix"></image>
								<view class="category-title" v-show="item.name">{{item.name}}</view>
							</div> -->
							<div>
								<view class="category-title equipItem" v-show="item.name">{{item.name}}</view>
							</div>
						</div>
					</div>
				</div>
			</scroll-view>
		
		</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				windows_height: 0, //屏幕高度
				catrgoryList: ['影棚','器材','活动'],
				studioTypes:[
					{name: '不限',active: true,id: 0,img:'/static/img/studio/luyin.png'},
					{name: '录音棚',active: false,id: 1,img:'/static/img/studio/luyin.png'},
					{name: '实景棚',active: false,id: 2,img:'/static/img/studio/shijing.png'},
					{name: '无影棚',active: false,id: 3,img:'/static/img/studio/wuying.png'},
					{name: '特效棚',active: false,id: 4,img:'/static/img/studio/texiao.png'},
					{name: '白棚',active: false,id: 5,img:'/static/img/studio/baipeng.png'},
					{name: '绿棚',active: false,id: 6,img:'/static/img/studio/lvpeng.png'},
					{name: '',active: false,id: 7,img:''},
					{name: '',active: false,id: 8,img:''},
				],
				activityTypes:[{id:0,name:'不限'},{id:1,name:'线上'},{id:2,name:'线下'}],
				equipTypes:[],
				productList:[],
				selectIndex: 0,
				right_height: [], //右侧每个内容的高度集合
				right_scroll: 0, //右侧的滑动值
				left_height: 0, //左侧总高度
				left_scroll: 0, //左侧滑动值
				last: 0,
			}
		},
		onLoad() {
			console.log('onLoad=============================');
			this.windows_height = uni.getSystemInfoSync().windowHeight;
		},
		onShow(){
			console.log('onShow0------------------------------');
		},
		mounted(){
			//获取设备分类列表
			this.getEquipTypes();
			this.productList=this.studioTypes;
			console.log('mounted------------------------------');
		},
		methods: {
			//获取器材分类列表数据
			getEquipTypes(){
				this.common.getEquipTypes().then(res=>{
					console.log('getEquipType---------',res);
					this.equipTypes=res;
					//添加一个不限的选项
					let obj={id:0,name:'不限'};
					this.equipTypes.unshift(obj);
					//取余添加选项
					let item={id:111,name:''};
					let length=3-this.equipTypes.length%3;
					console.log('length-----------',length);
					if(length==1 || length==2){
						for(let i=0;i<length;i++){
							this.equipTypes.push(item);
						}
					}
					console.log('equipTypes-----',this.equipTypes);
				})
			},
			//跳转到相关页面
			toPage(id){
				let url="";
				let params={type:id};
				switch(parseInt(this.selectIndex)){
					case 0:
						url='studio';
						break;
					case 1:
						url='equipment';
						break;
					case 2:
						url='activity';
						break;
				}
				uni.navigateTo({
					url: "../home/category/" + url + "?options=" + JSON.stringify(params)
				});
			},
			getHeightList() {
				let _this = this;
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery.select('.left-content').boundingClientRect(function(rects) {
					_this.left_height = rects.height;
				});
				selectorQuery.selectAll('.category-item').boundingClientRect(function(rects) {
					_this.right_height = rects.map((item) => item.top);
					console.log(_this.right_height)
				}).exec();
			},
			choose(index) {
				if (this.selectIndex === index) {
					return;
				}
				this.selectIndex = index;
				let list=[];
				switch(parseInt(index)){
					case 0:
						list=this.studioTypes;
						break;
					case 1:
						list=this.equipTypes;
						break;
					case 2:
						list=this.activityTypes;
						break;
				}
				this.productList=list;
				// 加入防抖
				if (this.timeout) {
					clearTimeout(this.timeout); //清除计时器				
				}
				this.timeout = setTimeout(() => {
					this.right_scroll = this.right_height[index] - 110;
				}, 300)
			}, 
			myscroll(e) {
				//引入节流	
				let right_content_height = e.detail.scrollHeight - this.windows_height;
				if (right_content_height == e.detail.scrollTop) {
					return;
				}
				let scroll_top = e.detail.scrollTop + 110; //110是banner图的高度
				//判断当前的scrollTop在哪个区间内;
				let now = +new Date();
				if (now - this.last > 100) {		
					this.last = now;
					let active_index = this.right_height.findIndex((value, index, arr) => value <= scroll_top && scroll_top < arr[index + 1]);
					this.selectIndex = active_index;
					if (this.left_height - this.windows_height) {
						//如果有超出部分
						let diff = this.left_height - this.windows_height
						this.left_scroll = Math.round((active_index * diff) / (this.catrgoryList.length - 1))
					}
				}
			}
		}
	}
</script>

<style lang="less">
	.category {

		.category-wrapper {
			width: 100%;
			display: flex;
			flex-direction: row;
			position: absolute;
			top: 0;
			bottom: 0;
			
			.left-wrapper {
				width: 200rpx;
				flex: 0 0 200rpx;
				background-color: #f6f6f6;

				.left-content {

					.title-content {
						.line{
							width:4rpx;
							height:22rpx;
							border-radius:2rpx;
							background:transparent;
							margin-right:15rpx;
							&.active{
								background:#651FFF;
							}
						}
						width: 100%;
						height: 100rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 36rpx;
						border-bottom: 1px solid #dedede;
						cursor: pointer;

						&:last-child {
							border-bottom: 0;
						}

						&.onSelected {
							background-color: #fff;
							position: relative;
							color: #651FFF;
						}
					}
				}
			}

			.right-wrapper {
				flex: 1;
				background:#fff;
				.right-content {
					width: 100%;
					padding: 20rpx 0;
					border-left: 1rpx solid #efefef;
					box-sizing: border-box;

					.banner-wrapper {
						padding: 0 20rpx;

						.swiper-content {
							width: 100%;
							height: 180rpx;
							margin-bottom: 20rpx;

							.swiper-item {
								.swiper-img {
									width: 100%;
									height: 180rpx;
								}
							}
						}
					}

					.product-wrapper {
						display:flex;
						justify-content:center;
						flex-wrap:wrap;
						padding:30rpx 30rpx 0rpx;
						.category-item {
							width:30%;
							padding:3rpx;
							text-align:center;
							margin-right:2%;
							margin-bottom:2%;
							.equipItem{
								padding:3rpx;
								border:1px solid #D9D9D9;
							}
							image{
								width:124rpx;
								height:124rpx;
							}
							.category-title {
								height: 60rpx;
								font-size: 26rpx;
								line-height: 60rpx;
								font-weight: 500;
								color: #000;
							}

							.category-content {
								display: flex;
								flex-direction: row;
								flex-flow: wrap;
								padding: 20rpx 20rpx 0;


								.product-item {
									width: 33%;
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									margin-bottom: 20rpx;

									.product-img {
										width: 120rpx;
										height: 140rpx;
										margin-bottom: 10rpx;
									}

									.product-title {
										font-size: 23rpx;
									}
								}
							}
						}
					}
				}
			}
		}

	}
</style>
