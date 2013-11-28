
var token = null;
function onAuthorize(){
  $("#loggedout").hide();
  $("#trelloDiv").show();
  Trello.get("members/me/boards", function(boards_){
    var boards = boards_;
    $.each(boards, function (idx, board){
      Trello.get("boards/"+board.id+"/lists", function(lists){
        board.lists = lists;
        if (allBoardsLoaded(boards)){
          setUpBoards(boards);
        }
      });
    });
  });
}

function allBoardsLoaded(boards){
  var loaded = true;
  $.each(boards, function(idx, board){
    loaded = loaded && board.lists;
  });
  return loaded;
}

function setUpBoards(boards){
  boardContainer = $("<div>").appendTo($("#trelloDiv"));
  $("<div>").text("Add card to:").appendTo(boardContainer);
  $.each(boards, function(idx, board){
    console.log(board);
    boardDiv = $("<div>")
                .addClass("board")
                .appendTo(boardContainer);
    $("<div>")
      .text(board.name)
      .addClass("boardName")
      .appendTo(boardDiv);
    $.each(board.lists, function(idx, list){
      listDiv = $("<div>")
                .text(list.name)
                .addClass("list")
                .appendTo(boardDiv);
    });
  });
}

function init(){
  $("#trelloDiv").hide();
  token = localStorage.getItem("Trello_token");
  if (token){
    Trello.setToken(token);
    onAuthorize();
  }

  $("#tokenEntered").click(function(e){
      token = $.trim($("#tokenField").val());
      console.log(token);
      if (token && token.length > 0){ //change check so that it equals length expected
        localStorage.setItem("Trello_token", token);
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
