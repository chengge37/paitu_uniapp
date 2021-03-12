<template>
	<div class="cou-contain">
		<div class="head">
			<span @click="changeTab(item)" v-for="(item,index) in tabArray" :key="index" class="tab" :class="{'tab-active':item.checked}">{{item.word}} {{item.number}}</span>
		</div>
		<div class="coupon-wrap">
			<div class="coupon" v-for="(item,index) in couponList" :key="index" :class="{used:tabArray[1].checked||tabArray[2].checked}">
				<!-- <img src="../../static/mydiscount.png" alt=""> -->
				<div class="content" :style="'background-image:url('+host+'images/miniapp/coupon.png'+')'">
					<div class="content-left">
						<div class="type-date">
							<p class="type">
								<span>{{item.to_uid=='0'?'全场券':'店铺券'}}</span>
								<span class="fenge">|</span>
								<span>{{item.content}}</span>
							</p>
							<p class="date">
								<span class="date-start">{{item.st_time}}</span>
								<span>-</span>
								<span class="date-end">{{item.end_time}}</span>
							</p>
						</div>
					</div>
					<div class="content-right">
						<p class="price" v-if="item.coupon_type==1">￥<span>{{item.money}}</span></p>
						<p class="price" v-else><span>{{item.money}}折</span></p>
						<p class="use-rule">满{{item.limit_money}}使用</p>
						<p @click="toUse(item)" class="btn" v-if="tabArray[0].checked">立即使用</p>
					</div>
				</div>
			</div>
			<empty-show class="nodata" v-if="couponList.length==0&&!loading"></empty-show>
		</div>
		<!-- <div class="tab">
            
        </div>
        <div class="list-item">
            <discount-coupon></discount-coupon>
            <discount-coupon></discount-coupon>
        </div> -->


	</div>
</template>

<script>
// import discountCoupon from "../../components/discount-coupon/discount-coupon.vue"
import {coupon} from '@/common/api/api'

	export default {
        components:{
            // discountCoupon
        },
	    data() {
	        return {
				host: this.$qiniuHost,
				tabArray:[
					{
						word:'可使用',
						number:0,
						checked:true
					},
					{
						word:'已使用',
						number:0,
						checked:false
					},
					{
						word:'已过期',
						number:0,
						checked:false
					},
				],
				couponList:[],
				loading:true,
				params:{
					page:1
					// group:1
				}
	        };
	    },
	    onLoad(options){
				// this.getMyCoupon()
				this.getNumber(0)
				this.getNumber(1)
				this.getNumber(2)
	    },
		methods:{
			changeTab(item){
				console.log('changeTab---------',item);
				this.tabArray.forEach(each=>{
					each.checked=false
				})
				item.checked=true;
				this.couponList = [];
				this.params.page =  1;
				this.getMyCoupon()
			},
			// 用户获取自己的优惠券
			getMyCoupon(){
				let params={};
				let index='';
				this.loading=true;
				delete this.params.status;
				delete this.params.order_use;
				if(this.tabArray[0].checked){
					index=0;
				}else if(this.tabArray[1].checked){
					params.order_use=1;
					index=1;
				}else if(this.tabArray[2].checked){
					params.status=2;
					index=2;
				}
				params = Object.assign(this.params,params)
				this.$http.get(coupon.getMyList,params).then(res=>{
					if(res.rows.length>0){
						this.couponList = this.couponList.concat(res.rows);
						
					}
					if(this.params.page!=1&&res.rows.length==0){
						uni.showToast({ title: '无更多数据',icon: 'none'})
					}
					this.couponList.forEach(item => {
						item.money = item.money.split('.')[0];
						if(item.coupon_type=='2'){
							item.money = Math.floor(parseInt(item.money))/10;
						}
						item.st_time = item.st_time.split(' ')[0];
						item.end_time = item.end_time.split(' ')[0];
					})
					console.log('this.couponList---',this.couponList)
					this.loading=false;
				}).catch(err=>{})
			},
			getNumber(index){
				if(index==1){
					this.params.order_use = 1
				}else if(index==2){
					this.params.status = 2
				}
				this.$http.get(coupon.getMyList,this.params).then(res=>{
					this.tabArray[index].number=res.total_count;
					if(index==0){
						this.couponList=res.rows;
						this.couponList.forEach(item => {
							item.money = item.money.split('.')[0];
							if(item.coupon_type=='2'){
								item.money = Math.floor(parseInt(item.money))/10;
							}
							item.st_time = item.st_time.split(' ')[0];
							item.end_time = item.end_time.split(' ')[0];
						})
						this.loading=false;
					}
				}).catch(err=>{})
			},
			toUse(item){
				uni.navigateTo({
					url:"/pages/merchant/shop/shop?id="+item.uid+'&&name='+item.to_uid_name
				})
			}
		},
		onReachBottom: function() {
			this.params.page++;
			console.log('page============',this.params.page)
			this.getMyCoupon()
		},
	}
