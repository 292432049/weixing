/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-08-17 16:09:03
 * @Last Modified by: FT.FE.Bolin
 * @Last Modified time: 2018-10-18 13:59:45
 */

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"pre"',
  BASE_API: '"//pre.mdguanjia.com/activity/"',
  ML_API: '"//pre.mdguanjia.com/myhome/api/"'
})

