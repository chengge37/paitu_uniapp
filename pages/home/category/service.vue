<template>
	<view class="service-content" :class="drowdownOpen?'banScroll':''">
        <div class="fixed-top">
			<div class="search-box">
				<div class="location">
					<span></span>
				</div>
				<div class="search">
					<span class="iconfont iconsousuo"></span>
					<form action="#" class="search-input">
						<input type="search" placeholder="输入搜索内容"  placeholder-style="color:#999999;" v-model="search"
							@confirm="initList" />
					</form>
					<span class="iconfont iconcuo" v-if="search" @click="clearSearch"></span>
				</div>
			</div>
			
		</div>
		<div class="advertisement">
			<!-- <advertise :type='3'  ref="advertise"></advertise> -->
		</div>
		<div :class="choose_fixed_top||advList.length==0?chooseFixed:''" class="choose-list" id="chooseItem" @click="selectToFixed">
			<div class="choose-menu" >
				<dropdown-menu>
					<dropdown-item 
					v-model="value" 
					:list="list1" 
					title="默认"
					:index="0"
					:colorActive="true"
					@tapone="tapDropdown" 
					@choose="chooseDefault" 
					@close="dropdownClose"></dropdown-item>
					<dropdown-item 
					ref="dropdownItem"
					v-model="value" 
					:hasSlot="true" 
					title="服务"
					:index="1"
					:colorActive="colorActive1"
					@tapone="chooseSelect"
					@reset="serviceReset"
					@comfirm="serviceComfirm"
					@close="dropdownClose"
					>
						<view class="dropdown-view">
							<div class="selected">
								<p>
									<span  class="title">当前选择：</span>
									<span class="text" v-if="categorySelected.name">{{categorySelected.name}}</span>
									<span class="text" v-else>-未选择-</span>
								</p>
							</div>
							<div class="select-line">
								<p class="title">平面摄影</p>
								<div class="picker">
									<picker @change="bindServiceChange($event,0)" :range="categories[0].children" range-key="name">
										<view class="normsPicker">
											<div class="left"> </div>
											<div class="right">
												<!-- <span v-if="categories[0].children[0]">已选【{{categories[0].children[0].name}}】</span> -->
												<span class="iconfont iconyoujiantou"></span>
											</div>
										</view>
									</picker>
								</div>
							</div>
							<div class="select-line">
								<p class="title">视频与特效</p>
								<div class="picker">
									<picker @change="bindServiceChange($event,1)" :range="categories[1].children" range-key="name">
										<view class="normsPicker">
											<div class="left"> </div>
											<div class="right">
												<!-- <span v-if="categories[1].children[0]">已选【{{categories[1].children[0].name}}】</span> -->
												<span class="iconfont iconyoujiantou"></span>
											</div>
										</view>
									</picker>
								</div>
							</div>
							<div class="select-line">
								<p class="title">后期相关</p>
								<div class="picker">
									<picker @change="bindServiceChange($event,2)" :range="categories[2].children" range-key="name">
										<view class="normsPicker">
											<div class="left"> </div>
											<div class="right">
												<!-- <span v-if="categories[2].children[0]">已选【{{categories[2].children[0].name}}】</span> -->
												<span class="iconfont iconyoujiantou"></span>
											</div>
										</view>
									</picker>
								</div>
							</div>
							<!-- <div class="btn">
								<div class="reset" @click="serviceReset">重置</div>
								<div class="comfirm" @click="serviceComfirm">确认</div>
							</div> -->
							
						</view>
					</dropdown-item>
					<dropdown-item 
						ref="pinpaiDropdown"
						v-model="value" 
						:hasSlot="true" 
						title="拼拍"
						:index="2"
						:colorActive="colorActive2"
						@tapone="chooseSelect"
						@reset="pinpaiReset"
						@comfirm="pinpaiComfirm"
						@close="dropdownClose">
						<view class="dropdown-view">
							<view class="groupBooking">
								<view class="select-cart">
									<view class="title">
										拍摄类型
									</view>
									<view class="select-list">
										<div class="item" :class="item.active?'active':''" v-for="(item,idx) in pinpaiType" :key="idx" @click="pinpaiPick(item.name,1)">{{item.name}}
											<span class="icon"></span>
										</div>
									</view>
								</view>
								<view class="select-cart">
									<view class="title">
										拍摄风格
									</view>
									<view class="select-list">
										<div class="item" :class="item.active?'active':''" v-for="(item,idx) in pinpaiWay" :key="idx" @click="pinpaiPick(item.name,2)">{{item.name}}
											<span class="icon"></span>
										</div>
									</view>
								</view>
								<view class="select-cart">
									<view class="title">
										拍摄分类
									</view>
									<view class="select-list">
										<div class="item" :class="item.active?'active':''" v-for="(item,idx) in pinpaiClassify" :key="idx" @click="pinpaiPick(item.name,3)">{{item.name}}
											<span class="icon"></span>
										</div>
									</view>
								</view>
								<view class="select-cart">
									<view class="title">
										拍摄对象
									</view>
									<view class="select-list">
										<div class="item" :class="item.active?'active':''" v-for="(item,idx) in pinpaiObj" :key="idx" @click="pinpaiPick(item.name,4)">{{item.name}}
											<span class="icon"></span>
										</div>
									</view>
								</view>
							</view>
							<!-- <div class="btn">
								<div class="reset" @click="serviceReset">重置</div>
								<div class="comfirm" @click="serviceComfirm">确认</div>
							</div> -->
						</view>
					</dropdown-item>
					
				</dropdown-menu>
			</div>
			
		</div>

		<div class="list" :class="choose_fixed_top||advList.length==0?'listTop':''">
			<div v-if="colorActive1">
				<twocol-list :List='serviceList' :type="'2'" v-if="serviceList.length>0"></twocol-list>
				<empty-show hasMenu='1' v-else-if="!loading&&serviceList.length==0" :style="advList.length>0?'margin-top:300px':''"></empty-show>
			</div>
			<div v-else-if="colorActive2">
				<twocol-list :List='groupGoods' :type="'3'" v-if="groupGoods.length>0"></twocol-list>
				<empty-show hasMenu='1' v-else-if="!loading&&groupGoods.length==0" :style="advList.length>0?'margin-top:300px':''"></empty-show>
			</div>
		</div>
		<div class="nomoredata" v-if="isReachBottom&&((serviceList.length>0&&colorActive1)||(groupGoods.length>0&&colorActive2))">到底了~</div>
	</view>
