import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from './store'
store.commit('update_isShowBindDialog', 0);


import Router from 'uni-simple-router'

import {
	http
} from './common/utils/lush';
Vue.prototype.$http = http;
// import IM from './common/utils/im'
// Vue.prototype.$IM = IM;


//禁用console.log输出
if(!global.consoleSwitch){
  //console.log = ()=>{}
}
store.commit('update_platform', uni.getSystemInfoSync().platform); //请求头



//支付宝小程序
//#ifdef MP-ALIPAY
import {
	alipay
} from './common/login/login'
//alipay();
//#endif


// #ifdef H5 
store.commit('update_origin', 'h5'); //请求头

// 导入极验
import './common/utils/gt.js'
Vue.prototype.$initGeet = window.initGeetest;

// h5 console调试
// import vConsole from 'vconsole' 
// Vue.prototype.$vConsole = new vConsole()

import wechatShare from './common/utils/wechatShare'
Vue.prototype.$wechatShare = wechatShare;

import fastclick from 'fastclick'
fastclick.attach(document.body)

//H5专用聊天,初始化AV对象
import {
	AV
} from './common/utils/av'
Vue.prototype.AV = AV

//H5用这个高德
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
	key: 'f95c3466594d19fa1c152220e0492fe4',
	plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geolocation', 'AMap.Marker',
		'AMap.Geocoder'
	],
	v: '1.4.15',
	uiVersion: '1.0.11'
});
//#endif



//引入公用接口方法
import * as common from './common/utils/common.js';
Vue.prototype.common = common;

import IM from './common/utils/im'
Vue.prototype.$IM = IM;

//引入工具方法
import * as util from './common/utils/util.js';
Vue.prototype.util = util;

//导入全局config变量
import * as config from './common/utils/config.js'
Vue.prototype.config = config;

// 监听消息发送
//util.listenMsg()

//导入全局组件，空白页面
import emptyShow from './components/empty-show/empty.vue';
Vue.component('empty-show', emptyShow);

// 引入iconfont图标样式
// 全局路由守卫
import './common/router/routerFilter'


Vue.use(Router)
Vue.prototype.$qiniuHost = config.qiniuHost;
Vue.prototype.$store = store;



Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
// #ifdef APP-PLUS

// import * as updateApp from './common/utils/updateApp.js'
// updateApp.androidCheckUpdate()
// #endif
export default app
