mui.init();

mui.plusReady(function() {
	var nowWindow = plus.webview.currentWebview();
	var parent = nowWindow.parent();
	var left_menu = document.getElementById('left_menu');
	left_menu.addEventListener('tap', function() {
		mui.fire(parent, 'left_menu');
	});
	var json = JSON.parse(localStorage.getItem('myBookshelfList'));
	if (json != null) {
		myBookshelf(json);
	}
	document.addEventListener('myBookshelf', function() {
		var json = JSON.parse(localStorage.getItem('myBookshelfList'));
		myBookshelf(json);
	});

	mui('.myBookshelfList').on('longtap', 'a', function() {

	});

	mui('.myBookshelfList').on('tap', 'a', function() {
		var json = JSON.parse(localStorage.getItem('myBookshelfList'));
		var bookNumber = parseInt(this.getAttribute('bookNumber'));
		var page;
		for(var i = 0; i< json.total;i++){
			if(json.bookList[i].number == bookNumber){
				page = json.bookList[i].page;
				break;
			}
		}
		mui.openWindow({
			url: '../bookCatalogue.html',
			id: 'bookCatalogue',
			show: {
				autoShow: false
			},
			extras: {
				bookNumber: bookNumber,
				count: page
			}
		});
	});
});

function myBookshelf(data) {
	var table = document.querySelector('.myBookshelfList');
	var html = '';
	for (var i = 0; i < data.total; i++) {
		html += '<li class="mui-table-view-cell"><a href="#popover" page="'+ data.bookList[i].page+'" bookNumber=' + data.bookList[i].number +
			'><img class="mui-pull-left" src=' +
			data.bookList[i].img + '><div class="mui-media-body"><p>' + data.bookList[i].name +
			'</p><p style="font-size: 11px;">' + data.bookList[i].category + ' | ' + data.bookList[i].author +
			'</p><br><p class="mui-ellipsis">' + data.bookList[i].synopsis + '</p></div></a></li>'
	}
	table.innerHTML = html;
}
