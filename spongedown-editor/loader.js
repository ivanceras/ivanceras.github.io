var load_wasm = true;
var use_worker = true;
var worker;
var asmjs_file = "build/spongedown-editor.js"; // stand-alone asmjs 
var wasm_file = "build/spongedown-editor.wasm"; // wasm file
var wjs_file = "build/spongedown-editor.w.js"; // w.js file that links the wasm file
var param_wasm = getParameterByName("wasm");
var use_wasm = parseInt(param_wasm) > 0;
console.log("use_wasm: ", param_wasm, use_wasm);
if (use_wasm){
    load_wasm = true;
}else{
    load_wasm = false;
}

if (!window.WebAssembly){
    console.warn("No webassembly support, doing fallback to asmjs");
    load_wasm = false;
}
if (load_wasm){
    if (use_worker){
        console.log("using worker in wasm...");
        worker = new Worker("wasm_worker.js");
    }
    else{
        Module = {}
        console.log("Loading webassembly version");
        /// fetch wasm file and inject the js file
        fetch(wasm_file)
          .then(response => response.arrayBuffer())
          .then(bytes => {
                Module.wasmBinary = bytes;
                console.log("wasm has loaded..");
                console.log("attaching as script");
                var script = document.createElement('script');
                script.src = wjs_file
                document.body.appendChild(script);
          });
    }
}else{
    if (use_worker){
        console.log("loading worker...");
        worker = new Worker(asmjs_file);
    }
    else{
        console.log("Using asmjs version of this app");
        var script = document.createElement('script');
        script.src = asmjs_file
        document.body.appendChild(script);
    }
}