</script>
	
<style lang="scss" scoped>
.cou-contain{
	overflow-x: hidden;
	.head{
		height: 88rpx;
		background: pink;
		display: flex;
		align-items: center;
		font-size: 30rpx;
		justify-content: space-around;
		color: #333;
		background: #fff;
		margin-bottom: 20rpx;
		border-top: 1px solid #ebebeb;
		span{
			display: flex;
			align-items: center;
			height: 100%;
			padding: 0 6rpx;
			box-sizing: border-box;
		}
		.tab-active{
			color: #651fff;
			border-bottom: 2px solid #651fff;
		}
	}
	.coupon-wrap{
		padding: 0 15rpx;
		// box-sizing: border-box;
		.coupon{
			// border: 1px solid saddlebrown;
			height: 241rpx;
			width: 100%;
			.content{
				background-color: rgb(248,248,248);
				// background-image: url('../../static/coupon.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				// background: url('../../static/mydiscount.png') no-repeat 100% 100%;
				// position: absolute;
				// top: 0;
				width: 100%;
				height: 100%;
				// background: pink;
				// opacity: 0.3;
				display: flex;
				.content-left{
					flex: 7;
					// background: #789987;
					padding-bottom: 40rpx;
					padding-left: 40rpx;
					.type-date{
						// background: red;
						width: 80%;
						display: flex;
						height: 100%;
						flex-direction: column;
						justify-content: center;
						.type{
							margin-bottom: 20rpx;
							span{
								font-size: 26rpx;
							}
							span:first-child{
								color: #F31734;
							}
						}
						.date{
							font-size: 22rpx;
						}
						.fenge{
							margin: 0 10rpx;
						}
					}
				}
				.content-right{
					flex: 3;
					display: flex;
					flex-direction: column;
					// justify-content: center;
					// justify-content: space-around;
					align-items: center;
					// background: #369963;
					.price{
						font-size: 30rpx;
						color: #EA001F;
						// margin-bottom: 20rpx;
						padding-top: 20rpx;
						box-sizing: border-box;
						span{
							font-size: 50rpx;
						}
					}	
					.use-rule{
						font-size: 22rpx;
						margin-bottom: 20rpx;
						color: #F31734;
					}
					.btn{
						width: 128rpx;
						height: 48rpx;
						margin-bottom: 20rpx;
						background: #F31734;
						color: #fff;
						font-size: 26rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
		.coupon:last-child{
			margin-bottom: 30rpx;
		}
		.nodata{
			top: 90px!important;
			.empty-content{
				top: 88rpx;
			}
		}
		.used{
			.content{
				.content-left{
					.type-date{
						.type{
							span{
								color: #999;
							}
							span:first-child{
								color: #999;
							}
						}
						.date{
							color: #999;
						}
					}
				}
				.content-right{
					display: flex;
					flex-direction: column;
					justify-content: center;
					.price{
						color: #999;
						margin-bottom: 30rpx;
						span{
							color: #999;
						}
					}	
					.use-rule{
						color: #999;
					}
				}
			}
		}
	}
    // padding: 30rpx;
    // .list-item{
    //    width: 100%;

    // }
}
</style>
