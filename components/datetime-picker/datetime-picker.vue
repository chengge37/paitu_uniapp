<template>
    <view class="datetime-picker">
        <uni-popup ref="popupPicker" type="bottom" @change="popupPickerChange">
            <div class="mpvue-picker__hd" catchtouchmove="true">
                <div class="mpvue-picker__action" @click="pickerCancel">取消</div>
                <div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
            </div>
            <picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange" v-if="type=='date'">
                <block>
                <picker-view-column>
                    <div class="picker-item" v-for="(item,index) in years" :key="index">{{item}}</div>
                </picker-view-column>
                <picker-view-column @change="monthChange">
                    <div class="picker-item" v-for="(item,index) in months" :key="index">{{item}}</div>
                </picker-view-column>
                <picker-view-column>
                    <div class="picker-item" v-for="(item,index) in days" :key="index">{{item}}</div>
                </picker-view-column>
                </block>
            </picker-view>
            <picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue1" @change="pickerChange" v-else>
                <block>
                <picker-view-column>
                    <div class="picker-item" v-for="(item,index) in hoursArr" :key="index">{{item}}</div>
                </picker-view-column>
                <picker-view-column @change="monthChange">
                    <div class="picker-item" v-for="(item,index) in minutesArr" :key="index">{{item}}</div>
                </picker-view-column>
                </block>
            </picker-view>
        </uni-popup>
        <!-- <div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
            <div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
            <div class="mpvue-picker__hd" catchtouchmove="true">
                <div class="mpvue-picker__action" @click="pickerCancel">取消</div>
                <div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
            </div>
            
        </div> -->
    </view>
</template>

<script>
import uniPopup from '../uni-ui/uni-popup/uni-popup.vue'
export default {
    data: function () {
        const date = new Date()
        const years = []
        const year = date.getFullYear()
        const months = []
        const month = date.getMonth() + 1
        const days = []
        const day = date.getDate()
        const hours = []
        const minutes = []
        // date.getFullYear()
        for (let i = 2019; i <= 2024; i++) {
            years.push(i)
        }
        for (let i = 1; i <= 12; i++) {
            months.push(i)
        }
        for (let i = 1; i <= 31; i++) {
            days.push(i)
        }
        for (let i = 1; i <= 23; i++) {
            if(i<10){
                hours.push('0'+JSON.stringify(i))
            }else{
                hours.push(JSON.stringify(i))
            }
            
        }
        for (let i = 1; i <= 60; i++) {
            if(i==60){
                minutes.push('00')
            }else if(i<10){
                minutes.push('0'+JSON.stringify(i))
            }else{
                minutes.push(JSON.stringify(i))
            }
            
        }
        return {
            title: 'picker-view',
            date:date,
            years:years,
            year:'',
            months:months,
            month:'',
            // days,
            day:'',
            hours:hours,
            hour:'',
            minutes:minutes,
            minute:'00',
            hoursArr:[],
            minutesArr : ['00分','30分'],
            pickerValue: [0, 0, 0],
            pickerValue1: [0, 0],
            showPicker: false,
            value: [9999, month - 1, day - 1],
            visible: true,
            indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
        }
    },
    components:{uniPopup},
    watch:{
		pickerValueDefault(){
			this.init();
        },
        showPicker(){
			if(this.showPicker){
				this.$refs.popupPicker.open()
			}else{
				this.$refs.popupPicker.close()
			}
		}
	},
    computed: {
        days(){
            let count ;
            let arr=[];
            if(this.month==1||this.month==3||this.month==5||this.month==7||this.month==8||this.month==10||this.month==12){
                count = 31
            }else{
                if(this.month==2){
                    count =  this.mGetDate(this.year,2)
                }else{
                    count = 30
                }
            }
            for (let i = 1; i <= 31; i++) {
                arr.push(i)
            }
            return arr
        },
        pickerValueDefault(){
            return [0,this.date.getMonth(),this.date.getDate()-1]
        },
    },
    props:{
        themeColor: {
            type:String,
            default:'#651fff'
        },
        type:{
            type:String,
            default:'date'
        },
        startTime:{
            type:String,
            default:'00:00'
        },
        endTime:{
            type:String,
            default:'00:00'
        }
    },
    mounted() {
        this.pickerValue = this.pickerValueDefault;
        let startHour = parseInt(this.startTime.split(':')[0]);
        let endHour = parseInt(this.endTime.split(':')[0])==0?23:parseInt(this.endTime.split(':')[0]);
        if(startHour<10){
            this.hour = '0'+JSON.parse(startHour);
        }else{
            this.hour = JSON.parse(startHour);
        }
        
        // this.minute = endHour;
        console.log('this.startTime.split',this.startTime.split(':'))
        console.log('startHour--',startHour,'endHour--',endHour)
        for (let v=startHour; v<=endHour; v++){
            if(v<10){
                this.hoursArr.push('0'+JSON.parse(v)+'时')
            }else{
                this.hoursArr.push(JSON.parse(v)+'时');
            }
            
        }
    },
    methods: {
        mGetDate(year, month){
            var d = new Date(year, month, 0);
            return d.getDate();
        },
        show() {
            this.showPicker = true;
        },
        popupPickerChange(e){
            console.log('--popupPickerChange---',e)
			if(!e.show){
				this.showPicker = false;
				this._$emit('onCancel');
			}
        },
        pickerChange(e) {
            const val = e.detail.value
            if(this.type=='date'){
                this.year = this.years[val[0]]
                this.month = this.months[val[1]];
                this.day = this.days[val[2]]
                if(this.month<this.date.getMonth() + 1){
                    this.month = this.date.getMonth() + 1;
                }else if(this.month==this.date.getMonth() + 1){
                    if(this.day < this.date.getDate()){
                        this.day = this.date.getDate()
                    }
                }
            }else{
                let h = this.hoursArr[val[0]].split('时')[0];
                this.hour = h;
                
                this.minute = this.minutesArr[val[1]].split('分')[0];
            }
            console.log('e=====',this.hour+':'+this.minute)
            console.log('e=====',this.year+'-'+this.month+'-'+this.day)
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
        _$emit(emitName) {
            let pickStr ;
            if(this.type=='date'){
                pickStr = this.year+'-'+this.month+'-'+this.day
            }else{
                pickStr = this.hour+':'+this.minute;
            }
            
            this.$emit(emitName, pickStr);
        },
    }
}
</script>
<style scoped>
.datetime-picker{

}
.pickerMask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.mpvue-picker-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}
.mpvue-picker-view-show {
  transform: translateY(0);
}
.mpvue-picker__hd {
  display: flex;
  padding: 9px 15px;
  background-color: #fff;
  position: relative;
  text-align: center;
  font-size: 17px;
}
.mpvue-picker__hd:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}
.mpvue-picker__action {
  display: block;
  flex: 1;
  color: #1aad19;
}
.mpvue-picker__action:first-child {
  text-align: left;
  color: #888;
}
.mpvue-picker__action:last-child {
  text-align: right;
}
.picker-item {
  text-align: center;
  line-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.mpvue-picker-view {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 238px;
  background-color: rgba(255, 255, 255, 1);
}
</style>