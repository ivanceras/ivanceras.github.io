var print_btn = document.querySelector("#print_btn");

print_btn.addEventListener("click", 
    function () {
        var render_html = document.querySelector("#render").innerHTML;
        var pw = window.open('', '', "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,height=400,width=800");
        var headContent = document.getElementsByTagName('head')[0].innerHTML;
        pw.document.write("<html><head>"+headContent);
        pw.document.write("<link rel='stylesheet' href='print.css'/>");
        pw.document.write("</head><body style='overflow:auto'>");
        pw.document.write(render_html);
        pw.document.write("<script src='MathJax/MathJax.js?config=TeX-AMS-MML_SVG-full'></script>");
        pw.document.write("<script>");
        pw.document.write("console.log('queueing..');");
        pw.document.write("MathJax.Hub.Queue(() => {console.log('printing');window.print();});");
        pw.document.write("</script>");
        pw.document.write("</body></html>");
        pw.document.close();
    }
);
