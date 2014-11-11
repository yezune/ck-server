require('./CONFIG.js');

var fs = require('fs');
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
    var shopID = req.body.shopID;
    var status = req.body.status;
    var pageID = req.body.pageID;
    
    if(!pageID) pageID = 1;
    var limitStart = LIST_COUNT * (pageID-1);

    var query = '';
    var incWhere = false;
    if(logInfo.memLevel == 'Admin') {
        query = "select O.*, date_format(O.RegDate, '%m/%d %H:%i:%s') orderTime, (select shopName from TB_SHOP where shopID=O.shopID) shopName";
        query += ", (select memName from TB_MEMBER where uniqueKey=O.memberKey) memName";
        query += ", (select Group_Concat(CONCAT(menuName,'(',Count,')')) from TB_ORDER_MENU where orderID=O.orderID) orderMenu";
        query += " from TB_ORDER O";
        if(shopID) {
            incWhere = true;
            query += " where shopID="+shopID;
        }
    } else {
        query = "select O.*, date_format(O.RegDate, '%m/%d %H:%i:%s') orderTime, (select shopName from TB_SHOP where shopID=O.shopID) shopName";
        query += ", (select memName from TB_MEMBER where uniqueKey=O.memberKey) memName";
        query += ", (select Group_Concat(CONCAT(menuName,'(',Count,')')) from TB_ORDER_MENU where orderID=O.orderID) orderMenu";
        query += " from TB_ORDER O where O.shopID="+logInfo.shopID;
        incWhere = true;
    }
    if(status > 0) {
        if(incWhere) query += " and Status = "+status;
        else {
            incWhere = true;
            query += " where Status = "+status;
        }
    }
    query += " order by O.RegDate desc limit "+limitStart+", "+LIST_COUNT;
    db.executeQuery(query,  function( err, orderList ) {
        if(err) {
            return res.render('msgBox', {msg:err} );
        }
        res.render('orderList', {logInfo:logInfo, orderList:orderList} );
    
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
		res.render('local', {menuId:'local', logInfo:req.session.logInfo, qResult:result} );
	
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
    var query = "select localID, localName from TB_LOCAL";
    db.executeQuery(query,  function( err, localList ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
        if(localList.length < 1) {
            return res.render('msgBox', {msg:'Please first regist local.'} );
        }
        if(!localID) {
            localID = localList[0].localID;
        }
        query = "select S.*, (select count(0) from TB_MENU where localID="+localID+" and shopID=S.shopID) menuCnt from TB_SHOP S where S.localID="+localID+" order by S.shopID desc";
        db.executeQuery(query,  function( err, shopList ) {
            if(err) {
                return res.render('msgBox', {msg:err} );
            }
            res.render('shopList', 
            {menuId:'shop', 
            logInfo:req.session.logInfo, 
            localList:localList,
            localID: localID,
            shopList:shopList} );
        });
	
	});
};

exports.shopForm = function(req, res) {
	setPage(req, 'add shopForm' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var query = "select localID, localName from TB_LOCAL";
    db.executeQuery(query,  function( err, localList ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
        if(localList.length < 1) {
			return res.render('msgBox', {msg:'Please first regist Local.'} );
        }
        query = "select * from TB_SHOPCATE";
        db.executeQuery(query,  function( err, cateList ) {
            if(err) {
                return res.render('msgBox', {msg:err} );
            }
            if(cateList.length < 1) {
                return res.render('msgBox', {msg:'Please first regist category.'} );
            }
            var shopInfo = {shopID:0, localID:localList[0].localID, shopName:'', master:'', delivery:0, shopCate:cateList[0].shopCate, telNumber:'', mobile:'', 
                address1:'', address2:'', minPrice:'', logID:'', primeMenu:'', startTime:'11:00', endTime:'22:00', bankInfo:'',
                localBank:'', Descript:''};
            res.render('shopForm', {menuId:'shop', logInfo:req.session.logInfo, localList: localList, cateList: cateList, btnText:'가맹점 등록', shopInfo:shopInfo} );
        });
	});
    
};

exports.shopInfo = function(req, res) {
	setPage(req, 'edit shopForm' );
    if( !req.session.logInfo) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var shopID = req.body.shopID;
    if(!shopID) {
        shopID = req.session.logInfo.shopID;
    }
    var query = "select * from TB_SHOP where shopID="+shopID;
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
        if(result.length < 1) {
			return res.render('msgBox', {msg:'Removed this Shop. please check shopID - '+shopID} );
        }
        query = "select localID, localName from TB_LOCAL";
        db.executeQuery(query,  function( err, localList ) {
            if(err) {
                return res.render('msgBox', {msg:err} );
            }
            if(localList.length < 1) {
                return res.render('msgBox', {msg:'Please first regist Local.'} );
            }
            query = "select * from TB_SHOPCATE";
            db.executeQuery(query,  function( err, cateList ) {
                if(err) {
                    return res.render('msgBox', {msg:err} );
                }
                if(cateList.length < 1) {
                    return res.render('msgBox', {msg:'Please first regist category.'} );
                }
                res.render('shopForm', {menuId:'shop', logInfo:req.session.logInfo, localList: localList, cateList: cateList, btnText:'수정하기', shopInfo:result[0]} );
            });
           
        });
	});
};

