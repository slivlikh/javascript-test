(function(){
	//var flickr = new Flickr('c14283978aa157e04ec6e51b5022b185');
	

	var xhr = new XMLHttpRequest();

	xhr.open('GET','https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c14283978aa157e04ec6e51b5022b185&tags=test&per_page=50&page=1&format=json&nojsoncallback=?' ,true);
	xhr.send(null);

	xhr.onreadystatechange = function(){
		if(xhr.readyState !== 4) return;
		if(xhr.status === 200){
			var res = JSON.parse(xhr.responseText);
			var arrUrl = [];
			var photos = res.photos.photo;
			for(var i = 0; photos.length > i; i++){
				arrUrl.push('https://farm' + photos[i].farm + '.staticflickr.com/' + photos[i].server + '/' + photos[i].id + '_' + photos[i].secret+'.jpg');
			}
			var gallary = new Gallary('gallary', {
					imgInRow: 5,
					rowClass: 'row clear-fix',
					itemClass: 'item',
					loadNewPageOnRow: 2,
					activeClass: 'active',
					cache: true,
					firstPageArr: arrUrl
				}, function(){
			
			});
		}
	}

	
	
	


})();