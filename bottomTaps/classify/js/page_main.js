mui.init();

mui.plusReady(function() {
	var _self = plus.webview.currentWebview();
	document.querySelector('.bar').innerHTML =
		'<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">' + _self.category +
		'</h1>';
	var group = new webviewGroup(_self.id, {
		items: [{
			id: "hot.html",
			url: "hot.html",
			extras: {
				category_sub: 'hot'
			}
		}, {
			id: "update.html",
			url: "update.html",
			extras: {
				category_sub: 'update'
			}
		}, {
			id: "recommend.html",
			url: "recommend.html",
			extras: {
				category_sub: 'recommend'
			}
		}, {
			id: "end.html",
			url: "end.html",
			extras: {
				category_sub: 'end'
			}
		}],
		onChange: function(obj) {
			var c = document.querySelector(".mui-control-item.mui-active");
			if (c) {
				c.classList.remove("mui-active");
			}
			var target = document.querySelector(".yong-tap .mui-control-item:nth-child(" + (parseInt(obj.index) + 1) +
				")");
			target.classList.add("mui-active");
			if (target.scrollIntoView) {
				target.scrollIntoView();
			}
		}
	});
	mui(".yong-tap").on("tap", ".mui-control-item", function(e) {
		var wid = this.getAttribute("data-wid");
		group.switchTab(wid);
	});
	
	plus.nativeUI.closeWaiting();
	mui.currentWebview.show();
});
mui.back = function() {
	var _self = plus.webview.currentWebview();
	_self.close("auto");
}
