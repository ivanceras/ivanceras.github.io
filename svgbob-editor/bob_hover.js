
var activeBob = [];// the active bob that is hovered
// track the mouse position
var mouseX;
var mouseY;

function initiateBob(){
    console.log("Initiating bob...");
    window.addEventListener("mousemove", (e) => {
        let bob_container = getActiveBob();
        if (bob_container != null) {
            let lens = bob_container.querySelector(".lens");
            lens.style.visibility = "visible";//make sure it's visible
            let content = lens.querySelector(".content");
            let rect = bob_container.getBoundingClientRect();
            let top = e.pageY - 100 - rect.top;//50 is box size
            let left = e.pageX - 100 - rect.left;
            lens.style.top = px(top);
            lens.style.left = px(left); 
            content.style.marginTop = px(-top);
            content.style.marginLeft = px(-left);
        }
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
}

function px(n){
    return n+"px";
}

// get active bob base on mouse position
// all bob container element,
// the mouse should be greater than the offset but lesser than the width + offset
function getActiveBob(){
    let bob_containers = document.querySelectorAll(".bob_container");
    let activeBob;
    bob_containers.forEach( (elm) => {
        let rect = elm.getBoundingClientRect();
        if (mouseX > rect.left 
            && mouseX < rect.right 
            && mouseY > rect.top 
            && mouseY < rect.bottom 
        ){
            activeBob = elm
        }
        else{
            //hide lens for the inactive
            elm.querySelector(".lens").style.visibility = "hidden";
        }
    });
    return activeBob;
}
