<template>
    <div class="pageContains"  :class="{pageContainsToApp:toApp}">
      <div class="asistance-wrapper" v-show="toApp">
        <div class="open-app">
          <img class="ml-logo" src="../assets/image/ml_icon_logo@2x.png" alt="">
          <div class="ml-slogan">上麦邻租房&nbsp;&nbsp;&nbsp;轻松租好房</div>
          <div class="open-app-btn">
            <img @click="toAppDownloadPage" src="../assets/image/ml_btn_open@2x.png" alt="">
          </div>
        </div>
      </div>
        <div class="topImg">

            <!-- <div class="city">{{curCity}}</div> -->
             <div class="city"><city-list @getCitiCode="getCitiCode"></city-list></div>
            <div @click = "actRule" class="actRule">活动规则</div>
        </div>
        <user-luck></user-luck>
        <div class="luckOpportArea">
          <div class="luckOpport">
            <tiger class="mlTiger"
                 ref="tiger"
                v-on:onTigerSuccess="onTigerSuccess"
                v-on:onTigerFail="onTigerFail"
                :tigerPrizeNumber="tiger.tigerPrizeNumber"
                :tigerImgList="tiger.tigerImgList">
            </tiger>
          </div>
          <div class="luckBtn">
            <!-- 抽奖按钮 -->
            <div class="startLuck">
              <img :src="require('../assets/image/ml_btn_prize_bottom@2x.png')" @click="startTiger" />
              <img class="top" :src="require('../assets/image/ml_btn_prize_top@2x.png')" @click="startTiger" />
            </div>
              <!-- 我的奖品 -->
            <div class="giftBtn" @click="getGiftList">
                <img :src="require('../assets/image/ml_bt_gift_default@2x.png')" />
            </div>
          </div>
        </div>
        <div class="luckList">
          <div class="luckListTop">
            <p>获得更多抽奖次数</p>
            <p>我的抽奖次数<span class="span">{{residualTimes}}</span>次</p>
          </div>
            <ul class="luckCondition">
              <li v-for="(item,index) in activityTasks" :key="index" @click="getChanceLuck(item.code,item.button)">
                  <span>{{item.chance}}/<em>{{item.times}}</em></span>
                  <p>{{item.desc}}</p>
                  <div v-if="item.button!=='已完成'" class="luckListBtn">{{item.button}}</div>
                  <div v-if="item.button==='已完成'" class="luckListBtn luckListBtnDis">{{item.button}}</div>
              </li>
            </ul>
        </div>
        <div v-if="houseList.length>0"><house-list :houseList="houseList"></house-list></div>
        <div class="luckFooter">
            <div class="more"  @click="moreLink">
                <img :src="require('../assets/image/ml_bt_more@2x.png')" alt="">
            </div>
            <img :src="require('../assets/image/ml_slogn@2x.png')" alt="">
        </div>
        <!-- 活动规则 -->
        <van-popup  :close-on-click-overlay="true" class="ml-login-model" v-model="ruleModelVisible" >
          <Rules></Rules>
          <div class="ml-model-close" @click="closeRuleModel">
            <img src="../assets/image/ml_btn_close@2x.png" alt="">
          </div>
        </van-popup>
        <!-- 奖品列表 -->
        <van-popup :close-on-click-overlay="true" style="background:none"  bind:close="closeGiftModel" class="ml-login-model" v-model="giftModelVisible" >
          <div class="giftList">
            <div class="giftTitle"></div>
            <ul v-if="prizes.length > 0">
              <li v-for="(item,key) in prizes" :key="key">
                  <p>{{key+1}} {{item.prizeName}} </p>
                  <span> {{item.receiveTime}} </span>
              </li>
            </ul>
            <ul v-if="!prizes.length">
               <li>
                  <span>暂无奖品</span>
              </li>
            </ul>
          </div>
          <div class="ml-model-close" @click="closeGiftModel">
            <img src="../assets/image/ml_btn_close@2x.png" alt="">
          </div>
        </van-popup>
        <!-- 中奖结果 -->
        <van-popup :close-on-click-overlay="true" style="background:none"  bind:close="closeTigerResultModel(false)" class="ml-login-model" v-model="tigerResultModelVisible" >
          <div class="giftList">
            <div class="tiger-result-title"></div>
            <div class="tiger-result-content">
              <img :src="prize.url" alt=""/>
              <p>恭喜你抽中</p>
              <p>{{prize.name}}</p>
            </div>
            <img class="tiger-result-btn" src="../assets/image/ml_btn_continue_tiger@2x.png" alt="" @click="closeTigerResultModel(true)"/>
          </div>
          <div class="ml-model-close" @click="closeTigerResultModel(false)">
            <img src="../assets/image/ml_btn_close@2x.png" alt="">
          </div>
        </van-popup>
        <!-- 登录弹窗 -->
        <van-popup :close-on-click-overlay="false" class="ml-login-model" v-model="loginModelVisible">
          <login-model ref="loginForm" @loginSucess="loginSucess"  roles="user"></login-model>
          <div class="ml-model-close" @click="closeLoginModel">
            <img src="../assets/image/ml_btn_close@2x.png" alt="">
          </div>
        </van-popup>
        <!-- 分享弹层 -->
       <van-popup class="ml-lead-model" v-model="leadModelVisible">
        <div class="ml-lead-container">
          <img class="ml-lead-arrow" src="../assets/images/cc-arrow-up.svg" alt="">
          请点击右上角分享
        </div>
    </van-popup>
    </div>
