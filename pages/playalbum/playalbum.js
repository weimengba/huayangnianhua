var i = 0;
Page({
  data: {
    'bgImg': '../statics/images/bg.jpg',
    'backImage': [
      { url: '../../pages/statics/images/0.jpg',animationData:{},place:'width:100px;height:auto;opacity:0.5'},
      { url: '../../pages/statics/images/2.jpg', animationData: {}, place: 'width:100px;height:auto;opacity:1;top:-100px;' },
      { url: '../../pages/statics/images/0.jpg', animationData: {}, place: 'width:100px;height:auto;opacity:1;right:-500px' },
      { url: '../../pages/statics/images/2.jpg', animationData: {}, place: 'width:300px;height:auto;opacity:0;' },
      { url: '../../pages/statics/images/0.jpg', animationData: {}, place: 'width:50px;height:auto;top: -50px;opacity:0.6;' },
      { url: '../../pages/statics/images/0.jpg',animationData:{},place: 'width:300px;height:auto;opacity:0;'},
      //             //  { url: '../../pages/statics/images/8@2x.png', opacity: 0, place: 'right:0'},
      //             //  { url: '../../pages/statics/images/0.jpg', opacity: 0, place: 'left:0'}
                 ],
    // animationData: {},

  },
  onReady() {
    // this.donghua()
    this.collectEvt()
  },
  collectEvt() {
    setTimeout(function () {
      
      var animation = wx.createAnimation({
        duration: 5000,
        timingFunction: 'ease-out',
      })
      // console.log("打印动画效果：" + JSON.stringify(this.data.animationData))
      this.animation = animation
      console.log('i: '+i)
      if(i === 0) {
        animation.scale(3).rotate(1080).opacity(1).step({ duration: 1500 }).scale(0.1).opacity(0).step({delay:2500, duration: 1000 })
      }else if(i === 1) {
        animation.scale(2).top('50%').opacity(1).step({ duration: 1000 }).scale(3).opacity(0).step({delay: 2000,duration: 1000})
      }else if(i === 2) {
        animation.scale(2).right('38%').skewX(30).opacity(1).step({ duration: 1500 }).scale(0.5).skewX(0).right(600).opacity(0).step({ delay: 2000,duration: 1000})
      }else if(i === 3) {
        animation.opacity(1).step({ duration: 1500 }).width(5).opacity(0).step({ delay: 2000, duration: 1000 })
      }else if(i === 4) {
        animation.opacity(0.6).top(160).step({ duration: 450 }).top(10).opacity(0.8).scale(1.8).step({ duration: 600 }).top(260).step({ duration: 650 }).opacity(0.9).top(90).scale(2.6).step({ duration: 600 }).top('38%').step({ duration: 700 }).top('25%').scale(5).step({ duration: 600 }).top('43%').step({ duration: 700 }).opacity(0).step({ duration: 500,delay:900})
      }else if(i === 5) {
        animation.opacity(1).step({ duration: 1500 }).scale(0.8).opacity(0).step({delay:2000,duration:1500})
      }
      
      var animat = 'backImage['+i+'].animationData'
      console.log('打印0：' + JSON.stringify(this.data.backImage))
      this.setData({
        [animat]: animation.export()
      })
      console.log('打印：' + JSON.stringify(this.data.backImage['+i+']))
      i++;
    }.bind(this), 100)

    if (i < 9) {
      setTimeout(function () {
        this.collectEvt()
      }.bind(this), 5000)
    }

  }
})