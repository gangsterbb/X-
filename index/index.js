const app = getApp()
const db=wx.cloud.database("text")
const _=db.command
var that;
Page({ 
  data: {
    naviurl:null,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    tabList: [
			{ id: 0, typeName: '社区' },
			{ id: 1, typeName: '关注' },
		],
		activeIndex: 0,
    toViewComment: '',
    //以下为社区数据
    //判断图标状态
    leftflag:[],
    //默认显示的图标
    commentimage:"/images/other/comment.png",
    transimage:"/images/other/share.png",
    leftimage:[],
    //每个功能的数量
    openid_2:[],//帖子作者的openid
    openid:"",//正在使用的用户的openid
    CloudDatas:[],//云数据
    FollowCloudDatas:[],//关注的人的数据
    CloudDataslength:0,//数据长度
    //以下为关注页数据
    //判断图标状态
    followflag2:[],
    starflag2:[],
    likeflag2:[],
    leftflag2:[],
    length2:0,
    //默认显示的图标
    followimage2:[],
    starimage2:[],
    likeimage2:[],
    commentimage:"/images/other/comment.png",
    transimage:"/images/other/share.png",
    leftimage2:[],
    //每个功能的数量
    openid_2_2:[],//帖子作者的openid
    openid:"",//正在使用的用户的openid
    FollowCloudDatas:[],//关注的人的数据
    CloudDataslength:0,//数据长度
    itemList:[['默认','图片','视频','文字','话题'],['默认']],

    People:{},
    animateClass:['','','','','','','',''],
    

  },
  bindMultiPickerColumnChange:function(e){
    var type = ['default','photo','video','word','topic']
    if(e.detail.column==0){
      that.data.itemList[1] = ['默认']
      for(var i = 0;i<app.globalData.star.length;i++){
        if(app.globalData.star[i].type==type[e.detail.value]){
          that.data.itemList[1].push(app.globalData.star[i].name)
          that.setData({
            itemList:that.data.itemList
          })
        }
      }
    }

  },
    // 导航栏动画 
    onClickAnimateEvent (e) { 
          var index=e.currentTarget.dataset.index_1
          this.setData({
            [`animateClass[${index}]`]: '',         
          });
          this.setData({
            [`animateClass[${index}]`]: e.currentTarget.dataset.class,
          }); 
    },
    // 改变被选中元素的状态（样式）
    handleTabChange (e) {
      this.setData({
        activeIndex:e.currentTarget.dataset.index
      })
      const index = +e.currentTarget.dataset.index;
      this.triggerEvent('TabChange', index);
      if(e.currentTarget.dataset.index==1){
        that.get_attention_note()
      }else if(e.currentTarget.dataset.index==0){
        that.get_note("text",function(){
          if(that.returnPage()){
          }else{
            that.get_people();
            that.setData({
              temp:[],
              like_arr:[],
              star_arr:[],
              left_arr:[]
            })
          }
        });
      }
      that.update_text()
      that.update_people()
    },
  onReady:function(){
    this.get_openid();
  },
  update_text:function(){
    var ids = []
    for(var j = 0;j<that.data.CloudDatas.length;j++){
      ids.push(that.data.CloudDatas[j]._id)
    }
    db.collection('text').where({
      _id:_.in(ids)
    }).get({
      success:function(res){
        that.setData({
          temp:[]
        })
        for(var i = 0;i<ids.length;i++){
          for(var j = 0;j<res.data.length;j++){
            if(ids[i]==res.data[j]._id){
              if(JSON.stringify(that.data.temp).indexOf(JSON.stringify(res.data[j]))==-1){
                that.data.temp.push(res.data[j])
              }
            }
          }
        }
        for(var o = 0;o<that.data.temp.length;o++){
          that.judge_statement(that.data.temp[o].like_people,that.data.like_arr,o)
          that.judge_statement(that.data.temp[o].star_people,that.data.star_arr,o)
          that.data.temp[o].comment_people = that.array_combination(that.data.temp[o].comment_people,that.data.CloudDatas[o].comment_people)
          that.data.temp[o].tran_people = Array.from (new Set(that.data.temp[o].tran_people.concat(that.data.CloudDatas[o].tran_people)))
          for(var i = 0;i<that.data.temp[o].comment_people.length;i++){
            if(that.data.temp[o].comment_people[i].comment_date==that.data.CloudDatas[o].comment_people[0].comment_date){
              that.judge_statement(that.data.temp[o].comment_people[i].like_people,that.data.left_arr,o)
            }
          }
        }
        for(var o = 0;o<that.data.temp.length;o++){
          db.collection('text').where({
            _id:that.data.temp[o]._id
          }).update({
            data:{
              like_people:that.data.temp[o].like_people,
              star_people:that.data.temp[o].star_people,
              comment_people:that.data.temp[o].comment_people,
              tran_people:that.data.temp[o].tran_people
            }
          }).then(res=>{
          }).catch(err=>{
            console.log(err)
          })
        }


      }

    })
  },
  //更新用户状态
  update_people:function(){
    that.data.People.empirical_value = that.count_empirial()
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
        star:app.globalData.star,
        works:app.globalData.People.works,
        like_note:that.data.People.like_note,
        star_note:that.data.People.star_note,
        comment_note:that.data.People.comment_note,
        tran_note:that.data.People.tran_note,
      }
    }).then(res=>{
      console.log(res)
    })
  },
