var that;
// pages/details/details.js
const app = getApp()
const db=wx.cloud.database("text")
const _=db.command

 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    star_people:[''],
    like_people:[''],
    id:"",
    Data:{},
    comment_people:[],
    comment_people_length:0,
    followflag:0,
    starflag:0,
    likeflag:0,
    tempFilePaths:[],
    showInput:false,
    length:0,
    //默认显示的图标
    followimage:"",
    starimage:"",
    likeimage:"",
    commentimage:"/images/other/comment.png",
    transimage:"/images/other/share.png",
    leftimages:[],
    leftflags:[],
    //每个功能的数量

    openid_2:"",//帖子作者的openid
    openid:"",//正在使用的用户的openid

    //本地数组以及本地数量
    comment_people:[],      //评论内容
    comment:0,               //评论数量
    tran:0,                  //转发数量
    itemList:['默认']

  },
count_empirical_value:function(){         //等级机制  经验值：关注10，收藏3，点赞1，评论2，分享5
  wx.cloud.callFunction({
    name:"change"
  }).then(res=>{
    // console.log(res.result.openid)
    let openid=res.result.openid
    that.setData({
      openid:res.result.openid
    })
    db.collection("people").where({
      _openid:_.eq(openid)
    }).get()
    .then(res=>{
      var followed_people=res.data[0].followed_people.length
      var collect_num=res.data[0].collect_num
      var like_num=res.data[0].like_num
      var comments_num=res.data[0].comments_num
      var share_num=res.data[0].share_num
      var empirical_value=followed_people*10+collect_num*3+like_num*1+comments_num*2+share_num*5
      db.collection("people").where({
        _openid:_.eq(openid)
      }).update({
        data:{
          empirical_value:empirical_value
        }
      }).then(res=>{
        db.collection("people").where({
          _openid:_.eq(openid)
        }).get().then(res=>{
          // console.log(res)
          var empirical_value=res.data[0].empirical_value
          if(empirical_value>=0&&empirical_value<100)
          {
            db.collection("people").where({
              _openid:_.eq(openid)
            }).update({
              data:{
                level:1
              }
            }).then(res=>{
              console.log(res)
            })
             
          }
          else if(empirical_value>=100&&empirical_value<500)
          {
            db.collection("people").where({
              _openid:_.eq(openid)
            }).update({
              data:{
                level:2
              }
            }).then(res=>{
              console.log(res)
            })
          }
          else if(empirical_value>=500&&empirical_value<1000)
          {
            db.collection("people").where({
              _openid:_.eq(openid)
            }).update({
              data:{
                level:3
              }
            }).then(res=>{
              console.log(res)
            })
          }
          else if(empirical_value>=1000&&empirical_value<1800)
          {
            db.collection("people").where({
              _openid:_.eq(openid)
            }).update({
              data:{
                level:4
              }
            }).then(res=>{
              console.log(res)
            })
          }
          else if(empirical_value>=1800&&empirical_value<2500)
          {
            db.collection("people").where({
              _openid:_.eq(openid)
            }).update({
              data:{
                level:5
              }
            }).then(res=>{
              console.log(res)
            })
          }
          else if(empirical_value>=2500&&empirical_value<5000)
          {
            db.collection("people").where({
              _openid:_.eq(openid)
            }).update({
              data:{
                level:6
              }
            }).then(res=>{
              console.log(res)
            })
          }
          else
          {
            db.collection("people").where({
              _openid:_.eq(openid)
            }).update({
              data:{
                level:7
              }
            }).then(res=>{
              console.log(res)
            })
          }
        })
      })
  
    })
  })

 

},

