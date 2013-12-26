
var token = null;
function onAuthorize(){
  $("#loggedout").hide();
  $("#trelloDiv").show();
  $("<div>").text("Loading boards...").appendTo($("#boardContainer"));
  Trello.get("members/me/boards", function(boards_){
    var boards = $.grep(boards_, function(board, i){ return !board.closed });
    $.each(boards, function (idx, board){
      Trello.get("boards/"+board.id+"/lists", function(lists){
        board.lists = lists;
        if (allBoardsLoaded(boards)){
          localStorage.setItem("Trello_boards", boards)
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

function showSuccess(msg){
  $("<div>").addClass("board success notification").fadeIn(1000)
            .delay(1000).fadeOut(2000).text(msg)
            .appendTo($("#notificationContainer"));
}

function showError(msg){
  $("<div>").addClass("board fail notification").fadeIn(1000)
            .delay(1000).fadeOut(2000).text(msg)
            .appendTo($("#notificationContainer"));
}

function addComment(cardId, card){
  if (card.comment){
      Trello.post("cards/" + cardId + "/actions/comments", 
      {text: card.comment},
      function(c){ //on success
        console.log(c);
        showSuccess("Card " + card.name + " added");
      },
      function(error){ //on fail
        showError("Unable to add comment to card " + card.name);
      });
    } 
}

function addCard(listId, card){
  Trello.post("lists/"+listId + "/cards",
              {name: card.name, 
               due: null,
               desc: card.desc
             },
              function(c){
                if (card.comment){
                  addComment(c.id, card);
                } else{
                  showSuccess("Card " + card.name + " added");
                }  
              },
              function(error){
                showError("Unable to add card " + card.name);
              });
}



function showBoardScreen(){
  addContainer.hide();
  boardContainer.show();
}

function setupAdd(listId){

  addContainer = $("#addContainer").show();
  boardContainer = $("#boardContainer").hide();
  addContainer.empty();
  addField = $("<input>")
            .attr("placeholder", "Card name")
            .addClass("cardField")
            .appendTo($("<div>")
                        .addClass("addLabel")
                        .text("Card name: ")
                        .appendTo(addContainer));
  descField = $("<input>")
            .attr("placeholder", "Card description")
            .addClass("cardField")
            .appendTo($("<div>")
                      .addClass("addLabel")
                      .text("Card description: ")
                      .appendTo(addContainer));
  siteComment = $("<input>")
                .attr("id", "siteComment")
                .attr("type", "checkbox")
                .text("Include current URL as comment")
                .appendTo($("<div>")
                            .addClass("addLabel")
                            .text("Include current URL as comment: ")
                            .appendTo(addContainer));
  addBtn = $("<button>")
            .attr("id", "addConfirm")
            .addClass("addBtn")
            .click(function(e){
                    chrome.tabs.getSelected(null, function(tab) {
                        var comment = null;
                        if ($("#siteComment").attr("checked")){
                          comment = tab.url;
                        }
                        var card = {name: $.trim(addField.val()),
                                    desc: $.trim(descField.val()),
                                    comment: comment
                                    };
                        addCard(listId, card);
                        showBoardScreen();
                        console.log(card);
                      });
                  })
            .text("Add")
            .appendTo(addContainer);
  cancelBtn = $("<button>")
            .attr("id", "addCancel")
            .addClass("addBtn")
            .click(showBoardScreen)
            .text("X")
            .appendTo(addContainer);
}

function setUpBoards(boards){
  console.log("set up")
  boardContainer = $("#boardContainer");
  boardContainer.empty();
  $("<div>")
    .attr("id", "addCardLabel")
    .text("Add card to:")
    .appendTo(boardContainer);
  $.each(boards, function(idx, board){
    console.log(board);
    boardDiv = $("<div>")
                .addClass("board")
                .appendTo(boardContainer);
    $("<a>")
      .text(board.name)
      .attr("href", board.url)
      .attr("target", "_blank")
      .addClass("boardName")
      .appendTo($("<div>").appendTo(boardDiv).addClass("boardName"));
    $.each(board.lists, function(idx, list){
      listDiv = $("<div>")
                .text(list.name)
                .addClass("list")
                .attr("name", list.id)
                .click(function(e){setupAdd($(e.target).attr("name"));})
                .appendTo(boardDiv);
    });
  });
}

function init(){
  //initial hidden elements
  $("#trelloDiv").hide();
  $("#addContainer").hide();

  //load token
  token = localStorage.getItem("Trello_token");
  if (token && token != "null"){
    Trello.setToken(token);
    onAuthorize();
  }

  //Set up click listeners
  $("#tokenEntered").click(function(e){
      token = $.trim($("#tokenField").val());
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
