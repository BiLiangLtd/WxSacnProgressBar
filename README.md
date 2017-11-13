## WxSacnProgressBar
用于微信小程序的一个圆形进度组件，支持自定义循环播放图标。

## 效果图
![image](https://github.com/BiLiangLtd/WxSacnProgressBar/raw/master/demo_images/ScanBar.png)
![image](https://github.com/BiLiangLtd/WxSacnProgressBar/raw/master/demo_images/ScanAnimation.gif)
  
## 如何使用
### 整个项目可以直接作为小程序项目导入到微信开发者工具中运行，biliang目录为组件库目录。
1. 把clone下来中的项目中的 **biliang** 目录，拷贝到 **小程序项目的根目录**  
2. 在你的页面级别中(pages/xxx)，导入使用，具体如下：  
	**1）在wxss中导入样式**  
	
	```javascript
	@import "../../biliang/scan/scanbar.wxss";
	```
	  
	**2)在wxml中导入模板，并指定template，is和data请都不要修改，组件会自动调用**  
	
	```xml
	<import src="../../biliang/scan/scanbar.wxml"/>
	<view class="container">
		<template is="scanbar" data="{{...scanbar}}"/>
	</view>
	```
	  
	**3）在页面js中导入**  
	
	```javascript
	var ScanBar = require("../../biliang/scan/scanbar.js")
	```
	  
	**4）在页面js中，调用ScanBar中提供的方法，即可实现效果**  
	
	```javascript
	onLoad: function () {
		//1、创建对象
    	this.scanBar = new ScanBar();
    	//2、传入需要展示的图标
    	this.scanBar.init(['../../images/icon_toutiao.svg', '../../images/icon_weibo.svg', '../../images/icon_sohu.svg']);
	},
	onShow: function () {
    	//3、开始扫描
    	this.scanBar.startScan();
    	//4、设置进度
    	this.scanBar.setProgress(progress);
    },
    onHide: function () {
    	//5、调用该方法可停止扫描，进度达到100%之后，请手动调用，页面关闭时也请手动调用
    	this.scanBar.stopScan(true);
    }
	```