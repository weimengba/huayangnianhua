// const app = getApp()
const util = require('../../utils/util')
const qiniuUploader = require("../../utils/qiniuUploader");
var upToken = '';

// var app = gerApp();
// var baseUrl = app.baseUrl;
var uploadURL = 'http://47.93.37.241:8090/pages/viewpage.action?pageId=1966190';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    imageURL: ''
  },
  //获取凭证upToken
  _upToken: function() {
    wx.request({
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=getQiniuUpToken`,
      data: {
        auth: wx.getStorageSync('auth')
      },
      success: res => {
        // console.log('请求结果：'+res.data.data.upToken)        
        // console.log('dataObject: ' + JSON.stringify(res))
        if (res.data.result === 1) {
          upToken = res.data.data.upToken;
        } else {
          console.log('上传凭证upToken请求出错！');
        }
      }
    })
  },

  // 添加图片方法
  addImage:function(e) {
    // console.log('全局：' + util.tempData)
    // wx.navigateTo({
    //   url: '../album/album',
    // })
    // return false;
    
    // console.log('全局变量：' + tempInfos)

    var that = this;
    this._upToken();
    wx.chooseImage({
      // count: 9,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function(res) {
        console.log('图片信息：'+JSON.stringify(res))
        var filePath = '';
        for(var i = 0;i<res.tempFilePaths.length;i++) {
          filePath = res.tempFilePaths[i];
          var suffix = '.' + filePath.split('.').splice(-1);
          var setKey = util.formatKey(suffix);
          util.tempData.img.push(setKey)

          qiniuUploader.upload(filePath, (res) => {
            
            that.setData({
              'imageURL': res.imageURL,
            });
          }, (error) => {
            console.log('error: ' + error);
          }, {
              region: 'ECN',
              // domain: 'bzkdlkaf.bkt.clouddn.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
              // key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
              key: setKey,
              // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
              uptoken: upToken,
              shouldUseQiniuFileName: false
          }, (res) => {
            console.log('上传进度'+JSON.stringify(res));
            // console.log('已经上传的数据长度', res.totalBytesSent)
            // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          });
        }
        console.log('全局:' + JSON.stringify(util.tempData))
        wx.navigateTo({
          url: '../album/album',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})