</template>
<script>
import { getWxShareInfo } from '@/utils/wxshare'
import { getUserData, setUserData } from '@/utils/auth'
import { Popup, Dialog } from 'vant'
import LoginModel from './components/loginModel'
import Bridge from '@/utils/bridge'
import { joinActivityApi, activityList } from '@/api/activePage'
import { getBrowser } from '@/utils/browser'
import Tiger from '../components/Tiger/Tiger'
import Rules from './components/rulesManageModel'
import userLuck from './components/luckUser'
import houseList from './components/houseList'
import cityList from './components/cityList'

const userAgent = navigator.userAgent.toLocaleLowerCase() // 获取浏览器
const activityCode = 'MJGY20181225' //  活动code

let initPageInfoData = { // 分享文案
  title: '麦邻租房狂欢节',
  shareData: {
    title: '已有1098个用户抽到大奖，奖品有限，先到先得！',
    introduction: '还有华为mate20、小米音响、MAC口红等未被抽走，来抢!',
    thumbnail: 'https://www.mdguanjia.com/images/wx_share__ml.png',
    linkUrl: location.href
  }
}
export default {
  name: 'houseFestival',
  components: {
    [Popup.name]: Popup,
    [Dialog.name]: Dialog,
    LoginModel,
    Tiger,
    Rules,
    houseList,
    userLuck,
    cityList
  },
  data () {
    return {
      urlSearchParams: {},
      isLogin: false, // 是否已登录
      isAPP: false, // 是否APP内
      app_ios: false, // ios
      app_andriod: false, // andriod
      // countHelpCustomer: '', // 助力人数
      ruleModelVisible: false,
      giftModelVisible: false,
      tigerResultModelVisible: false,
      loginModelVisible: false,
      leadModelVisible: false,
      customerId: '',
      sessionId: '',
      cityCode: '330100',
      curCity: '杭州市',
      residualTimes: 0, // 抽奖次数
      luckPersonList: [
        '13098998787抽中了小熊加湿器',
        '13098998787抽中了苹果手机',
        '13098998787抽中了电视机'
      ],
      newsAnimate: false,
      activeIndex: 0,
      prizes: [],
      houseList: [],
      app_location: null,
      tiger: {
        tigerImgList: [
          require('../assets/image/ml_gift_1@2x.png'),
          require('../assets/image/ml_gift_2@2x.png'),
          require('../assets/image/ml_gift_3@2x.png')
        ],
        tigerPrizeNumber: 10 // 奖品总数
      },
      activityTasks: [],
      prizeList: {
        'MJGY201812256': {
          index: 2,
          name: '小熊电饼铛'
        },
        'MJGY201812252': {
          index: 3,
          name: '懒人沙发'
        },
        'MJGY201812258': {
          index: 4,
          name: '美图T9手机'
        },
        'MJGY201812257': {
          index: 5,
          name: '华为mate 20'
        },
        'MJGY201812255': {
          index: 7,
          name: '小米AI智能音箱'
        },
        'MJGY201812254': {
          index: 8,
          name: '苏泊尔多功能电火锅'
        },
        'MJGY201812253': {
          index: 9,
          name: 'MAC口红'
        },
        'MJGY201812251': {
          index: 10,
          name: '优惠券'
        }
      },
      doPrizing: false, // 是否正在抽奖, 防止多次点击
      prize: {},
      toApp: false
    }
  },
  created () {
    if (getBrowser().isQQ && window.name !== 'hasLoad') {
      window.location.reload() // qq返回活动页 页面错乱
      window.name = 'hasLoad'
    } else {
      window.name = ''
    }
    // 获取search数据
    this.urlSearchParams = this.$route.query
    // 字符串查找不用includes  IOS8不兼容
    this.app_ios = userAgent.indexOf('fht-ios') > -1
    this.app_andriod = userAgent.indexOf('fht-android') > -1
    this.isAPP = this.app_ios || this.app_andriod
    // 进入页面 获取用户信息
    this.initPage()
  },
  computed: {

  },
  mounted () {},
  methods: {
    loginSucess () { // 登录成功  刷新页面 并参加活动
      this.loginModelVisible = false
      this.loginTask(getUserData('user').sessionId)
      setTimeout(() => {
        window.location.reload() // 登录成功 调用参加活动接口成功后  刷新页面
      }, 1000)
    },
    // 获取用户信息
    initPage () {
      let _this = this
      const getSessionId = new Promise(function (resolve, reject) {
        if (_this.urlSearchParams.sessionId) { // 从好友助力页面跳过来的
          setUserData({
            sessionId: decodeURIComponent(_this.urlSearchParams.sessionId)
          }, 'user')
          resolve({
            sessionId: decodeURIComponent(_this.urlSearchParams.sessionId)
          })
        } else if (_this.app_ios) { // iosApp内
          Bridge.callHandler('getParamsFromNative', {}, function responseCallback (responseData) {
            _this.app_location = responseData.params
            resolve(responseData)
          })
        } else if (_this.app_andriod) { // androidApp内
          let app_andriod_params = JSON.parse(window.SetupJsCommunication.getParamsFromNative())
          _this.app_location = app_andriod_params.params
          resolve(app_andriod_params)
        } else {
          resolve(getUserData('user')) // 从本地缓存拿sessionId
        }
      })
      getSessionId.then((res) => {
        // 获取当前城市定位
        // this.getCurrentPosition()
        if (!res || !res.sessionId) {
          this.initApp()
          return false
        }
        this.sessionId = res.sessionId
        this.isLogin = true
        this.joinActivity()
        this.initApp()
        _this.loginTask(res.sessionId)
        if (getBrowser().isWechat || this.isAPP) {
          this.toApp = false
        } else {
          this.toApp = true
        }
        // this.getUserInfo()
      }).catch((error) => {
        this.initApp()
        console.log(error)
        // 获取当前城市定位
        // this.getCurrentPosition()
      })
    },
    /**
     * 注册IOS/Andriod方法，获取页面信息
     */
    initApp () {
      // 已登录修改分享链接地址
      if (this.isLogin) {
        initPageInfoData.shareData.linkUrl = window.location.origin + window.location.pathname + '?addParams=111111#/houseFestival?sessionId=' + encodeURIComponent(this.sessionId) // addParams: app分享到qq的时候会在后面拼上一段参数导致页面访问错误，这边需要主动加上参数
        initPageInfoData.shareData.introduction = '已有1098个用户抽到大奖，奖品有限，先到先得!'
      } else {
        initPageInfoData.shareData = {
          title: '已有1098个用户抽到大奖，奖品有限，先到先得!',
          introduction: ' 还有华为mate20、小米音响、MAC口红等未被抽走，来抢！',
          thumbnail: 'https://www.mdguanjia.com/images/wx_share__ml.png',
          linkUrl: location.origin + location.pathname
        }
        this.getUserInfo() // 没有登录的时候也要调用进度接口
      }
      if (this.app_ios === true) {
        Bridge.registerHandler('initPageInfo', (data, responseCallback) => {
          responseCallback(initPageInfoData)
        })
        Bridge.registerHandler('refreshPage', function (data, responseCallback) {
          window.location.reload()
        })
      } else if (this.app_andriod === true) {
        window.SetupJsCommunication.initPageInfo(
          JSON.stringify(initPageInfoData)
        )
        window.refreshPage = function () {
          window.location.reload()
        }
      } else {
        getWxShareInfo(initPageInfoData.shareData)
      }
    },
    // 登录
    loginTask (sessionId) {
      let params = {
        activityCode: activityCode,
        sessionId: sessionId
      }
      activityList.loginTaskApi(params).then((res) => {
        if (res.data.residualTimes) {
          this.residualTimes = res.data.residualTimes
        }
        if (res.code * 1 === 0) {
          this.getUserInfo()// 获取活动信息
        }
      })
    },
    // 登录方法
    loginAction () {
      if (this.isAPP) {
        const bridgeParam = {
          libCode: 5001,
          refresh: true
        }
        if (this.app_ios) {
          Bridge.callHandler('jumpToNativePages', bridgeParam, function responseCallback (responseData) {
          })
        } else {
          try {
            window.SetupJsCommunication.jumpToNativePages(JSON.stringify(bridgeParam))
          } catch (error) {
            this.$toast('fail', 'Andriod调用失败')
            console.log(error)
          }
        }
      } else {
        this.loginModelVisible = true
      }
    },
    // 参加活动获取
    joinActivity () {
      joinActivityApi.joinActivity({
        devId: '',
        sessionId: this.sessionId,
        activityCode: activityCode
      }).then((res) => {
        if (res.code === '0') {
          this.customerId = res.data.customerId || ''
          // 判断访问来源
          // if (getBrowser().isQQ || getBrowser().isWechat || this.isAPP) {
          // this.leadModelVisible = true
          // } else {
          // Dialog.alert({
          //   message: '请通过微信或麦邻租房app参加此活动'
          // })
          // }
        } else {
          Dialog.alert({
            message: res.message
          })
        }
      })
    },
    // 获取活动用户信息
    getUserInfo () {
      let params = {
        activityCode: activityCode
      }
      if (this.isLogin) {
        params.sessionId = this.sessionId
      }
      activityList.getTaskData(params).then((res) => { // 任务进度
        this.activityTasks = []
        if (res.data) {
          this.activityTasks = res.data.activityTask
          this.residualTimes = res.data.residualTimes
          if (!res.data.activityStatus) {
            Dialog.alert({
              message: '活动已经结束'
            }).then(() => {
              window.location.href = process.env.APP_DOWNLOAD_URL
            })
          }
        }
      })
    },
    getPrizes () {
      activityList.myPrizesApi({
        sessionId: this.sessionId,
        activityCode: activityCode
      }).then((res) => { // 我的奖品列表
        this.giftModelVisible = true
        if (res.data) {
          this.prizes = res.data.prizes
        }
      })
    },
    // 点击抽奖
    startTiger (e) { // 点击抽奖
      if (!this.isLogin) {
        // 调用登录方法
        this.loginAction()
        return false
      }
      if (this.doPrizing) {
        return
      }
      if (this.residualTimes === 0) {
        this.$toast('抽奖机会已用完')
        return
      }
      this.doPrizing = true
      activityList.doPrize({
        sessionId: this.sessionId,
        activityCode: activityCode
      }).then(res => {
        if (res.code !== '0') {
          this.$toast(res.message)
          this.doPrizing = false
          this.$refs.tiger.stop()
          return
        }
        this.residualTimes -= 1
        this.prize = res.data.prize
        // this.$refs.tiger.start(this.prizeList[this.prize.code].index)
        this.$refs.tiger.choose(this.prizeList[this.prize.code].index)
      }, (err) => {
        this.doPrizing = false
        this.$refs.tiger.stop()
        console.info(err)
      }).catch(e => {
        this.doPrizing = false
        this.$refs.tiger.stop()
        console.info(e)
      })
      this.$refs.tiger.startNow()
    },
    getCitiCode (codeId) {
      console.log('codeId', codeId)
      this.getHouseListData(codeId.id)
    },
    // 获取房源钜惠列表
    getHouseListData (cityID) {
      let params = {
        cityId: cityID
      }
      activityList.activityHouseApi(params).then((res) => {
        if (res.data.houseList) {
          this.houseList = res.data.houseList
        }
      })
    },
    // 获取抽奖机会
    getChanceLuck (task, text, e) {
      // 首先判断是否登录
      if (!this.isLogin) {
        // 调用登录方法
        this.loginAction()
        return false
      } else {
        if (text !== '已完成') {
          if (task === 'invite') { // 邀请   弹起分享弹层 发起助力页面
            if (getBrowser().isWechat || this.isAPP) {
              this.leadModelVisible = true
            } else {
              Dialog.alert({
                message: '请通过微信或麦邻租房app参加此活动'
              }).then(() => {
                window.location.href = process.env.APP_DOWNLOAD_URL
              })
            }
          } else if (task === 'tenantBooking') { // 预约 跳转到H5房源列表
            window.location = process.env.HOUSE_H5_URL
          } else if (task === 'sign') { // 签约 跳转到飞虎队房源列表
            window.location = process.env.HOUSE_H5_URL + 'tags=fhd&type=2'
          }
        } else {
          return false
        }
      }
    },
    // 获取当前城市定位
    // getCurrentPosition () {
    //   if ((this.app_location && this.app_location.cityName) && this.isAPP) {
    //     this.curCity = this.app_location.cityName
    //     this.cityCode = this.app_location.cityId
    //     this.getHouseListData(this.cityCode)
    //   } else {
    //     if (window.AMap) {
    //       let geolocation = new window.AMap.Geolocation()
    //       geolocation.getCurrentPosition((status, result) => {
    //         if (status === 'complete') {
    //           this.curCity = result.addressComponent.city || '杭州市'
    //           this.cityCode = result.addressComponent.adcode.substring(0, 4) + '00' || '330100'
    //           // 获取房源列表
    //           this.getHouseListData(this.cityCode)
    //         } else {
    //           this.getHouseListData(this.cityCode)
    //         }
    //       })
    //     } else {
    //       this.getHouseListData(this.cityCode)
    //     }
    //   }
    // },
    /* 活动规则 */
    actRule () {
      this.ruleModelVisible = true
    },
    // 关闭活动规则
    closeRuleModel () {
      this.ruleModelVisible = false
    },
    /* 关闭登录弹窗 */
    closeLoginModel () {
      this.$refs.loginForm.resetFrom()
      this.loginModelVisible = false
    },
    // 奖品列表
    getGiftList () {
      if (!this.isLogin) {
        // 调用登录方法
        this.loginAction()
        return false
      }
      this.getPrizes()
    },
    // 关闭奖品列表
    closeGiftModel (e) {
      e.preventDefault()
      this.giftModelVisible = false
    },
    // 关闭中奖结果
    closeTigerResultModel (isContinue) {
      this.tigerResultModelVisible = false
      if (isContinue) {
        this.startTiger()
      }
    },
    onTigerSuccess () {
      this.doPrizing = false
      this.tigerResultModelVisible = true
    },
    onTigerFail () {
      this.doPrizing = false
      this.$toast('fail', '请求超时')
    },
    moreLink () {
      window.location.href = process.env.HOUSE_H5_URL + 'tags=fhd&type=2'
    },
    // 跳转到下载app页
    toAppDownloadPage () {
      window.location.href = process.env.APP_DOWNLOAD_URL
    }
  }
}
</script>
<style lang="scss" scoped>
    @mixin bgimgFix ($url) {
      background-image: url($url);
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
    }
    $mlMainColor: #DC000D;
    .pageContains{
       @include bgimgFix ('../assets/image/ml_bg@2x.png');
       background-position:top;
    }
    .pageContainsToApp{
      background-position:0 100px;
    }
    .ml-login-model{
      .rules{
        width:600px;
        font-size:28px;
        line-height:40px;
        height:590px;
        margin-bottom:20px;
        padding:0 40px;
        overflow:scroll-y;
      }
      .ruleTitle{
          width:308px;
          height:36px;
          margin:48px auto 48px;
          img{
            display: block;
            width:100%;
            height:100%;
          }
      }
    }
    .luckList{
      width:692px;
      background:#F83972;
      border-radius:10px;
      position: relative;
      z-index: 3;
      margin:0 auto;
      margin-top:-55px;
      padding-bottom:10px;
      .luckListTop{
        width:632px;
        margin:0 auto;
        padding-top:20px;
        color:#fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left:20px;
        position: relative;
        font-size:28px;
        &::before{
          content:"";
          background:#fff;
          position: absolute;
          left:0;
          top:55px;
          height:30px;
          width:10px;
          border-radius: 5px;
        }
        p:last-child{
          font-size:24px;
        }
        .span{
          padding:5px 15px;
          background:rgba(0,0,0,0.4);
          color:#FFDD2B;
          border-radius: 5px;
          margin:0 5px;
          font-size:28px;
          font-weight: bold;
        }
      }
      .luckCondition{
        width:632px;
        margin:0 auto;

        li{
          width: 632px;
          height:100px;
          display: flex;
          // justify-content: space-between;
          background:#fff;
          border-radius:30px;
          line-height:100px;
          padding:8px;
          box-sizing: border-box;
          margin-bottom:30px;
          span{
              display: block;
              width: 84px;
              height:84px;
              background:#A876F7;
              border-radius:50%;
              color:#fff;
              font-size:32px;
              line-height: 84px;
              text-align: center;
          }
          em{
              font-size:24px;
              font-style:normal;
          }
          p{
            margin:0;
            padding:0;
            color:#BF7D00;
            line-height:84px;
            font-size:30px;
            padding-left:20px;
            width:60%;
          }
          .luckListBtn{
            display: block;
            width:140px;
            height:56px;
            color:#fff;
            text-align: center;
            line-height: 56px;
             @include bgimgFix('../assets/image/ml_bt_denglu_default@2x.png');
             margin-top:15px
          }
          .luckListBtnDis{
             @include bgimgFix('../assets/image/ml_bt_achieve@2x.png');
          }
        }
      }
    }
  .giftList{
     padding-top:260px;
     @include bgimgFix('../assets/image/ml_gift_bg@2x.png');
     height:874px;
     width:702px;

     .tiger-result-content {
       position: absolute;
       width: 100%;
       text-align: center;

       img {
         width: 200px;
         height: auto;
         margin-bottom: 20px;
       }

       p {
         color: #DC000D;
         font-size: 32px;
         font-weight: 500;
         margin: 0;
         line-height: 50px;
       }
     }

     .tiger-result-btn {
       position: absolute;
       bottom: 52px;
       left: 50%;
       transform: translate(-50%);
       height: 100px;
       width: 420px;
     }

     .tiger-result-title {
       width:476px;
       height:104px;
         @include bgimgFix('../assets/image/ml_tiger_result_title_bg.png');
         margin:0 auto;
     }

     .giftTitle{
        width:476px;
        height:104px;
         @include bgimgFix('../assets/image/Group34Copy@2x.png');
         margin:0 auto;
     }
     ul{
       height:392px;
       width:450px;
       margin:30px auto 0;
       overflow: scroll;
       li{
         height:98px;
         border-bottom:thin solid  #999999;
         padding-top:10px;
         p{
           padding:0;
           margin:0;
           padding-top:4px;
            font-size:28px;
            // font-weight: bold;
            color:#DC000D;
            line-height:40px;
            border-bottom:none;
         }
         span{
           display: block;
            font-size:24px;
            color:#666;
            padding:8px 0 5px 25px
         }
       };
     }
    // li{
    //   justify-content: space-between;
    //   display: flex;
    //   padding:20px 20px 0 20px;
    //   p{
    //   margin:0;
    //   padding:0;
    // }
    // }
  }
    .ml-lead-model {
    background-color: transparent;
    color: #fff;
    font-size: 0.56rem;
    top: 1.5rem;
    left: 67%;
    overflow: visible;
    .ml-lead-container {
      position: relative;
      width: 9em;
      .ml-lead-arrow {
        position: absolute;
        top: -0.7rem;
        right: 0rem;
        width: 0.7rem;
        height: 0.7rem;
        animation: mlJump 0.7s infinite alternate;
      }
    }
  }
  .mlTiger {
    position: absolute;
    left: 64px;
    top: 40px;
    right: 104px;
  }
</style>
