// pages/roomSet/nextPage/nextPage.js
const fetch = require('../../../utils/api.js')
import { deepClone } from '../../../utils/util.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    steps1: [{
      desc: '房间'
    },
    {
      desc: '价格'
    }
    ],
    steps2: [{
      desc: '整套'
    },
    {
      desc: '房间'
    },
    {
      desc: '价格'
    }
    ],
    steps:[],
    houseData:{},
    editRoomData:{},
    defaultHostingInfo:null,
    loading:false,
    pictureName:String,
    // pictures:[],
    imgNum:0
  },
  onLoad(){
    // 合租的有
    this.setData({
      editRoomData: wx.getStorageSync('editRoomData')
    })
    fetch('presaveRoom', {
      method: 'queryPresaveRoomInfo',
      params: {
        id: this.data.editRoomData.id,
        roomName: this.data.editRoomData.roomName || ''
      }
    }).then((data) => {
      // console.log('默认数据',data)
      if (data) {
        this.setData({
          'defaultHostingInfo.contactName': data.contactName,
          'defaultHostingInfo.contactMobile': data.contactMobile,
          'defaultHostingInfo.houseArea': data.houseArea,
          'defaultHostingInfo.houseDesc': data.houseDesc,
          'defaultHostingInfo.houseDirection': data.houseDirection,
          'defaultHostingInfo.facilityItems': data.facilityItems,
          'defaultHostingInfo.contactGender': data.contactGender,
          pictures: data.pictures === null ? data.pictures : deepClone(data.pictures)
        })
        console.log('传给组件的默认值1', this.data.defaultHostingInfo)
        if (data.pictures) {
          app.pictures.defaultPictures = deepClone(data.pictures)
          if (app.pictures.defaultPictures.length !== 0 && !app.pictures.housePictures.length) {
            this.setData({
              imgNum: app.pictures.defaultPictures.length
            })
          }
        }
      }
    })
  },
  onShow(){
    if (this.data.editRoomData.houseRentType*1 === 1){  //整租
        this.setData({
          steps: this.data.steps1,
          pictureName: '房间照片'
        })
    }
    if (this.data.editRoomData.houseRentType * 1 === 2) {  //合租
      this.setData({
        steps: this.data.steps2,
        pictureName: '公区照片'
      })
    }
    if (app.pictures.housePictures.length !== 0) {
      this.setData({
        imgNum: app.pictures.housePictures.length
      })
    }
  },
  goLink(){
    if (this.data.editRoomData.houseRentType * 1 === 1) {//整租
      wx.navigateTo({
        url: '../surePage/surePage',
      })
    }
    if (this.data.editRoomData.houseRentType * 1 === 2) { //合租
      wx.navigateTo({
        url: '../secondPage/secondPage',
      })
    }
  },
  //下一步
  nextTepF(){
    this.house_hosting = this.selectComponent('#house_hosting');
    console.log(this.house_hosting.data.hostingInfo)
    this.house_hosting.data.hostingInfo.pictures = deepClone(app.pictures.housePictures)
      // wx.nextTick(() => {
    if (this.house_hosting.formValidate()) {
      this.goLink();
      wx.setStorageSync('hostingInfo', this.house_hosting.data.hostingInfo)
    }
    // })
  }
})