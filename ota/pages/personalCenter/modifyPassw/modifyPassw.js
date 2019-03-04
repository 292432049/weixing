const fetch = require('../../../utils/api.js')
import { SHA2 } from '../../../utils/shaEncrypt.js'
import Dialog from '../../../components/dialog/dialog';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '修改密码',
    text: '获取验证码',
    currentTime: 5, //倒计时
    disabled: false, //按钮是否禁用
    color: '#333',
    newPassw: '',
    phone: '',
    code: ''
  },
  resetPassw() {
    this.set_passw = this.selectComponent('#set_passw')
    if (this.set_passw.formValidate()) {
      fetch('user', {
        method: 'modifyPassword',  //找回密码
        params: {
          account: this.set_passw.data.phone,
          newPassword: SHA2(this.set_passw.data.newPassw),
          verifyCode: this.set_passw.data.code,
          source:1
        }
      }).then((data) => {
        console.log(data)
        wx.showToast({
          title: '修改密码成功',
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