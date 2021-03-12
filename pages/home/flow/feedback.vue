<template>
	<div class="contain">
        <div class="step-content">
            <div class="second-step" >
                <div class="form-item">
                    <div class="title">
                        <span class="require">*</span>
                        反馈类型
                    </div>
                    <picker :range="typeList" @change="typeChange">
                        <view class="type-picker">
                            <span v-if="apply_form.type">{{apply_form.type}}</span>
                            <span v-else>请选择</span>
                            <span class="iconfont iconxiajiantou"></span>
                        </view>
                    </picker>
                    <div class="warn" v-if="warning.type">*{{warning.type}}</div>
                </div>
                <div class="form-item">
                    <div class="title">
                        <span class="require">*</span>
                        反馈内容
                    </div>
                    <textarea type="text" placeholder="请输入内容" v-model="apply_form.content" />
                    <div class="warn" v-if="warning.content">*{{warning.content}}</div>
                </div>
                <div class="form-item">
                    <div class="title">
                        <span class="require">*</span>
                        您的邮箱
                    </div>
                    <input type="text" placeholder="请输入电子邮箱" v-model="apply_form.email" />
                    <div class="warn" v-if="warning.email">*{{warning.email}}</div>
                </div>
                <div class="form-item">
                    <div class="title">上传图片</div>
                    <div class="image-box">
                        <div class="img" v-if="apply_form.pic">
                            <image class="image" :src="host+apply_form.pic"  mode="aspectFill"></image>
                            <div class="del" @click="delpic	">
                                <span class="iconfont iconpicture-delet"></span>
                            </div>
                        </div>
                        
                        <div class="upload" @click="uploadPic" v-if="!apply_form.pic">
                            <div>
                                <p class="iconfont icontupian"></p>
                                <p class="text">本地</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>


            <div class="nextstep-btn" @click="validForm">提交</div>
        </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { feedback } from '@/common/api/api'
import { uploadImg } from "@/common/utils/uploadImg.js"
import {
	promptLogin, promptBind
} from '@/common/login/login.js'
	export default {
        components:{
        },
        computed: {
            ...mapState(['user'])
		},
	    data() {
	        return {
                host:this.$qiniuHost,
                typeCurrent:0,
				apply_form:{
                    type:'',
                    content:'',
                    pic:'',
                    email:'',
                    uid:''
                },
                warning:{
                    type:'',
                    content:'',
                    pic:'',
                    email:'',
                },
                typeList:['提问咨询','产品建议','页面错误','其他建议']
	        };
	    },
	    onLoad(options){
            
        },
        onReady(){
            
        },
        onShow(){
            // #ifdef H5
			this.$wechatShare.share({  
				title:'意见反馈',
			    desc: '派图么意见反馈',  
			    img: this.$qiniuHost+'109-1578980959135.png' 
			});
			// #endif
        },
        mounted() {
            this.apply_form.uid = this.user.paitume_user.id;
        },
        onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			console.log(res.target)
			}
			return {
				title: '派图么意见反馈',
				path: '/pages/home/flow/feedback'
			}
		},
		methods:{
            typeChange(e){
                console.log('e---',e.detail);
                this.apply_form.type = this.typeList[e.detail.value]
            },
            uploadPic(){
                uploadImg().then(res => {
                    //#ifdef MP-WEIXIN
                    this.apply_form.pic	 = res.key;
                    //#endif
                    //#ifdef H5 || APP-PLUS
                    this.apply_form.pic	 = res;
                    //#endif
                })
            },
            delpic(){
                this.apply_form.pic	 = ''
            },
            validForm(){
                this.is_valid = true;
                if(!this.user.paitume_user.id){
                    // #ifdef H5 || APP-PLUS
                    promptLogin();
                    // #endif
                    // #ifdef MP-WEIXIN
                    promptBind()
                    // #endif
                }
                if(!this.apply_form.uid){
                }else{
                    
                }
                if(!this.apply_form.type){
                    this.warning.type = '反馈类型不能为空';
                    this.is_valid = false;
                }else{
                    this.warning.type = ''
                }
                if(!this.apply_form.content){
                    this.warning.content = '反馈内容不能为空';
                    this.is_valid = false;
                }else{
                    this.warning.content = ''
                }
                if(!this.apply_form.email||!/^[A-Za-z0-9\x80-\xff]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.apply_form.email)){
                    this.warning.email = '电子邮箱格式不正确';
                    this.is_valid = false;
                }else{
                    this.warning.email = ''
                }
                if(this.is_valid){
                     if(!this.apply_form.uid){
                        uni.showModal({title: '提示',content: '您未登录账号！',showCancel:false});
                    }else{
                        this.applyForm()
                    }
                    
                }else{
                    uni.showModal({title: '提示',content: '请确认资料填写合法无误！',showCancel:false});
                }
                
            },
			applyForm(){
                this.$http.post(feedback.sent,this.apply_form).then(res => {
                    uni.showToast({title: '提交反馈成功！',icon: 'success',duration:2000});
                    uni.navigateBack()
                }).catch(err => {
                   
				})
            },

            
		}
	}
</script>
	
<style lang="scss" scoped>
.contain{
    background-color: #ffffff;
    padding-top: 50rpx;
    height: 100%;
    // overflow-x: hidden;
}
.step-content{
    position: relative;
    .second-step{
        .form-item{
            padding: 0 35rpx;
            margin-bottom: 30rpx;
            .title{
                font-size: 30rpx;
                color: #333333;
                font-weight: bold;
                margin-bottom: 20rpx;
                .require{
                    color: #EA001F;
                    font-size: 30rpx;
                }
            }
            input,.type-picker,textarea{
                padding: 20rpx;
                font-size: 28rpx;
                background-color: #ffffff;
                color: #999999;
                border: 1rpx solid #D9D9D9;
                width: inherit;
                border-radius: 8rpx;
            }
            .warn{
                font-size: 22rpx;
                color: #F85D19;
                margin: 10rpx 0;
            }
            .type-picker{
                .iconfont{
                    float: right;
                }
                
            }
            .image-box{
                display: flex;
                .img{
                    position: relative;
                }
                .image{
                    margin-right: 20rpx;
                    width: 168rpx;
                    height: 168rpx;
                }
                .del{
                    position: absolute;
                    right: 20rpx;
                    bottom: 10rpx;
                    background-color: rgba(0, 0, 0, 0.5);
                    width:60rpx;
                    height: 60rpx;
                    line-height: 60rpx;
                    text-align: center;
                    color: #ffffff;
                }
                .upload{
                    width: 168rpx;
                    height: 168rpx;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: center;
                    color: #999999;
                    background-color: #ffffff;
                    justify-content: center;
                    border:1rpx solid #D9D9D9;
                    border-radius: 8rpx;
                    .iconfont{
                        font-size: 40rpx;
                    }
                    .text{
                        font-size: 24rpx;
                    }
                }
            }
            .gender {
                font-size: 28rpx;
                margin: 40rpx 0;
                width: 350rpx;
            }
            .radio {
                margin-right: 40rpx;
            }

        }
    }
    
    .nextstep-btn{
        position: fixed;
        bottom: 0;
        background-color: #651FFF;
        color: #ffffff;
        font-size: 32rpx;
        padding: 10rpx;
        text-align: center;
        border-radius: 4rpx;
        height: 85rpx;
        line-height: 85rpx;
        width: 100%;
    }
}
</style>
