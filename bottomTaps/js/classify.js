mui.init();
//加载数据
defaultClassify();
mui.plusReady(function() {

	mui('.classify').on('tap', 'a', function() {
		mui.openWindow({
			url: 'classify/page_main.html',
			id: 'page',
			show: {
				autoShow: false
			},
			extras: {
				category: this.id
			}
		});
	});
});

function defaultClassify() {
	//从json里面读取分类的数据
	mui.ajax('../json/classify.json', {
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			var classify = '<ul class="mui-table-view">';
			for (var i = 0; i < data.count; i++) {
				classify += '<li class="mui-table-view-cell mui-media"><a id="' + data.data[i].title +
					'" href="#"><img class="mui-pull-left" src="' + data.data[
						i].img + '"><div class="mui-media-body"><span class="left">' + data.data[i].title +
					'</span><span class="right">' + data.data[i].total + ' 本 ></span></div></a></li>';
			}
			classify += '</ul>';
			document.querySelector(".classify").innerHTML = classify;
		},
		error: function(xhr, type, errorThrown) {
			alert("mini_classify数据加载异常" + xhr);
		}
	});
}
