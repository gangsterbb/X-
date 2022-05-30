var app = getApp()
var that;
var db = wx.cloud.database()
var _ = db.command
// pages/InterestCircles/InterestCircles.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  get_Note_people:function(res){
    var openid = []
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
      }
    })
  },
  onLoad: function (options) {
    that = this
    const db = wx.cloud.database()
    db.collection('text').where({
      topic_class:options.title_taken//话题分类
    }).get()
    .then(res=>{
      that.get_Note_people(res)
      that.setData({
        list:res.data,
        People:app.globalData.People,
      })
    })
  },
  navigatorTo(e){
    let People = encodeURIComponent(JSON.stringify(that.data.People))
    let people = {}

      for(var i = 0;i<that.data.Note_People.length;i++){
        if(that.data.Note_People[i]._openid==that.data.list[e.currentTarget.dataset.index]._openid){
          people =  encodeURIComponent(JSON.stringify(that.data.Note_People[i]))
        }
      }
    let Note_People =  encodeURIComponent(JSON.stringify(that.data.Note_People))
      that.setData({
        naviurl:'../'+e.currentTarget.dataset.rout+'/'+e.currentTarget.dataset.rout+"?id="+that.data.list[e.currentTarget.dataset.index]._id+"&People="+People+"&index="+e.currentTarget.dataset.index+"&people="+people+"&Note_People="+Note_People+"&Data="+encodeURIComponent(JSON.stringify(that.data.list[e.currentTarget.dataset.index]))
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})