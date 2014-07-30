var width;
var height;
var scale;


$(window).load(function(){
	init();

	int_data("test_1",0,200,200);
	int_data("test_2",1000,400,200);
	int_data("test_3",-15,600,200);
});

var init = function(){
	console.log("intialize");
	height = $("#canvas").innerHeight();
	width = $("#canvas").innerWidth();

	scale = 0.3;

	console.log(height);
	console.log(width);

	var svg = d3.select("#canvas").append("svg");
	$("#canvas>svg").attr("id","svg");
	$("#canvas>svg").attr("width",width);
	$("#canvas>svg").attr("height",height);
}

var int_data = function(name,value,x,y){
	var ab_value=0;
	var plus_minus;
	if(value<0){
		plus_minus="MINUS";
		ab_value=-value;
	}else if(value>0){
		plus_minus="PLUS";
		ab_value=value;
	}else if(value==0)plus_minus="ZERO";
	else return -1;
	

	var r;
	r=calc_radius(ab_value)*scale;
	console.log("radius:"+r);

	var g = d3.select("#svg").append("g");
	g.attr("class","variable");
	g.attr("transform","translate("+x+","+y+")");

	var under_cir = g.append("g");
	under_cir.attr("style","fill:rgb(255,255,255);z-index:0;position:absolute;");

	var inner_cir = under_cir.append("circle");
	var w=r/2-10;
	var rr=10+r/2;
	console.log(rr+","+w);
	inner_cir.attr("r",rr);
	//inner_cir.attr("fill","rgb(255,255,255)");
	inner_cir.attr("stroke-width",w);
	inner_cir.attr("style","z-index:2;position:abusolute;");

	var txt = g.append("text");
	if(value>0){
		txt.text("+");
		txt.attr("dy","0.35em");
		inner_cir.attr("stroke","rgba(255,0,0,0.5)");
	}else if(value<0){
		txt.text("-");
		txt.attr("dy","0.30em");
		inner_cir.attr("stroke","rgba(0,0,255,0.5)");
	}else if(value==0){
		txt.text("0");
		txt.attr("dx","0.02em");
		txt.attr("dy","0.35em");
		inner_cir.attr("stroke","rgba(0,0,0,1)");
	}
	txt.attr("class","plus_minus");
	txt.attr("style","font-size: "+(45*scale)+"px;");
	txt.attr("text-anchor","middle");

	var value_name = g.append("text");
	value_name.text(name);
	value_name.attr("dy","-2em");
	value_name.attr("text-anchor","middle");

	var value_text = g.append("text");
	value_text.text(value);
	value_text.attr("dy","2.7em");
	value_text.attr("text-anchor","middle");
}

var calc_radius = function(value){
	var i=1;
	var r=0;;
	if(value>10){
		while(Math.pow(10,i)<value){
			i++;
		}
		r=9*i+(value-Math.pow(10,i-1))/Math.pow(10,i-1);
	}else{
		r=value;
	}
	if(r!=0)r=r*5+22;
	else r=23;
	console.log("radius:"+r);
	return r;
}

