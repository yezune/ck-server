
function changeLocal(localID) {
    var data = {
        localID: localID
    };
    post_to_url('/shop', data);
}

function shopInfo(shopID) {
    var data = {
        shopID: shopID
    };
    post_to_url('/shopInfo', data);
}

function manageMenu(shopID, shopName) {
    var data = {
        shopID: shopID,
        shopName: shopName
    };
    post_to_url('/menu', data);
}

function delShop(shopID) {
    if(confirm('정말로 삭제하시겠습니까?')) {
        var data = {
            shopID: shopID
        };
        deferred = $.post('/delShop', data );
        deferred.success( function ( suc ) {
            post_to_url('/shop');
        });
        deferred.error( function ( error ) {
            alert( error.responseText);
        });
    }
}

function closeDaumPostcode() {
    var element = document.getElementById('postLayer');
    element.style.display = 'none';
}

function showDaumPostcode() {
    var element = document.getElementById('postLayer');

    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.address;
            if(data.addressType == 'R') {
                addr = data.relatedAddress;
            }
            addr = addr.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');
            document.getElementById('address1').value = addr;

            element.style.display = 'none';
            document.getElementById('address2').focus();
        },
        width : '100%',
        height : '100%'
    }).embed(element);

    element.style.display = 'block';
}

function submitCate() {
    var form = document.getElementById('cateForm');
    
    var cateName = myTrim(form.cateName.value);
    if(cateName == '') {
        form.cateName.focus();
        alert('Category Name 을 입력해 주십시요.');
        return false;
    }
    var actionUrl = "/addCate";
    var data = {
        shopCate: form.shopCate.value,
        cateName: cateName
    };
    if(form.shopCate.value > 0) {
        actionUrl = "/editCate";
    }
    deferred = $.post(actionUrl, data );
    deferred.success( function ( suc ) {
        window.location.href = '/shopCate';
    });
    deferred.error( function ( error ) {
        alert( error.responseText);
    });
    
    return false;
}

function selCate(shopCate, cateName) {
    var form = document.getElementById('cateForm');
    form.shopCate.value = shopCate;
    form.cateName.value = cateName;
    
    document.getElementById('cateSubmit').value = "Edit";
    form.cateName.focus();
}

function delCate(shopCate) {
    var data = {
        shopCate: shopCate
    };
    deferred = $.post('/delCate', data );
    deferred.success( function ( suc ) {
        window.location.href = '/shopCate';
    });
    deferred.error( function ( error ) {
        alert( error.responseText);
    });
    
    return false;
}
