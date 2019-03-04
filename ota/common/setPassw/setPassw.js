import { validateMobile } from '../../utils/validate.js'
const fetch = require('../../utils/api.js')
import { SHA2 } from '../../utils/shaEncrypt.js'
Component({
  /**
   * 页面的初始数据
   */
  data: {
    title: '找回密码',
    text: '获取验证码',
    currentTime: 61, //倒计时
    disabled: false, //按钮是否禁用
    color: '#333',
    newPassw: '',
    phone: '',
    code: ''
  },
  methods:{
  //获取验证码
  sendCode() {
    console.log(this.data.phone)
    if (!this.data.disabled) {
      let that = this
      var time = this.data.currentTime
      if (this.checkPhone()) {
        fetch('sms', {
          method: 'verifyCode',
          params: {
            mobile: this.data.phone
          }
        }).then((res) => {
          console.log(res)
          wx.showToast({
            title: '短信验证码已发送',
            icon: 'none'
          })
          const interval = setInterval(() => {
            time--;
            that.setData({
              text: time + 's 后重新发送', //按钮文字变成倒计时对应秒数
              disabled: true,
              color: '#bbb'
            })
            if (time <= 0) {
              clearInterval(interval)
              that.setData({
                text: '重新发送',
                disabled: false,
                currentTime: 5,
                color: "#333"
              })
            }
          }, 1000)
        })
      }
    }
  },
  onChange(e) {
    if (e.currentTarget.dataset.name === 'phone') {
      this.setData({
        phone: e.detail.value.replace(/\s+/g, '')
      })
    } else if (e.currentTarget.dataset.name === 'newPassw') {
      this.setData({
        newPassw: e.detail.value.replace(/\s+/g, '')
      })
    } else if (e.currentTarget.dataset.name === 'code') {
      this.setData({
        code: e.detail.value.replace(/\s+/g, '')
      })
    }
    console.log('输入',this.data.phone)
  },
  checkPhone() {
    if (!this.data.phone) {
      wx.showToast({
        icon: 'none',
        title: '手机号不能为空',
      })
      return false
    }else if (!validateMobile(this.data.phone)) {
      wx.showToast({
        icon: 'none',
        title: '手机号码格式不正确',
      })
      return false
    }else{
      return true
    }
  },
  formCheck() {
    const passLen = (this.data.newPassw).length
    if (!this.data.code) {
      wx.showToast({
        icon: 'none',
        title: '验证码不能为空',
      })
      return false
    } else if (!this.data.newPassw) {
      wx.showToast({
        icon: 'none',
        title: '密码不能为空',
      })
      return false
    }else if (passLen<5 || passLen> 12) {
      wx.showToast({
        icon: 'none',
        title: '请输入6-12位密码',
      })
      return false
    }else{
      return true
    }
  },
    formValidate() {
      if (this.checkPhone() && this.formCheck()) {
        return true
      }else{
        return false
      }
    }
  },

})