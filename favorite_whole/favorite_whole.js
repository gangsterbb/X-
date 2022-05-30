// pages/favorite_whole/favorite_whole.js
var that;
var db = wx.cloud.database()
var _  =db.command
var app = getApp()
Page({

  
  data: {
    classify:'photo'
  },
  get_Note_People:function(res){
    var openid = []
    console.log(res)
    for(var i = 0;i<res.data.length;i++){
      openid.push(res.data[i]._openid)
    for(var j = 0;j<res.data[i].comment_people.length;j++){
      openid.push(res.data[i].comment_people[j].openid)
    }
    }
    db.collection("people").where({
      _openid:_.in(openid)
    }).get({
      success:function(res){
        that.setData({
            Note_People:res.data
        })
        console.log(that.data.Note_People)
      }
    })
  },
  get_note:function(id,classify){
    console.log(id)
    db.collection('text').where({
      _id:_.in(id),
    }).get({
      success:function(res){
        that.setData({
          Data:res.data
        })
        that.get_Note_People(res)
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  onLoad: function (options) {
    that=this;
    that.get_note(JSON.parse(options.star_link),options.classify)
    this.setData({
      classify:options.classify,
      star_link:options.star_link,
      editor:options.editor,
      name:options.name,
      tempFilePaths:options.tempFilePaths
    })
    console.log(options.classify)

    // var star_link = this.data.star_link.split(',')
    // this.get_record(star_link)
  },
  get_record:function(star_link){
    let db = wx.cloud.database()
    let _ = db.command
    db.collection('text').where({
      _id:_.in(star_link)
    }).get()
    .then(res=>{
      that.setData({
        Data:res.data
      })
    })
  },
  navigateTodetail:function(e){
    let People = encodeURIComponent(JSON.stringify(app.globalData.People))
    let people = {}
      for(var i = 0;i<that.data.Note_People.length;i++){
        if(that.data.Note_People[i]._openid==that.data.Data[e.currentTarget.dataset.index]._openid){
          people =  encodeURIComponent(JSON.stringify(that.data.Note_People[i]))
        }
      }
    let Note_People =  encodeURIComponent(JSON.stringify(that.data.Note_People))
      this.setData({
        naviurl:'../'+e.currentTarget.dataset.rout+'/'+e.currentTarget.dataset.rout+"?id="+that.data.Data[e.currentTarget.dataset.index]._id+"&People="+People+"&index="+e.currentTarget.dataset.index+"&people="+people+"&Note_People="+Note_People+"&Data="+encodeURIComponent(JSON.stringify(that.data.Data[e.currentTarget.dataset.index]))
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
  navigatorTo:function(e){
    this.setData({
      naviurl:"../"+e.currentTarget.dataset.rout+"/"+e.currentTarget.dataset.rout+"?star_link="+this.data.star_link+"&classify="+this.data.classify+"&item="+e.currentTarget.dataset.item
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
})