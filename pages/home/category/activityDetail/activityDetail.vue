<template>
	<view class='content'>
		<div class="header">
			<image class="img" mode="aspectFill" :src="host+a_detail.pic" v-if="a_detail.pic"></image>
			<div v-else class="img nopic">暂无图片</div>
			<div class="right">
				<p class="title">{{a_detail.name}}</p>
				<p class="message">
					<span>报名人数：</span><span>{{a_detail.current_person}}/{{a_detail.max_person}}</span>
				</p>
				<!-- <p class="message">
					<span>费&emsp;&emsp;用：</span>
					<span class="price" v-if="a_detail.fee>0">￥{{a_detail.fee}}元 / 人</span>
					<span class="price" v-else>免费</span>
				</p> -->
				<div class="opr-btn">
					<div class="btn primary" @click="toCollect" v-if="!isCollected">
						<span class="iconfont iconshoucang1-copy"></span>
						<span>收藏</span>
					</div>
					<div class="btn collected" @click="toCollect" v-else>
						<span>已收藏</span>
					</div>

					<!-- <div class="btn primary" v-if="a_detail.user_order&&a_detail.user_order.id">
						<span class="baoming">您已报名</span>
					</div> -->
					<div class="btn primary" @click="baoming" >
						<span class="baoming" v-if="a_detail.is_start=='0'">立即报名</span>
						<span class="baoming" v-else>报名截至</span>
					</div>
					
				</div>
			</div>
		</div>
		<div class="act-info">
			<p class="info-content">
				<span class="info-title">活动时间：</span>
				<span class="info-detail">{{a_detail.start_time}} 至 {{a_detail.end_time}}</span>
			</p>
			<p class="info-content">
				<span class="info-title" style="letter-spacing:72rpx">地</span>
				<span class="info-title">址：</span>
				<span class="info-detail">{{a_detail.address}}</span>
			</p>
			<p class="info-content"  v-if="a_detail.user_detail.mobile!='18888888888'">
				<span class="info-title"  style="letter-spacing:20rpx">举</span>
				<span class="info-title"  style="letter-spacing:18rpx">办</span>
				<span class="info-title">方：</span>
				<span class="info-detail">{{a_detail.user_detail.nick}}</span>
			</p>
			<p class="info-content" v-if="a_detail.user_detail.mobile!='18888888888'">
				<span class="info-title"  style="letter-spacing:72rpx">费</span>
				<span class="info-title">用：</span>
				<span class="info-price" v-if="a_detail.fee>0">￥{{a_detail.fee}}</span>
				<span class="info-detail" v-else>免费</span>
			</p>
			<p class="info-content" v-if="a_detail.user_detail.mobile!='18888888888'">
				<span class="info-title"  style="letter-spacing:72rpx">电</span>
				<span class="info-title">话：</span>
				<span class="info-detail">{{a_detail.user_detail.mobile}}</span>
			</p>
		</div>

		<div class="act-detail">
			<div class="detail-title">
				活动详情
			</div>
			<div class="detail-content" v-html="a_detail.info">
			</div>

			<div class="detail-title">
				地理位置
			</div>
			<p class="de-address">地址：{{a_detail.address}}</p>
			<map @updated="mapUpdate" style="width: 100%; height: 300px;"  :latitude="a_detail.lat" :longitude="a_detail.lng" :markers="covers">
            </map>
		</div>
		
		<div class="discussion" id="discussion">
			<div class="discuss-title-line" :class="fixed_top?'discuss-fixed-top':'discuss-fixed-bottom'" @click="toScollTop">
				<div class="discuss-title">
					<span>讨论区</span>
					<span class="border"></span>
				</div>
			</div>
			<div v-if="discussion.length>0">
				<div class="discuss-content" v-for="item in discussion" :key="item.id" >
					<div @click="gotoQuestionDetail(item)">
						<div class="user">
							<image class="user-img" :src="util.avatarUtil(item.uid_avatar)"></image>
							<p class="user-name">{{item.uid_nick}}</p>
						</div>

						<div class="neirong">
							<p class="text">{{item.content}}</p>
							<p class="date_reply">
								<span class="date">{{item.time_str}}</span><span class="btn">回复 {{item.children.length}}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="nodata">
				该活动还没有人讨论哦，快来发起讨论！
			</div>
			<div class="reply">
				<input type="text" placeholder="输入提问内容" class="reply-input" v-model="content">
				<div class="reply-btn" @click="sent">发送</div>
			</div>
		</div>
	</view>
</template>