exports.delShop = function(req, res) {
	setPage(req, 'delShop' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var shopID = req.body.shopID;
    
    // localID 를 0으로 설정하여 리스트에서만 제거
    var query = "update TB_SHOP set localID=0 where shopID="+shopID;
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.send(400, err);
		}
        res.send(200, 'ok');
	});
};

exports.registShop = function(req, res) {
	setPage(req, 'registShop' );
    if( !req.session.logInfo) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var shopID = req.body.shopID;

    var newPath = "";
    var imgUrl = false;

    if(shopID > 0) { //edit
        if(req.files.upfile.size > 0) {
            var query = "select shopImage from TB_SHOP where shopID="+shopID;
            db.executeQuery(query,  function( err, result ) {
                if(err) {
                    return res.render('msgBox', {msg:err} );
                }
                var shopImage = result[0].shopImage;
                if(!shopImage || shopImage=='') {
                    var curDate = new Date();
                    var mkFilename = 'shop_'+curDate.getTime();
                    newPath = global.uploadPath + '/'+mkFilename;
                    imgUrl = global.uploadDir + '/'+mkFilename;
                } else {
                    var imgArray = shopImage.split('/');
                    var mkFilename = imgArray[imgArray.length-1];
                    newPath = global.uploadPath + '/'+mkFilename;
                }
                fs.readFile(req.files.upfile.path, function(error, data) {
                    if(error){
                            return res.render('msgBox', {msg:error} );
                    }
                    fs.writeFile(newPath, data, function(error){
                        if(error){
                            return res.render('msgBox', {msg:error} );
                        }
                        actRegistShop(req, res, imgUrl);
                    });
                });
            });
        } else {
            actRegistShop(req, res);
        }
    } else { // add
        if(!fs.existsSync(global.uploadPath)) {
            fs.mkdirSync(global.uploadPath);
        }
        if(req.files.upfile.size > 0) {
            var curDate = new Date();
            var mkFilename = 'shop_'+curDate.getTime();
            newPath = global.uploadPath + '/'+mkFilename;
            imgUrl =  global.uploadDir + '/'+mkFilename;
            fs.readFile(req.files.upfile.path, function(error, data) {
                if(error){
                        return res.render('msgBox', {msg:error} );
                }
                fs.writeFile(newPath, data, function(error){
                    if(error){
                        return res.render('msgBox', {msg:error} );
                    }
                    actRegistShop(req, res, imgUrl);
                });
            });     
        } else {
            actRegistShop(req, res);        
        }
    }
};

