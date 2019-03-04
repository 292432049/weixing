// common/apartment/apartment.js
import { deepClone } from '../../utils/util.js'
const fetch = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    nameData:[],
    list: [{
      "address": "浙江省杭州市西湖区",
      "provinceId": "省id",
      "cityId": "市id",
      "regionId": "区id",
      "name": "(昭阳区) 文三路西湖区199号",
      "regionAddressId": "",
    },
    {
        "address": "浙江省杭州市西湖区",
        "provinceId": "省id",
        "cityId": "市id",
        "regionId": "区id",
        "name": "(西湖区) 文二西路10938",
        "regionAddressId": "",
        "buildingInfo": {
          "buildingName": ["1栋", "2栋"],
          "unitCode": ["1单元", "2单元"],
          "floor": {
            "1层": ["101", "102"],
            "2层": ["201", "202"]
          },
          "floorAmount": 2
        }
      }],
    adressId:'', //请求参数的ID
    keyword:'',
    showAdressList:true
  },
  onLoad(e){
    this.setData({
      adressId: e.adressId
    })
  },
  searchChange(e){
    this.setData({
      keyword: e.detail
    })
  },
  searchSubmit(event){
    fetch('fangyuan/searchAddressByKeyword', {  //请求搜索小区接口
      params: {
        'cityId': this.data.adressId,
        'keyword': this.data.keyword
      }
    }).then(res => {
      if (res.list){
          this.setData({
            nameData: deepClone(res.list),
            showAdressList:true
          })
        this.data.nameData.map(item => {
          item.adressText = item.name.split(")")
          item.nameQu = item.adressText[0].substring(1)
          item.nameAdress = item.adressText[1].replace("(",'').replace('</span>','').replace("<span style='color:red;'>",'')
        })
        this.setData({
          nameData: this.data.nameData
        })
      }else{
       this.setData({
         showAdressList:false
       })
      }
    })
  },
  backEntryHouse(e){
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 3];//上一页面
    prevPage.setData({//直接给上移页面赋值
      apartmentData: e.currentTarget.dataset.id,
      houserAdress: e.currentTarget.dataset.name,
      "etryHouseData.regionAddressId": e.currentTarget.dataset.regionaddressid,
      zonidName:true
    })
    wx.navigateBack({//返回
      delta: 2
    })
  },
  onUnload: function () {
    // if (getCurrentPages().length == 3) {
    //   wx.navigateBack({
    //     delta: 2
    //   })
    // }
  }
})