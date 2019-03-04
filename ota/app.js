//app.js
const fetch = require('utils/api.js')
App({
  data:{
  },
  onLaunch: function () {
    // 启动的时候可以在这里判断登录状态
  },
  globalData: {
    /**
     * globalData 存放全局数据管理
     * @params sessionId 登录鉴权
     * @params userInfo 用户信息
     */
    sessionId: null,
    userInfo: null,
  },
  globalHouseData:{
    houseRentType:''
  },
  pictures:{
    housePictures: [],
    roomPictures: [],
    defaultPictures: []
  }
})