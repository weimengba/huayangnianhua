const util = require('../../utils/util.js')
let startPlay;
Page({
  data: {
    tabs: ['编辑', '模板', '音乐'],  //右侧的三个圆形按钮
    tabsTit: ['编辑','选择模板','选择音乐'],  //title名称
    activeIndex: 0,
    'delBtn': false, //右上角是否有删除按钮

    //编辑模块
    picFocus: false,  //相册描述获取焦点
    makePersonLen: 0, //制片人录入长度
    picDiscLen: 0,  //相册描述录入长度
    makePersonDesc: '', //制片人内容
    picDesc: '',  //相册描述内容

    //选择模板模块
    bgTemplate: [], //选择模板背景数组
    tempCheck: 0, //选中模板
    onbgTemp: '', //选中的模板地址

    //选择音乐模块
    allMusic: [],  //选择音乐数组
    musicCheck: 0,  //选择的音乐
    onmusic: '', //选中的音乐模板地址
    audioAction: {
      method: 'pause'
    },
    audioCtx: '',
    currentProcess: '00:00',//显示 将currentProcessNum处理成时间形式展示
    totalProcess: '00:00',
    barNow: 0,
    barAll: 0,
    // currentProcessNum: 2,//赋值
    // totalProcessNum: 6,
    
    videoInfo: {
      // 'delBtn': false,
      'author': 'gxl',
      'information': '终南山：时代s大发慈悲电饭锅共和党和儿童广东人法规法规的规定发给地方郭德纲的郭德纲的规定',
      'playCount': 66,
      'thumbUp': 22,
      'subTime': '2018年5月4号',
      'backImage': ['../../pages/statics/images/0.jpg', '../../pages/statics/images/2.jpg', '../../pages/statics/images/8@2x.png', '../../pages/statics/images/0.jpg'], 
    },
    videoAlbum: {
      "id": 0,
      "name": "",
      "description": "",
      // "time": "",
      "music": "",
      "background": "",
      "praises": 0,
      "plays": 0,
      "imgs": [
        
      ],
      "type": 1
    },
    imgUrl: 'music_start.png',
    // canSlider: true    //是否可以滑动，防止加载音乐时 用户滑动进度条
    canSlider: false    //是否可以滑动，防止加载音乐时 用户滑动进度条
  },
  tabClick: function(e) {
    var that = this;
    that.setData({
      activeIndex: e.currentTarget.id
    })
  },

  /**
   * 编辑模块
   */
  getLenth(e) {//制片人长度控制
    this.setData({
      makePersonLen: e.detail.value.length,
      makePersonDesc: e.detail.value
    })
  },
  getPicLenth(e) {//相册描述长度控制
    this.setData({
      picDiscLen: e.detail.value.length,
      picDesc: e.detail.value
    })
  },
  publish: function() {//发布
    // console.log('纸片人：' + this.data.makePersonDesc + " , 相册描述：" + this.data.picDesc)

    util.tempData.name = this.data.makePersonDesc
    util.tempData.description = this.data.picDesc
    util.tempData.background = this.data.onbgTemp
    util.tempData.music = this.data.onmusic
    // console.log('相册信息：' + JSON.stringify(util.tempData))
    // var params = new URLSearchParams();
    // params.append('name', util.tempData.name)
    // params.append('description', util.tempData.description)
    // params.append('img', util.tempData.img)
    // params.append('music', util.tempData.music)
    // params.append('background', util.tempData.background)

    wx.request({
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=add_video`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        auth: wx.getStorageSync('auth'),
        name: util.tempData.name,
        description: util.tempData.description,
        img: util.tempData.img,
        music: util.tempData.music,
        background: util.tempData.background
      },
      success: res => {
        console.log('发布了' + JSON.stringify(res.data.data.id))
        var id = res.data.data.id;
        wx.navigateTo({
          url: `../playalbum/playalbum`
        })
      },
      fail: () => {
        console.log('上传失败！')
      }
    })
  },

  selectTemp: function(event) {//选择模板
    // console.log('索引：' + JSON.stringify(event))
    this.setData({
      tempCheck: event.target.dataset.index,
      onbgTemp: this.data.bgTemplate[event.target.dataset.index].data
    })
    console.log(this.data.onbgTemp)
  },

  /**
   * 音乐模块
   * selectMusic：选择音乐
   * audioPlay：音乐播放
   */
  selectMusic: function(event) {
    // console.log('xuhao: ' + JSON.stringify(event))
    this.setData({
      musicCheck: event.target.dataset.index,
      onmusic: this.data.allMusic[event.target.dataset.index].data
    })
    if (this.data.imgUrl == 'music_stop.png') {//正在播放音乐
      // console.log('要更换播放的音乐是：' + JSON.stringify(this.data.allMusic[this.data.musicCheck]))
      this.data.audioCtx.pause();
      this.setData({
        audioCtx: ''
      })
      this.setData({
        audioCtx: wx.createAudioContext(this.data.allMusic[this.data.musicCheck].id)
      })
      // console.log('开始更换了 ' + this.data.musicCheck);
      // this.data.audioCtx.pause();
      this.playAudio()
    }
  },
  audioPlayed: function (e) {
    console.log('audio is played '+JSON.stringify(e))
  },
  audioTimeUpdated: function (e) {
    var barNow = parseInt(e.detail.currentTime);
    var barAll = parseInt(e.detail.duration);
    var currentProcess = e.detail.currentTime;
    var currentTime = parseInt(e.detail.currentTime);
    var min = util.formatNumber(parseInt(currentTime / 60));
    var sec = util.formatNumber(currentTime % 60);
    var totalProcess = parseInt(e.detail.duration);
    
    var tPmin = util.formatNumber(parseInt(totalProcess / 60));
    var tPsec = util.formatNumber(totalProcess % 60);
    totalProcess = tPmin + ':' +tPsec;

    var starttime = min + ':' + sec;
    // console.log('播放时间检测：'+starttime +" , "+sec)
    var process = e.detail.duration;
    // var currentProcess = util.formatNumber(parseInt(currentProcess * 100 / process));

    this.setData({
      totalProcess: totalProcess,
      currentProcess: starttime,
      barNow: barNow,
      barAll: barAll
    })
    // console.log('barNow:'+barNow+" , barAll:"+barAll)
    // this.duration = e.detail.duration;
    // var that = this;
    // startPlay = setInterval(function() {
      // console.log('播放时间：'+starttime);
      this.setData({
        currentProcess: starttime
      })
    // },1000)
  },
  playAudio: function () {
    console.log('开始播放l:' + JSON.stringify(this.data.audioCtx))
    this.data.audioCtx.play();

  },
  pauseAudio: function (e) {
    this.setData({
      audioAction: {
        method: 'pause'
      }
    });
  },
  sliderchange: function(e) {
    console.log('滑动：'+JSON.stringify(e))
    // if (!this.duration)
    //   return;
    console.log('滑动位置测试')
    var currentTime = parseInt(e.detail.value);
    var min = util.formatNumber(parseInt(currentTime / 60));
    var sec = util.formatNumber(currentTime % 60);
    var starttime = min + ':' + sec;

    this.setData({
      barNow: e.detail.value,
      // currentProcess: starttime
    })
    console.log('滑动位置：' + this.data.barNow + " , currentProcess:" + this.data.currentProcess + " , " + e.detail.value)


    // var time = this.duration * e.detail.value / 100;

    this.setData({
      audioAction: {
        method: 'setCurrentTime',
        data: e.detail.value
      }
    });

    // console.log("sliderchange:")
    // console.log(e);
    // var offset = parseInt(e.detail.value);
    // // this.audioCtx.seek(offset);
    // this.data.audioCtx.seek(offset)
  },
  // timeSliderChanged: function(e) {
  //   if (!this.duration)
  //     return;
  //   console.log('duration:'+this.duration)
  //   var time = this.duration * e.detail.value / 100;

  //   this.setData({
  //     audioAction: {
  //       // method: 'setCurrentTime',
  //       data: time
  //     }
  //   });
  // },
  musicControl: function() {
    console.log(this.data.imgUrl);
    console.log('要播放的音乐是：' + JSON.stringify(this.data.allMusic[this.data.musicCheck]))
    // this.audioCtx = this.data.allMusic[this.data.musicCheck];  //要播放的上下文
    // this.setData({
    //   audioCtx : this.data.allMusic[this.data.musicCheck]
    // })
    // this.audioCtx = wx.createAudioContext("21")  //要播放的上下文
    this.setData({
      audioCtx: wx.createAudioContext(this.data.allMusic[this.data.musicCheck].id)
    })
    console.log('id:' + JSON.stringify(this.data.audioCtx) + ' , ' + this.data.allMusic[this.data.musicCheck].id)
    // this.audioCtx.setSrc(this.data.allMusic[this.data.musicCheck].data)
    // console.log('audioAction:' + JSON.stringify(this.data.audioAction))
    if (this.data.imgUrl == 'music_start.png') {//开始播放音乐
      this.setData({
        imgUrl: 'music_stop.png'
      })
      this.playAudio()
      // setInterval(function() {
      //   // console.log('时间：'+)
      // },1000);
    }else {//暂停播放音乐
      this.setData({
        imgUrl: 'music_start.png'
      })
      this.pauseAudio()
    }
  },

  picFocus() {
    this.setData({
      picFocus: true
    })
  },
  videoBtn: function (e) {
    var that = this;
    var setAttr = "videoInfo.iconBtn";
    that.setData({
      [setAttr]: this.data.videoInfo.iconBtn == 'stop' ? 'start' : 'stop'
    });
    // console.log(this.data.videoInfo.iconBtn);
  },
  onReady: function() {//选择模板模块预加载
    var that1 = this;
    // this.data.videoAlbum.imgs = util.tempData.img
    // console.log('tempData临时数据：' + JSON.stringify(util.tempData))
    wx.request({
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=get_img_music`,
      data: {
        auth: wx.getStorageSync('auth')
      },
      success: res => {
        if (res.data.result === 1) {
          var bgTemp = res.data.data.img;
          if (bgTemp.length % 3 === 1) {
            bgTemp.push('', '')
            console.log('长度0：' + bgTemp.length)
          } else if (bgTemp.length % 3 === 2) {
            bgTemp.push('')
            console.log('长度1：' + bgTemp.length)
          } else {
            console.log(bgTemp.length % 3 + ' , ' + 长度)
          }
          this.setData({
            bgTemplate: bgTemp,
            allMusic: res.data.data.music
          })
        }

        // console.log("模板：" + JSON.stringify(this.data.bgTemplate))
        // console.log('-----------------------------')
        // console.log('音乐：' + JSON.stringify(this.data.allMusic))
        // console.log('-----------------------------')
        this.setData({
          onbgTemp: this.data.bgTemplate[0].data,
          onmusic: this.data.allMusic[0].data
        })

        var imgs = 'videoAlbum.imgs'
        var bg = 'videoAlbum.background'
        that1.setData({
          [imgs]: util.tempData.img,
          [bg]: this.data.bgTemplate[0].data
        })
      }
    })
  },
  onLoad: function() {
    
  },
  onShow: function() {
    
  }
});