<script>
import {activity,question} from '@/common/api/api'
import {Format} from '../../../../common/utils/formatDate.js'
import { qiniuHost } from '@/common/utils/config';
import { getUserLsObj,collectOther } from '@/common/utils/collect';
import {mapState} from 'vuex'
	export default {
		data() {
			return {
				host:qiniuHost,
				a_id:'',
				a_detail:{
					user_detail:{}
				},
				q_param:{
					page:1,
					page_size:10,
					type:3,
					relation_id:''
				},
				discussion:[],
				covers: [{
					latitude: 0.0000,
					longitude: 0.0000,
					callout:{
					    content:'地点',
					    color:'#F76350',
					    fontSize:12
					}
				}],
				content:'',
				fixed_top:false,
				distance:0,
				windowHeight:0,
				isCollected:false
			}
		},
		computed: {
			...mapState(['user']),
		},
		watch:{
			a_detail(val){
				if(val.id){
					// #ifdef H5
					this.$wechatShare.share({  
						title:this.a_detail.name,
						desc: this.a_detail.user_detail.nick + '店铺活动',  
						img: this.host+this.a_detail.pic
					});
					// #endif
				}
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: this.a_detail.name,
				path: '/pages/home/category/activityDetail/activityDetail?activity_id='+this.a_id
			}
		},
		onLoad(e){
			this.a_id = e.activity_id;
			this.q_param.relation_id = e.activity_id;
			this.getActivityDetail();
			this.getQuestions();
			uni.setNavigationBarTitle({
				title: e.name
			});
			if(this.user&&this.user.paitume_user){
				getUserLsObj(this.q_param.relation_id,3,1).then(res=>{
				this.isCollected=res});
			}
		},
		mounted(){
			
		},
		onPageScroll:function(e){
			console.log('e.scrollTop',e.scrollTop)
			this.getHeight();
		},
		methods: {
			toCollect(){
				collectOther(this.a_detail.uid,3,1,this.a_id).then(res => {
					this.isCollected = res;
				})
			},
			getHeight(){
				let _this=this;
				uni.getSystemInfo({
					success:(resu)=>{
						this.windowHeight=resu.windowHeight;
						const query = uni.createSelectorQuery()
						query.select('#discussion').boundingClientRect()
						query.selectViewport().scrollOffset()
						query.exec((res)=>{
							let top=res[0].top;
							if(top<=this.windowHeight){
								 _this.fixed_top=true;
							}else{
								_this.fixed_top=false;
							}
							console.log('打印demo的元素的信息',res);
						})
					},
					fail:(res)=>{}
				})
			},
			toScollTop(){
				if(!this.fixed_top ){
					this.fixed_top = true;
					this.getDistance().then(res => {
						console.log("节点离页面顶部的距离为" + res.top);
						uni.pageScrollTo({
							scrollTop: res.top,
							duration: 500
						});
					})
				}
				
			},
			getDistance(){
				const query = uni.createSelectorQuery().in(this);
				return new Promise((resolve,reject)=>{
					query.select('#discussion').boundingClientRect(data => {
						this.distance = data;
						resolve(data);
					}).exec();
				})
				
			},
			mapUpdate(){
				//h5不触发?
				console.log('地图初始化');
			},
			
			getActivityDetail(){
				let params = {id:this.a_id};
				if(this.user.paitume_user&&this.user.paitume_user.id){
					params = Object.assign(params,{uid:this.user.paitume_user.id})
				}
				this.$http.get(activity.getDetail,params).then(res => {
					this.a_detail = res;
					this.a_detail.start_time = this.a_detail.start_time.split(' ')[0];
					this.a_detail.end_time = this.a_detail.end_time.split(' ')[0];
					this.a_detail.info = this.a_detail.info.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
					this.covers.forEach(v =>{
						v.latitude=this.a_detail.lat;
						v.longitude=this.a_detail.lng;
						v.callout.content = this.a_detail.address;
					});
					console.log('this.covers = ',this.covers);
				})
			},
			getQuestions(){
				this.$http.get(question.getList,this.q_param).then(res => {
					console.log('question',res);
					this.discussion = res.rows;
					this.discussion.forEach(item => {
						item.time_str = Format.formatDateNoHouer(item.create_time*1000);
					});
				})
			},
			baoming(){
				if(this.a_detail.is_start=='0'){
					uni.setStorage({key: 'activityApply',data: this.a_detail});
					uni.navigateTo({
						url: '../../../order/activity/comfirmOrder'
					});
				}
				
			},
			gotoQuestionDetail(data){
				uni.setStorage({key: 'questionDetail',data: data});
				this.$Router.push('/pages/home/category/activityDetail/questionDetail');
			},
			sent(){
				let params = {
					to_uid:this.a_detail.uid,
					content:this.content,
					type:3,
					relation_id:this.q_param.relation_id
				}
				console.log('params====',params)
				this.$http.post(question.addQuestion,params).then(res => {
					if(!res){
						uni.showModal({
							title: '错误提示',
							content: '未知错误',
							success: function (res1) {
								if (res1.confirm) {
								} else if (res1.cancel) {
								}
							}
						});
						
					}else{
						uni.showModal({
							title: '提示',
							content: '您的回复已成功发送，审核通过之后方可显示',
							success: function (res1) {
								if (res1.confirm) {
								} else if (res1.cancel) {
								}
							}
						});
					}
					this.content = ''
				})
			}
		}
	}
</script>

