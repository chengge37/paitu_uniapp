<template>
	<view class="content">
		<!-- <uni-list class="list">
            <uni-list-item :title="item.name" v-for="(item,index) in categoryList" :key="index" @click="toCategory(item)"></uni-list-item>
        </uni-list>
		<div></div> -->
		<category-menu></category-menu>
	</view>
</template>

<script>
// import uniList from '@/components/uni-ui/uni-list/uni-list.vue'
// import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
// import Classify from '@/components/classify/classify.vue'
import categoryMenu from '@/components/categoryMenu/categoryMenu.vue'
//高德SDK
// #ifdef MP-WEIXIN
import amap from "@/common/SDK/amap-wx";
// #endif
// #ifdef H5
import { lazyAMapApiLoaderInstance } from "vue-amap";
// #endif
	export default {
		// components: {
		// 	uniList,uniListItem,
		// },
		components: {
			// Classify
			categoryMenu
		},
		computed:{
			
		},
		data() {
			return {
				city:{"id":"1212","city":"不限","code":"0","province":"不限","province_code":"441212"}
			}
		},
		
		onLoad() {
			console.log('category-----------------------------------');
		},
		methods: {
			//分类跳转
			toCategory(e) {
			//uni.showToast({title: e.name,icon:"none"});
			let params = {
				city: this.city
			};
			uni.navigateTo({
				// url: '../home/category/' + e.url+'?city='+JSON.stringify(this.city)
					url: "../home/category/" + e.url + "?options=" + JSON.stringify(params)
				});
			},
        }
    }
</script>

<style lang="scss">
.list{
    color: #333333;
    font-size: 16px;
}
</style>
