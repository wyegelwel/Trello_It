
var token = null;
function onAuthorize(){
  $("#loggedout").hide();
  $("#trelloDiv").show();

  // var boards = localStorage.getItem("Trello_boards");
  // if (boards && boards != "null"){
  //   setUpBoards(boards);
  // }

  Trello.get("members/me/boards", function(boards_){
    var boards = boards_;
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

function addCard(listId, card){
  Trello.post("lists/"+listId + "/cards",
              {name: card.name, 
               due: null,
               desc: card.desc
             },
              function(c){
                if (card.comment){
                  Trello.post("cards/"+c.id + "/actions/comments",
                  {text: card.comment},
                  function(c){
                    console.log(c);
                  
                  //TODO: Add success notification
                  
                  });
                }   
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
            .appendTo($("<div>").text("Card name: ").appendTo(addContainer));
  descField = $("<input>")
            .attr("placeholder", "Card description")
            .appendTo($("<div>").text("Card description: ").appendTo(addContainer));
  siteComment = $("<input>")
                .attr("id", "siteComment")
                .attr("type", "checkbox")
                .text("Include current URL as comment")
                .appendTo($("<div>")
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
            .text("Cancel")
            .appendTo(addContainer);
}

function setUpBoards(boards){
  boardContainer = $("#boardContainer");
  boardContainer.empty();
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
