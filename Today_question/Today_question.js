// pages/Today_question/Today_question.js
const db=wx.cloud.database("Songci")
const _=db.command
Page({
  /** 
   * 页面的初始数据
   */
  data: {
    show_toast:0,
    toast_img:'../../images/other/true.png',
    toast_content:'回答正确',
    show_poem:0,
    show_no:0,
    openid:"",
    flag:1,//判断用户还能不能玩，0表示不能玩，1表示能玩
    index:0,
    day:86400000,//单位是毫秒
    start:1651420800000,//5月2号00；00；00的时间戳，单位是毫秒\
    sentence:"",
    answerNo:0,
    answer:[
      {
        index:"A",
        id:0,
        author:"",
        rhythmic:"",
      },
      {
        index:"B",
        id:1,
        author:"",
        rhythmic:"",
      },
     {
        index:"C",
        id:2,
        author:"",
        rhythmic:"",
      },
     {
        index:"D",
        id:3,
        author:"",
        rhythmic:"",
      }
    ],
    rhythmic:"",
    poem:[],
    author:"",
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options){
    let that=this
    //拿用户openid
    wx.cloud.callFunction({
      name:"change"
    }).then(res=>{
      // console.log(res.result.openid)
      let openid=res.result.openid
      that.setData({
        openid:openid
      })
          //计算当天的索引值

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
    db.collection("Songci").where({
      index:_.eq(index)
    }).get().then(res=>{
      // console.log(res.data[0])
      that.data.poem=res.data[0].paragraphs
      that.data.rhythmic=res.data[0].rhythmic
      that.data.author=res.data[0].author
      console.log(that.data.poem)
      console.log(that.data.rhythmic)
      console.log(that.data.author)
      that.setData({
        poem:that.data.poem,
        rhythmic:that.data.rhythmic,
        author:that.data.author
      })
      let today=res.data[0]
      let playeduser=res.data[0].played
     //  console.log(playeduser)
     //拿已经玩过的用户的openid数组
      for(let i=0;i<playeduser.length;i++)
      {
        // console.log(playeduser[i])
        // console.log(that.data.openid)
       //  console.log(2)
     if(that.data.openid==playeduser)
    {
      that.setData({
        flag:0
      })
    }
      }
     //  console.log(today)
      //决定句子
     //  console.log(res.data[0].paragraphs)
      let length=res.data[0].paragraphs.length
     //  console.log(length)
      var random =Math.floor(Math.random()*(length))//生成0到诗词长度-1之间的随机数
     //  console.log(random)
      that.setData({
        sentence:res.data[0].paragraphs[random]
      })
      //决定正确答案放在哪个选项
      var answerNo =Math.floor(Math.random()*(4))
      that.setData({
        answerNo:answerNo
      })
     //  console.log(answerNo)//正确答案编号
      //拿明天、后天以及大后天的诗词作为其他答案
 
      //明天的
      db.collection("Songci").where({
        index:_.eq(index+1)
      }).get().then(res=>
       {
         // console.log(res.data[0])
         let tomorrow=res.data[0]
         // console.log(tomorrow)
         
         //后天
         db.collection("Songci").where({
           index:_.eq(index+2)
         }).get().then(res=>
          {
            // console.log(res.data[0])
            let houtian=res.data[0]
           //  console.log(houtian)
 
            //大后天
            db.collection("Songci").where({
             index:_.eq(index+3)
           }).get().then(res=>
            {
              // console.log(res.data[0])
              let dahoutian=res.data[0]
             //  console.log(today)
             //  console.log(tomorrow)
             //  console.log(houtian)
             //  console.log(dahoutian)
 
              //更改answer对象数组
             //  console.log(that.data.answer)
          
                //直接分4种情况
               if(answerNo==0)
               {
                 that.data.answer[0].author=today.author
                 that.data.answer[0].rhythmic=today.rhythmic
 
                 that.data.answer[1].author=dahoutian.author
                 that.data.answer[1].rhythmic=dahoutian.rhythmic
 
                 that.data.answer[2].author=tomorrow.author
                 that.data.answer[2].rhythmic=tomorrow.rhythmic
 
                 that.data.answer[3].author=houtian.author
                 that.data.answer[3].rhythmic=houtian.rhythmic
              }
              else if(answerNo==1)
              {
               that.data.answer[0].author=dahoutian.author
               that.data.answer[0].rhythmic=dahoutian.rhythmic
 
               that.data.answer[1].author=today.author
               that.data.answer[1].rhythmic=today.rhythmic
 
               that.data.answer[2].author=tomorrow.author
               that.data.answer[2].rhythmic=tomorrow.rhythmic
 
               that.data.answer[3].author=houtian.author
               that.data.answer[3].rhythmic=houtian.rhythmic
            }
            else if(answerNo==2)
            {
             that.data.answer[0].author=tomorrow.author
             that.data.answer[0].rhythmic=tomorrow.rhythmic
 
             that.data.answer[1].author=dahoutian.author
             that.data.answer[1].rhythmic=dahoutian.rhythmic
 
             that.data.answer[2].author=today.author
             that.data.answer[2].rhythmic=today.rhythmic
 
             that.data.answer[3].author=houtian.author
             that.data.answer[3].rhythmic=houtian.rhythmic
          }
          else if(answerNo==3)
          {
           that.data.answer[0].author=houtian.author
           that.data.answer[0].rhythmic=houtian.rhythmic
 
           that.data.answer[1].author=dahoutian.author
           that.data.answer[1].rhythmic=dahoutian.rhythmic
 
           that.data.answer[2].author=tomorrow.author
           that.data.answer[2].rhythmic=tomorrow.rhythmic
 
           that.data.answer[3].author=today.author
           that.data.answer[3].rhythmic=today.rhythmic
        }
        that.setData({
          answer:that.data.answer
        })
            })  
          })  
       })
         
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

  show_toast_time(){
    this.setData({
      show_no:0
    })

  },
  answerjudge(e){
   
    let that=this
    console.log(that.data.flag)
    if(that.data.flag==0){
      that.setData({
        show_no:1,
        toast_content:'你今天已经回答过了，改天再来吧',
        toast_img:'../../images/other/gantan.png'
      })
      setTimeout(that.show_toast_time,1500)
    }
    // console.log(that.data.openid)
    // console.log(e.currentTarget.id)
    let userchoice=e.currentTarget.id
    // console.log(userchoice) //用户选择的编号
    // console.log(that.data.answerNo)//正确的答案编号
  
    if(that.data.flag==1)       //如果用户还能玩，flag为1
    {
      db.collection("Songci").where({
        index:_.eq(that.data.index)
      }).update({
        data:{
          played:_.push(that.data.openid)
        }
      }).then(res=>{
        //这里再加一个不可点击
        console.log(res)
      }) 
      if(userchoice==that.data.answerNo)
      {
        console.log("选择正确")
        that.setData({
          show_toast:1,
          toast_content:'选择正确',
          toast_img:'../../images/other/true.png'
        })
      
        db.collection("people").where({
          _openid:_.eq(that.data.openid)
        }).update({
          data:{
            empirical_value:_.inc(20)     //加20经验值
          }
        })
      }
      else
      {
        console.log("选择错误")
        that.setData({
          show_toast:1,
          toast_content:'选择错误',
          toast_img:'../../images/other/wrong.png'
        })
       
      }
      //最后将flag置为0防止之后再次点击
      that.setData({
        flag:0
      })
    }
  },
  ShowPoem(e){
    this.setData({
      show_poem:1,
      show_toast:0
    })
  },
  ToBack(e){
    this.setData({
      show_poem:0,
      show_toast:0
    })
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