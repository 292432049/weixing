// pages/personalCenter/personalCenter.js
const fetch = require('../../utils/api.js')
import { passwordHidden } from '../../utils/validate.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hrefavatarUrl: '../../images/Group.svg',
    sessionId:null,
    nickName:'',
    mobile:'',
    enterHouseShow:false  // 点击录入房源展示弹层
  },
  onShow(option) {
    wx.removeStorage({ key: 'hostingInfo' })
    wx.removeStorage({ key: 'roomData' })
    wx.removeStorage({ key: 'editRoomData' })
  },
  // 获取个人信息
  getPersonal(){
    let that = this
    fetch('/user',{
      method:'info'
    }).then((res)=>{
      this.setData({
        nickName: res.accountName,
        mobile:passwordHidden(res.mobile)
      })
      // console.log('用户信息',res)
    })
  },
  //展示录入房源弹层
  showEnterHouse(){
    this.setData({
      enterHouseShow:true
    })
  },
  toLinkRoomWanshan(){
    wx.navigateTo({
      url: '/pages/wanShanHouse/wanShanHouse',
    })
  },
  enterHouse(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/entryHouse/entryHouse?houseRentType=' + e.currentTarget.dataset.id,
    })
    app.globalHouseData.houseRentType = e.currentTarget.dataset.id
  },
  //关闭录入房源弹层
  closeEnterHouse(){
    this.setData({
      enterHouseShow: false
    })
  },
  /**
   * 设置
   */
  setFun(){
    console.log('adfadsf')
    wx.navigateTo({
      url: 'centerSet/centerSet',
    })
  }, 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      enterHouseShow: false
    })
  },
  onLoad(option){
    // console.log('wxback2', option)
    // if (option) {
    //   if (option.wsBack) {
    //     wx.navigateTo({
    //       url: '../wanShanHouse/wanShanHouse',
    //     })
    //   }
    // }
    this.getPersonal();
  }
})