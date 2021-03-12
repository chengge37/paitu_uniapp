
const header = {
	state: {
		origin:uni.getStorageSync('origin'),
        platform:uni.getStorageSync('platform'),
        store_uid:'0',
		store_appid:uni.getStorageSync('store_appid'),
	},
	mutations: {
		update_origin(state, data) {
			uni.setStorage({
				key: 'origin',
				data: data, 
				success: function() {
					// console.log('保存origin成功 ' + data);
				}
            });
            state.origin = data;
        },
        update_platform(state, data) {
			uni.setStorage({
				key: 'platform',
				data: data, 
				success: function() {
					// console.log('保存platform成功 '+data);
				}
            });
            state.platform = data;
        },
        update_store_uid(state, data) {
			uni.setStorage({
				key: 'store_uid',
				data: data, 
				success: function() {
					// console.log('保存store_uid成功 '+data);
				}
            });
            state.store_uid = data;
        },
        update_store_appid(state, data) {
			uni.setStorage({
				key: 'store_appid',
				data: data, 
				success: function() {
					// console.log('保存用户store_appid成功 '+data);
				}
            });
            state.store_appid = data;
		},
	},
	actions: {
        
	}
}
export default header;
