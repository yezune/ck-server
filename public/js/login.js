
$(document).ready( function(){

	$("#loginForm").submit(function(event) {
		event.preventDefault();
		
        var logid = myTrim(document.getElementById('logid').value);
        var logpw = myTrim(document.getElementById('logpw').value);
        var saveCheck = 'off';
        if(document.getElementById('saveid').checked) {
            saveCheck  = 'on';
        }
        if(logid == '' || logpw == '') {
            $('#information').text( 'Input ID / PW' );
            return false;
        }
		var data = {
			logid: logid,
			logpw: logpw,
			saveid: saveCheck
		};
			
		// I like to use defers :)
		deferred = $.post("/doLogin", data );

        deferred.success( function ( suc ) {
            window.location.href = suc;
		});

		deferred.error( function ( error ) {
			$('#information').text( error.responseText);
		});

	});

});

