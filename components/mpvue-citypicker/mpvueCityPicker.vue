<template>
	<div class="mpvue-picker">

		<!-- <div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
      <div class="mpvue-picker__hd" catchtouchmove="true">
        <div class="mpvue-picker__action" @click="pickerCancel">取消</div>
        <div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
      </div> -->
		<uni-popup ref="popupPicker" type="bottom" @change="popupPickerChange">
			<view class="picker" v-if="showPicker">
				<view class="picker-modal picker-time">
					<view class="picker-modal-header">
						<text class="picker-modal-header-title" style="color:#666666" @click="pickerCancel">取消</text>
						<text class="picker-modal-header-title" @click="pickerCancel">-选择地址-</text>
						<text class="picker-modal-header-title" :style="'color:'+themeColor" @click="pickerConfirm">确定</text>
					</view>

					<picker-view class="picker-modal-time" indicator-class="picker-modal-time-item" :value="pickerValue" @change="pickerChange">
						<picker-view-column>
							<div class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.label}}</div>
						</picker-view-column>
						<picker-view-column>
							<div class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.label}}</div>
						</picker-view-column>
						<picker-view-column>
							<div class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.label}}</div>
						</picker-view-column>
					</picker-view>

					<view class="picker-modal-footer">
						<view class="picker-modal-footer-info">
							<view class="picker-display">
								<text>当前选择：</text>
								<text class="picker-display-text">{{addressLabel}}</text>
							</view>
						</view>
						<!-- <view class="picker-modal-footer-btn">
					<view class="picker-btn" :hover-stay-time="100" hover-class="picker-btn-active" @click="pickerCancel">取消</view>
					<view class="picker-btn" :style="{themeColor}" :hover-stay-time="100" hover-class="picker-btn-active" @click="pickerConfirm">确定</view>
					</view> -->
					</view>

				</view>
			</view>
		</uni-popup>


	</div>
</template>

