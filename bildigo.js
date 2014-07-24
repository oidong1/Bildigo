(function() {
  var ExecutionVisualizer, svg;

  ExecutionVisualizer = function(dat, params) {
    console.log(dat.trace);
    this.stepCount = 0;
    this.trace = dat.trace;
    this.stepper = this.step();
    this.render();
    this.stepper(0);
    this.execLine;
    this.displayVar = [];
    this.displayScope = [];
  };

  svg = d3.select("#canvas").append("svg");

  ExecutionVisualizer.prototype.render = function() {
    console.log("render");
    d3.select("#canvas").transition().duration(500).style("background-color", "black");
    svg.append("text").attr("x", 10).attr("y", 30).attr("fill", "#fff").text("stepCount :: " + this.stepCount + "/");
  };

  ExecutionVisualizer.prototype.step = function() {
    return function(num) {
      var curStep, item, oldStep;
      fire(100, 0);
      this.stepCount = this.stepCount + num;
      oldStep = this.trace[this.stepCount - 1];
      curStep = this.trace[this.stepCount];
      svg.select("text").attr("x", 10).attr("y", 30).attr("fill", "#fff").text("stepCount :: " + this.stepCount + "/" + (this.trace.length - 1) + " execLine:: " + parseInt(curStep.line));
      if (this.execLine || this.execLine === 0) {
        editor.removeLineClass(this.execLine, "background", "highlighted-line");
      }
      if (this.stepCount !== 0) {
        console.log(curStep.globals);
        if (curStep.stack_to_render[0]) {
          console.log(curStep.stack_to_render[0].encoded_locals);
        }
        for (item in curStep.globals) {
          if (oldStep.globals[item] !== curStep.globals[item]) {
            if (oldStep.globals[item] === "undefined") {
              console.log("defined ", item);
              this.displayVar.push(item);
              console.log(this.displayVar);
            }
            this.renderDataStructures();
          }
        }
        this.execLine = oldStep.line - 1;
        editor.addLineClass(oldStep.line - 1, "background", "highlighted-line");
      }
    };
  };

  ExecutionVisualizer.prototype.renderDataStructures = function() {};

  ExecutionVisualizer.prototype.scopeAnimate = function() {};

}).call(this);
