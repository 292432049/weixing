// pages/configureHouse/configureHouse.js
Component({
  properties: {
    nextPrevData:{
      type:Object,
      value:''
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    payOfPayments:[
      {
        label: '月付',
        value: 1
      }, {
        label: '双月付',
        value: 2
      },
      {
        label: '季付',
        value: 3
      },
      {
        label: '半年付',
        value: 6
      },
      {
        label: '年付',
        value: 12
      },
    ],
    payOfPaymentLabel:'',
    depositOfPayments:[
      {
        label: '自定义',
        value: 13
      },
      {
        label: '一个月',
        value: 1
      }, {
        label: '两个月',
        value: 2
      },
      {
        label: '无需押金',
        value: 0
      }
    ],
    depositOfPaymentLabel:'',
    serviceCycles:[ //服务费周期
      {
        label: '一次性付清',
        value: 3
      }, {
        label: '随租金付',
        value: 2
      }
    ],
    serviceCycleLabel:'',
    dataArray: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9'],  //室
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],// 厅
    ],
    serviceData:{
      serviceChargePrice: '',//服务费金额
      serviceFeeType: '',//服务费周期
    },
    roomPriceData:{
      depositOfPayment:'',//押
      payOfPayment:'', //付
      rent:'',//租金
      deposit:''//押金
    },
    depositDiabled:false,
    errTips:{
      serviceChargePrice: '请输入服务费',//服务费金额
      serviceFeeType: '请选择服务费周期',//服务费周期
      depositOfPayment: '请选择押金方式',//押
      payOfPayment: '请选择付款方式', //付
      rent: '请输入租金',//租金
      deposit: '请输入押金'//押金
    }
  },
  methods:{
    // 服务费周期
    serviceCycleChange(e){
      this.setData({
        serviceCycleLabel: this.data.serviceCycles[e.detail.value].label,
        'serviceData.serviceFeeType': this.data.serviceCycles[e.detail.value].value
      })
      console.log('服务费周期',e.detail.value)
    },
    //押金方式
    depositOfPaymentChange(e){
      console.log(e.detail.value)
      let depositOfPayment = this.data.depositOfPayments[e.detail.value]
      if (e.detail.value*1 === 0){
        this.setData({
          depositDiabled: false,
        })
      }else{
        this.setData({
          depositDiabled:true,
        })
      }
      // 改变押金方式 押金随机改变
      let roomPriceData = this.data.roomPriceData 
      if (e.detail.value*1 === 0){
        this.setData({
          depositOfPaymentLabel: depositOfPayment.label,
          'roomPriceData.depositOfPayment': depositOfPayment.value,
        })
      }else{
        console.log(roomPriceData.rent * depositOfPayment.value)
        let deposit = roomPriceData.rent * depositOfPayment.value === 0 ? 0 : (roomPriceData.rent * depositOfPayment.value).toFixed(2)
        this.setData({
          depositOfPaymentLabel: depositOfPayment.label,
          'roomPriceData.depositOfPayment': depositOfPayment.value,
          'roomPriceData.deposit': deposit
        })
        console.log(roomPriceData.rent)
        console.log(depositOfPayment.value)
      }
    },
    //付款方式
    payOfPaymentChange(e){
      this.setData({
        payOfPaymentLabel: this.data.payOfPayments[e.detail.value].label,
       "roomPriceData.payOfPayment": this.data.payOfPayments[e.detail.value].value
      })
    },
    //输入框事件
    rentChange(e) {
      //改变租金价格 押金随机改变
      let roomPriceData = this.data.roomPriceData 
      roomPriceData.rent = (e.detail.value * 1) === 0 ? 0 : (e.detail.value * 1).toFixed(2)
      if (this.data.depositOfPaymentLabel !== "自定义") { // 如果是自定义  押金不随租金改变
        this.data.roomPriceData.deposit = (roomPriceData.rent * roomPriceData.depositOfPayment * 1).toFixed(2)
      }
      this.setData({
        roomPriceData: this.data.roomPriceData,
        "roomPriceData.deposit": this.data.roomPriceData.deposit
      })
    },
    //自定义时候输入押金
    onChange(e){
      if (e.currentTarget.dataset.name === 'serviceChargePrice'){
        this.setData({
          'serviceData.serviceChargePrice': (e.detail.value * 1).toFixed(2)
        })
      }else{
        this.data.roomPriceData[e.currentTarget.dataset.name] = e.detail.value * 1 === 0 ? 0 : (e.detail.value * 1).toFixed(2)
        this.setData({
          roomPriceData: this.data.roomPriceData
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
    //验证
    formValidate(){ 
      let roomPriceData = this.data.roomPriceData
      let errTips = this.data.errTips
      if (!roomPriceData.payOfPayment){
        this.showTips(errTips.payOfPayment)
        return false
      }
      if (this.data.depositOfPaymentLabel===''){
        this.showTips(errTips.depositOfPayment)
        return false
      }
      if (!roomPriceData.rent) {
        this.showTips(errTips.rent)
        return false
      }
      return true
    }
  }
})