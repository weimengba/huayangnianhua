const util = require('../../utils/util')
const app = getApp()
var i = 0
var myimgs = ''
var baseStyle = [
  { animationData: '', place: 'width:100px;height:auto;opacity:0.5' },
  { animationData: '', place: 'width:100px;height:auto;opacity:1;top:-100px;' },
  { animationData: '', place: 'width:100px;height:auto;opacity:1;right:-500px' },
  { animationData: {}, place: 'width:300px;height:auto;opacity:0;' },
  { animationData: {}, place: 'width:50px;height:auto;top: -50px;opacity:0.6;' },
  { animationData: {}, place: 'width:300px;height:auto;opacity:0;' },
  // 后三个重复
  { animationData: '', place: 'width:100px;height:auto;opacity:0.5' },
  { animationData: '', place: 'width:100px;height:auto;opacity:1;top:-100px;' },
  { animationData: '', place: 'width:100px;height:auto;opacity:1;right:-500px' }
]
Page({
  data: {
    autoRead: false,
    autoplay: false,
    interval: 2800,
    current: 0,
    id: 0,
    detailData: {},
    onClick: false,
    commentsBottom: -238,
    mytype: 2,//1默认是视频，2是文章
    videoData: {
      id: 0,
      type: 1,
      name: '',
      description: '',
      background: '',
      praises: 0,
      plays: 0,
      imgs: [],
      is_praises: 0
    },
    comments: [],
    commInput: '', //评论框
    dhStyle: '',
    audioAction: {
      method: 'pause'
    },
    putAmimate: [
      'width:100px;height:auto;opacity:0;animation:anim1 5s 1;animation-delay: 0',
      'width:100px;height:auto;opacity:1;top:-100px;animation:anim2 5s 1;animation-delay: 5s',
      'width:100px;height:auto;opacity:1;right:-500px;animation:anim3 5s 1;animation-delay: 10s'
      // {place: 'width:100px;height:auto;opacity:0.5;animation:anim1 5s infinite;animation-delay: 0' },
      // {place: 'width:100px;height:auto;opacity:0.5;animation:anim2 5s infinite;animation-delay: 5s' },
      // {place: 'width:100px;height:auto;opacity:0.5;animation:anim3 5s infinite;animation-delay: 10s' },
    ]
  },
  onLoad(query) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    console.log(query.id+' 详情了：'+JSON.stringify(query))

    if(query.type==1) {//视频数据整理
      // var myimgs = query.imgs.split(',')
      myimgs = query.imgs.split(',')
      this.setData({
        mytype: query.type,
        id: query.id,
        videoData: {
          id: query.id,
          type: query.type,
          name: query.name,
          description: query.description,
          background: query.background,
          praises: query.praises,
          plays: query.plays,
          imgs: myimgs,
          is_praises: query.is_praises,
          music: query.music
        },
        dhStyle: baseStyle
      })
      console.log('所有数据：' + JSON.stringify(this.data.videoData))
      wx.hideLoading()
    }else {
      this.setData({
        id: query.id,
        mytype: query.type
      })
    }
    if (this.data.mytype==2){//文章需要从后台读取
      this.getDetailData()
    }
    // this.getDetailData()
  },
  onShow() {
    this.playCounts()
    this.animations()
    this.playAudio()
  },
  /**
   * 音乐播放模块
   */
  musicControl: function () {
    console.log('按钮名称：' + this.data.audioAction.method)
    if (this.data.audioAction.method !== 'play') {//要暂停
      console.log('要暂停了')
      this.pauseAudio()
    }else {//要播放
    console.log('要播放')
      this.playAudio()
    }
    this.playAudio()
  },
  playAudio: function () {
    this.setData({
      audioAction: {
        method: 'play'
      }
    });
    var ythat = this
    var aa = true;
    setInterval(function(aa) {
      console.log('数据开始改变:' + ythat.data.putAmimate)
      var change = [
        'width:100px;height:auto;opacity:0;animation:anim11 5s 1;animation-delay: 0',
        'width:100px;height:auto;opacity:1;top:-100px;animation:anim22 5s 1;animation-delay: 5s',
        'width:100px;height:auto;opacity:1;right:-500px;animation:anim33 5s 1;animation-delay: 10s'
      ]
      ythat.setData({
        putAmimate: change
      })
      aa = !aa;
    },15000)
  },
  pauseAudio: function () {
    this.setData({
      audioAction: {
        method: 'pause'
      }
    });
  },
  /**
   * 视频动画
   */
  animations() {
    console.log('初始i:'+i)
    let durTime = 5000
    let timingFun = 'ease-out'

    for(var j=1;j<=9;j++) {
      var animatName = 'animation' + j
      var animatN = 'animation'+j
      animatName = wx.createAnimation({
        duration: durTime,
        timingFunction: timingFun
      })
      this[animatN] =animatName
    }

    this.animation1.scale(3).rotate(1080).opacity(1).step({ duration: 1500 }).scale(0.1).opacity(0).step({ delay: 2500, duration: 1000 })
    this.animation2.scale(2).top('50%').opacity(1).step({ duration: 1000 }).scale(3).opacity(0).step({ delay: 2000, duration: 1000 })
    this.animation3.scale(2).right('38%').skewX(30).opacity(1).step({ duration: 1500 }).scale(0.5).skewX(0).right(600).opacity(0).step({ delay: 2000, duration: 1000 })
    this.animation4.opacity(1).step({ duration: 1500 }).width(5).opacity(0).step({ delay: 2000, duration: 1000 })
    this.animation5.opacity(0.6).top(160).step({ duration: 450 }).top(10).opacity(0.8).scale(1.8).step({ duration: 600 }).top(260)
    this.animation6.opacity(1).step({ duration: 1500 }).scale(0.8).opacity(0).step({ delay: 2000, duration: 1500 })
    // 一下为重复123
    this.animation7.scale(3).rotate(1080).opacity(1).step({ duration: 1500 }).scale(0.1).opacity(0).step({ delay: 2500, duration: 1000 })
    this.animation8.scale(2).top('50%').opacity(1).step({ duration: 1000 }).scale(3).opacity(0).step({ delay: 2000, duration: 1000 })
    this.animation9.scale(2).right('38%').skewX(30).opacity(1).step({ duration: 1500 }).scale(0.5).skewX(0).right(600).opacity(0).step({ delay: 2000, duration: 1000 })

    setTimeout(function() {
      if(i>=9){
        return
      }
      let aa = 'dhStyle[' + i + '].animationData'
      let bb = 'animation' + (i+1);
      this.setData({
        [aa]: this[bb]
      })
      i++
    }.bind(this),100)
    console.log('总长度' + this.data.videoData.imgs.length)
    if (i < this.data.videoData.imgs.length - 1) {
      setTimeout(function () {
        this.animations()
      }.bind(this), 5000)
    }else{
      // console.log('结束')
      // var videoD = 'videoData.imgs'
      // // this.setData({
      // //   [videoD]: '',
      // //   dhStyle: ''
      // // })
      // console.log('结束后：'+this.data.dhStyle)
      // var thats = this
      // setInterval(function() {
      //   thats.setData({
      //     [videoD]: myimgs,
      //     dhStyle: baseStyle
      //   })
      // },5000)
      // i = 0
      // this.animations()
    }
  },
  /**
   * 视频点赞
   */
  thumbUp: function() {
    console.log(1234)
    console.log('点赞：' + this.data.videoData.is_praises)
    let pra = 'videoData.is_praises'
    if (this.data.videoData.is_praises == 0)  {//如果没有点赞
      console.log('要点赞了')
      this.setData({
        [pra]: 1
      })
    }else {
      this.setData({
        [pra]: 0
      })
      console.log('取消点赞了' + this.data.videoData.is_praises) 
    }
    wx.request({
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=add_praises_num&id=${this.data.id}&type=${this.data.mytype}`,
      data: {
        auth: wx.getStorageSync('auth')
      },
      success: res => {
        console.log('点赞成功')
        console.log(res)
      }
    })
  },
  /**
   * 播放数量增加
   */
  playCounts: function () {
    wx.request({
      // url: `${util.requestUrl}index.php?m=minpackage&c=index&a=add_num&id=${this.data.id}&type=${this.data.mytype}&status=${status}`,
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=add_plays_num&id=${this.data.id}&type=${this.data.mytype}`,
      data: {
        auth: wx.getStorageSync('auth')
      },
      success: res => {
        console.log('播放量添加成功')
        console.log(res)
      }
    })
  },

  getDetailData() {
    // console.log('开始读取文章信息')
    wx.request({
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=detail&id=${this.data.id}&type=${this.data.mytype}`,
      data: {
        auth: wx.getStorageSync('auth')
      },
      success: res => {
        // console.log('文章信息请求成功')
        console.log(res)
        wx.hideLoading()
        this.setData({
          detailData: res.data.data
        })
      }
    })
  },
  readModeToggle() {
    this.data.autoRead = !this.data.autoRead
    this.data.autoRead ? this.data.autoplay = true : this.data.autoplay = false
    this.setData({
      autoRead: this.data.autoRead,
      autoplay: this.data.autoplay,
      current: 0
    })
  },
  autoRead(e) {
    let current = e.detail.current
    // console.log(e)
    if(current == this.data.detailData.data.length - 1) {
      this.setData({
        autoplay: false
      })
    }
  },
  // 收藏
  collectItem(e) {
    if(this.data.onClick) {
      wx.showToast({
        title: '请勿频繁点击',
        icon: 'none'
      })
      return
    } else {
      this.setData({
        onClick: true
      })
      wx.request({
        url: `${util.requestUrl}index.php?m=minpackage&c=index&a=favorite_do`,
        data: {
          // type 1 收藏，不传或0为删除
          type: 1,
          id: this.data.id,
          auth: wx.getStorageSync('auth')
        },
        success: res => {
          this.timer = setTimeout(() => {
            clearTimeout(this.timer)
            this.setData({
              onClick: false
            })
          }, 3000)
          if(res.data.result === 1) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              durantion: 2000
            })
          }else {
            wx.showToast({
              title: '收藏失败，请稍后再试',
              icon: 'none',
              durantion: 3000
            })
          }
        }
      })
    }
  },
  // 转发任务
  onShareAppMessage: function(ops) {
    console.log(this.data.videoData.description)
    var that = this
    if(that.data.type == 1) { //转发视频
      return {
        title: this.data.detailData.title,
        path: `/path/detail/detail?id=${that.data.id}&type=1&name=${that.data.videoData.name}&description=${that.data.videoData.description}&background=${that.data.videoData.background}&praises=${that.data.videoData.praises}&plays=${that.data.videoData.plays}&imgs=${that.data.videoData.imgs}`,
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
          
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }else {
      return {
        title: this.data.detailData.title,
        path: `/pages/detail/detail?id=${that.data.id}&type=2`,
        success: function (res) {
          // 转发成功
          console.log("文章转发成功:" + JSON.stringify(res));
          wx.request({
            url: `${util.requestUrl}index.php?m=minpackage&c=index&a=share`,
            data: {
              id: that.data.id,
              auth: wx.getStorageSync('auth')
            },
            success: res => {

            }
          })
        },
        fail: function (res) {
          // 转发失败
          console.log("文章转发失败:" + JSON.stringify(res));
        }
      }
    }
  },
  loadComment: function() {
    var that = this;
    wx.request({
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=comment_list`,
      method: 'GET',
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded'
      // },
      data: {
        auth: wx.getStorageSync('auth'),
        id: this.data.id,
        type: this.data.mytype
        // id=1 & type=1
      },
      success: res => {
        console.log('列表读取成功：' + JSON.stringify(res))
        that.setData({
          comments: res.data.data
        })
        console.log('整理后：' + JSON.stringify(this.data.comments))
      },
      fail: () => {
        console.log('列表读取失败！')
      }
    })
  },
  showWords() {//展开收缩评论框
    // commentsBottom
    var bottompx = this.data.commentsBottom === -238 ? 48 : -238
    if (this.data.commentsBottom < 0){
      // console.log('要展开加载')
      this.loadComment();
    }
    console.log(bottompx)
    this.setData({
      commentsBottom: bottompx
    });
  },
  onSubmit: function(e) {//提交评论
    var that = this
    console.log('提交评论：' + this.data.id + " , " + this.data.mytype)
    console.log('评论内容：'+e.detail.value)
    this.setData({
      commInput: e.detail.value
    })
    console.log("所有："+JSON.stringify(e))
    wx.request({
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=add_comment`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        auth: wx.getStorageSync('auth'),
        oid: that.data.id,
        type: that.data.mytype,
        comment: e.detail.value
      },
      success: res => {
        console.log('上传成功：' + JSON.stringify(res))
        this.loadComment()
        this.setData({
          commInput: ''
        })
      },
      fail: () => {
        console.log('上传失败！')
      }
    })
    e.detail.value=""
  },
  hideWords() {
    this.setData({
      commentsBottom: -238
    })
  }

})
