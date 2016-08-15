(function(){
	function xhr(param, res, rej){
		var xhr = new XMLHttpRequest();
		xhr.open(param.method, param.url, param.async);
		xhr.send(param.body);
	}



	window.xhr = xhr;
})();