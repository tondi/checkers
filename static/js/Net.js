// Public class net / See index.html
function Net(socket) {

  // LOGGING
  this.sendData = function(data) {

    $.ajax({
      url: "http://" + "85.255.10.27" + ":6020/",
      data: data,
      type: "POST",
      success: function(data) {
        //var br = document.createElement("br");
        //document.body.append(br)

        //var counter = document.getElementById("counter")
        //counter.innerHTML = data;
        console.log(data)

        net.recieveData(data)
      },
      error: function(xhr, status, error) {
        console.log('Error: ' + error.message);
      }
    });

  }

  this.recieveData = function(data) {
    var obj = JSON.parse(data)

    ui.handleRes(obj)

  }

  this.askServer = function() {
    socket.on("user/connected", (data) => {

      console.log(data)
        // var obj = JSON.parse(data);
        // console.log(obj)
        // if (obj.loginResponse.length == 2) {
        //     document.getElementById("waitOverlay").className = "hidden"
        // }


      document.getElementById("waitOverlay").className = "hidden";
      game.initPawns();

    })

  }

  // SYNC

  // emit on move
  this.sync = function(pawns) {
      var data = pawns;
      socket.emit("game/move", pawns);
    }
    // Listening at very begin
  socket.on("game/move", (newPawns) => {

    console.log("Refresh board")
    game.setPawns(newPawns);
    game.initPawns();

  })
  var flagReload = true;
  socket.on("user/disconnect", (newPawns) => {
    ui.viewInfo("Enemy player disconnected")
      // setTimeout(() => {
      //     if(flagReload){
      //         location.reload();  
      //         flagReload = false;
      //     }
      // }, 2500)    
  })
}
