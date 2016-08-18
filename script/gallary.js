(function(){
	 function Gallary(rootId, params, needNewPage){
		needNewPage();
		this.rootId = document.getElementById(rootId); // св-во от пользователя
		this.rootId.style.top = 187 + 'px';

		this.rowClass = params.rowClass;
		this.rows = this.rootId.getElementsByClassName('row');
		this.currentRow = 1;
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
		this.needNewPage = needNewPage; // вызывается когда нужно получить новые фото
		var _this = this;
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
			console.log(e);
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
		e.preventDefault();
		if(this.animated || (this.activeItemNumber - this.imgInRow < 0) ) return;
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber -= this.imgInRow;
		this.items[this.activeItemNumber].classList.add('active');
		animate.top.call(this);
		
	};
	move.left = function(e){
		e.preventDefault();
		if(this.animated || ((this.activeItemNumber - 1) < 0) ) return;
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber -=1;
		this.items[this.activeItemNumber].classList.add('active');
		var newCurrentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(newCurrentRow < this.currentRow){
			animate.top.call(this);
		}
	};
	move.right = function(e){
		if(this.animated || ((this.activeItemNumber + 1) > (this.items.length - 1)) ) return;
		e.preventDefault();
		if(this.activeItemNumber + 1 > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow && !this.loadingNewPage){ this.needNewPage(); this.loadingNewPage = true;}
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber +=1;
		this.items[this.activeItemNumber].classList.add('active');
		var newCurrentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(newCurrentRow > this.currentRow){
			animate.bottom.call(this);
		}
	}
	move.bottom = function(e){
		if(this.animated || ((this.activeItemNumber + this.imgInRow) > (this.items.length - 1)) ) return;
		e.preventDefault();
		if( (this.activeItemNumber + this.imgInRow) > (this.items.length - 1  - (this.imgInRow * this.loadNewPageOnRow)) && !this.loadingNewPage){ this.needNewPage(); this.loadingNewPage = true; }	
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber += this.imgInRow;
		this.items[this.activeItemNumber].classList.add('active');
		animate.bottom.call(this);
		
	}

	Gallary.prototype.setPage = function(arrLinksImg){
		this.lastLoadPage++;
		var html = "";
		for(var i = 0; arrLinksImg.length > i; i++){
			html += "<div class='"+ this.rowClass +"'>";
			for(var j = 0; this.imgInRow > j && arrLinksImg.length > i; j++){
				html += "<div class='"+ this.itemClass +"' style='background-image: url("+ arrLinksImg[i] +")'></div>";
				i++;
			}
			html += "</div>";
			i--;
		}
		this.loadingNewPage = false;
		if(this.lastLoadPage === 1){
			this.rootId.insertAdjacentHTML('beforeEnd', html);
			this.items[0].classList.add(this.activeClass);
		}else {
			this.removingRowsLength = this.rows.length - this.loadNewPageOnRow;
			insertPage.bottom.call(this, html);
			var _this = this;
			//setTimeout(function(){
			//	removePage.top.call(_this);
			//	_this.rootId.style.top = 187 + 'px';
			//}, 200);			
		}
	}
	var insertPage = {};
	insertPage.top = function(html){
		
	};
	insertPage.bottom = function(html){
		this.rootId.insertAdjacentHTML('beforeEnd', html);
	};
	var removePage = {};
	removePage.top = function(){
		for(var i = 0; this.removingRowsLength > i; i++){
			this.rootId.removeChild(this.rows[0]);
		}
		this.activeItemNumber -= this.removingRowsLength * this.imgInRow;
	};
	removePage.bottom = function(){

	};
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
	animate.top = function(){
		var topCss = parseInt(this.rootId.style.top);
		var _this = this;
		this.animated = true;
		this.currentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		animate({
			draw: function(progress){
				_this.rootId.style.top = topCss + 384 * progress +'px';
			},
			duration: 500,
			complete: function(){
				_this.animated = false;
			}
		});
	};
	animate.bottom = function(){
		var _this = this;
		var topCss = parseInt(this.rootId.style.top);
		this.currentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		this.animated = true;
		animate({
			draw: function(progress){
				_this.rootId.style.top = topCss - 384 * progress +'px';
			},
			duration: 500,
			complete: function(){
				_this.animated = false;
			}
		});
	};
	return window.Gallary = Gallary;
})();