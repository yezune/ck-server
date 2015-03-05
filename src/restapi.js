require('./CONFIG.js');

var db = require( './mysql.js' );

function setPage(req, pageID) {
    req.session.pageID = pageID;
    console.log('[REST API]', pageID );
}

exports.localList = function(req, res) {
	setPage(req, 'localList' );

    var query = "select * from TB_LOCAL";
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    db.executeQuery(query,  function( err, result ) {
        if(err) {
            res.write(JSON.stringify(err));
        } else {
            res.write(JSON.stringify(result));
        }
        res.end();
    });
};

exports.shopCate = function(req, res) {
	setPage(req, 'shopCate' );

    var query = "select * from TB_SHOPCATE";
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    db.executeQuery(query,  function( err, result ) {
        if(err) {
            res.write(JSON.stringify(err));
        } else {
            res.write(JSON.stringify(result));
        }
        res.end();
    });
};

exports.joinMem = function(req, res) {
	setPage(req, 'joinMem' );
    var memName = req.body.memName;
    var regKey = req.body.regKey;
    var uniqueKey = req.body.uniqueKey;
    var mobile = req.body.mobile;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
	
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
	var retJson = {ResultCode:'fail'};
	if(!uniqueKey) {
		retJson.error = 'Nothing parameter : uniqueKey';
		res.write(JSON.stringify(retJson));
		res.end(); return;		
	}
	if(!memName) {
		retJson.error = 'Nothing parameter : memName';
		res.write(JSON.stringify(retJson));
		res.end(); return;		
	}
    
    var query = "select * from TB_MEMBER where uniqueKey='"+uniqueKey+"'";
    db.executeQuery(query,  function( err, result ) {
        if(err) {
            retJson.error = err;
            res.write(JSON.stringify(retJson));
            res.end();
        } else {
            if(result.length == 0) {
                query = "insert into TB_MEMBER (memName, regKey, uniqueKey, mobile, address1, address2) values (";
                query += "'"+memName+"'";
                query += ", '"+regKey+"'";
                query += ", '"+uniqueKey+"'";
                query += ", '"+mobile+"'";
                query += ", '"+address1+"'";
                query += ", '"+address2+"')";
                db.executeQuery(query,  function( err, result ) {
                    if(err) {
                        retJson.error = err;
                    } else {
                        retJson.ResultCode = 'ok';
                    }
                    res.write(JSON.stringify(retJson));
                    res.end();
                });                
            } else {
                retJson.error = 'exist uniqueKey';
                res.write(JSON.stringify(retJson));
                res.end();
            }
        }
    });
};

exports.memInfo = function(req, res) {
	setPage(req, 'memInfo' );
    var uniqueKey = req.body.uniqueKey;
    
    var query = "select * from TB_MEMBER where uniqueKey='"+uniqueKey+"'";
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    db.executeQuery(query,  function( err, result ) {
        var retJson = {memberID:0};
        if(err) {
            retJson.error = err;
            res.write(JSON.stringify(retJson));
			res.end();
        } else {
            if(result.length == 0) {
                res.write(JSON.stringify(retJson));
				res.end();
            } else {
                res.write(JSON.stringify(result));
				res.end();
            }
        }        
    });
};

exports.joinDeliver = function(req, res) {
	setPage(req, 'joinDeliver' );
    var deliverName = req.body.deliverName;
    var localID = req.body.localID;
    var uniqueKey = req.body.uniqueKey;
    var mobile = req.body.mobile;
    
    var query = "select * from TB_DELIVER where uniqueKey='"+uniqueKey+"'";
    db.executeQuery(query,  function( err, result ) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        var retJson = {ResultCode:'fail'};
        if(err) {
            retJson.error = err;
            res.write(JSON.stringify(retJson));
            res.end();
        } else {
            if(result.length == 0) {
                query = "insert into TB_DELIVER (deliverName, localID, uniqueKey, mobile) values (";
                query += "'"+deliverName+"'";
                query += ", "+localID;
                query += ", '"+uniqueKey+"'";
                query += ", '"+mobile+"')";
                db.executeQuery(query,  function( err, result ) {
                    if(err) {
                        retJson.error = err;
                    } else {
                        retJson.ResultCode = 'ok';
                    }
                    res.write(JSON.stringify(retJson));
                    res.end();
                });                
            } else {
                retJson.error = 'exist uniqueKey';
                res.write(JSON.stringify(retJson));
                res.end();
            }
        }
    });
};

exports.deliverInfo = function(req, res) {
	setPage(req, 'deliverInfo' );
    var uniqueKey = req.body.uniqueKey;
    
    var query = "select * from TB_DELIVER where uniqueKey='"+uniqueKey+"'";
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    db.executeQuery(query,  function( err, result ) {
        var retJson = {deliverID:0};
        if(err) {
            retJson.error = err;
            res.write(JSON.stringify(retJson));
			res.end();
        } else {
            if(result.length == 0) {
                res.write(JSON.stringify(retJson));
				res.end();
            } else {
                res.write(JSON.stringify(result));
				res.end();
            }
        }        
    });
};

