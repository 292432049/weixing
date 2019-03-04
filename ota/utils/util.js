const formatTime = time => {
  let date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/* 深拷贝 */
const deepClone = source => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

/* 去除对象空值 */
const ObjectMap = (obj = {}) => {
  let newObject = {}
  for (let key of Object.keys(obj)) {
    const value = obj[key]
    if (typeof value !== 'undefined' && value !== '' && value !== null && !Number.isNaN(value) && value !== -1) {
      newObject[key] = value
    }
  }
  return newObject
}

const buttonClicked = (self)=>{
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500)
}
module.exports = {
  formatTime,
  deepClone,
  ObjectMap
}