</template>

<script>
import { service,groupBook } from '@/common/api/api';
import advertise from "@/components/advertise/advertise.vue"
import uniRate from '@/components/uni-ui/uni-rate/uni-rate.vue';
import dropdownItem from '@/components/uni-ui/ms-dropdown/dropdown-item.vue';
import dropdownMenu from '@/components/uni-ui/ms-dropdown/dropdown-menu.vue';
import twoColList from '@/components/twocol-list/twocol-list.vue';
	export default {
		components:{
			uniRate,twoColList,advertise,dropdownItem,dropdownMenu
		},
		data() {
			return {
				value:0,
				list1: [
                    { name: '默认', id: 0 },
                    { name: '销量',  id: 1 },
                    { name: '价格', id: 2 }
				],
				params:{
					page:1,page_size:10,search:'',isAutoMsg:1
				},
				g_params:{
					page:1,page_size:10,search:'',is_up:1,del:0,is_user:1,valid:1,isAutoMsg:1
				},
				search:'',
				g_type:'',
				g_way:'',
				g_classfy:'',
				g_obj:'',
				loading:false,
				advList:[],
				serviceList:[],
				groupGoods:[],
			    choose_list:[
					{name:'默认',type:'',active:true},
					{name:'价格',type:'',active:false,up:true},
					{name:'销量',type:'total',active:false,up:true},
				],
				firstDistance:0,
				chooseDistance:0,
				scrollTop:0,
				choose_fixed_top:false,
				drowdownOpen:false,
				isReachBottom:false,
				categories:[
					{children:[]},
					{children:[]},
					{children:[]},
				],
				colorActive0:false,
				colorActive1:true,
				colorActive2:false,
				categorySelected:{},
				pinpaiType:this.addAttribute(this.config.pinpaiType),//拍摄类型
				pinpaiWay:this.addAttribute(this.config.pinpaiWay),//拍摄风格
				pinpaiClassify:this.addAttribute(this.config.pinpaiClassify),//拍摄分类
				pinpaiObj:this.addAttribute(this.config.pinpaiObj),//拍摄对象
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
			pinpaiType(val){
				console.log(val)
				let arr = [];
				val.forEach(v => {
					if(v.active) arr.push(v.id)
				})
				this.g_type = arr.join(',')
			},
			pinpaiWay(val){
				let arr = [];
				val.forEach(v => {
					if(v.active) arr.push(v.id)
				})
				this.g_way = arr.join(',')
			},
			pinpaiClassify(val){
				let arr = [];
				val.forEach(v => {
					if(v.active) arr.push(v.id)
				})
				this.g_classfy = arr.join(',')

			},
			pinpaiObj(val){
				let arr = [];
				val.forEach(v => {
					if(v.active) arr.push(v.id)
				})
				this.g_obj = arr.join(',')

			},
			// team_type:'',team_way:'',team_classify:'',team_obj:''
			g_type(val){
				if(val){
					this.g_params = Object.assign(this.g_params,{team_type:val})
				}else{
					delete this.g_params.team_type
				}
			},
			g_way(val){
				if(val){
					this.g_params = Object.assign(this.g_params,{team_way:val})
				}else{
					delete this.g_params.team_way
				}
			},
			g_classfy(val){
				if(val){
					this.g_params = Object.assign(this.g_params,{team_classify:val})
				}else{
					delete this.g_params.team_classify
				}
			},
			g_obj(val){
				if(val){
					this.g_params = Object.assign(this.g_params,{team_obj:val})
				}else{
					delete this.g_params.team_obj
				}
			},
			search(val){
				if(val){
					if(this.colorActive1){
						this.params.search = val;
					}
					if(this.colorActive2){
						this.g_params.search = val;
					}
				}
				
			}
		},
		onLoad: function(e) {
			this.getCategory()
			this.getServiceList();
			// this.getGroupBooking()
			// setTimeout(()=>{
			// 	this.advList = this.$refs.advertise.advList
			// },1000)
			console.log('this',this)
		},
		onShow(){
			// #ifdef H5
			this.$wechatShare.share({  
				title:'服务列表',
			    desc: '派图么服务列表',  
			    img: this.$qiniuHost+'109-1578980959135.png' 
			});
			// #endif
			setTimeout(()=>{
				this.getChooseDistence();
			},1000)
			
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
			clearSearch(){
				this.search = '';
				this.params.search = ''
				this.g_params.search = ''
				this.initData()
			},
			initList(){
				if(this.colorActive1){
					this.params.page = 1;
					this.serviceList = [];
					this.getServiceList();
				}else if(this.colorActive2){
					this.g_params.page = 1;
					this.groupGoods = [];
					this.getGroupBooking();
				}
			},
            getServiceList(){
				uni.showLoading({title: '加载中'});
				this.loading = true
                this.$http.get(service.getList,this.params).then(res => {
					if(res.rows.length>0){
						if(this.serviceList.length>0){
							this.serviceList = this.serviceList.concat(res.rows)
						}else{
							this.serviceList = res.rows;
						}
					}else{
						if(this.params.page>1){
							uni.showToast({title:'没有更多数据了~',icon:'none',duration:1000});
						}
						this.isReachBottom = true;
					}
					this.serviceList.forEach(item => {
						item.norms.sort(function(a,b){
							return a.priority - b.priority
						})
						item.user.score = parseInt(item.user.score)
					})
					this.loading = false;
					uni.hideLoading();
                }).catch(err => {
					this.loading = false;
					uni.hideLoading();
				})
			},
			getGroupBooking(){
				this.loading = true;
				uni.showLoading({title: '加载中'});
				let params = Object.assign(this.g_params)
				this.$http.get(groupBook.getList,params).then(res => {
					if(res.rows.length>0){
						if(this.groupGoods.length>0){
							this.groupGoods = this.groupGoods.concat(res.rows)
						}else{
							this.groupGoods = res.rows;
						}
					}else{
						if(this.params.page>1){
							uni.showToast({title:'没有更多数据了~',icon:'none',duration:1000});
							this.isReachBottom = true;
						}
						
					}
					this.loading = false;
					uni.hideLoading();
				}).catch(err => {
					this.loading = false;
					uni.hideLoading();
				})
			},
			getCategory(){
				this.$http.get(service.getCategory).then(res => {
					this.categories = res;
					this.categories.forEach((item,index) => {
						let arr = {id:item.id,name:item.name,pid:item.pid}
						this.categories[index].children.splice(0,0,arr)
					})
				}).catch(err => {
				})
			},
			addAttribute(arr){
				arr.forEach(item => { item.active=false });
				return arr
			},
			getChooseDistence(){
				const query = uni.createSelectorQuery()
				query.select('#chooseItem').boundingClientRect(data => {
					// console.log("节点离页面顶部的距离为" + data.top);
					this.chooseDistance = data.top
				}).exec();
			},
			selectToFixed(){
				if(!this.choose_fixed_top&&this.serviceList.length>2&&this.advList.length>0){
					uni.pageScrollTo({
						scrollTop: this.chooseDistance + this.scrollTop,
						duration: 100
					});
				}
				
			},
			tapDropdown(){
				this.drowdownOpen = true;
			},
			chooseSelect(val){
				this.drowdownOpen = true;
				this.isReachBottom = false;
				let arr = [1,2]
				arr.forEach(item => {
					if(item==val){
						let key = 'colorActive'+item;
						this[key] = true;
					}else{
						let key = 'colorActive'+item;
						this[key] = false;
					}
				})
				this.initData()
			},
			chooseDefault(val){
				console.log(val)
				if(val==0){
					delete this.g_params.order_by;
					delete this.params.order_by;
				}else if(val==1){
					this.params.order_by = 'total'
					this.g_params.order_by = 'total'
				}else{
					this.params.order_by = 'sort'
					this.g_params.order_by = 'sort'
				}
				this.initData()
			},
			initData(){
				if(this.colorActive1){
					this.params.page = 1;
					this.serviceList = [];
					this.getServiceList()
				}
				if(this.colorActive2){
					this.g_params.page = 1;
					this.groupGoods = [];
					this.getGroupBooking()
				}
			},
			chooseCategory(val){
				console.log(val)
				this.params.page = 1;
				this.serviceList = [];
				this.params = Object.assign(this.params,{category_id:val})
				this.getServiceList()
			},
			
			dropdownClose(){
				this.drowdownOpen = false;
			},
			bindServiceChange(e,val){
				console.log(e.detail.value,val)
				this.categorySelected = this.categories[val].children[e.detail.value]
			},
			// 服务筛选--重置
			serviceReset(){
				this.categorySelected = {};
				delete this.params.category_id
			},
			// 服务筛选--确认
			serviceComfirm(){
				console.log(this.$refs.dropdownItem)
				if(this.categorySelected&&this.categorySelected.id){
					this.chooseCategory(this.categorySelected.id)
				}else{
					this.params.page = 1;
					this.categorySelected = {};
					delete this.params.category_id
					this.getServiceList()
				}
				this.$refs.dropdownItem.close()
			},

			// 拼拍筛选-多选
			pinpaiPick(name,val){
				// val:1为拍摄类型，2为拍摄风格，3拍摄为分类，4为拍摄对象
				if(val==1){
					let arr = []
					this.pinpaiType.forEach(item => {
						if(name==item.name) item.active = !item.active;
						if(item.active) arr.push(item.id)
					})
					this.g_type = arr.join(',')
					console.log(arr)
				}else if(val==2){
					let arr = []
					this.pinpaiWay.forEach(item => {
						if(name==item.name) item.active = !item.active;
						if(item.active) arr.push(item.id)
					})
					this.g_way = arr.join(',')
				}else if(val==3){
					let arr = []
					this.pinpaiClassify.forEach(item => {
						if(name==item.name) item.active = !item.active;
						if(item.active) arr.push(item.id)
					})
					this.g_classfy = arr.join(',')
				}else if(val==4){
					let arr = []
					this.pinpaiObj.forEach(item => {
						if(name==item.name) item.active = !item.active;
						if(item.active) arr.push(item.id)
					})
					this.g_obj = arr.join(',')
				}

			},

			// 拼拍筛选确认
			pinpaiComfirm(){
				this.g_params.page = 1;
				this.groupGoods = [];
				this.getGroupBooking();
				this.$refs.pinpaiDropdown.close()
				console.log(this.g_params)
			},
			pinpaiReset(){
				this.addAttribute(this.pinpaiType);
				this.addAttribute(this.pinpaiWay);
				this.addAttribute(this.pinpaiClassify);
				this.addAttribute(this.pinpaiObj);
				delete this.g_params.team_type;
				delete this.g_params.team_classify;
				delete this.g_params.team_way;
				delete this.g_params.team_obj;
				this.g_params.page = 1;
				this.groupGoods = [];
				this.getGroupBooking();
				this.$refs.pinpaiDropdown.close()
			},
		},
		onReachBottom() {
			if(!this.isReachBottom){
				if(this.colorActive2){
					this.g_params.page ++;
					this.getGroupBooking()
				}else{
					this.params.page++;
					this.getServiceList()
				}	
			}
			
		}
	}
</script>

<style lang="scss" scope>
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
}
.banScroll{
	overflow: hidden;
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

.choose-list{
	width: 100%;
	background-color: #ffffff;
	.choose-menu{
		width: 75%;
		.dropdown-view{
			margin-bottom: 120rpx;
			.selected{
				padding: 10rpx 30rpx;
				.title{
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}
				.text{
					color: #651FFF;
					font-size: 30rpx;
					
				}
			}
			.select-line{
				padding: 0 30rpx;
				height: 98rpx;
				line-height: 98rpx;
				background-color: #ffffff;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #D9D9D9;
				.title{
					color: #333333;
					font-size: 30rpx;
					font-weight: bold;
				}
				.picker{
					flex: 1;
					margin-left: 40rpx;
					font-size: 26rpx;
					.normsPicker{
						display: flex;
						justify-content: space-between;
						color: #999999;
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
			}
			
			.groupBooking{
				margin-bottom: 100rpx;
				.select-cart{
					margin-bottom: 20rpx;
					font-size: 30rpx;
					padding: 30rpx;
					.title{
						margin-bottom: 30rpx;
						font-weight: bold;
					}
					.select-list{
						display: flex;
						flex-wrap: wrap;
						.item {
							padding: 10rpx 30rpx;
							background: #F0F0F0;
							width: 130rpx;
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
			
		}
	}
}
.mp-choose-fixed{
	position: fixed;
	top: 100rpx;
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
</style>
