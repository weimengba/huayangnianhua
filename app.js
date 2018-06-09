const util = require('utils/util')
var tempInfos = '123321';
App({
  onLaunch(options) {
    // // 登录
    wx.login({
      success: res => {
        // console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: `${util.requestUrl}index.php?m=minpackage&c=api&a=mpLogin`,
          data: {
            code: res.code
            // scene: options.query.scene ? options.query.scene : ''
          },
          success: res => {
            console.log(res)
            let auth = res.data.data.auth
            wx.setStorageSync('auth', auth)
          }
        })
      }
    })
    // wx.checkSession({
    //   success() {},
    //   fail() {
    //     // 登录
    //     wx.login({
    //       success: res => {
    //         // console.log(res.code)
    //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //         wx.request({
    //           url: `${util.requestUrl}index.php?m=minpackage&c=api&a=mpLogin`,
    //           data: {
    //             code: res.code
    //             // scene: options.query.scene ? options.query.scene : ''
    //           },
    //           success: res => {
    //             // console.log(res)
    //             let auth = res.data.data.auth
    //             wx.setStorageSync('auth', auth)
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
  },
  editTabBar() {
    var tabbar = this.globalData.tabbar,
        currentPages = getCurrentPages(),
        _this = currentPages[currentPages.length - 1],
        pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for(var i in tabbar.list){
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    userInfo:null,
    tabbar:{
      color: "#999",
      selectedColor: "#f40009",
      backgroundColor: "#fff",
      borderStyle: "#fff",
      list: [
        {
          pagePath: "/pages/index/index",
          text: "精选",
          iconPath: "/pages/statics/images/home_default.png",
          selectedIconPath: "/pages/statics/images/home_highlight.png",
          selected: true
        },
        {
          // pagePath: "/pages/album/album",
          pagePath: "/pages/add-album/add-album",
          text: "制作影集",
          iconPath: "/pages/statics/images/make_video.png",
          selectedIconPath: "/pages/statics/images/make_video_active.png",
          selected: false
        },
        {
          pagePath: "/pages/mycenter/mycenter",
          text: "我的",
          iconPath: "/pages/statics/images/mycenter_default.png",
          selectedIconPath: "/pages/statics/images/mycenter_highlight.png",
          selected: false
        }
      ],
      position: "bottom"
    },
    "networkTimeout": {
      "request": 0
    }
  }
})
