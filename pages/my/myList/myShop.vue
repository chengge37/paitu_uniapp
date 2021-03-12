<template>
	<div class="contain">
        <div>
            <!-- v-if="user.paitume_user.role!='1'" -->
            <div class="not-merchant" v-if="user.paitume_user.role!='1'">
                <div class="step-box" :style="is_h5?'top:44px':'top:0'">
                    <div class="step-item">
                        <div class="dots">
                            <span class="dot" :class="{active:currentIndex>=0}"></span>
                            <span class="line" :class="{active:currentIndex>=1}"></span>
                        </div>
                        <div class="dots">
                            <span class="dot" :class="{active:currentIndex>=1}"></span>
                            <span class="line" :class="{active:currentIndex>=2}"></span>
                        </div>
                        <div class="dots">
                            <span class="dot" :class="{active:currentIndex>=2}"></span>
                            <span class="line" :class="{active:currentIndex>=3}"></span>
                        </div>
                        <div class="dots">
                            <span class="dot" :class="{active:currentIndex>=3}"></span>
                        </div>
                    </div>
                    
                    <div class="step-text">
                        <p :class="{active:currentIndex>=0}">《平台服务协议》</p>
                        <p class="item2" :class="{active:currentIndex>=1}">上传资料</p>
                        <p class="item3" :class="{active:currentIndex>=2}">阅读合同范本</p>
                        <p :class="{active:currentIndex>=3}">等待审核</p>
                    </div>
                </div>
                <div class="step-content">
                    <!-- 第一步 -->
                    <div class="first-step" v-if="currentIndex==0">
                        <div class="agreement-wrap">
                            <h1>派图租赁平台服务协议</h1>
                            <p class="no-indent">派图租赁（paitume.com）平台依据以下条件和条款为您提供所享有的服务,请仔细阅读并遵守。</p>
                            <h3>一、总则</h3>
                            <p>1.1 本《派图租赁平台服务协议》（以下简称本协议）为您（即商户）与深圳市派图租赁科技有限公司（以下简称派图租赁）就派图租赁平台服务达成的协议。派图租赁在此特别提醒您认真阅读、充分理解本协议。商户应认真阅读、充分理解本协议中各条款，特别涉及免除或者限制派图租赁责任的免责条款，对商户的权利限制的条款，法律适用、争议解决方式的条款。</p>
                            <p>1.2 请您审慎阅读并选择同意或不同意本协议，除非您接受本协议所有条款，否则您无权使用本协议项下相关服务。您的申请、使用、帐号获取和登录等行为表明您自愿接受本协议的全部内容并受其约束，不得以任何理由包括但不限于未能认真阅读本协议等作为纠纷抗辩理由。</p>
                            <p>1.3 本协议可由派图租赁随时更新，更新后的协议条款一旦公布即代替原来的协议条款，不再另行个别通知。您可在网站查阅最新版协议条款。在派图租赁修改本协议条款后，如果您不接受修改后的条款，请立即停止使用派图租赁提供的服务，您继续使用派图租赁提供的服务将被视为已接受了修改后的协议。</p>
                            <h3>二、定义</h3>
                            <p>2.1 派图租赁平台：是搭建、提供及维护网上租赁影棚、器材租赁等相关服务的信息发布的平台，用户和商户通过派图租赁平台对影棚租赁及器材租赁等服务达成合意。</p>
                            <p>2.2 用户：是指在派图租赁平台上购买器材租赁、器材租赁等相关服务的具有完全民事权利能力和行为能力的自然人。</p>
                            <p>2.3 商户：即本协议中的“您”，是指通过派图租赁平台自主发布影棚租赁、器材租赁等服务信息、完成任务事项的依据中国法律合法成立并有效存续的法人或其他商事主体。</p>
                            <h3>三、商户的权利义务：</h3>
                            <p>3.1 商户应保证其为一家依据中国法律合法成立并有效存续的法人或其他商事主体，能够独立承担法律责任，并具有履行本合同所需一切权利及能力；同时商户应当提供盖章的资质证明复印件，如涉及特殊行业需要特定的资质或许可证等的，商户也应予以提供。前述资料包括但不限于商户营业执照、前置许可证件、租赁商品说明、页面信息文案所需资料（包括图片、商家介绍）等。商户保证提供的文件内容真实有效，不侵犯任何第三方的合法权益，由于信息虚假或不准确造成的一切后果与损失均由商户承担。商户的名称、地址和有效联系方式、许可证等信息发生变化的，商户应在一个工作日内书面或邮件通知派图租赁（邮件地址：vip@paitume.com）。由于商户未及时通知，给商户自身及派图租赁造成的一切损失均由商户承担。</p>
                            <p>3.2 商户应向派图租赁提供相关租赁服务的具体信息和详细说明。商户应保证自身具备提供本合同项下商品及履行本合同项下商户提供租赁服务活动所有必要的资质批文。</p>
                            <p>3.3 商户提供的租赁服务或其他服务或者销售商品等，应符合国家法律、法规、规章的规定。如因商户提供的服务或销售的商品质量或安全问题造成派图租赁用户投诉、索赔、经济损失等相关后果均由商户承担，如派图租赁基于前述情况向消费者先行赔付的，派图租赁有权向商户追偿，追偿方式包括但不限于在结算给商户的相关款项中直接扣除该赔付金额。</p>
                            <p>3.4 商户为派图租赁开辟绿色通道，具体事宜如：商户在接收到派图租赁用户的订单后，应优先处理派图租赁用户的订单。</p>
                            <p>3.5 商户不应就在线标注价格之外向派图租赁用户收取任何线下费用。如派图租赁用户所订购租赁服务或者商品售罄，经商户与派图租赁用户沟通后，商户可就替代服务或商品线下向用户收取差价部分。</p>
                            <p>3.6 如派图租赁用户要求服务发票，由商户负责全额提供，派图租赁系统通知商户用户下单信息后，如商户因租赁服务或商品售罄等原因，不能提供的，商户应立即电话通知下单信息的用户和派图租赁，并做好合理的安抚和处理措施，如因此造成派图租赁用户投诉、经济损失等相关后果均由商户承担。</p>
                            <p>3.7 商户应严格按照双方协商签订的活动方案为派图租赁用户提供相应的优惠价格或赠品，不允许出现故意拒不提供的行为，否则由此产生的用户投诉和损失均由商户承担。</p>
                            <p>3.8 商户承诺自己在使用派图租赁时不会出现以下违规行为，如因出现以下违规行为导致任何法律后果的发生，由商户自行承担所有法律责任：</p>
                            <p>3.8.1 违反国家法律、法规要求以及各种社会公共利益或公共道德的行为；</p>
                            <p>3.8.2 违反派图租赁相关规定的行为（包括但不限于制造虚假订单、利用系统漏洞获取利润、违规套现、对用户消费欺诈、无故取消订单、无故拒绝配送等）；</p>
                            <p>3.8.3 其他损害派图租赁平台、用户和其他商户利益的行为。</p>
                            <p>3.9 商户可以通过用户名和密码登陆派图租赁网上平台商家后台，商户应对密码安全及通知实施的行为负责，商户不得以任何形式将用户名和密码转让或泄露给第三方。</p>
                            <p>3.10 商户提供的银行账户信息须准确，如发生变更应立即通知派图租赁，否则，由此造成的款项延误等后果均由商户承担。</p>
                            <p>3.11 商户保证经营场所内实际销售价格不得低于商品在线标注价格，且不得唆使或引导派图租赁用户放弃在派图租赁网上平台服务，改为其他形式的商户和派图租赁用户直接交易，否则派图租赁有权立即终止合作并要求商户按照协议第六条承担违约责任。</p>
                            <p>3.12 商户同意派图租赁可能会与第三方合作向商户提供相关的网络服务，在此情况下，如该第三方同意承担与派图租赁同等的保护用户隐私的责任，则派图租赁有权将用户的信息资料等提供给该第三方。另外，在不透露单个商户隐私资料的前提下，派图租赁有权对整个商户数据库进行分析并对商户数据库进行商业上的利用。</p>
                            <p>3.13 商户同意派图租赁拥有通过信息推送、平台公示、短信、电话、邮件等形式向您通知告知信息的权利，商户允许平台向其发送商业性电子信息。</p>
                            <h3>四、派图租赁权利与义务</h3>
                            <p>4.1 派图租赁为商户提供本协议项下约定的派图租赁网上服务平台的网络展示，并按照派图租赁平台约定向商户收取服务费。</p>
                            <p>4.2 派图租赁为商户在消费群体中做相关宣传介绍并进行相关推荐，以提升商户的知名度。商户同意授权派图租赁使用其品牌、LOGO、名称、商标等知识产权。</p>
                            <p>4.3 派图租赁有权对商户拟在派图租赁发布的内容、信息进行审核，必要时可删改。派图租赁有权对不符合法律法规、政策规定的内容或任何侵犯第三方合法权益的内容予以删改或拒绝发布，但甲乙双方确认，派图租赁的前述审核、删改不为派图租赁设置任何义务，也不免除商户根据本协议应承担的责任。</p>
                            <p>4.4 如任何第三方向派图租赁投诉，派图租赁经核实后，有权要求商户配合解决该投诉。如出现不符合法律法规、政策规定或侵犯第三方合法权益的内容的，派图租赁有权在不通知商户的情况下做下线处理。</p>
                            <p>4.5 商户店铺内所售品类如有违反派图租赁平台经营范围的相关规定或有向消费者私自售卖违禁品的行为，派图租赁平台有权按照相关规定对商户进行处罚，并举报至相关行政主管部门。</p>
                            <p>4.6 如活动方案中涉及派图租赁承担相应成本费用的内容，则派图租赁应按合同中双方约定的结算方式，定期由派图租赁系统自动结算的方式为商户支付活动期间产生的成本费用。</p>
                            <p>4.7 派图租赁用户退订情形，派图租赁应在收到退订申请后告知商户取消对应租赁服务项目。商户应根据派图租赁通知做相应的调整。</p>
                            <p>4.8 如商户违反本协议第三条项下约定的义务，派图租赁有权随时停止提供服务，并操作商户商品信息下线。</p>
                            <p>4.9 本协议项下服务终止时，派图租赁有权删除派图租赁网上服务平台上的商户已发布的商品租赁信息或者服务信息，且有权拒绝向商户提供相关信息；派图租赁有权保存商户资质信息、商品信息、交易记录等相关资料。</p>
                            <h3>五、知识产权</h3>
                            <p>5.1 双方的品牌归各自所有。双方均不可在对方未经授权的情况下使用对方名称、Logo以及涉及相关内容的销售、促销宣传材料及广告、报纸、杂志、宣传单等，如因此产生的所有不良后果及损失违约方全部承担。本协议第4.2条有约定的除外。</p>
                            <h3>六、安全保障</h3>
                            <p>6.1 商户提供的资质应符合国家相关法律的规定，并且符合发布相关商品的要求，当平台要求提供时可以在24小时内提供资质完成备案，如果因无法提供相关资质导致平台的损失需要由商户承担。</p>
                            <p>6.2 商户提供的租赁服务或其他服务应符合国家法律、法规、规章的规定。如因商户提供的租赁服务在服务质量或安全问题造成派图租赁用户投诉、索赔、经济损失等相关后果均由商户承担，如派图租赁基于前述情况向消费者先行赔付的，派图租赁有权向商户追偿，追偿方式包括但不限于在结算给商户的相关款项中直接扣除该赔付金额。</p>
                            <h3>七、违约责任</h3>
                            <p>7.1 任何一方违反本协议所规定的义务导致另一方受到包括但不限于投诉、举报、诉讼或处罚、赔偿等损失，违约方在收到守约方要求纠正其违约行为的书面通知之日，应立即停止其违约的行为，并在10日内赔偿守约方因此受到的所有损失。</p>
                            <p>7.2 本协议任何一方均应对其获得的对方的业务、经营、财务状况和其他保密资料予以严格保密，不得以任何形式向任何第三方披露。如因任何一方未能履行保密义务而给其他方造成任何损失的，应承担赔偿责任。</p>
                            <h3>八、免责条款</h3>
                            <p>8.1 不论在何种情况下，派图租赁均不对由于互联网正常的设备维护，互联网络连接故障，电脑、通讯或其他系统的故障，电力故障，黑客攻击、病毒侵袭、罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，战争，政府行为，司法行政机关的命令或第三方的不作为而造成的不能服务或延迟服务承担责任。</p>
                            <p>8.2 商户同意自行承担使用网络服务的风险，派图租赁不作任何类型的担保，包括但不限于：不担保服务一定能满足商户的要求；不担保服务不会受中断，对服务的及时性，安全性，出错发生不担保；对在派图租赁上以及第三方合作得到的任何服务或交易进程，不作担保；对派图租赁服务所涉及的技术及信息的有效性、准确性、正确性、可靠性、稳定性、完整性和及时性不作出任何承诺和保证；不担保派图租赁服务的适用性没有错误或疏漏。</p>
                            <h3>九、争议解决</h3>
                            <p>9.1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。</p>
                            <p>9.2 就本协议内容或执行发生任何争议，应友好协商解决。协商不成时，均可向被告所在地的有管辖权的法院诉讼解决。</p>
                        </div>
                    </div>

                    <!-- 第二步 -->
                    <div class="second-step" v-if="currentIndex==1">
                        <div class="form-item">
                            <div class="title">商家店铺名称</div>
                            <input type="text" placeholder="请输入商店名称" v-model="apply_form.shop_name"/>
                            <div class="warn" v-if="warning.shop_name">*{{warning.shop_name}}</div>
                        </div>
                        <div class="form-item">
                            <div class="title">公司电话</div>
                            <input type="text" placeholder="请输入商店电话" v-model="apply_form.shop_mobile" />
                            <div class="warn" v-if="warning.shop_mobile">*{{warning.shop_mobile}}</div>
                        </div>
                        <div class="form-item">
                            <div class="title">办公室地址(滑动选择地址)</div>
                            <div class="address-picker" @click="chooseCity">
                                <span v-if="addressPickerValue">{{addressPickerValue}}</span>
                                <span v-else>请选择</span>
                                <span class="iconfont" :class="pickerShow?'iconxiajiantou':'iconyoujiantou'"></span>
                            </div>
                            <input type="text" placeholder="请输入详细地址" v-model="addressInDetail" />
                            <div class="warn" v-if="warning.address">*{{warning.address}}</div>
                        </div>
                        <div class="form-item">
                            <div class="title">电子邮箱</div>
                            <input type="text" placeholder="请输入电子邮件" v-model="apply_form.email" />
                            <div class="warn" v-if="warning.email">*{{warning.email}}</div>
                        </div>
                        <div class="form-item">
                            <div class="title">联系人</div>
                            <input type="text" placeholder="请输入联系人姓名" v-model="apply_form.contact_name" />
                            <div class="gender">
                                <radio-group @change="genderRadioChange">
                                    <label class="radio" v-for="item in genders" :key="item.value">
                                    <radio :value="item.value" :checked="item.checked" color="#651FFF" />
                                    {{item.label}}
                                    </label>
                                </radio-group>
                            </div>
                            <div class="warn" v-if="warning.contact_name">*{{warning.contact_name}}</div>
                        </div>
                        <div class="form-item">
                            <div class="title">联系人电话</div>
                            <input type="text" placeholder="请输入联系人电话" v-model="apply_form.contact_mobile" />
                            <div class="warn" v-if="warning.contact_mobile">*{{warning.contact_mobile}}</div>
                        </div>
                        <div class="form-item">
                            <div class="title">上传合同照片</div>
                            <div class="image-box">
                                <div class="img">
                                    <image class="image" :src="host+apply_form.license" v-if="apply_form.license" mode="aspectFill"></image>
                                    <div class="del" @click="delLicense">
                                        <span class="iconfont iconpicture-delet"></span>
                                    </div>
                                </div>
                                
                                <div class="upload" @click="uploadLicense">
                                    <div>
                                        <p class="iconfont icontupian"></p>
                                        <p class="text">本地</p>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="warn" v-if="warning.license">*{{warning.license}}</div>
                        </div>
                    </div>

                    <!-- 第三步 -->
                    <div class="third-step"  v-if="currentIndex==2">
                        <!-- <button type="primary" @click="doss">点击签名1</button> -->
                        <!-- #ifdef h5 -->
                        <div class="imgs" ref="imageTofile">
                            <div class="img">
                                <div class="re-img">
                                    <image :src="host+contract" class="contract-img" mode="widthFix"></image>
                                    <div class="contract-num">合同编号：{{contract_num}}</div>
                                </div>
                            </div>  
                            
                            <div class="agreement">
                                <div class="agreement-radio">
                                    <label v-for="(item, index) in agreement" :key="index" class="ridio" @click="radioAgree">
                                        <radio  :checked="current"  color="#651FFF"/>
                                        {{item.name}}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <catSignature canvasId="canvas1"  @close="close" @save="save" :visible="isShow" />
                        <!-- #endif -->
                        <!-- #ifdef MP-WEIXIN -->
                        <div class="notice">
                            <p>请点击 "下载合同" 仔细查阅后打印文档 , 填写好信息并签名 , 然后拍照上传合同图片。</p>
                            
                            <p style="margin:20rpx 0">您当前合同编号为 : {{contract_num}}</p>
                        </div>
                         <div class="nextstep-btn" @click="openFile" >查看合同</div>

                         <div class="form-item">
                            <div class="title">上传营业执照</div>
                            <div class="image-box">
                                <div class="img">
                                    <image class="image" :src="host+apply_form.contract" v-if="apply_form.contract" mode="aspectFill"></image>
                                    <div class="del" @click="delContract">
                                        <span class="iconfont iconpicture-delet"></span>
                                    </div>
                                </div>
                                
                                <div class="upload" @click="uploadContract">
                                    <div>
                                        <p class="iconfont icontupian"></p>
                                        <p class="text">本地</p>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="warn" v-if="warning.license">*{{warning.license}}</div>
                        </div>
                        <!-- #endif -->
                    </div>

                    <!-- 第四步 -->
                    <div class="four-step"  v-if="currentIndex==3">
                        <div class="bind-phone">
                            <span class="iconfont iconchenggong"></span>
                            <span class="success-data">申请成功，等待审核</span>
                        </div>

                        <div class="confirm" @click="goBack">去首页</div>
                    </div>
                    <div class="nextstep-btn" @click="next" v-if="currentIndex!=3">下一步</div>
                </div>
            </div>
            <div class="is-merchant" v-else>
                <div class="bind-phone">
                    <span class="iconfont iconchenggong"></span>
                    <span class="success-data">您已经是商家。</span>
                </div>

                <div class="confirm" @click="goBack">去首页</div>
            </div>  
        </div>
        
        
        <mpvue-city-picker :acpData="acpData" ref="mpvueCityPicker"  @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</div>
