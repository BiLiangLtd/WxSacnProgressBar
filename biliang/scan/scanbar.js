/**
 * @author 陈建维
 * 扫描组件封装
 */

class ScanBar {

  constructor() {
    this.circleTime = 5000;//旋转一周的时间
    this.createAnimations();
    this.initValues();
    this.setPageData();

  }

  getPage() {
    let allpages = getCurrentPages()
    return allpages[allpages.length - 1]
  }

  createAnimations() {
    this.animation = wx.createAnimation({
      transformOrigin: "150px 150px",
      duration: this.circleTime,
      timingFunction: "linear",
      delay: 0
    })
  }

  initValues() {
    this.timer = null
    this.opacityTimer = null;

    this.repeat = 2;
  }

  setPageData() {
    this.getPage().setData({
      'scanbar.progressPercent': '0',
      'scanbar.loadingDecIcoShow': false,
      'scanbar.circle': '../../biliang/res/gradient_circle.png',//默认外圆图标
      'scanbar.circle_dot': '../../biliang/res/gradient_dot.png',//默认外圆上的点
    })
  }

  //传入要显示的图片，进行初始化、图片位置动态计算
  init(images) {
    if (!images || !images.length)
      return

    if (images.length > 20) {
      images = images.slice(0, 20);//目前最多只能取16个图标
    }

    let imageItems = [];
    this.animations = [];

    //使用平均随机分布算法，把图标尽量平均的随机分布在圆内
    for (let i = 0; i < images.length; i++) {
      let randomPoint = this.randomPoint();

      //极坐标转直角坐标
      let x = randomPoint[0];
      let y = randomPoint[1];

      //排除重叠坐标
      let repeatRect = false;
      for (let i = 0; i < imageItems.length; i++) {
        let item = imageItems[i];
        //矩形相交
        if (this.isRectRepeat(x, y, item.x, item.y)) {
          randomPoint = this.randomPoint();
          x = randomPoint[0];
          y = randomPoint[1];
          repeatRect = true;
          break;
        }
      }

      while (repeatRect) {
        randomPoint = this.randomPoint();
        x = randomPoint[0];
        y = randomPoint[1];
        repeatRect = false;
        for (let i = 0; i < imageItems.length; i++) {
          let item = imageItems[i];
          //矩形相交
          if (this.isRectRepeat(x, y, item.x, item.y)) {
            repeatRect = true;
            break;
          }
        }
      }

      let A = 360 - randomPoint[2] + 90;

      if (A >= 360)
        A = A - 360;

      let imageItem = {
        img: images[i],
        left: (x + 150) + 'px',
        top: (150 - y) + 'px',
        time: this.circleTime * (A / 360),
        x,
        y,
        A: randomPoint[2]
      }
      imageItems.push(imageItem);
      this.animations.push(wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
        delay: 0,
      }));
    }

    console.log('imageItems', imageItems)

    this.getPage().setData({
      'scanbar.images': imageItems,
    })

    return this.instance;
  }

  isOutOfCircle(x1, y1) {
    //d=√（X1-X2）²+（y1-y2）² 判断各点坐标到圆心距离是否大于半径，大于则出界
    //矩形四个顶点：(x,y) (x+32,y) (x,y+32) (x+32,y+32)，转换视图坐标 y-32
    //设圆心为(0,0)，则(x2, y2) = (0, 0)，半径150
    return Math.sqrt((x1 + 32) * (x1 + 32) + y1 * y1) >= 140
      || Math.sqrt(x1 * x1 + (32-y1) * (32-y1)) >= 140
      || Math.sqrt((x1 + 32) * (x1 + 32) + (32-y1) * (32-y1)) >= 140
  }

  //随机点
  randomPoint() {
    let cellradius = 150;
    let user_beta = Math.random(1) * 360;
    let user_r = Math.random(1) * cellradius;

    //极坐标转直角坐标
    let x = user_r * Math.cos(Math.PI / 180 * user_beta);
    let y = user_r * Math.sin(Math.PI / 180 * user_beta);

    while (this.isOutOfCircle(x, y)) {
      user_beta = Math.random(1) * 360;
      user_r = Math.random(1) * cellradius;

      while (user_r > 118) {
        user_r = Math.random(1) * cellradius;
      }

      x = user_r * Math.cos(Math.PI / 180 * user_beta);
      y = user_r * Math.sin(Math.PI / 180 * user_beta);
    }

    //d=√（X1-X2）²+（y1-y2）² 判断各点坐标到圆心距离是否大于半径，大于则出界


    //排除中间部分区域
    while (x >= -100 && x <= 70 && y >= -40 && y <= 70) {
      user_beta = Math.random(1) * 360;
      user_r = Math.random(1) * cellradius;

      while (user_r > 118) {
        user_r = Math.random(1) * cellradius;
      }

      x = user_r * Math.cos(Math.PI / 180 * user_beta);
      y = user_r * Math.sin(Math.PI / 180 * user_beta);

      while (this.isOutOfCircle(x, y)) {
        user_beta = Math.random(1) * 360;
        user_r = Math.random(1) * cellradius;

        while (user_r > 118) {
          user_r = Math.random(1) * cellradius;
        }

        x = user_r * Math.cos(Math.PI / 180 * user_beta);
        y = user_r * Math.sin(Math.PI / 180 * user_beta);
      }
    }

    let point = [];
    point.push(x);
    point.push(y);
    point.push(user_beta);

    return point;
  }

  //矩形相交判断
  isRectRepeat(x1, y1, x2, y2) {
    return Math.min(x1 + 35, x2 + 35) >= Math.max(x1, x2)
      && Math.min(y1 + 35, y2 + 35) >= Math.max(y1, y2)
  }

  showImgs() {

    this.animation.rotateZ(360).step()
    this.getPage().setData({
      'scanbar.circleAnimation': this.animation.export(),
    })

    this.currentTime = 500;

    let repeatTime = 500;

    this.opacityTimer = setInterval(function () {
      let images = this.getPage().data.scanbar.images;

      let anims = [];

      for (let i = 0; i < images.length; i++) {
        let image = images[i];
        let imageTime = image.time;
        let animObj = image.animObj;

        if (imageTime > 500) {
          if (this.currentTime > imageTime - 200 && imageTime + 300 >= this.currentTime) {
            anims.push(this.animations[i].opacity(1).step().export())
          } else {
            anims.push(this.animations[i].opacity(0).step().export())
          }
        } else {
          if (this.currentTime > imageTime && imageTime + 500 >= this.currentTime) {
            anims.push(this.animations[i].opacity(1).step().export())
          } else {
            anims.push(this.animations[i].opacity(0).step().export())
          }
        }

      }

      this.getPage().setData({
        'scanbar.animations': anims,
      })

      if (this.currentTime >= this.circleTime) {
        this.currentTime = 0;
      }

      this.currentTime += repeatTime;
      if (this.currentTime >= this.circleTime) {
        // this.currentTime = 0;
        this.animation.rotateZ(360 * this.repeat).step()
        this.getPage().setData({
          'scanbar.circleAnimation': this.animation.export(),
        })
        this.repeat++;
      }
    }.bind(this), repeatTime);
  }

  startScan() {
    this.stopScan(false);
    this.timer = setTimeout(function () {
      this.showImgs();
    }.bind(this), 500);
  }

  setProgress(progress) {
    this.getPage().setData({
      'scanbar.progressPercent': progress,
    })
    return this.instance;
  }

  stopScan(stop) {
    this.animation.rotateZ(0).step({ duration: 0 })
    let images = this.getPage().data.scanbar.images;
    let anims = [];
    for (let i = 0; i < images.length; i++) {
      anims.push(this.animations[i].opacity(0).step().export())
    }
    this.getPage().setData({
      'scanbar.loadingDecIcoShow': stop,
      'scanbar.circleAnimation': this.animation.export(),
      'scanbar.animations': anims,
    })
    if (stop && stop === true) {
      clearTimeout(this.timer);
      clearInterval(this.opacityTimer);
      this.initValues();
    }
  }

}

module.exports = ScanBar