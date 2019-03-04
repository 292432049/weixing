import { validateMobile } from '../../utils/validate.js'
import { deepClone } from '../../utils/util.js'
Component({
  properties:{
    houseArea:{
      type:Number,
      value:''
    },
    imgNum:{
      type: Number,
      value: 0
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    active: '0',
    roomSetShow: false,//房间设施选择弹层
    steps: [
      {
        desc: '房间'
      },
      {
        desc: '价格'
      }
    ],
    roomDirectionList: [
      {
        label: '朝南',
        value: 1
      },
      {
        label: '朝北',
        value: 2
      },
      {
        label: '朝东',
        value: 3
      },
      {
        label: '朝西',
        value: 4
      },
      {
        label: '东南',
        value: 5
      },
      {
        label: '西南',
        value: 6
      },
      {
        label: '东北',
        value: 7
      },
      {
        label: '西北',
        value: 8
      }
    ],
    checkItems: [
      { name: ' 床', value: 1 },
      { name: '洗衣机', value: 2 },
      { name: '空调', value: 3 },
      { name: '冰箱', value: 4 },
      { name: '电视', value: 5 },
      { name: '宽带', value: 6 },
      { name: '沙发', value: 7 },
      { name: '茶几', value: 8 },
      { name: '书桌', value: 9 },
      { name: '餐桌', value: 10 },
      { name: '独卫', value: 11 },
      { name: '衣柜', value: 12 }
    ],
    roomfeaturesShow:false,
    roomFeatures:[
        {
          name: '独立卫生间',
          value: 1
        },
        {
          name: '独立阳台',
          value: 2
        },
        {
          name: '独立厨房',
          value: 3
        },{
          name: '带飘窗',
          value: 4
        },
    ],
    // imgNum:0,
    // picturesShow:false,
    roomAttributesName:'',
    roomDirectionLabel: '',
    facilityItemsName: '',
    hostingRooms: {  // 房源参数
      roomArea: '',//房间面积
      roomDirection: '', //朝向
      facilityItems: '',//房间设施
      roomAttributes:'',//房间
      pictures: [],
    },
    errorTips: {
      contactName: '请输入联系人姓名',
      contactMobile: '请输入联系人电话',
      roomArea: '请输入房间面积',
      roomDirection: '请选择朝向',
      pictures: ' 请上传图片'
    }
  },
  methods: {
    //输入框获取值
    onChange(e) {
      this.data.hostingRooms[e.currentTarget.dataset.id] = (typeof e.detail === 'string') ? e.detail : e.detail.value
      this.data.hostingRooms = this.data.hostingRooms
      if (e.currentTarget.dataset.id === 'roomArea') {
        this.setData({
          'hostingRooms.roomArea': (this.data.hostingRooms.roomArea * 1) === 0 ? 0 : (this.data.hostingRooms.roomArea * 1).toFixed(2)
        })
      }
    },
    /*朝向picker*/
    directionPickerChange(e) {
      this.setData({
        'hostingRooms.roomDirection': e.detail.value * 1 + 1,
        roomDirectionLabel: this.data.roomDirectionList[e.detail.value].label,  
      })
    },
    //房间特色
  //  featuresPickerChange(e) {
  //    this.setData({
  //      'hostingRooms.roomAttributes': e.detail.value * 1 + 1
  //    })
  //    this.setData({
  //      roomFeaturesLabel: this.data.roomFeatures[e.detail.value].label
  //    })
  //   },
    //房间设置选择
    checkboxChange(e) {
      const name =e.currentTarget.dataset.name
      const checkedName = e.detail.value.map((item, index, key) => {
        return item.split(',')
      })
      const items = checkedName.map((item) => {
        return item[0]
      })
      const itemsName = checkedName.map((item) => {
        return item[1]
      })
      this.data.hostingRooms[name] = items.join(',')
      this.data[name + 'Name'] = itemsName.join(',')
      this.setData({
        // hostingRooms: this.data.hostingRooms,
        facilityItemsName: this.data.facilityItemsName,
        roomAttributesName: this.data.roomAttributesName
      })
    },
    sureRoomSetClick() {
      this.setData({
        roomSetShow: false,
        roomfeaturesShow: false
      })
    },
    showPopuRoomSet(e) {
      const name = e.currentTarget.dataset.name
      console.log(name)
      if (name === "roomSetShow" ){
        this.setData({
          roomSetShow: true
        })
      } else if (name === "roomfeaturesShow" ){
        this.setData({
          roomfeaturesShow: true
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
    // 上传图片
    upLoadImg() {
      // this.setData({
      //   picturesShow: true
      // })
      wx.navigateTo({
        url: '../../roomSet/picture/picture?pictureLink=room',
      })
    },
    // closeUploadImg(e) {
    //   this.picture = this.selectComponent('#picture');
    //   this.data.hostingRooms.pictures = deepClone(this.picture.data.pictures) 
    //   console.log(this.data.hostingRooms.pictures)
    //   this.setData({
    //     picturesShow: false,
    //     "imgNum": this.picture.data.pictures.length
    //   })
    // },
    formReset(){
      console.log('重置表单')
    },
    // 验证表单
    formValidate() {
      if (!this.data.hostingRooms.roomArea) {
        this.showTips(this.data.errorTips.roomArea)
        return false
      } 
      if (this.data.hostingRooms.roomArea > this.data.houseArea){
        wx.showToast({
          title: '房间面积不能大于房屋面积',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      console.log(this.data.hostingRooms.roomDirection)
      if (!this.data.hostingRooms.roomDirection) {
        this.showTips(this.data.errorTips.roomDirection)
        return false
      }
      if (this.data.imgNum === 0) {
        this.showTips(this.data.errorTips.pictures)
        return false
      }
      return true
    }
  }
})