// pages/roomSet/surePage/surePage.js
const fetch = require('../../../utils/api.js')
import { deepClone } from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
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
    steps: [],
    priceData:{},
    hostingInfo:{},
    editRoomData:{},
    loading:false
  },
  onShow(){
    this.data.hostingInfo = deepClone(wx.getStorageSync('hostingInfo'))
    this.setData({
      editRoomData: deepClone(wx.getStorageSync('editRoomData'))
    })
    this.setData({
      "hostingInfo.hostingRooms":[]
    })
    if (this.data.editRoomData.houseRentType * 1 === 1) {  //整租
      this.setData({
        steps: this.data.steps1
      })
    }
    if (this.data.editRoomData.houseRentType * 1 === 2) {  //整租
      this.setData({
        steps: this.data.steps2,
        active:2
      })
    }
  },
  submitData(){
    let houseRentType = this.data.editRoomData.houseRentType*1
    let editRoomData = this.data.editRoomData
    let hostingRooms = this.data.hostingInfo.hostingRooms
    this.house_price = this.selectComponent('#house_price')
    if (this.house_price.formValidate()) {
      this.setData({
        priceData: deepClone(this.house_price.data.roomPriceData)
      })
      let serviceData = this.house_price.data.serviceData
      if (houseRentType === 1) {// 1整租 
        this.data.hostingInfo = Object.assign(this.data.hostingInfo, this.data.priceData, serviceData)
      }
      if (houseRentType === 2) { //2 合租
        let roomData =deepClone(wx.getStorageSync('roomData'))
         this.data.priceData = Object.assign(this.data.priceData, serviceData)
         this.data.priceData = Object.assign(this.data.priceData, roomData)
         this.data.hostingInfo.hostingRooms[0]= deepClone(this.data.priceData)
         this.data.hostingInfo.hostingRooms[0].roomName = editRoomData.roomName
      }
      this.data.hostingInfo.houseRentType =      this.data.editRoomData.houseRentType 
      this.setData({
        loading: true
      })
      console.log('hostingInfo', this.data.hostingInfo)
      fetch('presaveRoom', {
        method: "completeHostingRoom",
        params: {
          "id": editRoomData.id,
          "roomName": editRoomData.roomName,
          "hostingInfo": deepClone(this.data.hostingInfo)
        }
      }).then((res) => {
        console.log('提交成功')
        //跳转
        wx.redirectTo({
          url: '../../personalCenter/personalCenter'
        })
        this.setData({
          loading: false
        })
      }).catch(()=>{
        this.setData({
          loading: false
        })
      })
    }
  }
})