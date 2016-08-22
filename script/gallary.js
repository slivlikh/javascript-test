(function(){
	 function Gallary(rootId, params){
	 	this.states = {
	 		animation: false,
	 		initNewPage: false,
	 		freezReqNewPage: false
	 	};
	 	
		this.rootId = document.getElementById(rootId); // св-во от пользователя
		this.rootId.setPage = window.Gallary.prototype.setPage.bind(this);
		this.rootId.style.top = 187 + 'px';
		this.rowClass = params.rowClass;
		this.rows = this.rootId.getElementsByClassName('row');
		this.currentRow = 1;
		this.itemClass = params.itemClass;
		this.activeClass = params.activeClass;
		this.imgInRow = params.imgInRow;
		this.lastLoadPage = 0;
		this.items = this.rootId.getElementsByClassName(this.itemClass);
		this.activeItemNumber = 0;
		this.loadNewPageOnRow = params.loadNewPageOnRow;
		initGallary.call(this, params.firstPage);

		var _this = this;
		return  this.rootId;
	}
	var move = {};
	move.top = function(e){
		e.preventDefault();
		this.currentRow -= 1;
		if( (this.activeItemNumber - this.imgInRow) < 0) return;
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber -= this.imgInRow;
		this.items[this.activeItemNumber].classList.add('active');
		animate.top.call(this);
		
	};
	move.left = function(e){
		e.preventDefault();
		if( (this.activeItemNumber - 1) < 0) return;
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber -= 1;
		this.items[this.activeItemNumber].classList.add('active');

		
		var newCurrentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(newCurrentRow < this.currentRow){
			this.currentRow -= 1;
			animate.top.call(this);
			this.currentRow = newCurrentRow;
		}
	};
	move.right = function(e){
		
		e.preventDefault();
		if( (this.activeItemNumber + 1) > (this.items.length - 1)) return;
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber += 1;
		this.items[this.activeItemNumber].classList.add('active');

		if(this.activeItemNumber > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow
			&& !this.states.freezReqNewPage){ 
			this.states.freezReqNewPage = true;
			this.rootId.dispatchEvent(events.needNewPage);		
		}
		var newCurrentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(newCurrentRow > this.currentRow){
			this.currentRow += 1;
			animate.bottom.call(this);
		}
	}
	move.bottom = function(e){
		if( (this.activeItemNumber + this.imgInRow) > (this.items.length - 1)) return;
		console.log('move bottom');
		e.preventDefault();
		this.currentRow += 1 ;
		this.items[this.activeItemNumber].classList.remove('active');
		this.activeItemNumber += this.imgInRow;
		this.items[this.activeItemNumber].classList.add('active');
		
		if(this.activeItemNumber > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow
			&& !this.states.freezReqNewPage){ 
			this.states.freezReqNewPage = true;
			this.rootId.dispatchEvent(events.needNewPage);		
		}
		animate.bottom.call(this);
		
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
		this.activeItemNumber -= (this.removingRowsLength * this.imgInRow);
		this.currentRow = Math.ceil( (this.activeItemNumber + 1) / this.imgInRow);
		if(this.currentRow == 1){
			this.rootId.style.top = 187 + 'px';	
		}else {
			this.rootId.style.top = 187 - ( (this.currentRow - 1) * 384) + 'px';
		}
	};
	removePage.bottom = function(){

	};
	function animate(options) {
		var start = performance.now();
		requestAnimationFrame(function animate(time) {
		  var timeFraction = (time - start) / options.duration;
		  if (timeFraction > 1){
		  	timeFraction = 1;
		  }
		  options.draw(timeFraction);
		  if (timeFraction < 1) {
		    requestAnimationFrame(animate);
		  }else{
		  	options.complete();
		  }
		});
	}
	animate.top = function(){
		this.states.animation = true;
		var topCss = parseInt(this.rootId.style.top);
		var _this = this;
		animate({
			draw: function(progress){
				_this.rootId.style.top = topCss + 384 * progress +'px';
			},
			duration: 100,
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
				_this.rootId.style.top = topCss - 384 * progress +'px';
			},
			duration: 300,
			complete: function(){
				_this.states.animation = false;
				_this.rootId.dispatchEvent(events.animationEnd);
			}
		});
	};
	var events = {};
	events.needNewPage = new CustomEvent("needNewPage", {
		detail: {
		  hazcheeseburger: true
		}
	});
	events.animationEnd =  new CustomEvent("animationEnd", {
		detail: {
		  hazcheeseburger: true
		}
	});
	events.endloadNewPage =  new CustomEvent("endloadNewPage", {
		detail: {
		  hazcheeseburger: true
		}
	});
	

	function initGallary(arrLinksImg){
		this.lastLoadPage++;
		var html = "";
		var needNewPageNumber = this.imgInRow * this.loadNewPageOnRow;
		if(needNewPageNumber < this.imgInRow){
			needNewPageNumber = this.imgInRow;
		}
		for(var i = 0; arrLinksImg.length > i; i++){
			html += "<div class='"+ this.rowClass +"'>";
			for(var j = 0; this.imgInRow > j && arrLinksImg.length > i; j++){
				html += "<div class='"+ this.itemClass +"' data-page='"+ this.lastLoadPage +"' data-need-new-page='"+ (i >= (arrLinksImg.length - needNewPageNumber)) +"'  style='background-image: url("+ arrLinksImg[i] +")'></div>";
				i++;
			}
			html += "</div>";
			i--;
		}
		this.rootId.insertAdjacentHTML('beforeEnd', html);
		this.items[0].classList.add(this.activeClass);
		var _this = this;
		document.addEventListener('keydown', function(e){
			if(_this.states.animation || _this.states.initNewPage) return;
			switch(e.which){
				case 37: move.left.call(_this, e); break;
				case 38: move.top.call(_this, e); break;
				case 39: move.right.call(_this, e); break;
				case 40: move.bottom.call(_this, e); break;
			}
		}, false);

		this.rootId.addEventListener('wheel', function(e){
			if(_this.states.animation || _this.states.initNewPage) return;
			if(e.deltaY === -100){
				move.top.call(_this, e);	
			}else{
				move.bottom.call(_this, e);
			}
		}, false);

		this.rootId.addEventListener('animationEnd', function(){
			if( _this.newLinksArr && _this.activeItemNumber > _this.items.length - 1 - _this.imgInRow * _this.loadNewPageOnRow){
				_this.states.initNewPage = true;
				insertingNewPage.call(_this, _this.newLinksArr);
				_this.newLinksArr = null;
			}
		});
		


	}
	Gallary.prototype.setPage = function(arrLinksImg){
		this.removingRowsLength = this.rows.length - this.loadNewPageOnRow;
		if(this.activeItemNumber > this.items.length - 1 - this.imgInRow * this.loadNewPageOnRow && !this.states.animation){
			this.states.initNewPage = true;
			insertingNewPage.call(this, arrLinksImg);
		}else {
			this.newLinksArr = arrLinksImg;
		}
	}
	

	
	function insertingNewPage(arrLinksImg){
		removePage.top.call(this);
		this.lastLoadPage++;
		var html = "";
		for(var i = 0; arrLinksImg.length > i; i++){
			html += "<div class='"+ this.rowClass +"'>";
			for(var j = 0; this.imgInRow > j && arrLinksImg.length > i; j++){
				html += "<div class='"+ this.itemClass +"' data-page='"+ this.lastLoadPage +"'  style='background-image: url("+ arrLinksImg[i] +")'></div>";
				i++;
			}
			html += "</div>";
			i--;
		}
		insertPage.bottom.call(this, html);
		this.states.initNewPage = false;
		this.states.freezReqNewPage = false;
	}
	 	
	return window.Gallary = Gallary;
})();