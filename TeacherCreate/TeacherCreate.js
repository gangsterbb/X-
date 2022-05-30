// pages/TeacherCreate/TeacherCreate.js
var db = wx.cloud.database()
var _ = db.command
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  navigatorTo(e){
    var data = encodeURIComponent(JSON.stringify(that.data.Data[e.currentTarget.dataset.index]))
      this.setData({
        naviurl :'../'+e.currentTarget.dataset.rout+'/'+e.currentTarget.dataset.rout+"?Data="+data
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    db.collection('video').get()
    .then(res=>{
      console.log(res)
      that.setData({
        Data:res.data
      })
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