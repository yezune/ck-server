
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}
function post_to_url(path, params) {    
    var form = document.createElement("form");    
    form.method = "post";
    form.action = path;
    if(params) {
        for(var key in params) {        
            var hiddenField = document.createElement("input");        
            hiddenField.type = "hidden";        
            hiddenField.name = key;       
            hiddenField.value = params[key];        
            form.appendChild(hiddenField);    
        }
    }
    document.body.appendChild(form);
    form.submit();
}
