/// loads webassembly or not
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

 function debounce(func, wait, immediate) {
    var timeout;
    if (immediate){
        console.log("doing immediate");
    }
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
