(function(){
	 function Gallary(rootId, params){
	 	this.states = {
	 		animation: false,
	 		initNewPage: false,
	 		freezReqBottomPage: false,
	 		freezReqTopPage: true
	 	};
	 	
		this.rootId = document.getElementById(rootId); // св-во от пользователя
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
		this.lastLoadPage = 1;
		this.items = this.rootId.getElementsByClassName(this.itemClass);
		this.activeItemNumber = 0;
		this.anumationDuration = params.anumationDuration;
		this.loadNewPageOnRow = params.loadNewPageOnRow;
		initGallary.call(this, params.firstPage);
		return  this.rootId;
	}
	function initGallary(arrLinksImg){
		var html;
		var _this = this;
		var needNewPageNumber = this.imgInRow * this.loadNewPageOnRow;
		if(needNewPageNumber < this.imgInRow){
			needNewPageNumber = this.imgInRow;
		}
		html = prepearHtml.call(this, arrLinksImg);
		this.rootId.insertAdjacentHTML('beforeEnd', html);
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

		this.rootId.addEventListener('animationEnd', function(){
			if( _this.newLinksArr && _this.lastLoadPagePosition === "bottom" && _this.activeItemNumber > _this.items.length - 1 - _this.imgInRow * _this.loadNewPageOnRow){
				removePage.top.call(_this);
				var html = prepearHtml.call(_this, arrLinksImg);
				insertPage.bottom.call(_this, html);
				_this.states.freezReqBottomPage = false;
				_this.newLinksArr = null;
			}
			if( _this.newLinksArr && _this.lastLoadPagePosition === "top" && _this.activeItemNumber <  _this.imgInRow * _this.loadNewPageOnRow){
				var html = prepearHtml.call(_this, arrLinksImg);
				removePage.bottom.call(_this);
				var currItemsLen = _this.items.length;
				insertPage.top.call(_this, html);
				_this.activeItemNumber = _this.items.length - currItemsLen + _this.activeItemNumber;
				_this.currentRow = Math.ceil( (_this.activeItemNumber + 1) / _this.imgInRow);
				_this.rootId.style.top = -(_this.currentRow - 1) * (_this.itemHeight + _this.rowMarginBottom) + _this.itemHeight/2 + 'px';
				_this.states.freezReqTopPage = false;
				_this.newLinksArr = null;
			}
		});
		this.rootId.addEventListener('needTopPage', function(){
			_this.states.freezReqTopPage = true;
			_this.states.freezReqBottomPage = true;
		});
		this.rootId.addEventListener('needBottomPage', function(){
			_this.states.freezReqTopPage = true;
			_this.states.freezReqBottomPage = true;
		});
	}
	var move = {};
	move.top = function(e){
		e.preventDefault();
		if( (this.activeItemNumber - this.imgInRow) < 0) return;

		this.currentRow -= 1;
		this.items[this.activeItemNumber].className = this.items[this.activeItemNumber].className.replace(this.activeClass, '');
		this.activeItemNumber -= this.imgInRow;


		if(this.lastLoadPage !== 1 && this.activeItemNumber  < this.imgInRow * this.loadNewPageOnRow && !this.states.freezReqTopPage){
			this.rootId.dispatchEvent(events.needTopPage);
		}else if(this.activeItemNumber  >= this.imgInRow * this.loadNewPageOnRow){
			this.states.freezReqTopPage = false;
			this.states.freezReqBottomPage = false;
		}
		this.items[this.activeItemNumber].className +=' ' + this.activeClass;
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
			animate.top.call(this);
			this.currentRow = newCurrentRow;

			if(this.lastLoadPage !== 1 && this.activeItemNumber  < this.imgInRow * this.loadNewPageOnRow && !this.states.freezReqTopPage){
				this.rootId.dispatchEvent(events.needTopPage);
			}else if(this.activeItemNumber  >= this.imgInRow * this.loadNewPageOnRow){
				this.states.freezReqTopPage = false;
				this.states.freezReqBottomPage = false;
			}

		}
	};
	move.right = function(e){
		e.preventDefault();
		if( (this.activeItemNumber + 1) > (this.items.length - 1)) return;
		this.items[this.activeItemNumber].className = this.items[this.activeItemNumber].className.replace(this.activeClass, '');
		this.activeItemNumber += 1;
		this.items[this.activeItemNumber].className +=' ' + this.activeClass;
		if(this.activeItemNumber > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow
			&& !this.states.freezReqBottomPage){ 
			this.rootId.dispatchEvent(events.needBottomPage);		
		}else if(this.activeItemNumber > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow) {
			this.states.freezReqTopPage = false;
			this.states.freezReqBottomPage = false;
		}


		var newCurrentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(newCurrentRow > this.currentRow){
			this.currentRow += 1;
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
		if(this.activeItemNumber > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow
			&& !this.states.freezReqBottomPage){ 
			this.rootId.dispatchEvent(events.needBottomPage);		
		}else if(this.activeItemNumber > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow) {
			this.states.freezReqTopPage = false;
			this.states.freezReqBottomPage = false;
		}
		animate.bottom.call(this);
	}

	
	Gallary.prototype.setBottomPage = function(arrLinksImg){
		this.lastLoadPage++;
		this.removingRowsLength = this.rows.length - this.loadNewPageOnRow;
		if(this.activeItemNumber > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow && !this.states.animation){
			removePage.top.call(this);
			var html = prepearHtml.call(this, arrLinksImg);
			insertPage.bottom.call(this, html);
			this.states.freezReqBottomPage = false;
		}else {
			this.lastLoadPagePosition = 'bottom';
			this.newLinksArr = arrLinksImg;
		}
	}

	Gallary.prototype.setTopPage = function(arrLinksImg){
		this.lastLoadPage--;
		if(arrLinksImg.length > (this.imgInRow * this.loadNewPageOnRow) ) {
			arrLinksImg.splice(-this.imgInRow * this.loadNewPageOnRow);
		}

		if(this.activeItemNumber < this.imgInRow * this.loadNewPageOnRow && !this.states.animation){
			var html = prepearHtml.call(this, arrLinksImg);
			removePage.bottom.call(this);
			var currItemsLen = this.items.length;
			insertPage.top.call(this, html);
			this.activeItemNumber = this.items.length - currItemsLen + this.activeItemNumber;
			this.currentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
			this.rootId.style.top = -(this.currentRow - 1) * (this.itemHeight + this.rowMarginBottom) + this.itemHeight/2 + 'px';
			this.states.freezReqTopPage = false;
		}else {
			this.lastLoadPagePosition = 'top';
			this.newLinksArr = arrLinksImg;
		}
		
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

	var events = {};
	events.needBottomPage = new CustomEvent("needBottomPage");
	events.needTopPage = new CustomEvent("needTopPage");
	events.animationEnd =  new CustomEvent("animationEnd");
	

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
		this.states.animation = true;
		var topCss = parseInt(this.rootId.style.top);
		var _this = this;
		animate({
			draw: function(progress){
				_this.rootId.style.top = topCss + (_this.itemHeight + _this.rowMarginBottom) * progress +'px';
			},
			duration: _this.anumationDuration,
			complete: function(){
				_this.states.animation = false;
				_this.rootId.dispatchEvent(events.animationEnd);
			}
		});
	};
	animate.bottom = function(){
		this.states.animation = true;
		var _this = this;
		var topCss = parseInt(this.rootId.style.top);
		animate({
			draw: function(progress){
				_this.rootId.style.top = topCss - (_this.itemHeight + _this.rowMarginBottom) * progress +'px';
			},
			duration: _this.anumationDuration,
			complete: function(){
				_this.states.animation = false;
				_this.rootId.dispatchEvent(events.animationEnd);
			}
		});
	};
	window.Gallary = Gallary;
})();