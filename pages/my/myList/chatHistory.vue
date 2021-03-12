<template>
  <view>
    <!-- #ifdef H5 -->
    <uni-nav-bar left-icon="back" :fixed="true" left-text="返回"  :status-bar="true" title="历史记录" @clickLeft="toChatBox"></uni-nav-bar>
    <!-- #endif -->
    <view class="box-content">
      <div class="msg-item" v-for="(item,index) in msgList" :key="index">
        <div class="time">{{dealTime(item.timestamp)}}</div>
        <div class="msg-row" :class="{'my-msg':item.from==creatorObj.id}">
          <div class="avatar-wrap">
            <img :src="dealAvatar(item.from)" alt="">
          </div>
          <div class="info">
            <span class="name">{{dealName(item.from)}}</span>
            <div class="msg-content">
              <!-- 文字类型消息 -->
              <span class="text-msg" v-if="item.type==-1">{{item.content._lctext}}</span>
              <!-- 图片类型消息 -->
              <div v-if="item.type==-2" class="img-msg-wrap">
                <img @tap="openUrl(item._lcfile.url)" :src="item._lcfile.url" alt="">
              </div>
              <!-- 视频类型消息 -->
              <div class="video-msg-wrap">
                <video class="video-msg" controls v-if="item.type==-4" :src="item._lcfile.url" objectFit="fill" :poster="item._lcfile.url"></video>
              </div>
              <!-- 音频类型消息 -->
              <audio class="audio-msg" controls v-if="item.type==-3" :src="item._lcfile.url" :name="item._lcfile.metaData.name" :author="item._lcfile.metaData.owner"></audio>
              <!-- word，excel，ppt，txt等文件 -->
              <!-- <i v-if="item.type==-6" class="el-icon-document"></i> -->
              <!-- <a v-if="item.type==-6" target="_blank" :href="item._lcfile.url">{{item._file.attributes.name}}</a> -->
              <div v-if="item.type==-6" class="other-file-type" @tap="openOtherFile(item._lcfile.url)">
                <span>[文件]</span>
                <span>{{item._file.attributes.name}}</span>
              </div>
              <!-- <web-view :src="item._lcfile.url">item._lcfile.metaData.name</web-view> -->
            </div>
            <span class="arrow" v-if="item.type==-1"></span>
          </div>
        </div>
      </div>
    </view>
  </view>
</template>

<script>
//#ifdef H5 
 
