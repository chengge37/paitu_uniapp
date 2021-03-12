<template>
	<view class="contain">
		<div class="nav-tab">
			<p class="tab-name" v-for="(item,index) in tabList" :key="index" :class="item.active?'active':''" @click="navPick(item.name)">{{item.name}}</p>
		</div>

		<div  v-if="collections.length>0" class="list-content">
			<div class="studio-content" v-if="tab==2||tab==1 ||tab==4">
				
				<div class="line1">
					<p class="left">共{{total_count}}件商品</p>
					<p class="right" @click="edit" v-if="collections.length>0">
						<span v-if="!isEdit">管理</span><span v-else>完成</span>
					</p>
				</div>
				
				<div class="goods"  v-for="(item,index) in collections" :key="index" @click="gotoItem(item)">
					<p v-if="isEdit" v-on:click.stop="select(item.id)" >
						<span class="select" v-if="!item.is_select"></span>
						<span class="iconfont iconchenggong" v-else></span>
					</p>
					<image class="goods-img" :src="host + util.picExplode(item.img)" v-if="tab==2||tab==1"></image>
					<image class="goods-img" :src="host + util.picExplode(item.photo)" v-if="tab==4"></image>
					<div class="info">
						<div class="goods-name">
							<span v-text="item.name?item.name:'暂无标题'"></span>
						</div>
						<div class="goods-price">
							<p  v-if="tab==2||tab==1">
								<span class="price" >￥{{item.price}}</span>
								<span class="hour">/小时</span>
							</p>
							<p v-if="tab==4">
								<span class="price">￥{{item.ppd}}</span>
								<span class="hour">/天</span>
							</p>
							<p class="deal"  v-if="tab==2||tab==1">
								<span>评分：{{item.score}}</span>
							</p>
						</div>
					</div>
				</div>
				
				
			</div>

			<div class="equip-content" v-if="tab==0||tab==3">
				<div class="line1">
					<p class="left" v-if="tab==0">共{{total_count}}家店铺</p>
					<p class="left" v-else>共{{total_count}}个活动</p>
					<p class="right" @click="edit" v-if="collections.length>0">
						<span v-if="!isEdit">管理</span><span v-else>完成</span>
					</p>
				</div>
				<div class="goods" v-for="(item,index) in collections" :key="index" @click="gotoItem(item)">

					<p v-if="isEdit" v-on:click.stop="select(item.id)">
						<span class="select" v-if="!item.is_select"></span>
						<span class="iconfont iconchenggong" v-else></span>
					</p>
					<image class="goods-img" :src="tab==3?host+item.pic:util.shopAvatarUtil(item.avatar)"></image>
					<div class="info">
						
						<p class="goods-name">
							<span v-if="tab==0">{{item.nick}}</span><span v-if="tab==3">{{item.name}}</span>
						</p>
						<p class="types" v-if="tab==0">
							<span class="type-item" v-if="item.count_stuido>0">影棚</span>
							<span class="type-item" v-if="item.count_equip>0">器材</span>
						</p>
						<p class="status" v-if="tab==3">
							<span class="starting" v-if="item.status=='进行中'">{{item.status}}</span>
							<span class="notstart" v-if="item.status=='即将开始'">即将开始</span>
							<span class="end" v-if="item.status=='已结束'">已结束</span>
						</p>
					</div>
				</div>
			</div>
		</div>
		
		<empty-show type='collection' v-if="collections.length==0&&!loading" hasMenu='1'></empty-show>
		
		<div class="footer" v-if="isEdit">
            <div class="select" @click="selectAllItem">
                <span class="select1" v-if="!allSelect"></span>
				<span class="iconfont iconchenggong" v-else></span>
                <span class="text">全选</span>
            </div>
            <div class="right">
                <p class="cancel" @click="cancelCollect">取消收藏</p>
            </div>
        </div>
	</view>
</template>

