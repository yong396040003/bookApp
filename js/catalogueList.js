mui.init();

mui.plusReady(function() {
	var nowWindow = plus.webview.currentWebview();
	mui('.mui-scroll-wrapper').scroll({
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: true, //是否显示滚动条
		deceleration: 0.00015, //阻尼系数,系数越小滑动越灵敏
		bounce: false //是否启用回弹
	});
	var wvs = plus.webview.all();
	var count;
	for (var i = 0; i < wvs.length; i++) {
		if (wvs[i].id == 'bookCatalogue') {
			count = i;
			break;
		}
	}
	plus.key.addEventListener('backbutton', function() {
		mui.fire(wvs[count], 'close_catalogue');
	});
	
	//目录与右侧内容同步更新
// 	document.addEventListener('mulu', function() {
// 		mui('');
// 	});

	if (localStorage.getItem("bookNumber" + nowWindow.bookNumber) != null) {
		// alert("本地存储成功");
		// 读取数据并将其转换为json
		var json = JSON.parse(localStorage.getItem("bookNumber" + nowWindow.bookNumber));
		loadData(json);
	}

	mui('.catalogueList').on('tap', 'a', function() {
		var jsonBook = {
			"bookTitle": this.innerHTML,
			"url": this.getAttribute('catalogue'),
			"count": this.getAttribute("count"),
			"bookNumber": nowWindow.bookNumber
		};
		localStorage.setItem("catalogueList", JSON.stringify(jsonBook));
		mui.fire(wvs[count], 'updata');
	});
});

//加载数据到html页面
function loadData(data) {
	//目录
	var catalogueList = document.querySelector('.catalogueList');
	if (data != null) {
		for (var i = 0; i < data.catalogueCount; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			if (data.catalogueList[i].contents != null) {
				li.className = 'mui-table-view-cell cache';
			}
			li.innerHTML = '<a count="' + data.catalogueList[i].count + '" href="javascript:void(0);" catalogue="' + data.catalogueList[
				i].url + '">' + data.catalogueList[i].name + '</a>'
			catalogueList.appendChild(li);
		}
	}
}
