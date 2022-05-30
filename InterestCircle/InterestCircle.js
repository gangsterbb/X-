Page({
  circle:[
    {title:"影视剧",image:"../../images/InterestCircle/tv.png"},
    {title:"经典文学作品",image:"../../images/InterestCircle/book.png"},
    {title:"流行小说",image:"../../images/InterestCircle/novel.png"},
    {title:"游戏攻略",image:"../../images/InterestCircle/game.png"},
    {title:"游戏赛事",image:"../../images/InterestCircle/shi.png"},
   ],
  
  data: {
    title_taken:"",
    current_circle:[
     {title:"影视剧",image:"../../images/InterestCircle/tv.png"},
     {title:"经典文学作品",image:"../../images/InterestCircle/book.png"},
     {title:"流行小说",image:"../../images/InterestCircle/novel.png"},
     {title:"游戏攻略",image:"../../images/InterestCircle/game.png"},
     {title:"游戏赛事",image:"../../images/InterestCircle/shi.png"},
    ]
  },

  navigatorTo(e){
    //将标签作为跳转参数，当需要新增兴趣圈时，只需要新增一个if
    console.log(e.currentTarget.dataset.circle)
    this.setData({
      title_taken:this.data.current_circle[e.currentTarget.dataset.circle].title
    })
    wx.navigateTo({
      url: '../InterestCircles/InterestCircles'+'?title_taken='+this.data.title_taken,//要用../表示根目录，否则默认是从当前目录出发

      success:function(){

      },     //成功后的回调；
      fail:function(res){
        console.log(res)//失败后的回调；
      }          
    })
  },
  SearchCircle:function(e){
    for(var i =0;i<this.circle.length;i++)
    {
      if(e.detail.value==this.circle[i].title){
        this.setData({
          current_circle:[{title:e.detail.value,image:this.circle[i].image}]
        })
      }
    }
    if(e.detail.value=="")
    {
      this.setData({
        current_circle:[
          {title:"影视剧",image:"../../images/InterestCircle/tv.png"},
          {title:"经典文学作品",image:"../../images/InterestCircle/book.png"},
          {title:"流行小说",image:"../../images/InterestCircle/novel.png"},
          {title:"游戏攻略",image:"../../images/InterestCircle/game.png"},
          {title:"游戏赛事",image:"../../images/InterestCircle/shi.png"},
         ],
      })
    }
  }
    

 
})