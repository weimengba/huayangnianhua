const util = require('../../utils/util')
const app = getApp()
Page({
  data: {
    refresh: false,
    listData: [],
    noData: false,
    page: 1,
    scrollTop: 0,

    // listData: {},
    tabbar: {},
    collection: false, //默认隐藏收藏模块
    animationData: {},

    'delBtn': true,
    videoInfo: {
      // 'delBtn': true,
      'author': '张三',
      'information': '终南山：最好的医生就是。。。',
      'playCount': 66,
      'thumbUp': 22,
      'subTime': '2018年5月4号',
      'backImage': ['../../pages/statics/images/0.jpg', '../../pages/statics/images/2.jpg', '../../pages/statics/images/8@2x.png','../../pages/statics/images/0.jpg'],
      // 'iconBtn': 'start'
    }
  },
  onLoad() {
    app.editTabBar()
    wx.hideShareMenu()
    app.editTabBar()
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getListData()
  },
  onShow() {
    this.getCollectList()
  },
  /**
   * 我的收藏列表
   */
  getCollectList() {
    wx.request({
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=favorite_lists`,
      data: {
        auth: wx.getStorageSync('auth')
      },
      success: res => {
        console.log(res)
        this.setData({
          listDataSC: res.data
        })
      }
    })
  },
  /**
   * 获取我的相册列表
   */
  getListData() {
    wx.request({
      // url: `${util.requestUrl}index.php?m=minpackage&c=index&a=lists`,
      // url: `${util.requestUrl}index.php?m=minpackage&c=index&a=lists_debug`,
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=lists_debug`,
      data: {
        page: this.data.page,
        auth: wx.getStorageSync('auth')
      },
      success: res => {
        console.log('列表数据：' + JSON.stringify(res.data.data))
        wx.hideLoading()
        if (!res.data.data.length) {
          this.setData({
            noData: true,
            loadMsg: '没有更多数据了！'
          })
          wx.showToast({
            title: '没有更多数据...',
            icon: 'none'
          })
          return
        }
        if (this.data.refresh) {
          this.data.listData = res.data.data
        } else {
          for (let i in res.data.data) {
            this.data.listData.push(res.data.data[i])
          }
        }
        this.setData({
          listData: this.data.listData,
          refresh: false,
          loadMore: false
        })
        console.log('data中：' + JSON.stringify(this.data.listData))
      }
    })
  },
  refreshData() {//我的相册刷新
    if (this.data.refresh) {
      return
    }
    this.setData({
      refresh: true,
      noData: false,
      scrollTop: 0,
      page: 1
    })
    wx.showLoading({
      title: '刷新中...',
      mask: true
    })
    this.timer = setTimeout(() => {
      clearTimeout(this.timer)
      wx.hideLoading()
      this.getListData()
    }, 1800)
  },
  // 我的相册加载更多
  loadMore() {
    if (this.data.noData) {
      return
    } else {
      this.data.page++
      this.getListData()
      this.setData({
        loadMore: true,
        page: this.data.page
      })
    }
  },
  delVideo: function(e) {
    console.log("删除");
    var that = this;
    that.setData({
      'videoInfo': {}
    })
  },

  deleteItem(e) {
    const idx = e.currentTarget.dataset.idx
    wx.showModal({
      title: '提示',
      content: '删除收藏后无法恢复',
      success: res => {
        if(res.confirm) {
          wx.request({
            url: `${util.requestUrl}index.php?m=minpackage&c=index&a=favorite_do`,
            data: {
              // type 1 收藏，不传或0为删除
              type: 0,
              id: this.data.listDataSC.data[idx].id,
              auth: wx.getStorageSync('auth')
            },
            success: res => {
              if(res.data.result === 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  durantion: 2000
                })
                this.data.listDataSC.data.splice(idx, 1)
                this.setData({
                  ["listDataSC.data"]: this.data.listDataSC.data
                })
              }
            }
          })
        }
      }
    })
  },
  viewDetail(e) {
    const idx = e.currentTarget.dataset.idx
    wx.navigateTo({
      url: `../detail/detail?id=${this.data.listDataSC.data[idx].id}`
    })
  },

  collectEvt(e) {
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    console.log(this.data.animationData.actions == undefined)
    if (this.data.animationData.actions != undefined && this.data.animationData.actions[0].animates[0].args[0] == 90) {
      this.setData({
        collection: false
      })
      console.log(this.data.animationData)
      this.animation = animation
      animation.rotate(0).step()
      this.setData({
        animationData: animation.export()
      })
    }else {
      this.setData({
        collection: true
      })
      this.animation = animation
      animation.rotate(90).step()
      this.setData({
        animationData: animation.export()
      })
      console.log(this.data.animationData)
      console.log(this.data.animationData.actions[0].animates[0].args[0])
    }
    
  },

  onShareAppMessage(options) {
    const idx = options.target.dataset.idx
    return {
      title: this.data.listDataSC.data[idx].title,
      imageUrl: this.data.listDataSC.data[idx].thumb,
      path: `pages/detail/detail?id=${this.data.listDataSC.data[idx].id}`,
      success: res => {}
    }
  }
})