onLoad:function(e){  
  that=this  
  that.setData({
    People:JSON.parse(decodeURIComponent(e.People)),
    people:JSON.parse(decodeURIComponent(e.people)),
    index:e.index,
    like_arr:0,
    star_arr:0,
    tran_arr:0,
    left_arr:[],
    Note_People:JSON.parse(decodeURIComponent(e.Note_People)),
    Data:JSON.parse(decodeURIComponent(e.Data))
    })
  that.setData({
    openid:that.data.People._openid
  })

  for(var i = 0;i<app.globalData.star.length;i++){
    if(app.globalData.star[i].type=="topic"){
      that.data.itemList.push(app.globalData.star[i].name)
      that.setData({
        itemList:that.data.itemList
      })
    }
  }
  wx.cloud.callFunction({
    name:"change"
  }).then(res=>{
    that.data.id=e.id
    db.collection("text").where({
      _id:e.id
    }).get().then(res=>{
      that.setData({
        // Data:res.data[0],
        _id:e.id
      })
    })
  })
 
 
  },
  //更新评论数据
  judge_left_statement:function(judge_type,judge_arr,i){
    //判断模块
    if(judge_arr[i] ==1){
      if(judge_type.indexOf(that.data.openid)==-1){
        judge_type.push(that.data.openid)
      }else{
      }
    }else if(judge_arr[i] ==-1){
      var judge = judge_type.indexOf(that.data.openid)
      if(judge==-1){
      }else{
  
        judge_type.splice(judge,1)
      }
    }
    return judge_type
  },
  judge_statement:function(judge_type,judge_arr){
    //判断模块
    if(judge_arr ==1){
      if(judge_type.indexOf(that.data.openid)==-1){
        judge_type.push(that.data.openid)
      }else{
      }
    }else if(judge_arr ==-1){
      var judge = judge_type.indexOf(that.data.openid)
      if(judge==-1){
      }else{
        judge_type.splice(judge,1)
      }
    }
    return judge_type
  },
  like_click:function(e){
    var judge = that.data.Data.like_people.indexOf(that.data.openid)
    if(judge==-1){
      that.data.like_arr= 1
      that.showToast('点赞成功','success')
      that.data.Data.like_people.push(that.data.openid)
      that.setData({
        Data:that.data.Data
      })
    }else{
      that.data.like_arr= -1 
      that.showToast('取消点赞','none')

      that.data.Data.like_people.splice(judge,1)
      that.setData({
        Data:that.data.Data
      })
    }

  },

  star_click:function(e){
 //判断数据库中是否有该用户的openid
 var judge = that.data.Data.star_people.indexOf(that.data.openid)
 //如果没有，进入选择收藏夹项
 if(judge==-1){
   that.onPickerChange()
 }else{
   //如果有，同时从笔记数组和用户数组中删除
   var index1 = that.data.People.star_circle.indexOf(that.data.Data._id)
   if(index1>-1){that.data.People.star_circle.splice(index1,1)}
   for(var i = 0;i<that.data.People.star.length;i++){
     if(that.data.People.star[i].type=="topic"){
       var index =that.data.People.star[i].star_link.indexOf(that.data.Data._id) 
       if(index>-1){
         var k = that.data.People.star[i].star_link.splice(index,1)
       }
     }
   }
  that.data.Data.star_people.splice(judge,1)
  that.showToast('取消收藏','none')
   that.data.star_arr = -1;
   that.setData({
     Data:that.data.Data,
     People:that.data.People
   })
 }

  },
  onPickerChange:function(res){
    if(res.detail.value==0){
      that.data.People.star_circle.push(that.data.Data._id)
      that.setData({
        People:that.data.People
      })
    }else{
      for(var i = 0;i<app.globalData.star.length;i++){
        if(app.globalData.star[i].name==that.data.itemList[res.detail.value]){
          app.globalData.star[i].star_link.push(that.data.Data._id)
        }
      }
    }
    that.data.Data.star_people.push(that.data.openid)
    that.data.Data.star_arr = 1;
    that.showToast('收藏成功','success')
    that.setData({
      Data:that.data.Data
    })
  },

  left_click:function(e){
    var judge = that.data.Data.comment_people[e.currentTarget.dataset.index].like_people.indexOf(that.data.openid)
    if(judge==-1){
      that.data.Data.comment_people[e.currentTarget.dataset.index].like_people.push(that.data.openid)
      that.data.left_arr[e.currentTarget.dataset.index] = 1
      that.setData({
        Data:that.data.Data
      })
    }else{
    that.data.Data.comment_people[e.currentTarget.dataset.index].like_people.splice(judge,1)
      that.data.left_arr[e.currentTarget.dataset.index] = -1
      that.setData({
        Data:that.data.Data,
      })
    }
  },
  // 预览图片
  previewimage:function(e){
    console.log(e)
    wx.previewImage({
      urls: this.data.Data.contentimage, // 需要预览的图片http链接列表
      current: this.data.Data.contentimage[e.currentTarget.dataset.current_item],
      success:(res)=>{
      }
    })
  }, 
  //键盘函数
  //控制是否显示键盘
  showInput: function() {
    console.log("键盘输出")
    this.setData({
      showInput: true
    })
  },
  update_text:function(){

      db.collection('text').doc(that.data.Data._id).update({
        data:{
          like_people:that.data.Data.like_people,
          star_people:that.data.Data.star_people,
          comment_people:that.data.Data.comment_people,
          tran_people:that.data.Data.tran_people,
          followed_people:that.data.Data.followed_people,
        }
      })
      .then(res=>{
      })
    
  },
  //更新用户状态
  update_people:function(){
    db.collection('people').doc(that.data.People._id)
    .update({
      data:{
        star_circle:that.data.People.star_circle,
        star:app.globalData.star,
        follow_people:that.data.People.follow_people,
        followed_people:that.data.People.followed_people,

      }
    }).then(res=>{

    })
  },
  onUnload:function(){
    let pages = getCurrentPages()   // 获取当前的页面
    let prevPage = pages[pages.length - 2]
    prevPage.setData({    
    value: [that.data.Data,that.data.People,that.data.index]   // 需要传递的值
    })
    wx.navigateBack({
    delta: 1      // 返回到上一级
    })
    this.update_text()
    this.update_people()
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
        "openid":that.data.openid
      }
      that.data.Data.comment_people.push(comment)
      that.setData({
        Data:that.data.Data
      })
   that.showToast('评论成功','success')
    }else{
      wx.showToast({
        title: '输入不能为空哦',
        icon:'none'
      })
    }



  },
  onShareAppMessage:function(){
    var shareObj = {
      title:'方舟诗词'
    }
    that.data.Data.tran_people.push(that.data.openid)
    that.setData({
      Data:that.data.Data
    })
    return shareObj
  },
  onHide:function(){
    that.update_people()
    that.update_text()
  },
  array_combination:function(json1,json2){
    let json = json1.concat(json2); //两个数组对象合并
    let newJson = []; //盛放去重后数据的新数组
    for(var i = 0;i<json.length;i++){
      let flag = true;
      for(var j = 0;j<newJson.length;j++){
        if(json[i].comment_date==newJson[j].comment_date){
          flag=false;
        }
      }
      if(flag){
        newJson.push(json[i])
      }
    }
    return newJson
    },
  update_text:function(){
    db.collection('text').where({
      _id:that.data.Data._id
    }).get({
      success:function(res){
        that.setData({
          temp:res.data[0]
        })
          that.judge_statement(that.data.temp.like_people,that.data.like_arr)
          that.judge_statement(that.data.temp.star_people,that.data.star_arr)
          that.data.temp.comment_people = that.array_combination(that.data.temp.comment_people,that.data.Data.comment_people)
          for(var i = 0;i<that.data.Data.comment_people.length;i++){
            that.judge_left_statement(that.data.temp.comment_people[i].like_people,that.data.left_arr,i)
          }
          that.data.temp.tran_people = Array.from (new Set(that.data.temp.tran_people.concat(that.data.Data.tran_people)))
          db.collection('text').where({
            _id:that.data.temp._id
          }).update({
            data:{
              like_people:that.data.temp.like_people,
              star_people:that.data.temp.star_people,
              comment_people:that.data.temp.comment_people,
              tran_people:that.data.temp.tran_people
            }
          }).then(res=>{
          }).catch(err=>{
            console.log(err)
          })
        
 

      }

    })
  },
  update_people:function(){
    db.collection('people').doc(that.data.People._id)
    .update({
      data:{
        star_circle:that.data.People.star_circle,
        follow_people:that.data.People.follow_people,
        followed_people:that.data.People.followed_people,
        avatarUrl:that.data.People.avatarUrl,
        currency:that.data.People.currency,
        empirical_value:that.data.People.empirical_value,
        name:that.data.People.name,
        personal_sign:that.data.People.personal_sign,
        spot:that.data.People.spot,
        star:that.data.People.star,
        works:that.data.People.works
      }
    }).then(res=>{

    })
  },
  showToast:function(title,type){
    wx.showToast({
      title:title,
      icon:type,
      duration:500
    })
  },
})
