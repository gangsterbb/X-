
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_data()
  },
  get_data:function(){
    let db = wx.cloud.database()
    let _ = db.command
    db.collection('Notification').get()
    .then(res=>{
      this.setData({
        Notification:res.data
      }
      )
    })
  },
  navigatorTo:function(e){
    this.setData({
      naviurl:"../"+e.currentTarget.dataset.rout+"/"+e.currentTarget.dataset.rout
    })
    // +this     .data.list02[e.currentTarget.dataset.index].star_link
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