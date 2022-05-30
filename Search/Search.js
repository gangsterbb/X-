var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {

    length:[],
    inputdetail:"",//输入搜索框的信息
    searchdata:{},//搜索到的信息
    searchdata1:{},//搜索到的信息
    searchLength:0,//搜索到的数量
    searchLength1:0,
    searchLength2:0,
    searchLength3:0,
    searchdata2:{},//搜索到的信息  
    searchvalue:'',//搜索词
    past_record:[],//历史记录
    isClear:false,
    investigation:[],
    temprecord:'',//暂存记录
    collection:'text',
    way:"hot",//默认排序为热门排序
    poem_content:[],
    poem_content_1:[],
    poem_content_2:[[]],
    Note_People:[],
    
  },
  onLoad:function(){
    that = this
    this.changetitle();
    this.get_recording();
    this.search_found();
  },
  search_found(){
  const db = wx.cloud.database()
  db.collection('text')
  .aggregate()
  .sample({
    size:6
  })
  .group({
    _id:{},
    title:db.command.aggregate.addToSet('$title')
  })
  .end({
    success (res){
      that.setData({
        investigation:res.list[0].title
      })

    }
  })
},
  changetitle:function(e){
    this.setData({
      isDisabled:false,
      default_title:"",
      default_focus:true//自动聚焦
    })
  },
  //删除历史记录
  delete_record:function(){
    wx.showModal({
      cancelColor: '#000000',
      title:'确定要清除历史记录吗',
      success:(res)=>{
        if(res.confirm)
        {
          that.setData({
            past_record:[]
          })
          wx.removeStorage({
            key: 'tempp',
          })
        }
      }
    })
  },

  //删除特定记录
  delete_one_record:function(e){
    let temprecord = this.data.past_record;//暂时存储past_record
    temprecord.splice(e.currentTarget.dataset.recorditem,1)//代替temprecord分开，获取分开后剩下的
    that.setData({
      past_record:temprecord
    })
    wx.setStorage({
      data: this.data.past_record,
      key: 'tempp',
  })
  },

  //点击记录，添加到搜索框
  join_one_record:function(e){
    this.setData({
      default_title:this.data.past_record[e.currentTarget.dataset.recorditem],
      temprecord:this.data.past_record[e.currentTarget.dataset.recorditem],
      inputdetail:this.data.past_record[e.currentTarget.dataset.recorditem]
    })
  },
//添加历史记录本地缓存
  add_recording(){
    if(this.data.past_record==[]){
      let tempp = this.data.past_record;
            tempp.push(this.data.temprecord)
            this.setData({
              past_record:tempp
            })
            wx.setStorage({
            data: tempp,
            key: 'tempp',
            })
    }else{
       if(this.data.past_record.includes(this.data.temprecord)||this.data.temprecord=='')
       {}
        else{
            let tempp = this.data.past_record;
            tempp.push(this.data.temprecord)
            this.setData({
              past_record:tempp
            })
            wx.setStorage({
            data: tempp,
            key: 'tempp',
            })
          }
    }

  },
  //获取
  get_recording(){
    var that = this
    wx.getStorage({
      key: 'tempp',
      success:function(res){
        that.setData({
          past_record:res.data
        })
      }
    })
   
  },

  change_condition:function(){
  this.add_recording()
  if(this.data.inputdetail!="")
  {
    this.show_search(function(){
      that.get_people()

    })
  }

  },
