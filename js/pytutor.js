svg = d3.select("#canvas").append("svg");

/*
  globalに定義される予定の変数が入る => undefinedなら表示はしない
  globalにある変数に代入するとREFが入る => 指定された番号のheapを参照
  Localスコープ、stack_to_renderのencoded_localsにあった
*/

function Var() {
  this.value;
  this.posX;
  this.posY;
  this.sizeX;
  this.sizeY;
}

function ExecutionVisualizer(domRootID, dat, params) {
  console.log(dat.trace);
  this.stepCount = 0;
  this.trace = dat.trace
  this.stepper = this.step();
  this.render(); // go for it!
  this.stepper(0);
  this.execLine;
  this.displayVar=[];
  this.displayScope=[];
}

ExecutionVisualizer.prototype.render = function() {
  console.log('render');
  d3.select("#canvas").transition().duration(500).style("background-color", "black");
  svg.append("text")
    .attr("x", 10)
    .attr("y", 30)
    .attr("fill", "#fff")
    .text("stepCount :: "+this.stepCount + "/");
}

ExecutionVisualizer.prototype.step = function() {

  return function (num){
    this.stepCount = this.stepCount + num;

    var oldStep = this.trace[this.stepCount-1];
    var curStep = this.trace[this.stepCount];

    svg.select("text")
      .attr("x", 10)
      .attr("y", 30)
      .attr("fill", "#fff")
      .text("stepCount :: "+this.stepCount+"/"+(this.trace.length-1)+" execLine:: "+parseInt(curStep.line));

    if(this.execLine || this.execLine == 0){
      editor.removeLineClass(this.execLine, "background", "highlighted-line");
    }

    if(this.stepCount!=0){
      //console.log(curStep.heap);
      console.log(curStep.globals);
      //とりあえずは0個目だけ
      if(curStep.stack_to_render[0]){
        console.log(curStep.stack_to_render[0].encoded_locals);
      }
      
      for(var item in curStep.globals) {
        if(oldStep.globals[item] != curStep.globals[item]){

          if(oldStep.globals[item] == "undefined"){
            console.log('defined ',item);
            this.displayVar.push(item);
            console.log(this.displayVar);
          }
          //console.log("diff found in "+item);
          //X座標、(width-Var.width)/2
          this.renderDataStructures();
        }
      }
      
      this.execLine = oldStep.line-1;
      editor.addLineClass(oldStep.line-1, "background", "highlighted-line"); 
    }

  };
}

ExecutionVisualizer.prototype.renderDataStructures = function() {
      // svg.select("text")
      // .attr("x", 10)
      // .attr("y", 60)
      // .attr("fill", "#fff")
      // .text();
}

// returns true if action successfully taken
ExecutionVisualizer.prototype.stepForward = function() {
  this.stepper(1);
}

// returns true if action successfully taken
ExecutionVisualizer.prototype.stepBack = function() {
  this.stepper(-1);
}


ExecutionVisualizer.prototype.scopeAnimate = function() {
  
}