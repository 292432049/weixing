import { fetch } from '@/utils/fetch'

/* 好友助力 */
export function friendsHelpApi (params = {}) {
  return fetch('/api/coupon', {
    method: 'helpCustomer',
    params
  }, 'post')
}
