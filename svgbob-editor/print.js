var print_icon = document.querySelector("#print-icon");
var download_md_btn = document.querySelector("#download-md-btn");


print_icon.addEventListener("click", 
    ()=> { printDoc(); }
);

download_md_btn.addEventListener("click",
    () => { 
        var filename = document.title+".md.txt";
        var content = ace_edit.getValue();
        download_txt(filename, content);
    }
);

function printDoc(){
    var render_html = document.querySelector("#render").innerHTML;
    var pw = window.open('', '', "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,height=400,width=800");
    var doc = pw.document;
    var headContent = document.getElementsByTagName('head')[0].innerHTML;
    doc.write("<html><head>"+headContent);
    doc.write("<link rel='stylesheet' href='print.css'/>");
    doc.write("</head><body style='overflow:auto' class='light'>");
    doc.write(render_html);
    doc.write("<script>");
    //disable dark theme
    doc.write("document.querySelector(\"[href='tomorrow-night.css']\").disabled = true;");
    //enable the light theme
    doc.write("document.querySelector(\"[href='highlight.css']\").disabled = false;");
    doc.write("</script>");
    doc.write("</body></html>");
    doc.close();
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
