<template>
<div>
  <div
  class="search-city"
  @click="showCityList = true">
  {{ curCityIndex*1 >-1? cityList[curCityIndex].name : '定位中...'}}
  <span class="search-city-icon"></span>
</div>
  <div>
    <van-popup
      class="cityList"
      v-model="showCityList"
      zIndex="20000"
      position="bottom">
      <div class="cityList-head">
        选择城市
        <span
          class="close-btn"
          @click="showCityList = false"></span>
      </div>
      <div class="cityList-container">
        <div class="cityList-tab">选择服务城市</div>
        <ul>
          <li
            class="cityList-item"
            v-for="(item, index) in cityList"
            :key="item.id"
            @click="changeCurCity(index)">
            {{item.name}}
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
  </div>
</template>
<script>

import { queryCityListApi } from '@/api/activePage'
import { Popup, Dialog } from 'vant'
import Bridge from '@/utils/bridge'

const userAgent = navigator.userAgent.toLocaleLowerCase() // 获取浏览器
export default {
  components: {
    [Popup.name]: Popup,
    [Dialog.name]: Dialog
  },
  props: {
    applocation: {
      type: Object
    }
  },
  name: 'citylist',
  data () {
    return {
      cityList: [],
      showCityList: false,
      curCityIndex: -1,
      app_location: null,
      app_ios: false,
      app_andriod: false,
      isAPP: false
    }
  },
  created () {
    // 字符串查找不用includes  IOS8不兼容
    this.app_ios = userAgent.indexOf('fht-ios') > -1
    this.app_andriod = userAgent.indexOf('fht-android') > -1
    this.isAPP = this.app_ios || this.app_andriod
    // 初始化 判断是否是在APP中
    this.initApp()
  },
  mounted () {},
  methods: {
    initApp () {
      let _this = this
      const getAppLocation = new Promise(function (resolve, reject) {
        if (_this.app_ios) { // iosApp内
          Bridge.callHandler('getParamsFromNative', {}, function responseCallback (responseData) {
            if (responseData.params) {
              _this.app_location = responseData.params
              resolve(responseData.params)
            } else {
              _this.app_location = null
              resolve(_this.app_location)
            }
          })
        } else if (_this.app_andriod) { // androidApp内
          let app_andriod_params = JSON.parse(window.SetupJsCommunication.getParamsFromNative())
          if (app_andriod_params.params) {
            _this.app_location = app_andriod_params.params
            resolve(app_andriod_params.params)
          } else {
            _this.app_location = null
            resolve(_this.app_location)
          }
        } else {
          _this.app_location = null
          resolve(_this.app_location)
        }
      })
      getAppLocation.then((res) => {
        console.log(1)
        _this.getCityList()
        console.log('app返回', res)
      }).catch((err) => {
        // 获取城市列表
        console.log(2)
        _this.getCityList()
        console.log(err)
      })
    },
    getCityList () {
      console.log(111)
      queryCityListApi({
        'devId': '5555998cccf2492db015c442f087f00a'
      }).then((res) => {
        if (res.code * 1 === 0) {
          res.data.cityList.forEach((item, index) => {
            this.cityList.push({
              id: item.areaId,
              name: item.areaName
            })
          })
          if ((this.app_location && this.app_location.cityName) && this.isAPP) { // 如果是在app中
            let cityName = this.app_location.cityName
            let filterAppIndex
            this.cityList.forEach((item, index) => {
              if (item.name === cityName) {
                filterAppIndex = index
                return false
              }
            })
            console.log('缓存1', localStorage.getItem('MJ_DEFAULT_CITY_INDEX'))
            this.curCityIndex = localStorage.getItem('MJ_DEFAULT_CITY_INDEX') || filterAppIndex
            this.$emit('getCitiCode', this.cityList[this.curCityIndex])
          } else {
            this.getCurrentPosition()
          }
        }
      }).catch((err) => { console.log(err) })
    },
    // 获取当前定位城市
    getCurrentPosition () {
      if (window.AMap) {
        let geolocation = new window.AMap.Geolocation()
        geolocation.getCurrentPosition((status, result) => {
          console.log(result)
          let getCurrentPositionCity
          if (status === 'complete') {
            getCurrentPositionCity = result.addressComponent.city || '杭州'
          } else {
            getCurrentPositionCity = '杭州'
          }
          let filterItemIndex
          this.cityList.forEach((item, index) => {
            if (item.name.includes(getCurrentPositionCity)) {
              filterItemIndex = index
              return false
            }
          })
          console.log('缓存2', localStorage.getItem('MJ_DEFAULT_CITY_INDEX'))
          this.curCityIndex = localStorage.getItem('MJ_DEFAULT_CITY_INDEX') || filterItemIndex
          this.$emit('getCitiCode', this.cityList[this.curCityIndex])
        })
      } else {
        this.curCityIndex = 6
        this.$emit('getCitiCode', this.cityList[this.curCityIndex])
      }
    },
    // 选择城市
    changeCurCity (index) {
      console.log(index, this.curCityIndex)
      if (this.curCityIndex === index) {
        return
      }
      this.curCityIndex = index
      this.showCityList = false
      localStorage.setItem('MJ_DEFAULT_CITY_INDEX', index)
      this.$emit('getCitiCode', this.cityList[this.curCityIndex])
    }
  }
}
</script>
<style lang="scss">
 .search-city {
    // height: 0.8rem;
    // line-height: 0.8rem;
    // width: 2rem;
    // display: flex;
    // justify-content: center;
    color:#fff;
    .search-city-icon {
      display: inline-block;
      vertical-align: middle;
      width:34px;
      height:34px;
      background-image: url(../../assets/image/@2xml_bt_xiala.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
    }
  }
.cityList {
  width: 100%;
  height: 100%;
  padding-top: 1.333333rem;
  .cityList-head {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0.4rem 0;
    color:#333;
    font-size: 0.48rem;
    border-bottom: 1px solid rgb(221, 221, 221);
    .close-btn {
      position: absolute;
      top: 0.48rem;
      left: 0.4rem;
      width: 0.32rem;
      height: 0.32rem;
      background: url(../../assets/image/close.png) center no-repeat;
      background-size: 100%;
    }
  }
  .cityList-container {
    height: 100%;
    margin-left: 0.64rem;
    overflow-x: hidden;
    overflow-y: scroll;
    .cityList-tab {
      padding: 0.4rem 0;
      text-align: left;
      font-size: 0.48rem;
      color: rgb(153, 153, 153);
      border-bottom: 1px solid rgb(238, 238, 238);
    }
    .cityList-item {
      padding: 0.4rem 0;
      color:#333;
      text-align: left;
      font-weight: normal;
     font-size: 0.48rem;
    }
  }
}
</style>
