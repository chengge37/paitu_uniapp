<template>
	<view class="body">
		<div class="top-ques">
			关于“{{product_name}}”的<span class="count">{{questionList.length}}</span>个问题<span></span>
		</div>
		<div class="question-content">
			<div class="question-item" @click="gotoDetail(item)" v-for="item in questionList" :key="item.id">
				<div class="line question">
					<span class="qus">Q</span>
					<span class="text">{{item.content}}</span>
				</div>
				<div class="line answer">
					<span class="ans">A</span>
					<span class="text" v-if="item.children.length>0">{{item.children[0].content}}</span>
					<span class="text" v-else>暂无回答</span>
				</div>

				<div class="dateOrCount">
					<span class="date">{{item.create_time_str}}</span>
					<span class="count">全部{{item.children.length}}个回答</span>
				</div>
			</div>
		</div>

		<div class="reply">
            <input type="text" placeholder="向已购买用户提问" class="reply-input" v-model="ask_params.content">
            <div class="reply-btn" @click="ask">提问</div>
        </div>
	</view>
</template>

<script>
import { question } from '@/common/api/api';
import { Format } from '@/common/utils/formatDate.js';
	export default {
		data() {
			return {
				product_name:'',
				params:{
					page:1,
					page_size:10,
				},
				ask_params:{
					to_uid:'',
					content:'',
				},
				type:'',//1（影棚）或2（设备） 3活动
				relation_id:'',//影棚or设备ID
				questionList:[],
				pic:''
			};
		},
		onLoad(e){
			this.relation_id = e.relation_id;
			this.type = e.type;
			this.ask_params.to_uid = e.shop_id;
			this.product_name = e.product_name;
			this.pic = e.pic;
			this.getQuestions()
		},
        methods: {
            gotoDetail(data){
				uni.setStorage({key: 'questionDetail',data:data});
				console.log('item',data)
				uni.navigateTo({
					url:"/pages/home/category/comQues/questionDetail?product_name="+this.product_name+'&pic='+this.pic+'&type='+this.type
				})
			},
			getQuestions(){
				let param = Object.assign(this.params,{relation_id:this.relation_id,type:this.type});
				this.$http.get(question.getList,param).then(res => {
					this.questionList = res.rows;
					this.questionList.forEach(item => {
						item.create_time_str =  Format.formatDateNoHouer(item.create_time*1000);
					})
				}).catch(err=>{
					
				});
			},
			ask(){
				let param = Object.assign(this.ask_params,{relation_id:this.relation_id,type:this.type});
				this.$http.post(question.addQuestion,param).then(res => {
					if(res){
						uni.showModal({
							title: '提示',
							content: '您的问题已成功发送，审核通过之后方可显示',
							showCancel:false,
							success: function (res1) {}
						});
						
					} 
					this.ask_params.content = ''
				}).catch(err=>{
					
				});
			}
        },
	}
</script>

<style lang="scss">
.top-ques{
	padding: 20rpx 30rpx;
	background-color: #ffffff;
	font-size: 32rpx;
	margin-bottom: 20rpx;
	border-top: 1rpx solid #f8f8f8;
	.count{
		color: #651FFF;
	}
}
.question-content{
	
	.question-item{
		padding: 30rpx;
		background-color: #ffffff;
		margin-bottom: 20rpx;
		.line{
			margin-bottom: 30rpx;
			.qus,.ans{
				display: inline-block;
				width:40rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				color: #ffffff;
				font-size: 28rpx;
				margin-right: 20rpx;
			}
			.qus{
				background-color: #EA001F;
			}
			.ans{
				background-color: #651FFF;
			}
			.text{
				font-size: 28rpx;
			}
		}
		.dateOrCount{
			font-size: 24rpx;
			color: #999999;
			display: flex;
			justify-content: space-between;
			span{
				display: inline-block;

			}
		}
		
	}
}
.reply{
    background-color: #ffffff;
    position: fixed;
    bottom: 0rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .reply-input{
        flex:4;
        margin: 20rpx 40rpx;
        padding: 15rpx 30rpx;
        background-color: #f8f8f8;
        font-size: 28rpx;
        ::placeholder{
            color: #999999;
            
        }
    }
    .reply-btn{
        margin:20rpx 40rpx 20rpx 0;
        flex:1;
        padding: 15rpx 30rpx;
        text-align:center;
        font-size: 28rpx;
        height: 52rpx;
        line-height: 52rpx;
        color: #ffffff;
        background-color: #651FFF;
    }
}
</style>