mui.init();

mui.plusReady(function() {
	// localStorage.clear();
	var nowWindow = plus.webview.currentWebview();
	// 左侧目录页面
	var catalogueList;
	//预加载目录栏
	setTimeout(function() {
		catalogueList = mui.preload({
			url: 'catalogueList.html',
			id: 'catalogueList',
			styles: {
				left: '0',
				width: '70%',
			}, //窗口参数
			extras: {
				bookNumber: nowWindow.bookNumber
			} //自定义扩展参数
		})
	}, 500);

	mui('.mui-scroll-wrapper').scroll({
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: true, //是否显示滚动条
		deceleration: 0.0015, //阻尼系数,系数越小滑动越灵敏
		bounce: false //是否启用回弹
	});

	var count = nowWindow.count;
	var json = JSON.parse(localStorage.getItem("bookNumber" + nowWindow.bookNumber));
	if (json.catalogueList[count - 1].contents == null) {
		//获取书架json
		var bookshelfJson = JSON.parse(localStorage.getItem('myBookshelfList'));
		//判断书架json里是否包含这本书 如果是代表已经加入书架否则亦然
		if (bookshelfJson != null) {
			for (var i = 0; i < bookshelfJson.total; i++) {
				if (bookshelfJson.bookList[i].number == json.book.number) {
					defaultContent(json.catalogueList[count - 1].url, json.catalogueList[count - 1].name);
					// 关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show('catalogueList', "zoom-out", 105000);
					break;
				}
				if (i == (bookshelfJson.total - 1)) {
					defaultContent(nowWindow.url, nowWindow.bookTitle);
					// 关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show('catalogueList', "zoom-out", 105000);
				}
			}
		} else {
			defaultContent(nowWindow.url, nowWindow.bookTitle);
			// 关闭等待框
			plus.nativeUI.closeWaiting();
			//显示当前页面
			mui.currentWebview.show('catalogueList', "zoom-out", 105000);
		}
	} else {
		pageShow(count, json);
		// 关闭等待框
		plus.nativeUI.closeWaiting();
		//显示当前页面
		mui.currentWebview.show('catalogueList', "zoom-out", 105000);
	}

	if (count <= nowWindow.catalogueCount) {
		//加载后面几章
		loadNext(count, true, nowWindow.bookNumber);
		if (!localStorage.getItem("check")) {
			console.log("预加载失败");
		}
	}

	var mask;
	var isTap = false;

	mui('.bookEnd').on('tap', 'button', function() {
		if (isTap) {
			return;
		}
		var json = JSON.parse(localStorage.getItem("bookNumber" + nowWindow.bookNumber));
		var btn = this.innerHTML;
		if (btn == "上一页") {
			if (count == 1) {
				alert("已经是第一页了");
			}
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			count--;
			if (loadNext(count, false, nowWindow.bookNumber)) {
				pageShow(count, json);
			}
		} else if (btn == "目录") {
			catalogueList.show();
			mui.fire(catalogueList, 'mulu');
			mask = mui.createMask(close_menu);
			mask.show();
		} else {
			if (count == nowWindow.catalogueCount) {
				alert("已经是最后一页了");
			}
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			count++;
			if (loadNext(count, false, nowWindow.bookNumber)) {
				pageShow(count, json);
			}
		}
		isTap = true;
		setTimeout(function() {
			isTap = false;
		}, 1000);
	});

	document.addEventListener('updata', function() {
		mask.close();
		close_menu();
		mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		var json = JSON.parse(localStorage.getItem("bookNumber" + nowWindow.bookNumber));
		var json1 = JSON.parse(localStorage.getItem("catalogueList"));
		count = json1.count;
		if (json.catalogueList[count - 1].contents == null) {
			defaultContent(json1.url, json1.bookTitle);
		} else {
			pageShow(count, json);
		}
		loadNext(count, true, json1.bookNumber);
	});

	window.addEventListener('close_catalogue', function() {
		mask.close();
		close_menu();
	});

	//绑定返回键 判断概述是否在书架里 有则记录器页数
	plus.key.addEventListener('backbutton', function() {
		//获取书架json
		var bookshelfJson = JSON.parse(localStorage.getItem('myBookshelfList'));
		var json = JSON.parse(localStorage.getItem("bookNumber" + nowWindow.bookNumber));
		localStorage.removeItem('myBookshelfList');
		if (bookshelfJson != null) {
			for (var i = 0; i < bookshelfJson.total; i++) {
				if (bookshelfJson.bookList[i].number == json.book.number) {
					bookshelfJson.bookList[i].page = count;
					break;
				}
			}
			localStorage.setItem('myBookshelfList', JSON.stringify(bookshelfJson));
		}
	});

	//关闭侧面导航栏
	function close_menu() {
		catalogueList.hide();
	}
});

function defaultContent(url, title) {
	mui.ajax('http://47.105.125.214/book_admin/selectBookBody.do', {
		data: {
			url: url
		},
		dataType: 'text', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			var bookTitle = document.querySelector('.bookTitle');
			bookTitle.innerHTML = '<span>' + title + '</span>';
			var scroll = document.querySelector('.mui-scroll');
			scroll.innerHTML = data;
		},
		error: function(xhr, type, errorThrown) {
			alert('图书数据加载异常defaultContent');
		}
	});
}

function load(count, bookNumber) {
	setTimeout(function() {
		mui.ajax('http://47.105.125.214/book_admin/selectBookBodyByCount.do', {
			data: {
				count: count,
				bookNumber: bookNumber
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				var json = JSON.parse(localStorage.getItem("bookNumber" + bookNumber));
				if (json.catalogueList[count - 1].contents == null) {
					json.catalogueList[count - 1].contents = data.contents;
					localStorage.setItem("bookNumber" + bookNumber, JSON.stringify(json));
					localStorage.setItem("check", true);
				}
			},
			error: function(xhr, type, errorThrown) {
				alert('图书数据加载异常load');
				localStorage.setItem("check", false);
			}
		});
	}, 500);
}

function loadNext(count, check, bookNumber) {
	// 当打开此页面时做下几章节的缓存 默认缓存数量为3
	var nowCount = count;
	var nextCount = parseInt(count) + 3;
	//第一次
	while (check) {
		if (nowCount <= nextCount) {
			load(nowCount, bookNumber);
			nowCount++;
		} else {
			return localStorage.getItem("check");
		}
	}

	if (!check) {
		load(nextCount, bookNumber);
		return localStorage.getItem("check");
	}
}

function pageShow(count, json) {
	if (json.catalogueList[count - 1].contents == null) {
		console.log("失败");
		load(count, json.book.number);
		var json = JSON.parse(localStorage.getItem("bookNumber" + json.book.number));
		var bookTitle = document.querySelector('.bookTitle');
		bookTitle.innerHTML = '<span>' + json.catalogueList[count - 1].name + '</span>';
		var scroll = document.querySelector('.mui-scroll');
		scroll.innerHTML = json.catalogueList[count - 1].contents;
	} else {
		console.log("成功");
		var bookTitle = document.querySelector('.bookTitle');
		bookTitle.innerHTML = '<span>' + json.catalogueList[count - 1].name + '</span>';
		var scroll = document.querySelector('.mui-scroll');
		scroll.innerHTML = json.catalogueList[count - 1].contents;
	}
}
