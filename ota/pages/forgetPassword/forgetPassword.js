import { validateMobile } from '../../utils/validate.js'
const fetch = require('../../utils/api.js')
import { SHA2 } from '../../utils/shaEncrypt.js'
import Dialog from '../../components/dialog/dialog';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:'找回密码',
    text: '获取验证码',
    currentTime: 5, //倒计时
    disabled: false, //按钮是否禁用
    color:'#333',
    newPassw:'',
    phone:'',
    code:''
  },
  resetPassw(){
    console.log(app.globalData.sessionId)
    this.set_passw = this.selectComponent('#set_passw')
    console.log(this.set_passw.formValidate())
    console.log(this.set_passw.data)
    if (this.set_passw.formValidate()){
      fetch('user', {
        method: 'retrievePassword',  //找回密码
        params: {
          account: this.set_passw.data.phone,
          newPassword: SHA2(this.set_passw.data.newPassw),
          verifyCode: this.set_passw.data.code 
        }
      }).then((data) => {
        console.log(data)
        wx.showToast({
          title: '密码找回成功',
          icon: 'none'
        })
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
  }
})