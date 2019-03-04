// pages/entryHouse/addRoom/addRoom.js
const fetch = require('../../../utils/api.js')
import { deepClone } from '../../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active:2,
    steps: [
      {
        // text: '步骤一',
        desc: '地址'
      },
      {
        // text: '步骤二',
        desc: '户型'
      },
      {
        // text: '步骤二',
        desc: ' 房间'
      }
    ],
    elTabName:'',
    hostingRooms:[{
      roomName:'房间A',
      leaseStatus: 0 //0-未出租 1-已出租
    }],
    checkedArray:[false],
    roomNum :1,
    allRoomLen:Number,
    gray:'',
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let params = wx.getStorageSync('etryHouseData')
    console.log(params)
    this.setData({
      allRoomLen: params.chamberCount*1
    })
    if (this.data.roomNum === this.data.allRoomLen) {
      this.setData({
        gray: 'gray'
      })
    }
  },
//checked data
  onChange(e) {
    this.data.checkedArray[e.currentTarget.dataset.id] = e.detail
    this.setData({
      checkedArray: this.data.checkedArray
    })
    this.data.hostingRooms[e.currentTarget.dataset.id].leaseStatus = !e.detail?1:0
    this.setData({
      hostingRooms:this.data.hostingRooms
    })
  },
  //添加房间
  addRoom(){
    if (this.data.roomNum === this.data.allRoomLen){
      wx.showToast({
        title: '房间添加完成',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    this.data.hostingRooms.push({
     roomName: '房间' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[this.data.roomNum],
      leaseStatus: 0 //0-未出租 1-已出租
    })
    this.setData({
      hostingRooms: this.data.hostingRooms,
      roomNum: this.data.hostingRooms.length
    })
    if (this.data.roomNum=== this.data.allRoomLen){
      this.setData({
        gray: 'gray'
      })
    }
  },
  //提交数据
  submitEntry(e){
    this.setData({
      loading:true
    })
    let datasetName = e.currentTarget.dataset.name
    let params = wx.getStorageSync('etryHouseData')
    params.houseRentType = wx.getStorageSync('houseRentType')
    params.hostingRooms = deepClone(this.data.hostingRooms)
    console.log('params', params)
    fetch('/presaveRoom',{
      method: 'savePresaveRoom', //保存未完善房源
      params: {
        hostingInfo: JSON.stringify(params)
      }
    }).then((res)=>{
      if (datasetName === 'continueEntryHouse') {  //继续录入
        this.setData({
          loading: false
        })
        wx.redirectTo({
          url: '../../entryHouse/entryHouse?houseRentType=2&lr=true'
        })
        // wx.reLaunch({
        //   url: '../../personalCenter/personalCenter'
        // })
      } else if (datasetName === 'saveEntryHouse') {
        this.setData({
          loading: false
        })
        wx.redirectTo({
          url: '../../wanShanHouse/wanShanHouse?lr=true',  // 跳转到完善房源页面
        })
      }
    })
  }
})