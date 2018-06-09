var animation = wx.createAnimation({})
var i = 1;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // author: {
    //   type: String,
    //   value: ''
    // },
    delBtn: {
      type: Boolean,
      value: false
    },
    myData: {
      type: Object,
      value: ''
    },
    id: {
      type: String,
      value: ''
    },
    index: {
      type: Boolean,
      value: false
    },
    onlyImg: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // donghua: true,
    // left1: Math.floor(Math.random() * 305 + 1),
    // left2: Math.floor(Math.random() * 305 + 1),
    // left3: Math.floor(Math.random() * 305 + 1),
    // left4: Math.floor(Math.random() * 305 + 1),
    // left5: Math.floor(Math.random() * 305 + 1),
    // left6: Math.floor(Math.random() * 305 + 1),
  },
  ready() {
    // console.log(this.data.index+' 组件打印：' + this.data.delBtn + " , id:" + JSON.stringify(this.data.myData))
    // console.log("打印数据："+JSON.stringify(this.data.myData));
    console.log('是否加载图片：' + this.data.onlyImg)
    // this.donghua()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // videoBtn: function() {
    //   var that = this
    //   var myAttr = 'myData.iconBtn'
    //   that.setData({
    //     [myAttr]: this.data.myData.iconBtn == 'stop' ? 'start' : 'stop'
    //   })
    // },
    delVideo: function (e) {
      // console.log("删除:" + this.data.delBtn);
      var that = this;
      that.setData({
        'myData': {}
      })
    },
    albumDetail: function(e) {
      console.log(this.data.index)
      if (this.data.index){
        return false;
      }
      console.log('页面跳转到详情页: id:' + JSON.stringify(e.currentTarget.dataset));
      // const idx = e.currentTarget.dataset.idx
      wx.navigateTo({
        // url: `../detail/detail?id=${this.data.listData.data[idx].id}`
        url: `../detail/detail?id=${e.currentTarget.dataset.id}&type=${e.currentTarget.dataset.type}`
      })
    },
    // donghua: function () {
    //   console.log('开始动画')
    //   setTimeout(function () {
    //     animation.translateY(900).step({ duration: 4000 })
    //     // animation.left(0).step({ duration: 500 })
    //     this.setData({
    //       // ["animationDatas"]: animation.export()
    //       ["animationDatas" + i]: animation.export()
    //     })
    //     i++;
    //   }.bind(this), 500)
    //   if (i < 7) {
    //     setTimeout(function () {
    //       this.donghua()
    //     }.bind(this), 500)
    //   } else {
    //     console.log(22)
    //     setTimeout(function () {
    //       this.setData({
    //         donghua: false
    //       })
    //     }.bind(this), 4500)
    //   }
    //   console.log(JSON.stringify(this.data))
    // }
  }
})
