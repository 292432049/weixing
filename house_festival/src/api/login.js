/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-19 21:02:07
 * @Last Modified by: chudequan
 * @Last Modified time: 2018-11-05 11:16:02
 */

import { fetch } from '@/utils/fetch'

/* 登录获取sessionId */
export const loginApi = {
  requestUrl: '/api/customer',
  login (params = {}, channel) {
    return fetch(this.requestUrl, {
      method: 'loginByVcode',
      channel: channel,
      params
    }, 'post')
  },
  /* 获取验证码 */
  getVcode (params = {}) {
    return fetch(this.requestUrl, {
      method: 'sendCheckcode',
      params
    }, 'post')
  }
}
