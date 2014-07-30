var basicExample = '\
var a = "A";\n\
\n\
a = 1;\n\
\n\
if(a > 0) {\n\
    a = a + 1;\n\
} else {\n\
    a = a - 1;\n\
}\n\
\n\
for(var i = 0; i < 5; i++) {\n\
    a = a + 1;\n\
}\n\
';

var closureExample = '\
function outer(){\n\
    var x = 1;\n\
\n\
    return　function (){\n\
        console.log(x);\n\
		x = x + 1;\n\
    };\n\
\n\
}\n\
\n\
var f =  outer(); \n\
f();\n\
f();\n\
f();\n\
';

var bubbleSortExample = '\
var data = [100,321,41];\n\
for (i=0; i<data.length-1; i++)\n\
{\n\
	for (j=0; j<data.length-i-1; j++)\n\
	{\n\
		if (data[j] > data[j+1])\n\
		{\n\
			n = data[j];\n\
			data[j]   = data[j+1];\n\
			data[j+1] = n;\n\
		}\n\
	}\n\
}\n\
';

var bogoSortExample = '\
var shuffle = function(data) {\n\
    for(var j, x, i = data.length; i;j = Math.floor(Math.random() * i), x = data[--i], data[i] = data[j], data[j] = x);\n\
    return data;\n\
};\n\
\n\
var isSorted = function(data){\n\
    for(var i=1; i<data.length; i++) {\n\
        if (data[i-1] > data[i]) { return false; }\n\
    }\n\
    return true;\n\
}\n\
\n\
var bogo = function(data){\n\
    var sorted = false;\n\
    while(sorted == false){\n\
        data = shuffle(data);\n\
        sorted = isSorted(data);\n\
    }\n\
    return v;\n\
}\n\
console.log(bogo([0,1,3,4,5,61,6,14,13]));\n\
';