exports.shopList = function(req, res) {
	setPage(req, 'shopList' );
    var localID = req.body.localID;
    var shopCate = req.body.shopCate;
    var shopName = req.body.shopName;
	var shopID = req.body.shopID;
    
    var query = "select * from TB_SHOP where localID="+localID;
    if(shopCate > 0) {
        query += " and shopCate="+shopCate;
    }
    if(shopName && shopName.length>1) {
        query += " and shopName like '%"+shopName+"%'";
    }
	if(shopID) {
		query = "select * from TB_SHOP where shopID="+shopID;
	}
    db.executeQuery(query,  function( err, result ) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        var retJson = {shopID:0};
        if(err) {
			retJson.error = err;
            res.write(JSON.stringify(retJson));
			res.end();
        } else {
            if(result.length == 0) {
                retJson.error = 'Nothing shop';
                res.write(JSON.stringify(retJson));
				res.end();
            } else {
                res.write(JSON.stringify(result));
				res.end();
            }
        }
        
    });
};

exports.menuList = function(req, res) {
	setPage(req, 'menuList' );
    var shopID = req.body.shopID;
    
    var query = "select * from TB_MENU where shopID="+shopID;
    db.executeQuery(query,  function( err, result ) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        var retJson = {menuID:0, error:err};
        if(err) {
            res.write(JSON.stringify(retJson));
			res.end();
        } else {
            if(result.length == 0) {
                retJson.error = 'Nothing menu';
                res.write(JSON.stringify(retJson));
				res.end();
            } else {
                res.write(JSON.stringify(result));
				res.end();
            }
        }
        
    });
};

exports.order = function(req, res) {
	setPage(req, 'order' );
    var memberKey = req.body.memberKey;
    var shopID = req.body.shopID;
    var payType = req.body.payType;
    var address = req.body.address;
    var orderPrice = req.body.orderPrice;
    var Descript = req.body.Descript;
    var orderMenu = req.body.orderMenu;
	
	if(Descript) Descript = Descript.replace(/'/gi, "`");

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    var retJson = {ResultCode:'fail'};
    if(!memberKey) {
        retJson.error = 'memberKey is null';
        res.write(JSON.stringify(retJson));
        res.end(); return;
    }
    if(!shopID) {
        retJson.error = 'shopID is null';
        res.write(JSON.stringify(retJson));
        res.end(); return;
    }
    if(!orderMenu) {
        retJson.error = 'orderMenu is null';
        res.write(JSON.stringify(retJson));
        res.end(); return;
    }
	var query = "insert into TB_ORDER (shopID, memberKey, payType, address, orderPrice, Descript) values (";
	query += shopID;
	query += ", '"+memberKey+"'";
	query += ", '"+payType+"'";
	query += ", '"+address+"'";
	query += ", '"+orderPrice+"'";
	query += ", '"+Descript+"')";
	db.executeQuery(query,  function( err, result ) {
		if(err) {
			retJson.error = err;
			res.write(JSON.stringify(retJson));
			res.end();
			return;
		}
		query = "select orderID from TB_ORDER where shopID="+shopID+" and memberKey='"+memberKey+"'";
		db.executeQuery(query,  function( err, orderList ) {
			if(err) {
				retJson.error = err;
				res.write(JSON.stringify(retJson));
				res.end();
				return;
			} else if(orderList.length < 1) {
				retJson.error = 'insert failed';
				res.write(JSON.stringify(retJson));
				res.end();
				return;
			}
			var orderID = orderList[0].orderID;
			var orderArray = orderMenu.split(',');
			for(i=0;i<orderArray.length;i++) {
				var orderItem = orderArray[i].split(':');
				query = "insert into TB_ORDER_MENU (orderID, menuName, Count, Price) values (";
				query += orderID;
				query += ", '"+orderItem[0]+"'";
				query += ", '"+orderItem[1]+"'";
				query += ", '"+orderItem[2]+"')";
				db.executeQuery(query,  function( err, result ) {
				
				});
			}
			retJson.ResultCode = 'ok';
			res.write(JSON.stringify(retJson));
			res.end();
		});
		
	});
};

exports.myOrder = function(req, res) {
	setPage(req, 'myOrder' );
    var memberKey = req.body.memberKey;
    
    var query = "select O.*, date_format(O.RegDate, '%Y/%m/%d %H:%i:%s') orderTime, (select shopName from TB_SHOP where shopID=O.shopID) shopName";
    query += ", (select deliverName from TB_DELIVER where O.deliverKey is not null and uniqueKey=O.deliverKey) deliverName";
    query += ", (select Group_Concat(CONCAT(menuName,'(',Count,')')) from TB_ORDER_MENU where orderID=O.orderID) orderMenu";
    query += " from TB_ORDER O where O.memberKey='"+memberKey;
    query += "' order by O.RegDate desc";
    db.executeQuery(query,  function( err, orderList ) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
		var retJson = {orderID:'0'};
        if(err) {
            res.write(JSON.stringify(retJson));
            res.end(); return;
        }
        res.write(JSON.stringify(orderList));
        res.end();
    
    });
};



