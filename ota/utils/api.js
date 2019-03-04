import Dialog from '../components/dialog/dialog.js';
const defaultConfig = {
  version: "1.0.1",
  timestamp: new Date().getTime(),
  reqId: "wx_OTA",
  sign: "wx_OTA",
  source:2
}
// basePath api请求路径

//测试
const basePath = 'https://test.mdguanjia.com/otastarter/'

// https://apis.map.qq.com
// https://api.mdguanjia.com
// https://test.mdguanjia.com

// 线上
// const basePath = 'https://api.mdguanjia.com/otastarter'

const fetch = (url, data, params = {}) => {
  // wx.showLoading({
  //   title: '加载中',
  // })
  const promise = new Promise((resolve, reject) => {
    let that = this
    let postData = Object.assign(data, defaultConfig)
    // 登录不需要做sessionId鉴权
    if (postData.method !== 'login') {
      postData.sessionId = wx.getStorageSync('OTA_sessionId')
    }
    wx.request({
      url: basePath + url,
      data: postData,
      method: params.method || 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        // 响应业务分析
        if (res.data.code == 0) {
          resolve(res.data.data)
        } else if (res.data.code == 1013) { //用户已经注销，重新登录
          wx.removeStorage({
            key: 'OTA_sessionId',
            success: function (res) {
              wx.reLaunch({
                url: '/pages/login/login'
              })
              wx.showToast({
                title: '该账号在其他地方登录，请重新登录',
                icon: 'none',
                duration: 4000
              })
            }
          })
        } else if (res.data.code == 2090){
          Dialog.confirm({
            message: res.data.message ,
            confirmButtonText:'确定拨打电话'
          }).then((res)=>{
            wx.makePhoneCall({
              phoneNumber: '4008827099'
            })
          })
        }else {
          wx.showToast({
            title: res.data.message || '网络异常',
            icon: 'none',
            duration: 3000
          })
          reject(res.data.message)
        }
      },
      error: function (e) {
        reject('网络出错')
      }
    })
  });
  return promise
}

module.exports = fetch
