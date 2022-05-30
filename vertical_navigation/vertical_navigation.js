// pages/topic/topic.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
		tabIndex: 0,
		activeIndex: 0,
		tabNavTop: 0,
		list: [],
		isLoad: true,
		topic_design:"",
		scene_input:"",
		topic:[],
		topic_content:[{title:"话题",content:""}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		const db = wx.cloud.database()
		db.collection('Topic').get()
		.then(res=>{
			console.log(res)
			this.setData({
				topic:res.data
			})
		})
		let list = [{}];
		for (let i = 0; i < 9; i++) {
			list[i] = {};
		}
		this.setData({
			list: list
		});
  },
	handleTabSelect (e) {
		this.setData({
			tabIndex: e.currentTarget.dataset.index,
			activeIndex: 0,
			tabNavTop: e.currentTarget.dataset.index * 50,
			topictitle:this.data.topic[e.currentTarget.dataset.index].topic_title,
			topic_content:this.data.topic[e.currentTarget.dataset.index].topic_content
		});
  },
  scrollContent (e) {
		let that = this;
		let list = this.data.list;
		let tabHeight = 0;
		if (this.data.isLoad) {
			for (let i = 0; i < list.length; i++) {
				let view = wx.createSelectorQuery().select('#main-' + i);
				view.fields({
					size: true
				}, data => {
					list[i].top = tabHeight;
					tabHeight = tabHeight + data.height;
					list[i].bottom = tabHeight;
				}).exec();
			}
			that.setData({
				isLoad: false,
				list: list
			});
		}
	},
	choose_topic:function(e){
		console.log()
		if(e.currentTarget.dataset.topic!='话题'){
			wx.showModal({
				cancelColor: 'cancelColor',
				title:'确定要选择此话题吗',
				success:res=>{
					console.log(res)
					if(res.confirm){
						 if(e.currentTarget.id=="main-"+e.currentTarget.dataset.index)//当需要增加要跳转的页面时，在此函数添加判断条件即可
						{
							this.setData({
								naviurl :'../FabiaoBJ/FabiaoBJ?title='+e.currentTarget.dataset.topic+"&topic="+this.data.topictitle
							})
						}
						wx.reLaunch({

							url: this.data.naviurl,//要用../表示根目录，否则默认是从当前目录出发
							success:function(){
				
							},     //成功后的回调；
							fail:function(res){
								console.log(res)//失败后的回调；
							}          
						})
					}else{
	
					}
				}
			})
		}

	},
	inputscene:function(e){
		this.setData({
			scene_input:e.detail.value
		})
	},
	topic_design:function(e){
		this.setData({
			topic_design:e.detail.value
		})
	},
	checkcontent:function(){
		//内容安全审查
		if(this.data.topic_design==""||this.data.scene_input=="")
		{
			wx.showToast({
				title: '输入不能为空',
				icon:"none"
			})
		}else{
			wx.cloud.init();
			wx.cloud.callFunction({
				name: 'msgSecCheck',
				data: {
					content: this.data.topic_design
				}
			}).then(res => {
				console.log(res.result.data.errCode)
				if(res.result.data.errCode==87014){
					wx.showToast({
						title: '话题违规，发起话题失败',
						icon:"none"
					})
				}else{
					wx.showModal({
						cancelColor: 'cancelColor',
						title:'确定生成话题吗？',
						success:res=>{
							if(res.confirm){
								wx.showToast({
									title: '话题发起成功，待审核',
									icon:"none"
								})
								const db = wx.cloud.database()
								db.collection('Request').add({
									data:{
										type:"用户话题申请",
										name:this.data.topic_design
									}
								}).then(res=>{
									console.log(res)
								})
							}else{

							}
						}
					})
				}
			})
		}

	}
})