<script>
import { collectOrFollow } from '@/common/api/api'
	export default {
		data() {
			//阻止元素发生默认的行为
			const _stop = (e) => e.preventDefault()
			return {
				
				host:this.$qiniuHost,
				tabList:[
					{name:'影棚',active:true,type:1},
					{name:'器材',active:false,type:2},
					{name:'店铺',active:false,type:0},
					{name:'模特',active:false,type:4},
					{name:'服务',active:false,type:5},
					// {name:'活动',active:false,type:3},
				],
				loading:false,
				isEdit:false,
				isSelect:false,
				allSelect:false,
				tab:1,
				params:{
					page:1,
					page_size:10,
					obj:1,
					type:1,
					isAutoMsg:1,
				},
				collections:[],
				total_count:0,
				options: [{
					text: '取消',
					style: {
						backgroundColor: '#651FFF'
					}
				}, {
					text: '确认',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				relation_str:'',
				ids:[]
			}
		},
		components:{
		},
		onLoad:function(e){
			this.tab = this.params.type = e.type;
			this.tabList.forEach(v => {
				if(v.type==e.type){
					v.active = true;
				}else{
					v.active = false;
				}
			})
			this.getMyCollection();
		},
		methods: {
			navPick(data){
				console.log('data===',data)
				this.tabList.forEach(item => {
					if(item.name==data){
						item.active = true;
						this.collections = [];
						this.tab = item.type;
						this.params.type = item.type;
						this.getMyCollection();
					}else{
						item.active = false;
					}
				})
			},
			edit(){
				this.isEdit = !this.isEdit;
			},
			select(id){
				let ret = this.collections.findIndex(e => e.id==id);
				console.log('select-----------res-------',this.collections,ret);
				let ids = [];
				if(ret!=-1){
					this.collections[ret].is_select = !this.collections[ret].is_select;
					// 修改数组列表里的数据视图没有及时刷新，操作一下数组就好了
					let arr = this.collections[ret]; 
					this.collections.splice(ret,1,arr);
					// 若上面全勾选了，底部的全选也勾上
					if (this.collections.every(v => v.is_select===true)){
						this.allSelect = true
					}else{
						this.allSelect = false;
					}
				}
				this.collections.forEach(item =>{
					if(item.is_select){
						ids.push(item.id);
					}
				});
				this.relation_str = JSON.stringify(ids)
				
			},
			getMyCollection(){
				uni.showLoading({title: '加载中'});
				this.loading = true;
				this.$http.get(collectOrFollow.getCollectOrFollowList,this.params).then(res => {
					this.collections = res.result;
					console.log('this.collections---------------',this.collections);
					this.collections.forEach(v => {
						if(this.tab==1||this.tab==2){
							v.img = v.pic.split(',').filter(v=>{return v})[0];
						}
						v.is_select = false;
						if((Date.now()-new Date(v.start_time))<0){
							v.status = '即将开始'
						}else if((Date.now()-new Date(v.end_time))>0){
							v.status = '已结束'
						}
						else if((Date.now()-new Date(v.end_time))<0){
							v.status = '进行中'
						}
					});
					this.total_count = res.count;
					uni.hideLoading();
					this.loading = false;
				}).catch(err=>{
					uni.hideLoading();
					this.loading = false;
				})
			},
			selectAllItem(){
				this.allSelect = !this.allSelect;
				console.log('this.allSelect------------',this.allSelect);
				let ids=[];
				this.collections.forEach(item =>{
					if(this.allSelect){
						item.is_select=true;
						ids.push(item.id);
					}else{
						item.is_select=false;
					}
				});
				
				this.relation_str = JSON.stringify(ids)
			},
			cancelCollect(){
				let params = {type:this.tab,obj:1,relation_str:this.relation_str}
				let msg = '';
				if(this.tab==0){msg = '店铺'}
				else if(this.tab==1){msg='影棚'}
				else if(this.tab==2){msg='设备'}
				else if(this.tab==3){msg='活动'}
				uni.showModal({
					title: '取消收藏提示',
					content: '你将取消收藏'+msg,
					success: (res) => {
						if (res.confirm) {
							this.$http.post(collectOrFollow.unCollectOrFollowBatch,params).then(res => {
								this.isEdit = false;
								this.getMyCollection();
							}).catch(err=>{})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			gotoItem(data){
				if(this.tab==0){
					uni.navigateTo({url:'/pages/merchant/shop/shop?id='+data.id})
				}else if(this.tab==1){
					uni.navigateTo({url:'/pages/home/category/studioDetail/studioDetail?studio_id='+data.id})
				}else if(this.tab==2){
					uni.navigateTo({url:'/pages/home/category/equipmentDetail/equipmentDetail?equip_id='+data.id})
				}else if(this.tab==3){
					if(data.status = '已结束'){
						uni.showToast({title:'活动已结束',icon:"none",duration:1000});
					}else{
						uni.navigateTo({url:'/pages/home/category/activityDetail/activityDetail?activity_id='+data.id})
					}
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>

/*  #ifdef  H5  */
	.list-content{
		background-color: #f8f8f8;
		padding-bottom:1rpx;
	}
/*  #endif  */

.nav-tab{
	padding: 0rpx 30rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-around;
	border-top: 1px solid #f8f8f8;
	
	.tab-name{
		display: inline-block;
		padding: 30rpx;
		font-size: 32rpx;
	}
	.active{
		color: #651FFF;
		border-bottom: 4rpx solid #651FFF;
	}
}
.line1{
	font-size: 26rpx;
	display: flex;
	justify-content: space-between;
	padding: 30rpx;
	.left{
		color: #999999;
	}
	.right{
		color: #EA001F;
	}
}

.goods{
	display: flex;
	justify-content: space-between;
	padding: 30rpx ;
	margin-bottom: 20rpx;
	background-color: #ffffff;
	// align-items: center;
	.goods-img{
		// flex:1;
		width:180rpx;
		height: 180rpx;
		// height: auto;
		
	}
	.select{
		display: inline-block;
		width: 45rpx;
		height: 45rpx;
		border-radius: 30rpx;
		border:1px solid #d9d9d9;
		margin-right: 20rpx;
		margin-top: 65rpx;
	}
	.iconchenggong{
		font-size: 50rpx;
		color: #651FFF;
		display: inline-block;
		margin-right: 18rpx;
		margin-top: 60rpx;
	}
	
	.info{
		// padding: 20rpx 30rpx 0;
		margin-left: 25rpx;
		flex: 2;
		display: flex;
		flex-direction: column;
		align-content: space-between;
		
		.goods-name{
			font-size: 30rpx;
			color: #333333;
			// line-height: 45rpx;
			overflow:hidden; 
			text-overflow:ellipsis;
			display:-webkit-box; 
			-webkit-box-orient:vertical;
			-webkit-line-clamp:2; 
			height: 50%;
			
		}
		.goods-price{
			// margin-top: 35rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			height: 50%;
			vertical-align: bottom;
		}
		.price{
			color: #EA001F;
			font-size: 28rpx;
			font-weight: bold;

		}
		.hour{
			font-size: 24rpx;
			color: #333333;
		}
		.deal{
			font-size: 24rpx;
			color: #999999;
		}
	}
	
	.types{
		padding: 10rpx 0;
		.type-item{
			padding: 5rpx 20rpx;
			border: 1px solid #651FFF;
			color: #651FFF;
			border-radius: 5px;
			font-size: 24rpx;
			margin-right: 10rpx;
		}
	}
	.status{
		font-size: 26rpx;
		padding-top: 20rpx;
		.starting{
			color: #EA001F;
		}
		.notstart{
			color: #FF5600;
		}
		.end{
			color: #999999
		}
	}
	
}
.studio-content{
	
	
}
.footer{
    position: fixed;
    bottom: 0rpx;
    display: flex;
    justify-content: space-between;
	align-items: center;
    background-color: #ffffff;
    border: 1px solid #f8f8f8;
    width: 100%;
    font-size: 16px;
    span{
        // padding: 30rpx;
        display: inline-block;

    }
    .select{
        // flex-grow: 1; 
        padding: 30rpx 30rpx 20rpx;
		display: flex;
		align-items: center;
        .select1{
            // width: 45rpx;
            // height: 45rpx;
            border: 1px solid #d9d9d9;
            border-radius: 45rpx;
            padding: 23rpx;
            // margin: 0px 10rpx;
            // display: block;
        }
		.iconchenggong{
			font-size: 50rpx;
			color: #651FFF;
			display: inline-block;
		}
        .text{
            // padding-bottom:10rpx;
            display: inline-block;
            bottom: 5rpx;
            left: 30rpx;
            position: relative;
        }
    }
    .right{
        // flex-grow: 1;
    }
    .cancel{
        padding:30rpx;
        background-color: #EA001F;
        color:#ffffff;
        width: 160rpx;
        text-align: center;
    }
}
</style>
