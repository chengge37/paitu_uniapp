 import { getStorage,setStorage } from '@/common/utils/util'

const sysInfo = {
	state: {
		windowHeight:getStorage('window_height'),
		isShowBindDialog: getStorage('isShowBindDialog')
	},
	mutations: {
		update_window_height(state, data) {
			setStorage('window_height',data);
            state.windowHeight = data;
        },
		update_isShowBindDialog(state, data){
			setStorage('isShowBindDialog',1,5);
			state.isShowBindDialog = data;
		}
	},
	actions: {
        
	}
}
export default sysInfo;
