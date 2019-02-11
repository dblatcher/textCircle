var circles = document.getElementsByClassName('circle');
for (var i = 0; i<circles.length; i++) {
	fitTextToCircle(circles[i]);
}

function fitTextToCircle(circle,options) {
	options = options || {};
	circle.style.lineHeight = "1em";
	circle.style.borderRadius = "50%";
	circle.style.padding = "0px";
	
	var cStyle = getComputedStyle(circle);
	var pxValueToNumber = function(v){return Number(v.substring(0,v.length-2))} 
		
	var text = options.text || circle.text || circle.innerText;
	circle.text = text;
	circle.innerText="";

	var holder = document.createElement('div');
	holder.classList.add('rowHolder');	
	holder.style.position = "relative";
	holder.style.top = "50%";
	holder.style.transform = "translateY(-50%)";
	holder.style.fontSize = "inherit";
	circle.appendChild(holder);

	var fontSize;
	if (options.fontSize) {
		fontSize = options.fontSize;
		circle.style.fontSize = fontSize + 'px';
	} else {
		fontSize = pxValueToNumber(cStyle.fontSize);
	}	
	
	if (options.circleSize) {
		circle.style.width = options.circleSize +'px';
		circle.style.height = options.circleSize +'px';
	};
	
	var availableSpan = 0,requiredSpan, rows, unusedSpace,propotionateValueOfWordsLeft,aligningToTop=false;
	var textArray = text.split(" ");
	var originalLength = textArray.length;
	
	aligningToTop = (circle.getAttribute('yAlign') === 'top');
	if (typeof(options.yAlign) !== "undefined") {
			aligningToTop = (options.yAlign === 'top');
	}
	
	if (!aligningToTop){
		var spaceSpan = findTotalRequiredSpan(fontSize,"-",circle);
		console.log(spaceSpan)
	}
	
	requiredSpan = findTotalRequiredSpan(fontSize,text,circle);
	addAllRows();		
	rows = holder.getElementsByClassName('row');
	unusedSpace = circle.clientHeight - (fontSize*rows.length);
	textArray = text.split(" ");
	fillAllRows();

	
	
	if (circle.getAttribute('adjust') === 'font' || options.adjust === 'font') {
		var failSafe = (options.precise)? 1000 : 20 , newFontSize;
		while (textArray.length) {
			
			if (options.precise){
				fontSize--;
			} else {
				propotionateValueOfWordsLeft =  1/ ((originalLength - textArray.length) /originalLength);			
				fontSize = Math.floor (fontSize / (Math.min(propotionateValueOfWordsLeft,1.2)) )
			}
			
			circle.style.fontSize = fontSize + 'px';
			requiredSpan = findTotalRequiredSpan(fontSize,text,circle);
			
			addAllRows();		
			rows = holder.getElementsByClassName('row');
			unusedSpace = circle.clientHeight - (fontSize*rows.length);
			textArray = text.split(" ");
			fillAllRows();
			if (failSafe-- < 0) {break};
		}
	
	}


	if (circle.getAttribute('adjust') == 'size' || options.adjust === 'size') {
		var failSafe = (options.precise)? 1000 : 20, newCircleDiameter,oldCircleDiameter;
		while (textArray.length) {
			oldCircleDiameter = (cStyle.boxSizing == "border-box") ? circle.offsetHeight : circle.clientHeight;
			
			if (options.precise){
				newCircleDiameter = oldCircleDiameter+1;
			} else {
				propotionateValueOfWordsLeft =  1/ ((originalLength - textArray.length) /originalLength);	
				newCircleDiameter = oldCircleDiameter*(Math.min(propotionateValueOfWordsLeft,1.2));				
			}
				
			circle.style.height = newCircleDiameter +'px';
			circle.style.width = newCircleDiameter +'px';
			
			addAllRows();		
			rows = holder.getElementsByClassName('row');
			unusedSpace = circle.clientHeight - (fontSize*rows.length);
			textArray = text.split(" ");
			fillAllRows();
			if (failSafe-- < 0) {break};
		}
	
	}
		
	function addAllRows() {
		while(holder.children.length){holder.removeChild(holder.firstElementChild)}
		var maxNumberRows = (circle.clientHeight - circle.clientHeight%fontSize) / fontSize;
		for (var i = 0; i<maxNumberRows; i++) {	
			if (!aligningToTop) { 
				rows = holder.getElementsByClassName('row');
				availableSpan = 0;
				for (var j = 0; j<rows.length; j++) {
					availableSpan += calculateWidth(rows[j],circle,circle.clientHeight%fontSize)
				};
				if (availableSpan > (requiredSpan - spaceSpan*rows.length) ){break};
			}
			addRowTo(holder,".");
		}
		
		function addRowTo(parent,text){
			var span = document.createElement('span');
			var row = document.createElement('div');
			span.innerText = text;
			row.classList.add('row');
			row.style.textAlign = 'center';
			row.style.minHeight = '1em';
			row.style.fontSize = 'inherit';
			row.appendChild(span);
			parent.appendChild(row);
		};
		
	}

	function fillAllRows() {
		for (var i = 0; i<rows.length; i++) {
			if (textArray.length > 0) {
				fillRow(rows[i], textArray, calculateWidth(rows[i],circle,unusedSpace));
			} else {
				rows[i].firstElementChild.innerText = "";
			}
		}
		
		function fillRow(row,words,widthLimit) {
			var span = row.firstElementChild;
			var oneRow = span.offsetHeight; 
			span.innerText = "";
			
			var firstTime = true, exceeded = false;
			
			do {
				if(firstTime){span.innerText = words[0]};
				if(!firstTime){span.innerText = span.innerText + ' ' +words[0]};
				firstTime = false;
				if (span.offsetWidth > widthLimit || span.offsetHeight>oneRow) {
					exceeded = true;
					
					span.innerText = span.innerText.substring(0, span.innerText.length - words[0].length-1);
					
				} else {
					words.shift();
					if (words.length === 0) {break;}
				};
				
			} while (!exceeded)
		};
		
	}
	
	function calculateWidth(row,circle,unusedSpace){
		var r = circle.clientWidth/2;
		var rowTop = unusedSpace/2 + row.offsetTop;
		var rowBottom = unusedSpace/2 + row.offsetTop + row.clientHeight;
		if (rowBottom<r) {
			var d = r - rowTop;
		} else {
			var d = rowBottom - r;
		}
		return 2* Math.sqrt(r*r - d*d) || 0;
	};

	function findTotalRequiredSpan(fontSize,text,circle) {
		var para = document.createElement('div');
		var span = document.createElement('span');
		para.style.width = "10000000px"; 
		para.style.opacity = '0';
		para.style.font = getComputedStyle(circle).font;
		span.innerText = text;

		para.appendChild(span)
		document.body.appendChild(para);
		var lengthNeeded = span.offsetWidth;
		document.body.removeChild(para);
		return lengthNeeded;
	}
	
}	

