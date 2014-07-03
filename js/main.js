var stepCount = 0;

svg = d3.select("#canvas").append("svg");

var stepper = step();

(function(){
})();

$("#executeBtn").on("click", function () {
	console.log('test');
});

$("#next").on("click", function () {
	stepper(1);
});

$("#prev").on("click", function () {
	stepper(-1);
});

function exec() {
  d3.select("#canvas").transition().duration(500).style("background-color", "black");
  svg.append("text")
    .attr("x", 10)
    .attr("y", 30)
    .attr("fill", "#fff")
    .text("stepCount :: "+stepCount);
}

function step() {

	var stepCount = 0;

  return function (num){
    stepCount = stepCount + num;

    svg.select("text")
      .attr("x", 10)
      .attr("y", 30)
      .attr("fill", "#fff")
      .text("stepCount :: "+stepCount);
  };
}

function getRandomArbitary() {

}

function getRandomArbitary(min, max) {
  return Math.random() * (max - min) + min;
}