</template>

<script>
//#ifdef H5
// import SignaturePad from 'signature_pad/dist/signature_pad'
import html2canvas from 'html2canvas/dist/html2canvas'
//#endif
import catSignature from "@/components/cat-signature/cat-signature.vue"
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
import { mapState } from 'vuex'
import {toBeMerchant} from '@/common/api/api'
import {uploadImg,uploadBase64Img} from "@/common/utils/uploadImg.js"
	export default {
        components:{
            mpvueCityPicker,catSignature
        },
        computed: {
			...mapState(['user'])
		},
	    data() {
	        return {
                host:this.$qiniuHost,
                currentIndex:0,
				apply_form:{
                    type:1,
                    shop_name:'',
                    shop_mobile:'',
                    address	:'',
                    email:'',
                    contact_name:'',
                    contact_mobile:'',
                    license:'',
                    contract:'',
                },
                contract:this.config.contract,
                genders: [
                    { label: "先生", value: "1", checked: false },
                    { label: "女士", value: "2", checked: false }
                ],
                addressPickerValue:'',
                addressInDetail:'',
                pickerShow:false,
                cityPickerValue:[0,1,2],
                warning:{
                    shop_name:'',
                    shop_mobile:'',
                    address	:'',
                    email:'',
                    contact_name:'',
                    contact_mobile:'',
                    license:'',
                    contract:'',
                },
                is_valid:false,
                is_h5:false,
                img1:'',
                img2:'',
                img3:'',
                isShow:false,
                agreement:[{name:'我已阅读并同意合同内容',value:'1'}],
                current:true,
                contract_num:'',
				acpData:{
					areaData:[],
					cityData:[],
					provinceData:[],
				}
	        };
	    },
	    onLoad(options){
			//#ifdef MP-WEIXIN
            this.is_h5 = false;
            //#endif
            //#ifdef H5
            this.is_h5 = true;
            //#endif
			this.initAcpData();
        },
        onReady(){
            
        },
        mounted() {
            // console.log('user--',this.user.paitume_user.role)

            let day = new Date();
            console.log('day.getFullYear()',day.getFullYear())
            this.contract_num = JSON.stringify(day.getFullYear()) + JSON.stringify(day.getMonth()+1) + JSON.stringify(day.getDate()) + this.user.paitume_user.id;
            
        },
		methods:{
			initAcpData(){
				console.log('初始化ACP area city province数据');
				if (this.util.getStorage('acpData')) {
					this.acpData = this.util.getStorage('acpData');
					console.log('有ACP数据',acpData);
					
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
			},
            openFile(){
                uni.downloadFile({
                    url: 'https://pic.paitume.com/%E5%90%88%E5%90%8C.docx',
                    success: function (res) {
                        var filePath = res.tempFilePath;
                        uni.openDocument({
                        filePath: filePath,
                        success: function (res) {
                            console.log('打开文档成功');
                        }
                        });
                    }
                });
            },
            chooseCity() {
                this.$refs.mpvueCityPicker.show();
                this.pickerShow = true;
			},
            onConfirm(e) {
                console.log('eeee',e)
                this.addressPickerValue = e.label.replace(/-/g, "")
                // this.cityPickerValue = e.value;
                this.pickerShow = false;
            },
            onCancel(e) {
				this.pickerShow = false;
			},
            uploadLicense(){
                uploadImg().then(res => {
                    //#ifdef MP-WEIXIN
                    this.apply_form.license = res.key;
                    //#endif
                    //#ifdef H5 || APP-PLUS
                    this.apply_form.license = res;
                    //#endif
                })
            },
            uploadContract(){
                uploadImg().then(res => {
                    //#ifdef MP-WEIXIN
                    this.apply_form.contract = res.key;
                    //#endif
                    //#ifdef H5 || APP-PLUS
                    this.apply_form.contract = res;
                    //#endif
                })
            },
            delLicense(){
                this.apply_form.license = '';
            },
            delContract(){
                this.apply_form.contract = '';
            },
            validForm(){
                this.is_valid = true;
                if(!this.apply_form.shop_name||!(this.apply_form.shop_name.length>=4&&this.apply_form.shop_name.length<=32)){
                    this.warning.shop_name = '长度应为4-32个字符';
                    this.is_valid = false;
                }else{
                    this.warning.shop_name = ''
                }
                if(!this.apply_form.shop_mobile||!/\d{3}-\d{8}|\d{4}-\d{7}|(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.apply_form.shop_mobile)){
                    this.warning.shop_mobile = '公司电话格式不正确';
                    this.is_valid = false;
                }else{
                    this.warning.shop_mobile = ''
                }
                if(!this.apply_form.address){
                    this.warning.address = '办公室地址不能为空';
                    this.is_valid = false;
                }else if(!this.addressPickerValue){
                    this.warning.address = '请选择地址';
                    this.is_valid = false;
                }else if(!this.addressInDetail){
                    this.warning.address = '请填写详细地址';
                    this.is_valid = false;
                }else{
                    this.warning.address = ''
                }
                if(!this.apply_form.email||!/^[A-Za-z0-9\x80-\xff]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.apply_form.email)){
                    this.warning.email = '电子邮箱格式不正确';
                    this.is_valid = false;
                }else{
                    this.warning.email = ''
                }
                if(!this.apply_form.contact_name){
                    this.warning.contact_name = '联系人姓名不能为空';
                    this.is_valid = false;
                }else{
                    this.warning.contact_name = ''
                }
                if(!this.apply_form.contact_mobile||!/^1[3456789]\d{9}$/.test(this.apply_form.contact_mobile)){
                    this.warning.contact_mobile = '联系人手机号码格式不正确';
                    this.is_valid = false;
                }else{
                    this.warning.contact_mobile = ''
                }
                if(!this.apply_form.license){
                    this.warning.license = '尚未上传营业执照图片';
                    this.is_valid = false;
                }else{
                    this.warning.license = ''
                }
                // if(!this.apply_form.contract){
                //     this.warning.contract = '尚未上传合同图片';
                //     this.is_valid = false;
                // }else{
                //     this.warning.contract = ''
                // }
                if(this.is_valid){
                    this.currentIndex = 2;
                }else{
                    uni.showModal({title: '提示',content: '请确认资料填写合法无误！',showCancel:false});
                }
                
            },
			applyForm(){
                this.$http.post(toBeMerchant.apply,this.apply_form).then(res => {
                    uni.showToast({title: '提交申请成功',icon: 'success',duration:2000});
                    this.currentIndex = 3;
                    console.log(res--)
                }).catch(err => {
                    console.log('---',err);
                    if(err=='您已经申请过'){
                        this.currentIndex = 3;
                    }
				})
            },
            next(){
                if(this.currentIndex==0){
                    this.currentIndex = 1;
                    uni.pageScrollTo({scrollTop: 0});
                }else if(this.currentIndex==1){
                    this.apply_form.address = this.addressPickerValue+this.addressInDetail;
                    this.validForm();
                }else if(this.currentIndex==2){
                    if(this.current){
                        // #ifdef H5
                        this.toImage();
                        setTimeout(()=> {
                            this.applyForm();
                        },1000)
                        // #endif
                        // #ifdef MP-WEIXIN
                        this.applyForm();
                        // #endif
                    }else{
                        uni.showModal({title: '提示',content: '尚未同意合同！',showCancel:false});
                    }
                    
                }else if(this.currentIndex==1){
                    
                }
            },


            doss(){
                this.isShow = true;
            },
            close(){
                this.isShow = false;
            },
            save(val){
                this.isShow = false;
                this.img1 = val;
                console.log('this.img1',val)
               setTimeout(()=>{
					this.toImage();
				},2000);
            },
            genderRadioChange(e) {
                // this.apply_form.sex = e.target.value;
                console.log("e.target.value", e.target.value);
            },
            radioChange(e){
                console.log('eeeee----',e)
                for (let i = 0; i < this.agreement.length; i++) {
                    if (this.agreement[i].value === e.target.value) {
                        this.current = i;
                        console.log('this.current',this.current)
                        break;
                    }
                }
            },
            radioAgree(){
                this.current = !this.current;
            },
            toImage() {
        　　　　// 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
        　　　　html2canvas(this.$refs.imageTofile, {
        　　　　　　backgroundColor: null
        　　　　}).then((canvas) => {
                    let url = canvas.toDataURL('image/png');
                    let file = this.base64ToPng(url);
                    uploadBase64Img(this.getObjectURL(file)).then(res => {
                        this.apply_form.contract = res;
                    })
                    console.log('(url)--',this.getObjectURL(file))
                }).catch(err => {
                    console.log('err---',err)
                })
        　　},
            base64ToPng(dataurl, filename = 'file'){
                let arr = dataurl.split(',')
                let mime = arr[0].match(/:(.*?);/)[1]
                let suffix = mime.split('/')[1]
                let bstr = atob(arr[1])
                let n = bstr.length
                let u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new File([u8arr], `${filename}.${suffix}`, {
                    type: mime
                })
            },
            getObjectURL(file) {
                var url = null;
                if (window.createObjectURL != undefined) {
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) {
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) {
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;
            },
            goBack(){
                uni.switchTab({url: "/pages/tabBar/home"});
            },
            
		}
	}
</script>
	
<style lang="scss" scope>
.step-box{
    position: fixed;
    padding: 40rpx 0rpx;
    background-color: #ffffff;
    z-index: 2;
    .step-item{
        padding: 0rpx 86rpx;
        display: flex;
        justify-content: space-between;
        .dots{
            display: flex;
            align-items: center;
            .dot{
                display: inline-block;
                width: 12rpx;
                height: 12rpx;
                border-radius: 12rpx;
                background-color: #999999;
            }
            .line{
                width: 150rpx;
                height: 2rpx;
                margin: 0 15rpx;
                background-color: #999999;
                display: inline-block;
            }
            .active{
                background-color: #651FFF;
            }
        }
    }
    
    .step-text{
        display: flex;
        justify-content: space-between;
        padding: 20rpx 45rpx 0 10rpx;
        p{
            font-size: 20rpx;
            color: #999999;
        }
        .item2{
            margin-right: 40rpx;
        }
        .item3{
            margin-right: 30rpx;
        }
        .active{
            color: #651FFF;
        }
    }
}
.step-content{
    position: relative;
    top: 140rpx;
    z-index: 1;
    .first-step{
        .agreement-wrap{
            padding: 20rpx;
            h1{
                font-weight: bold;
                font-size: 36rpx;
                color: #333333;
                text-align: center;
                width: 100%;
                margin: 25rpx;
            }
            h3{
                font-size: 32rpx;
                color: #333333;
                margin-bottom: 15rpx;
            }
            p{
                font-size: 28rpx;
                color: #666666;
                margin-bottom: 20rpx;
            }
        }
    }
    .third-step{
        .imgs{
            
            background-color: #ffffff;
            
        }
        .img{
            display: flex;
            justify-content: center;
            
            .re-img{
                position: relative;
                width: 100%;
                margin: 0 auto;
                 .contract-img{
                    width: 750rpx;
                }
                .contract-num{
                    position: absolute;
                    top: 5%;
                    right: 8%;
                    font-size: 16rpx;
                    color: #999999;
                }
            }
            
        }
        
        .agreement-radio{
            display: flex;
            justify-content: flex-end;
            margin-top: -20rpx;
            font-size: 24rpx;
            color: #333333;
            background-color: #ffffff;
            padding: 20rpx 30rpx;
            .ridio{
                margin-left: 30rpx;
            }
            radio{ 
                transform:scale(.7)  
            }
        }
        .notice{
            padding: 20rpx 30rpx;
            color: #333333;
            font-size: 30rpx;

        }
        
    }
    .four-step{
        padding: 40rpx;
        .bind-phone {
            margin: 50rpx 0;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-content: center;
            align-items: center;
            span {
                display: block;
            }
            .iconchenggong {
                font-size: 180rpx;
                color: #651fff;
            }
            .success-data {
                font-size: 32rpx;
                color: #333333;
                margin-top: 20rpx;
            }
            }
            .confirm {
                width: 100%;
                padding: 20rpx 0;
                text-align: center;
                background-color: #651fff;
                color: #ffffff;
                font-size: 32rpx;
                border-radius: 8rpx;
            }
    }
    .second-step,.third-step{
        .form-item{
            padding: 0 20rpx;
            margin-top: 50rpx;
            .title{
                font-size: 28rpx;
                color: #333333;
                font-weight: bold;
                margin-bottom: 10rpx;
            }
            input,.address-picker{
                padding: 20rpx;
                font-size: 28rpx;
                background-color: #ffffff;
                color: #999999;
            }
            .warn{
                font-size: 22rpx;
                color: #F85D19;
                margin: 10rpx 0;
            }
            .address-picker{
                margin-bottom: 20rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span{
                    display: inline-block;
                }
                
            }
            .image-box{
                display: flex;
                .img{
                    position: relative;
                }
                .image{
                    margin-right: 20rpx;
                    width: 168rpx;
                    height: 168rpx;
                }
                .del{
                    position: absolute;
                    right: 20rpx;
                    bottom: 10rpx;
                    background-color: rgba(0, 0, 0, 0.5);
                    width:60rpx;
                    height: 60rpx;
                    line-height: 60rpx;
                    text-align: center;
                    color: #ffffff;
                }
                .upload{
                    width: 168rpx;
                    height: 168rpx;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: center;
                    color: #999999;
                    background-color: #ffffff;
                    justify-content: center;
                    .iconfont{
                        font-size: 40rpx;
                    }
                    .text{
                        font-size: 24rpx;
                    }
                }
            }
            .gender {
                font-size: 28rpx;
                margin: 40rpx 0;
                width: 350rpx;
            }
            .radio {
                margin-right: 40rpx;
            }

        }
    }
    
    .nextstep-btn{
        margin: 20rpx;
        background-color: #651FFF;
        color: #ffffff;
        font-size: 32rpx;
        padding: 10rpx;
        text-align: center;
        border-radius: 4rpx;
        height: 65rpx;
        line-height: 65rpx;

    }
}
.is-merchant{
    padding: 40rpx;
        .bind-phone {
            margin: 50rpx 0;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-content: center;
            align-items: center;
            span {
                display: block;
            }
            .iconchenggong {
                font-size: 180rpx;
                color: #651fff;
            }
            .success-data {
                font-size: 32rpx;
                color: #333333;
                margin-top: 20rpx;
            }
            }
            .confirm {
                width: 100%;
                padding: 20rpx 0;
                text-align: center;
                background-color: #651fff;
                color: #ffffff;
                font-size: 32rpx;
                border-radius: 8rpx;
            }
}
</style>
