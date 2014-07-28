/*

Online Python Tutor
https://github.com/pgbovine/OnlinePythonTutor/

Copyright (C) 2010-2012 Philip J. Guo (philip@pgbovine.net)

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
var backend_script = 'exec';

var markedLine;

var appMode = 'edit'; // 'edit' or 'display'

var preseededCode = null;     // if you passed in a 'code=<code string>' in the URL, then set this var
var preseededCurInstr = null; // if you passed in a 'curInstr=<number>' in the URL, then set this var


var myVisualizer = null; // singleton ExecutionVisualizer instance

var keyStuckDown = false;

var code; // CodeMirror object that contains the input text

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {mode: "javascript", lineNumbers: true});  

editor.getDoc().setValue(basicExample);

$(document).ready(function() {

  $("#executeBtn").attr('disabled', false);
  $("#executeBtn").click(function() {

    $('#executeBtn').html("Please wait...");
    $('#executeBtn').attr('disabled', true);

    $.get(backend_script,
          {user_script : editor.value,
           cumulative_mode: $('#cumulativeModeSelector').val()},
          function(dataFromBackend) {
            var trace = dataFromBackend.trace;
            // don't enter visualize mode if there are killer errors:
            if (!trace ||
                (trace.length == 0) ||
                (trace[trace.length - 1].event == 'uncaught_exception')) {

              if (trace.length == 1) {
                var errorLineNo = trace[0].line - 1; /* CodeMirror lines are zero-indexed */
                if (errorLineNo !== undefined) {
                  // highlight the faulting line in code
                  code.focus();
                  code.setCursor(errorLineNo, 0);
                  code.setLineClass(errorLineNo, null, 'errorLine');

                  code.setOption('onChange', function() {
                    code.setLineClass(errorLineNo, null, null); // reset line back to normal
                    code.setOption('onChange', null); // cancel
                  });
                }

                alert(trace[0].exception_msg);
              }
              else if (trace[trace.length - 1].exception_msg) {
                alert(trace[trace.length - 1].exception_msg);
              }
              else {
                alert("Whoa, unknown error!");
              }
            }
            else {
              var startingInstruction = 0;

              // only do this at most ONCE, and then clear out preseededCurInstr
              if (preseededCurInstr && preseededCurInstr < trace.length) { // NOP anyways if preseededCurInstr is 0
                startingInstruction = preseededCurInstr;
                preseededCurInstr = null;
              }

              myVisualizer = new ExecutionVisualizer(dataFromBackend,
                                                     {startingInstruction:  startingInstruction,
                                                      updateOutputCallback: function() {$('#urlOutput,#embedCodeOutput').val('');},
                                                      //allowEditAnnotations: true,
                                                     });

              $("#next").on("click", function () {
                myVisualizer.stepper(1);
              });

              $("#prev").on("click", function () {
                myVisualizer.stepper(-1);
              });
              // set keyboard bindings
              $(document).keydown(function(k) {
                if (!keyStuckDown) {
                  if (k.keyCode == 37) { // left arrow
                    if (myVisualizer.stepBack()) {
                      k.preventDefault(); // don't horizontally scroll the display
                      keyStuckDown = true;
                    }
                  }
                  else if (k.keyCode == 39) { // right arrow
                    if (myVisualizer.stepForward()) {
                      k.preventDefault(); // don't horizontally scroll the display
                      keyStuckDown = true;
                    }
                  }
                }
              });

              $(document).keyup(function(k) {
                keyStuckDown = false;
              });
              $('#executeBtn').html("done");
              $('#executeBtn').attr('disabled', true);
              
            }
          },
          "json");
  });
  
  // log a generic AJAX error handler
  $(document).ajaxError(function() {
    alert("Server error");
    $('#executeBtn').html("ReExecution");
    $('#executeBtn').attr('disabled', false);
  });

});