function actRegistShop(req, res, shopImage) {
    var shopID = req.body.shopID;
    var localID = req.body.localID;
    var delivery = req.body.delivery;
    var shopCate = req.body.shopCate;
    var shopName = req.body.shopName;
    var master = req.body.master;
    var telNumber = req.body.telNumber;
    var mobile = req.body.mobile;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var minPrice = req.body.minPrice;
    var primeMenu = req.body.primeMenu;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var logID = req.body.logID;
    var logPW = req.body.logPW;
    var bankInfo = req.body.bankInfo;
    var localBank = req.body.localBank;
    var Descript = req.body.Descript;
    Descript = Descript.replace(/'/gi, "`");

    var query = '';
    if(shopID > 0) {
        query = "update TB_SHOP set ";
        query += "localID="+localID;
        query += ", shopName='"+shopName+"'";
        query += ", delivery="+delivery;
        query += ", shopCate="+shopCate;
        query += ", master='"+master+"'";
        if(shopImage) {
            query += ", shopImage='"+shopImage+"'";
        }
        query += ", mobile='"+mobile+"'";
        query += ", telNumber='"+telNumber+"'";
        query += ", minPrice='"+minPrice+"'";
        query += ", address1='"+address1+"'";
        query += ", address2='"+address2+"'";
        query += ", startTime='"+startTime+"'";
        query += ", endTime='"+endTime+"'";
        query += ", primeMenu='"+primeMenu+"'";
        query += ", Descript='"+Descript+"'";
        query += ", logID='"+logID+"'";
        if(logPW && logPW.length > 3) {
            query += ", logPW=password('"+logPW+"')";
        }
        query += ", bankInfo='"+bankInfo+"'";
        query += ", localBank='"+localBank+"'";
        query += " where shopID="+shopID;        
    } else {
        if(!logPW || logPW == '') {
            logPW = "1234";
        }
        query = "insert into TB_SHOP (localID, shopName, delivery, shopCate, master,";
        if(shopImage) {
            query += " shopImage,";
        }
        query += " mobile, telNumber, minPrice, address1, address2, startTime, endTime, primeMenu, Descript, logID, logPW, bankInfo, localBank)";
        query += " values (";
        query += localID;
        query += ", '"+shopName+"'";
        query += ", "+delivery;
        query += ", "+shopCate;
        query += ", '"+master+"'";
        if(shopImage) {
            query += ", '"+shopImage+"'";
        }
        query += ", '"+mobile+"'";
        query += ", '"+telNumber+"'";
        query += ", '"+minPrice+"'";
        query += ", '"+address1+"'";
        query += ", '"+address2+"'";
        query += ", '"+startTime+"'";
        query += ", '"+endTime+"'";
        query += ", '"+primeMenu+"'";
        query += ", '"+Descript+"'";
        query += ", '"+logID+"'";
        query += ", password('"+logPW+"')";
        query += ", '"+bankInfo+"'";
        query += ", '"+localBank+"'";
        query += ")";        
    }
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
        query = "select localID, localName from TB_LOCAL";
        db.executeQuery(query,  function( err, localList ) {
            if(err) {
                return res.render('msgBox', {msg:err} );
            }
            if(localList.length < 1) {
                return res.render('msgBox', {msg:'Please first regist local.'} );
            }
            if(!localID) {
                localID = localList[0].localID;
            }
            query = "select S.*, (select count(0) from TB_MENU where localID="+localID+" and shopID=S.shopID) menuCnt from TB_SHOP S where S.localID="+localID+" order by S.shopID desc";
            db.executeQuery(query,  function( err, shopList ) {
                if(err) {
                    return res.render('msgBox', {msg:err} );
                }
                res.render('shopList', 
                {menuId:'shop', 
                logInfo:req.session.logInfo, 
                localList:localList,
                localID: localID,
                shopList:shopList} );
            });
        
        });
	
	});

}




//////////////////////////////////////////////////////
// Menu 
exports.shopCate = function(req, res) {
	setPage(req, 'shopCate' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var query = "select * from TB_SHOPCATE order by shopCate desc";
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
		res.render('shopCate', {menuId:'shopCate', logInfo:req.session.logInfo, qResult:result} );	
	});
};

