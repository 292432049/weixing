// pages/personalCenter/centerSet/centerSet.js
const fetch = require('../../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //修改密码
  modifyPassw(){
    wx.navigateTo({
      url: '../modifyPassw/modifyPassw',
    })
  },
  loginOut(){
    fetch('user',{
      method:'quit',
    },{
      method:'POST'
    }).then(()=>{
      wx.removeStorage({
        key: 'OTA_sessionId',
        success: function (res) {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
      app.globalData.sessionId = null
    })
  }
})