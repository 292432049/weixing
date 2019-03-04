// common/selectCity/selectCity.js
import { deepClone } from '../../utils/util.js'
const fetch = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressShow:false,
    cityData:{},
    scrollTop:'',
    toCity:'ABCDEFGHJKLMNOPQRSTWXYZ',
    toCityArray:[],
    clientHeight:Number,
    scrollTopId:'',
    fixedAdressId:''
  },
  onLoad(){
    this.getCityNameOFLocation();
    this.getCityList()
    this.setData({
      toCityArray: this.data.toCity.split('')
    })
  },
  onReady(){
    this.getRect()
  },
  // 获取页面高度
  getRect(){
    let that = this
    wx.getSystemInfo({
      success(res){
        that.setData({
          clientHeight:res.windowHeight
        })
      }
    })
  },
  getCityList(){
    fetch('presaveRoom', { 
      method: 'queryAllCity'
    },{
      method:"POST"
    }).then(data => {
      let newData = deepClone(data)
      for (const item in newData){
        if (newData[item].length === 0){
          delete newData[item]
        }
      }
      this.setData({
        cityData: deepClone(newData)
      })
    })
  },
  toCityPosition(e){
    this.setData({
      scrollTopId: 'address'+e.currentTarget.id
    })
  },
  // 重新定位
  getCityNameOFLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐
      success: function (res) {
        // console.log("定位成功");
        var locationString = res.latitude + "," + res.longitude;
        console.log(locationString)
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            "key": "PZ3BZ-VEYCV-QBEP6-UKVAY-IJPT7-2BFS3",
            "location": locationString
          },
          method: 'GET',
          // header: {}, 
          success: function (res) {
            console.log("请求成功", res);
            that.setData({
              currentAdress: res.data.result.address_component.city,
              fixedAdressId: res.data.result.ad_info.adcode.substr(0,4)*1+'00'
            })
          },
          fail: function () {
            // fail
            // console.log("请求失败");
          },
          complete: function () {
            // complete
            // console.log("请求完成");
          }
        })
      },
      fail: function () {
        // fail
        // console.log("定位失败");
      },
      complete: function () {
        // complete
        // console.log("定位完成");
      }
    })
  },
  selectCity(e){
    wx.navigateTo({
        url: '../../common/apartment/apartment?adressId=' + e.currentTarget.dataset.id
    })
  }
})