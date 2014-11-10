
function submitLocal() {
    var form = document.getElementById('localForm');
    
    var localName = myTrim(form.localName.value);
    if(localName == '') {
        form.localName.focus();
        alert('지역명을 입력해 주십시요.');
        return false;
    }
    var actionUrl = "/addLocal";
    var data = {
        localID: form.localID.value,
        localName: localName,
        localDesc: form.localDesc.value
    };
    if(form.localID.value > 0) {
        actionUrl = "/editLocal";
    }
    deferred = $.post(actionUrl, data );
    deferred.success( function ( suc ) {
        window.location.href = '/local';
    });
    deferred.error( function ( error ) {
        alert( error.responseText);
    });
    
    return false;
}

function selLocal(localID, localName, localDesc) {
    var form = document.getElementById('localForm');
    form.localID.value = localID;
    form.localName.value = localName;
    form.localDesc.value = localDesc;
    
    document.getElementById('localSubmit').value = "Edit Local";
    form.localName.focus();
}





