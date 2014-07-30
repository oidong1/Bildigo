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
      .links(data[13].links);
	
	var test ={
				"name": "test",
				"value": 10,
				"parent": "global"
	};

	var test2 ={
				"name": "test2",
				"value": 8,
				"parent": "global"
	};
	var testLink = {
				"source": 0,
				"target": 3
	};
	var testLink2 = {
				"source": 0,
				"target": 4
	};

	var drag = force.drag()
  		.on("dragstart", dragstart);

  var node = d3.select("svg").selectAll(".node");
  var link = d3.select("svg").selectAll(".link");

  update();
  setTimeout(function(){ addNode(test,testLink); }, 1000);
  setTimeout(function(){ addNode(test2,testLink2); }, 2000);

  force.on("tick", function() {
    noded.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    d3.select("svg").selectAll(".fixed")
    .attr("transform", function(d) { 
    	d.x =	width/2;
    	d.y =height/2;
    	return "translate(" + d.x + "," + d.y + ")"; 
    });

    linked.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  });
	// node.select(".fixed").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	
	function update(){
		
		node = d3.select("svg").selectAll(".node");
  	link = d3.select("svg").selectAll(".link");

		linked = link.data(force.links());
    linked.enter().append("line")
      .attr("class", "link");

  	noded = node.data(force.nodes());
    console.log(noded);
    noded.enter().append("g")
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

	  noded.append("circle")
	      .attr("r", function(d) { return d.value*2; });

	  noded.append("text")
	      .attr("dx", 12)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name });

	  noded.exit().remove();

	  force.start();
	}
	
	function addNode(nodeData,linkData) {
		console.log("hello");
		data[13].nodes.push(nodeData);
 		data[13].links.push(linkData);
  	update();
	}

	function dragstart(d) {
	}
});