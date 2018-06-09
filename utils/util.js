const formatTime = date => {
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

const requestUrl = 'https://www.5qianqian.com/'

const formatKey = suffix => {
  // const noncestr = ((Math.random().toString(36)).substr(2)).toUpperCase()
  const noncestr = (Math.random().toString(36)).substr(-6)
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()
  
  const minute = new Date().getMinutes()
  const second = new Date().getSeconds()
  // console.log('min:'+minute+" , "+second+" 随机："+noncestr)
  // const key = `${year}/${formatNumber(month)}${formatNumber(day)}/${noncestr}${suffix}`
  const key = `${year}/${formatNumber(month)}${formatNumber(day)}/${formatNumber(minute)}${formatNumber(second)}${noncestr}${suffix}`
  return key
}
var tempData = {
  // 'key':[],
  // 'producer': '',
  // 'albumDesc': ''

  'name': '', //制片人
	'description': '', //相册描述
	'img': [], //所有上传的图片的key
	'music': '', //背景音乐
	'background': '' //背景图片
}

module.exports = {
  formatTime: formatTime,
  requestUrl: requestUrl,
  formatKey: formatKey,
  tempData: tempData,
  formatNumber: formatNumber
}
