var that;
var app = getApp()
Page({
  data: {
    name:"",
    tempFilePaths:"",
    description:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.classify
    })
    that=this

  },
  uploadpng:function(filepath,type){
    wx.cloud.uploadFile({
      cloudPath:'People/'+app.globalData.openid+'/'+(new Date()).getTime()+'.'+type,
      filePath:filepath[0],
      success:res=>{
        that.setData({
          tempFilePaths:res.fileID
        })
        console.log(res)
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  chooseImage(e){
    wx.chooseImage({
      count: 1,//设置最大允许的文件数
      sizeType: ['original','compressed'],//设置文件的类似是原图还是压缩文件
      sourceType: ['album','camera'],//设置文件来源[相册，照相机]
      success: (res) => { 
        this.setData({
          Length:res.tempFiles.length,
          flag:1
        })
        that.uploadpng(res.tempFilePaths,'png')
      },
      fail: (res) => {  
        console.log("上传照片或视频组件调用失败,原因是")
        console.log(res)//打印调用失败的原因
      },
    })
  },

  get_name_input:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  get_description_input:function(e){
    this.setData({
      description:e.detail.value
    })
  },
  show_toast:function(title){
    wx.showToast({
      title: title,
      icon:'none',
    })
  },
  Finished:function(e){
    if(this.data.name==""){
      this.show_toast('必填信息(名称)尚未填写')
    }else{
      wx.cloud.callFunction({
        name:'change',
        success:function(res){
          let db = wx.cloud.database().collection('people')
          db.where({
            _openid:res.result.openid
          }).get()
          .then(res=>{
            console.log('here')
            var star = res.data[0].star
            star.push({
              name:that.data.name,
              description:that.data.description,
              tempFilePaths:that.data.tempFilePaths,
              type:that.data.type,
              visibility:true,
              editor:app.globalData.nickName,
              star_link:[]
            })
            var star2 = star
          db.doc(res.data[0]._id).update({
            data:{
              star:star2
            }
          }).then(res=>{
            wx.showToast({
              icon:'none',
              title:'创建成功'
            })
            that.navigatorTo(e)
          })
          })
    
        }
      })

    }
  },
  navigatorTo:function(e){
    this.setData({
      naviurl:"../"+e.currentTarget.id+"/"+e.currentTarget.id
    })
    wx.navigateTo({
      url: this.data.naviurl,//要用../表示                根目录，否则默认是从当前目录出发
      success:function(){

      },     //成功后的回调；
      fail:function(res){
        console.log(res)//失败后的回调；
      }          
    })

  }
})