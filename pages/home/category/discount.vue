<template>
	<div class="discount-wrap">
    <!-- 顶部tab选项 -->
    <div class="top-nav" v-if="false">
      <div class="nav-item" @click="changeTab(item)" :class="{'nav-active':item.checked}" v-for="(item,index) in tabArray" :key="index">
        <span class="first-word" >{{item.word[0]}}</span>
        <span class="rest-word">{{item.word.slice(1)}}</span>
      </div>
      <span @click="showMore" class="iconfont iconxiajiantou"></span>
      <div class="box" v-if="boxShow">
        <span @click="changeTab(each)" :class="{'box-active':each.checked}" class="option" v-for="(each,j) in boxArray" :key="j">{{each.word}}</span>
      </div>
    </div>
    <!-- 轮播图以及优惠券 -->
    <!-- 优惠券 -->
    <div class="discount-list" v-if="couponArr.length>0">
      <div class="discount-item" v-for="(item,index) in couponArr" :key="index">
        <img class="bg" :src="host+'images/miniapp/discount-bg.png'" alt="">
        <div class="discount">  
          <div class="discount-top">
            <div class="discount-top-left">
              <p class="type-name">
                <span class="discount-type">{{item.uid|couponType}}</span>
                <span v-if="item.to_uid_name"> | </span>
                <span class="discount-name" v-if="item.to_uid_name">{{item.to_uid_name}}</span>
               
              </p>
              <p class="date">
                <span class="date-start">{{item.st_time}}</span>
                <span>-</span>
                <span class="date-end">{{item.end_time}}</span>
              </p>
            </div>
            <div class="discount-top-right" v-if="item.coupon_type==1">
              <p class="discount-price">￥<span>{{item.money}}</span></p>
              <p class="use-condition">满{{item.limit_money}}使用</p>
            </div>
            <div class="discount-top-right" v-else>
              <p class="discount-price"><span>{{item.money_dis}}折</span></p>
              <p class="use-condition">满{{item.limit_money}}使用</p>
            </div>
          </div>
          <div class="discount-bottom">
            <span class="discount-bottom-left">{{item.content}}</span>
            <span @click="getOrUse(item)" 
            class="discount-bottom-right" 
            v-text="item.user_get&&(item.user_get>=item.limit_count)?'去使用':'立即领取'"
            v-if="item.uid!='0'" 
            ></span>
            <span @click="getOrUse(item)" 
            :class="item.user_get&&(item.user_get>=item.limit_count)?'discount-bottom-picked':'discount-bottom-right'"
            v-text="item.user_get&&(item.user_get>=item.limit_count)?'已领取完':'立即领取'"
            v-else >
            </span>
          </div>
        </div>
      </div>
    </div>
    <empty-show v-if="couponArr.length==0&&!loading" hasMenu='1'></empty-show>
    <!-- 查看下一个分类 -->
    <div class="more" v-if="false">
      <span class="more-click">点击</span>
      <span>查看下一个分类</span>
    </div>
    <!-- 底部tab -->
    <div class="bottom-tab">
      <div class="tab-item">
        <i class="iconfont iconyouhuiquan"></i>
        <span>领券中心</span>
      </div>
      <div class="line"></div>
      <div class="tab-item" @click="toMyCoupoun">
        <i class="iconfont iconwode"></i>
        <span>我的优惠券</span>
      </div>
    </div>

	</div>
</template>

<script>
import {coupon} from '@/common/api/api'
import {mapState} from 'vuex'
	export default {
		props:{

		},
		data() {
			return {
        host: this.$qiniuHost,
        loading:false,
        itemArray:[
          {
            word:'为你推荐',
            checked:true
          },
          {
            word:'影棚',
            checked:false
          },
          {
            word:'分类a',
            checked:false
          },
          {
            word:"分类b",
            checked:false
          },
          {
            word:'分类c',
            checked:false
          },
          {
            word:'分类d',
            checked:false
          },
          {
            word:'分类e',
            checked:false
          },
          {
            word:'分类f',
            checked:false
          }
        ],
        params:{
          page:1,
          page_size:10,
          status:1
        },
        boxShow:false,
        boxArray:[],
        tabArray:[],
        couponArr:[]
			}
    },
    computed: {
      ...mapState(['user']),
      
      
    },
    filters:{
      couponType(val){
        return val=='0'?'全场券':'店铺券'
      }
    },
		onShow(){

		},
		onLoad(e) {
      // this.tabArray=this.itemArray.slice(0,5)
      // this.boxArray=this.itemArray.slice(5)
      this.getCouponList()
		},
		// mounted() {

		// },
		methods: {
      getCouponList(){
        this.loading = true;
        let api = this.user.paitume_user?coupon.getList:coupon.getListNoLogin
        this.$http.get(api,this.params).then(res=>{
          // let arr=res.rows;
          if(res.rows.length>0){
            this.couponArr = this.couponArr.concat(res.rows)
          }
          if(res.rows.length==0&&this.params.page!=1){
            uni.showToast({ title: '无更多数据',icon: 'none'})
          }
          this.couponArr.forEach((item,index) => {
            item.st_time = item.st_time.split(' ')[0];
            item.end_time = item.end_time.split(' ')[0];
            item.money = item.money.split('.')[0];
            if(item.coupon_type==2){
              item.money_dis = Math.floor(parseInt(item.money))/10;
            }
          })
          this.loading = false;
        }).catch(err=>{
          this.loading = false;
        })
      },
      operateChange(e,data){
        console.log('eeee',e)
      },
      showMore(){
        this.boxShow=!this.boxShow
      },
      changeTab(tab){
        this.itemArray.forEach(item=>{
          item.checked=false
        })
        tab.checked=true
      },
      getOrUse(item){
        if(item.user_get&&(item.user_get>=item.limit_count)){
          if(item.uid!='0'){
            uni.navigateTo({
              url:"/pages/merchant/shop/shop?id="+item.uid+'&&name='+item.to_uid_name
            })
          }
        }else{
            this.$http.get(coupon.getCoupon,{id:item.id}).then(res=>{
              uni.showToast({ 
                  title: '领取成功',
                  icon: 'none'
              })
              this.couponArr = []
              this.params.page = 1;
              this.getCouponList()
            }).catch(err=>{})
          
          
        }
      },
      toMyCoupoun(){
        uni.navigateTo({
          url:"/pages/my/myList/myDiscount"
        })
      }
    },
    onReachBottom: function() {
			this.params.page++;
			this.getCouponList()
		},
    components:{
    }
}
</script>

