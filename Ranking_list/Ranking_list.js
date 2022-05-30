// pages/Ranking_list/Ranking_list.js
const db=wx.cloud.database("Songci")
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
  name:"",
  people:[],

  //索引值
  index:0,
  day:86400000,//单位是毫秒
  start:1651420800000,//5月2号00；00；00的时间戳，单位是毫秒\
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    //从飞花令页传值过来，根据传的值判断是哪个榜单
          const eventChannel = this.getOpenerEventChannel();
          eventChannel.emit('someEvent', {data: 'name'});
          eventChannel.on('acceptDataFromOpenerPage', function(data) {
              // console.log(data.name)
              that.setData({
                name:data.name
              })
              console.log(that.data.name)
              that.setIndex()
              db.collection(that.data.name).where({
                index:_.eq(that.data.index)
              }).get().then(res=>{
                console.log(res)
                that.setData({
                  people:res.data[0].List
                })
                console.log(that.data.people)
                if(that.data.people.length==0){
                  console.log("暂时还没有人占据榜单噢，快来试试！")
                }
              })
          })
  },

  setIndex()
  {
    var that=this
    let now=Date.now()//单位是毫秒
    //  console.log(now)
    //  console.log(that.data.start)
     let temp=(now-that.data.start)/that.data.day
    //  console.log(temp)
     var index=Math.floor(temp)//向下取整
     that.setData({
       index:index
     })
    //  console.log(index)  //当天的索引值
     if(index>=100)
     {
       that.setData({
         start:Date.now()//超过100则以当天为start重新开始计算
       })
     }
  },
})