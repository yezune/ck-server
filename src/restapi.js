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
    
    var query = "select * from TB_MEMBER where uniqueKey='"+uniqueKey+"'";
    db.executeQuery(query,  function( err, result ) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        var retJson = {ResultCode:'fail'};
        if(err) {
            retJson.error = err;
            res.write(JSON.stringify(retJson));
            res.end();
        } else {
            if(result.length == 0) {
                query = "insert into TB_MEMBER (memName, regKey, uniqueKey, mobile, address1, address2) values (";
                qeury += "'"+memName+"'";
                qeury += ", '"+regKey+"'";
                qeury += ", '"+uniqueKey+"'";
                qeury += ", '"+mobile+"'";
                qeury += ", '"+address1+"'";
                qeury += ", '"+address2+"')";
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
        } else {
            if(result.length == 0) {
                res.write(JSON.stringify(retJson));
            } else {
                res.write(JSON.stringify(result));
            }
        }
        res.end();
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
                qeury += "'"+deliverName+"'";
                qeury += ", "+localID;
                qeury += ", '"+uniqueKey+"'";
                qeury += ", '"+mobile+"')";
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
        } else {
            if(result.length == 0) {
                res.write(JSON.stringify(retJson));
            } else {
                res.write(JSON.stringify(result));
            }
        }
        res.end();
    });
};

exports.shopList = function(req, res) {
	setPage(req, 'shopList' );
    var localID = req.body.localID;
    var shopCate = req.body.shopCate;
    var shopName = req.body.shopName;
    
    var query = "select * from TB_SHOP where localID="+localID;
    if(shopCate > 0) {
        query += " and shopCate="+shopCate;
    }
    if(shopName && shopName.length>1) {
        query += " and shopName like '%"+shopName+"%'";
    }
    db.executeQuery(query,  function( err, result ) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        var retJson = {shopID:0, error:err};
        if(err) {
            res.write(JSON.stringify(retJson));
        } else {
            if(result.length == 0) {
                retJson.error = 'Nothing shop';
                res.write(JSON.stringify(retJson));
            } else {
                res.write(JSON.stringify(result));
            }
        }
        res.end();
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
        } else {
            if(result.length == 0) {
                retJson.error = 'Nothing menu';
                res.write(JSON.stringify(retJson));
            } else {
                res.write(JSON.stringify(result));
            }
        }
        res.end();
    });
};




