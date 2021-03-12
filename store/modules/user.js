import {
	userLogin
} from '@/common/api/api';
import {
	promptBind
} from '@/common/login/login';
import {
	http
} from '@/common/utils/lush';

import Vue from 'vue'
import $Vm from '../../main'
import PIM from '@/common/SDK/PIM/index.js'
import _ from 'lodash/core'
// import socket from '@/common/SDK/PIM/socket.js'
// console.log('Main PIM = ' +JSON.stringify(PIM));
// console.log('Main Socket = ' +JSON.stringify(socket));
// #ifdef APP-PLUS
// import * as io from '@/common/SDK/PIM/index'
// #endif

const user = {
	state: {
		paitume_user: uni.getStorageSync('user') ? JSON.parse(uni.getStorageSync('user')) : false,
		wx_open_id: uni.getStorageSync('wx_open_id'),
		no_login_notice_time: 0,
		last_url: 0,
		has_new_flag: 0,
		conv_list: [],
		msg_of_con_map: {},
		user_push_token:uni.getStorageSync('user_push_token') ? uni.getStorageSync('user_push_token') : false,
	},
	mutations: {
		update_user_push_token(state, data){
			uni.setStorage({
				key: 'user_push_token',
				data: data,
				success: function() {
					console.log('保存user_push_token成功');
				}
			});
		},
		update_url(state, data) {
			uni.setStorage({
				key: 'last_url',
				data: data,
				success: function() {
					console.log('保存last_url成功');
				}
			});
			state.last_url = data;
		},
		update_user_data(state, data) {
			console.log('保存用户信息', data);
			try {
				uni.setStorageSync('user', JSON.stringify(data));
			} catch (e) {
				console.error('保存用户信息错误', e);
			}
			console.log('保存前', state);
			state.paitume_user = data;
			console.log('保存后', state);
		},
		update_user_wx_open_id(state, data) {
			uni.setStorageSync('wx_open_id', data);
			state.wx_open_id = data;
		},
		remove_user_data(state) {
			console.log('清除user信息');
			uni.removeStorage({
				key: 'user',
			});
			state.paitume_user = false
		},
		update_no_login_notice_time(state, data) {
			uni.setStorage({
				key: 'no_login_notice_time',
				data: data,
			});
			state.no_login_notice_time = data;
		},
		update_has_new_flag(state, data) {
			uni.setStorage({
				key: 'has_new_flag',
				data: data + 1,
			});
			state.has_new_flag = data;
		},
		add_new_conv(state, data) {
			console.log('vuex 添加回话信息')
			let insertIndex = -1;
			for (let i = 0, n = state.conv_list.length; i < n; i++) {
				let exsitConv = state.conv_list[i];
				if (exsitConv.createTime < data.createTime) {
					//在这个位置插入
					insertIndex = i;
				}
			}
			console.log('vuex 添加回话信息 插入位置 ' + insertIndex)
			if (insertIndex > -1) {
				state.conv_list.splice(insertIndex, 0, data);
			} else {
				state.conv_list.push(data);
			}
		},

		update_conv_read(state, conv_id) {
			for (let i = 0, n = state.conv_list.length; i < n; i++) {
				let convItem = state.conv_list[i];
				if (convItem.id == conv_id) {
					//更新未读数
					console.log('找到要更新的会话' + JSON.stringify(convItem));
					if (state.paitume_user.id == convItem.creatorObj.id) {
						convItem.unreadCountCreator = 0;
					} else {
						convItem.unreadCountChatTo = 0;
					}
					break;
				}
			}
		},

		update_conv_list(state, data) {
			data.sort((a, b) => {
				return b.createTime - a.createTime
			})
			state.conv_list = data;
		},
		update_one_conv_list(state, data) {
			console.log('更新一条会话的一条消息',data);
			let conv = data.conv;
			let msg = data.msg;
			let updateIndex = -1;
			for (let i = 0, n = state.conv_list.length; i < n; i++) {
				let chatItem = state.conv_list[i];
				if (chatItem.id == conv.id) {
					updateIndex = i;
					break;
				}
			}
			console.log('updateIndex = '+updateIndex);
			if (updateIndex >= 0) {
				console.log('更新聊天列表的第' + updateIndex + '项');
				let newConv  = conv;
				$Vm.$set(state.conv_list, updateIndex, newConv);
			} else {
				state.conv_list.push(conv);
			}
			
			state.conv_list.sort((a, b) => {
				return b.createTime - a.createTime
			})
			console.log('state.msg_of_con_map = ',state.msg_of_con_map);
			if (!state.msg_of_con_map.hasOwnProperty(conv.id)) {
				Vue.set(state.msg_of_con_map, conv.id, [msg]);
			} else {
				if(state.msg_of_con_map[conv.id] == undefined){
					state.msg_of_con_map[conv.id] = [msg];
				} else {
					state.msg_of_con_map[conv.id].push(msg);
				}
			}
			console.log('更新结束');
		},
		update_msg_of_con_map(state, data) {
			console.log('update_msg_of_con_map');
			if (state.msg_of_con_map.hasOwnProperty(data.conv_id)) {
				//组合
				let oldMsgList = state.msg_of_con_map[data.conv_id];
				let newMsgList = data.messages;
				const idSet = oldMsgList.reduce((acc, v) => {
					acc[v.id] = true;
					return acc;
				}, {});
				// 遍历新消息list，去掉在idSet中存在的id
				const result = newMsgList.filter(v => !idSet[v.id]);
				console.log('new msg', result);
				
				let temp = oldMsgList.concat(result);
				let tempAfterSort = _.sortBy(temp, function(o) { return o.createTime; });
				state.msg_of_con_map[data.conv_id] = tempAfterSort;
			} else {
				console.log('Vue set', data.conv_id, data.messages);
				let tempAfterSort = _.sortBy(data.messages, function(o) { return o.createTime; });
				Vue.set(state.msg_of_con_map, data.conv_id, tempAfterSort);
			}
		}

	},
	actions: {
		//微信登录,和h5流程不一样 没必要条件编译 为了减肥还是条件吧
		// #ifdef MP-WEIXIN
		wxCodeLogin({
			dispatch,
			commit
		}, code) {
			// commit('update_user_wx_open_id', 'oTDZa5D4yDEgX-hwDLJUZ0AwRLCs');
			http.get(userLogin.wxCodeLogin, {
				code: code
			}).then(res => {
				console.log('wx 登录派图', res);
				if (res) {
					console.log('user wx 登录成功', res)
					// oTDZa5D4yDEgX-hwDLJUZ0AwRLCs
					let loginData = res;
					//先存微信openID
					if (res.openid) {
						// 未注册时的openid
						commit('update_user_wx_open_id', res.openid);
					} else {
						// 注册后的openid
						commit('update_user_wx_open_id', res.user.wx_app_open_id);
					}
					if (loginData.has_reg == 1) {
						console.log('loginData----', loginData)
						commit('update_user_data', loginData.user);
						//dispatch('imLogin', loginData.user.id);
						dispatch('pimLogin');
					} else {
						//没绑定手机 这里是否要提示
						// promptBind();
						console.log("promptBind----------")
					}
				}
			}).catch(err => {
				console.error('wxCodeLogin错误', err);
				commit('remove_user_data')
			})
		},
		wxOpenidLogin({
			dispatch,
			commit
		}, openId) {
			console.log(openId)
			http.get(userLogin.wxOpenidLogin, {
				openid: openId
			}).then(res => {
				if (res) {
					console.log('user wx 登录成功', res)
					let loginData = res;
					//先存微信openID
					if (res.openid) {
						// 未注册时的openid
						commit('update_user_wx_open_id', res.openid);
					} else {
						// 注册后的openid
						commit('update_user_wx_open_id', res.user.wx_app_open_id);
					}
					if (loginData.has_reg == 1) {
						commit('update_user_data', loginData.user);
						// dispatch('imLogin', loginData.user.id);
						dispatch('pimLogin');

					} else {
						//没绑定手机 这里是否要提示
						// promptBind();
					}
				}
			}).catch(err => {
				console.error('wxOpenidLogin错误', err);
				commit('remove_user_data')
			})
		},
		// #endif

		pimLogin({
			commit,
			state
		}) {
			console.log('pimLogin被调用 ' + state.paitume_user.token);
			if ($Vm.$IM.IM  == null) {
				PIM.createPIMClient().then(pim => {
					console.log('createPIMClient succ' + JSON.stringify(pim));
				}).catch(err => {
					console.error('createPIMClient err' + JSON.stringify(err));
				});
			} else {
				console.log('IM已经存在',$Vm.$IM.IM)
			}
		},


		// #ifdef MP-ALIPAY
		alipayCodeLogin({
			commit
		}, code) {
			http.get(userLogin.alipayCodeLogin, {
				code: code
			}).then(res => {
				console.log('支付宝小程序 登录派图', res);
				if (res) {
					console.log('支付宝小程序 登录成功', res)
					my.getOpenUserInfo({
						fail: (res) => {
							console.log('支付宝错误');
						},
						success: (res) => {
							let userInfo = JSON.parse(res.response).response
							console.log('支付宝用户信息', userInfo);
						}
					});
				}
			}).catch(err => {
				commit('remove_user_data')
			})
		},
		// #endif



		h5Logout({
			commit
		}) {
			uni.showModal({
				title: '提示',
				content: '是否确定退出当前登录？',
				success: function(res1) {
					if (res1.confirm) {
						commit('remove_user_data');
						uni.switchTab({
							url: "/pages/tabBar/home"
						});
						if ($Vm.$IM.IM != null) {
							console.log('$Vm.$IM.IM = ' + JSON.stringify($Vm.$IM.IM));
							let pim = $Vm.$IM.IM;
							pim.close();
							$Vm.$IM.delIm();
						}
					} else if (res1.cancel) {
						console.log('用户点击取消');
					}
				}
			});

		},
		switchAccount({
			commit
		}) {
			uni.showModal({
				title: '提示',
				content: '是否确定退出当前登录？',
				success: function(res1) {
					if (res1.confirm) {
						commit('remove_user_data');
						uni.navigateTo({
							url: '/pages/my/loginApp'
						})
					} else if (res1.cancel) {
						console.log('用户点击取消');
					}
				}
			});

		},

		refreshChatList({
			commit
		}) {
			let obj = $Vm.$IM.IM;
			if (obj == null) {
				console.log('刷新列表 没有$IM');
				return;
			}
			obj.getConversation().then(res => {
				console.log('获取回话列表结果' + JSON.stringify(res));
			}).catch(err => {
				console.log('获取回话列表错误' + JSON.stringify(err));
			});
		},
		create_conversation({
			state,
			commit,
			dispatch
		}, chatToObj) {
			console.log('create_conversation in store', chatToObj);
			let obj = $Vm.$IM.IM;
			if (obj == null) {
				console.error('创建回话 没有$IM');
				return;
			}
			console.log('create_conversation in store', state);
			let creatorObj = {};
			creatorObj.id = state.paitume_user.id
			creatorObj.name = state.paitume_user.nick
			creatorObj.avatar = state.paitume_user.avatar ? state.paitume_user.avatar :
				'https://pic.paitume.com/images/male.png';

			console.log('创建回话 创建者', creatorObj);
			return new Promise((resolve, reject) => {
				obj.createConversation({
					members: [chatToObj.id + ''], //对话包含的成员，自己是默认包含的
					name: `${creatorObj.name},${chatToObj.name}`, //对话的名称，这里取聊天对象的名字即可
					unique: true, //这个属性标志对话的唯一性，切勿遗漏
					creatorObj: creatorObj,
					chatToObj: chatToObj,
				}).then(conversation => {
					console.log('创建对话或者打开已有对话成功')
					//检查conv_list中有没有
					let existIndex = -1;
					for (let i = 0, n = state.conv_list.length; i < n; i++) {
						let existConv = state.conv_list[i];
						if (conversation.id == existConv.id) {
							existIndex = i;
							break;
						}
					}
					if (existIndex == -1) {
						//如果没有要添加
						conversation.queryMessages({
							limit: 1,
						}).then((messages) => {
							console.log('对话获取消息', messages);
							let newMsg;
							if (messages.length > 0) {
								newMsg = messages[0];
							} else {
								newMsg = false;
							}
							commit('update_one_conv_list', {
								conv: conversation,
								msg: newMsg
							});
							resolve(conversation)
						}).catch(err => {
							console.error(err, '创建对话失败了')
							reject(err);
						});
					} else {
						console.log('列表已经有了 不用处理');
						resolve(conversation)
					}
				}).catch(err => {
					reject(err);
					console.error(err, '创建对话失败了')
				});
			});

		},
		refresh_con_msg_list({
			commit,
			state
		}, conv) {
			console.log('refresh_con_msg_list')
			conv.queryMessages({
				limit: 50, // limit 取值范围 1~100，默认 20
			}).then((messages) => {
				if (state.msg_of_con_map.hasOwnProperty(conv.id)) {
					//TODO
				} else {
					console.log('messages = ', messages);
					//state.msg_of_con_map[conv.id] = messages;
					commit('update_msg_of_con_map', {
						conv_id: conv.id,
						messages: messages
					});
				}
			});
		},
	}
}
export default user;
