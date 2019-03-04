// pages/roomSet/secondPage/secondPage.js
const app = getApp()
import { deepClone } from '../../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    steps: [{
      desc: '整套'
    },
      {
        desc: '房间'
      },
      {
        desc: '价格'
      }
    ],
    roomData: {},
    houseArea:'',
    loading:false
  },
  onShow() {
    if (app.pictures.roomPictures.length !== 0) {
      this.data.pictures = deepClone(app.pictures.roomPictures)
      this.setData({
        imgNum: app.pictures.roomPictures.length
      })
    }
    this.setData({
      houseArea: wx.getStorageSync('hostingInfo').houseArea
    })
  },
  nextTepSecond(){
    this.setData({
      loading: true
    })
    this.room_hosting = this.selectComponent('#room_hosting');
    // wx.nextTick(() => {
      if (this.room_hosting.formValidate()) {
        this.data.roomData = this.room_hosting.data.hostingRooms
        this.data.roomData.pictures = deepClone(app.pictures.roomPictures)
        wx.setStorageSync('roomData', this.data.roomData)
        // console.log('roomData', this.data.roomData)
        wx.navigateTo({
          url: '../surePage/surePage'
        })
      }
      this.setData({
        loading: false
      })
    // })
  }
})