//#endif
import store from '@/store'
import uniNavBar from "@/components/uni-ui/uni-nav-bar/uni-nav-bar"

  export default {
    data(){
      return{
        msgList:[],
        msgListCopy:[],
        conversationObj:null,
        creatorObj:{
          id:'',
          name:'',
          avatar:''
        },
        chatToObj:{
          id:'',
          name:'',
          avatar:''
        },
      }
    },
    components:{
      uniNavBar
    },
    onLoad(options){
      let menber=JSON.parse(decodeURIComponent(options.menber))
      this.creatorObj=menber.creatorObj
      this.chatToObj=menber.chatToObj
      if(this.$IM.IM){
        this.chatTo(this.creatorObj,this.chatToObj)
      }else{
        this.loginIM(this.$store.getters.user_data.id)
      }
    },
    mounted(){
      document.getElementsByTagName('uni-page-head')[0].style.display = 'none'
    },
    methods:{
      // 刷新本页面后重新登录IM
      loginIM(id,userInfo){ 
	},
      // 根据传过来的id，创建和该id的聊天
      chatTo(creatorObj,chatToObj){
        this.$IM.IM.createConversation({ 
          members: [chatToObj.id+''],//对话包含的成员，自己是默认包含的
          name: `${creatorObj.name},${chatToObj.name}`,//对话的名称，这里取聊天对象的名字即可
          unique: true,//这个属性标志对话的唯一性，切勿遗漏
          creatorObj:creatorObj,
          chatToObj:chatToObj
        }).then(conversation=>{
          console.warn(conversation,'创建对话或者打开已有对话成功')
          this.conversationObj=conversation
          // 打开聊天窗口之后先要获取之前的历史聊天记录
          this.getMsgs()
        }).catch(err=>{
          console.error(err,'创建对话失败了')
          this.$router.back()
        });
      },
      // 打开其他类型的文件
      openOtherFile(url){
        // 浏览器可以打开，但微信内部浏览器打开失败
        // #ifdef H5
        window.location.href=url
        // #endif
      },
      // 获取对话的所有消息
      getMsgs(){
        // 创建一个迭代器，每次获取 1000 条历史消息,迭代获取所有消息
        var messageIterator = this.conversationObj.createMessagesIterator({ limit: 1000 });
        this.msgListCopy=[]
        // 调用递归方法
        this.chatIterator(messageIterator,this.conversationObj)
      },
      // 递归遍历对话的所有消息
      chatIterator(iterator,con){
        iterator.next().then(result=> {
          console.warn(result,'888')
          this.msgListCopy.unshift(...result.value)
          if(!result.done){
            // 如果还有消息没遍历完继续递归
            this.chatIterator(iterator,con)
          }else{
            // 消息全部迭代完成后
            this.msgList=[...this.msgListCopy]
            this.$nextTick(()=>{
              this.scrollToBottom()
            })
            console.warn(this.msgList,'对话的所有消息')
          }
        }).catch(console.error.bind(console))
      },
      // 消息框滚动到底部
      scrollToBottom () {
        console.warn('滚动到底部')
        console.warn(document.querySelectorAll('.box-content')[0].scrollTop,document.querySelectorAll('.box-content')[0].scrollHeight)
        document.querySelectorAll('.box-content')[0].scrollTop= document.querySelectorAll('.box-content')[0].scrollHeight
      },
      // 头像的相关处理
      dealAvatar(id){
        return this.conversationObj._attributes.creatorObj.id==id?
        (this.conversationObj._attributes.creatorObj.avatar.indexOf('http')==-1?(this.$qiniuHost+this.conversationObj._attributes.creatorObj.avatar):this.conversationObj._attributes.creatorObj.avatar):
        (this.conversationObj._attributes.chatToObj.avatar.indexOf('http')==-1?(this.$qiniuHost+this.conversationObj._attributes.chatToObj.avatar):this.conversationObj._attributes.chatToObj.avatar)
      },
      // 消息作者名字处理
      dealName(id){
        return this.conversationObj._attributes.creatorObj.id==id?
        this.conversationObj._attributes.creatorObj.name:
        this.conversationObj._attributes.chatToObj.name
      },
      // 时间格式处理
      dealTime(val){
        var d = new Date(val);  
        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
        return datetime
      },
      // 返回聊天窗口
      toChatBox(){
        this.$Router.back()
      }
    }
  }
</script>

<style lang="scss" scoped>
 .box-content{
  font-size: 14px;
  overflow-y: auto;
  height: 100%;
  padding-bottom: 20px;
  box-sizing: border-box;
  .msg-item{
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .time{
      background: rgb(221,221,221);
      color: #fff;
      padding: 5px 10px;
      border-radius: 3px;
      margin-bottom: 8px;
    }
    .msg-row{
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      .avatar-wrap{
        width: 45px;
        height: 45px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .info{
        width: calc(100% - 70px);
        display: flex;
        flex-direction: column;
        position: relative;
        .name{
          color: #999;
          margin-bottom: 8px;
        }
        .msg-content{
          // word-wrap:break-word;
          white-space:normal; 
          word-break:break-all;
          overflow:hidden;
          .text-msg{
            display: inline-block;
            border-radius: 3px;
            padding: 5px 10px;
            background: #fff;
          }
          .img-msg-wrap{
            // display: flex;
            width: 100%;
            height: 120px;
            padding-left: 50px;
            box-sizing: border-box;
            img{
              max-width: 100%;
              max-height: 100%;
              width: auto;
              height: auto;
              // margin-left: auto;
            }
          }
          .audio-msg{
            /deep/{
              .uni-audio-default{
                min-width: 240px!important;
              }
            }
          }
          .video-msg-wrap{
            z-index: 1;
            .video-msg{
              width: 240px;
              height: 150px;
              z-index: 1;
              /deep/{
                .uni-video-container{
                  z-index: 1;
                }
                .uni-video-video{
                  z-index: 1;
                }
              }
            }
          }
          .other-file-type{
            width: fit-content;
            background: #fff;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
        }
        .arrow{
          border-top: 8px solid #fff;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          position: absolute;
          left: -8px;
          top: 35px;
        }
      }
      .avatar-wrap+.info,.info+.avatar-wrap{
        margin-left: 15px;
      }
    }
    .my-msg{
      flex-direction: row-reverse;
      .info{
        .name{
          text-align: right;
        }
        .msg-content{
          text-align: right;
          .text-msg{
            background: rgb(95,184,120);
            color: #fff;
          }
        }
        .arrow{
          left: unset;
          right: -8px;
          border-top-color: rgb(95,184,120);
        }
      }
      .avatar-wrap{
        margin-left: 15px;
      }
    }
  }
}
</style>