get_update_text:function() {
  var ids=[];
    for(var i = 0;i<1;i++){
      var arr1 = that.data.CloudDatas[i].like_people
      var arr2 = that.data.CloudDatas[i].like_people
      db.collection('text').doc(that.data.CloudDatas[i]._id).update({
        data:{
          like:that.data.CloudDatas[i].like,
          like_people:that.data.CloudDatas[i].like_people,
          star_people:that.data.CloudDatas[i].star_people,
          comment_people:that.data.CloudDatas[i].comment_people,
          followed_people:that.data.CloudDatas[i].followed_people,
          tran_people:that.data.CloudDatas[i].tran_people
        }
      })
      .then(res=>{
      })
    }
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
judge_statement:function(judge_type,judge_arr,i){
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
  onHide:function(){  
    that.update_text()
    that.update_people()
    that.setData({
      activeIndex:0
    })
  },
  //获取openid的函数
  get_openid:function(){
    wx.cloud.callFunction({
        name:'change',
        success:function(res){
          that.setData({
            openid:res.result.openid
          })
        }

    })
  },
get_note:function(x,callback){
  db.collection('text').get()
  .then(res=>{
    console.log(res)
    that.setData({
      CloudDatas:res.data
    })

 

    var like_arr = []
    var star_arr = [] 
    var openid = []
    var Comment_people = []
    for(var i = 0;i<res.data.length;i++){
      like_arr[i] = 0
      star_arr[i] = 0
      openid.push(res.data[i]._openid)
    for(var j = 0;j<res.data[i].comment_people.length;j++){
      openid.push(res.data[i].comment_people[j].openid)
    }
    }
    db.collection("people").where({
      _openid:_.in(openid)
    }).get({
      success:function(res){
      callback()
        that.setData({
            Note_People:res.data
        })
      }
    })
    that.setData({
      like_arr:like_arr,
      star_arr:star_arr
    })
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
      that.setData({
        People:res.data[0]
      })
      app.globalData.level = res.data[0].level
      app.globalData.nickName = res.data[0].name
      app.globalData.avatarUrl = res.data[0].avatarUrl
      app.globalData.star = res.data[0].star
      app.globalData.followed_people = res.data[0].followed_people
      app.globalData.openid = res.data[0]._openid
      app.globalData.People = res.data[0]
      wx.request({
        url: 'http://127.0.0.1:81/Recommend', //仅为示例，并非真实的接口地址
        data: {
          like_note:that.data.People.like_note,
          star_note:that.data.People.star_note,
          follow_note:that.data.People.follow_note,
          comment_note:that.data.People.comment_note,
          tran_note:that.data.People.tran_note,
          id:app.globalData.openid
        },
        method:'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res.data)
        }
      })
      
      

    })
  }
})
},
  onLoad:  function(options){
    that = this;
    // wx.serviceMarket.invokeService({
    //   service: 'wxcae50ba710ca29d3', // 'wx_mp_appid',
    //   api: 'goodinfo',
    //   data: {
    //     "q": "微信开发者工具", //需要进行商品关键词识别的语句
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

    // const res = await wx.cloud.callContainer({
    //   config: {
    //     env: "prod-0g1po8nufd04aa1f", // 微信云托管环境ID，不能为空，替换自己的
    //   },
    //   path: '/', 
    //   method: 'POST',
    //   data:{
    //     username:"a"
    //   },
    //   header: {
    //     'X-WX-SERVICE': 'demo',
    //   },
    // });
    // console.log(res); // 在控制台里查看打印
  },
  star_click:function(e){
    //判断数据库中是否有该用户的openid
    var judge = that.data.CloudDatas[e.currentTarget.dataset.index].star_people.indexOf(that.data.openid)
    
    //如果没有，进入选择收藏夹项
    if(judge==-1){
      that.onPickerChange()
    }else{
      that.showToast("取消收藏",'none')
      //如果有，同时从笔记数组和用户数组中删除
      var index1 = that.data.People.star_circle.indexOf(that.data.CloudDatas[e.currentTarget.dataset.index]._id)
      if(index1>-1){that.data.People.star_circle.splice(index1,1)}
      for(var i = 0;i<that.data.People.star.length;i++){
        if(that.data.People.star[i].type==e.currentTarget.dataset.type){
          var index =that.data.People.star[i].star_link.indexOf(that.data.CloudDatas[e.currentTarget.dataset.index]._id) 
          if(index>-1){
            var k = that.data.People.star[i].star_link.splice(index,1)
          }
        }
      }
     that.data.CloudDatas[e.currentTarget.dataset.index].star_people.splice(judge,1)
      that.data.star_arr[e.currentTarget.dataset.index] = -1;
      that.setData({
        CloudDatas:that.data.CloudDatas,
        People:that.data.People
      })
    }

  },
  //点赞
  like_click:function(e){
    var judge = that.data.CloudDatas[e.currentTarget.dataset.index].like_people.indexOf(that.data.openid)
    if(judge==-1){
      that.judge_indexof(that.data.People.like_note,that.data.CloudDatas[e.currentTarget.dataset.index]._id)
      that.data.like_arr[e.currentTarget.dataset.index] = 1
      that.showToast("点赞成功",'success')
      that.data.CloudDatas[e.currentTarget.dataset.index].like_people.push(that.data.openid)
      that.setData({
        CloudDatas:that.data.CloudDatas
      })
    }else{
      that.data.like_arr[e.currentTarget.dataset.index] = -1 
      that.showToast("取消点赞",'none')
      that.data.CloudDatas[e.currentTarget.dataset.index].like_people.splice(judge,1)
      that.setData({
        CloudDatas:that.data.CloudDatas
      })
    }

  },
  follow_click:function(e){
    db.collection('people').where({
      _openid:that.data.CloudDatas[e.currentTarget.dataset.index]._openid
    }).get()
    .then(res=>{
      var People2 = res.data[0]
      var judge = that.data.People.follow_people.indexOf(People2._openid)
      if(judge==-1){
        console.log("herer")
        that.showToast("关注成功",'success')
        that.data.People.follow_people.push(People2._openid)
        People2.followed_people.push(that.data.openid)
        that.setData({
          CloudDatas:that.data.CloudDatas,
          People:that.data.People
        })
      }else{
        that.showToast("取消关注",'none')
        var judge2 = People2.followed_people.indexOf(that.data.openid)
       that.data.People.follow_people.splice(judge,1)
       People2.followed_people.splice(judge2,1)
       console.log(that.data.People.follow_people)
        that.setData({
          CloudDatas:that.data.CloudDatas,
          People:that.data.People
        })
      }
      db.collection('people').doc(People2._id).update({
        data:{
          followed_people:People2.followed_people
        }
      }).then(res=>{})
    })
   
  },
  left_click:function(e){
    that.special_comment(that.data.CloudDatas[e.currentTarget.dataset.index].comment_people)
    that.setData({
      CloudDatas:that.data.CloudDatas,
    })
    that.change_left_like(e)
  },
  change_left_like:function(e){
    var judge = that.data.CloudDatas[e.currentTarget.dataset.index].comment_people[0].like_people.indexOf(that.data.openid)
    if(judge==-1){
      that.showToast("点赞成功",'success')
      that.data.left_arr[e.currentTarget.dataset.index] = 1
      that.data.CloudDatas[e.currentTarget.dataset.index].comment_people[0].like_people.push(that.data.openid)
      that.setData({
        CloudDatas:that.data.CloudDatas
      })
    }else{
      that.showToast("取消点赞",'none')
     that.data.CloudDatas[e.currentTarget.dataset.index].comment_people[0].like_people.splice(judge,1)
     that.data.left_arr[e.currentTarget.dataset.index] = -1
     that.setData({
        CloudDatas:that.data.CloudDatas
      })
    }
  },
  special_comment: function(lists){
    var list = lists
    for(var j = 0 ; j < list.length; j++){
      for(var k = 0 ; k < list.length-1-j ; k++){
        if (list[k].like_num <= list[k+1].like_num){
          var temp = list[k];
          list[k] = list[k + 1];
          list[k + 1] = temp;
        }
      }
    }
    return list[0]
  },
  comment_click:function(e){
    wx.showModal({
      title:'请发表友善的评论哦~',
      cancelColor: 'cancelColor',
      editable:true,
      icon:'none',
      success:function(res){
        if(res.confirm){
          if(res.content==""){
            wx.showToast({
              title: '输入不能为空哦',
              icon:'none'
            })
          }else{
            that.judge_indexof(that.data.People.comment_note,that.data.CloudDatas[e.currentTarget.dataset.index]._id)
            that.showToast("评论成功",'success')
            var comment = {
              "comment_content":res.content,
              "comment_date":Date.parse(new Date()),
              "index":that.data.CloudDatas[e.currentTarget.dataset.index].comment_people.length+1,
              "openid":that.data.openid,
              "like_people":[]
                        }
             that.data.CloudDatas[e.currentTarget.dataset.index].comment_people.push(comment)         
            that.setData({
              CloudDatas:that.data.CloudDatas
            })
          }


        }else{
          that.showToast("取消评论",'none')
        }
      }

    })
  },
  navigatorTo(e){
    let People = encodeURIComponent(JSON.stringify(that.data.People))
    let people = {}
    for(var i = 0;i<that.data.Note_People.length;i++){
      if(that.data.Note_People[i]._openid==that.data.CloudDatas[e.currentTarget.dataset.index]._openid){
        people =  encodeURIComponent(JSON.stringify(that.data.Note_People[i]))
      }
    }
    if(e.currentTarget.dataset.rout=="detail"){
    let Note_People =  encodeURIComponent(JSON.stringify(that.data.Note_People))
      this.setData({
        naviurl:'../'+e.currentTarget.dataset.rout+'/'+e.currentTarget.dataset.rout+"?id="+that.data.CloudDatas[e.currentTarget.dataset.index]._id+"&People="+People+"&index="+e.currentTarget.dataset.index+"&people="+people+"&Note_People="+Note_People+"&Data="+encodeURIComponent(JSON.stringify(that.data.CloudDatas[e.currentTarget.dataset.index]))
      })
    }
    else{
      this.setData({
        naviurl:'../'+e.currentTarget.dataset.rout+'/'+e.currentTarget.dataset.rout+"?id="+that.data.CloudDatas[e.currentTarget.dataset.index]._id+"&People="+People+"&index="+e.currentTarget.dataset.index+"&people="+JSON.parse(decodeURIComponent(people))._openid
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
  navigatorTo2(e){
    this.setData({
      naviurl:'../'+e.currentTarget.dataset.rout+'/'+e.currentTarget.dataset.rout
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

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      that.data.CloudDatas[res.target.dataset.index].tran_people.push(that.data.openid);
      that.setData({
        CloudDatas:that.data.CloudDatas
      })

    }
    return {
      title: '方舟诗词',
      success: function(res) {
        // 转发成功
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //页面显示时调用的函数，与页面加载区分
  onShow: async function(){
    wx.loadFontFace({
      family: 'family',
      source: 'url("https://fonttype.oss-cn-guangzhou.aliyuncs.com/fontTest.ttf")',
    })
    that.get_note("text",function(){
      if(that.returnPage()){
      }else{
        that.get_people();
        that.setData({
          temp:[],
          like_arr:[],
          star_arr:[],
          Note_People:[],
          left_arr:[]
        })
      }
    });
   
    

  },
  //从详情页返回的数据传递
  returnPage:function(){
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1]
    let value = currPage.data.value || ''
    if(value!=''){
      that.data.CloudDatas[value[2]] = value[0]
      that.setData({
        CloudDatas:that.data.CloudDatas,
        People:value[1]
      })
      return true
    }
    return false
  },
  //选择收藏夹
  onPickerChange:function(res){
    console.log(res.detail.value[0])
    console.log(res.detail.value[1])
    if(res.detail.value!=undefined){
      that.judge_indexof(that.data.People.star_note,that.data.CloudDatas[res.currentTarget.dataset.index]._id)
      if(res.detail.value==0){
        that.data.People.star_circle.push(that.data.CloudDatas[res.currentTarget.dataset.index]._id)
        that.setData({
          People:that.data.People
        })
      }else{
        var type = ['default','photo','video','word','topic'] 
        for(var i = 0;i<app.globalData.star.length;i++){
          if(app.globalData.star[i].type==type[res.detail.value[0]]){
            if(app.globalData.star[i].name==that.data.itemList[1][res.detail.value[1]]){
              app.globalData.star[i].star_link.push(that.data.CloudDatas[res.currentTarget.dataset.index]._id)
            }
          }
        }

      }
      that.data.CloudDatas[res.currentTarget.dataset.index].star_people.push(that.data.openid)
      that.data.star_arr[res.currentTarget.dataset.index] = 1;
      that.showToast("收藏成功",'success')
      that.setData({
        CloudDatas:that.data.CloudDatas
      })
    }
  
  },
  get_attention_note:function(){
    db.collection('text').where({
      _openid:_.in(that.data.People.follow_people)
    }).get({
      success:function(res){
        console.log(res)
        that.setData({
          CloudDatas:res.data,
          temp:[],
          like_arr:[],
          star_arr:[],
          Note_People:[],
          left_arr:[]
        })
        var like_arr = []
        var star_arr = [] 
        var openid = []
        for(var i = 0;i<res.data.length;i++){
          like_arr[i] = 0
          star_arr[i] = 0
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
        that.setData({
          like_arr:like_arr,
          star_arr:star_arr
        })
      }
    })

  },
  showToast:function(title,type){
    wx.showToast({
      title:title,
      icon:type,
      duration:500
    })
  },
  //用于判断用户是否添加过该笔记，若添加过不重复添加
  judge_indexof:function(array,id){
    var judge = array.indexOf(id)
    if(judge==-1){
      array.push(id)
      console.log(array)
    }else{

    }
  },
  //计算等级
  count_empirial:function(){
    var like = that.data.People.like_note.length
    var star = that.data.People.star_note.length
    var comment = that.data.People.comment_note.length
    var tran = that.data.People.tran_note.length
    var spot = that.data.People.spot.length
    var empirical_value = like*0.1+star*0.5+comment*0.5+tran*0.5+spot*5
    return empirical_value 
  },
  empirical_to_level:function(empirical_value){
    
    if(empirical_value<=20){
      return 1;
    }else if(empirical_value>20&&empirical_value<=100){
      return 2;
    }else if(empirical_value>100&&empirical_value<=500){
      return 3;
    }else if(empirical_value>500&&empirical_value<=2000){
      return 4;
    }else{
      return 5;
    }
  },

})