exports.addCate = function(req, res) {
	setPage(req, 'addCate' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.send(400, 'Permission denied.');
    }
    var cateName = req.body.cateName;
    cateName = cateName.replace(/'/gi, "`");

    var query = "select cateName from TB_SHOPCATE where cateName='"+cateName+"'";
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.send(400, err);
		}
        if(result.length > 0) {
            return res.send(400, '같은 이름으로 등록된 카테고리가 존재합니다.');
        }
        query = "insert into TB_SHOPCATE (cateName) values ('"+cateName+"')";
        db.executeQuery(query,  function( err, result ) {
            if(err) {
                return res.send(400, err);
            }
            res.send(200, 'ok');
        });
	});
};

exports.editCate = function(req, res) {
	setPage(req, 'editCate' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.send(400, 'Permission denied.');
    }
    var shopCate = req.body.shopCate;
    var cateName = req.body.cateName;
    cateName = cateName.replace(/'/gi, "`");

    
    var query = "update TB_SHOPCATE set cateName='"+cateName+"' where shopCate="+shopCate;
    db.executeQuery(query,  function( err, result ) {
        if(err) {
            return res.send(400, err);
        }
        res.send(200, 'ok');
    });
};

exports.delCate = function(req, res) {
	setPage(req, 'delCate' );
    if( !req.session.logInfo ||  req.session.logInfo.memLevel != 'Admin' ) {        
        return res.send(400, 'Permission denied.');
    }
    var shopCate = req.body.shopCate;
    
    var query = "delete from TB_SHOPCATE where shopCate="+shopCate;
    db.executeQuery(query,  function( err, result ) {
        if(err) {
            return res.send(400, err);
        }
        res.send(200, 'ok');
    });
};

exports.menu = function(req, res) {
	setPage(req, 'menu' );
    if( !req.session.logInfo) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var shopID = req.body.shopID;
    var shopName = req.body.shopName;
    var menuId = 'shop';
    if(req.session.logInfo.memLevel != 'Admin') {
        shopID = req.session.logInfo.shopID;
        shopName = req.session.logInfo.shopName;
        menuId = 'menu';
    }
    var query = "select M.* from TB_MENU M where M.shopID="+shopID+" order by RegDate desc";
    db.executeQuery(query,  function( err, menuList ) {
        if(err) {
            return res.render('msgBox', {msg:err} );
        }
        res.render('menuList', 
        {menuId:menuId, 
        logInfo:req.session.logInfo, 
        shopID: shopID,
        shopName: shopName,
        menuList:menuList} );
    });
};

exports.menuForm = function(req, res) {
	setPage(req, 'menuForm' );
    if( !req.session.logInfo) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var shopID = req.body.shopID;
    var shopName = req.body.shopName;
    var menuId = 'shop';
    if(req.session.logInfo.memLevel != 'Admin') {
        menuId = 'menu';
    }
    
    var menuInfo = {menuID:0, shopID:shopID, shopName:shopName, menuName: '',
        price:'', eventFunc:'', Descript:''};
    res.render('menuForm', {menuId:menuId, logInfo:req.session.logInfo, btnText:'메뉴 등록', menuInfo:menuInfo} );

};

exports.menuInfo = function(req, res) {
	setPage(req, 'menuInfo' );
    if( !req.session.logInfo) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var shopName = req.body.shopName;
    var menuID = req.body.menuID;
    var menuId = 'shop';
    if(req.session.logInfo.memLevel != 'Admin') {
        menuId = 'menu';
    }
    var query = "select * from TB_MENU where menuID="+menuID;
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
        if(result.length < 1) {
			return res.render('msgBox', {msg:'Removed this Shop. please check shopID - '+shopID} );
        }
        res.render('menuForm', {menuId:menuId, logInfo:req.session.logInfo, btnText:'수정하기', menuInfo:result[0]} );
	});

};

exports.delMenu = function(req, res) {
	setPage(req, 'delMenu' );
    if( !req.session.logInfo) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var menuID = req.body.menuID;
    
    var query = "delete from TB_MENU where menuID="+menuID;
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.send(400, err);
		}
        res.send(200, 'ok');
	});
};

