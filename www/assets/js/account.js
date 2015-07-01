"use strict";
// initialize Hoodie
var hoodie  = new Hoodie();

var login = $("#login");
var loginform = $("#loginform");
var content = $(".content");

function loginHide(){
	login.hide();
	$('#userName').html(hoodie.account.username);
}

if(hoodie.account.username == undefined)  {
	login.show();
	content.hide();
} else {
	loginHide();
	content.show();
}

$('#loginform').submit(function (event) {
  event.preventDefault();
  var username = $('#user').val();
  var password = $('#pwd').val();

  hoodie.account.signIn(username, password)
  .done(
  	function(){
  		loginHide();
  	}
  ).fail(
		function(){
  			hoodie.account.signUp(username, password, password)
			  .done(
			  	function(){
			  		loginHide();
			  	}
			  ).fail(
					function(){
			  			alert('fail to sign in or register username '+username);
						console.log('fail', username);
			  		}
			  );
  		}
  );
  
});
hoodie.account.on('error:unauthenticated signout', function(e){
	login.show();
	content.hide();
	if(notifySignOut) notifySignOut(e);
});

hoodie.account.on('signin signup', function(e){
	login.hide();
	content.show();
	if(notifySignIn) notifySignIn(e);
});

$('#signOut').click(function(){
	hoodie.account.signOut();
});
