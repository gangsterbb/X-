var app  = getApp()
var that
// pages/FabiaoBJ/FabiaoBJ.js
var that;
Page({
  data: {
    textobject:{},  
    userInfo:null,//用于存储用户信息
    hasUserInfo:false,//判断是否获得用户信息（是否已授权）
    Length:0,
    tempFilePaths:[],
    tempFilePath:"",
    FilePaths:[],
    FilePath:[],
    flag:0,
    left_length:20,
    title:"",
    content:"",
    topic_title:"",
    topic_class:"",
    tempFilePath:"",
    animateClass:[''],

    videoflag:0

  },
  onShow:function(){

    wx.getStorage({
      key: 'Note_content',
      success:res=>{
        this.setData({
          FilePaths:res.data.FilePaths,
          FilePath:res.data.FilePath
        })
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
  onLoad: function (options) {

    // wx.serviceMarket.invokeService({
    //   service: 'wxcae50ba710ca29d3', // 'wx_mp_appid',
    //   api: 'goodinfo',
    //   data: {
    //     "q": "小米充电宝", //需要进行商品关键词识别的语句
    //   },
    // }).then(res => {
    //   console.log('invokeService success', res)
    //   wx.showModal({
    //     title: 'cost',
    //     content: (Date.now()) + '',
    //   })
    // }).catch(err => {
    //   console.error('invokeService fail', err)
    //   wx.showModal({
    //     title: 'fail',
    //     content: err + '',
    //   })
    // })

    that = this;
    if(options.title==undefined){

    }else{
      this.setData({
      topic_title:options.title,
      topic_class:options.topic
      })
    }
    that = this;
    wx.getStorage({
      key: 'Note_content',
      success:res=>{
        this.setData({
          title:res.data.title,
          tempFilePaths:res.data.tempFilePaths,
          content:res.data.content,
          flag:1,

        })
      },
      fail:res=>{
        console.log(res)
      }
    })                                                                                                   
  },
  //上传照片
  uploadpng:function(filepath){
      wx.cloud.uploadFile({
        cloudPath:'People/'+app.globalData.openid+'/'+(new Date()).getTime()+'.png',
        filePath:filepath,
        success:res=>{
          that.data.FilePaths.push(res.fileID)
        },
        fail:err=>{
          console.log(err)
        }
      })
  },
  //上传视频
  uploadvideo:function(filepath,type){
    wx.cloud.uploadFile({
      cloudPath:'People/'+app.globalData.openid+'/'+(new Date()).getTime()+type,
      filePath:filepath,
      success:res=>{
        that.data.FilePath.push(res.fileID)
        console.log(that.data.FilePath)
        that.setData({
          videoflag:1
        })
        console.log(res.fileID)
      },
      fail:err=>{
        console.log(err)
      }
    })
},
  onHide: function () {
    wx.setStorage({
      data: {title:this.data.title,tempFilePaths:this.data.tempFilePaths,content:this.data.content,FilePaths:that.data.FilePaths,FilePath:that.data.FilePath},
      key: 'Note_content',
    })
    that.setData({
      FilePaths:[],
      FilePath:[]
    })
  },
  //上传图片
  chooseImage(e){
    wx.chooseImage({
      count: 6,//设置最大允许的文件数
      sizeType: ['original','compressed'],//设置文件的类似是原图还是压缩文件
      sourceType: ['album','camera'],//设置文件来源[相册，照相机]
      success: (res) => { 
        this.setData({
          Length:res.tempFiles.length,
          tempFilePaths:res.tempFilePaths,
          tempFilePath:[],
          flag:1,
          FilePaths:[],
          FilePath:[]
        })
        for(var i = 0;i<res.tempFilePaths.length;i++){
          that.uploadpng(res.tempFilePaths[i])
        }

      },
      fail: (res) => {  
        that.showToast('取消上传','none')

      },
    })
  },
  showToast:function(title,type){
    wx.showToast({
      title:title,
      icon:type,
      duration:500
    })
  },
  chooseVideo:function(){
    wx.chooseMedia({
      count:1,
      camera: 'back',//默认调用后置相机
      mediaType:['video'],
      maxDuration:60,//视频最大长度（秒）
      compressed:false,//是否压缩文件
      success:(res)=>{
        this.setData({
          tempFilePath:res.tempFiles[0].tempFilePath,
          FilePath:[],
          FilePaths:[],
          poster:res.tempFiles[0].thumbTempFilePath,
          tempFilePaths:[],
          flag:-1,
        })
        that.uploadvideo(res.tempFiles[0].tempFilePath,'.mp4')
        that.uploadvideo(res.tempFiles[0].thumbTempFilePath,'.png')
      },
      fail:(res)=>{
        console.log(res)
        that.showToast('取消上传','none')
      }
    })
  },
  gettitleinput:function(e){
    this.setData({
      left_length:20-e.detail.cursor,
      title:e.detail.value
    })
  },
  getContent:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  //切换到话题页
  navigatorTo(e){
    if(e.currentTarget.id=="totopic")//当需要增加要跳转的页面时，在此函数添加判断条件即可
    {
      this.setData({
        naviurl :'../vertical_navigation/vertical_navigation'
      })
    }
    wx.navigateTo({
      
      url: this.data.naviurl,//要用../表示根目录，否则默认是从当前目录出发
      success:function(){

      },     //成功后的回调；
      fail:function(res){
        console.log(res)//失败后的回调；
      }          
    })

},

sleep:function(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while(true) {
    now = new Date();
    if (now.getTime() > exitTime)
      return;
  }
},
showToast:function(title,type){
  wx.showToast({
    title:title,
    icon:type,
    duration:500
  })
},
  //切换到首页
  switchtap:function(e){
      if(this.data.title=="")
      {
        wx.showToast({
          title: '标题不能为空',
          icon:'none'
        })
      }else{
        this.setData({
          naviurl :'../index/index'
        })
        const db = wx.cloud.database()
        db.collection('text').add({
          data:{
            content:this.data.content,
            contentimage:that.data.FilePaths,
            like_people:[],
            star_people:[],
            comment_people:[],
            tran_people:[],
            title:this.data.title,
            video:that.data.FilePath,
            topic_class:this.data.topic_class,
            timestamp:Date.parse(new Date()),
          }
        }).then(res=>{


         
          app.globalData.People.works.push(res._id)
          that.showToast('发布成功','success')

          db.collection('people').doc(app.globalData.People._id).update({
            data:{
              works:app.globalData.People.works
            }
          })
          wx.removeStorage({
            key: 'Note_content',
            success:res=>{
              this.setData({
                title:"",
                content:"",
                tempFilePaths:[],
                tempFilePath:[],
                FilePath:[],
                FilePaths:[],
                flag:0,
                topic_title:"",
              })
            },
            fail:res=>{
              console.log(res)
            }
          })
        })

      }


    
  },
    //预览图片，获取前端数据current_item
    previewimage:function(e){
      console.log(e)
      wx.previewImage({
        urls: this.data.tempFilePaths, // 需要预览的图片http链接列表
        current:this.data.tempFilePaths[e.currentTarget.dataset.current_item],
        success:(res)=>{
        }
      })
    },
    //预览视频
    previewMedia:function(){
      wx.previewMedia({
        sources:this.data.tempFilePath,
        success:(res)=>{ }
      })
    },
    //删除图片，带用户误触机制，获取前端数据current_item

  deleteimage:function(e){
    wx.showModal({
      title:'确定要删除这张图片吗',
      cancelColor: '#000000',
      cancelText:'取消',
      confirmText:'确认',
      success:(res)=>{
        if(res.confirm)
        {
          let temptempFilePaths = this.data.tempFilePaths;//暂时存储tempFilePaths
          temptempFilePaths.splice(e.currentTarget.dataset.current_item,1)//代替tempFilePaths分开，获取分开后剩下的
          that.setData({
            tempFilePaths:temptempFilePaths
          })
        }
      }
    })
  },
   //删除视频，带用户误触机制，获取前端数据current_item
  deleteVideo:function(){
    wx.showModal({
      title:'确定要删除这个视频吗',
      cancelColor: '#000000',
      cancelText:'取消',
      confirmText:'确认',
      success:(res)=>{
        if(res.confirm)
        {
          that.setData({
            flag:3
          })
        }
      }
    })
  },
  //图片转文字
  chooseimage:function(){
    // 选择图片
    wx.chooseImage({
     count: 1,
     success: async function(res) {
       console.log(res)
         var invokeRes = await wx.serviceMarket.invokeService({
           service: 'wx79ac3de8be320b71',
           api: 'OcrAllInOne',
           data: {
             img_url: new wx.serviceMarket.CDN({
               type: 'filePath',
               filePath: res.tempFilePaths[0],
             }),
             data_type: 3,
             ocr_type: 8
           },
           success:function(ress){
             console.log(ress)
             that.setData({
               recognition:ress.data.ocr_comm_res.items
             })
             var text=[];
             for(let key in that.data.recognition)
             {
               text.push(that.data.recognition[key].text)
             }
             var task = text.join()
             that.setData({
              content:task
             })
            },
            fail:function(res){
              console.log(res)
            }
         })
     },
     fail: function(res) {
       console.log(res)
     },
   })
   
     },

})