<style lang="scss" scoped>
	.discount-wrap{
    .top-nav{
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 30rpx;
      color: #333;
      height: 98rpx;
      padding-left: 36rpx;
      box-sizing: border-box;
      font-size: 30rpx;
      position: relative;
      border-bottom: 1px solid #ebebeb;
      .nav-item{
        display: flex;
        height: 100%;
        line-height: 98rpx;
        .first-word{
        }
        .rest-word{
        }
      }
      .nav-active{
        color: #651fff;
        .first-word{
          border-bottom: 2px solid #651fff;
        }
      }
      .box{
        border: 1px solid #aaa;
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 10rpx;
        top: 130rpx;
        // transform: translateY(100%);
        .option{
          padding: 10rpx 20rpx;
          box-sizing: border-box;
        }
      }
      .box::before{
          content:'';
          position: absolute;
          width:20rpx;
          height:20rpx;
          top: -11rpx;
          left: 66%;
          background: rgb(248,248,248);
          transform: rotate(45deg);
          border-top: 1px solid #aaa;
          border-left: 1px solid #aaa;
          z-index: 9;
      }
      .box-active{
        color: #651fff;
      }
    }
    .discount-list{
      padding: 35rpx;
      box-sizing: border-box;
      // border: 2px dashed #789987;
      .discount-item{
        // border: 1px solid #789987;
        height: 260rpx;
        position: relative;
        margin-bottom: 10rpx;
        .bg{
          width: 100%;
          height: 100%;
        }
        .discount{
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          height: 260rpx;
          // background: tomato;
          display: flex;
          flex-direction: column;
          padding: 0 48rpx 0 40rpx;
          box-sizing: border-box;
          .discount-top{
            height: 170rpx;
            // border-bottom: 1rpx dotted #D9D9D9;
            display: flex;
            justify-content: space-between;
            // background: pink;
            .discount-top-left{
              display: flex;
              flex-direction: column;
              justify-content: center;
              .type-name{
                margin-bottom: 20rpx;
                margin-right: 10rpx;
                font-size: 30rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .discount-type{
                  color: #F31734;
                  margin-right: 10rpx;
                }
                .discount-name{
                  color: #333;
                  font-weight: 500;
                  margin-left: 10rpx;
                }
              }
              .date{
                font-size: 22rpx;
              }
            }
            .discount-top-right{
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding-bottom: 30rpx;
              box-sizing: border-box;
              .discount-price{
                color: #EA001F;
                font-size: 30rpx;
                span{
                  font-size: 60rpx;
                }
              }
              .use-condition{
                margin-top: 10rpx;
                color: #F31734;
                font-size: 22rpx;
              }
            }
          }
          .discount-bottom{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 20rpx;
            box-sizing: border-box;
            .discount-bottom-left{
              font-size: 22rpx;
              color: #999;
            }
            .discount-bottom-right{
              width: 128rpx;
              height: 48rpx;
              background: #EA001F;
              color:#fff;
              font-size: 26rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8rpx;
            }
            .discount-bottom-picked{
              width: 128rpx;
              height: 48rpx;
              color:#EA001F;
              font-size: 26rpx;
              text-align: center;
            }
          }
        }
      }
      .discount-item:last-child{
        margin-bottom: 130rpx;
      }
    }
    .more{
      text-align: center;
      margin-bottom: 160rpx;
      span{
        font-size: 26rpx;
        color: #999;
      }
      .more-click{
        color: #EA001F;
      }
    }
    .bottom-tab{
      // background: #eee;
      background: rgb(248,248,248);
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 98rpx;
      display: flex;
      border-top: 1px solid#EBEBEB;
      color: #666666;
      z-index: 10;
      .tab-item{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        i{
          margin-bottom: 8rpx;
        }
        span{
          font-size: 20rpx;
        }
      }
      .tab-item:first-child{
        color: #651fff;
      }
      .line{
        box-sizing: border-box;
        width: 1rpx;
        height: 48rpx;
        align-self: center;
        border-right: 1px solid #EBEBEB;
      }
    }
  }
</style>
