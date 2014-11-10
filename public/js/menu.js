
function loadMenuForm(shopID, shopName) {
    var data = {shopID: shopID, shopName: shopName};
    post_to_url('/menuForm', data);
}

function menuInfo(shopID, shopName, menuID) {
    var data = {shopID: shopID, shopName: shopName, menuID: menuID};
    post_to_url('/menuInfo', data);
}

function delMenu(shopID, shopName, menuID) {
    if(confirm('정말로 삭제하시겠습니까?')) {
        var data = {shopID: shopID, shopName: shopName, menuID: menuID};
        deferred = $.post('/delMenu', data );
        deferred.success( function ( suc ) {
            post_to_url('/menu', data);
        });
        deferred.error( function ( error ) {
            alert( error.responseText);
        });
    }
}





