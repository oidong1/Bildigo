svg = d3.select("#canvas").append("svg");

/*
  globalに定義される予定の変数が入る => undefinedなら表示はしない
  globalにある変数に代入するとREFが入る => 指定された番号のheapを参照
  Localスコープ、stack_to_renderのencoded_localsにあった

  方針
  D3はデータドリブンなので、表示したいデータ構造(json)を渡したい。
  -> 最初にまずtraceを加工（stepごとにではなく）
  -> Visualizerに渡す
  -> stepごとにデータをenter
  -> アニメーションして表示という形にしたい。

  想定するデータ構造のサンプル
  // 今値が変わってるスコープが欲しい
  step -> scope -> value
  [
    {
      "line" : 1,   //executed
      "notableScope": null,
      "nodes" : [
        { name: global, value: 100}
        { name: "a", value: 1, parent: global},
        { name: "i", value: undefined, parent: global},
        { name: "func", value : <<RAW VALUE>>, parent: global},
        { name: "testVar", value: 1, parent: "func"}
      ],
      "links" : [
        { source:0, target:1 }
        { source:0, target:2 }
        { source:0, target:3 }
        { source:3, target:3 }
      ]
    }
  ]

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
    nodes.push({ name: "global", value: 100});
    // 現在はグローバルのみなので
    for(var item in curStep.globals) {
      count++;
      nodes.push({ name: item, value: curStep.globals[item], parent:"global"});
      links.push({ "source": 0, "target": count});
      if(oldStep.globals[item] != curStep.globals[item]){ 
        notableScope = 'global';
        // if(oldStep.globals[item] == "undefined"){
        //   console.log('defined ',item);
        // }else{
        //   console.log('changed ',item);
        // }
      }
    }

    stepData.line = curStep.line;
    stepData.notableScope = notableScope;
    stepData.nodes = nodes;
    stepData.links = links;
    processedData.push(stepData); 

    console.log(curStep.globals);
  }

  console.log('processed');
  console.log(processedData);
  return processedData;
}


ExecutionVisualizer.prototype.render = function() {
  d3.select("#canvas").transition().duration(500).style("background-color", "black");
  svg.append("text")
    .attr("x", 10)
    .attr("y", 30)
    .attr("fill", "#fff")
    .text("stepCount :: "+this.stepCount + "/");
  console.log('rendered');
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
      .attr("fill", "#fff")
      .text("stepCount :: "+this.stepCount+"/"+(this.trace.length-1)+" execLine:: "+parseInt(curStep.line));
    
    this.execLine = oldStep.line-1;
    if(oldStep) editor.addLineClass(oldStep.line-1, "background", "highlighted-line");
  };
}
