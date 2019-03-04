// pages/entryHouse/roomType/roomType.js
const fetch = require('../../../utils/api.js')
import { deepClone } from '../../../utils/util.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    checked:false,
    pickerColumn:'',
    popupShow:false,
    roomDataShow:false, //
    currentDataset:'',
    currentDatasetName:'卧室',
    dataName:'chamberCount',
    chamberCountShow: false,//室
    boardCountShow: false,//厅
    kitchenCountShow: false,//厨
    toiletCountShow: false,//卫
    pickerdefalutvalue:0,
    dataArray:[
      ['1', '2', '3', '4', '5', '6', '7', '8','9'],  //室
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],// 厅
      ],
    steps: [],
    steps1: [
      {
        desc: '地址'
      },
      {
        desc: '户型'
      }
    ],
    steps2: [
      {
        desc: '地址'
      },
      {
        desc: '户型'
      },
      {
        desc: ' 房间'
      }
    ],
    etryHouseData:{  
      chamberCount: '请选择', // 室
      boardCount: '请选择', //厅
      toiletCount: '请选择', //wei
      kitchenCount:'请选择' // 厨
    },
    houseRentType:0,
    params:{},
    loading: false
  },
  onLoad(options){
    
  },
  onShow(){
    this.setData({
      houseRentType: wx.getStorageSync('houseRentType')
    })
    if (this.data.houseRentType * 1 === 1) {// 整租
      this.setData({
        steps: deepClone(this.data.steps1)
      })
    } else if (this.data.houseRentType * 1 === 2) { //合租
      this.setData({
        steps: deepClone(this.data.steps2)
      })
    }
  },
  //室厅厨卫生点击事件
  chamberCountClick(e){
    this.setData({
      popupShow:true,
      chamberCountShow: true,//室
      roomDataShow: false,
      boardCountShow: false,//厅
      kitchenCountShow: false,//厨
      toiletCountShow: false,//卫
      currentDataset: e.currentTarget.dataset.name
    })
  },
  onClose(){
    this.setData({
      popupShow: false
    })
  },
  roomCountClick(e){
    this.setData({
      popupShow: true,
      chamberCountShow: false,
      boardCountShow: false,//厅
      kitchenCountShow: false,//厨
      toiletCountShow: false,//卫
      roomDataShow: true,
      currentDataset: e.currentTarget.dataset.name
    })
    if (e.currentTarget.dataset.name === 'boardCount'){
        this.setData({
          boardCountShow: true,//厅
          kitchenCountShow: false,//厨
          toiletCountShow: false,//卫
          pickerdefalutvalue:1,
          currentDatasetName:'客厅'
        })
        
    } else if (e.currentTarget.dataset.name === 'toiletCount'){
      this.setData({
        boardCountShow: false,//厅
        kitchenCountShow: false,//厨
        toiletCountShow: true,//卫
        pickerdefalutvalue:0,
        currentDatasetName: '卫生间'
      })

    } else if (e.currentTarget.dataset.name === 'kitchenCount'){
      this.setData({
        boardCountShow: false,//厅
        kitchenCountShow: true,//厨
        toiletCountShow: false,//卫
        pickerdefalutvalue:0,
        currentDatasetName: '厨房'
      })
    }
  },
  //点击选项
  pickerBindChange(e){
    this.data.etryHouseData[this.data.currentDataset] = parseInt(e.detail.value)
    if (this.data.chamberCountShow){
      this.data.etryHouseData[this.data.currentDataset] = parseInt(e.detail.value)+1
    }
    this.setData({
      etryHouseData: this.data.etryHouseData
    })
  },
  // 关闭选项
  closePopup(obj){
    if (obj.chamberCount !== '请选择' && obj.kitchenCount !== '请选择' && obj.toiletCount !== '请选择' && obj.toiletCount !== '请选择') {
      this.setData({
        popupShow: false
      })
    } else {
      this.setData({
        popupShow: true
      })
    }
  } ,
  //点击确定
  sureClick(e){
    const dataset = e.currentTarget.dataset.name
    const obj = this.data.etryHouseData
    if (dataset === 'chamberCount'){ //卧室
      if (obj[dataset] === '请选择'){
        obj[dataset] = 1
        this.setData({
          "etryHouseData.chamberCount":1
        })
      }
      this.setData({
        chamberCountShow: false,//室
        boardCountShow: true,//厅
        kitchenCountShow: false,//厨
        toiletCountShow: false,//卫
        roomDataShow:true,
        currentDataset:'boardCount',
        currentDatasetName:'客厅'
      })
      this.closePopup(obj)
    }
    if (dataset === 'boardCount') { //客厅
      if (obj[dataset] === '请选择') {
        obj[dataset] = 1
        this.setData({
          "etryHouseData.boardCount": 0
        })
      }
      this.setData({
        chamberCountShow: false,//室
        boardCountShow: false,//厅
        kitchenCountShow: true,//厨
        toiletCountShow: false,//卫
        roomDataShow: true,
        currentDataset: 'kitchenCount',
        currentDatasetName: '厨房',
      })
      this.closePopup(obj)
    }
    if (dataset === 'kitchenCount') { //厨房
      if (obj[dataset] === '请选择') {
        obj[dataset] = 1
        this.setData({
          "etryHouseData.kitchenCount": 0
        })
      }
      this.setData({
        chamberCountShow: false,//室
        boardCountShow: false,//厅
        kitchenCountShow: false,//厨
        toiletCountShow: true,//卫
        roomDataShow: true,
        currentDataset: 'toiletCount',
        currentDatasetName: '卫生间'
      })
      this.closePopup(obj)
    }
    if (dataset === 'toiletCount') { //卫生间
      if (obj[dataset] === '请选择') {
        obj[dataset] = 1
        this.setData({
          "etryHouseData.toiletCount": 0
        })
      }
      this.setData({
        chamberCountShow: false,//室
        boardCountShow: false,//厅
        kitchenCountShow: false,//厨
        toiletCountShow: true,//卫
        roomDataShow: true,
      })
      this.closePopup(obj)
    }
  },
  //changedata
  onChange({detail}){
    this.setData({
      checked:detail
    })
  },
  getStorageData(){ 
    let params = JSON.parse(wx.getStorageSync('etryHouseData'))
    params.chamberCount = this.data.etryHouseData.chamberCount
    params.boardCountShow = this.data.etryHouseData.boardCount
    params.kitchenCount = this.data.etryHouseData.kitchenCount
    params.toiletCount = this.data.etryHouseData.toiletCount
   return params
  },
  nextTeps(){  //合租 
    if(this.formValidate()){
      wx.setStorage({
        key: 'etryHouseData',
        data: this.getStorageData()
      })
      wx.navigateTo({
        url: '../../entryHouse/addRoom/addRoom',
      })
    }
  },
  showTips(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  formValidate(){
    const obj = this.data.etryHouseData
    if (obj.chamberCount === '请选择'){
      this.showTips('请选择卧室')
      return false
    } else if (obj.kitchenCount === '请选择'){
      this.showTips('请选择客厅')
      return false
    } else if (obj.toiletCount === '请选择'){
      this.showTips('请选择厨房')
      return false
    } else if (obj.toiletCount === '请选择'){
      this.showTips('请选择卫生间')
      return  false
    }else {
      return true
    }
  },
  //提交数据
  submitEntry(e){
    if (this.formValidate()){
      let datasetName = e.currentTarget.dataset.name
      let params = this.getStorageData()
      params.leaseStatus = this.data.checked ? 1 : 0 //0 未出租 1已出租
      params.houseRentType = this.data.houseRentType
      this.setData({
        loading: true
      })
      fetch('/presaveRoom', {
        method: 'savePresaveRoom', //保存未完善房源
        params: {
          hostingInfo: JSON.stringify(params)
        }
      }).then((res) => {
        if (datasetName === 'continueEntryHouse') {  //继续录入
          wx.redirectTo({
            url: '../../entryHouse/entryHouse?houseRentType=1&lr=true',  // 跳转到完善房源页面
          })
        } else if (datasetName === 'saveEntryHouse') {
          wx.redirectTo({
            url: '../../wanShanHouse/wanShanHouse?lr=true'
          })
        }
        this.setData({
          loading: false
        })
      })
    }
  }
})