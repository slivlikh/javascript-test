(function(){
	function Flickr(apiKey){
		testTypeInputParams('api key', apiKey, ['String']);
		this.apiKey = apiKey;testTypeInputParams
		return {
			getPhoto: Flickr.prototype.getPhoto.bind(this)
		}
	}
	Flickr.prototype.getPhoto = function(params, callback){
		testTypeInputParams('params', params, ['Object']);
		testTypeInputParams('tag', params.tag, ['String', 'Number']);
		testTypeInputParams('page', params.page, ['Number']);
		testTypeInputParams('perPage', params.perPage, ['Number']);

		ajax.get({
			url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+this.apiKey+'&tags='+params.tag+'&per_page='+params.perPage+'&page='+params.page+'&format=json&nojsoncallback=?',
			async: true
		}, function(err, resJson){
			if(err){
				callback(err);
			}else{
				try{
					var resParse = JSON.parse(resJson);
					if(resParse.stat === 'ok'){
						callback(undefined, resParse);
					}
				}catch(e){
					callback(e);
					console.log(e);
				}
			}
		});
	};



	function testTypeInputParams(propName, propValue, resolveTypesArr){
		var type = classOf(propValue);
		if( resolveTypesArr.indexOf(type) === -1 ){
			throw new TypeError( propName + ' must be ' + resolveTypesArr.join(' or '));
		}
	};
	
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
