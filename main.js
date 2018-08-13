// window.Docute is exposed by the `docute.js` file
var doc = new Docute({
  title: '梨梨机器人', // Default to `<title>` value
  sidebar: [
    {
	  title: '主页',
      link: '/',	  
    },
    {
      title: '网关',
      link: '/Gateway',	 
    },
    {
      title: '核心服务程序',
      link: '/Riri-2',	 
    }
  ]
})

doc.start()