<script>
	import uniPopup from '../uni-ui/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				pickerValue: [0, 0, 0],
				/* 是否显示控件 */
				showPicker: false,
				selfAcpData: {
					areaData: [],
					cityData: [],
					provinceData: []
				},
				provinceDataList:[],
			};
		},
		created() {

			this.init()
		},
		props: {
			/* 默认值 */
			pickerValueDefault: {
				type: Array,
				default () {
					return [0, 0, 0]
				}
			},
			/* 主题色 */
			themeColor: {
				type: String,
				default: '#651FFF'
			},
			acpData: {
				type: Object
			}
		},
		computed: {
			addressLabel() {
				return this._getLabel()
			},
			cityDataList(){
				let cityIndex = this.pickerValue[1];
				console.log('当前city 选择',cityIndex);
				if(this.selfAcpData.provinceData.length == 0 || this.selfAcpData.cityData.length == 0 ) return [];
				return this.selfAcpData.cityData[this.pickerValue[0]];
				
			},
			areaDataList(){
				console.log('当前pro 选择',this.pickerValue[0]);
				console.log('当前city 选择',this.pickerValue[1]);
				console.log('当前area 选择',this.pickerValue[2]);
				if(this.provinceDataList.length == 0 || this.selfAcpData.cityData.length == 0|| this.selfAcpData.areaData.length == 0 ) return [];
				return this.selfAcpData.areaData[this.pickerValue[0]][this.pickerValue[1]];
			},
		},
		watch: {
			pickerValueDefault() {
				this.init();
			},
			showPicker() {
				if (this.showPicker) {
					this.$refs.popupPicker.open()
				} else {
					this.$refs.popupPicker.close()
				}
			},
			acpData(val) {
				this.selfAcpData = val;
			},
			selfAcpData(val) {
				this.provinceDataList = val.provinceData;
			}
		},
		methods: {
			init() {
				this.handPickValueDefault(); // 对 pickerValueDefault 做兼容处理
				this.pickerValue = this.pickerValueDefault;
				console.log('默认选择---', this.provinceDataList)
			},
			popupPickerChange(e) {
				this.showPicker = e.show;
			},
			show() {
				setTimeout(() => {
					this.showPicker = true;
				}, 0);
			},
			maskClick() {
				this.pickerCancel();
			},
			pickerCancel() {
				this.showPicker = false;
				this._$emit('onCancel');
			},
			pickerConfirm(e) {
				this.showPicker = false;
				this._$emit('onConfirm');
			},
			showPickerView() {
				this.showPicker = true;
			},
			handPickValueDefault() {
				console.log('兼容处理',this.pickerValueDefault);
				if (this.pickerValueDefault !== [0, 0, 0]) {
					if (this.pickerValueDefault[0] > this.selfAcpData.provinceData.length - 1) {
						this.pickerValueDefault[0] = (this.selfAcpData.provinceData.length - 1<0)?0:this.selfAcpData.provinceData.length - 1;
					}
					if (this.pickerValueDefault[1] > this.selfAcpData.cityData[this.pickerValueDefault[0]].length - 1) {
						this.pickerValueDefault[1] = (this.selfAcpData.cityData[this.pickerValueDefault[0]].length - 1 < 0)?0:this.selfAcpData.cityData[this.pickerValueDefault[0]].length - 1;
					}
					if (this.pickerValueDefault[2] > this.selfAcpData.areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]]
						.length - 1) {
						this.pickerValueDefault[2] = (this.selfAcpData.areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length -
							1 < 0)?0:this.selfAcpData.areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length -
							1;
					}
				}
				console.log('兼容处理后',this.pickerValueDefault);
			},
			pickerChange(e) {
				let changePickerValue = e.mp.detail.value;
				if (this.pickerValue[0] !== changePickerValue[0]) {
					// 第一级发生滚动
					changePickerValue[2] = 0;
				} else if (this.pickerValue[1] !== changePickerValue[1]) {
					// 第二级滚动
					changePickerValue[2] = 0;
				}
				this.pickerValue = changePickerValue;
				this._$emit('onChange');
			},
			_$emit(emitName) {
				let pickObj = {
					label: this._getLabel(),
					value: this.pickerValue,
					cityCode: this._getCityCode(),
					provinceCode: this._getProvinceCode(),
					province: this.provinceDataList[this.pickerValue[0]].label,
					city: this._getCity(),
					area: this.areaDataList[this.pickerValue[2]].label
				};
				this.$emit(emitName, pickObj);
			},
			_getLabel() {
				if (this.selfAcpData.provinceData.length == 0) {
					return '';
				}
				console.log('getLabel 有数据', this.selfAcpData);
				console.log('this.pickerValue[0]' + this.pickerValue[0]);
				console.log('this.pickerValue[1]' + this.pickerValue[1]);
				console.log('this.pickerValue[2]' + this.pickerValue[2]);
				let pcikerLabel =
					this.provinceDataList[this.pickerValue[0]].label + this._getCity() + this.areaDataList[this.pickerValue[2]].label;
				return pcikerLabel;
			},
			_getCity() {
				if (this.selfAcpData.provinceData.length == 0) {
					return '';
				}
				let city_data = ''
				if (this.provinceDataList[this.pickerValue[0]].label == '北京市') {
					city_data = '北京市'
				} else if (this.provinceDataList[this.pickerValue[0]].label == '上海市') {
					city_data = '上海市'
				} else if (this.provinceDataList[this.pickerValue[0]].label == '天津市') {
					city_data = '天津市'
				} else if (this.provinceDataList[this.pickerValue[0]].label == '重庆市') {
					city_data = '重庆市'
				} else {
					city_data = this.cityDataList[this.pickerValue[1]].label
				}
				return city_data
			},
			_getCityCode() {
				if (this.provinceDataList.length == 0 || this.cityDataList.length == 0) {
					return '';
				}
				if (this.provinceDataList[this.pickerValue[0]].label == '北京市') {
					return '010'
				} else if (this.provinceDataList[this.pickerValue[0]].label == '上海市') {
					return '021'
				} else if (this.provinceDataList[this.pickerValue[0]].label == '天津市') {
					return '022'
				} else if (this.provinceDataList[this.pickerValue[0]].label == '重庆市') {
					return '023'
				} else {
					return this.cityDataList[this.pickerValue[1]].value;
				}

			},
			_getProvinceCode() {
				if (this.provinceDataList.length == 0) {
					return '';
				}
				return this.provinceDataList[this.pickerValue[0]].value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	$z-index: 100;
	$cell-spacing: 20rpx;
	$calendar-size: 630rpx;
	$calendar-item-size: 90rpx;

	.picker {
		position: fixed;
		z-index: $z-index;
		// background: rgba(0, 0, 0, 0.1);
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		font-size: 28rpx;

		.picker-item {
			text-align: center
		}

		&-btn {
			padding: $cell-spacing*0.5 $cell-spacing;
			border-radius: 12rpx;
			color: #666;

			&-active {
				background: rgba(0, 0, 0, .1);
			}
		}

		&-display {
			color: #666;

			&-text {
				color: #000;
				margin: 0 $cell-spacing*0.5;
			}

			&-link {
				display: inline-block;

				&-active {
					background: rgba(0, 0, 0, .1);
				}
			}
		}

		&-time {
			// width: $calendar-size - 80rpx !important;
			// left: ((750rpx - $calendar-size) / 2 + 40rpx) !important;
		}

		&-modal {
			background: #fff;
			position: absolute;
			// top: 50%;
			// left: (750rpx - $calendar-size) / 2;
			// width: $calendar-size;
			width: 100%;
			// transform: translateY(-50%);
			bottom: 0;
			box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
			// border-radius: 12rpx;

			&-header {
				display: flex;
				justify-content: space-between;
				line-height: 80rpx;
				font-size: 32rpx;
				background-color: #f8f8f8;

				&-title {
					display: inline-block;
					padding: 0 20rpx;
				}

				.picker-icon {
					display: inline-block;
					line-height: 50rpx;
					width: 50rpx;
					height: 50rpx;
					border-radius: 50rpx;
					text-align: center;
					margin: 10rpx;
					background: #fff;
					font-size: 36rpx;

					&-active {
						background: rgba(0, 0, 0, .1);
					}
				}
			}



			&-body {
				width: $calendar-size !important;
				height: $calendar-size !important;
				position: relative;
			}

			&-time {
				width: 100%;
				height: 300rpx;
				text-align: center;
				line-height: 60rpx;
			}

			&-footer {
				display: flex;
				justify-content: space-between;
				// align-items: center;
				padding: 40rpx 20rpx 40rpx;

				&-info {
					flex-grow: 1;
				}

				&-btn {
					flex-shrink: 0;
					display: flex;
				}
			}
		}

		&-calendar {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			&-view {
				position: relative;
				width: $calendar-item-size;
				height: $calendar-item-size;
				text-align: center;

				&-bgbegin,
				&-bg,
				&-bgend,
				&-item,
				&-dot,
				&-tips {
					position: absolute;
					transition: .2s;
				}

				&-bgbegin,
				&-bg,
				&-bgend {
					opacity: .15;
					height: 80%;
				}

				&-bg {
					left: 0;
					top: 10%;
					width: 100%;
				}

				&-bgbegin {
					border-radius: $calendar-item-size 0 0 $calendar-item-size;
					top: 10%;
					left: 10%;
					width: 90%;
				}

				&-bgend {
					border-radius: 0 $calendar-item-size $calendar-item-size 0;
					top: 10%;
					left: 0%;
					width: 90%;
				}

				&-item {
					left: 5%;
					top: 5%;
					width: 90%;
					height: 90%;
					border-radius: $calendar-item-size;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				&-dot {
					right: 10%;
					top: 10%;
					width: 12rpx;
					height: 12rpx;
					border-radius: 12rpx;
				}

				&-tips {
					bottom: 100%;
					left: 50%;
					transform: translateX(-50%);
					background: #4E4B46;
					color: #fff;
					border-radius: 12rpx;
					padding: 10rpx 20rpx;
					font-size: 24rpx;
					width: max-content;
					margin-bottom: 5px;
					pointer-events: none;

					&:after {
						content: "";
						position: absolute;
						top: 100%;
						left: 50%;
						transform: translateX(-50%);
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 5px 5px 0 5px;
						border-color: #4E4B46 transparent transparent transparent;
					}
				}
			}
		}
	}
</style>
