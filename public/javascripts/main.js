function e() {
    var n = arguments.length;
    var element;
    if (n > 0) {
        element = document.createElement(arguments[0]);
        for (var i = 1; i < n; i++) {
            var arg = arguments[i];
            if (typeof(arg) == "string")
                arg = document.createTextNode(arg);
            element.appendChild(arg);
        }
    }
    return element;
}

function $(id) {
    var r = null;
    if (Array.isArray(id))
        r = id.map($);
    else
        r = document.getElementById(id);
    return r;
}