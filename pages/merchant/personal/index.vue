<template>
	<view>
		<div class="shop-info">
			<image class="img" :src="util.shopAvatarUtil(person.avatar)" mode="aspectFill"></image>
			<div class="right">
				<div class="line1">
					<p class="shop-name">
						<span v-if="person.nick">{{person.nick}}</span>
					</p>
					<p class="shop-collect" @click="collectOrnot">
						<span class="iconfont iconshoucang1-copy" v-if="!isCollect"></span><span class="text" v-if="!isCollect">收藏</span>
						<span class="text" v-else>已收藏</span>
					</p>
				</div>
				<div class="line3">
                    <span  v-if="type==1">常驻地：{{modelDetail.city}}</span>
					<span class="remark" v-else-if="person.remark">{{person.remark}}</span>
				</div>
			</div>
		</div>
        <!-- <div class="person-brief">
            <span v-if="person.address">{{person.brief}}</span>
            <span v-else>暂无简介</span>
        </div> -->
		<view class="choose-list-shop">
			<text 
            class="choose" 
            :class="item.active?'active':''" 
            v-for="(item,index) in choose_list" 
            :key="index" 
            @click="orderBy(item.name)">{{item.name}}</text>
		</view>
		
        <!-- 服务列表 -->
        <div  v-if="choose_type==2">
			<div class="service" v-if="serviceList.length>0">
				<div v-for="(product,index) in serviceList" :key="index">
					<!-- <product-card  :product="item" class="equip-card" type="equipment"></product-card> -->
					<view class="product">
						<div @click="toGoods(product)" >
							<!-- v-if="showEquipIndex + 14 > index && showEquipIndex - 6 < index" -->
							<image  :src="host + util.picExplode(product.pic)" mode="aspectFit"></image>
							<view class="name">
								<span v-text="product.title"></span>
							</view>
							<view class="info">
								<view class="line1">
									<div class="left">
										<span class="fuhao">￥</span>
										<span class="price">{{ product.norms[0].price | priceFilter}}</span>
										<span class="per">/每小时</span>
									</div>
									<div class="right">
										<span class="deal">合作：{{product.user.deal_count}}次</span>
									</div>
								</view>
							</view>
						</div>
					</view>
				</div>
			</div>
			<empty-show v-if="serviceList.length==0&&!loading" hasMenu='1' style="margin-top:150rpx"></empty-show>
        </div>
        <!-- 模特资料 -->
        <div v-if="choose_type==1">
			<div class="model">
                <div class="info-title">基础资料</div>
                <div class="base-info">
                    <div class="info-line">
                        <p class="item">
                            <span class="property">姓名：</span><span class="value" v-text="modelDetail.real_name?modelDetail.real_name:'未实名'"></span>
                        </p>
                        <p class="item">
                            <span class="property">性别：</span><span class="value" v-if="modelDetail.sex=='1'">男</span><span class="value" v-else>女</span>
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item1">
                            <span class="property">常驻城市：</span><span class="value">{{modelDetail.city}}</span>
                            <!-- <span class="iconfont">！</span><span class="tips">接单范围只限北京</span> -->
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item">
                            <span class="property">国籍：</span><span class="value" v-text="modelDetail.nationality?modelDetail.nationality:'暂无数据'"></span>
                        </p>
                    </div>
                </div>
                <div class="info-title">个人资料</div>
                <div class="body-info">
                    <div class="info-line">
                        <p class="item">
                            <span class="property">身高：</span><span class="value">{{modelDetail.height}}cm</span>
                        </p>
                        <p class="item">
                            <span class="property">体重：</span><span class="value">{{modelDetail.weight}}kg</span>
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item">
                            <span class="property">三维：</span>
                            <span class="value" v-if="modelDetail.bust&&modelDetail.waist&&modelDetail.hips">{{modelDetail.bust}}/{{modelDetail.waist}}/{{modelDetail.hips}}</span>
                            <span class="value" v-else>暂无数据</span>
                        </p>
                        <p class="item">
                            <span class="property">鞋码：</span><span class="value" v-text="modelDetail.shoes?modelDetail.shoes:'暂无数据'"></span>
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item">
                            <span class="property">肤色：</span>
                            <span class="value" v-if="modelDetail.skin==1">白色</span>
                            <span class="value" v-else-if="modelDetail.skin==2">黄色</span>
                            <span class="value" v-else-if="modelDetail.skin==3">黑色</span>
                            <span class="value" v-if="!modelDetail.skin">暂无数据</span>
                        </p>
                        <p class="item">
                            <span class="property">当前发型：</span>
                            <span class="value" v-if="modelDetail.hair==1">直长发</span>
                            <span class="value" v-else-if="modelDetail.hair==2">短发</span>
                            <span class="value" v-if="!modelDetail.hair">暂无数据</span>
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item">
                            <span class="property">脸型：</span>
                            <span class="value" v-if="modelDetail.face==1">圆脸</span>
                            <span class="value" v-else-if="modelDetail.face==2">长脸</span>
                            <span class="value" v-else-if="modelDetail.face==3">瓜子脸</span>
                            <span class="value" v-else>暂无数据</span>
                        </p>
                        <p class="item">
                            <span class="property">腿长：</span>
                            <span class="value" v-if="modelDetail.leg">{{modelDetail.leg}}</span>
                            <span class="value" v-else>暂无数据</span>
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item">
                            <span class="property">臀展：</span>
                            <span class="value" v-if="modelDetail.wingspan">{{modelDetail.wingspan}}</span>
                            <span class="value" v-else>暂无数据</span>
                        </p>
                        <p class="item">
                            <span class="property">肩宽：</span>
                            <span class="value" v-if="modelDetail.shoulder">{{modelDetail.shoulder}}</span>
                            <span class="value" v-else>暂无数据</span>
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item1">
                            <span class="property">是否有双眼皮：</span>
                            <span class="value" v-if="modelDetail.eyelid==1">单眼皮</span>
                            <span class="value" v-else-if="modelDetail.eyelid==2">双眼皮</span>
                            <span class="value" v-else>暂无数据</span>
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item">
                            <span class="property">第一语言：</span><span class="value">{{modelDetail.lan_one | lanToStr}}</span>
                        </p>
                    </div>
                    <div class="info-line">
                        <p class="item">
                            <span class="property">第二语言：</span><span class="value">{{modelDetail.lan_two | lanToStr}}</span>
                        </p>
                    </div>
                </div>
                <div class="info-title" v-if="modelDetail.style_arr&&modelDetail.style_arr.length>0">拍摄风格</div>
                <div class="model-style" v-if="modelDetail.style_arr&&modelDetail.style_arr.length>0">
                    <span v-for="(item,index) in modelDetail.style_arr" :key="index" class="style-item">{{item}}</span>
                </div>

                <div class="info-title" v-if="modelDetail.type_arr&&modelDetail.type_arr.length>0">模特标签</div>
                <div class="model-type" v-if="modelDetail.type_arr&&modelDetail.type_arr.length>0">
                    <span v-for="(item,index) in modelDetail.type_arr" :key="index" class="type-item">{{item}}</span>
                </div>
		
			</div>	
        </div>

		<!-- 相册 -->
		<div class="example" v-if="choose_type==0">
			<div class="album" v-if="albumList.length>0">
				<div class="album-item" v-for="(item,index) in albumList" :key="index" @click="gotoAlbum(item)">
					<div class="item-img">
						<image :src="host + item.pic" mode="aspectFill" @error="errorPic(index)"></image>
					</div>
					<div class="album-name">
						<p v-text="item.name?item.name:'未命名相册'"></p>
						<p>{{item.imgs.length}}</p>
					</div>
				</div>
			</div>
			<empty-show v-else hasMenu='1' style="margin-top:150rpx"></empty-show>
		</div>
	</view>