get_people:function(){
  var openid = []
  console.log(that.data.searchdata1)
    for(var j = 0;j<that.data.searchdata1.length;j++){
      openid.push(this.data.searchdata1[j]._openid)
    }    
    console.log(openid)
    var db = wx.cloud.database()
    var _ = db.command
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
  get_record:function(e){  
  this.setData({
    temprecord:e.detail.value,
    inputdetail:e.detail.value
  })
  if(e.detail.value=="")
  {
    this.setData({
      searchLength1:0,
      searchLength2:0,
      searchLength3:0
    })
  }
},
show_search(callback){
  let searchKey = this.data.inputdetail//将输入的值及时传递给搜索功能
  let db=wx.cloud.database()//新建云数据库
  let _=db.command//_为数据库的指令集
  var that = this//重命名this指针，避免与表达式内的this发生冲突
  db.collection('text')//指定数据库集合  是否要写死？？？
.where(_.or([//可增搜索加对象名称
{
  title:db.RegExp({
    regexp:searchKey,//在title中搜索值
    options:'i',
  }),
},
{
  message:db.RegExp({
      regexp:searchKey,//在message中搜索值
      options:'i',
  }),
},
{
  content:db.RegExp({
      regexp:searchKey,//在message中搜索值
      options:'i',
  }),
}
])).get()
.then(res=>{
  var _id = [];
  for(var i = 0;i<res.data.length;i++)
  {
    _id.push(res.data[i]._id)
  }
  this.setData({
    _id:_id
  })

if(that.data.temprecord!='')
{
  var property = "like";
  var self = this;
  var arr = res.data;
  var sortRule = false;
  self.setData({
    arr:arr.sort(self.compare(property,sortRule)),
  })

  this.setData({
    searchdata1:this.data.arr,
    searchLength1:res.data.length,
  })
  this.setData({
    searchdata:this.data.searchdata1,
    searchLength:this.data.searchLength1
  })
  callback()
}
else{
  that.setData({
    searchLength1:0
  })
}

})
.catch(res=>{
  console.log('查询失败',res)
}) 

  db.collection('people').where(_.or([
    {
      name:db.RegExp({
        regexp:this.data.inputdetail,
        option:'i'
      })
    }
  ]))
  .get()
  .then(res=>{
    var property = "like_num";
    var self = this;
    var arr = res.data;
    var sortRule = false;
    self.setData({
      arr:arr.sort(self.compare(property,sortRule)),
    })
  
    this.setData({
      searchdata2:this.data.arr,
      searchLength2:res.data.length,
    })
  })
  db.collection('Poem').where(_.or([
    {
      author:db.RegExp({
        regexp:this.data.inputdetail,
        option:'i'
      })
    },
    {
      title:db.RegExp({
        regexp:this.data.inputdetail,
        option:'i'
      }),

    },
    {
      paragraphs:db.RegExp({
        regexp:this.data.inputdetail,
        option:'i'
      }),
    },
    {
      rhythmic:db.RegExp({
        regexp:this.data.inputdetail,
        option:'i'
      }),
    }
  ]))
  .get()
  .then(res=>{
    this.setData({
      searchdata3:res.data,
      searchLength3:res.data.length,
    })
  })

},
navigatorTo(e){
  if(e.currentTarget.id=="toDetail")//当需要增加要跳转的页面时，在此函数添加判断条件即可
  {
    this.setData({
      naviurl :'../Detail/Detail?_id='+this.data._id[e.currentTarget.dataset.item]+'&note_item='+e.currentTarget.dataset.item
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
compare(property,bol){
  return function(a,b){
    var value1 = a[property];
    var value2 = b[property];
    if(bol){
      return value1 - value2;
    }else {
      return value2 - value1;
    }
  }
},
changeway:function(e){
  this.setData({
    way:e.currentTarget.dataset.way
  })
  if(this.data.way=='hot')
  {
    
    this.setData({
      searchLength:this.data.searchLength1,
      searchdata:this.data.searchdata1,
    })
  }else if(this.data.way=='user'){
    console.log(this.data.way)
    this.setData({
      searchLength:this.data.searchLength2,
      searchdata:this.data.searchdata2,
    })
  }else if(this.data.way=='related'){
    this.setData({
      searchLength:this.data.searchLength3,
      searchdata:this.data.searchdata3,
    })
    for(var i=0;i<this.data.searchdata3.length;i++){ 
      this.setData({
        [`poem_content[${i}]`]:this.data.searchdata3[i].paragraphs
      })
    }
    for(var i=0;i<this.data.poem_content.length;i++){
      this.setData({
        [`poem_content_1[${i}]`]:this.data.poem_content[i][0]
      })
      for(var j=1;j<this.data.poem_content[i].length;j++){
        this.setData({
          [`poem_content_1[${i}]`]:this.data.poem_content_1[i]+this.data.poem_content[i][j]
        })

      }
    }
    for(var i=0;i<this.data.poem_content_1.length;i++){
      this.setData({
        [`poem_content_2[${i}]`]:this.data.poem_content_1[i].split("。")
      })
    }
    
    
    for(var i=0;i<this.data.poem_content_2.length;i++){
      for(var j=0;j<this.data.poem_content_2[i].length;j++){
        if(this.data.poem_content_2[i][j]!=""){
            this.setData({
                [`poem_content_2[${i}][${j}]`]:this.data.poem_content_2[i][j]+"。"
            }) 
        }
        
      }
      
    }

    
     
    
  }
  
  // if(this.data.way=="user"){
  //   let db = wx.cloud.database()
  //   const _ = db.command
  //   db.collection('people').where(_.or([
  //     {
  //       name:db.RegExp({
  //         regexp:this.data.inputdetail,
  //         option:'i'
  //       })
  //     }
  //   ]))
  //   .get()
  //   .then(res=>{
  //     var property = "like_num";
  //     var self = this;
  //     var arr = res.data;
  //     var sortRule = false;
  //     self.setData({
  //       arr:arr.sort(self.compare(property,sortRule)),
  //     })
    
  //     this.setData({
  //       searchdata2:this.data.arr,
  //       searchLength2:res.data.length,
  //     })
  //     console.log(this.data.searchdata2)
  //   })
  // }
},
tap_searchfound(e){
  this.setData({
    default_title:this.data.investigation[e.currentTarget.dataset.item],
    inputdetail:this.data.investigation[e.currentTarget.dataset.item],
    temprecord:this.data.investigation[e.currentTarget.dataset.item]
  })
}
})