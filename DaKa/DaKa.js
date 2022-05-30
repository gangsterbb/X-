// pages/DaKa/DaKa.js
import convertSolarLunar from "../../utils/convertSolarLunar"
var util = require('../../utils/util.js');
var that 
var app = getApp()
const db=wx.cloud.database("text")
const _=db.command
var bgimage=[ '/images/bg.jpg',//更换背景图的默认背景图
              '/images/content.jpg',
              '/images/ErWeiMa.png',
              '/images/index_icon.png',
              '/images/JieMao.png'
            ]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //添加导航栏元素，只需在tabList中填上id号及元素名称即可
    tabList: [
			
			{ id: 1, typeName: '打卡' },
			{ id: 3, typeName: '拍摄' },

    ],

    canvas_arr:{
      src:'',
      width:parseInt(wx.getSystemInfoSync().windowWidth * 0.8),
      height:parseInt(wx.getSystemInfoSync().windowHeight * 0.7),
      show:false
    },
    cutting:{
      height:0,
      width:0,
      max_y:0,
      max_x:0,
      show:false
    },
    canvas_y:0,
    canvas_x:0,
    color_status:false,
    canfile_image:'',
    startY:0,
    startX:0,



    windowHeight:0,
    windowWidth:0,
    hidden:true,
    prurl:'',
		activeIndex: 0,//被选中的导航栏元素的编号
		toViewComment: '',//未知作用
    time:'',
    date:'',
    backgroundimage:'/images/bg.jpg',//背景图片
    tempFilePaths:'',
    bgindex:0,
    isDisabled:false,
    default_title:"我已经在X方舟坚持打卡#天",//默认文字
    default_focus:false,//自动聚焦
    animateClass: ['','',''],
    animateClass_1: '',
    
    dateString: "",
    spot: []
  },

  onClickAnimateEvent (e) { 
    var index=e.currentTarget.dataset.index_1
    this.setData({
      [`animateClass[${index}]`]: '',         
    });
    this.setData({
      [`animateClass[${index}]`]: e.currentTarget.dataset.class,
    }); 
},

  //改变被选中的元素的状态（样式）
  handleTabChange (e) {
    this.setData({
      animateClass_1: ''
    })
    this.setData({
      activeIndex:e.currentTarget.dataset.index,
      animateClass_1: e.currentTarget.dataset.class
    })
    
    const index = +e.currentTarget.dataset.index;
    this.triggerEvent('TabChange', index);
    this.indexoperation();
  },
    //上传图片
    chooseImage(e){
      wx.chooseImage({
        count:1,//设置最大允许的文件数
        sizeType: ['original','compressed'],//设置文件的类似是原图还是压缩文件
        sourceType: ['album','camera'],//设置文件来源[相册，照相机]
        success: (res) => { 
       let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64');
          this.setData({
            tempFilePaths:res.tempFilePaths,
            'backgroundimage': 'data:image/jpg;base64,' + base64
          })
        },
        fail: (res) => {  
          console.log("上传照片或视频组件调用失败,原因是")
          console.log(res)//打印调用失败的原因
        },
      })
    },
    //切换到不同索引对应不同的操作
    indexoperation:function(){
      if(this.data.activeIndex==0)
      {

      }
      else if(this.data.activeIndex==1)
      {
      this.uploadtap();
      }
      

    },
  //更换背景
    changebackground:function(){
      this.data.bgindex++;
      if( this.data.bgindex>bgimage.length-1){
        this.data.bgindex=0;
      }
      this.setData({
        backgroundimage: bgimage[this.data.bgindex]
      })
      console.log(this.data.backgroundimage) 
      // var bgimg;
      wx.getImageInfo({ 
        src: this.data.backgroundimage,
        success:(res)=>{
          console.log(res.path)
          this.data.backgroundimage=res.path
        }
      })
      console.log(this.data.bgimg)
      // wx.setStorageSync('bgimg', this.data.backgroundimage)
    },
    //点击编辑文字
    changetitle:function(e){
      this.setData({
        isDisabled:false,
        default_title:"",
        default_focus:false//自动聚焦
      })
    },
    bounce_QRCode:function(){
      console.log("弹出二维码");
    },
    //日历功能改变日期
    dateChange(e) {
      console.log("选中日期变了,现在日期是", e.detail.dateString)
      this.setData({
        dateString: e.detail.dateString
        
      })
    },
    //日签功能
    date_punch:function(){
      
    },
    //设置当前日期
    set_date:function(){

      let that = this;
      let base64 = wx.getFileSystemManager().readFileSync(this.data.backgroundimage, 'base64');
      this.setData({
        'backgroundimage': 'data:image/jpg;base64,' + base64
      })
      setInterval(function () {
        // console.log(util.formatMonth(new Date()))
        that.setData({
          time: util.formatTim(new Date())+" 周"+util.getWeekByDate(new Date()),//国历
          skyground:convertSolarLunar.solar2lunar(util.formatYear(new Date()),util.formatMonth(new Date()),util.formatDay(new Date())).gzYear,//农历年份
          lunermonth:convertSolarLunar.solar2lunar(util.formatYear(new Date()),util.formatMonth(new Date()),util.formatDay(new Date())).IMonthCn,//农历月份
          lunardate:convertSolarLunar.solar2lunar(util.formatYear(new Date()),util.formatMonth(new Date()),util.formatDay(new Date())).IDayCn,//农历日期
        });
      }, 1000);
      this.setData({
        calendar_date:this.data.time
      })
    },
    onShareAppMessage() {
      from:"button" 
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: this.data.default_title
          })
        }, 2000)
      })
      return {
        title: this.data.default_title  ,
        path: '/pages/DaKa/DaKa',
        promise 
      }
    },
