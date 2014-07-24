#
#  globalに定義される予定の変数が入る => undefinedなら表示はしない
#  globalにある変数に代入するとREFが入る => 指定された番号のheapを参照
#  Localスコープ、stack_to_renderのencoded_localsにあった
#
#  方針
#  D3はデータドリブンなので、表示したいデータ構造(json)を渡したい。
#  -> 最初にまずtraceを加工（stepごとにではなく）
#  -> Visualizerに渡す
#  -> stepごとにデータをenter
#  -> アニメーションして表示という形にしたい。
#  想定するデータ構造のサンプル
#
#

svg = d3.select("#canvas").append("svg")

class ExecutionVisualizer
  @stepCount = 0
  @trace
  @stepper = @step()
  @render()
  @stepper 0
  @execLine
  @displayVar = []
  @displayScope = []

  render: ->
    console.log "render"
    d3.select("#canvas").transition().duration(500).style "background-color", "black"
    svg.append("text").attr("x", 10).attr("y", 30).attr("fill", "#fff").text "stepCount :: " + @stepCount + "/"

  step : ->
    (num) ->
      fire 100, 0
      @stepCount = @stepCount + num
      oldStep = @trace[@stepCount - 1]
      curStep = @trace[@stepCount]
      svg.select("text").attr("x", 10).attr("y", 30).attr("fill", "#fff").text "stepCount :: " + @stepCount + "/" + (@trace.length - 1) + " execLine:: " + parseInt(curStep.line)
      editor.removeLineClass @execLine, "background", "highlighted-line"  if @execLine or @execLine is 0
      unless @stepCount is 0
        
        #console.log(curStep.heap);
        console.log curStep.globals
        
        #とりあえずは0個目だけ
        console.log curStep.stack_to_render[0].encoded_locals  if curStep.stack_to_render[0]
        for item of curStep.globals
          unless oldStep.globals[item] is curStep.globals[item]
            if oldStep.globals[item] is "undefined"
              console.log "defined ", item
              @displayVar.push item
              console.log @displayVar
            
            #console.log("diff found in "+item);
            #X座標、(width-Var.width)/2
            @renderDataStructures()
        @execLine = oldStep.line - 1
        editor.addLineClass oldStep.line - 1, "background", "highlighted-line"
