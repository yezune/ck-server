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
