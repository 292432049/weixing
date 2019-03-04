/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-08-17 16:09:03
 * @Last Modified by: gww
 * @Last Modified time: 2018-12-21 16:26:29
 */

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"//dev.mdguanjia.com/activity/"',
  ML_API: '"https://tapi244.mdguanjia.com/myhome/"',
  APP_DOWNLOAD_URL: '"https://tstatic190.mdguanjia.com/appGuides/index.html"',
  HOUSE_H5_URL: '"https://tstatic244.mdguanjia.com/house-list/?"',
  WXSHARE_H5_URL: '"https://www.52mailin.com/myhome/act/august/wechat.htm"',
  MOCK: 'true'
})

