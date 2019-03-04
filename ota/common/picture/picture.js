// common/picture/picture.js
let myBehavior = require('behavior')
Component({
  behaviors: [myBehavior],
  properties: {
    defaultPictures: {
      type: Object,
      value: null
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    imgaddrs:[],
    pictures:[]
  },
  lifetimes: {
    ready: function () {
      setTimeout(()=>{
        if (this.data.defaultPictures) {
          this.data.defaultPictures.map(item => {
            this.data.imgaddrs.push(item.src)
          })
          this.data.pictures = this.data.defaultPictures
          this.setData({
            imgaddrs: this.data.imgaddrs,
            pictures: this.data.pictures
          })
        }
        console.log('this.data.defaultPictures', this.data.defaultPictures)
        console.log('this.data.imgaddrs', this.data.imgaddrs)
      },1000)
    }
  },
  methods: {
    chooseImage() {
      let that = this
      //选择图片
      wx.chooseImage({
        count: '9',
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {  
          for (let i = 0; i < res.tempFilePaths.length;i++){
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePaths[0],
              encoding: 'base64',
              success: (response) => {
                that.data.imgaddrs.push(res.tempFilePaths[i])
                that.setData({
                  imgaddrs: that.data.imgaddrs,
                })
                that.data.pictures.push({
                  src: "data:image/png;base64," + response.data,
                  isBase64: '1',
                  imageName: 'base64Name'
                })
              }
            })
            console.log('结束')
          }
        }
      })
    },
    sureSavePictures(e){
      if(e.currentTarget.dataset.name === 'sure'){
        if (this.data.imgaddrs.length === 0) {
          wx.showToast({
            title: '还未上传图片',
            icon: 'none',
            duration: 2000
          })
          return false;
        } else if (this.data.imgaddrs.length === 15){
          wx.showToast({
            title: '最多只能上传15张图片',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }
      this.triggerEvent('closeUploadImg')
    },
    deleteImgTap(e){
      this.data.pictures.splice(e.currentTarget.dataset.id,1)
      this.data.imgaddrs.splice(e.currentTarget.dataset.id, 1)
      this.setData({
        imgaddrs: this.data.imgaddrs
      })
    }
  }
})