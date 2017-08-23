
function setLightTheme(){
    let body = document.body;
    body.classList.remove("dark");
    body.classList.add("light");
    let light = document.querySelector("[href='highlight.css']")
    light.disabled = false;
    let dark = document.querySelector("[href='tomorrow-night.css']")
    dark.disabled = true;
    ace_edit.setTheme("ace/theme/github");
}

function setDarkTheme(){
    let body = document.body;
    body.classList.remove("light");
    body.classList.add("dark");
    let light = document.querySelector("[href='highlight.css']")
    light.disabled = true;
    let dark = document.querySelector("[href='tomorrow-night.css']")
    dark.disabled = false;
    ace_edit.setTheme("ace/theme/ambiance");
}

let btn_light_theme = document.querySelector("#light-theme");
let btn_dark_theme = document.querySelector("#dark-theme");
btn_light_theme.addEventListener("click", (e) => {
    setLightTheme();
});

btn_dark_theme.addEventListener("click", (e) => {
    setDarkTheme();
});

function initiateTheming(){
    let use_dark_theme = true;
    let dark_theme = getParameterByName("dark");
    let off_dark_theme = parseInt(dark_theme) == 0;
    if (off_dark_theme){
        use_dark_theme = false;
    }
    else{
        use_dark_theme = true;
    }
    console.log("using dark theme");
    if (use_dark_theme){
        setDarkTheme();
    }else{
        setLightTheme();
    }
}
