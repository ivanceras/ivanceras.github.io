/// loads webassembly or not
var q = window.location.search;
console.log("q=",q);
if (q=="?wasm=1"){
    load_wasm = true;
}
if (q=="?wasm=0"){
    load_wasm = false;
}
if (load_wasm){
    console.log("Loading webassembly version");
    /// fetch wasm file and inject the js file
    window.Module = {};
    var wasm_file = "svgbob-editor.wasm";
    var wjs_file = "svgbob-editor.w.js";
    fetch(wasm_file)
      .then(response => response.arrayBuffer())
      .then(bytes => {
        Module.wasmBinary = bytes;

        console.log("wasm has loaded..");
        var script = document.createElement('script');
        script.src = wjs_file
        document.body.appendChild(script);
      });
}else{
    console.log("Using asmjs version of this app");
    var asmjs_file = "svgbob-editor.js";
    var script = document.createElement('script');
    script.src = asmjs_file
    document.body.appendChild(script);
}
