import { validateMobile } from '../../utils/validate.js'
import { deepClone } from '../../utils/util.js'
Component({
  properties: {
    defaultHostingInfo:{
      type:Object,
      value:null
    },
    imgNum:{
      type:Number,
      value:0
    },
    pictureName:{
      type:String,
      value:'房间照片'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    // imgNum:0,
    active: '0',
    roomSetShow:false,//房间设施选择弹层
    textareaShow:true,
    // picturesShow:false,
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
    checkItems:[
      { name: '床', value: 1, checked:false},
      { name: '洗衣机', value: 2,checked:false},
      { name: '空调', value: 3, checked: false},
      { name: '冰箱', value: 4, checked: false },
      { name: '电视', value: 5, checked: false},
      { name: '宽带', value: 6, checked: false},
      { name: '沙发', value: 7, checked: false},
      { name: '茶几', value: 8, checked: false},
      { name: '书桌', value: 9, checked: false},
      { name: '餐桌', value: 10, checked: false},
      { name: '独卫', value: 11, checked: false},
      { name: '衣柜', value: 12, checked: false}
    ],
    sexs:[
      {
        label: '男',
        value: 1
      },
      {
        label: '女',
        value: 2
      },
    ],
    sexLabel:'',
    houseDirectionLabel:'',
    facilityItemsName:'',
    hostingInfo:{  // 房源参数
      contactName: '',//联系人
      contactMobile:'', //看房人电话
      houseArea:'',//房间面积
      houseDesc: '',//房间描述
      houseDirection: '', //朝向
      facilityItems:'',//房间设施
      contactGender:'',//性别
      pictures: null,
    },
    errorTips:{
      contactName:'请输入联系人姓名',
      contactMobile:'请输入联系人电话',
      houseArea:'请输入房屋面积',
      houseDesc:'请给房间添加描述',
      houseDirection:'请选择朝向',
      pictures:' 请上传图片'
    }
  },
  lifetimes:{
    ready() {

    setTimeout(()=>{
      let defaultHostingInfo = this.data.defaultHostingInfo
      console.log('传给组件的默认值2', this.data.defaultHostingInfo)
      //默认值
      if (!!defaultHostingInfo) {
        this.setData({
          hostingInfo: defaultHostingInfo
        })
        let sexLabel = this.data.sexs.filter((item) => {
          if (item.value === defaultHostingInfo.contactGender * 1) {
            return item
          }
        })
        this.setData({
          houseDirectionLabel: this.data.roomDirectionList[defaultHostingInfo.houseDirection * 1 - 1].label
        })
        this.data.houseDirectionLabel = this.data.roomDirectionList[defaultHostingInfo.houseDirection * 1 - 1].label
        let facilityItems = defaultHostingInfo.facilityItems.split(',')
        let facilityItemsArray = []

        this.data.checkItems.map((item) => {
          facilityItems.map((item2) => {
            if (item.value * 1 === item2 * 1) {
              item.checked = true
              facilityItemsArray.push(item.name)
            }
          })
        })
        this.setData({
          checkItems: this.data.checkItems
        })
        this.setData({
          sexLabel: sexLabel[0].label,
          houseDirectionLabel: this.data.houseDirectionLabel,
          facilityItemsName: facilityItemsArray.join(",")
        })
      }
    }, 500)
    }
  },
  methods: {
    //输入框获取值
    onChange(e) {
      // console.log(e.currentTarget.dataset.id)
      this.data.hostingInfo[e.currentTarget.dataset.id] = (typeof e.detail === 'string') ? e.detail : e.detail .value
      // this.setData({
      //   hostingInfo: this.data.hostingInfo
      // })
      this.data.hostingInfo = this.data.hostingInfo
      if (e.currentTarget.dataset.id === 'houseArea'){
        this.setData({
          'hostingInfo.houseArea': (this.data.hostingInfo.houseArea * 1) === 0 ? 0 : (this.data.hostingInfo.houseArea * 1).toFixed(2)
        })
      }
    },
    /*性别*/
    sexPickerChange(e){
      this.setData({
        'hostingInfo.contactGender': e.detail.value*1+1,
        sexLabel: this.data.sexs[e.detail.value].label
      })
    },
    /*朝向picker*/
    directionPickerChange(e){
      this.setData({
        'hostingInfo.houseDirection': e.detail.value*1+1
      })
      this.setData({
        houseDirectionLabel: this.data.roomDirectionList[e.detail.value].label
      })
    },
    //房间设置选择
    checkboxChange(e){
      const houseDirectArray= e.detail.value.map((item,index,key)=>{
        return item.split(',') 
      })
      const facilityItems = houseDirectArray.map((item)=>{
        return item[0]
      })
      const facilityItemsName = houseDirectArray.map((item)=>{
        return item[1]
      })
      this.setData({
        'hostingInfo.facilityItems': facilityItems.join(','),
        facilityItemsName: facilityItemsName.join(',')
      })
    },
    sureRoomSetClick(){
      this.setData({
        roomSetShow: false,
        textareaShow:true
      })
    },
    showPopuRoomSet(){
      this.setData({
        roomSetShow:true,
        textareaShow: false
      })
    },
    textareaBlur(e){
      this.setData({
        'hostingInfo.houseDesc': e.detail.value
      })
    },
    // 上传图片
    upLoadImg(){
      console.log('上传图片')
      wx.navigateTo({
        url: '../../roomSet/picture/picture?pictureLink=house',
      })
    //  this.setData({
    //    picturesShow:true,
    //    textareaShow:false
    //  })
    },
    // closeUploadImg(e){
    //   this.picture = this.selectComponent('#picture');
    //   this.data.hostingInfo.pictures = this.picture.data.pictures
    //   this.setData({
    //     picturesShow: false,
    //     textareaShow: true,
    //     "imgNum": this.picture.data.pictures.length
    //   })
    // },
    showTips(text){
      wx.showToast({
        title: text,
        icon: 'none',
        duration: 2000
      })
    },
    onClose(){
      this.setData({
        roomSetShow:false,
        textareaShow: true
      })
    },
    // 验证表单
    formValidate(){
      if (this.data.hostingInfo.contactName === ''){
        this.showTips(this.data.errorTips.contactName)
        return false
      }
      if (!this.data.hostingInfo.contactMobile) {
        this.showTips(this.data.errorTips.contactMobile)
        return false
      } 
      if (!validateMobile(this.data.hostingInfo.contactMobile)){
        this.showTips('手机号码错误')
        return false
      }
      if (!this.data.hostingInfo.houseArea || this.data.hostingInfo.houseArea*1 === 0) {
        this.showTips(this.data.errorTips.houseArea)
        return false
      } 
      if (!this.data.hostingInfo.houseDirection) {
        this.showTips(this.data.errorTips.houseDirection)
        return false
      }
      if (this.data.imgNum === 0) {
        this.showTips(this.data.errorTips.pictures)
        return false
      }
      if (!this.data.hostingInfo.houseDesc) {
        this.showTips(this.data.errorTips.houseDesc)
        return false
      }
      return true
    }
  }
})