<style lang="scss" scope>
.content{
	overflow-x:hidden;
}
.header{
	display: flex;
	// align-items: center;
	padding: 30rpx;
	background-color: #ffffff;
	.img{
		width: 300rpx;
		height: 220rpx;
	}
	.nopic{
		background-color: #f8f8f8;
		font-size: 26rpx;
		text-align: center;
		line-height: 220rpx;
	}
	.right{
		margin-left: 30rpx;
		display: flex;
		flex-wrap: wrap;
		flex:1;
		align-content: space-between;
		p{
			margin-bottom: 10rpx;
		}
		.title{
			font-weight: bold;
			color: #333333;
			width: 100%;
			font-size: 32rpx;
			line-height: 50rpx;
			margin-top: -10rpx;
		}
		.message{
			font-size: 24rpx;
			color: #666666;
			.price{
				color:#DB1522;
				font-weight: bold;
			}
		}
		.opr-btn{
			display: flex;
			justify-content: space-between;
			width:100%;
			.btn{
				display: inline-block;
				width:165rpx;
				height: 60rpx;
				line-height: 60rpx;
				color: #ffffff;
				
				text-align: center;
				font-size: 28rpx;
				border-radius: 8rpx;
				.iconshoucang1-copy{
					margin-right: 10rpx;
				}
			}
			.primary{
				background-color: #651FFF;
			}
			.collected{
				background-color: #f0f0f0;
				color: #333333;
			}
		}

	}
}
.act-info{
	font-size: 32rpx;
	color: #333333;
	padding: 30rpx;
	background-color: #ffffff;
	.info-content{
		display: flex;
		margin-bottom: 20rpx;
		line-height: 60rpx;
		span{
			display: inline-block;
		}
		.info-title{
			// width: 150rpx;
			white-space: nowrap;
			text-align:left;
			color: #666666;
			font-weight: bold;
			font-size: 36rpx;
		}
		.info-detail{
			font-size: 30rpx;
			color: #333333;
		}
		.info-price{
			color: #EA001F;
			font-size: 36rpx;
			font-weight: bold;
		}
		.info-price::after{
			content: '/每人';
			font-size: 24rpx;
			color: #333333;
			font-weight: 400;
		}
	}
}
.act-detail{
	padding: 0 30rpx 30rpx;
	background-color: #ffffff;
	color: #333333;
	.detail-title{
		font-weight: bold;
		margin-bottom: 30rpx;
		font-size: 36rpx;
	}
	.detail-content{
		font-size: 30rpx;
		line-height: 50rpx;
		margin-bottom: 30rpx;
	}
	.de-address{
		margin-bottom: 20rpx;
		line-height: 50rpx;
		font-size: 30rpx;
	}
}
.discuss-title-line{
	padding-bottom: 10rpx;
	background-color: #ffffff;
	width:100%;
	.discuss-title{
		position: relative;
		padding: 30rpx;
		font-size: 32rpx;
		border-bottom: 1px solid #f8f8f8;
		.border{
			display: block;
			position: absolute;
			bottom: 0;
			width:50rpx;
			height: 6rpx;
			background-color: #651FFF;
		}
	}
}
.discuss-fixed-bottom{
	position: fixed;
	bottom: 0;
}
.discuss-fixed-top{
	
}
.discussion{
	
	background-color: #ffffff;
	color: #333333;
	
	.discuss-content{
		border-bottom: 10rpx solid #f8f8f8;
		.user{
			display: flex;
			align-items: center;
			padding-left: 30rpx;
			padding-top: 30rpx;
			.user-img{
				width: 70rpx;
				height: 70rpx;
				border-radius: 40rpx;
				margin-right: 20rpx;
			}
			.user-name{
				font-size: 28rpx;
				
			}
		}
		.neirong{
			font-size: 28rpx;
			margin-left: 90rpx;
			margin-top: 10rpx;
			padding: 0 50rpx 30rpx 30rpx;
			.date_reply{
				display: flex;
				justify-content: space-between;
				margin-top: 10rpx;
				color: #999999;
				span{
					display: inline-block;
					
				}
				.date{
					padding: 10rpx 0;
				}
				.btn{
					padding: 10rpx 50rpx;
					border: 1px solid #999999;
				}
			}
		}
	}
	.nodata{
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color:#999999;
		margin: 10rpx 0;
	}
	
}
.reply{
    background-color: #ffffff;
    
    width: 100%;
    display: flex;
    justify-content: space-between;
    .reply-input{
        flex:4;
        margin: 20rpx 40rpx;
        padding: 0rpx 30rpx;
		height: 70rpx;
		line-height: 70rpx;
        background-color: #f8f8f8;
        font-size: 28rpx;
        ::placeholder{
            color: #999999;
            
        }
    }
    .reply-btn{
        margin:20rpx 40rpx ;
        flex:1;
        padding: 0rpx 30rpx;
		height: 70rpx;
		line-height: 70rpx;
        text-align:center;
        font-size: 28rpx;
        color: #ffffff;
        background-color: #651FFF;
    }
}
</style>
