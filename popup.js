
var token = null;
function onAuthorize(){
  $("#loggedout").hide();
  $("#output").show();
  Trello.get("members/me/boards", function(boards){
    $.each(boards, function (idx, board){
      board.lists = [];
    });
    setUpBoards(boards);
  });
}

function setUpBoards(boards){
  boardContainer = $("<div>").appendTo($("#output"));
  $.each(boards, function(idx, board){
    boardDiv = $("<div>").appendTo(boardContainer);
    $("<h3>").text(board.name).appendTo(boardDiv);
    $.each(board.lists, function(idx, list){
      listDiv = $("<div>").text(list.name).appendTo(boardDiv);
    });
  });
}

function init(){
  $("#output").hide();


  $("#tokenEntered").click(function(e){
      token = $.trim($("#tokenField").val());
      console.log(token);
      if (token && token.length > 0){ //change check so that it equals length expected
        Trello.setToken(token);
        onAuthorize();
      } 
      else{
        alert("Token: '" + token + "'' is not expected length"); 
      }
  })

  $("#connectLink")
  .click(function(){
     Trello.authorize()
  });
}
    
document.addEventListener('DOMContentLoaded', function () {
  init();
});
