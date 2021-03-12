<script>  


export default {
	
	onLaunch: function() {
		// console.warn('App Launch');
		uni.setStorageSync('socket_ing', false);
		// #ifdef MP-WEIXIN
		const updateManager = uni.getUpdateManager()
		updateManager.onCheckForUpdate(function (res) {
			console.warn('App Launch--hasUpdate',res.hasUpdate);
			if (res.hasUpdate) {
				console.warn('App Launch--updateManager');
				updateManager.onUpdateReady(function () {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success: function (res) {
							if (res.confirm) {
								updateManager.applyUpdate()
							}
						}
					})
				})
				updateManager.onUpdateFailed(function () {
					uni.showModal({
						title: '已经有新版本了哟~',
						content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
					})
				})
			}
		})
		
		// if (uni.canIUse('getUpdateManager')) {
		// 	console.warn('App Launch---canIUse');
		// 	const updateManager = uni.getUpdateManager()
		// 	updateManager.onCheckForUpdate(function (res) {
		// 		if (res.hasUpdate) {
		// 			console.warn('App Launch',updateManager);
		// 			updateManager.onUpdateReady(function () {
		// 				uni.showModal({
		// 					title: '更新提示',
		// 					content: '新版本已经准备好，是否重启应用？',
		// 					success: function (res) {
		// 						if (res.confirm) {
		// 							updateManager.applyUpdate()
		// 						}
		// 					}
		// 				})
		// 			})
		// 			updateManager.onUpdateFailed(function () {
		// 				uni.showModal({
		// 					title: '已经有新版本了哟~',
		// 					content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
		// 				})
		// 			})
		// 		}
		// 	})
		// } else {
		// 	uni.showModal({
		// 		title: '提示',
		// 		content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
		// 	})
		// }
		// #endif
		   // #ifdef APP-PLUS  
		        const _self = this;  
		        const _handleClick = function(message) {  
		            // TODO  
					 console.error('收到消息1'+JSON.stringify(message))
					uni.showModal({
						title: '提示1',
						content: JSON.stringify(message),
						showCancel:false,
					});
		        };  
				const _handleReceive = function(message) {
				    // TODO  
					 console.error('收到消息2'+JSON.stringify(message))
					uni.showModal({
						title: '提示2',
						content: JSON.stringify(message),
						showCancel:false,
					});
				};  
		        plus.push.addEventListener('click', _handleClick);  
		        plus.push.addEventListener('receive', _handleReceive);  
		        // #endif  
	},
	onShow: function() {
		// console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
};
</script>

