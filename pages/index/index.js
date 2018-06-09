const app = getApp()
const util = require('../../utils/util')
Page({
  data: {
    refresh: false,
    listData: [],
    noData: false,
    page: 1,
    scrollTop: 0,
    tabbar: {},
    'delBtn': false,//没有删除按钮
  },
  onLoad: function () {
    app.editTabBar()
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getListData()
  },
  // 进入详情
  viewDetail(e) {
    console.log('进入详情：'+JSON.stringify(e))
    const idx = e.currentTarget.dataset.idx
    const onType = e.currentTarget.dataset.type
    // console.log('进入详情ID：' + e.currentTarget.dataset.idx + " , type:" + e.currentTarget.dataset.type)
    /**
     * 文章type=2直接跳转
     * 视频type=1需要传递所有信息
     */
    if(onType == 1) {
      console.log('视频')
      const name = e.currentTarget.dataset.name
      const description = e.currentTarget.dataset.description
      console.log(`../detail/detail?id=${idx}&type=1&name=${name}&description=${description}`)
      const background = e.currentTarget.dataset.background
      const praises = e.currentTarget.dataset.praises
      const plays = e.currentTarget.dataset.plays
      const imgs = e.currentTarget.dataset.imgs
      const is_praises = e.currentTarget.dataset.is_praises
      wx.navigateTo({
        // url: `../detail/detail?id=${e.currentTarget.dataset.idx}&type=${e.currentTarget.dataset.type}`
        url: `../detail/detail?id=${idx}&type=1&name=${name}&description=${description}&background=${background}&praises=${praises}&plays=${plays}&imgs=${imgs}&is_praises=${is_praises}`
        // url: `../detail/detail?id=${idx}&type=1&names=${name}&descriptions=${description}`
      })
    }else {
      wx.navigateTo({
        // url: `../detail/detail?id=${e.currentTarget.dataset.idx}&type=${e.currentTarget.dataset.type}`
        url: `../detail/detail?id=${idx}&type=2`
      })
    }
    return false;

  },
  refreshData() {
    if(this.data.refresh) {
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
  /**
   * 获取列表数据
   */
  getListData() {
    wx.request({
      // url: `${util.requestUrl}index.php?m=minpackage&c=index&a=lists`,
      url: `${util.requestUrl}index.php?m=minpackage&c=index&a=lists_debug`,
      data: {
        page: this.data.page,
        auth: wx.getStorageSync('auth')
      },
      success: res => {
        console.log('列表数据：' + JSON.stringify(res.data.data))
        wx.hideLoading()
        if(!res.data.data.length) {
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
        if(this.data.refresh) {
          this.data.listData = res.data.data
        } else {
          for(let i in res.data.data) {
            this.data.listData.push(res.data.data[i])
          }
        }
        this.setData({
          listData: this.data.listData,
          refresh: false,
          loadMore: false
        })
        // console.log('data中：' + JSON.stringify(this.data.listData))
      }
    })
  },
  // 加载更多
  loadMore() {
    if(this.data.noData) {
      return
    } else {
      this.data.page ++
      this.getListData()
      this.setData({
        loadMore: true,
        page: this.data.page
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '花样年华lite'
    }
  }
})
