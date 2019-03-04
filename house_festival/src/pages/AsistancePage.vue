<template>
  <div>
    <van-loading class="ml-loading" size="60px" v-if="isLoading" />
    <div class="asistance-wrapper" v-else>
      <div class="open-app">
        <img class="ml-logo" src="../assets/images/ml_icon_logo@2x.png" alt="">
        <div class="ml-slogan">上麦邻租房&nbsp;&nbsp;&nbsp;轻松租好房</div>
        <div class="open-app-btn">
          <img @click="toAppDownloadPage" src="../assets/images/ml_btn_open@2x.png" alt="">
        </div>
      </div>
      <div class="page_container">
        <div class="main-wrapper">
          <div class="main-asistance-from">
            <span v-if="mobile">
              用户{{mobile}}发起的助力
            </span>
          </div>
          <div class="main-friends-num">
            <div class="main-friends-bg"></div>
            <div class="main-friends-center" v-if="countHelpCustomer">
              当前助力人数: <span class="friends-num">{{countHelpCustomer | countHelpCustomerFilter}}</span>
            </div>
          </div>
          <div class="main-button">
            <img @click="asistanceAction" class="main-button-pic" src="../assets/images/ml_btn_zhuli_default@2x.png" alt="">
          </div>
          <div class="main-button">
            <img @click="joinAction" class="main-button-pic" src="../assets/images/ml_btn_canyu_default@2x.png" alt="">
          </div>
        </div>
        <div class="ml-activity-rules">
          <div class="rules-title"></div>
          <div class="rules-container">
            <p>1、本次活动仅限麦邻租房新注册用户发起助力，每人仅可发起1次助力；</p>
            <p>2、好友助力仅限麦邻租房新注册用户，每人仅可帮助好友助力1次； </p>
            <p>3、邀请三位好友助力可得100元租金券，邀请五位好友助力可得300元租金券，邀请七位好友助力可得500元租金券，邀请十位好友助力可得800元租金券，邀请十二位好友助力可得1200元租金券；</p>
            <p>4、租金券可用于上海、杭州地区非金融房源在线交租抵扣租金使用，签约租期1年及以上，抵扣租金需≥1200元；租金券分12次使用，每次可使用1张100元租金券；</p>
            <p>5、本次活动仅有100个名额，发完即止，请及时参与；麦邻租房拥有在法律范围内的最终解释权，咨询电话400-033-9858。</p>
          </div>
        </div>
        <div class="ml-footer"></div>
        <van-popup :close-on-click-overlay="false" class="ml-login-model" v-model="loginModelVisible">
          <login-model ref="loginForm" roles="friends"></login-model>
          <div class="ml-model-close" @click="closeLoginModel">
            <img src="../assets/images/ml_btn_close@2x.png" alt="">
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import { getWxShareInfo } from '@/utils/wxshare'
import LoginModel from './components/loginModel'
import { Popup, Dialog, Loading } from 'vant'
import { getUserData } from '@/utils/auth'
import { friendsHelpApi } from '@/api/asistancePage'
import { joinActivityApi } from '@/api/activePage'

let initPageInfoData = {
  title: '麦邻租房减房租啦！',
  shareData: {
    title: '麦邻租房减房租啦！',
    introduction: '帮好友助力，助TA领取1200元租金券',
    thumbnail: 'https://www.mdguanjia.com/images/wx_share__ml.png',
    linkUrl: location.href
  }
}

const activityCode = 'MJGY20181108'

export default {
  components: {
    LoginModel,
    [Popup.name]: Popup,
    [Dialog.name]: Dialog,
    [Loading.name]: Loading
  },
  data () {
    return {
      mobile: '',
      countHelpCustomer: '',
      loginModelVisible: false,
      isLogin: false,
      sessionId: '',
      customerId: '',
      urlSearchParams: {},
      isLoading: true
    }
  },
  created () {
    // 获取search数据
    this.$set(this, 'urlSearchParams', this.$route.query || {})

    this.$nextTick(() => {
      this.getUserInfo()
    })
  },
  mounted () {
    this.$nextTick(() => {
      getWxShareInfo(initPageInfoData.shareData)
    })
  },
  methods: {
    // 获取参加活动的人的信息
    getUserInfo () {
      console.log('urlSearchParams', this.urlSearchParams)
      if (!this.checkVisible()) {
        this.isLoading = false
        return false
      }
      joinActivityApi.joinActivity({
        devId: '',
        sessionId: decodeURIComponent(this.urlSearchParams.sessionId),
        activityCode: activityCode
      }).then((res) => {
        if (res.code === '0') {
          this.isLoading = false
          if (getUserData('friends')) {
            this.sessionId = getUserData('friends').sessionId
            this.isLogin = true
          }
        } else {
          // 跳转到活动页
          window.location.href = window.location.origin + window.location.pathname
        }
      })
      joinActivityApi.getData({
        sessionId: decodeURIComponent(this.urlSearchParams.sessionId),
        activityCode: activityCode
      }).then((res) => {
        if (res.code !== '0') {
          return false
        }
        this.countHelpCustomer = res.data.countHelpCustomer || '0'
        this.mobile = res.data.phone || ''
        this.customerId = res.data.customerId || ''
      })
    },
    // 助力好友
    asistanceAction () {
      if (!this.checkVisible()) {
        return false
      }
      if (!this.isLogin) {
        this.loginModelVisible = true
        return false
      }
      friendsHelpApi({
        devId: '',
        sessionId: this.sessionId,
        activityCode: activityCode,
        customerId: this.customerId
      }).then((res) => {
        if (res.code === '0') {
          Dialog.alert({
            message: '助力成功'
          }).then(() => {
            window.location.reload()
          })
        } else {
          Dialog.alert({
            message: res.message || '助力失败'
          })
        }
      })
    },
    // 参加活动
    joinAction () {
      if (!this.checkVisible()) {
        return false
      }
      if (!this.isLogin) {
        this.$router.push({
          path: '/'
        })
      } else {
        this.$router.push({
          path: '/',
          query: {
            sessionId: getUserData('friends').sessionId
          }
        })
      }
    },
    // 关闭登录弹窗
    closeLoginModel () {
      this.$refs.loginForm.resetFrom()
      this.loginModelVisible = false
    },
    // 跳转到下载app页
    toAppDownloadPage () {
      window.location.href = process.env.APP_DOWNLOAD_URL
    },
    checkVisible () {
      if (!this.urlSearchParams.sessionId) {
        Dialog.alert({
          message: '请通过好友分享的链接访问当前页面'
        })
        return false
      }
      return true
    }
  },
  filters: {
    countHelpCustomerFilter (val) {
      if (val >= 10 || val === '0') {
        return val
      }
      return '0' + val
    }
  }
}
</script>

<style lang="scss" scoped>
  .ml-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
  .asistance-wrapper {
    padding-top: 100px;
    background-color: #FFAB2C;
    .open-app {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100px;
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0, 0, 0, .5);
      z-index: 1000;
      .ml-logo {
        width: 60px;
        height: 60px;
      }
      .ml-slogan {
        flex: 1;
        font-size: 30px;
        color: #fff;
        padding-left: 20px;
      }
      .open-app-btn {
        img {
          width: 146px;
          height: 50px;
        }
      }
    }
    .main-wrapper {
      height: 570px;
      background-image: url(../assets/images/ml_bg_small2@2x.png);
      .main-button {
        margin-bottom: 36px;
      }
    }
    .main-asistance-from {
      margin-top: 36px;
      margin-bottom: 40px;
      font-size: 28px;
      height: 40px;
    }
  }
</style>