//分享到朋友圈,结合画布使用
    onShareTimeline: function() {
      return {
        title: '方舟诗词',
        query: 'name=xxx&age=xxx',
        imageUrl: '../../images/content.jpg',
      }
    },
    get_people:function(callback){
      wx.cloud.callFunction({
        name:'change',
        success:function(res){
          db.collection('people').where({
            _openid:res.result.openid
          }).get()
          .then(res=>{
            that.setData({
              People:res.data[0]
            })
            callback()
          })
        }
      })
      },
    get_photo:function(){
      db.collection('Notification').doc('c1d4d87a6258e9140056b4740a19d5ec').get({
        success:function(res){
          bgimage = res.data.bgimage
        },

        
      })
      },
    onShow:function(){
      that = this
      that.get_people(function(){
        that.setData({
          default_title:"我已经在X方舟坚持打卡"+that.data.People.spot.length+"天",
          default_content:"明月几时有，把酒问青天"
        })
      })
      that.get_photo()

    },
    onLoad:function(options){
      this.changetitle();
      this.set_date();

      let that=this;
      let sysinfo=wx.getSystemInfoSync(),
      statusHeight=sysinfo.statusBarHeight,
      isiOS=sysinfo.system.indexOf('iOS')>-1,
      navHeight;
      if(!isiOS){
        navHeight=48;
      }else{
        navHeight=44;
      }
      that.setData({
        statusHeight:statusHeight,
        navHeight:navHeight
      })
      const ctx = wx.createCanvasContext('canvas')
      ctx.rect(10, 10, 150, 75)
      ctx.setFillStyle('red')
      ctx.fill()
      ctx.draw()
      
    },
    navigatorTo(e){
      console.log(e.currentTarget.back);
      if(e.currentTarget.id=="back")//当需要增加要跳转的页面时，在此函数添加判断条件即可
      { 
        wx.navigateBack({
          delta: 1,
        })
        return;
      }
      
      this.setData({
        naviurl:"../"+e.currentTarget.dataset.rout+"/"+e.currentTarget.dataset.rout
      })
      wx.navigateTo({
        url: this.data.naviurl,//要用../表示根目录，否则默认是从当前目录出发
        success:function(){
  
        },     //成功后的回调；
        fail:function(res){
          console.log(res)//失败后的回调；
        }          
      })
  
  },




 


  








goback: function(){
  this.setData({ 
    hidden:true
  })
},

