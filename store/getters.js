
function isValidUser(userData){
	console.log('判断用户数据合法 用户数据:',userData);
	let arr = Object.keys(userData);
	if(arr.length == 0){
		return false;
	}
	if(userData.token !== undefined && userData.id !== undefined && userData.mobile!==undefined){
		return true;	
	}
	return false;
}
const getters = {
  user_data: state => state.user.paitume_user,
  is_login_in: state => isValidUser(state.user.paitume_user) ,
  is_login_wx: state => state.user.wx_open_id!='',
  wx_open_id: state => state.user.wx_open_id,
  last_url: state => state.user.last_url,
  store_uid:state => state.header.store_uid,
  store_appid:state => state.header.store_appid,
  origin:state => state.header.origin,
  platform:state => state.header.platform,
  has_new_flag:state => state.user.has_new_flag,
  isShowBindDialog:state => state.sysInfo.isShowBindDialog, 
  user_push_token: state => state.user.user_push_token, 
}
export default getters
