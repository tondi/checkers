/*
    Ui - Manage User Interface
*/
// TODO: DOM id's should be defined universal

function Ui(socket) {

    // Used to test camera position swap:

    //var x = new THREE.Vector3(10, 1, 10);
    //console.log(x)

    //var vect = new THREE.Vector3(game.tabPosition[0])
    //console.log(vect)

    // CAMERA POSIITON
    // document.getElementById("select").addEventListener("change", function (curr) {
    //     //game.setTest(12);
    //     //console.log(camera)
    //     var value = document.getElementById("select").value;

    //     // Dependence
    //     var camera = game.camera; 

    //     if (value === "one") {
    //         console.log([...game.tabPosition[1]])

    //         camera.position.set(...game.tabPosition[0])
    //         camera.lookAt(game.scene.position)

    //         //camera.lookAt(Game.scene.position)
    //     }
    //     if (value === "two") {

    //         console.log(game)
    //         camera.position.set(...game.tabPosition[1])
    //         camera.lookAt(game.scene.position)

    //     }
    //     //if(curr)
    //     //document.getElementById("select")
    // })
    window.addEventListener('resize', () => {
        game.camera.aspect = window.innerWidth / window.innerHeight;
        game.camera.updateProjectionMatrix();
        game.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false)

    document.getElementById("loginBt").addEventListener("click", function(curr) {
        var value = document.getElementById("user-name").value;

        var data = {
            akcja: "ADD_USER",
            user: value
        }
        net.sendData(data);

    })

    // document.getElementById("deleteBt").addEventListener("click", function (curr) {
    //     //var value = document.getElementById("user-name").value;
    //     //console.log(value)

    //     var data = {
    //         akcja: "USUN_UZYTKOWNIKOW",
    //         user: null
    //     }
    //     net.sendData(data);

    // })

    this.handleRes = function(obj) {

        var response;
        var responseAdditional;
        if (typeof obj.loginResponse === "object") { // I additional parameters come // Why object?
            response = obj.loginResponse[0];
            responseAdditional = obj.loginResponse[1];
        } else {
            response = obj.loginResponse;
        }


        var message = document.getElementById("message")
        message.innerHTML = response;

        if (response === "login") {
            if (responseAdditional === "one_waiting") {
                console.log("Czekam")
                document.getElementById("waitOverlay").className = "visible";
                document.getElementById("login").className = "hidden";

                let data = {};

                net.askServer()
                    //console.log(this)

                // gra bialymi
                // game.playerColor = "white";
                // CONST property // helped a lot
                Object.defineProperty(game, "playerColor", {
                    value: "white",
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
                // document.getElementById("info-content").innerHTML = game.playerColor // you are white
                this.viewInfo("Your pawns: " + game.playerColor + "<br/>" + "Use arrows to move camera", 5000)
                document.getElementById("info").className = "visible";
                console.log(game.playerColor)

                game.camera.position.set(...game.tabPosition[0])


            } else {
                socket.emit("user/connected", { akcja: "INTERVAL" });
                document.getElementById("login").className = "hidden";
                game.initPawns();
                // game.playerColor = "black";

                Object.defineProperty(game, "playerColor", {
                    value: "black",
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
                // document.getElementById("info-content").innerHTML = game.playerColor // you are white
                this.viewInfo("Your pawns: " + game.playerColor + "<br/>" + "Use arrows to move camera", 5000)
                document.getElementById("info").className = "visible";
                console.log(game.playerColor)

                game.camera.position.set(...game.tabPosition[1])


            }

        }
    }

    this.viewInfo = function(message, timeout = 2000) {
        document.getElementById("info-content").innerHTML = message;
        document.getElementById("info-content").className = "visible";
        setTimeout(() => {
            document.getElementById("info-content").innerHTML = "";
        }, timeout)
    }
}