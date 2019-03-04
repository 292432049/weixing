const fetch = require('../../utils/api.js')
import { deepClone } from '../../utils/util.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    roomSetShow:false,//房间号配置
    unitCodeShow:false,//单元
    roomNoShow:false,//房间号
    active:'0',
    roomInputShow:false, //是否展示房间输入
    houserAdress:'',
    areaId:'',//区ID
    apartmentData:{},//小区传过来的数据
    areaBankuai:{  //区域板块数据
      index:0,
      pickerDisabled:true,
      areaCity: []
    }, 
    zoneName:'',
    zonidName:false,
    lr:false,
    etryHouseData:{  
      houseRentType:'',//房屋出租类型 1整租  2合租
      estateName: "", //品牌公寓
      provinceId: "", //省ID
      cityId: "", //市ID
      regionId: "", //区Id
      zoneId: "", //板块id
      regionAddressId: "", //小区ID
      buildingName: "",//楼幢名
      unitCode: '',//单元
      roomNo: '',//房间号
      floorName: '',//楼层
      floorAmount: '', //楼层总数
      kitchenCount:0, // 厨
      leaseStatus: 0,//租房状态
    },
    errTips:{
      estateName: '请输入品牌公寓', //品牌公寓
      buildingName: '请输入正确楼幢名',//楼幢名
      floorAmount:'请输入正确楼层总数',
      unitCode: '请输入正确单元号',//单元
      roomNo: '请输入正确的房间号',//房间号
      zoneId: '请选择区域板块', //板块id
      houserAdress:'请选择房源地址', //房源地址
      floorName:'所在楼层只能输入数字', //所在楼层
      floorMan:'请选择楼幢门牌'
    },
    steps:[],
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
  },
  //输入框获取值
  onChange(e){
    this.data.etryHouseData[e.currentTarget.id] = e.detail
    this.setData({
      etryHouseData: this.data.etryHouseData
    })
  },
  //校验number
  checkNumber(value){
    if (!/^[0-9]*$/.test(value)){
      return true
    }else{
      return false
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)
    if (options.lr){
      this.setData({
        lr:true
      })
    }
    const that = this;
    that.setData({
      "etryHouseData.houseRentType": app.globalHouseData.houseRentType
    })
    wx.setStorageSync('houseRentType', app.globalHouseData.houseRentType)
    if (this.data.etryHouseData.houseRentType * 1 === 1) {// 整租
      this.setData({
        steps: deepClone(this.data.steps1)
      })
    } else if (this.data.etryHouseData.houseRentType * 1 === 2) { //合租
      this.setData({
        steps: deepClone(this.data.steps2)
      })
    }
  },
  onShow(){
  },
  addressShowHandel(){
    wx.navigateTo({
      url: '../../common/selectCity/selectCity'
    })
  },
  //楼幢门牌号配置
  floorNumSet() {
    this.setData({
      roomSetShow: true
    })
  },
  //关闭地址弹窗
  floorNumClose(){
    this.setData({
      roomSetShow:false
    })
  },
  //区域板块选择
  bindPickerChange: function (e) {
    this.data.etryHouseData.zoneId = e.detail.value
    this.setData({
      'etryHouseData.zoneId': this.data.areaBankuai.areaCity[e.detail.value].id,
      zoneName: this.data.areaBankuai.areaCity[e.detail.value].name
    })
  },
  zoneIdCheck(){
    if (this.data.areaBankuai.areaCity.length === 0) {
      if (this.data.houserAdress === '') {
        wx.showToast({
          title: '请先选择房源地址',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      if (this.data.houserAdress !== '') {
        wx.showToast({
          title: '暂无板块数据',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    } 
    return true
  },
  pickerChangeShow(){
    if (this.zoneIdCheck()){
      this.setData({
        'areaBankuai.pickerDisabled': false
      })
    }
  },
  //楼幢选择
  getBuildingName(e){
    this.setData({
      'etryHouseData.buildingName': e.currentTarget.dataset.name
    })
    if (e.currentTarget.dataset.name){
      this.setData({
        roomSetShow:false,
        unitCodeShow:true
      })
    }
  },
  //选择单元
  getUnitCode(e){
    this.setData({
      'etryHouseData.unitCode': e.currentTarget.dataset.name
    })
    if (e.currentTarget.dataset.name) {
      this.setData({
        unitCodeShow: false,
        roomNoShow: true
      })
    }
  },
  //选择房间号
  getFloorNameNum(e){
    this.setData({
      'etryHouseData.roomNo': e.currentTarget.dataset.name,
      'etryHouseData.floorName': e.currentTarget.dataset.name.substring(0,1)
    })
    if (e.currentTarget.dataset.name) {
      this.setData({
        roomNoShow: false,
      })
    }
  },
  showTips(text){
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  //下一步
  nextTep(e){   
    if (this.data.etryHouseData.estateName === ''){
      this.showTips(this.data.errTips.estateName)
    } else if (this.data.houserAdress === ''){
      this.showTips(this.data.errTips.houserAdress)
    } else if (this.data.etryHouseData.zoneId === '' && this.data.areaBankuai.areaCity.length!==0){
      this.showTips(this.data.errTips.zoneId)
    } else if (this.data.etryHouseData.buildingName === '') {
      this.showTips(this.data.errTips.buildingName)
    }else if (this.data.etryHouseData.floorAmount === '') {
      this.showTips(this.data.errTips.floorAmount)
    } else if(this.data.etryHouseData.floorAmount > 100){
      this.showTips('楼层数不能大于99')
    } else if (this.data.etryHouseData.floorName === '' || this.checkNumber (this.data.etryHouseData.floorName)) {
      this.showTips(this.data.errTips.floorName)
    } else if (this.data.etryHouseData.roomNo === '' || this.checkNumber(this.data.etryHouseData.roomNo)) {
      this.showTips(this.data.errTips.roomNo)
    } else if (this.data.etryHouseData.floorName *1 >this.data.etryHouseData.floorAmount*1){
      this.showTips('所在楼层不能大于楼层总数')
    } else if (this.data.etryHouseData.unitCode === ''){
      this.showTips(this.data.errTips.unitCode)
    }else{
      this.setData({
        loading:true
      })
      let etryHouseData = JSON.stringify(this.data.etryHouseData)
      wx.setStorageSync('etryHouseData', etryHouseData)
      wx.navigateTo({
        url: 'roomType/roomType?etryHouseData=' + etryHouseData
      })
      this.setData({
        loading: false,
        zonidName:false
      })
    }
  },
  //页面显示的时候：
  onShow(){
    let that = this
    console.log(that.data.apartmentData.buildingInfo)  //搜索地址获取的shuju
    //判断是显示输入 还是显示选择
    if (!that.data.apartmentData.buildingInfo){
      this.setData({ 
        roomInputShow:true
      })
    }else{
      this.setData({
        roomInputShow: false,
      })
    }
    if (!!that.data.apartmentData.buildingInfo) { //获取楼层总数
      this.setData({
        'etryHouseData.floorAmount': that.data.apartmentData.buildingInfo.floorAmount
      })
    }
    // 获取板块数据
    if (!!that.data.apartmentData.areaId) {  //regionId 区id不为空
    // 房源地址赋值
    this.setData({
      houserAdress: that.data.houserAdress,
      'etryHouseData.provinceId': that.data.apartmentData.provinceId, //省ID
      'etryHouseData.cityId': that.data.apartmentData.cityId, //市ID
      'etryHouseData.regionId': that.data.apartmentData.areaId, //区Id
    })
    fetch('fangyuan/queryZoneListByAreaId',{
      params: {
        'regionId': that.data.apartmentData.areaId //要传区ID
      }
    },{
      method:'POST'
    }).then((data)=>{
      this.data.areaBankuai.areaCity = [];
      data.list.map((item)=>{
          this.data.areaBankuai.areaCity.push(JSON.parse(JSON.stringify(item).replace('zoneId', 'id').replace('zoneName', 'name')))
        })
      // console.log(this.data.zonidName)
      if (this.data.zonidName){
         this.setData({
           zoneName: ''
         })
      }
        this.setData({
          'areaBankuai.areaCity': this.data.areaBankuai.areaCity,
        })
      if (this.data.areaBankuai.areaCity.length !== 0){
          this.setData({
            'areaBankuai.pickerDisabled': false
          })
        }
    })
    }
  },
  onUnload(option) {
    const pages = getCurrentPages(); // 当前页面
    if (this.data.lr === true) {
      wx.navigateBack({
        delta: pages.length
      })
    }
  }
})