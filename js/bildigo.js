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
      "global" : {
        "a" : 1,
        "i" : undefined,
        "func" : {
          "testVar" : 1
        }
      }
    },
    {
      "line" : 1,   //executed
      "notableScope": "func",
      "global" : {
        "a" : 1,
        "i" : undefined,
        "func" : {
          "testVar" : 1
        }
      }
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
