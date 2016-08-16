(function(){
	 function Gallary(rootId, params, needNewPage){
		needNewPage();
		this.rootId = document.getElementById(rootId); // св-во от пользователя
		this.rowClass = params.rowClass;
		this.itemClass = params.itemClass;
		this.activeClass = params.activeClass;
		this.animated = false;

		this.imgInRow = params.imgInRow;
		this.loadNewPageOnRow = params.loadNewPageOnRow;
		this.lastLoadPage = 0;
		this.currentPage = 0;
		this.loadingNewPage = false;
		this.items = this.rootId.getElementsByClassName(this.itemClass);
		this.activeItemNumber = 0;
		var _this = this;
		if(params.cache){
			this.cache = {}; // кеш для всех страниц
		}
		this.needNewPage = needNewPage; // вызывается когда нужно получить новые фото

		document.addEventListener('keydown', function(e){
			if(_this.items.length === 0) return;
			switch(e.which){
				case 37: move.left.call(_this, e); break;
				case 38: move.top.call(_this, e); break;
				case 39: move.right.call(_this, e); break;
				case 40: move.bottom.call(_this, e); break;
			}
		}, false);

		this.rootId.addEventListener('wheel', function(e){
			if(e.deltaY === -100){
				move.top.call(_this, e);	
			}else{
				move.bottom.call(_this, e);
			}
		}, false);


		return {
			setPage: window.Gallary.prototype.setPage.bind(this)
		};
	}
	var move = {};
	move.top = function(e){
		if(this.animated) return;

		e.preventDefault();
		if(this.activeItemNumber - this.imgInRow < 0){ return; }
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber -= this.imgInRow;
		this.items[this.activeItemNumber].classList.add('active');

		var _this = this;
		var scrollTop = this.rootId.scrollTop; 
		this.animated = true;
		animate({
			draw: function(progress){
				_this.rootId.scrollTop = scrollTop - 310 * progress ;
			},
			duration: 500,
			complete: function(){
				_this.animated = false;
			}
		});
	};
	move.left = function(e){
		e.preventDefault();
		if(this.activeItemNumber - 1 < 0){ return; }
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber -=1;
		this.items[this.activeItemNumber].classList.add('active');
	};
	move.right = function(e){
		e.preventDefault();
		if(this.activeItemNumber + 1 > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow && !this.loadingNewPage){ this.needNewPage(); this.loadingNewPage = true;}
		if( (this.activeItemNumber + 1) > this.items.length - 1){ return; }
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber +=1;
		this.items[this.activeItemNumber].classList.add('active');
	}
	move.bottom = function(e){
		if(this.animated) return;

		e.preventDefault();
		if( (this.activeItemNumber + this.imgInRow) > (this.items.length - 1  - (this.imgInRow * this.loadNewPageOnRow)) && !this.loadingNewPage){ this.needNewPage(); this.loadingNewPage = true; }	
		if( (this.activeItemNumber + this.imgInRow) > this.items.length -1 ){ return; }
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber += this.imgInRow;
		this.items[this.activeItemNumber].classList.add('active');

		var _this = this;
		var scrollTop = this.rootId.scrollTop;
		this.animated = true;
		animate({
			draw: function(progress){
				_this.rootId.scrollTop = scrollTop + 310 * progress;
			},
			duration: 500,
			complete: function(){
				_this.animated = false;
			}
		});
	}
	function animate(options) {
		var start = performance.now();
		requestAnimationFrame(function animate(time) {
		  var timeFraction = (time - start) / options.duration;
		  if (timeFraction > 1){
		  	timeFraction = 1;
		  	options.complete();
		  }

		  options.draw(timeFraction);
	
		  if (timeFraction < 1) {
		    requestAnimationFrame(animate);
		  }
		});
	}


	Gallary.prototype.setPage = function(arrLinksImg){
		this.lastLoadPage++;
		var html = "<div class='page'>";
		for(var i = 0; arrLinksImg.length > i; i++){
			html += "<div class='"+ this.rowClass +"'>";
			for(var j = 0; this.imgInRow > j && arrLinksImg.length > i; j++){
				html += "<div class='"+ this.itemClass +"' style='background-image: url("+ arrLinksImg[i] +")'></div>";
				i++;
			}
			html += "</div>";
			i--;
		}
		html += "</div>";
		insertPage.top.call(this, html)
		this.loadingNewPage = false;
		if(this.lastLoadPage == 1){
			this.items[0].classList.add(this.activeClass);
			if(this.cache){
				this.cache[this.lastLoadPage] = html;
			}
		}
	}


	var insertPage = {};
	insertPage.top = function(html){
		this.rootId.insertAdjacentHTML('beforeEnd', html);
	};
	insertPage.bottom = function(html){};

	var removePage = {};
	removePage.top = function(){};
	removePage.bottom = function(){};


	return window.Gallary = Gallary;
})();