
var wasm_file = "build/spongedown-editor.wasm"; // wasm file
var wjs_file = "build/spongedown-editor.w.js"; // w.js file that links the wasm file

Module = {}
console.log("Loading webassembly version");
/// fetch wasm file and inject the js file
fetch(wasm_file)
  .then(response => response.arrayBuffer())
  .then(bytes => {
    Module.wasmBinary = bytes;
    console.log("wasm has loaded..");
    console.log("attaching as script");
    self.importScripts(wjs_file);
  });
