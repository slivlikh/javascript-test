(function(){
	 function Gallary(rootId, params){
	 	this.states = {
	 		animation: false,
	 		freezReqBottomPage: false,
	 		freezReqTopPage: true
	 	};
	 	this.cache = {
	 		prevPage: [],
	 		currentPage: [],
	 		nextPage: []
	 	};
		this.rootId = document.getElementById(rootId);
		this.needBottomPage = params.needBottomPage;
		this.needTopPage = params.needTopPage;
		this.rootId.setBottomPage = window.Gallary.prototype.setBottomPage.bind(this);
		this.rootId.setTopPage = window.Gallary.prototype.setTopPage.bind(this);
		this.rowClass = params.rowClass;
		this.rowMarginBottom = params.rowMarginBottom;
		this.rows = this.rootId.getElementsByClassName('row');
		this.currentRow = 1;
		this.itemClass = params.itemClass;
		this.itemHeight = params.itemHeight;
		this.rootId.style.top = this.itemHeight/2 + 'px';
		this.activeClass = params.activeClass;
		this.imgInRow = params.imgInRow;
		this.currentPage = 0;
		this.items = this.rootId.getElementsByClassName(this.itemClass);
		this.activeItemNumber = 0;
		this.anumationDuration = params.anumationDuration;
		this.loadNewPageOnRow = params.loadNewPageOnRow;
		this.needSpliceCacheTopPage = true;
		initGallary.call(this, params.firstPage);
		return  this.rootId;
	}
	function initGallary(arrLinksImg){
		var html;
		var _this = this;
		var needNewPageNumber = this.imgInRow * this.loadNewPageOnRow;
		if(needNewPageNumber < this.imgInRow){
			needNewPageNumber = this.imgInRow;
		};
		this.cache.currentPage = arrLinksImg;
		html = prepearHtml.call(_this, this.cache.currentPage);
		this.currentPage++;
		this.needBottomPage(this.currentPage + 1);
		insertPage.bottom.call(this, html);
		this.items[0].className += ' '+this.activeClass;
		document.addEventListener('keydown', function(e){
			if(_this.states.animation) return;
			switch(e.which){
				case 37: move.left.call(_this, e); break;
				case 38: move.top.call(_this, e); break;
				case 39: move.right.call(_this, e); break;
				case 40: move.bottom.call(_this, e); break;
			}
		}, false);

		this.rootId.addEventListener('wheel', function(e){
			if(_this.states.animation) return;
			if(e.deltaY === -100){
				move.top.call(_this, e);	
			}else{
				move.bottom.call(_this, e);
			}
		}, false);
	}
	var move = {};
	move.top = function(e){
		e.preventDefault();
		if( (this.activeItemNumber - this.imgInRow) < 0) return;
		this.currentRow -= 1;
		this.items[this.activeItemNumber].className = this.items[this.activeItemNumber].className.replace(this.activeClass, '');
		this.activeItemNumber -= this.imgInRow;	
		this.items[this.activeItemNumber].className +=' ' + this.activeClass;

		if(this.activeItemNumber + 1  > this.imgInRow * this.loadNewPageOnRow 
		&& this.activeItemNumber + 1 < this.items.length  - this.imgInRow * this.loadNewPageOnRow){
			this.states.freezReqTopPage = false;
			this.states.freezReqBottomPage = false;
		}
		this.states.animation = true;
		animate.top.call(this);
		
	};
	move.left = function(e){
		e.preventDefault();
		if( (this.activeItemNumber - 1) < 0) return;
		this.items[this.activeItemNumber].className = this.items[this.activeItemNumber].className.replace(this.activeClass, '');
		this.activeItemNumber -= 1;
		this.items[this.activeItemNumber].className +=' ' + this.activeClass;
		var newCurrentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(newCurrentRow < this.currentRow){
			this.currentRow -= 1;	
			if(this.activeItemNumber + 1  > this.imgInRow * this.loadNewPageOnRow 
			&& this.activeItemNumber + 1 < this.items.length  - this.imgInRow * this.loadNewPageOnRow){
				this.states.freezReqTopPage = false;
				this.states.freezReqBottomPage = false;
			}
			this.states.animation = true;
			animate.top.call(this);
		}
	};
	move.right = function(e){
		e.preventDefault();
		if( (this.activeItemNumber + 1) > (this.items.length - 1)) return;
		this.items[this.activeItemNumber].className = this.items[this.activeItemNumber].className.replace(this.activeClass, '');
		this.activeItemNumber += 1;
		this.items[this.activeItemNumber].className +=' ' + this.activeClass;
		
		var newCurrentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(newCurrentRow > this.currentRow){
			this.currentRow += 1;
			if(this.activeItemNumber + 1  > this.imgInRow * this.loadNewPageOnRow 
				&& this.activeItemNumber + 1 < this.items.length  - this.imgInRow * this.loadNewPageOnRow){
				this.states.freezReqTopPage = false;
				this.states.freezReqBottomPage = false;
			}
			this.states.animation = true;
			animate.bottom.call(this);
		}
	}
	move.bottom = function(e){
		e.preventDefault();
		if( (this.activeItemNumber + this.imgInRow) > (this.items.length - 1)) return;
		this.currentRow += 1 ;
		this.items[this.activeItemNumber].className = this.items[this.activeItemNumber].className.replace(this.activeClass, '');
		this.activeItemNumber += this.imgInRow;
		this.items[this.activeItemNumber].className +=' ' + this.activeClass;

		if(this.activeItemNumber + 1  > this.imgInRow * this.loadNewPageOnRow 
		&& this.activeItemNumber + 1 < this.items.length  - this.imgInRow * this.loadNewPageOnRow){
			this.states.freezReqTopPage = false;
			this.states.freezReqBottomPage = false;
		}
		this.states.animation = true;
		animate.bottom.call(this);
	}
	Gallary.prototype.setBottomPage = function(arrLinksImg){
		this.cache.nextPage = arrLinksImg;
	}

	Gallary.prototype.setTopPage = function(arrLinksImg){
		this.cache.prevPage = arrLinksImg;
	}
	var insertPage = {};
	insertPage.top = function(html){
		this.rootId.insertAdjacentHTML('afterbegin', html);
	};
	insertPage.bottom = function(html){
		this.rootId.insertAdjacentHTML('beforeEnd', html);
	};
	var removePage = {};
	removePage.top = function(){
		for(var i = 0; this.removingRowsLength > i; i++){
			this.rootId.removeChild(this.rows[0]);
		}
		this.activeItemNumber -= (this.removingRowsLength * this.imgInRow);
		this.currentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(this.currentRow == 1){
			this.rootId.style.top = this.itemHeight/2 + 'px';	
		}else {
			this.rootId.style.top = this.itemHeight/2 - ( (this.currentRow - 1) * (this.itemHeight + this.rowMarginBottom)) + 'px';
		}
	};
	removePage.bottom = function(){
		var rowsLen = this.rows.length;
		for(var i = this.loadNewPageOnRow; rowsLen > i; i++ ){
			this.rootId.removeChild(this.rows[this.loadNewPageOnRow]);
		}
	};
	function prepearHtml(arrLinksImg){
		var html = "";
		for(var i = 0; arrLinksImg.length > i; i++){
			html += "<div class='"+ this.rowClass +"'>";
			for(var j = 0; this.imgInRow > j && arrLinksImg.length > i; j++){
				html += "<div class='"+ this.itemClass +"'  style='background-image: url("+ arrLinksImg[i] +")'></div>";
				i++;
			}
			html += "</div>";
			i--;
		}
		return html;
	}
	 	function animate(options) {
		var requestAnimationFrame = window.requestAnimationFrame || 
									window.mozRequestAnimationFrame ||
                            		window.webkitRequestAnimationFrame || 
                            		window.msRequestAnimationFrame ||
                            		setTimeout;
		var start;
		if(typeof performance.now === 'function'){
			start = performance.now();
		}else {
			start = Date.now();
		}
		requestAnimationFrame(function animateDrow(time) {
		if(!time){ time = Date.now(); }
		  var timeFraction = (time - start) / options.duration;
		  if (timeFraction > 1){
		  	timeFraction = 1;
		  }
		  options.draw(timeFraction);
		  if (timeFraction < 1) {
		    requestAnimationFrame(animateDrow);
		  }else{
		  	options.complete();
		  }
		}, options.duration/60);
	}
	animate.top = function(){
		var topCss = parseInt(this.rootId.style.top);
		var _this = this;
		animate({
			draw: function(progress){
				_this.rootId.style.top = topCss + (_this.itemHeight + _this.rowMarginBottom) * progress +'px';
			},
			duration: _this.anumationDuration,
			complete: function(){
				_this.states.animation = false;
				if( (_this.activeItemNumber  < _this.imgInRow * _this.loadNewPageOnRow) 
					&& _this.cache.prevPage  && _this.currentPage > 1){
					if(_this.needSpliceCacheTopPage){
						var copyPrevPage = _this.cache.prevPage.concat([]);
						copyPrevPage.splice(-_this.imgInRow * _this.loadNewPageOnRow);
						var html = prepearHtml.call(_this, copyPrevPage);
						_this.needSpliceCacheTopPage = false;
					}else{
						var html = prepearHtml.call(_this, _this.cache.prevPage);
					}
					_this.states.freezReqBottomPage = true;
					removePage.bottom.call(_this);
					var currItemsLen = _this.items.length;
					insertPage.top.call(_this, html);
					_this.currentPage--;
					_this.cache.nextPage = _this.cache.currentPage;
					_this.cache.currentPage = _this.cache.prevPage;
					_this.cache.prevPage = null;
					_this.activeItemNumber = _this.items.length - currItemsLen + _this.activeItemNumber;
					_this.currentRow = Math.ceil( (_this.activeItemNumber + 1) / _this.imgInRow);
					_this.rootId.style.top = -(_this.currentRow - 1) * (_this.itemHeight + _this.rowMarginBottom) + _this.itemHeight/2 + 'px';
					if(_this.currentPage > 1){
						_this.needTopPage(_this.currentPage - 1);
					}					
				}
			}
		});
	};
	animate.bottom = function(){
		var _this = this;
		var topCss = parseInt(this.rootId.style.top);
		animate({
			draw: function(progress){
				_this.rootId.style.top = topCss - (_this.itemHeight + _this.rowMarginBottom) * progress +'px';
			},
			duration: _this.anumationDuration,
			complete: function(){
				_this.states.animation = false;
				if(_this.activeItemNumber > _this.items.length - 1 - _this.imgInRow * _this.loadNewPageOnRow
					&& _this.cache.nextPage && !_this.states.freezReqBottomPage){
					_this.needSpliceCacheTopPage = true;
					_this.states.freezReqTopPage = true;
					_this.currentPage++;
					_this.removingRowsLength = _this.rows.length - _this.loadNewPageOnRow;
					removePage.top.call(_this);
					var html = prepearHtml.call(_this, _this.cache.nextPage);
					var currItemsLen = _this.items.length;
					_this.activeItemNumber = _this.items.length - currItemsLen + _this.activeItemNumber;
					_this.currentRow = Math.ceil( (_this.activeItemNumber + 1) / _this.imgInRow);
					insertPage.bottom.call(_this, html);
					_this.cache.prevPage = _this.cache.currentPage;
					_this.cache.currentPage = _this.cache.nextPage;
					_this.cache.nextPage = null;
					_this.needBottomPage(_this.currentPage + 1);
				}
			}
		});
	};
	window.Gallary = Gallary;
})();