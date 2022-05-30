const app = getApp()
const db=wx.cloud.database("video")
const _=db.command
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Video_Datas:[],//云数据

    tabList: [
			{ id: 0, typeName: '简介' ,type:'introduce'},
      { id: 1, typeName: '评论' ,type:'comment'},
      
    ],
    classify:'introduce', 
    activeIndex: 0,
    
    giftimage:"/images/other/gif1.png",
    collectimage:"/images/other/collect1.png",
    likeimage:"/images/zan.png",
    commentimage:"/images/other/comment.png",
    transimage:"/images/other/share.png",
    itemList:['默认'],
    like_arr:0
  },

  handleTabChange (e) {
    this.setData({ 
      list02: [],
      activeIndex:e.currentTarget.dataset.index,
      classify:this.data.tabList[e.currentTarget.dataset.index].type,
      created_selectedFlag:false,
      default_selectedFlag:false
    })
    const index = +e.currentTarget.dataset.index;
    this.triggerEvent('TabChange', index);
    if(that.data.classify=='comment'){
      that.get_note_people(that.data.Video_Datas)
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  get_note_people:function(res){
    var openid = []
    for(var i = 0;i<res.length;i++){
      openid.push(res[i]._openid)
    for(var j = 0;j<res[i].comment_people.length;j++){
      openid.push(res[i].comment_people[j].openid)
    }
    }
    db.collection("people").where({
      _openid:_.in(openid)
    }).get({
      success:function(res){
        that.setData({
            Note_People:res.data
        })
        console.log(res)
      }
    })
  },
  get_people:function(){
    wx.cloud.callFunction({
      name:'change',
      success:function(res){
        db.collection('people').where({
          _openid:res.result.openid
        }).get()
        .then(res=>{
          console.log(res.data[0])
          that.setData({
            People:res.data[0]
          })
          app.globalData.nickName = res.data[0].name
          app.globalData.avatarUrl = res.data[0].avatarUrl
          app.globalData.star = res.data[0].star
          app.globalData.followed_people = res.data[0].followed_people
          app.globalData.openid = res.data[0]._openid
          app.globalData.People = res.data[0]
          for(var i = 0;i<app.globalData.star.length;i++){
            if(app.globalData.star[i].type=="topic"){
              that.data.itemList.push(app.globalData.star[i].name)
              that.setData({
                itemList:that.data.itemList
              })
            }
          }
          
        })
      }
    })
    },
  onLoad: function (options) {
    that=this
    var data = JSON.parse(decodeURIComponent(options.Data))
   db.collection("video").doc(data._id).get().then(res=>{
     that.data.Video_Datas.push(res.data)
     that.setData({
      Video_Datas:that.data.Video_Datas
    })
    that.get_people()
    that.get_note_people(res.data)
   })

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
  like_click:function(e){
    var judge = that.data.Video_Datas[0].like_people.indexOf(that.data.People._openid)
    if(judge==-1){
      that.data.like_arr= 1
      that.data.Video_Datas[0].like_people.push(that.data.People._openid)
      that.setData({
        Video_Datas:that.data.Video_Datas
      })
    }else{
      that.data.like_arr= -1 
      that.data.Video_Datas[0].like_people.splice(judge,1)
      that.setData({
        Video_Datas:that.data.Video_Datas
      })
    }

  },
  showInput: function() {
    this.setData({
      showInput: true
    })
  },
  onHideInput: function(e) {
    this.setData({
      showInput: false
    })
  },
  bindInputMsg:function(e){
    that.setData({
      Comment:e.detail.value
    })
  },
  sendTextMsg:function(e){
    if(that.data.Comment!=""){
      var comment = {
        "comment_content":that.data.Comment,
        "comment_date":Date.parse(new Date()),
        "like_people":[],
        "openid":app.globalData.People._openid
      }
      that.data.Video_Datas[0].comment_people.push(comment)
      that.setData({
        Video_Datas:that.data.Video_Datas
      })
   that.showToast('评论成功','success')
    }else{
      wx.showToast({
        title: '输入不能为空哦',
        icon:'none'
      })
    }
  },
  showToast:function(title,type){
    wx.showToast({
      title:title,
      icon:type,
      duration:500
    })
  },
})