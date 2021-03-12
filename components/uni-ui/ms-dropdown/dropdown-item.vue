<template>
	<div class="dropdown-item">
		<!-- selected -->
		<view class="dropdown-item__selected" 
		@click="changePopup">
			<view class="selected__name" :class="showClass === 'show'? 'active' : ''" :style="colorActive?'color:#651FFF':''">{{selectItem.name}}</view>
			<view class="selected__icon"
				  :class="showClass === 'show'? 'up' : 'down'"
			>
				<!-- <span class="iconfont">&#xe851;</span> -->
				<span class="icon" :class="showClass === 'show'||colorActive? 'icon-active' : ''"></span>
			</view>
		</view>
		<view class="dropdown-item__content" :style="{top: contentTop + 'px'}" v-if="showList">
			<!-- dropdown -->
			<scroll-view scroll-y :class="['list', showClass]" >
				<block v-if="list&&list.length>0">
					<view class="list__option"
						v-for="(item, index) in list"
						:key="index"
						@click="choose(item)">
						<view>{{item.name}}</view>
						<icon v-if="item.id === selectItem.id" type="success_no_circle" size="18" color="#651FFF"/>	
					</view>
				</block>
				<block v-else>
					<slot></slot>
				</block>
			</scroll-view>	
			<view :class="['btn', showClass]" :style="{top: btnTop + 'px'}" v-if="list.length==0">
				<div class="reset" @click="reset">重置</div>
				<div class="comfirm" @click="comfirm">确认</div>
			</view>
			
			<!-- dropdown-mask -->
			<view :class="['dropdown-mask', showClass]" v-if="showList" @click="closePopup"></view>
		</view>

	</div>
</template>

<script>
	export default {
		components: {
		},
		props: {
			value: [Number, String, Object],
			list: {
				type: Array,
				default: ()=> {
					return []
				}
			},
			hasSlot: {
				type: Boolean,
				default: false
			},
			title: [Number, String],
			colorActive:{
				type:Boolean,
				default: false
			},
			index:[Number, String]
		},
		data() {
			return {
				showList: "",
				showClass: '',
				selectItem: {},
				contentTop: 0,
				btnTop:0
			}
		},
		watch: {
		},
		mounted() {
			this.showList = this.active;
			if(this.title){
				this.selectItem = {id:0,name:this.title}
			}
			// document.addEventListener('click', e => {
			// 	//this.$el 可以获取当前组件的容器节点
			// 	if (!this.$el.contains(e.target)) {
			// 		console.log('change');
			// 		this.close()
			// 	}
			// });
		},
		methods: {
			choose(item) {
				this.selectItem = item
				this.$emit('choose', item.id)
				this.closePopup()
			},
			changePopup() {
				this.$emit('tapone',this.index)
				setTimeout(()=> {
					if(this.showList) {
						this.closePopup()
					} else {
						this.openPopup()
					}
				},500)
				
			},
			openPopup() {
				// this.$parent  -> dropdown-menu
				this.$parent.$emit('close')
				this.showList = true
				this.$nextTick(() => {
					this.getElementData('.dropdown-item__selected', (data)=>{
						// #ifdef H5
						this.contentTop = data[0].bottom + 44
						// #endif
						// #ifndef H5
						this.contentTop = data[0].bottom
						// #endif
						this.showClass = 'show'
					})
					this.getElementData('.list', (data)=>{
						console.log('list--',data[0])
						this.btnTop = data[0].height + this.contentTop
					})
				})
			},
			closePopup() {
				this.showClass = ''
				setTimeout(() => {
					this.showList = false
				}, 100)
			},
			close() {
				this.showClass = ''
				this.showList = false
			},
			getElementData(el, callback){
				uni.createSelectorQuery().in(this).selectAll(el).boundingClientRect().exec((data) => {
					callback(data[0]);
				});
			},
			reset(){
				this.$emit('reset')
			},
			comfirm(){
				this.$emit('comfirm')
			}
		}
	}
</script>

<style lang="scss">
	@font-face {
	  font-family: 'iconfont';  /* project id 1564327 */
	  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot');
	  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix') format('embedded-opentype'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2') format('woff2'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff') format('woff'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf') format('truetype'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont') format('svg');
	}
	.iconfont{
		font-family:"iconfont" !important;
		font-size:28rpx;
		font-style:normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
	.dropdown-item {
		width: 100%;
		flex:1;
		&__selected {
			position: relative;
			display: flex;
			align-items: center;
			background: #fff;
			padding: 30rpx 20rpx;
			box-sizing: border-box;
			justify-content: center;
			.selected__name {
				font-size: 30rpx;
			}
			.selected__icon {
				margin-left: 10rpx;
				&.down {
					transition: transform .3s;
					transform: rotateZ(0);
				}
				&.up {
					transition: transform .3s;
					transform: rotateZ(-180deg);
				}
				.icon{
					display: inline-block;
					width: 0;
					height: 0;
					border-bottom: 8rpx solid transparent;
					border-top: 8rpx solid #333333;
					border-left: 8rpx solid transparent;
					border-right: 8rpx solid transparent;
				}
				.icon-active{
					border-top: 8rpx solid #651FFF;
				}
			}
			.active{
				color: #651FFF;
			}
			
		}
		&__content {
			position: fixed;
			left: 0;
			right: 0;
			overflow: hidden;
			top: 0;
			bottom: 0;
			z-index: 1;
			.list {
				max-height: 400px;
				overflow-y: auto;
				position: absolute;
				left: 0;
				right: 0;
				z-index: 3;
				background: #fff;
				transform: translateY(-100%);
				transition: all .3s;
				&.show {
					transform: translateY(0);
				}
				&__option {
					font-size:28rpx;
					padding: 26rpx 28rpx;
					display: flex;
					justify-content: space-between;
					&:not(:last-child) {
						border-bottom: 1rpx solid #DDDDDD;
					}
				}
				
			}
			
			.btn{
				width: 100%;
				height: 98rpx;
				line-height: 98rpx;
				text-align: center;
				font-size: 30rpx;
				display: flex;
				z-index: 3;
				position: fixed;
				transition: all .3s;
				transform: translateY(-100%);
				.reset{
					width: 50%;
					color: #333333;
					border-top: 1rpx solid #d9d9d9;
					border-right: 1rpx solid #d9d9d9;
					font-size: 30rpx;
					background-color: #ffffff;
				}
				.comfirm{
					width: 50%;
					background-color: #651FFF;
					color: #ffffff;
				}
			}
			
			.dropdown-mask {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				transition: all .3s;
				z-index: 2;
				&.show {
					background:rgba(0,0,0,0.5);
				}
			}
			
		}
	}
</style>
