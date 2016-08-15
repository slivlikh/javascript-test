(function(){
	window.Gallary = function(rootId, params, needNewPage){
		this.rootId = document.getElementById(rootId); // св-во от пользователя
		this.imgInRow = params.imgInRow;
		this.rowClass = params.rowClass;
		this.itemClass = params.itemClass;
		this.loadNewPageOnRow = params.loadNewPageOnRow;
		this.activeClass = params.activeClass;

		Gallary.prototype.setPage.call(this, params.firstPageArr);
		this.items = this.rootId.getElementsByClassName(this.itemClass);
		this.items[0].classList.add(this.activeClass);
		var activeItem = 0;
		var _this = this;
		if(params.cache){
			this.cache = {}; // кеш для всех страниц
		}
		this.needNewPage = needNewPage; // вызывается когда нужно получить новые фото

		document.addEventListener('keydown', function (e){
			switch(e.which){
				case 37: {
					_this.items[activeItem].classList.remove('active');
					activeItem -=1
					_this.items[activeItem].classList.add('active');
				} break;
				case 38: {
					_this.items[activeItem].classList.remove('active');
					activeItem -= _this.imgInRow
					_this.items[activeItem].classList.add('active');
				} break;
				case 39: {
					_this.items[activeItem].classList.remove('active');
					activeItem +=1
					_this.items[activeItem].classList.add('active');
				} break;
				case 40: {
					_this.items[activeItem].classList.remove('active');
					activeItem += _this.imgInRow
					_this.items[activeItem].classList.add('active');
				} break; 
			}
		}, false);




		//document.addEventListener('scroll', changeActiveImg, false);

		

		return {
			setPage: window.Gallary.prototype.setPage.bind(this)
		};
	}
	Gallary.prototype.setPage = function(arrLinksImg){
		var html = "";
		for(var i = 0; arrLinksImg.length > i; i++){
			html += "<div class='"+ this.rowClass +"'>";
			for(var j = 0; this.imgInRow > j && arrLinksImg.length > i; j++){
				console.log(i);
				html += "<div class='"+ this.itemClass +"'><img src='"+ arrLinksImg[i] +"' alt=''></div>";
				i++;
			}
			html += "</div>";
			i--;
		}
		this.rootId.insertAdjacentHTML('beforeEnd', html);
	}
	return window.Gallary;
})();


