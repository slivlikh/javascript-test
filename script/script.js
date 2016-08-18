(function(){
	var flickr = new Flickr('c14283978aa157e04ec6e51b5022b185');
	
	//xhr.open('GET','https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c14283978aa157e04ec6e51b5022b185&tags=test&per_page=50&page=1&format=json&nojsoncallback=?' ,true);
	var pageCounter = 1;
	var gallary = new Gallary('gallary', {
		imgInRow: 5,
		rowClass: 'row clear-fix',
		itemClass: 'item',
		loadNewPageOnRow: 2,
		activeClass: 'active'
	}, function(){
		flickr.getPhoto({
			tag: 'f1',
			page: pageCounter++,
			perPage: 40
		}, getPhotoCallback);
	});


	function getPhotoCallback(err, resJson){
		if(err){ alert('Во время загрузки произошла ошибка'); return; }
		var arrUrl = [];
		var photos = resJson.photos.photo;
		for(var i = 0; photos.length > i; i++){
			arrUrl.push('https://farm' + photos[i].farm + '.staticflickr.com/' + photos[i].server + '/' + photos[i].id + '_' + photos[i].secret+'.jpg');
		}
		gallary.setPage(arrUrl);
	}
})();