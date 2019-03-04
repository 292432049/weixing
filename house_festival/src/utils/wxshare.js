import wx from 'weixin-js-sdk'
import { fetch } from '@/utils/fetch'
import { getWxVersion } from '@/utils/browser'

/**
 * 微信分享
 * @function: getWxShareInfo()
 * @default: shareData{}
 * @callback 分享成功[callbackOk]
 * @callback 分享失败[callbackFail]
 */

const wechatShareCase = {
  shareData: {
    title: '麦邻租房',
    introduction: '麦邻租房',
    thumbnail: '//www.mdguanjia.com/images/wx_share__ml.png'
  },
  callbackOk () {},
  callbackFail () {},
  getAuthInfo () {
    fetch('//www.mdguanjia.com/myhome/act/august/wechat.htm', {
    // fetch(process.env.WXSHARE_H5_URL, {
      url: location.href.split('#')[0],
      callback: 'h5'
    }, 'get', {
      noAssign: true,
      interceptors: false
    }).then((data) => {
      if (!data.success) {
        return false
      }
      this.wechatSetting(data.dataObject)
    })
  },
  // 微信基础Api
  wechatSetting (response) {
    const jsApiList = [
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'onMenuShareTimeline',
      'onMenuShareAppMessage'
    ]
    wx.config({
      debug: false,
      appId: response.appid,
      timestamp: response.timestamp,
      nonceStr: response.noncestr,
      signature: response.signature,
      jsApiList
    })
    wx.ready(() => {
      let supportApi = []
      let _this = this
      const wechatVersion = getWxVersion()
      // 客户端6.0.2之后支持
      if (wechatVersion > '6.0.2') {
        wx.checkJsApi({
          jsApiList,
          complete (res) {
            // if (res.errMsg.indexOf('ok')) {
            //   const checkApiObj = JSON.parse(res.checkResult || '{}')
            //   supportApi = Object.keys(checkApiObj)
            // } else {
            //   supportApi = ['onMenuShareTimeline', 'onMenuShareAppMessage']
            // }
            supportApi = ['onMenuShareTimeline', 'onMenuShareAppMessage']
            _this.initWxMethods(supportApi)
            _this.callbackOk()
          }
        })
      }
    })
    wx.error((res) => {
      console.debug(res)
    })
  },
  // 微信分享注册
  initWxMethods (supportApi) {
    let _this = this
    if (supportApi.find(item => item === 'updateAppMessageShareData')) {
      console.log('updateAppMessageShareData')
      wx.updateAppMessageShareData({
        title: _this.shareData.title,
        link: _this.shareData.linkUrl,
        imgUrl: _this.shareData.thumbnail,
        desc: _this.shareData.introduction
      }, (res) => {
        console.log(res)
      })
    }
    if (supportApi.find(item => item === 'updateTimelineShareData')) {
      console.log('updateTimelineShareData')
      wx.updateTimelineShareData({
        title: _this.shareData.title,
        link: _this.shareData.linkUrl,
        imgUrl: _this.shareData.thumbnail
      }, (res) => {
        console.log(res)
      })
    }
    if (supportApi.find(item => item === 'onMenuShareTimeline')) {
      console.log('onMenuShareTimeline')
      wx.onMenuShareTimeline({
        title: _this.shareData.title, // 分享标题
        link: _this.shareData.linkUrl, // 分享链接
        imgUrl: _this.shareData.thumbnail, // 分享图标
        success () {},
        cancel () {}
      })
    }
    if (supportApi.find(item => item === 'onMenuShareAppMessage')) {
      console.log('onMenuShareAppMessage')
      console.log(_this.shareData)
      wx.onMenuShareAppMessage({
        title: this.shareData.title, // 分享标题
        desc: this.shareData.introduction, // 分享描述
        link: this.shareData.linkUrl, // 分享链接
        imgUrl: this.shareData.thumbnail, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success () {},
        cancel () {}
      })
    }
  }
}

const getWxShareInfo = (
  shareData = {
    title: '麦邻租房',
    introduction: '麦邻租房',
    thumbnail: 'https://www.mdguanjia.com/images/wx_share__ml.png'
  },
  callbackOk = () => { console.log('分享成功') },
  callbackFail = () => { console.log('分享失败') }
) => {
  wechatShareCase.shareData = shareData
  wechatShareCase.callbackOk = callbackOk
  wechatShareCase.callbackFail = callbackFail
  wechatShareCase.getAuthInfo()
}

export { getWxShareInfo }
