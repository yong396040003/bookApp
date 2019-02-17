mui.init();

mui.plusReady(function() {
	var nowWindow = plus.webview.currentWebview();

	mui('.mui-scroll-wrapper').scroll({
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: true, //是否显示滚动条
		deceleration: 0.0005, //阻尼系数,系数越小滑动越灵敏
		bounce: false //是否启用回弹
	});

	//已添加是false 否则true
	var add = true;
	var myBookshelfList = JSON.parse(localStorage.getItem("myBookshelfList"));
	if (myBookshelfList != null) {
		for (var i = 0; i < myBookshelfList.total; i++) {
			if (nowWindow.bookNumber == myBookshelfList.bookList[i].number) {
				add = false;
				document.querySelector('.add').classList.add('red');
				document.querySelector('.add').innerHTML = "已添加";
				break;
			}
		}
	}
	//添加书架
	$('.add').on('tap', function() {
		var bookshelfId = "bottomTaps/bookshelf.html";
		var vadetailPage = plus.webview.getWebviewById(bookshelfId);
		var json = JSON.parse(localStorage.getItem("bookNumber" + nowWindow.bookNumber));
		if (add) {
			if (json != null) {
				this.innerHTML = "已添加";
				this.classList.add('red');
				// 判断我的书架列表是否有数据 是就添加到原有的书架 不是则为第一次添加
				if (localStorage.getItem("myBookshelfList") != null) {
					var myBookshelfList = JSON.parse(localStorage.getItem("myBookshelfList"));
					myBookshelfList.bookList[myBookshelfList.total] = {
						"name": json.book.name,
						"page": 1,
						"number": nowWindow.bookNumber,
						"img": json.book.img,
						"category": json.book.category,
						"author": json.book.author,
						"synopsis": json.book.synopsis
					};
					//书架数量加1
					myBookshelfList.total += 1;
					localStorage.setItem("myBookshelfList", JSON.stringify(myBookshelfList));
				} else {
					var myBookshelf = {
						"total": 0,
						"bookList": []
					};
					//书架存储书籍的样式
					var book = {
						"name": 0,
						"page": 0,
						"number": 0,
						"img": 0,
						"category": 0,
						"author": 0,
						"synopsis": 0
					};
					myBookshelf.bookList[myBookshelf.total] = {
						"name": json.book.name,
						"page": 1,
						"number": nowWindow.bookNumber,
						"img": json.book.img,
						"category": json.book.category,
						"author": json.book.author,
						"synopsis": json.book.synopsis
					};
					myBookshelf.total += 1;
					localStorage.setItem("myBookshelfList", JSON.stringify(myBookshelf));
				}
				mui.fire(vadetailPage, 'myBookshelf');
				add = false;
			} else {
				console.log("添加失败");
			}
		} else {
			this.innerHTML = "+ 书架";
			this.classList.remove('red');
			//删除思路 把存储的数据遍历出来 若不需要则删除
			var myBookshelfList = JSON.parse(localStorage.getItem("myBookshelfList"));
			var count = 0;
			var myBookshelf = {
				"total": 0,
				"bookList": []
			};
			for (var i = 0; i < myBookshelfList.total; i++) {
				if (nowWindow.bookNumber == myBookshelfList.bookList[i].number) {
					continue;
				}
				myBookshelf.bookList[count] = myBookshelfList.bookList[i];
				count++;
			}
			myBookshelf.total = myBookshelfList.total - 1;
			localStorage.setItem("myBookshelfList", JSON.stringify(myBookshelf));
			mui.fire(vadetailPage, 'myBookshelf');
			add = true;
		}
	});

	var catalogueCount;
	// localStorage.clear();
	if (localStorage.getItem("bookNumber" + nowWindow.bookNumber) != null) {
		// alert("本地存储成功");
		// 读取数据并将其转换为json
		var json = JSON.parse(localStorage.getItem("bookNumber" + nowWindow.bookNumber));
		loadData(json);
		// 关闭等待框
		plus.nativeUI.closeWaiting();
		//显示当前页面
		mui.currentWebview.show();
	} else {
		mui.ajax('http://47.105.125.214/book_admin/selectBookByNumber.do', {
			data: {
				bookNumber: nowWindow.bookNumber
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				catalogueCount = data.catalogueCount;
				// 用来对每本打开的书做本地缓存 json数据转换成字符串存储在bookNumber中
				localStorage.setItem("bookNumber" + data.book.number, JSON.stringify(data));
				loadData(data);
				// 关闭等待框
				plus.nativeUI.closeWaiting();
				//显示当前页面
				mui.currentWebview.show();
			},
			error: function(xhr, type, errorThrown) {
				alert('图书数据加载异常');
			}
		});
	}

	//加载数据到html页面
	function loadData(data) {
		//背景
		var bg = document.querySelector('.bg');
		//封面
		var book_left = document.querySelector('.book_left');
		var book_right = document.querySelector('.book_right');
		//简介
		var span = document.getElementById('content');
		//目录
		var catalogueList = document.querySelector('.catalogueList');
		if (data != null) {
			var img_bg = document.createElement('img');
			img_bg.src = data.book.img;
			var img_bookLeft = document.createElement('img');
			img_bookLeft.src = data.book.img;
			bg.appendChild(img_bg);
			book_left.appendChild(img_bookLeft);
			book_right.innerHTML = '<span class="bookName">' + data.book.name + '</span><br><span class="author">作者：' + data.book
				.author + '</span><span class="category">类型：' + data.book.category + '</span><span class="status">状态：' + data.book
				.status + '</span><span class="data">' + data.book.data + '</span>';
			span.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + data.book.synopsis;
			for (var i = 0; i < data.catalogueCount; i++) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.innerHTML = '<a count="' + data.catalogueList[i].count + '" href="javascript:void(0);" catalogue="' + data.catalogueList[
					i].url + '">' + data.catalogueList[i].name + '</a>'
				catalogueList.appendChild(li);
			}
		}
	}
	
	//点击目录打开新页面
	mui('.catalogueList').on('tap', 'a', function() {
		mui.openWindow({
			url: 'bookCatalogue.html',
			id: 'bookCatalogue',
			show: {
				autoShow: false
			},
			extras: {
				url: this.getAttribute('catalogue'),
				bookTitle: this.innerHTML,
				count: this.getAttribute('count'),
				bookNumber: nowWindow.bookNumber,
				catalogueCount: catalogueCount
			}
		});
	});
});
