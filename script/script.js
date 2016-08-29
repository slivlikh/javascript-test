(function(){
	var flickr = new Flickr('c14283978aa157e04ec6e51b5022b185');
	var gallary;
	var pageCounter = 0;
	flickr.getPhoto({
		tag: 'f1',
		page: ++pageCounter,
		perPage: 40
	}, function(err, resJson){

		if(err){ alert('Во время загрузки произошла ошибка'); return; }
		gallary = new Gallary('gallary', {
			imgInRow: 5,
			rowClass: 'row clear-fix',
			rowMarginBottom: 10,
			itemClass: 'item',
			itemHeight: 374,
			loadNewPageOnRow: 2,
			activeClass: 'active',
			anumationDuration: 300,
			firstPage: getPrepareUrl(resJson),
			needPage: function(page){
				flickr.getPhoto({
					tag: 'f1',
					page: page,
					perPage: 40
				}, needPageCallback);
			},
		});
	});



	function getPrepareUrl(resJson){
		var arrUrl = [];
		var photos = resJson.photos.photo;
		for(var i = 0; photos.length > i; i++){
			arrUrl.push('https://farm' + photos[i].farm + '.staticflickr.com/' + photos[i].server + '/' + photos[i].id + '_' + photos[i].secret+'.jpg');
		}
		return arrUrl;
	}


	function needPageCallback(err, resJson){
		if(err){ alert('Во время загрузки произошла ошибка'); return; }
		gallary.setPage( getPrepareUrl(resJson) );
	}

	

})();