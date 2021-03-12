<template>
	<div class="contain">
		
        <div class="discussion" v-if="commentList.length>0">
			
			<div class="discuss-content" v-for="item in commentList" :key="item.id">
                <div class="user">
                    <div class="left">
                        <image class="user-img" :src="host+item.user_avatar"></image>
                        <p class="user-name">{{item.user_nick}}</p>
                    </div>
                    
                    <!-- <span class="iconfont icongengduo" @click="openPopup"></span> -->
                    <view style="width: 30%;">
                        <xfl-select 
                            :list="operates"
                            :clearable="false"
                            :showItemNum="5" 
                            :listShow="false" 
                            :style_Container="'height: 50px; font-size: 14px;'"
                            :placeholder = "'placeholder'"
                            :selectHideType="'hideAll'"
                            @change="operateChange($event,item)"
                        >
                        </xfl-select>
                    </view>
                </div>
                <div class="neirong">
                    <p class="text" v-if="item.content">{{item.content}}</p>
                    <p class="text" v-else>无评价内容</p>

                    <div class="picture" v-if="item.comment_pics.length>0">
                        <image class="comment-pics" :src="host+pic_item" v-for="(pic_item,index) in item.comment_pics" :key="index" mode="aspectFill"></image>
                    </div>

                    <p class="text" v-if="item.reply" style="margin-top:20rpx;"><span>追评内容：</span>{{item.reply}}</p>
                    <div class="goods" v-if="item.order_array">
                        <image class="goods-img" :src="host+item.order_array.pic" mode="aspectFill"></image>
                        <div class="info">
                            <p class="goods-name">
                                {{item.order_array.name}}
                            </p>
                            <p class="goods-price">
                                <span class="price">￥{{item.order_array.price}}</span>
                                <span class="grey">/小时</span>
                            </p>
                        </div>
                    </div>
                    <p class="date_reply">
                        <span class="date">{{item.create_time_str}}</span><span class="btn" @click="gotoOperate('2',item)" v-if="!item.reply">写追评</span>
                    </p>
                </div>
				<div>

				</div>
			</div>
		</div>
        <empty-show v-else></empty-show>
	</div>
	
    

</template>

<script>
import { comment } from '@/common/api/api';
import { Format } from '@/common/utils/formatDate.js';
import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
import xflSelect from "@/components/xfl-select/xfl-select.vue"
import {mapState} from 'vuex'
	export default {
	    data() {
	        return {
                host:this.$qiniuHost,
                operates:[
                    {value:'修改评论'},
                    {value:'删除评论'},
                ],
                commentList:[],
                params:{
                    page:1,
                    page_size:10,
                    uid:'',
                    is_order:1
                }
	        };
        },
        components:{
            uniPopup,xflSelect
        },
        computed:{
            ...mapState(['user'])
        },
	    onLoad(options){
            this.params.uid = this.user.paitume_user.id;
            this.getMyComments();
	    },
		methods:{
            getMyComments(){
				if(this.user.paitume_user === false){
					return
				}
                uni.showLoading({title: '加载中'});
                // setTimeout(function () {
                //     uni.hideLoading();
                // }, 2000);
                this.$http.get(comment.getList,this.params).then(res => {
                    if(res){
                        if(res.rows.length>0){
                            if(this.commentList.length>0){
                                this.commentList = this.commentList.concat(res.rows)
                            }else{
                                this.commentList = res.rows;
                            }
                        }else{
                            uni.showToast({title: '无更多评论数据了！',icon: 'none'});
                        }
                        
                        this.commentList.forEach(v=>{
                            v.create_time_str = Format.formatDateNoHouer(v.create_time*1000);
                            v.comment_pics = v.pic.split(',').filter(v=>{return v});
                            if(v.order_array&&v.order_array.pic){
                                let ret = v.order_array.pic.indexOf(',');
                                if(ret!=-1){
                                    v.order_array.pic = v.order_array.pic.split(',').filter(v=>{return v})[0];
                                }
                            }
                        });
                        uni.hideLoading();
                    }
                }).catch(err=>{
					uni.hideLoading();
				});
                
            },
            operateChange(e,data){
                console.log('eeee',e)
                let that = this;
                if(data.score>5){
                    // 2分以上算是好评
                    uni.showToast({title: '好评不能修改或删除！',icon: 'none'});
                }else{
                    if(e.newVal=='修改评论'){
                        // 跳转修改页面
                        if(data.is_edit=='1'){
                            uni.showToast({title: '评价只能修改一次！',icon: 'none'});
                        }else{
                            this.gotoOperate('1',data);
                        }
                    }else{
                        uni.showModal({
                            title: '删除提示',
                            content: '此操作将删除该评论，是否继续？',
                            success: function(res1) {
                                if (res1.confirm) {
                                    // 删除操作
                                    that.deleteComment(data.id);
                                } else if (res1.cancel) {
                                    console.log('用户点击取消');
                                }
                            }
                        });
                    }
                }
                
            },
            deleteComment(data){
                this.$http.post(comment.delComment,{id:data}).then(res => {
                    uni.showToast({title: '评价删除成功！',icon: 'success'});
                    setTimeout(()=> {
                        this.commentList = [];
                        this.params.page = 1;
                        this.getMyComments();
                    },1000)
                    
                }).catch(err=>{})
            },
            gotoOperate(type,data){
                uni.setStorage({key:'productInfo',data:data.order_array});
                uni.navigateTo({
                    url:'/pages/my/myList/comments/editOrAdd?type='+type+'&id='+data.id  //1修改2追评
                })
            }

        },
        onReachBottom:function(){
			this.params.page++;
			this.getMyComments()
		},
	}
