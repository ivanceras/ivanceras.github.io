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


//#https://stackoverflow.com/questions/27078285/simple-throttle-in-js
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

function download_svg(filename, content){
    download(filename, content, "image/svg+xml");
}
function download_txt(filename, content){
    download(filename, content, "text/plain");
}

function download(filename, content, mime){
    var pom = document.createElement('a');
    pom.setAttribute('href','data:'+mime+';charset=utf-8,'+encodeURIComponent(content));
    pom.setAttribute('download', filename);
    if (document.createEvent){
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
        console.log("click event dispatched");
    }
    else{
        pom.click();
        console.log("clicked");
    }
}
