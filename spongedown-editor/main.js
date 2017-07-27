var open_file = "example.md";

var specified_file = getParameterByName("file");
if (specified_file){
    open_file = specified_file
}

var texteditor = document.querySelector("#texteditor");
var ace_edit;
ace_edit = ace.edit("texteditor");

function fetchDoc(url){
    console.log("fetching..."+url);
    fetch(url).then(function(response) {
        console.log("got response: ", response);
      return response.text();
    }).then(function(content) {
        /*
        texteditor.innerHTML = content;
        ace_edit.destroy();
        updateAceListener();
        console.log("has undo: ", ace_edit.getSession().getUndoManager().hasUndo());
        */
        ace_edit.setValue(content);
        updateRender();
    });
}

function updateAceListener(){
    ace_edit = ace.edit("texteditor");
    ace_edit.setShowPrintMargin(false);
    ace_edit.setTheme("ace/theme/dawn");
    //ace_edit.setTheme("ace/theme/solarized_dark");
    ace_edit.session.setMode("ace/mode/markdown");
    ace_edit.on("change", 
        throttle(updateRender,2000)
    );
}

window.onload = (e) => {
    fetchDoc(open_file);
};


var dragged = false;
var selectedView = "#edit";
var grip = document.querySelector("#grip");
var render = document.querySelector("#render");
var behaviors = ["full_size", "condensed_size", "full_card"];
var active_behavior = "full_size";
var active_keybinding = "";


function updateRender(){
    console.log("ace editor change: "+txt);
    if (window.spongedown_parse){
        var txt = ace_edit.getValue();
        var render_html = window.spongedown_parse(txt);
        render.innerHTML = render_html;
        console.log("Typesetting..");
        //MathJax.Hub.Typeset(render);
        renderMathInElement(render);
    }
    else{
        console.log("spongedown has not yet loaded.. Please wait..");
    }
}

grip.addEventListener("mousedown",
    () => { dragged = true; }
);
  
window.addEventListener("mouseup",
    () => { dragged = false; }
);

window.addEventListener("mousemove",
    throttle(
         (e)=>{
             var x = e.pageX; //TODO: deduct x from texteditor-left
             if(dragged){
                var percent = x * 100.0 / window.innerWidth;
                if (percent < 10) {
                    percent = 10;
                }
                if (percent > 90) {
                    percent = 90;
                }
                texteditor.style.width  = percent+'%';
                render.style.left = (percent + 0.5)+'%';
                grip.style.left = percent+'%';
                ace_edit.resize();
             }
        },200)
);

var edit_btn = document.querySelector("#edit_btn");
var view_btn = document.querySelector("#view_btn");
edit_btn.addEventListener("click",
    (e) => { setSelectedView("#edit"); }
);
view_btn.addEventListener("click",
    (e) => { setSelectedView("#view"); }
);

function setSelectedView(selector){
    if(selector == "#edit"){
        texteditor.style.visibility = "visible";
        render.style.visibility = "hidden";
        view_btn.classList.remove("selected");
        edit_btn.classList.add("selected");
    }
    else if (selector == "#view"){
        texteditor.style.visibility = "hidden";
        render.style.visibility = "visible";
        view_btn.classList.add("selected");
        edit_btn.classList.remove("selected");
    }
    else{
        console.error("unknown selector: "+selector);
    }
    selectedView = selector;
}

function restoreSelectedView(){
    setSelectedView(selectedView);
}

window.addEventListener("resize",
    throttle(respondToResize,200)
)

function respondToResize(){
    if (isResponsive()){
        if (window.innerWidth <= 700) {
            condense();
        }
        else{
            full_size();
        }
    }
    console.log("responsive: "+isResponsive());
    resetWidths();
}


function setActiveBehavior(){
    if (active_behavior == "full_house"){
        full_house();
    }
    else if(active_behavior == "condensed_size"){
        condensed_size();
    }
    else if(active_behavior == "full_card"){
        full_card();
    }
}

setActiveBehavior();

/// fullsize and consdensed is responsive, while fullcard is not
function isResponsive(){
    return (active_behavior == "full_size" 
        || active_behavior == "condensed_size");
}

function changeBehavior(bev){
    behaviors.forEach((b) => {
        if (b != bev){
            document.body.classList.remove(b);
        }
    });
    document.body.classList.add(bev);
    active_behavior = bev;
}

function full_size(){
    changeBehavior('full_size');
    resetVisibility();
}

function full_card(){
    changeBehavior('full_card');
    resetVisibility();
}

function condense(){
    changeBehavior('condensed_size');
    restoreSelectedView();
}

function resetWidths(){
    texteditor.style.top = "var(--texteditor-top)";
    texteditor.style.width = "var(--texteditor-width)";

    render.style.top = "var(--render-top)";
    render.style.left = "var(--render-left)";
    render.style.width = "var(--render-width)";

    grip.style.left =  "var(--grip-left)";
    grip.style.width = "var(--grip-width)";
    ace_edit.resize();
}

function resetVisibility(){
    texteditor.style.visibility = "var(--texteditor-visibility)";
    render.style.visibility = "var(--render-visibility)";
    grip.style.visibility = "var(--grip-visibility)";
}

var keybinding_default = document.querySelector("#keybinding-default");
var keybinding_vim = document.querySelector("#keybinding-vim");
var keybinding_emacs = document.querySelector("#keybinding-emacs");
keybinding_default.addEventListener("click",
    () => {setKeybindingDefault();}
);
keybinding_vim.addEventListener("click",
    () => {setKeybindingVim();}
);
keybinding_emacs.addEventListener("click",
    () => {setKeybindingEmacs();}
);

function setKeybindingDefault(){
    ace_edit.setKeyboardHandler("");
}

function setKeybindingVim(){
    ace_edit.setKeyboardHandler("ace/keyboard/vim");
}

function setKeybindingEmacs(){
    ace_edit.setKeyboardHandler("ace/keyboard/emacs");
}

respondToResize();

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
} 

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
