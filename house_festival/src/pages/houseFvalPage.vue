<template>
    <div class="pageContains">
      <div class="asistance-wrapper">
      <div class="open-app">
        <img class="ml-logo" src="../assets/image/ml_icon_logo@2x.png" alt="">
        <div class="ml-slogan">上麦邻租房&nbsp;&nbsp;&nbsp;轻松租好房</div>
        <div class="open-app-btn">
          <img @click="toAppDownloadPage" src="../assets/image/ml_btn_open@2x.png" alt="">
        </div>
      </div>
      </div>
        <div class="topImg">
           <div class="city"><city-list @getCitiCode="getCitiCode"></city-list></div>
            <div @click = "actRule" class="actRule">活动规则</div>
            <div class="userDetail">好友{{mobile}}邀你免费抽万元现金大奖</div>
        </div>
        <user-luck></user-luck>
        <div class="luckOpportArea">
          <div class="luckOpport">
            <tiger class="mlTiger"
                 ref="tiger"
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
            <div class="residualTimes">
             剩余抽奖次数 {{residualTimes}} 次
            </div>
          </div>
        </div>
        <div v-if="houseList.length>0"><house-list :houseList="houseList"></house-list></div>
        <div class="luckFooter">
            <div class="more" @click="moreLink">
                <img :src="require('../assets/image/ml_bt_more@2x.png')" alt="">
            </div>
            <img :src="require('../assets/image/ml_slogn@2x.png')" alt="">
        </div>
        <!-- 活动规则 -->
        <van-popup :close-on-click-overlay="true"  bind:close="closeRuleModel" class="ml-login-model" v-model="ruleModelVisible" >
          <Rules></Rules>
          <div class="ml-model-close" @click="closeRuleModel">
            <img src="../assets/image/ml_btn_close@2x.png" alt="">
          </div>
        </van-popup>
        <!-- 登录弹窗 -->
        <van-popup :close-on-click-overlay="false" class="ml-login-model" v-model="loginModelVisible">
          <login-model ref="loginForm" @loginSucess="loginSucess" roles="friends"></login-model>
          <div class="ml-model-close" @click="closeLoginModel">
            <img src="../assets/image/ml_btn_close@2x.png" alt="">
          </div>
        </van-popup>
    </div>
</template>
<script>
import { getWxShareInfo } from '@/utils/wxshare'
import { getUserData } from '@/utils/auth'
import { Popup, Dialog } from 'vant'
import LoginModel from './components/loginModel'
import { joinActivityApi, activityList } from '@/api/activePage'
import { getBrowser } from '@/utils/browser'
import Tiger from '../components/Tiger/Tiger'
import Rules from './components/rulesManageModel'
import userLuck from './components/luckUser'
import houseList from './components/houseList'
import cityList from './components/cityList'

const activityCode = 'MJGY20181225' //  活动code

