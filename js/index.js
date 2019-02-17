mui.init();

//mui加载完成事件
mui.plusReady(function() {
	localStorage.clear();
	// 	//定义子页面数组
	var bookPage = ['bottomTaps/bookshelf.html', 'bottomTaps/bookCity.html', 'bottomTaps/paiHang.html',
		'bottomTaps/classify.html'
	];
	//设置子页面样式
	var bookStyle = {
		top: '0px',
		bottom: '50px'
	};
	//获取主webview,当前页面
	var mainView = plus.webview.currentWebview();
	//遍历数组,根据每个子页面创建webview
	for (var i = 0; i < bookPage.length; i++) {
		var url = bookPage[i];
		//根据url创建webview
		//创建webView: plus.webView.creat(url,id,style),返回webView对象
		//url:页面地址
		//id:页面标识
		//style:样式

		var bookView = plus.webview.create(url, url, bookStyle);
		//默认将每个页面设为隐藏状态
		bookView.hide();
		//为了主子同时显示,把每个子页面加到主页面中
		mainView.append(bookView);
	}
	//第一个页面默认加载
	plus.webview.show(bookPage[0]);
	//给每一个导航栏注册一个点击事件
	//事件名:tap。onclick,click无效
	mui(".yong-tap").on("tap", "a", function() {
		//获取当前事件源对应的href
		var url = this.getAttribute("href");
		//设置当前导航栏子页面显示
		plus.webview.show(url, 'fade-in');
	});

	var leftMenu;
	//预加载侧拉页面
	setTimeout(function() {
		leftMenu = mui.preload({
			url: 'menu.html',
			id: 'menu.html',
			styles: {
				left: '0',
				width: '70%',
			} //窗口参数
		})
	}, 300);

	//打开侧滑菜单
	window.addEventListener('left_menu', function() {
		leftMenu.show('none', 0, function() {
			//移动主页面
			mainView.setStyle({
				left: '70%',
				mask: 'rgba(0,0,0,0.4)',
				transition: {
					duration: 150
				}
			});
			showMenu = true;
		});
	});

	window.addEventListener('close_menu', function() {
		close_menu();
	});

	mainView.addEventListener('maskClick', function() {
		close_menu();
	});
	
	//关闭侧面导航栏
	function close_menu() {
		leftMenu.show('none', 0, function() {
			//移动主页面
			mainView.setStyle({
				left: '0',
				mask: 'none',
				transition: {
					duration: 150
				}
			});
		});
		leftMenu.hide();
	}
});
