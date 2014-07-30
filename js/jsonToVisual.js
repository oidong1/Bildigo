var color = d3.scale.category20();
var height = $("#canvas").height();
var	width = $("#canvas").width();

var svg = d3.select("#canvas").append("svg")
		.attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.050)
    .distance(100)
    .charge(-300)
    .size([width, height]);

d3.json("js/basicExample.json", function(error, data){
  force
      .nodes(data[0].nodes)
      .links(data[0].links);
	var stepCount = 0;
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
	var	linked = link.data(force.links());
  var	noded = node.data(force.nodes());

  update();
  // setTimeout(function(){ addNode(test,testLink); }, 1000);
  // setTimeout(function(){ addNode(test2,testLink2); }, 2000);
  setInterval(function(){ next(1); }, 1000);
  //updateNode({"name": "global","value": 100});
 	update();

  force.on("tick", function() {
    noded.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    d3.select("svg").selectAll(".fixed")
    .attr("transform", function(d) { 
    	d.x =	width/2;
    	d.y = height/2;
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
  	noded = node.data(force.nodes());
		linked.enter().append("line")
      .attr("class", "link");

    nodeG = noded.enter().append("g")
      .attr("class", function(d) {
      	if(d.name == "global"){
      		d.fixed = true;
      		return "node fixed";
      	}else{
      		d.fixed = false;
      		return "node";
      	}
      } ).call(force.drag);
    nodeC = nodeG.append("circle")
	      .attr("r", function(d) { console.log(d.value); return d.value*2; });

	  noded.select("circle").transition()
	    .duration(1000)
	    .attr("r", function(d) { console.log(d.value); return d.value*2; });

    nodeG.append("text")
	      .attr("dx", 12)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name })

	  noded.exit().remove();
	  force.start();
	}
	
	function addNode(nodeData,linkData) {
		data[0].nodes.push(nodeData);
 		data[0].links.push(linkData);
  	update();
	}

	function updateNode(nodeData) {
		for(var i =0; i<data[0].nodes.length; i++){
			if(data[0].nodes[i].name == nodeData.name){
				data[0].nodes[i].value = nodeData.value;
			}
		}
  	update();
	}
	function next(step){		
		stepCount += step;
		if(stepCount>data.length-1 || stepCount<0) stepCount = stepCount-step;
		console.log(stepCount);
		//	linksがあればdefineでaddNode、なければ変更でupdateNode
		if(data[stepCount].links.length==0){
			console.log(data[stepCount].nodes);
			for(var i in data[stepCount].nodes){
				updateNode(data[stepCount].nodes[i]);
			}
		}else{
			console.log(data[stepCount].nodes[0]);
			addNode(data[stepCount].nodes[0],data[stepCount].links[0]);
		}
	}
	function dragstart(d) {
	}
});