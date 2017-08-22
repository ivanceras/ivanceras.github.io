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
      return response.text();
    }).then(function(content) {
        texteditor.textContent = content;
        ace_edit.destroy();
        updateAceListener();
        //ace_edit.setValue(content);
        initiateRender();
    });
}

function initAceEditor(){
    ace_edit.setShowPrintMargin(false);
    ace_edit.setTheme("ace/theme/dawn");
    //ace_edit.setTheme("ace/theme/solarized_dark");
    ace_edit.session.setMode("ace/mode/markdown");
    ace_edit.setOptions({enableBasicAutocompletion: false, 
        enableLiveAutocompletion: false});
    ace_edit = ace.edit("texteditor");
    ace_edit.on("change", 
        throttle(initiateRender,1000)
    );
}

initAceEditor();

function updateAceListener(){
    initAceEditor();
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


function spongedown_parse(md){
    worker.postMessage(
        {'cmd':'spongedown_parse',
         'data':md
        });
}

function parse_bob(bob){
    worker.postMessage(
        {'cmd':'parse_bob',
         'data':bob
        });
}

function parse_comic(comic){
    worker.postMessage(
        {'cmd':'parse_comic',
         'data':comic
        });
}

function parse_csv(csv){
    worker.postMessage(
        {'cmd':'parse_csv',
         'data':csv
        });
}

function initiateRender(){
    console.log("ace editor is changed...");
    var input = ace_edit.getValue();
    if (open_file.endsWith(".md")){ 
        spongedown_parse(input);
    }
    else if (open_file.endsWith(".bob")){
        parse_bob(input)
    }
    else if (open_file.endsWith(".comic")){
        parse_comic(input);
    }
    else if (open_file.endsWith(".csv")){
        parse_csv(input);
    }
}

worker.addEventListener("message", (e)=>{
    let evt = e.data.event;
    switch (evt){
        case "load":
            console.log("wasm is now ready");
            initiateRender();
            break;
        default:
            console.log("unknown event:", evt, e.data);
    }
});

if (worker){
    console.log("Listening to worker");
    worker.addEventListener("message", (e)=>{
        let caller = e.data.caller;
        let data = e.data.data;
        switch (caller){
            case "spongedown_parse":
                updateRender(data);
                break;
            case "parse_bob":
                updateRender(data);
                break;
            case "parse_comic":
                updateRender(data);
                break;
            case "parse_csv":
                updateRender(data)
                break;
            default:
                console.log("unknown caller:", caller, e.data);
        }
    });
}else{
    console.log("worker is still not yet loaded...");
}

function highlightCode(){
    let pre_code = document.querySelectorAll("pre code[class^='language']");
    console.log('pre code[class^="language"]', pre_code);
    pre_code.forEach(function(block) {
        hljs.highlightBlock(block);
    });
}

function updateRender(render_html){
    if (window.spongedown_parse){
        var txt = ace_edit.getValue();
        render.innerHTML = render_html;
        initiateBob();
        highlightCode();
        //hljs.initHighlighting();
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

