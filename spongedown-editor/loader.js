var load_wasm = true;
var asmjs_file = "build/spongedown-editor.js"; // stand-alone asmjs 
var wasm_file = "build/spongedown-editor.wasm"; // wasm file
var wjs_file = "build/spongedown-editor.w.js"; // w.js file that links the wasm file
var q = window.location.search;
console.log("q=",q);
if (q=="?wasm=1"){
    load_wasm = true;
}
if (q=="?wasm=0"){
    load_wasm = false;
}
if (!window.WebAssembly){
    console.warn("No webassembly support, doing fallback to asmjs");
    load_wasm = false;
}
if (load_wasm){
    window.Module = {};
    console.log("Loading webassembly version");
    /// fetch wasm file and inject the js file
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
    var script = document.createElement('script');
    script.src = asmjs_file
    document.body.appendChild(script);
}

