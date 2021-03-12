<template>
	<view>
		<div class="shop-info">
			<image class="img" :src="util.shopAvatarUtil(company.avatar)" mode="aspectFill"></image>
			<div class="right">
				<div class="line1">
					<p class="shop-name">
						<span v-if="company.nick">{{company.nick}}</span>
					</p>
					<p class="shop-collect" @click="collectOrnot">
						<span class="iconfont iconshoucang1-copy" v-if="!isCollect"></span><span class="text" v-if="!isCollect">收藏</span>
						<span class="text" v-else>已收藏</span>
					</p>
				</div>
				<div class="line3" v-if="company.remark">
					<span class="remark" v-for="(item,index) in company.remarks" :key="index">{{item}}</span>
				</div>
			</div>
		</div>
        <div class="company-brief">
            <span v-if="company.brief" v-html="company.brief"></span>
            <span v-else>暂无简介</span>
        </div>
		<view class="choose-list-shop">
			<text class="choose" :class="item.active?'active':''" v-for="(item,index) in choose_list" :key="index" @click="orderBy(item.name)">{{item.name}}</text>
		</view>
		
        <!-- 服务列表 -->
        <div  v-if="choose_type==0">
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
        <!-- 模特列表 -->
        <div v-if="choose_type==1">
			<div class="model" v-if="modelList.length>0">
				<div class="model-item" v-for="(product,index) in modelList" :key="index">
					<div class="item-img">
						<image :src="host + product.pic" mode="aspectFit" @error="errorPic(index)"></image>
					</div>
					<div class="model-name">
						<span v-text="product.title?product.title:'未命名标题'"></span>
					</div>
				</div>
			</div>
			<empty-show v-if="modelList.length==0&&!loading" hasMenu='1' style="margin-top:150rpx"></empty-show>	
        </div>

		<!-- 成功案例 -->
		<div class="example" v-if="choose_type==2">
			<div class="extend" v-html="company.extend" v-if="company.extend"></div>
			<empty-show v-else hasMenu='1' style="margin-top:150rpx"></empty-show>
		</div>
	</view>
</template>

<script>
import { company,service,model  } from '@/common/api/api'
import { getUserLsObj,collectOther } from '@/common/utils/collect';
import { getConditions } from '@/common/utils/util'
import {mapState} from 'vuex'
export default {
	data() {
		return {
            host:this.$qiniuHost,
            isCollect:false,
            company:{},
            choose_list:[
				{name:'服务列表',active:true,type:0},
				{name:'模特列表',active:false,type:1},
				{name:'成功案例',active:false,type:2},
            ],
            choose_type:0,
            loading:false,
            serviceList:[],
            modelList:[],
            params:{
                page:1,page_size:10,uid:''
			},
			loading:false

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
        }
    },
	watch:{
		choose_type(val){
            this.params.page = 1;
            this.serviceList = [];
            this.modelList = [];
            if(val==0){
                this.getServiceList()
            }else if(val==1){
                this.getModelList()
            }
        }
	},
	onShareAppMessage(res) {
		if (res.from === 'menu') {// 来自页面内分享按钮
		console.log(res.target)
		}
		return {
			title: this.company.nick,
			path: '/pages/merchant/company/index?id='+this.uid
		}
	},
	
	onLoad(e){
        this.params.uid = e.id
        this.getCompany();
        this.getServiceList()
	},
	mounted() {
		
	},
	methods: {
        errorPic(index){
            let obj = this.modelList[index]
            obj.pic = this.config.errorPic;
			this.modelList.splice(index,1,obj)
        },
		getCompany(){
            this.$http.get(company.get,{uid:this.params.uid}).then(res => {
				this.company = res;
				this.company.remarks = this.company.remark.split(',');
				this.company.extend = this.company.extend.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
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
        getModelList(){
			this.loading = true;
			uni.showLoading({title: '加载中'});
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
                    item.pic = item.photo.split(',').filter(v=>{return v})[0]
                    if(!item.score){
                        item.score = '0';
                    }
				})
				this.loading = false;
				uni.hideLoading();
            }).catch(err => {
				this.loading = false;
				uni.hideLoading();
			})
        },
		toGoods(val){
			uni.navigateTo({url:'/pages/home/category/serviceDetail/index?id='+val.id})
		}
	},
	onReachBottom:function(){
        this.params.page ++;
		if(this.choose_type==0){
            this.getServiceList()
        }else if(this.choose_type==1){
            this.getModelList()
        }
	},
	onPageScroll:function(e){
		
	},
}
</script>

<style lang="scss" scope>
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
		color: #7F8990;
		font-size: 28rpx;
		.remark{
            padding: 5rpx 10rpx;
            border: 1rpx solid #651FFF;
            font-size: 22rpx;
            color: #651FFF;
			margin-right: 10rpx;
        }
	}
}
.company-brief{
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
	justify-content: space-between;
	color:#333333;
	z-index: 10;
    width: 100%;
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
		padding: 30rpx;
	}
}
.service{
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
   padding: 0rpx 30rpx 30rpx;
	display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
	margin-top: 20rpx; 
    .model-item{
        position: relative;
		width: 334rpx;
        height: 334rpx;
		margin-bottom: 20rpx;
        .item-img{
            image{
                border-radius: 10rpx;
                width: 334rpx;
        		height: 334rpx;
            }
        }
        .model-name{
            position: absolute;
            bottom: 0rpx;
            border-bottom-left-radius: 10rpx;
            border-bottom-right-radius: 10rpx;
            height: 60rpx;
            line-height: 60rpx;
            width: 100%;
            text-align: center;
            color: #ffffff;
            background-color: rgba($color: #000000, $alpha: 0.4);
            font-size: 30rpx;
        }
    }
}
.example{
	padding: 30rpx;
	.extend{
		background-color: #ffffff;
	}
	
}
</style>
