/*
 * @Author: FT.FE.DDM
 * @Date: 2018-08-20 16:41:03
 * @Last Modified by: gww
 * @Last Modified time: 2018-12-20 21:08:59
 */

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"test"',
  BASE_API: '"//tapi244.mdguanjia.com/activity/"',
  ML_API: '"https://tapi244.mdguanjia.com/myhome/"',
  HOUSE_H5_URL: '"https://tstatic244.mdguanjia.com/house-list/?"',
  WXSHARE_H5_URL: '"https://www.52mailin.com/myhome/act/august/wechat.htm"',
  APP_DOWNLOAD_URL: '"https://tstatic190.mdguanjia.com/appGuides/index.html"'
})

