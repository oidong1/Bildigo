var color = d3.scale.category20();
var height = $("#canvas").height();
var width = $("#canvas").width();

var svg = d3.select("#canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.050)
    .distance(100)
    .charge(-300)
    .size([width, height]);

/*
  globalに定義される予定の変数が入る => undefinedなら表示はしない
  globalにある変数に代入するとREFが入る => 指定された番号のheapを参照
  Localスコープ、stack_to_renderのencoded_localsにあった

  実装maybe -> 配列,ローカルスコープ,object

*/

function ExecutionVisualizer(dat, params) {
  this.stepCount = 0;
  this.trace = this.dataProcessor(dat.trace);
  this.stepper = this.step();
  this.render();
  this.stepper(0);
  this.execLine;
  this.displayVar=[];
  this.displayScope=[];
}

ExecutionVisualizer.prototype.dataProcessor = function(trace) {
  
  console.log(trace);

  var oldStep;
  var curStep;
  var processedData = [];

  for(var i=0; i < trace.length; i++){
    
    console.log("step: "+i);

    var stepData = {};

    oldStep = (i)?trace[i-1]:trace[0];
    curStep = trace[i];
    notableScope = null;

    //ローカルスコープの取得やりたいけどまだこれから
    if(curStep.stack_to_render[0]){
      console.log(curStep.stack_to_render[0].encoded_locals);
    }
    
    var nodes = [],
      links = [];
    var count = 0;
    if(i == 0)  nodes.push({ name: "global", value: 100});
    // 現在はグローバルのみなので
    for(var item in curStep.globals) {
      count++;
      if(oldStep.globals[item] != curStep.globals[item]){ 
        notableScope = 'global';
        
        //REFとか言われた時の処理法
        if(curStep.globals[item] instanceof Array){
          console.log(curStep.heap[curStep.globals[item][1]],'aaa');
        }

        if(oldStep.globals[item] == "undefined"){          
          nodes.push({ name: item, value: curStep.globals[item], parent:"global"});
          links.push({ "source": 0, "target": count});
          console.log('defined ',item);
        }else{
          nodes.push({ name: item, value: curStep.globals[item], parent:"global"});
          console.log('changed ',item);
        }
      }
    }

    stepData.line = oldStep.line;
    stepData.notableScope = notableScope;
    stepData.nodes = nodes;
    stepData.links = links;
    processedData.push(stepData); 

    console.log(curStep.globals);
  }

  console.log('processed');
  console.log(JSON.stringify(processedData));
  return processedData;
}


ExecutionVisualizer.prototype.render = function() {
  d3.select("#canvas").transition().duration(500).style("background-color", "#fff");
  svg.append("text")
    .attr("x", 10)
    .attr("y", 30)
    .attr("fill", "#000")
    .text("stepCount :: "+this.stepCount + "/");
}

ExecutionVisualizer.prototype.step = function() {

  return function (num){
    this.stepCount = this.stepCount + num;
    if(this.stepCount>this.trace.length-1 || this.stepCount<0) this.stepCount = this.stepCount-num;

    var oldStep = (this.stepCount)? this.trace[this.stepCount-1]:0;
    var curStep = this.trace[this.stepCount];

    if(this.execLine || this.execLine == 0){
      editor.removeLineClass(this.execLine, "background", "highlighted-line");
    }

    svg.select("text")
      .attr("x", 10)
      .attr("y", 30)
      .attr("fill", "#000")
      .text("stepCount :: "+this.stepCount+"/"+(this.trace.length-1)+" execLine:: "+parseInt(curStep.line));
    
    this.execLine = oldStep.line-1;
    if(oldStep) editor.addLineClass(oldStep.line-1, "background", "highlighted-line");

    this.visualize(this.trace,this.stepCount-1);

  };
}

ExecutionVisualizer.prototype.visualize = function(data,step) {
    force
      .nodes(data[0].nodes)
      .links(data[0].links);
  var stepCount = 0;

  var drag = force.drag()
      .on("dragstart", dragstart);

  var node = d3.select("svg").selectAll(".node");
  var link = d3.select("svg").selectAll(".link");
  var linked = link.data(force.links());
  var noded = node.data(force.nodes());

  update();
  next(step);

  force.on("tick", function() {
    noded.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    d3.select("svg").selectAll(".fixed")
    .attr("transform", function(d) { 
      d.x = width/2;
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
        .attr("r", function(d) { return sizeCalc(d.value); });

    noded.select("circle").transition()
      .duration(1000)
      .attr("fill", function(d) { return typeCol(d.value); })
      .attr("r", function(d) { return sizeCalc(d.value);; });

    nodeG.append("text")
        .attr("class", "name")
        .style("font-size","13px")
        .attr("dx", function(d) { return sizeCalc(d.value)+5; })
        .attr("dy", "1.35em")
        .text(function(d) { return d.name })

    noded.select(".name").transition()
      .duration(1000)
      .attr("dx", function(d) { return sizeCalc(d.value)+5; })
      .attr("dy", "1.35em")
      .text(function(d) { return d.name })

    nodeG.append("text")
        .attr("class", "value")
        .style("font-size","15px")
        .attr("dx", 0 )
        .attr("dy", "-15px")
        .text(function(d) { return (d.name=="global")?"":d.value; })

    noded.select(".value").transition()
      .duration(1000)
      .attr("dx", 0)
      .attr("dy", "0em")
      .text(function(d) { return (d.name=="global")?"":d.value; })

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
    //  linksがあればdefineでaddNode、なければ変更でupdateNode
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

  function sizeCalc(val){
    if(isNaN(parseInt(val))){
      return val.length*2;
    }
    return Math.abs(val)*2;
  }

  function typeCol(val){
    var color;
    if(isNaN(parseInt(val))){
      console.log(val,"aaa");
    }else if(val>0){
      color = "#FF0000";
    }else if(val<0){
      color = "#0000FF";
    }else if(val == 0){
      color = "FF00FF";
    }
    return color;
  }
}