</template>

<script>
import { company,service,model,collectOrFollow,album  } from '@/common/api/api'
import { getUserLsObj,collectOther } from '@/common/utils/collect';
import { getConditions } from '@/common/utils/util'
import {mapState} from 'vuex'
export default {
	data() {
		return {
            host:this.$qiniuHost,
            isCollect:false,
            person:{},
            choose_list:[
				{name:'作品集',active:true,type:0},
				{name:'资料',active:false,type:1},
				{name:'ta的服务',active:false,type:2},
            ],
            choose_type:0,
            loading:false,
            serviceList:[],
            mid:'',
            modelDetail:[],
            params:{
                page:1,page_size:10,uid:''
			},
			a_params:{
				page:1,page_size:10,uid:''
			},
			albumList:[],
            loading:false,
            type:1,//1模特，2摄影师

		}
	},
	components:{
		
	},
	computed: {
		...mapState(['user']),
    },
    filters:{
        priceFilter(val){
            let arr = val.split('.');
            return arr[0]
        },
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
	watch:{
		
	},
	onShareAppMessage(res) {
		if (res.from === 'menu') {// 来自页面内分享按钮
		console.log(res.target)
		}
		return {
			title: this.person.nick,
			path: '/pages/merchant/person/index?id='+this.uid
		}
	},
	
	onLoad(e){
        // this.getPerson();
        this.type = e.type;
        if(e.type==1){
			this.mid = e.id;
            this.choose_type = 1;
            this.getModelDetail();
        }else{
			this.choose_list.splice(1,1)
			this.params.uid = e.id
			this.a_params.uid = e.id
			this.getPerson()
            this.getServiceList()
        }
        this.getAlbum()
	},
	mounted() {
		
	},
	methods: {
        errorPic(index){
            let obj = this.modelList[index]
            obj.pic = this.config.errorPic;
			this.modelList.splice(index,1,obj)
        },
		getPerson(){
            this.$http.get(company.get,{uid:this.params.uid}).then(res => {
				this.person = res;
				this.person.extend = this.person.extend.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
            })
        },
        orderBy(data){
			this.choose_list.forEach(item => {
				if(item.name==data){
					item.active = true;
                    this.choose_type = item.type
				}else{
					item.active = false;
				}
            });
            
        },
        collectOrnot(){
			collectOther(this.params.uid,0,1,0).then(res => {
				this.isCollect = res;
				this.getCollect()
			});
			
			
        },
        getCollect(){
			this.$http.get(collectOrFollow.getShopCount,{uid:this.params.uid,obj:1,type:0}).then(res => {
				this.collect_num = res;
			})
		},
		getAlbum(){
			this.$http.get(album.get,this.a_params).then(res => {
				console.log('album',res)
				this.albumList = res.rows;
				this.albumList.forEach(item => {
					item.imgs = item.content.split(',').filter(v=>{return v})
				})
			})
		},
        getServiceList(){
			this.loading = true;
			uni.showLoading({title: '加载中'});
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
        getModelDetail(){
			this.loading = true;
			uni.showLoading({title: '加载中'});
            this.$http.get(model.getModel,{id:this.mid,isAutoMsg:1}).then(res => {
				this.modelDetail = res;
				this.params.uid = this.modelDetail.id;
				this.getPerson()
				this.loading = false;
				uni.hideLoading();
            }).catch(err => {
				this.loading = false;
				uni.hideLoading();
			})
		},
		toGoods(val){
			uni.navigateTo({url:'/pages/home/category/serviceDetail/index?id='+val.id})
		},
		gotoAlbum(data){
			uni.setStorage({
				key:'album',
				data:data
			});
			uni.navigateTo({url:'/pages/merchant/personal/album'})
		}

	},
	onReachBottom:function(){
       
		if(this.choose_type==0){
			this.a_params.page++;
            this.getAlbum()
        }else if(this.choose_type==2){
			this.params.page ++;
            this.getServiceList()
        }
	},
	onPageScroll:function(e){
		
	},
}
</script>

<style lang="scss" scope>
page{
    background-color: #FFFFFF;
}
.shop-info{
	display: flex;
	// justify-content: space-between;
	align-content: flex-start;
	padding: 40rpx 30rpx 20rpx;
	background-color: #ffffff;
	border-top: 1px solid #f8f8f8;
	color: #333333;
	.img{
		width: 130rpx;
		height: 130rpx;
		margin-right: 20rpx;
	}
	.right{
		flex:1
	}
	.line1{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
		color: #333333;
		.iconfont{
			font-size: 28rpx;
			margin-right: 10rpx;
		}
		.shop-name{
			font-size: 28rpx;
			flex: 1;
		}
		.shop-collect{
			color: #999999;
			padding: 0rpx 25rpx;
			border-radius: 25rpx;
			line-height: 40rpx;
			display: flex;
			align-items: center;
			border: 1rpx solid #d9d9d9;
			span{
				display: flex;
			}
			.text{
				font-size: 24rpx;
				margin-left: 10rpx;
			}
			
		}
		
	}
	.line2{
		display: flex;
		font-size: 24rpx;
		margin-bottom: 10rpx;
		line-height: 30rpx;
		.is-auth{
			color:#651FFF;
			margin-right: 25rpx;
			
			.iconfont{
				margin-right: 10rpx;

			}
		}
		.not-auth{
			color: #999999;
			margin-right: 25rpx;
		}
		.shop-rate{
			margin-right: 25rpx;
		}
		.collection{
			color: #999999;
		}
	}
	.line3{
		color: #999999;
		font-size: 28rpx;
		.remark{
            padding: 5rpx 10rpx;
            border: 1rpx solid #651FFF;
            font-size: 22rpx;
            color: #651FFF;
        }
	}
}
.person-brief{
    padding: 10rpx 30rpx 30rpx;
    background-color: #ffffff;
    font-size: 26rpx;
    color: #666666;
    line-height: 35rpx;
}
.choose-list-shop {
	font-size: 30rpx;
	background-color: #ffffff;
	display: flex;
	// justify-content: space-between;
	color:#333333;
	z-index: 10;
    width: 100%;
    border-bottom: 1rpx solid #f8f8f8;
    border-top: 20rpx solid #f8f8f8;
	.active{
		position: relative;
		color: #651FFF;
	}
	.active::after{
		content: '';
		position: absolute;
		top: 80rpx;
		left: 30rpx;
		width: 40rpx;
		height: 4rpx;
		background-color: #651FFF;
	}
	.choose {
		padding: 20rpx 30rpx;
        margin-right: 30rpx;
	}
}
.service{
	padding: 0rpx 20rpx 30rpx;
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
            margin-bottom: 20rpx;
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
.model{
	padding: 30rpx 30rpx 200rpx;
	background-color: #ffffff;
	.info-title{
		color: #333333;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 80rpx;
	}
	.base-info,.body-info{
		padding: 30rpx 0;

		.info-line{
			display: flex;
			justify-content: space-between;
			font-size: 32rpx;
			.item{
				width: 300rpx;
				line-height: 60rpx
			}
			.item1{
				line-height: 60rpx
			}
			.property{
				margin-right: 20rpx;
				color: #999999;
			}
			.value{
				color: #333333
			}
			.iconfont{
				margin-left: 30rpx;
				margin-right: 10rpx;
			}
			.tips{
				font-size: 24rpx;
				color: #999999;
			}
		}
	}
	.model-style{
		padding: 30rpx 0;
		.style-item{
			color: #999999;
			font-size: 32rpx;
			margin-right: 10rpx;
			line-height: 60rpx;
		}
	}
	.model-type{
		padding: 30rpx 0;
		.type-item{
			color: #999999;
			font-size: 32rpx;
			margin-right: 20rpx;
			border: 1rpx solid #999999;
			padding: 5rpx 20rpx;
			border-radius: 30rpx;
		}
	}
}
.example{
	.album{
		padding: 0rpx 30rpx 30rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 20rpx; 
		.album-item{
			position: relative;
			width: 334rpx;
			height: 334rpx;
			margin-bottom: 20rpx;
			.item-img{
				background-color: #f8f8f8;
				image{
					border-radius: 10rpx;
					width: 334rpx;
					height: 334rpx;
				}
			}
			.album-name{
				position: absolute;
				bottom: 0rpx;
				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;
				height: 60rpx;
				line-height: 60rpx;
				width: 100%;
				color: #ffffff;
				background-color: rgba($color: #000000, $alpha: 0.4);
				font-size: 30rpx;
				display: flex;
				justify-content: space-between;
				p{
					padding: 0 20rpx;
				}
			}
		}
	}
	
}
</style>
