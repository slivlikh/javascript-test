(function(){
	function Flickr(apiKey){
		Flickr.testTypeInputParams('api key', apiKey, ['String']);
		this.apiKey = apiKey;
	}
	Flickr.prototype.getPhoto = function(params, callback){
		testTypeInputParams('params', params, ['Object']);
		testTypeInputParams('tag', params.tag, ['String', 'Number']);
		testTypeInputParams('page', params.page, ['Number']);
		testTypeInputParams('perPage', params.perPage, ['Number']);
		testTypeInputParams('cache', params.cache, ['Boolean']);
		testTypeInputParams('format', params.format, ['String']);

		ajaxGet('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+this.apiKey+'&tags='+params.tag+'&per_page='+params.perPage+'&page='+params.page+'&format='+params.format, function(err, res){
			if(err){
				callback(err);
			}else{
				console.log(res);
			}
		});
	};






	function testTypeInputParams(propName, propValue, resolveTypesArr){
		var type = classOf(propValue);
		if( resolveTypesArr.indexOf(type) === -1 ){
			throw new TypeError( propName + ' must be ' + resolveTypesArr.join(' or '));
		}
	};
	function ajaxGet(url, callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.send(null);
		xhr.onreadystatechange = function(){
			if(xhr.readyState !== 4){
				return;
			}
			if(xhr.status === 200){
				callback(undefined, xhr.responseText);
			}else{
				callback({
					status: xhr.status,
					statusText: xhr.statusText,
					resposneText: xhr.responseText
				});
			}
		}
		xhr.onabort = xhr.onerror = xhr.ontimeout = function(err){
			callback(err);
		}
	}
	function classOf(param){
		if(param === undefined){
			return 'undefined';
		}else if(param === null){
			return 'Null';
		}else{
			return Object.prototype.toString.call(param).slice(8, -1);
		}
	}
	window.Flickr = Flickr;
}());
	
	
	// https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c14283978aa157e04ec6e51b5022b185&tags=test&per_page=5&page=1&format=json
	// http://stackoverflow.com/questions/26497135/flickr-api-tag-search-jquery-ajax
