// pages/login/login.js 
var app = getApp();
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
  },

  getUserProfile(){
    var value = wx.getStorageSync('Loginkey')
    if(!value){
      wx.getUserProfile({
        desc: 'desc',
        lang:"zh_CN",
        success:(res) => {
          app.globalData.gender=res.userInfo.gender,
          app.globalData.nickName=res.userInfo.nickName,//将获取到的用户名存到全局变量中
          app.globalData.city=res.userInfo.city,//将获取到的城市存到全局变量中
          app.globalData.province=res.userInfo.province,//将获取到的省份存到全局变量中
          app.globalData.avatarUrl=res.userInfo.avatarUrl,//将获取到的图片或视频的地址存到全局变量中
          wx.setStorage({
            data:1,
            key: 'Loginkey',
          })
          this.setData({
            userinfo:res.userInfo,//获取到用户信息
            hasuserinfo:true,//限制授权登录的次数
          })
          wx.cloud.callFunction({
            name:'change',
            success:res=>{
             this.setData({
               openid:res.result.openid
             })
             var db = wx.cloud.database()
             db.collection('people').where(
               {
                 _openid:db.RegExp({
                   regexp:this.data.openid,
                   option:'i'
                 })
               }
             ).get({
               success:function(res){
                if(res.data.length==0)
                {

                  db.collection('people').add({
                    data:{
                      empirical_value:1,//经验值
                      name:app.globalData.nickName,//将获取到的用户名添加到云数据库中
                      city:app.globalData.city,//将获取到的城市添加到云数据库中
                      province:app.globalData.province,//将获取到的省份添加到云数据库中
                      avatarUrl:app.globalData.avatarUrl,//将获取到的头像添加到云数据库中
                      gender:app.globalData.gender,//将获取的性别添加到云数据库中 0为男1为女
                      works:[],
                      spot:[],
                      star:[],
                      follow_people:[],
                      followed_people:[],
                      currency:0,
                      personal_sign:"",
                      works:[],
                      star_circle:[],
                      like_note:[],
                      star_note:[],
                      comment_note:[],
                      tran_note:[],
                    },
                    success:res=>{
                      console.log("user_success")
                      
                    },
                    fail:res=>{
                      console.log("user_fail")
                    },
                    
                  })
                }else{
                  app.globalData.level = res.data[0].level
                        db.collection('people').doc(res.data[0]._id).update({
                          data:{
                            name:app.globalData.nickName,//将获取到的用户名添加到云数据库中
                            city:app.globalData.city,//将获取到的城市添加到云数据库中
                            province:app.globalData.province,//将获取到的省份添加到云数据库中
                            avatarUrl:app.globalData.avatarUrl,//将获取到的头像添加到云数据库中
                            gender:app.globalData.gender,//将获取的性别添加到云数据库中 0为男1为女
                          }
                        }).then(resss=>{
                        })
                }
                wx.switchTab({
                  url: '/pages/index/index',
            
                })
              },
               fail:function(res){
               }
             })
            } 
          }) 

        },
        fail:(res)=>{
          console.log(res)
        }
      })


      
    }else{
      wx.switchTab({
        url: '/pages/index/index',
  
      })
    }





  }
})