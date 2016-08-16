(function(){
	var ajax = {
		get: function(params, callback){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', params.url, params.async);
			xhr.send(null);
			xhr.onreadystatechange = function(){
				if(xhr.readyState !== 4){
					return;
				}
				if(xhr.status === 200){
					callback(undefined, xhr.responseText);
				}else{
					callback(xhr);
				}
			}
			xhr.onabort = xhr.onerror = xhr.ontimeout = function(err){
				callback(err);
			}
		}
	}
	window.ajax = ajax;
})();