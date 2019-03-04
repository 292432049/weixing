/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-08-17 16:09:03
 * @Last Modified by: chudequan
 * @Last Modified time: 2018-11-06 12:57:43
 */

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"test"',
  BASE_API: '"//test.mdguanjia.com/activity/"',
  ML_API: '"https://test.mdguanjia.com/myhome/"',
  APP_DOWNLOAD_URL: '"https://tstatic190.mdguanjia.com/appGuides/index.html"'
})

