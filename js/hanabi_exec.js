function fire(x,y){
  r = Math.random;
  colors = ['#ffcc00', '#ff0000', '#00ff00', '#00ccff', '#00ffcc'];
  var color, fw, size;
  size = 480;
  color = '#00ffcc';
  fw = new Hanabi({
    width: size,
    height: size,
    x: x,
    y: y,
    color: colors[~~(colors.length * r())],
    parent: "#right"
  });
  fw.fire();
}