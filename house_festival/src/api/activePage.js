/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-08-17 14:39:33
 * @Last Modified by: gww
 * @Last Modified time: 2018-12-29 18:23:16
 */
import { fetch } from '@/utils/fetch'

/* 获取活动数据 */
export const joinActivityApi = {
  requestUrl: '/api/coupon',
  getData (params) {
    return fetch(joinActivityApi.requestUrl, {
      method: 'activityProgress',
      params
    }, 'post')
  },

  joinActivity (params) {
    return fetch(joinActivityApi.requestUrl, {
      v: '2.0.3',
      timestamp: new Date().getTime(),
      reqId: '0010C2379272774D6EC087B917CE2A71438DEF90',
      sign: '8F4C4A8E9D850EDD9692DE38723D0543',
      method: 'joinActivity',
      params
    }, 'post', {
      noAssign: true
    })
  },
  helpCustomerApi (params) {
    return fetch(joinActivityApi.requestUrl, {
      method: 'helpCustomer',
      params
    }, 'post')
  }
}
// 房源钜惠列表
export const activityList = {
  requestUrl: '/api/activity',
  activityHouseApi (params) {
    return fetch(activityList.requestUrl, {
      method: 'activityHouse',
      params
    }, 'post')
  },
  myPrizesApi (params) { // 奖品列表
    return fetch(activityList.requestUrl, {
      method: 'myPrizes',
      params
    }, 'post')
  },
  prizeReceivesApi (params) { // 中奖人列表
    return fetch(activityList.requestUrl, {
      method: 'prizeReceives',
      params
    }, 'post')
  },
  getTaskData (params) {
    return fetch(activityList.requestUrl, {
      method: 'taskProgress',
      params
    }, 'post')
  },
  loginTaskApi (params) {
    return fetch(activityList.requestUrl, {
      method: 'loginTask',
      params
    }, 'post')
  },
  doPrize (params) {
    return fetch(activityList.requestUrl, {
      method: 'doPrize',
      params
    }, 'post')
  }
}

export function receiveCouponApi (params = {}) {
  return fetch('/api/coupon', {
    v: '2.0.2',
    timestamp: new Date().getTime(),
    reqId: '0010C2379272774D6EC087B917CE2A71438DEF90',
    sign: '8F4C4A8E9D850EDD9692DE38723D0543',
    method: 'receiveCoupon',
    params
  }, 'post', {
    noAssign: true
  })
}
/* 获取城市列表 */
export function queryCityListApi (params) {
  return fetch('/api/search', {
    method: 'cityListByActivity',
    params
  }, 'post')
}
