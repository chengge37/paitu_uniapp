<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">
					收件人
				</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" type="text" v-model="addressForm.name" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					电话号码
				</view>
				<view class="input">
					<input placeholder="请输入收件人电话号码" type="text" v-model="addressForm.mobile" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					所在地区
				</view>
				<view class="input" @click="chooseCity">
					<span v-if="addressForm.areas">{{addressForm.areas}}</span>
					<span v-else style="color:#999999">-请选择-</span>
				</view>
				 <!-- <lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address> -->
			</view>
			<view class="row">
				<view class="nominal">
					详细地址
				</view>
				<view class="input">
					<textarea v-model="addressForm.addressPOI" auto-height="true" placeholder="请输入详细地址"></textarea>
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					设置默认地址
				</view>
				<view class="input switch">
					<switch color="#651FFF" :checked="isDefault" @change="isDefaultChange" />
				</view>
			</view>

			  
			<!-- <view class="row" v-if="editType=='edit'" @click="del">
				<view class="del">
					删除收货地址
				</view>
			</view> -->
		</view>
		<view class="save" @click="save(editType)">
			<view class="btn">
				保存地址
			</view>
		</view>
		<view class="del" @click="del">
			<view class="btn" v-if="editType=='edit'">
				删除地址
			</view>
		</view>
		<mpvue-city-picker :acpData="acpData" :themeColor="themeColor" ref="mpvueCityPicker" @onCancel="onCancel"
		 @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import { address } from '@/common/api/api';
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				addressForm:{
					name:'',
					mobile:'',
					province:'',
					city:'',
					city_code:'',
					lat:'',
					lng:'',
					address:'',
					addressPOI:'',
					areas:'',
					areas_code:'',
					postal_code:''
				},
				editType: '',
				id: '',
				name: '',
				tel: '',
				detailed: '',
				isDefault: false,
				cityPickerValue: [0, 0, 1],
				themeColor: '#651FFF',
				region: {
					label: "请点击选择地址",
					value: [],
					cityCode: ""
				},
				acpData:{
					areaData:[],
					cityData:[],
					provinceData:[],
				}
			};
		},
		methods: {
			onCancel(e) {
				console.log(e)
			},
			chooseCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				console.log('onConfirm-----eeee',e)
				this.addressForm.province = e.province;
				this.addressForm.city = e.city;
				// this.addressForm.address = e.label;
				this.addressForm.areas = e.label;
				this.addressForm.city_code = e.cityCode;
				this.cityPickerValue = e.value;
			},
			isDefaultChange(e) {
				console.log('------isDefaultChange--------',e);
				this.isDefault = e.detail.value;
			},
			del() {
				uni.showModal({
					title: '删除提示',
					content: '你将删除这个收货地址',
					success: (res) => {
						if (res.confirm) {
							this.$http.get(address.delAddress,{id:this.id}).then(res => {
								uni.showToast({title: res,duration: 2000,icon:'success'});
								setTimeout(() => {
									uni.navigateBack();
								}, 1000);
							}).catch(err=>{})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			save(type){
				let type_msg = '';
				if(type=='add'){type_msg='添加'}else{type_msg='修改'}
				this.addressForm.address = this.addressForm.areas+this.addressForm.addressPOI;
				if(!this.addressForm.lat){
					delete this.addressForm.lat;
				}
				if(!this.addressForm.lng){
					delete this.addressForm.lng;
				}
				uni.showModal({
					title: type_msg+'提示',
					content: '你将' + type_msg +'这个收货地址',
					success: (res) => {
						if (res.confirm) {
							if(type=='add'){
								this.$http.post(address.addAddress,this.addressForm).then(res => {
									if(res){
										if(this.isDefault){
											this.setDefault(res);
										}
										uni.showToast({title: '添加地址成功！',duration: 2000,icon:'success'});
										setTimeout(() => {
											uni.navigateBack();
										}, 1000);
										
										
									}
									
								}).catch(err=>{})
							}else{
								let params = Object.assign(this.addressForm,{id:this.id});
								this.$http.post(address.editAddress,params).then(res => {
									uni.showToast({title: '修改地址成功！',duration: 2000,icon:'success'});
									setTimeout(() => {
										uni.navigateBack();
									}, 1000);
										
									if(this.isDefault){
										this.setDefault(this.id);
									}
								}).catch(err=>{})
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
				
			},
			
			setDefault(id){
				this.$http.get(address.setDefault,{id:id}).then(res => {

				}).catch(err=>{})
			},
			initAcpData(){
				console.log('初始化ACP area city province数据');
				if (this.util.getStorage('acpData')) {
					this.acpData = this.util.getStorage('acpData');
					console.log('有ACP数据',JSON.stringify(this.acpData));
					
				} else {
					console.log('没有ACP数据')
					this.$http.get('/city/ajaxGetAddressSelectData').then(res=>{
						let area_json = res.area_json;
						let city_json = res.city_json;
						let province_json = res.province_json;
						this.acpData.areaData = JSON.parse(area_json);
						this.acpData.cityData = JSON.parse(city_json);
						this.acpData.provinceData = JSON.parse(province_json);
						this.util.setStorage('acpData',this.acpData,3600*24*7).then(res=>{
							console.log('保存地址需要数据结果',res);
						}).catch(err=>{
							uni.showToast({
							   title: '保存地址需要数据失败',
							   duration: 500  
							});  
							uni.navigateBack();
						})
					}).catch(err=>{
						uni.showToast({
						   title: '获取地址需要数据失败,请检查您的网络',
						   duration: 500  
						});  
					});
				}
			}
		},
		onLoad(e) {
			//获取传递过来的参数
			this.initAcpData();
			this.editType = e.type;
			if (e.type == 'edit') {
				uni.getStorage({
					key: 'address',
					success: (e) => {
						this.id = e.data.id;
						this.addressForm = e.data;
						this.isDefault = e.data.is_default;
						console.log('this.addressForm',this.addressForm)
						uni.removeStorage({key: 'address'})
					}
				})
			}

		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		}
	};
</script>
<style lang="scss">
	.save {
		view {
			display: flex;
		}

		position: fixed;
		bottom: 100rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			width: 100%;
			margin:0 30rpx;
			height: 80rpx;
			background-color: #651FFF;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30rpx;
		}
		
		
	}
	.del{
		view {
			display: flex;
		}

		position: fixed;
		bottom: 0rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn {
			width: 100%;
			margin:0 30rpx;
			height: 80rpx;
			background-color: #ffffff;
			color: #333333;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30rpx;
		}
	}
	.content {
		display: flex;
		flex-wrap: wrap;

		view {
			display: flex;
		}

		.row {
			width: 100%;
			padding: 0 30rpx;
			border-top: solid 1rpx #eee;
			.nominal {
				width: 30%;
				height: 120rpx;
				font-weight: 200;
				font-size: 30rpx;
				align-items: center;
			}

			.input {
				width: 70%;
				padding: 20rpx 0;
				align-items: center;
				font-size: 30rpx;

				&.switch {
					justify-content: flex-end;
				}

				.textarea {
					margin: 20rpx 0;
					min-height: 120rpx;
				}
			}

			.del {
				width: 100%;
				height: 100rpx;
				justify-content: center;
				align-items: center;
				font-size: 36rpx;
				color: #f06c7a;
				background-color: rgba(78, 133, 234, 0.05);
				border-bottom: solid 1rpx #eee;
			}
		}
		.row:last-child{
			border-top: 30rpx solid #f8f8f8
		}
	}
</style>