</script>
	
<style lang="scss" scope>

.discussion{
	border-top: 1rpx solid #f8f8f8;
	color: #333333;
	
	.discuss-content{
        margin-bottom: 20rpx;
        padding-top: 20rpx;
        background-color: #ffffff;
		.user{
            display: flex;
            justify-content: space-between;
			align-items: center;
            padding: 0 35rpx;
            .left{
                display: flex;
			    align-items: center;
                .user-img{
                    width: 70rpx;
                    height: 70rpx;
                    border-radius: 40rpx;
                    margin-right: 20rpx;
                }
                .user-name{
                    font-size: 30rpx;
                    
                }
            }
			.icongengduo{
                color: #999999;
            }
        }
        .goods{
            display: flex;
            justify-content: space-between;
            background-color: #F8F8F8;
            margin: 30rpx 0;
            .goods-img{
                // flex:1;
                width:150rpx;
                height: 150rpx;
            }
            .info{
                padding: 20rpx 30rpx 0;
                // margin-left: 25rpx;
                flex: 2;
                .goods-name{
                    font-size: 28rpx;
                    color: #333333;
                }
                .price{
                    color: #333333;
                    font-size: 28rpx;
                    font-weight: bold;

                }
                .grey{
                    font-size: 24rpx;
                    color: #999999;
                }
            }
        }
		.neirong{
			font-size: 30rpx;
			margin-top: 10rpx;
			padding: 0 35rpx 35rpx 35rpx;
            .picture{
                display: flex;
                // justify-content: space-between;
                flex-wrap: wrap;
                margin-top: 20rpx;
                .comment-pics{
                    width: 210rpx;
                    height: 210rpx;
                    margin-right: 12rpx;
                    margin-bottom: 10rpx;
                }
            }
			.date_reply{
				display: flex;
				justify-content: space-between;
				margin-top: 10rpx;
				color: #999999;
                font-size: 26rpx;
				span{
					display: inline-block;
					
                }
                .text{
                    line-height: 60rpx;
                }
				.date{
					padding: 10rpx 0;
				}
				.btn{
                    color: #651FFF;
					padding: 8rpx 30rpx;
					border: 1px solid #651FFF;
				}
			}
		}
	}
}
.operate{
    background-color: #ffffff;
    font-size: 30rpx;
    padding: 20rpx;
    p{
        padding: 10rpx 30rpx;
        border-radius: 10rpx;
    }
    p:active{
        background-color: #f8f8f8;
    }
}
</style>