// 文字自动换行
textPrewrap:function(ctx, content, drawX, drawY, lineHeight, lineMaxWidth, lineNum) {
  var drawTxt = ''; // 当前绘制的内容
  var drawLine = 1; // 第几行开始绘制
  var drawIndex = 0; // 当前绘制内容的索引

  // 判断内容是否可以一行绘制完毕
  if(ctx.measureText(content).width <= lineMaxWidth) {
      ctx.fillText(content.substring(drawIndex, i), drawX, drawY);
  } else {
      for (var i = 0; i < content.length; i++) {
              drawTxt += content[i];
              if (ctx.measureText(drawTxt).width >= lineMaxWidth) {
                  if (drawLine >= lineNum) {
                      ctx.fillText(content.substring(drawIndex, i) + '..', drawX, drawY);
                      break;
                  } else {
                      ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY);
                      drawIndex = i + 1;
                      drawLine += 1;
                      drawY += lineHeight;
                      drawTxt = '';
                  }
              } else {
                  // 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
                  if (i === content.length - 1) {
                      ctx.fillText(content.substring(drawIndex), drawX, drawY);
                  }
              }
          }
  }
},

// 生成朋友圈图片
  share: function () {
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          hidden:false
        })
      },
    }) 
    var windowWidth = that.data.windowWidth;
    var windowHeight = that.data.windowHeight; 
    var k=windowWidth/750;
    const ctx = wx.createCanvasContext('myCanvas1')

    // var bgimg=wx.getStorageSync('bgimg') 

    ctx.drawImage(this.data.backgroundimage,0,0,windowWidth,windowWidth)

    // console.log(bgimg)    
    // console.log(this.data.backgroundimage) 
    ctx.rect(0,windowWidth-10,windowWidth,windowWidth/3)
    ctx.setFillStyle('#ffffff')
    ctx.fill()


    ctx.drawImage('../../images/other/share_EWM.jpg',580*k,windowWidth+10*k,130*k,130*k)

  
    ctx.setFontSize(38*k)
    this.textPrewrap(ctx, '    可可西比维多利亚的秘密善文地理峰峰火凤凤凤', 50*k, 250*k, 60*k, 300*k,10)
        
    
    
    ctx.font='normal 11px sans-serif' 
    ctx.setFillStyle('#fff') 
    ctx.setFontSize(45*k) 
    ctx.fillText('相/伴/时/光',50*k,120*k,300)

    ctx.setFontSize(35*k)
    ctx.fillText('年.农历',450*k,60*k,200)

    ctx.setFontSize(35*k)
    ctx.setFillStyle('black')
    ctx.fillText('我已经在X方舟坚持打卡',30*k,windowWidth+80*k,200)
    ctx.setFontSize(48*k)
    ctx.setFillStyle('red')
    ctx.fillText('28',30*k,windowWidth+140*k,400)
    ctx.setFontSize(35*k)
    ctx.setFillStyle('black')
    ctx.fillText('天',100*k,windowWidth+140*k,200)

    ctx.setFontSize(25*k)
    ctx.setFillStyle('grey')
    ctx.fillText('长按识别',595*k,windowWidth+180*k,300)

    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas1', 
        success: function (res) { 
          console.log(res.tempFilePath)
          // wx.previewImage({
          //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
          // })
          that.setData({
            prurl: res.tempFilePath,
            hidden: false
          })
        }
      })
    });


  },
  // 保存图片到本地
  save:function(){
    var that = this
    wx.getImageInfo({
          src: that.data.prurl,
          success:function(res){
            var path=res.path;
            wx.saveImageToPhotosAlbum({
            filePath: path,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    /* 该隐藏的隐藏 */
                    that.setData({
                      hidden: true
                    })
                  }
                }
              })
          }
        })
      }
    })
    
  },
  previewimage:function () {
    wx.previewImage({
      urls: [this.data.prurl]
    })
  },




  


  color_tap(e){
    var type = e?e.currentTarget.dataset.type:0
    if(type == 1){
      this.setData({
        color_status:!this.data.color_status
      })
    }else{
      this.data.canvas_arr.show = false
      this.data.canvas_arr.height = parseInt(wx.getSystemInfoSync().windowHeight * 0.7)
      this.data.cutting.show = false
      this.data.cutting.src = ''
      this.setData({
        canvas_arr:this.data.canvas_arr,
        cutting:this.data.cutting,
        canvas_y:0,
        canvas_x:0,
      })
    }
  },
  setTouchMove(e){return;},
  uploadtap(e){
    var that = this
    wx.chooseImage({
      count:1,
      sizeType: ['original','compressed'],//设置文件的类似是原图还是压缩文件
      sourceType: ['album','camera'],//设置文件来源[相册，照相机]
      

      success (res) {
        let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64');
        const tempFilePaths = res.tempFilePaths[0]
        that.data.canvas_arr.src = tempFilePaths
        wx.getImageInfo({
          src: tempFilePaths,
          success (res) {  
            that.data.canvas_arr.show = true 
            that.data.cutting.show = true
            console.log(res.width)
            console.log(res.height)
            if(res.width>res.height){
              that.data.cutting.width=(res.height*1.0/res.width)*parseInt(wx.getSystemInfoSync().windowWidth * 0.8)
              that.data.cutting.height=(res.height*1.0/res.width)*parseInt(wx.getSystemInfoSync().windowWidth * 0.8)
              console.log(that.data.cutting.width)
              console.log(that.data.cutting.height)
            }else{
              that.data.cutting.height = that.data.canvas_arr.width 
              that.data.cutting.width=that.data.canvas_arr.width 
            }
            
            var height = parseInt(res.height / (res.width / that.data.canvas_arr.width))
            that.data.canvas_arr.height = height > that.data.canvas_arr.height ? that.data.canvas_arr.height : height
            that.data.cutting.max_y = that.data.canvas_arr.height - that.data.cutting.height
            that.data.cutting.max_x = that.data.canvas_arr.width - that.data.cutting.width
            that.setData({
              canvas_arr:that.data.canvas_arr
            })
            setTimeout(function () {
              that.setData({
                cutting:that.data.cutting,
                tempFilePaths:res.tempFilePaths,
                // 'backgroundimage': 'data:image/jpg;base64,' + base64
              })
            },500)
          }
        })
      }
    })
  },
  handletouchstart: function (e) {
    
      this.data.startY = e.touches[0].clientY
    
      this.data.startX = e.touches[0].clientX
    
    
  },
  handletouchmove (e) {
    let currentY = e.touches[0].clientY - this.data.startY
    let currentX = e.touches[0].clientX - this.data.startX
    
      if(currentY > 0){
        this.setData({
          canvas_y:currentY > this.data.cutting.max_y?this.data.cutting.max_y:currentY,
        })
      }else{
        this.setData({
          canvas_y:0
        })
      }

      if(currentX > 0){
        this.setData({
          canvas_x:currentX > this.data.cutting.max_x?this.data.cutting.max_x:currentX,
        })
      }else{
        this.setData({
          canvas_x:0
        })
      }
    
    
  },
  ationimg(e){
    var that = this
    var canvas_img = wx.createCanvasContext('myCanvas')
    canvas_img.width = that.data.canvas_arr.width
    canvas_img.height = that.data.canvas_arr.height
    canvas_img.drawImage(that.data.canvas_arr.src,0,0,canvas_img.width,canvas_img.height)
    canvas_img.draw(true,(()=>{
      wx.canvasToTempFilePath({
        x: that.data.canvas_x,
        // skalncacklasncksa
        y: that.data.canvas_y,
        width:that.data.cutting.width,
        height:that.data.cutting.height,
        canvasId: 'myCanvas',
        
        success: function (res) {
          that.setData({
            canfile_image:res.tempFilePath,
          })
          that.color_tap()
          wx.showToast({
            title: '裁剪成功~',
            icon: 'none',
            duration: 3000
          })
          that.setData({
            backgroundimage:res.tempFilePath
          })
        }
      });
    }))
  },





















  
})
