// common/picture/picture.js
import { deepClone } from '../../../utils/util.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgaddrs: [],
    pictures: [],
    count:15,
    pictureLink:'',
    chooseImageTrue:false
  },
  // lifetimes: {
  //   ready: function () {
  //     setTimeout(() => {
  //       if (this.data.defaultPictures) {
  //         this.data.defaultPictures.map(item => {
  //           this.data.imgaddrs.push(item.src)
  //         })
  //         this.data.pictures = this.data.defaultPictures
  //         this.setData({
  //           imgaddrs: this.data.imgaddrs,
  //           pictures: this.data.pictures
  //         })
  //       }
  //       console.log('this.data.defaultPictures', this.data.defaultPictures)
  //       console.log('this.data.imgaddrs', this.data.imgaddrs)
  //     }, 1000)
  //   }
  // },
  onLoad(options){
    this.setData({
      pictureLink: options.pictureLink
    })
    const imgaddrs = wx.getStorageSync('imgaddrHouse')
    if (this.data.pictureLink === 'house') {
      if (app.pictures.defaultPictures.length !== 0 && !imgaddrs) {
        app.pictures.defaultPictures.map((item) => {
          this.data.imgaddrs.push(item.src)
        })
        console.log('重复吗', this.data.imgaddrs)
        this.data.pictures = deepClone(app.pictures.defaultPictures)
        this.setData({
          imgaddrs: this.data.imgaddrs
        })
      } else {
        if (imgaddrs) {
          this.setData({
            imgaddrs: imgaddrs
          })
          this.data.pictures = deepClone(app.pictures.housePictures)
        }
      }
    } else if (this.data.pictureLink === 'room') {
      const imgaddrs = wx.getStorageSync('imgaddrRoom')
      if (imgaddrs) {
        this.setData({
          imgaddrs: imgaddrs
        })
        this.data.pictures = deepClone(app.pictures.roomPictures)
      }
    }
  },
  onShow(){},
  chooseImage() {
    let that = this
    if (this.data.imgaddrs.length === 15){
      wx.showToast({
        title: '最多只能上传15张图片',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //选择图片
    wx.chooseImage({
      count: that.data.count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0],
            encoding: 'base64',
            success: (response) => {
              that.data.imgaddrs.push(res.tempFilePaths[i])
              that.setData({
                imgaddrs: that.data.imgaddrs,
              })
              console.log("1", that.data.pictures)
              that.data.pictures.push({
                src: "data:image/png;base64," + response.data,
                isBase64: '1',
                imageName: 'base64Name'
              })
              console.log("2", that.data.pictures)
              that.setData({
                count: 15 - that.data.imgaddrs.length
              })
            }
          })
          console.log('结束')
        }
      }
    })
  },
  sureSavePictures(e) {
    if (e.currentTarget.dataset.name === 'sure') {
      if (this.data.imgaddrs.length === 0) {
        wx.showToast({
          title: '还未上传图片',
          icon: 'none',
          duration: 2000
        })
        return false;
      } 
    }
    this.triggerEvent('closeUploadImg')
  },
  deleteImgTap(e) {
    this.data.pictures.splice(e.currentTarget.dataset.id, 1)
    this.data.imgaddrs.splice(e.currentTarget.dataset.id, 1)
    this.setData({
      imgaddrs: this.data.imgaddrs
    })
  },
  sureSavePictures(){
    if (this.data.imgaddrs.length >15){
      wx.showToast({
        title: '最多只能上传15张图片',
        icon: 'none',
        duration: 2000
      })
      return false
    } else if (this.data.imgaddrs.length === 0){
      wx.showToast({
        title: ' 请选择照片',
        icon: 'none',
        duration: 2000
      })
      return false
    }else{
      console.log(this.data.pictures)
      if (this.data.pictureLink === 'house'){
        app.pictures.housePictures = deepClone(this.data.pictures)
        app.pictures.defaultPictures = []
        wx.setStorageSync('imgaddrHouse', this.data.imgaddrs)
      } else if (this.data.pictureLink === 'room'){
        app.pictures.roomPictures = deepClone(this.data.pictures)
        wx.setStorageSync('imgaddrRoom', this.data.imgaddrs)
      }
      wx.navigateBack({
        detla: 1
      })
    }
  }
})