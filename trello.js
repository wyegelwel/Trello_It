var Trello = function(){
	var TRELLO_KEY = "fbbd0a9737d5626bb1d9d1fc9c74076e";
	var TRELLO_ENTRY_POINT = "https://api.trello.com/1/";
	var token = null;

	var trello = {
		setToken: function(t){
			token = t;
		},
		authorize: function authorizePopUp(){
		  window.open( "https://trello.com/1/authorize?key=" + TRELLO_KEY + "&"+
		                "name=Trello+It&expiration=never&response_type=token&scope=read,write",
		                 "myWindow", "status=1, height=470, width=420, resizable=0" )
		},

		get: function get(path, success){
		    $.ajax({
		      url: TRELLO_ENTRY_POINT + path +"?key="+TRELLO_KEY + "&token=" + token,
		      success: success
		  });
		},

		post: function (path,data,success){
			data.key = TRELLO_KEY;
			data.token = token;
			$.ajax({
				type:"POST",
				url: TRELLO_ENTRY_POINT + path,
				data: data,
		     	success: success,
		     	error: function(e){console.log(e)}
			});
			console.log("I tried man")
		}
	}
	return trello;
}();

window.Trello = Trello;