require('./CONFIG.js');

var db = require( './mysql.js' );

function setPage(req, pageID) {
    req.session.pageID = pageID;
    console.log('[Action]', pageID );
}

exports.orderList = function(req, res) {
	setPage(req, 'orderList' );
    var logInfo = req.session.logInfo;
    if( !logInfo ) {
        if(req.cookies.saveLogID){
            res.render('login', {logId: req.cookies.saveLogID});
        } else {
            res.render('login', {logId: ''});
        }
        return;
    }

    var query = "select * from TB_SHOP where shopID="+logInfo.shopID;
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
		if(result.length < 1) {
			return res.render('msgBox', {msg:'가맹점 정보를 가져오지 못했습니다.'} );
		}
		res.render('index', {logInfo:logInfo, shopInfo:result[0]} );
	
	});
};

exports.doLogin = function(req, res){
	setPage(req, 'doLogin' );
   
    var logid = req.body.logid;
    var logpw = req.body.logpw;
    
    req.session.logInfo = '';
    
    var query = "select shopID, localID, shopName from TB_SHOP where logID='"+logid+"'";
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.send( 400, err);
		}
		if(result.length < 1) {
			return res.send( 400, '등록되지 않은 회원입니다.');
		}
        var logInfo = result[0];
        logInfo.memLevel = 'Shop';
        query = "select shopID from TB_SHOP where shopID="+logInfo.shopID+" and logPW=password('"+logpw+"')";
        db.executeQuery(query,  function( err, result ) {
            if(err) {
                return res.send( 400, err);
            }
            if(result.length < 1) {
                return res.send( 400, '비밀번호가 일치하지 않습니다.');
            }
            if(logInfo.localID == 0) {
                logInfo.memLevel = 'Admin';
            }
            req.session.logInfo = logInfo;
            if(req.body.saveid == 'on') {
                res.cookie( 'saveLogID', logid,  {maxAge: TIME_EXPIRE_COOKIE, httpOnly: true} );
            } else {
                res.cookie( 'saveLogID', '');
            }
            res.send(200, '/');
        });
        
	});

};

exports.doLogout = function(req, res){
	setPage(req, 'doLogout' );
    req.session.logInfo = '';
    res.redirect('/'); 
};



//////////////////////////////////////////////////////
// Local
exports.local = function(req, res) {
	setPage(req, 'local' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var query = "select L.*, (select count(0) from TB_SHOP where localID = L.localID) shopCount from TB_LOCAL L";
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
		res.render('local', {menuId:'local', logInfo:req.session.logInfo , qResult:result} );
	
	});
};

exports.addLocal = function(req, res) {
	setPage(req, 'addLocal' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.send(400, 'Permission denied.');
    }
    var localName = req.body.localName;
    var localDesc = req.body.localDesc;
    localName = localName.replace(/'/gi, "`");
    localDesc = localDesc.replace(/'/gi, "`");

    var query = "select localID from TB_LOCAL where localName='"+localName+"'";
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.send(400, err);
		}
        if(result.length > 0) {
            return res.send(400, '같은 이름으로 등록된 지역이 존재합니다.');
        }
        query = "insert into TB_LOCAL (localName,Descript) values (";
        query += "'"+localName+"', ";
        query += "'"+localDesc+"')";
        db.executeQuery(query,  function( err, result ) {
            if(err) {
                return res.send(400, err);
            }
            res.send(200, 'ok');
        });
	});
};

exports.editLocal = function(req, res) {
	setPage(req, 'editLocal' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.send(400, 'Permission denied.');
    }
    var localID = req.body.localID;
    var localName = req.body.localName;
    var localDesc = req.body.localDesc;
    localName = localName.replace(/'/gi, "`");
    localDesc = localDesc.replace(/'/gi, "`");

    
    var query = "update TB_LOCAL set localName='"+localName+"', Descript='"+localDesc+"' where localID="+localID;
    db.executeQuery(query,  function( err, result ) {
        if(err) {
            return res.send(400, err);
        }
        res.send(200, 'ok');
    });
};

//////////////////////////////////////////////////////
// Local
exports.shop = function(req, res) {
	setPage(req, 'shop list' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var localID = req.body.localID;
    var query = "select * from TB_SHOP";
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
		res.render('shopList', {menuId:'shop', logInfo:req.session.logInfo , qResult:result} );
	
	});
};




