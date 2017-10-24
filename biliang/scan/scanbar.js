/**
 * @author 陈建维
 * 扫描组件封装
 */

class ScanBar {

  constructor() {

    this.createAnimations();
    this.initValues();
    this.setPageData();

  }

  createAnimations() {
    this.animation = wx.createAnimation({
      transformOrigin: "150px 150px",
      duration: 4000,
      timingFunction: "linear",
      delay: 0
    })

    this.animation1 = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })

    this.animation2 = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })

    this.animation3 = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })

    this.animation4 = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })
  }

  initValues() {
    this.timer = null
    this.opacityTimer = null;
    this.data = {
      dataSplit: 4,//把整个圆分成dataSplit份
      dataGroup: {},
    }

    this.repeat = 2;
    this.renderImage = 0;//用于控制哪块区域渲染图片
  }

  setPageData() {
    let allpages = getCurrentPages()
    let currentPage = allpages[allpages.length - 1]
    let page = currentPage
    page.setData({
      'scanbar.progressPercent': '0',
      'scanbar.loadingDecIcoShow': false,
      'scanbar.circle': '../../biliang/res/gradient_circle.png',//默认外圆图标
      'scanbar.circle_dot': '../../biliang/res/gradient_dot.png',//默认外圆上的点
    })
  }

  //传入要显示的图片，进行初始化、图片分组
  init(images) {

    if (!images || !images.length)
      return

    if (images.length > 16) {
      images = images.slice(0, 16);//目前最多只能取16个图标
    }

    let dataSplit = this.data.dataSplit;

    let dataGroupCount = Math.floor(images.length / dataSplit)//每组的个数
    let remainder = images.length % dataSplit//余数

    //将整组图片分布到每一组里面去
    for (let i = 0; i < dataSplit; i++) {
      this.data.dataGroup[i] = [];
      let startIndex = i * dataGroupCount;
      let endIndex = (i + 1) * dataGroupCount;
      for (let j = 0; j < images.length; j++) {
        if (j >= startIndex && j < endIndex) {
          this.data.dataGroup[i].push(images[j]);
        }
      }
    }

    //将剩余图片分布在各组
    for (let k = 0; k < remainder; k++) {
      this.data.dataGroup[k].push(images[dataGroupCount * dataSplit + k]);
    }

    console.log('data group', this.data.dataGroup);

    let allpages = getCurrentPages()
    let currentPage = allpages[allpages.length - 1]
    let page = currentPage

    page.setData({
      'scanbar.imagesGroup1': this.data.dataGroup[0],
      'scanbar.imagesGroup2': this.data.dataGroup[1],
      'scanbar.imagesGroup3': this.data.dataGroup[2],
      'scanbar.imagesGroup4': this.data.dataGroup[3],
    })

    return this.instance;
  }

  startScan() {
    this.stopScan(false);
    this.timer = setTimeout(function () {
      this.showImages();
    }.bind(this), 500);
  }

  //循环闪烁显示图片
  showImages() {

    let allpages = getCurrentPages()
    let currentPage = allpages[allpages.length - 1]
    let page = currentPage

    this.animation.rotateZ(360).step()
    page.setData({
      'scanbar.circleAnimation': this.animation.export(),
    })

    //用完记得停掉它，不然会炸掉
    this.opacityTimer = setInterval(function () {
      this.animation1.opacity(this.renderImage % this.data.dataSplit === 0 ? 1 : 0).step();
      this.animation2.opacity(this.renderImage % this.data.dataSplit === 1 ? 1 : 0).step();
      this.animation3.opacity(this.renderImage % this.data.dataSplit === 2 ? 1 : 0).step();
      this.animation4.opacity(this.renderImage % this.data.dataSplit === 3 ? 1 : 0).step();

      if (this.renderImage > 0 && (this.renderImage + 1) % 4 === 0) {
        this.animation.rotateZ(360 * this.repeat).step()
      }
      page.setData({
        'scanbar.circleAnimation': this.animation.export(),
        'scanbar.animationGroup1': this.animation1.export(),
        'scanbar.animationGroup2': this.animation2.export(),
        'scanbar.animationGroup3': this.animation3.export(),
        'scanbar.animationGroup4': this.animation4.export(),
      })
      if (this.renderImage > 0 && (this.renderImage + 1) % 4 === 0) {
        this.repeat++;
      }
      this.renderImage++;
    }.bind(this), 1000);


  }

  setProgress(progress) {
    let allpages = getCurrentPages()
    let currentPage = allpages[allpages.length - 1]
    let page = currentPage
    page.setData({
      'scanbar.progressPercent': progress,
    })
    return this.instance;
  }

  stopScan(stop) {
    let allpages = getCurrentPages()
    let currentPage = allpages[allpages.length - 1]
    let page = currentPage
    this.animation.rotateZ(0).step({ duration: 0 })
    this.animation1.opacity(0).step({ duration: 0 });
    this.animation2.opacity(0).step({ duration: 0 });
    this.animation3.opacity(0).step({ duration: 0 });
    this.animation4.opacity(0).step({ duration: 0 });
    page.setData({
      'scanbar.loadingDecIcoShow': stop,
      'scanbar.circleAnimation': this.animation.export(),
      'scanbar.animationGroup1': this.animation1.export(),
      'scanbar.animationGroup2': this.animation2.export(),
      'scanbar.animationGroup3': this.animation3.export(),
      'scanbar.animationGroup4': this.animation4.export(),

    })
    if (stop && stop === true) {
      clearTimeout(this.timer);
      clearInterval(this.opacityTimer);
      this.initValues();
    }
  }

}

module.exports = ScanBar