let initPageInfoData = { // 分享文案
  title: '麦邻租房狂欢节',
  shareData: {
    title: '已有1098个用户抽到大奖，奖品有限，先到先得！',
    introduction: '还有华为mate20、小米音响、MAC口红等未被抽走，来抢！',
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
    userLuck,
    houseList,
    cityList
  },
  data () {
    return {
      urlSearchParams: {},
      isLogin: false, // 是否已登录
      ruleModelVisible: false,
      loginModelVisible: false,
      sessionId: '',
      residualTimes: 1,
      cityCode: '330100',
      curCity: '杭州市',
      houseList: [],
      mobile: '',
      tiger: {
        tigerImgList: [
          require('../assets/image/ml_gift_1@2x.png'),
          require('../assets/image/ml_gift_2@2x.png'),
          require('../assets/image/ml_gift_3@2x.png')
        ],
        tigerPrizeNumber: 10 // 奖品总数
      }

    }
  },
  created () {
    // 获取search数据
    this.$set(this, 'urlSearchParams', this.$route.query || {})
    this.$nextTick(() => {
      this.getUserInfo()
    })
    // 获取当前城市定位
    // this.getCurrentPosition()
    // 判断页面是否登录
    this.loginAction()
    // 地址带过来的
  },
  computed: {

  },
  mounted () {
    this.$nextTick(() => {
      getWxShareInfo(initPageInfoData.shareData)
    })
  },
  methods: {
    // 获取被助力人的信息
    getUserInfo () {
      if (!this.checkVisible()) {
        this.isLoading = false
        return false
      }
      activityList.getTaskData({
        v: '1',
        sessionId: decodeURIComponent(this.urlSearchParams.sessionId),
        activityCode: activityCode
      }).then((res) => {
        if (res.code !== '0') {
          return false
        }
        this.mobile = res.data.mobile || ''
        this.customerId = res.data.customerId || ''
      })
    },
    checkVisible () {
      if (!this.urlSearchParams.sessionId) {
        Dialog.alert({
          message: '请通过好友分享的链接访问当前页面'
        })
        return false
      }
      return true
    },
    loginSucess () {
      this.loginModelVisible = false
      this.isLogin = true
      // 登录成功后即参加活动才能助力
      this.joinActivity()
    },
    // 参加活动获取
    joinActivity () {
      this.sessionId = getUserData('friends').sessionId
      joinActivityApi.joinActivity({
        devId: '',
        sessionId: this.sessionId, // 朋友自己的sessionId
        activityCode: activityCode
      }).then((res) => {
        if (res.code === '0') {
          // 判断访问来源
          if (getBrowser().isWechat || this.isAPP) {
            this.helpCustomer() // 满足平台  参加活动成功 就调用助力接口 跳转到主活动页
          } else {
            Dialog.alert({
              message: '请通过微信或麦邻租房app参加此活动'
            })
          }
        } else {
          Dialog.alert({
            message: res.message
          })
        }
      })
    },
    // 为他助力
    helpCustomer () {
      this.sessionId = getUserData('friends').sessionId
      let params = {
        activityCode: activityCode,
        sessionId: this.sessionId,
        customerId: this.customerId // 从任务接口中获取   被助力人的customerId
      }
      joinActivityApi.helpCustomerApi(params).then((res) => {
        let isNewUser = false
        if (res.data) {
          console.log('data', res.data)
          isNewUser = res.data.isNewUser || false
        }
        if (!isNewUser) {
          window.location.href = window.location.origin + window.location.pathname + '#/?sessionId=' + encodeURIComponent(getUserData('friends').sessionId)// 助力成功之后 跳转到 主活动页面
          return false
        }
        if (res.code === '0' && isNewUser) {
          Dialog.alert({
            message: '邀请成功'
          }).then(() => {
            window.location.href = window.location.origin + window.location.pathname + '#/?sessionId=' + encodeURIComponent(getUserData('friends').sessionId)// 助力成功之后 跳转到 主活动页面
          })
        } else {
          Dialog.alert({
            message: res.message || '邀请失败'
          })
        }
      }).catch((res) => {
        console.log('help')
        Dialog.alert({
          message: res.message
        })
      })
    },
    // 判断用户是否登录
    loginAction () {
      let userSession = getUserData('friends') || ''
      if (userSession && userSession.sessionId) {
        // this.isLogin = true
        // let params = {
        //   sessionId: userSession.sessionId,
        //   activityCode: activityCode
        // }
        // activityList.loginTaskApi(params).then((res) => {
        //   this.residualTimes = res.data.residualTimes
        // })
        this.$router.push({
          path: '/',
          query: {
            sessionId: getUserData('friends').sessionId
          }
        })
      }
    },
    // 点击抽奖
    startTiger () { // 点击抽奖
      if (!getUserData('friends')) {
        this.loginModelVisible = true
      } else {
        window.location.href = window.location.origin + window.location.pathname + '#/?sessionId=' + encodeURIComponent(getUserData('friends').sessionId)
      }
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
    getCitiCode (codeId) {
      console.log('codeId', codeId)
      this.getHouseListData(codeId.id)
    },
    // // 获取当前城市定位
    // getCurrentPosition () {
    //   if (window.AMap) {
    //     let geolocation = new window.AMap.Geolocation()
    //     geolocation.getCurrentPosition((status, result) => {
    //       if (status === 'complete') {
    //         this.curCity = result.addressComponent.city || '杭州市'
    //         this.cityCode = result.addressComponent.adcode.substring(0, 4) + '00' || '330100'
    //         // 获取房源列表
    //         this.getHouseListData(this.cityCode)
    //       } else {
    //         this.getHouseListData(this.cityCode)
    //       }
    //     })
    //   } else {
    //     this.getHouseListData(this.cityCode)
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
    // 跳转到下载app页
    toAppDownloadPage () {
      window.location.href = process.env.APP_DOWNLOAD_URL
    },
    moreLink () {
      window.location.href = process.env.HOUSE_H5_URL + 'tags=fhd&type=2'
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
       @include bgimgFix ('../assets/image/ml_bg2@2x.png');
       background-position:0 100px;
    }
  .mlTiger {
    position: absolute;
    left: 64px;
    top: 40px;
    right: 104px;
  }
</style>