exports.registMenu = function(req, res) {
	setPage(req, 'registMenu' );
    if( !req.session.logInfo) {        
        return res.render('msgBox', {msg:'Permission denied.'} );
    }
    var menuID = req.body.menuID;

    var newPath = "";
    var imgUrl = false;

    if(menuID > 0) { //edit
        if(req.files.upfile.size > 0) {
            var query = "select menuImage from TB_MENU where menuID="+menuID;
            db.executeQuery(query,  function( err, result ) {
                if(err) {
                    return res.render('msgBox', {msg:err} );
                }
                var menuImage = result[0].menuImage;
                if(!menuImage || menuImage=='') {
                    var curDate = new Date();
                    var mkFilename = 'menu_'+curDate.getTime();
                    newPath = global.uploadPath + '/'+mkFilename;
                    imgUrl = global.uploadDir + '/'+mkFilename;
                } else {
                    var imgArray = menuImage.split('/');
                    var mkFilename = imgArray[imgArray.length-1];
                    newPath = global.uploadPath + '/'+mkFilename;
                }
                fs.readFile(req.files.upfile.path, function(error, data) {
                    if(error){
                            return res.render('msgBox', {msg:error} );
                    }
                    fs.writeFile(newPath, data, function(error){
                        if(error){
                            return res.render('msgBox', {msg:error} );
                        }
                        actRegistMenu(req, res, imgUrl);
                    });
                });
            });
        } else {
            actRegistMenu(req, res);
        }
    } else { // add
        if(!fs.existsSync(global.uploadPath)) {
            fs.mkdirSync(global.uploadPath);
        }
        if(req.files.upfile.size > 0) {
            var curDate = new Date();
            var mkFilename = 'menu_'+curDate.getTime();
            newPath = global.uploadPath + '/'+mkFilename;
            imgUrl =  global.uploadDir + '/'+mkFilename;
            fs.readFile(req.files.upfile.path, function(error, data) {
                if(error){
                        return res.render('msgBox', {msg:error} );
                }
                fs.writeFile(newPath, data, function(error){
                    if(error){
                        return res.render('msgBox', {msg:error} );
                    }
                    actRegistMenu(req, res, imgUrl);
                });
            });     
        } else {
            actRegistMenu(req, res);        
        }
    }
};

function actRegistMenu(req, res, menuImage) {
    var shopID = req.body.shopID;
    var menuID = req.body.menuID;
    var menuName = req.body.menuName;
    var price = req.body.price;
    var eventFunc = req.body.eventFunc;
    var Descript = req.body.Descript;
    Descript = Descript.replace(/'/gi, "`");

    var query = '';
    if(menuID > 0) {
        query = "update TB_MENU set ";
        query += "menuName='"+menuName+"'";
        query += ", price='"+price+"'";
        if(menuImage) {
            query += ", menuImage='"+menuImage+"'";
        }
        query += ", eventFunc='"+eventFunc+"'";
        query += ", Descript='"+Descript+"'";
        query += " where menuID="+menuID;        
    } else {
        query = "insert into TB_MENU (shopID, menuName, price,";
        if(menuImage) {
            query += " menuImage,";
        }
        query += " eventFunc, Descript)";
        query += " values (";
        query += shopID;
        query += ", '"+menuName+"'";
        query += ", '"+price+"'";
        if(menuImage) {
            query += ", '"+menuImage+"'";
        }
        query += ", '"+eventFunc+"'";
        query += ", '"+Descript+"'";
        query += ")";        
    }
    db.executeQuery(query,  function( err, result ) {
		if(err) {
			return res.render('msgBox', {msg:err} );
		}
        var shopName = req.body.shopName;
        var menuId = 'shop';
        if(req.session.logInfo.memLevel != 'Admin') {
            menuId = 'menu';
        }
        query = "select M.* from TB_MENU M where M.shopID="+shopID+" order by RegDate desc";
        db.executeQuery(query,  function( err, menuList ) {
            if(err) {
                return res.render('msgBox', {msg:err} );
            }
            res.render('menuList', 
            {menuId:menuId, 
            logInfo:req.session.logInfo, 
            shopID: shopID,
            shopName: shopName,
            menuList:menuList} );
        });
	
	});

}

