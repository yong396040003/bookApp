mui.init({
	pullRefresh: {
		container: '#refreshContainer',
		down: {
			auto: true,
			callback: pullfreshDown
		},
		up: {
			callback: pullfreshUp
		}
	}
});
//初始加载页面
var defaultPage = 1;
//默认加载数量
var limit = 10;
//加载数据
var page = 2;
//判断是否还有数据true表示没有更多数据了
var dataCkeck = false;
//分类标题
var category;
//分类下的细分
var category_sub;

function pullfreshDown() {
	mui.plusReady(function() {
		var nowWindow = plus.webview.currentWebview();
		var parent = nowWindow.parent();
		category = parent.category;
	});
	setTimeout(function() {
		mui.ajax('http://47.105.125.214/book_admin/selectBook.do', {
			data: {
				page: defaultPage,
				limit: limit,
				category: category
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data.count >= limit) {
					limit = limit;
				} else {
					limit = data.count;
				}
				var html = '';
				for (var i = 0; i < limit; i++) {
					html +=
						'<li class="mui-table-view-cell mui-media"><a href="javascript:void(0);"  bookNumber=' + data.data[i].number +
						'><img class="mui-pull-left" src=' +
						data.data[i].img + '><div class="mui-media-body"><p>' + data.data[i].name +
						'</p><p style="font-size: 12px;">' + data.data[i].category + ' | ' + data.data[i].author +
						'</p><br><p class="mui-ellipsis">' + data.data[
							i].synopsis + '</p></div></a></li>';
				}
				mui('#refreshContainer').pullRefresh().endPulldown();

				document.querySelector('.mui-table-view').innerHTML = html;
			},
			error: function(xhr, type, errorThrown) {

			}
		});
	}, 1000);
}

function pullfreshUp() {
	setTimeout(function() {
		mui.ajax('http://47.105.125.214/book_admin/selectBook.do', {
			data: {
				page: page,
				limit: limit,
				category: category
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if ((data.count - page * limit) >= limit) {
					limit = limit;
					dataCkeck = false;
				} else {
					limit = data.count - page * limit;
					dataCkeck = true;
				}
				var table = document.querySelector('.mui-table-view');
				for (var i = 0; i < limit; i++) {
					var li = document.createElement('li');
					li.className = 'mui-table-view-cell mui-media';
					li.innerHTML = '<a href="javascript:void(0);" bookNumber=' + data.data[i].number + '><img class="mui-pull-left" src=' +
						data.data[i].img + '><div class="mui-media-body"><p>' + data.data[i].name +
						'</p><p style="font-size: 11px;">' + data.data[i].category + ' | ' + data.data[i].author +
						'</p><br><p class="mui-ellipsis">' + data.data[
							i].synopsis + '</p></div></a>';
					table.appendChild(li);
				}
				mui('#refreshContainer').pullRefresh().endPullupToRefresh(dataCkeck);
				page += 1;
			},
			error: function(xhr, type, errorThrown) {
				console.log("数据请求异常");
			}
		});
	}, 1000);
}

mui.plusReady(function() {
	mui('.mui-table-view').on('tap', 'a', function() {
		var bookNumber = this.getAttribute('bookNumber');
		mui.openWindow({
			url: '../../book.html',
			id: 'book',
			show: {
				autoShow: false
			},
			extras: {
				bookNumber: bookNumber
			}
		});
	});
});
