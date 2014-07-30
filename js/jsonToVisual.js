var color = d3.scale.category20();
var height = $("#canvas").height();
var	width = $("#canvas").width();

var svg = d3.select("#canvas").append("svg")
		.attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.050)
    .distance(100)
    .charge(-100)
    .size([width, height]);

d3.json("js/basicExample.json", function(error, data){
  force
      .nodes(data[13].nodes)
      .links(data[13].links)
      .start();
	
	var drag = force.drag()
  		.on("dragstart", dragstart);

  var link = d3.select("svg").selectAll(".link")
      .data(data[13].links)
    	.enter().append("line")
      .attr("class", "link");

  var node = d3.select("svg").selectAll(".node")
      .data(data[13].nodes)
    	.enter().append("g")
      .attr("class", function(d) {
      	if(d.name == "global"){
      		d.fixed = true;
      		return "node fixed";
      	}else{
      		d.fixed = false;
      		return "node";
      	}
      } )
      .call(drag);

  d3.select("svg").selectAll(".fixed")
  		.attr("cx", function(d) { return 100; })
      .attr("cy", function(d) { return 100; });

  node.append("circle")
      .attr("r", function(d) { return d.value*2; });

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    d3.select("svg").selectAll(".fixed")
    .attr("transform", function(d) { 
    	d.x =	width/2;
    	d.y =height/2;
    	return "translate(" + d.x + "," + d.y + ")"; 
    });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  });
  console.log(d3.select("svg").selectAll(".fixed"));
	// node.select(".fixed").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	function dragstart(d) {
	}
});