<style lang="scss">
/*每个页面公共css */ 
@font-face {
  font-family: 'iconfont';  /* project id 1342829 */
  src: url('https://at.alicdn.com/t/font_1342829_u2twimbf32.eot');
  src: url('https://at.alicdn.com/t/font_1342829_u2twimbf32.eot?#iefix') format('embedded-opentype'),
  url('https://at.alicdn.com/t/font_1342829_u2twimbf32.woff2') format('woff2'),
  url('https://at.alicdn.com/t/font_1342829_u2twimbf32.woff') format('woff'),
  url('https://at.alicdn.com/t/font_1342829_u2twimbf32.ttf') format('truetype'),
  url('https://at.alicdn.com/t/font_1342829_u2twimbf32.svg#iconfont') format('svg');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icondizhi2:before {
  content: "\e615";
}

.iconyonghu:before {
  content: "\e614";
}

.iconlogo:before {
  content: "\e67d";
}

.icondangqi:before {
  content: "\e67a";
}

.iconfenxiang2:before {
  content: "\e679";
}

.iconchangjiantou:before {
  content: "\e67c";
}

.iconfenxiang1:before {
  content: "\e678";
}

.iconyinle:before {
  content: "\e648";
}

.iconchanpin:before {
  content: "\e677";
}

.iconruzhu:before {
  content: "\e676";
}

.iconwodepingjia:before {
  content: "\e66a";
}

.iconquanbudingdan1:before {
  content: "\e66b";
}

.iconyifukuan1:before {
  content: "\e66c";
}

.iconpingjia:before {
  content: "\e66d";
}

.iconxiaoxi1:before {
  content: "\e66e";
}

.iconshezhi1:before {
  content: "\e66f";
}

.iconwoyaohezuo:before {
  content: "\e670";
}

.iconsaomaweixin:before {
  content: "\e671";
}

.iconhuodong2:before {
  content: "\e672";
}

.icondaifukuan1:before {
  content: "\e673";
}

.iconlianxikefu:before {
  content: "\e674";
}

.iconyouhuiquan2:before {
  content: "\e675";
}

.iconcha:before {
  content: "\e61e";
}

.icondianpu1:before {
  content: "\e60c";
}

.icondingdanquxiao:before {
  content: "\e667";
}

.icontupian:before {
  content: "\e6df";
}

.icondingdanjinhangzhong:before {
  content: "\e663";
}

.iconshangjiantou:before {
  content: "\e65b";
}

.iconzuojiantou:before {
  content: "\e629";
}

.iconbiaoqian:before {
  content: "\e660";
}

.icondizhi1:before {
  content: "\e661";
}

.iconziyuan:before {
  content: "\e65f";
}

.icondaifukuan2:before {
  content: "\e657";
}

.icondaipingjia2:before {
  content: "\e65a";
}

.iconyifukuan2:before {
  content: "\e658";
}

.icontuikuanzhong:before {
  content: "\e659";
}

.iconcuo:before {
  content: "\e656";
}

.iconyouhuiquan1:before {
  content: "\e654";
}

.iconpicture-delet:before {
  content: "\e612";
}

.iconhuo:before {
  content: "\e6eb";
}

.iconhere:before {
  content: "\e61d";
}

.iconhuodong1:before {
  content: "\e646";
}

.iconwenda1:before {
  content: "\e64a";
}

.icontongzhi:before {
  content: "\e645";
}

.icondingdan:before {
  content: "\e647";
}

.iconxiajiantou:before {
  content: "\e649";
}

.iconxiajiantou1:before {
  content: "\e611";
}

.iconhuodong:before {
  content: "\e63f";
}

.iconyingpeng:before {
  content: "\e640";
}

.iconyouhuiquan:before {
  content: "\e641";
}

.iconqicai:before {
  content: "\e642";
}

.iconzaixianjiaoyu:before {
  content: "\e643";
}

.iconshangcheng:before {
  content: "\e644";
}

.icongengduo:before {
  content: "\e63e";
}

.iconchenggong:before {
  content: "\e610";
}

.iconshaixuan:before {
  content: "\e628";
}

.iconsousuo:before {
  content: "\e622";
}

.icontianjia:before {
  content: "\e67b";
}

.iconfenxiang:before {
  content: "\e60b";
}

.iconshoucang:before {
  content: "\e652";
}

.iconshoucang1-copy:before {
  content: "\e600";
}

.iconshouye1:before {
  content: "\e63d";
}

.iconguanbi:before {
  content: "\e7ac";
}

.iconyoujiantou:before {
  content: "\e61c";
}

.iconquanjingkanpeng:before {
  content: "\e63c";
}

.iconrenzheng:before {
  content: "\e63b";
}

.icondizhi:before {
  content: "\e613";
}

.icondianhua:before {
  content: "\e638";
}

.iconkefu:before {
  content: "\e639";
}

.iconxiaoxi:before {
  content: "\e63a";
}

.icondianpu:before {
  content: "\e61b";
}

.iconshezhi:before {
  content: "\e637";
}

.icongouwuche2:before {
  content: "\e636";
}

.icongouwuche1:before {
  content: "\e635";
}

.icondaipingjia:before {
  content: "\e62b";
}

.iconwode:before {
  content: "\e62c";
}

.iconfenlei:before {
  content: "\e62d";
}

.icongouwuche:before {
  content: "\e62e";
}

.icondaifukuan:before {
  content: "\e62f";
}

.iconquanbudingdan:before {
  content: "\e630";
}

.iconwode1:before {
  content: "\e631";
}

.iconyifukuan:before {
  content: "\e632";
}

.iconshouye:before {
  content: "\e633";
}

.iconfenlei1:before {
  content: "\e634";
}


page{
	background-color: #f8f8f8;
	height: 100%;
	width: 100%;
}
.content{
	background-color: #ffffff;
}
.autoImg{
    display:flex;
    align-items:center;
    justify-content: center;
}
.autoImg image{
	width: auto;
	height: auto;
	max-width: 100%;
	max-height: 100%;  
}
.noData{
	width:100%;
	text-align:center
}
/* #ifdef MP-ALIPAY */
label{
	line-height: inherit
}
/* #endif */
</style>
