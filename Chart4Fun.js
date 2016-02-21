var colors = new Array("FF0000","00FFFF","FFFF00","00FF00","0000FF");

Math.radian = function(deg){
	return deg * Math.PI / 180;
}



function Chart(config, data){
	var instance = this;
	
	if(config != null && config.exists){
		this.config = config;
	}
	if(data != null && data.exists()){
		this.chartData = data;
	} else {
		this.chartData = new ChartDataObject();
	}
	this.context = null;
	
	this.draw = function(){
		instance.context = document.getElementById(instance.config.chartId).getContext("2d");
		var boarder = instance.config.boarderSize+instance.config.legendSize+instance.config.pointSize;
		instance.widthMin = 0 + boarder;
		instance.heightMax = 0 + boarder;
		instance.widthMax = instance.context.canvas.width - boarder;
		instance.heightMin = instance.context.canvas.height - boarder;
		
		var streamsLength = instance.chartData.getStreamLength();
		for(var i = 0; i < streamsLength; i++){
			var stream = instance.chartData.getStream(i);
			drawStream(stream, colors[i]);
		}
	};
	
	function drawStream(stream,color){
		for(var i=0; i < stream.length; i++){		
			drawPoint(stream[i],color);
		}
	}
	
	function drawPoint(point,color,clean){
		var size = instance.config.pointSize;
		if(point.x*size < instance.widthMax && point.y*size < instance.heightMin){			// rotate(PI/180)*RADIAN)
			
			instance.context.fillStyle = "#"+color;
			instance.context.fillRect(instance.widthMin + (point.x*size)-size/2, instance.heightMin - (point.y*size)-size/2,size,size);
		}
	}
	
	this.drawLegend = function (){
		instance.context.fillStyle = "#"+instance.config.legendColor;
		var boarder = instance.config.boarderSize+instance.config.legendSize;
		var xTitle = instance.chartData.chartTitleX;
		var yTitle = instance.chartData.chartTitleY;
		var size = (config.legendSize/5);
		instance.context.font=instance.config.legendSize+"px sans-serif";
		instance.context.fillText(xTitle,instance.context.canvas.width/size,instance.context.canvas.height);
		instance.context.save();
		instance.rotateCanvas(270);
		instance.context.fillText(yTitle,instance.context.canvas.width/size,boarder/1.2);
		instance.context.restore();
		
		var boarder = instance.config.boarderSize+instance.config.legendSize;
		var height = instance.context.canvas.height - (boarder*2);
		for(var w = 0; w < instance.widthMax; w+=Math.floor(instance.widthMax/10)){
			drawPoint({x:w,y:-1*(instance.config.pointSize)},000000);
		}
		instance.context.fillRect(boarder,boarder,instance.config.pointSize,height);
		instance.context.fillRect(boarder,height+boarder,instance.widthMax,instance.config.pointSize);
		
	};

	this.rotateCanvas = function(deg){
		var w = instance.context.canvas.width/2;
		var h = instance.context.canvas.height/2;
		instance.context.translate(w,h);
		instance.context.rotate(Math.radian(deg));
		instance.context.translate(-w,-h);
	};
	
	this.clearWithoutLegend = function(){
		var boarder = instance.config.boarderSize+instance.config.legendSize+instance.config.pointSize;
		instance.context.clearRect(boarder,boarder,instance.widthMax, instance.context.canvas.height - (boarder*2));
	}

	this.clear = function(){
		instance.context.clearRect(0,0,instance.context.canvas.width, instance.context.canvas.height);
	}
	
	this.exists = function(){
		var exist = true;
		var atts = Object.keys(this);
		for(var i=0; i< atts.length; i++){
			if(typeof(this[atts[i]]) != "function"){
				exist = exist && (this[atts[i]] != null);
			}
		}
		return exist;
	}
};




function ChartConfig(){
	this.chartId = "canvas";
	this.chartColors = colors;
	this.legendColor = "000000";
	this.pointSize = 2;
	this.boarderSize = 2;
	this.legendSize = 10;

	this.exists = function(){
		var exist = true;
		var atts = Object.keys(this);
		for(var i=0; i< atts.length; i++){
			if(typeof(this[atts[i]]) != "function"){
				exist = exist && (this[atts[i]] != null);
			}
		}
		return exist;
	}
};

function ChartDataObject(){
	
	this.chartDataTypeX = null;
	this.chartDataTypeY = null;
	this.chartTitleX = null;
	this.chartTitleY = null;
	
	var chartData = [];
	var max = null;
	var min = null;
	
	function checkStreamExists(stream){
		return chartData.length > stream;
	}	
	this.add = function(stream,x,y){
		if(this.chartDataTypeX == null && this.chartDataTypeY == null){
			this.chartDataTypeX = typeof(x);
			this.chartDataTypeY = typeof(y);
		}
		if(!checkStreamExists(stream)){
			chartData[stream] = [];
			min = {x:x,y:y};
			max = {x:x,y:y};
		} else{
			// set min max data
			if(min.x > x){
				min.x = x;
			}else if(max.x < x){
				max.x = x;
			}	
			if(min.y > y){
				min.y = y;
			}else if(max.y < y){
				max.y = y;
			}
		}
		var d = chartData[stream];
		d[d.length] = {x:x,y:y};
	};
	this.remove = function(stream){
		if(!checkStreamExists()){
			Console.log("The Stream does not exist");
		} else {
			chartData[stream] = null;
		}
	};
	this.clear = function(){
		chartData = [];
	};
	this.getStreamLength = function(){
		return chartData.length;
	};
	this.getStream = function(stream){
		return chartData[stream];
	};
	this.getMax = function(){
		return max;
	};
	this.getMin = function(){
		return min;
	};	
	this.exists = function(){
		var exist = true;
		var atts = Object.keys(this);
		for(var i=0; i< atts.length; i++){
			if(typeof(this[atts[i]]) != "function"){
				exist = exist && (this[atts[i]] != null);
			}
		}
		return exist;
	}
}