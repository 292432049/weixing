// pages/login/login.js
const fetch = require('../../utils/api.js')
import { SHA2 } from '../../utils/shaEncrypt.js'
import { validateMobile } from '../../utils/validate.js'
import Dialog from '../../components/dialog/dialog';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      id: '0',
      title: '密码登录'
    }, {
      id: '1',
      title: '验证码登录'
    }],
    tabActive: '0',
    mobile: null,
    textTime: '获取验证码',
    codeDis: false,
    vcode: null,  //验证码
    password: null,
    username: null,
    activeInput: null,
    currentTime:60,
    loading:false
  },
  checkPhone(){
    if (!this.data.mobile) {
      this.errTips('手机号不能为空')
    } else if(!validateMobile(this.data.mobile)) {
      this.errTips('手机号码格式不正确')
    } else{
      return true;
    }
  },
  loginFetch(data = {}) {
    fetch('user',
      {
        method: 'login',
        params: data
      }, {
        method: 'POST'
      }).then(data => {
        wx.showToast({
          icon: 'none',
          title: '登录成功',
        })
        wx.setStorage({  //保存用户名
          key: 'OTAACCoUNT',
          data: this.data.username,
        })
        wx.setStorageSync('OTA_sessionId', data.sessionId)  //存储sessionId
        console.log(data.sessionId)
        app.globalData.sessionId = data.sessionId
        this.setData({
          loading:false
        })
        wx.redirectTo({
          url: '../personalCenter/personalCenter'
        })
      }).catch((res)=>{
        this.setData({
          loading: false
        })
      })
  },
  //用户名登录
  submitLogin() {
    this.setData({
      loading: true
    })
    const params = {
      account: this.data.username,
      password: SHA2(this.data.password),
      // verifyCode: this.data.vcode
    }
    this.loginFetch(params)
  },
  //验证码登录
  formSubmitcode() {
    this.setData({
      loading: true
    })
    const params = {
      account: this.data.mobile,
      verifyCode: this.data.vcode
    }
    this.loginFetch(params)
  },
  errTips(text){
    wx.showToast({
      icon: 'none',
      title: text,
    })
    return false
  },
  goLogin(e) {   //账号密码登陆
    const currentDom = e.currentTarget.dataset.name
    if (e.currentTarget.dataset.name === 'verifyCode'){
      if (!this.data.mobile) {
        this.errTips('手机号不能为空')
      }else if (!validateMobile(this.data.mobile)) {
        this.errTips('手机号码格式不正确')
      }else if (!(this.data.vcode)) {
        this.errTips('请输入正确的短信验证码')
      }else{
        this.formSubmitcode()
      }
    } if (e.currentTarget.dataset.name === 'account'){
      if (!this.data.username) {
        this.errTips('手机号不能为空')
      } else if (!validateMobile(this.data.username)) {
        this.errTips('手机号码格式不正确')
      }else if (!this.data.password) {
        this.errTips('请输入密码')
      }else{
        this.submitLogin()
      }
    }
  },
  //获取验证码
  sendCode() {
    if (!this.data.disabled) {
      let that = this
      var time = this.data.currentTime
      if (this.checkPhone()) {
        fetch('sms', {
          method: 'verifyCode',
          params: {
            mobile: this.data.mobile
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
              textTime: time + 's 后重新发送', //按钮文字变成倒计时对应秒数
              codeDis: true,
              color: '#bbb'
            })
            if (time <= 0) {
              clearInterval(interval)
              that.setData({
                textTime: '重新发送',
                codeDis: false,
                currentTime:61,
                color: "#333"
              })
            }
          }, 1000)
        })
      }
    }
  },
  // 获取手机号码
  getMobile(e) {
    this.setData({
      mobile: e.detail.value.replace(/\s+/g, '')
    })
    console.log(this.data.mobile)
  },
  getUsername(e) {
    this.setData({
      username: e.detail.value.replace(/\s+/g, '')
    })
  },
  //获取密码
  getPassword(e) {
    this.setData({
      password: e.detail.value.replace(/\s+/g, '')
    })
  },
  //获取验证码
  getCode(e){
    this.setData({
      vcode: e.detail.value.replace(/\s+/g, '')
    })
  },
  tapName(e) {
    const tabId = e.currentTarget.dataset.id;
    this.setData({
      tabActive: tabId
    })
  },
  showClearIcon(e) {
    this.setData({
      activeInput: e.currentTarget.dataset.inputType
    })
  },
  hideClearIcon(e) {
    this.setData({
      activeInput: '0'
    })
  },
  clearInput(e) {
    let inputType = e.currentTarget.dataset.inputType // 1.username 2.password 3.mobile
    let tempData = {}
    switch (e.currentTarget.dataset.inputType) {
      case '1':
        tempData = {
          username: ''
        }
        break;
      case '2':
        tempData = {
          password: ''
        }
        break;
      case '3':
        tempData = {
          mobile: ''
        }
        break;
    }
    this.setData(tempData)
  },
  onShow(){
    console.log(wx.getStorageSync('OTA_sessionId'))
    if (wx.getStorageSync('OTA_sessionId')) {
      wx.reLaunch({   //个人中心
        url: '/pages/personalCenter/personalCenter'
      })
    }
  }
})