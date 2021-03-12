<template>
	<div class="contain">
		<view class="list">
			<view class="list-item" v-for="(item, index) in list" :key="index" @click="toMyList(item.direction)">
				<span class="iconfont icon" :class="item.icon"></span>
				<text>{{item.name}}</text>
				<text class="iconfont iconyoujiantou next"></text>
			</view>
		</view>
	</div>
	
    

</template>

<script>
	export default {
	    data() {
	        return {
                host:this.$qiniuHost,
                list: [{
						name: '商家入驻',
						icon: 'iconruzhu',
						next: true,
						direction: 'myShop'
					},
					{
						name: '商家产品',
						icon: 'iconchanpin',
						next: true,
						direction: 'myAdvertise'
					},
				],
                
	        };
        },
        components:{
        },
        computed:{
        },
	    onLoad(options){
           
	    },
		methods:{
            toMyList(e) {
				this.$Router.push('/pages/my/myList/' + e)
			},

        },
	}
</script>
	
<style lang="scss" scope>
.list {
    margin-top: 20rpx;
    color: rgb(51, 51, 51);
    font-size: 30rpx;
    background-color: #ffffff;

    .list-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #f8f8f8;
        background-color: rgb(255, 255, 255);
        height: 100rpx;
        line-height: 85rpx;
        padding: 0 40rpx;

        .icon {
            margin-right: 30rpx;
            color:#651FFF;
            font-size:26px;
        }

        .next {
            flex: 1;
            text-align: right;
        }
        .contectBtn{
            background-color: #ffffff;
            font-size: 30rpx;
            margin: 0;
            padding: 0;
            width: 100%;
            border: 0;
            text-align: left;
        }
        button::after {
            background-color: transparent;
            outline: none;
            border: 0;
        }
        

    }
}
</style>
