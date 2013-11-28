var Trello = function(){
	var TRELLO_KEY = "fbbd0a9737d5626bb1d9d1fc9c74076e";
	var TRELLO_ENTRY_POINT = "https://api.trello.com/1/";
	var token = null;

	var trello = {
		setToken: function(t){
			token = t;
		},
		authorize: function authorizePopUp(){
		  window.open( "https://trello.com/1/authorize?key=fbbd0a9737d5626bb1d9d1fc9c74076e&"+
		                "name=Trello+It&expiration=never&response_type=token",
		                 "myWindow", "status=1, height=470, width=420, resizable=0" )
		},

		get: function get(path, success){
		    $.ajax({
		      url: TRELLO_ENTRY_POINT + path +"?key="+TRELLO_KEY + "&token=" + token,
		      success: success
		  });
		}
	}
	return trello;
}();

console.log("HI!")
window.Trello = Trello;