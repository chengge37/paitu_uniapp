<template>
	<view class="contain">
		<div class="bind-phone">
            <p class="phone">手机号：</p>
            <div>
                <input type="text" class="phone-input" placeholder="请输入手机号码" />
            </div>
            <p class="tips">请确保手机号码填写无误，这是您的入场凭证</p>
        </div>

        <div class="confirm">
            确认
        </div>
	</view>
</template>

<script>
import {activity,question} from '@/common/api/api'
	export default {
		data() {
			return {
				
			}
		},
		onLoad(e){
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scope>
page{
    background-color: #ffffff;
}
.contain{
    padding: 40rpx;
}
.bind-phone{
    margin-bottom: 100rpx;
    .phone{
        font-size: 32rpx;
        font-weight: bold;

    }
    .phone-input{
        margin: 20rpx 0;
        border-bottom: 1px solid #999999;
        font-size: 28rpx;
    }
    .tips{
        font-size: 24rpx;
        color: #FF5600;
        width: 100%;
        text-align: right;
    }
}
.confirm{
    width: 100%;
    padding:20rpx 0;
    text-align: center;
    background-color: #651FFF;
    color: #ffffff;
    font-size: 32rpx;
}
</style>
