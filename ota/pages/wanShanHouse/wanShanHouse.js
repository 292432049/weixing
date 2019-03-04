// pages/wanShanHouse/wanShanHouse.js
const fetch = require('../../utils/api.js')
import Dialog from '../../components/dialog/dialog';
import { deepClone } from '../../utils/util.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    popupShow:false,
    editData:'',
    lr:false,
    presaveRoomList:{}   // 列表数据
  },
  //获取小区房间的接口
  getHouseData(){
    fetch('presaveRoom',{
      method: 'queryPresaveRoomList'
    }).then((data)=>{
       this.setData({
         presaveRoomList: deepClone(data)
       })
    })
  },
  //点击房间编辑
  entryRoomPz(e){
    console.log('展开编辑')
    this.setData({
      popupShow: true,
    })
    this.setData({
      editData: e.currentTarget.dataset.name
    })
    wx.setStorageSync('editRoomData', this.data.editData)
    app.globalHouseData.houseRentType = this.data.editData.houseRentType
  },
  canclePopup(){
    this.setData({
      popupShow: false
    })
  },
  deletHouse(){
    let params={
      id: this.data.editData.id
    }
    if (this.data.editData.houseRentType === 2){
      params.roomName = this.data.editData.roomName
    }
    Dialog.confirm({
      title: '',
      message: '确定删除房源吗？'
    }).then(() => {
      fetch('presaveRoom', {
        method: 'deletePresaveRoom',
        params: params
      }).then((res) => {
        this.getHouseData();
        this.setData({
          popupShow: false
        })
      })
    }).catch(() => {
      
    });
  },
  editHouseFun(){
    console.log('编辑')
    console.log(getCurrentPages().length)
    wx.navigateTo({
      url: '../roomSet/nextPage/nextPage?houseRentType=' + JSON.stringify(this.data.editData),
      success:function(){
        console.log('成功')
      },
      fail:function(){
        console.log('失败')
      }
    })
  },
  onHide() { 
    this.setData({
      popupShow: false
    })
  },
  onLoad: function (option) {  
    if (option.lr){
      this.setData({
        lr: true
      })
    }
  },
  onShow(){
    this.getHouseData()
    wx.removeStorageSync('imgaddrHouse')
    wx.removeStorageSync('imgaddrRoom')
    app.pictures.housePictures = []
    app.pictures.roomPictures = []
    app.pictures.defaultPictures = []
  },
  onUnload(option){
    const pages = getCurrentPages(); // 当前页面
    if (this.data.lr === true){
      wx.navigateBack({
        delta: pages.length
      })
    }
  }
})