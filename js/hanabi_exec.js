function fire(){
  r = Math.random;
  colors = ['#ffcc00', '#ff0000', '#00ff00', '#00ccff', '#00ffcc'];
  console.log("fire");
  var color, fw, size, x, y;
  size = 450;
  x = 100;
  y = 100;
  color = '#00ffcc';
  fw = new Hanabi({
    width: size,
    height: size,
    x: x - size,
    y: y - size,
    color: colors[(colors.length * r())],
    parent: "#canvas"
  });
  fw.fire();
}